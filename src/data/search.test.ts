import {existsSync, readdirSync} from 'node:fs';
import {fileURLToPath} from 'node:url';
import {join} from 'node:path';
import {describe, expect, it} from 'vitest';
import {
  normalizeSearchText,
  SEARCH_SCOPES,
  searchEntries,
  searchSite,
  tokenizeSearchQuery,
} from './search';
import {tools} from './tools';

const toolsDir = fileURLToPath(new URL('../pages/tools/', import.meta.url));
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

describe('search index', () => {
  it('covers every tool and every blog post exactly once', () => {
    const toolEntries = searchEntries.filter((entry) => entry.type === 'tool');
    const articleEntries = searchEntries.filter(
      (entry) => entry.type === 'article',
    );
    const articles = countBlogPosts();

    expect(toolEntries).toHaveLength(41);
    expect(articleEntries).toHaveLength(articles);
    expect(searchEntries).toHaveLength(41 + articles);

    expect(new Set(toolEntries.map((entry) => entry.url)).size).toBe(41);
    expect(new Set(articleEntries.map((entry) => entry.url)).size).toBe(articles);
  });

  it('carries the catalog title, description and category for every tool', () => {
    for (const tool of tools) {
      const entry = searchEntries.find(
        (candidate) => candidate.url === `/tools/${tool.slug}`,
      );

      expect(entry).toBeDefined();
      expect(entry?.type).toBe('tool');
      expect(entry?.title).toBe(tool.title);
      expect(entry?.description).toBe(tool.description);
      expect(entry?.categoryLabel).toBeTruthy();
    }
  });

  it('points at routes that exist', () => {
    for (const entry of searchEntries) {
      if (entry.type === 'tool') {
        const slug = entry.url.replace('/tools/', '');
        expect(existsSync(`${toolsDir}${slug}.mdx`)).toBe(true);
      } else {
        const slug = entry.url.replace('/blog/', '');
        expect(existsSync(`${blogDir}${slug}.mdx`)).toBe(true);
      }
    }
  });

  it('normalises the query text', () => {
    expect(normalizeSearchText('Swim Pace!')).toBe('swim pace');
    expect(tokenizeSearchQuery('  Swim   Pace ')).toEqual(['swim', 'pace']);
    expect(tokenizeSearchQuery('   ')).toEqual([]);
  });

  it('returns nothing for an empty query', () => {
    expect(searchSite('')).toEqual([]);
    expect(searchSite('   ')).toEqual([]);
  });

  it('finds a tool by its title', () => {
    const results = searchSite('bmi calculator');

    expect(results[0]?.title).toBe('BMI Calculator');
    expect(results[0]?.url).toBe('/tools/bmi-calculator');
    expect(results[0]?.type).toBe('tool');
  });

  it('finds a tool by its description', () => {
    const results = searchSite('body mass index');

    expect(results.map((entry) => entry.title)).toContain('BMI Calculator');
  });

  it('finds an article by its title', () => {
    const results = searchSite('essential basketball drills');

    expect(results[0]?.type).toBe('article');
    expect(results[0]?.title).toContain('Basketball Drills');
    expect(results[0]?.url).toMatch(/^\/blog\/basketball\//);
  });

  it('ranks a title match above a description match', () => {
    const results = searchSite('calculator');

    expect(results[0]?.type).toBe('tool');
    expect(results[0]?.title).toContain('Calculator');
  });

  it('requires every token of the query to match', () => {
    expect(searchSite('bmi calculator')).not.toEqual([]);
    expect(searchSite('bmi unicorn')).toEqual([]);
  });

  it('scopes the results to tools, articles or everything', () => {
    const all = searchSite('swimming', 'all', 100);
    const onlyTools = searchSite('swimming', 'tools', 100);
    const onlyArticles = searchSite('swimming', 'articles', 100);

    expect(all.some((entry) => entry.type === 'tool')).toBe(true);
    expect(all.some((entry) => entry.type === 'article')).toBe(true);

    expect(onlyTools.length).toBeGreaterThan(0);
    expect(onlyTools.every((entry) => entry.type === 'tool')).toBe(true);

    expect(onlyArticles.length).toBeGreaterThan(0);
    expect(onlyArticles.every((entry) => entry.type === 'article')).toBe(true);

    expect(onlyTools.length + onlyArticles.length).toBe(all.length);
  });

  it('limits the number of results', () => {
    expect(searchSite('calculator', 'all', 3)).toHaveLength(3);
  });

  it('offers the three scopes', () => {
    expect(SEARCH_SCOPES.map((scope) => scope.value)).toEqual([
      'all',
      'tools',
      'articles',
    ]);
  });
});
