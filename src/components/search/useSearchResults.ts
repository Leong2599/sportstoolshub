import {useMemo} from 'react';
import {
  searchSite,
  type SearchEntry,
  type SearchScope,
} from '../../data/search';

/**
 * The results for a query, scoped to tools, articles or everything. The index
 * is bundled with the page, so no request is made while typing.
 */
export function useSearchResults(
  query: string,
  scope: SearchScope = 'all',
  limit = 10,
): SearchEntry[] {
  return useMemo(
    () => searchSite(query, scope, limit),
    [query, scope, limit],
  );
}
