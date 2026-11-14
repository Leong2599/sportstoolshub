#!/usr/bin/env node
/**
 * Reviews converted blog posts for conversion artifacts.
 *
 * This is the ST-15 review checklist, automated. It checks the mechanical
 * invariants that a human reviewer would otherwise have to verify by eye on
 * every post: frontmatter shape, heading order, list and table structure,
 * leftover HTML, MDX-hostile characters, encoding damage, empty sections,
 * and link targets that do not exist.
 *
 * Usage:
 *   node scripts/review-blog.mjs [--dir=blog]
 *
 * Exits non-zero when an artifact is found, so it can gate the batch.
 */

import {existsSync, readFileSync, readdirSync, statSync} from 'node:fs';
import {join, posix} from 'node:path';
import {browserHeadingLevels, sourceBody} from './compare-headings.mjs';

const FRONTMATTER_KEYS = [
  'title',
  'description',
  'date',
  'slug',
  'tags',
  'authors',
];

/**
 * Reports whether the source itself has a heading with no content, so a
 * source quirk is not reported as a conversion artifact.
 */
export function sourceHasEmptyHeading(sourceHtml, headingText) {
  if (!sourceHtml || !headingText) {
    return false;
  }

  const escaped = headingText.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const pattern = new RegExp(
    `<h[1-6][^>]*>${escaped}</h[1-6]>\\s*(?:<[^>]+>\\s*)*<h[1-6][^>]*>`,
    'i',
  );

  return pattern.test(sourceHtml);
}

function listPosts(blogDir) {
  const posts = [];

  for (const sport of readdirSync(blogDir)) {
    const sportDir = join(blogDir, sport);

    if (!statSync(sportDir).isDirectory()) {
      continue;
    }

    for (const file of readdirSync(sportDir)) {
      if (file.endsWith('.mdx')) {
        posts.push(join(sportDir, file));
      }
    }
  }

  return posts.sort();
}

/**
 * Maps a converted post back to its source file, so the review can tell a
 * conversion artifact apart from a quirk the source already has.
 */
function sourcePathFor(file, blogDir) {
  const relative = file.slice(blogDir.length + 1);
  return relative.replace(/\.mdx$/, '.html');
}

function parseFrontMatter(text) {
  const match = /^---\n([\s\S]*?)\n---\n?/.exec(text);

  if (!match) {
    return null;
  }

  return {raw: match[1], body: text.slice(match[0].length)};
}

