#!/usr/bin/env node
/**
 * Builds the search index from the tool catalog and the blog frontmatter.
 *
 * The index is committed as `src/data/search-index.json` so that the search
 * components can import it: the search then needs no runtime request at all.
 * `src/data/search.test.ts` regenerates it and fails when the committed file
 * has drifted from the catalog or the blog.
 *
 * Usage: node scripts/build-search-index.mjs
 */
import {readdirSync, readFileSync, writeFileSync} from 'node:fs';
import {fileURLToPath} from 'node:url';
import {join, resolve} from 'node:path';

const cwd = process.cwd();
const BLOG_DIR = join(cwd, 'blog');
const INDEX_PATH = join(cwd, 'src', 'data', 'search-index.json');

/**
 * Reads the frontmatter of a converted blog post. The converter writes a
 * simple, machine generated frontmatter, so a line based parser is enough.
 */
export function parseFrontmatter(source) {
  const match = /^---\r?\n([\s\S]*?)\r?\n---/.exec(source);
  if (!match) {
    return null;
  }

  const data = {};
  for (const line of match[1].split(/\r?\n/)) {
    const entry = /^([a-zA-Z_][a-zA-Z0-9_]*):\s*(.*)$/.exec(line);
    if (!entry) {
      continue;
    }

    const [, key, rawValue] = entry;
    const value = rawValue.trim();
    if (value.startsWith('[') || value.startsWith('"')) {
      data[key] = JSON.parse(value);
    } else {
      data[key] = value;
    }
  }

  return data;
}

/**
 * The blog tag labels, so that a search result can show "Basketball" instead
 * of the tag key "basketball".
 */
export function readTagLabels() {
  const source = readFileSync(join(cwd, 'blog', 'tags.yml'), 'utf8');
  const labels = {};

  for (const match of source.matchAll(/^([a-z0-9-]+):\s*\n\s+label:\s*"([^"]+)"/gm)) {
    labels[match[1]] = match[2];
  }

  return labels;
}

function readArticles() {
  const articles = [];
  const tagLabels = readTagLabels();

  const walk = (directory) => {
    for (const entry of readdirSync(directory, {withFileTypes: true})) {
      const path = join(directory, entry.name);
      if (entry.isDirectory()) {
        walk(path);
        continue;
      }
      if (!entry.name.endsWith('.mdx')) {
        continue;
      }

      const frontmatter = parseFrontmatter(readFileSync(path, 'utf8'));
      if (!frontmatter?.title || !frontmatter?.slug) {
        throw new Error(`Blog post without usable frontmatter: ${path}`);
      }

      const tags = Array.isArray(frontmatter.tags) ? frontmatter.tags : [];

      articles.push({
        title: frontmatter.title,
        description: frontmatter.description ?? '',
        url: `/blog/${frontmatter.slug}`,
        categoryLabel: tagLabels[tags[0]] ?? tags[0] ?? 'Article',
        tags,
        date: frontmatter.date ?? '',
      });
    }
  };

  walk(BLOG_DIR);

  return articles.sort((a, b) => a.url.localeCompare(b.url));
}

export async function buildSearchIndex() {
  const {tools, TOOL_CATEGORY_LABELS} = await import('../src/data/tools.ts');

  return {
    tools: tools.map((tool) => ({
      title: tool.title,
      description: tool.description,
      url: `/tools/${tool.slug}`,
      category: tool.category,
      categoryLabel: TOOL_CATEGORY_LABELS[tool.category],
    })),
    articles: readArticles(),
  };
}

/**
 * One entry per line keeps the committed index reviewable in a diff.
 */
export function serializeSearchIndex(index) {
  const sections = [];

  const section = (name, entries, fields) => {
    const lines = [`  "${name}": [`];
    for (const [position, entry] of entries.entries()) {
      const parts = fields.map(
        (field) => `${JSON.stringify(field)}: ${JSON.stringify(entry[field])}`,
      );
      const comma = position === entries.length - 1 ? '' : ',';
      lines.push(`    {${parts.join(', ')}}${comma}`);
    }
    lines.push('  ]');
    sections.push(lines.join('\n'));
  };

  section('tools', index.tools, ['title', 'description', 'url', 'category', 'categoryLabel']);
  section('articles', index.articles, ['title', 'description', 'url', 'categoryLabel', 'tags', 'date']);

  return `{\n${sections.join(',\n')}\n}\n`;
}

async function main() {
  const index = await buildSearchIndex();
  writeFileSync(INDEX_PATH, serializeSearchIndex(index), 'utf8');

  console.log(
    `[search-index] ${index.tools.length} tools, ${index.articles.length} articles -> ${resolve(INDEX_PATH)}`,
  );
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  await main();
}
