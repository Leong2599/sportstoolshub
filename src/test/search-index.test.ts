import {readFileSync} from 'node:fs';
import {fileURLToPath} from 'node:url';
import {describe, expect, it} from 'vitest';
import {
  buildSearchIndex,
  serializeSearchIndex,
} from '../../scripts/build-search-index.mjs';

const indexPath = fileURLToPath(
  new URL('../data/search-index.json', import.meta.url),
);

describe('committed search index', () => {
  it('is in sync with the tool catalog and the blog', async () => {
    const fresh = await buildSearchIndex();

    expect(readFileSync(indexPath, 'utf8')).toBe(serializeSearchIndex(fresh));
  });

  it('holds every tool and every blog post', async () => {
    const index = await buildSearchIndex();

    expect(index.tools).toHaveLength(41);
    expect(index.articles).toHaveLength(214);
    expect(index.tools.map((tool) => tool.url)).toContain(
      '/tools/bmi-calculator',
    );
    expect(index.articles[0]?.url).toMatch(/^\/blog\/[a-z0-9-]+\//);
  });
});