function checkPost(file, blogDir, allRoutes, sourceBlog) {
  const problems = [];
  const text = readFileSync(file, 'utf8');
  const parsed = parseFrontMatter(text);

  if (!parsed) {
    problems.push('missing frontmatter');
    return problems;
  }

  const {raw, body} = parsed;

  for (const key of FRONTMATTER_KEYS) {
    if (!new RegExp(`^${key}:`, 'm').test(raw)) {
      problems.push(`frontmatter is missing "${key}"`);
    }
  }

  const title = /^title: "(.*)"$/m.exec(raw)?.[1];
  const description = /^description: "(.*)"$/m.exec(raw)?.[1];
  const date = /^date: (\S+)$/m.exec(raw)?.[1];
  const slug = /^slug: "(.*)"$/m.exec(raw)?.[1];
  const tags = /^tags: \[(.*)\]$/m.exec(raw)?.[1];
  const authors = /^authors: \[(.*)\]$/m.exec(raw)?.[1];

  if (!title) {
    problems.push('title is empty');
  }

  if (!description) {
    problems.push('description is empty');
  }

  if (!date || !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    problems.push(`date is not an ISO calendar date: ${date}`);
  }

  if (!slug) {
    problems.push('slug is empty');
  } else if (!/^[a-z0-9-]+\/[a-z0-9-]+$/.test(slug)) {
    problems.push(`slug is not "<sport>/<slug>": ${slug}`);
  }

  if (!tags || !tags.trim()) {
    problems.push('tags are empty');
  }

  if (!authors || !authors.includes('sports-tools-hub')) {
    problems.push(`authors is wrong: ${authors}`);
  }

  // A heading level jump is only an artifact when the source does not have it.
  // The source skips levels in a few posts, and the port reproduces the
  // browser's rendering of that markup.
  const sourceHtml = sourceBlog
    ? readFileSync(
        join(sourceBlog, sourcePathFor(file, blogDir)),
        'utf8',
      )
    : null;
  const sourceLevels = sourceHtml
    ? browserHeadingLevels(sourceBody(sourceHtml))
    : null;
  const sourceBodyHtml = sourceHtml ? sourceBody(sourceHtml) : null;

  // Body structure.
  const lines = body.split('\n');
  let inFence = false;
  let previousHeading = 0;
  let listMarker = null;
  let inList = false;

  for (const [index, line] of lines.entries()) {
    const lineNumber = index + 1;

    if (line.startsWith('```')) {
      inFence = !inFence;
      continue;
    }

    if (inFence) {
      continue;
    }

    const heading = /^(#{1,6})\s+(.*)$/.exec(line);

    if (heading) {
      const level = heading[1].length;

      if (previousHeading === 0 && level !== 2) {
        problems.push(
          `line ${lineNumber}: first heading is h${level}, expected h2`,
        );
      } else if (previousHeading && level > previousHeading + 1) {
        const sourceHasJump = sourceLevels
          ? sourceLevels.some(
              (sourceLevel, index) =>
                index > 0 &&
                Number(sourceLevel[1]) === level &&
                Number(sourceLevels[index - 1][1]) === previousHeading,
            )
          : false;

        if (!sourceHasJump) {
          problems.push(
            `line ${lineNumber}: heading jumps from h${previousHeading} to h${level}`,
          );
        }
      }
      previousHeading = level;
      inList = false;
      listMarker = null;
      continue;
    }

    if (/^\s*<[a-zA-Z/]/.test(line)) {
      problems.push(`line ${lineNumber}: leftover HTML: ${line.slice(0, 60)}`);
    } else if (/<[a-zA-Z][a-zA-Z0-9]*[\s/>]/.test(line)) {
      problems.push(
        `line ${lineNumber}: inline HTML in text: ${line.slice(0, 60)}`,
      );
    }

    if (line.includes('�')) {
      problems.push(`line ${lineNumber}: replacement character (encoding damage)`);
    }

    if (/\{\s*\/\*\s*truncate\s*\*\/\s*\}/.test(line)) {
      continue;
    }

    const unordered = /^(\s*)- /.exec(line);
    const ordered = /^(\s*)\d+\. /.exec(line);

    if (unordered || ordered) {
      const marker = unordered ? '- ' : '1. ';

      if (inList && marker !== listMarker) {
        problems.push(
          `line ${lineNumber}: list marker changed from "${listMarker}" to "${marker}"`,
        );
      }

      listMarker = marker;
      inList = true;
      continue;
    }

    if (line.trim() === '') {
      continue;
    }

    if (inList && !/^\s{2,}\S/.test(line)) {
      inList = false;
      listMarker = null;
    }
  }

  // Tables: every row must have the same cell count as the header.
  const tables = [];
  let current = null;

  for (const line of lines) {
    if (line.startsWith('|')) {
      if (!current) {
        current = [];
      }

      current.push(line);
      continue;
    }

    if (current) {
      tables.push(current);
      current = null;
    }
  }

  if (current) {
    tables.push(current);
  }

  for (const block of tables) {
    const cells = block.map((row) => row.split('|').length - 2);
    const width = cells[0];

    if (cells.some((count) => count !== width)) {
      problems.push(`table has ragged rows: ${cells.join(', ')}`);
    }

    if (!/^\|(\s*---\s*\|)+$/.test(block[1] ?? '')) {
      problems.push('table is missing its separator row');
    }
  }

  // Empty sections: a heading with no content and no subsections before the
  // next heading. A heading immediately followed by a deeper heading is a
  // parent heading with child subsections, which the source uses often.
  for (const [index, line] of lines.entries()) {
    const heading = /^(#{1,6})\s+(.*)$/.exec(line);

    if (!heading) {
      continue;
    }

    const level = heading[1].length;
    let next = index + 1;

    while (next < lines.length && lines[next].trim() === '') {
      next += 1;
    }

    const following = /^(#{1,6})\s+/.exec(lines[next] ?? '');

    if (!following) {
      continue;
    }

    const followingLevel = following[0].trim().split(' ')[0].length;

    if (
      followingLevel <= level &&
      !sourceHasEmptyHeading(sourceBodyHtml, heading[2].trim())
    ) {
      problems.push(
        `line ${index + 1}: heading "${line.trim()}" has no content`,
      );
    }
  }

  // Link targets must exist on the site.
  for (const match of body.matchAll(/\]\((\/[^)]*)\)/g)) {
    const target = match[1];

    if (target.startsWith('/blog/')) {
      if (!allRoutes.has(target)) {
        problems.push(`link target does not exist: ${target}`);
      }

      continue;
    }

    if (target.startsWith('/tools/') || target.startsWith('/blog/tags/')) {
      if (!allRoutes.has(target)) {
        problems.push(`link target does not exist: ${target}`);
      }
    }
  }

  return problems;
}
function main(argv) {
  let blogDir = 'blog';
  let source = process.env.SPORT_TOOLS_SOURCE ?? null;

  for (const arg of argv) {
    if (arg.startsWith('--dir=')) {
      blogDir = arg.slice('--dir='.length);
    } else if (arg.startsWith('--source=')) {
      source = arg.slice('--source='.length);
    }
  }

  if (!existsSync(blogDir)) {
    console.error(`No blog directory at ${blogDir}`);
    process.exit(1);
  }

  const sourceBlog = source ? join(source, 'blog') : null;

  if (sourceBlog && !existsSync(sourceBlog)) {
    console.error(`No source blog directory at ${sourceBlog}`);
    process.exit(1);
  }

  const posts = listPosts(blogDir);
  const routes = new Set();

  for (const sport of readdirSync(blogDir)) {
    const sportDir = join(blogDir, sport);

    if (!statSync(sportDir).isDirectory()) {
      continue;
    }

    routes.add(`/blog/${sport}`);

    for (const file of readdirSync(sportDir)) {
      if (file.endsWith('.mdx')) {
        routes.add(`/blog/${sport}/${file.replace(/\.mdx$/, '')}`);
      }
    }
  }

  // Tool pages live in `src/pages/tools`, so their routes come from the
  // catalog rather than the blog directory.
  const toolsFile = join(blogDir, '..', 'src', 'data', 'tools.ts');

  if (existsSync(toolsFile)) {
    const catalog = readFileSync(toolsFile, 'utf8');

    for (const match of catalog.matchAll(/\{slug: '([^']+)'/g)) {
      routes.add(`/tools/${match[1]}`);
    }
  }

  let total = 0;

  for (const file of posts) {
    const problems = checkPost(file, blogDir, routes, sourceBlog);

    if (problems.length > 0) {
      total += problems.length;
      console.log(`${posix.normalize(file)}`);
      for (const problem of problems) {
        console.log(`  - ${problem}`);
      }
    }
  }

  console.log(
    `Reviewed ${posts.length} post(s); ${total} artifact(s) found.`,
  );

  if (total > 0) {
    process.exitCode = 1;
  }
}

if (
  process.argv[1] &&
  import.meta.url.endsWith(process.argv[1].replace(/\\/g, '/'))
) {
  main(process.argv.slice(2));
}
