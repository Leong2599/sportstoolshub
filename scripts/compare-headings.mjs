#!/usr/bin/env node
/**
 * Compares the heading structure of the converted posts with the heading
 * structure a browser produces from the source HTML.
 *
 * The source has malformed markup - headings closed with the wrong tag, and
 * headings that skip a level. The converter reproduces what a browser does
 * with that markup, so the port and the live site agree. This script proves
 * that agreement, and separates "the source does this" from "the converter
 * did this".
 *
 * Usage:
 *   node scripts/compare-headings.mjs --source=<sport_tools path> [--dir=blog]
 */

import {existsSync, readFileSync, readdirSync, statSync} from 'node:fs';
import {join, posix} from 'node:path';

const VOID_ELEMENTS = new Set([
  'area',
  'base',
  'br',
  'col',
  'embed',
  'hr',
  'img',
  'input',
  'link',
  'meta',
  'param',
  'source',
  'track',
  'wbr',
]);

/**
 * Returns the heading levels a browser produces for a body fragment.
 *
 * A heading end tag closes the currently open heading whatever level it
 * names, which is the HTML5 rule the converter implements.
 */
export function browserHeadingLevels(html) {
  const levels = [];
  const stack = [];

  for (const match of html.matchAll(
    /<(\/?)([a-zA-Z][a-zA-Z0-9]*)((?:"[^"]*"|'[^']*'|[^"'>])*?)(\/?)>/g,
  )) {
    const [, closing, name, , selfClosing] = match;
    const tag = name.toLowerCase();

    if (closing) {
      const index = stack.lastIndexOf(tag);

      if (index >= 0) {
        stack.length = index;
      }

      continue;
    }

    if (selfClosing || VOID_ELEMENTS.has(tag)) {
      continue;
    }

    if (/^h[1-6]$/.test(tag)) {
      levels.push(tag);
    }

    stack.push(tag);
  }

  return levels;
}

/** Returns the heading levels of a converted MDX body. */
export function mdxHeadingLevels(body) {
  return body
    .split('\n')
    .filter((line) => /^#{1,6}\s+/.test(line))
    // "## Read Next" and "## Related Tools" are added by the converter from
    // the source footer and the related-tool map; neither is part of the
    // source body, so they are excluded from the comparison.
    .filter((line) => !/^#{1,6}\s+(Read Next|Related Tools)\s*$/.test(line))
    .map((line) => `h${line.match(/^#+/)[0].length}`);
}

export function sourceBody(html) {
  const match = /<(\w+)[^>]*class="blog-content">/.exec(html);

  if (!match) {
    return '';
  }

  const tag = match[1];
  const start = html.indexOf(match[0]) + match[0].length;
  const closeTag = `</${tag}>`;
  let depth = 1;
  let index = start;

  while (index < html.length && depth > 0) {
    const nextOpen = html.indexOf(`<${tag}`, index);
    const nextClose = html.indexOf(closeTag, index);

    if (nextClose === -1) {
      break;
    }

    if (nextOpen !== -1 && nextOpen < nextClose) {
      depth += 1;
      index = nextOpen + tag.length + 1;
    } else {
      depth -= 1;
      index = nextClose + closeTag.length;
    }
  }

  return html.slice(start, index - closeTag.length);
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
        posts.push({sport, file});
      }
    }
  }

  return posts;
}

function main(argv) {
  let source = null;
  let blogDir = 'blog';

  for (const arg of argv) {
    if (arg.startsWith('--source=')) {
      source = arg.slice('--source='.length);
    } else if (arg.startsWith('--dir=')) {
      blogDir = arg.slice('--dir='.length);
    }
  }

  if (!source || !existsSync(source)) {
    console.error('Usage: node scripts/compare-headings.mjs --source=<sport_tools path>');
    process.exit(1);
  }

  const sourceBlog = join(source, 'blog');
  let compared = 0;
  let mismatched = 0;
  const sourceJumps = [];

  for (const {sport, file} of listPosts(blogDir)) {
    const sourceFile = join(sourceBlog, sport, file.replace(/\.mdx$/, '.html'));

    if (!existsSync(sourceFile)) {
      continue;
    }

    const sourceHtml = readFileSync(sourceFile, 'utf8');
    const expected = browserHeadingLevels(sourceBody(sourceHtml));
    const mdx = readFileSync(join(blogDir, sport, file), 'utf8');
    const body = mdx.replace(/^---\n[\s\S]*?\n---\n?/, '');
    const actual = mdxHeadingLevels(body);

    compared += 1;

    if (expected.join(',') !== actual.join(',')) {
      mismatched += 1;
      console.log(`${sport}/${file}`);
      console.log(`  source: ${expected.join(' ')}`);
      console.log(`  port  : ${actual.join(' ')}`);
      continue;
    }

    for (let index = 1; index < expected.length; index += 1) {
      const previous = Number(expected[index - 1][1]);
      const level = Number(expected[index][1]);

      if (level > previous + 1) {
        sourceJumps.push(`${sport}/${file}: h${previous} -> h${level}`);
      }
    }
  }

  console.log(`Compared ${compared} post(s); ${mismatched} heading mismatch(es).`);

  if (sourceJumps.length > 0) {
    console.log(
      `${sourceJumps.length} heading level jump(s) reproduced from the source:`,
    );
    for (const jump of sourceJumps) {
      console.log(`  ${jump}`);
    }
  }

  if (mismatched > 0) {
    process.exit(1);
  }
}

if (
  process.argv[1] &&
  import.meta.url.endsWith(process.argv[1].replace(/\\/g, '/'))
) {
  main(process.argv.slice(2));
}
