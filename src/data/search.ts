import indexData from './search-index.json';

/**
 * The search index is generated at build time by
 * `scripts/build-search-index.mjs` from the tool catalog and the blog
 * frontmatter. It is committed as JSON and imported by the search components,
 * so searching never needs a runtime request.
 */

export type SearchScope = 'all' | 'tools' | 'articles';

export type SearchEntry = {
  type: 'tool' | 'article';
  title: string;
  description: string;
  url: string;
  categoryLabel: string;
  tags: string[];
  date?: string;
};

export const searchEntries: SearchEntry[] = [
  ...indexData.tools.map((tool) => ({
    type: 'tool' as const,
    title: tool.title,
    description: tool.description,
    url: tool.url,
    categoryLabel: tool.categoryLabel,
    tags: [] as string[],
  })),
  ...indexData.articles.map((article) => ({
    type: 'article' as const,
    title: article.title,
    description: article.description,
    url: article.url,
    categoryLabel: article.categoryLabel,
    tags: article.tags,
    date: article.date,
  })),
];

const SCORE_TITLE_EXACT = 100;
const SCORE_TITLE_PREFIX = 60;
const SCORE_TITLE_CONTAINS = 40;
const SCORE_META_CONTAINS = 20;
const SCORE_DESCRIPTION_CONTAINS = 10;

export function normalizeSearchText(value: string): string {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim();
}

export function tokenizeSearchQuery(query: string): string[] {
  return normalizeSearchText(query).split(' ').filter(Boolean);
}

function scoreEntry(entry: SearchEntry, tokens: string[]): number {
  const title = normalizeSearchText(entry.title);
  const description = normalizeSearchText(entry.description);
  const meta = normalizeSearchText(
    [entry.categoryLabel, ...entry.tags].join(' '),
  );

  let score = 0;

  for (const token of tokens) {
    let tokenScore = 0;

    if (title === token) {
      tokenScore = SCORE_TITLE_EXACT;
    } else if (title.startsWith(token)) {
      tokenScore = SCORE_TITLE_PREFIX;
    } else if (title.includes(token)) {
      tokenScore = SCORE_TITLE_CONTAINS;
    } else if (meta.includes(token)) {
      tokenScore = SCORE_META_CONTAINS;
    } else if (description.includes(token)) {
      tokenScore = SCORE_DESCRIPTION_CONTAINS;
    }

    if (tokenScore === 0) {
      return 0;
    }

    score += tokenScore;
  }

  return score;
}

function scopeMatches(entry: SearchEntry, scope: SearchScope): boolean {
  if (scope === 'all') {
    return true;
  }
  if (scope === 'tools') {
    return entry.type === 'tool';
  }
  return entry.type === 'article';
}

/**
 * Searches the index. Every token of the query has to match, and a title
 * match outranks a tag or description match.
 */
export function searchSite(
  query: string,
  scope: SearchScope = 'all',
  limit = 10,
): SearchEntry[] {
  const tokens = tokenizeSearchQuery(query);
  if (tokens.length === 0) {
    return [];
  }

  return searchEntries
    .filter((entry) => scopeMatches(entry, scope))
    .map((entry) => ({entry, score: scoreEntry(entry, tokens)}))
    .filter((item) => item.score > 0)
    .sort(
      (a, b) =>
        b.score - a.score || a.entry.title.localeCompare(b.entry.title),
    )
    .slice(0, limit)
    .map((item) => item.entry);
}

export const SEARCH_SCOPES: {value: SearchScope; label: string}[] = [
  {value: 'all', label: 'Everything'},
  {value: 'tools', label: 'Tools'},
  {value: 'articles', label: 'Articles'},
];
