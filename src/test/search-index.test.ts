import {readdirSync, readFileSync} from 'node:fs';
import {fileURLToPath} from 'node:url';
import {join} from 'node:path';
import {describe, expect, it} from 'vitest';
import {
  buildSearchIndex,
  serializeSearchIndex,
} from '../../scripts/build-search-index.mjs';

const indexPath = fileURLToPath(
  new URL('../data/search-index.json', import.meta.url),
);

const blogDir = fileURLToPath(new URL('../../blog/', import.meta.url));

function countBlogPosts(): number {
  let total = 0;
  for (const sport of readdirSync(blogDir, {withFileTypes: true})) {
    if (!sport.isDirectory()) {
      continue;
    }
    total += readdirSync(join(blogDir, sport.name)).filter((file) =>
      file.endsWith('.mdx'),
    ).length;
  }
  return total;
}

describe('committed search index', () => {
  it('is in sync with the tool catalog and the blog', async () => {
    const fresh = await buildSearchIndex();

    expect(readFileSync(indexPath, 'utf8')).toBe(serializeSearchIndex(fresh));
  });

  it('holds every tool and every blog post', async () => {
    const index = await buildSearchIndex();

    expect(index.tools).toHaveLength(41);
    expect(index.articles).toHaveLength(countBlogPosts());
    expect(index.tools.map((tool) => tool.url)).toContain(
      '/tools/bmi-calculator',
    );
    expect(index.articles[0]?.url).toMatch(/^\/blog\/[a-z0-9-]+\//);
  });
});
