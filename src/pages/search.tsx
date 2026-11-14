import Link from '@docusaurus/Link';
import Layout from '@theme/Layout';
import {Search} from 'lucide-react';
import {useEffect, useState, type FormEvent, type ReactNode} from 'react';
import {SearchResults, useSearchResults} from '../components/search';
import {
  SEARCH_SCOPES,
  type SearchScope,
} from '../data/search';
import styles from './search.module.css';

const RESULT_LIMIT = 50;
const SEARCH_DESCRIPTION =
  'Search every sports tool, calculator and blog article on Sports Tools Hub.';

function readScope(): SearchScope {
  if (typeof window === 'undefined') {
    return 'all';
  }
  const scope = new URLSearchParams(window.location.search).get('scope');
  return scope === 'tools' || scope === 'articles' ? scope : 'all';
}

function readQuery(): string {
  if (typeof window === 'undefined') {
    return '';
  }
  return new URLSearchParams(window.location.search).get('q') ?? '';
}

export default function SearchPage(): ReactNode {
  const [query, setQuery] = useState('');
  const [scope, setScope] = useState<SearchScope>('all');

  // The query and the scope arrive in the URL so that a search can be shared.
  // They are read after mount because the static build cannot know them.
  useEffect(() => {
    setQuery(readQuery());
    setScope(readScope());
  }, []);

  const results = useSearchResults(query, scope, RESULT_LIMIT);

  function handleSubmit(event: FormEvent<HTMLFormElement>): void {
    event.preventDefault();
  }

  return (
    <Layout title="Search" description={SEARCH_DESCRIPTION}>
      <main className={styles.page}>
        <div className={styles.container}>
          <h1 className={styles.title}>Search Sports Tools Hub</h1>
          <p className={styles.subtitle}>
            Look through every calculator and every article in the blog.
          </p>

          <form className={styles.searchForm} role="search" onSubmit={handleSubmit}>
            <div className={styles.searchBox}>
              <input
                className={styles.searchInput}
                id="site-search"
                type="search"
                placeholder="Search tools, calculators, and articles..."
                aria-label="Search tools and articles"
                autoComplete="off"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
              />
              <button
                className={styles.searchButton}
                type="submit"
                aria-label="Search"
              >
                <Search aria-hidden="true" focusable="false" />
              </button>
            </div>
          </form>

          <div className={styles.scopes} role="group" aria-label="Search scope">
            {SEARCH_SCOPES.map((option) => (
              <button
                key={option.value}
                type="button"
                className={styles.scope}
                aria-pressed={scope === option.value}
                onClick={() => setScope(option.value)}
              >
                {option.label}
              </button>
            ))}
          </div>

          <p className={styles.count} role="status">
            {query.trim().length === 0
              ? 'Type to search the catalog and the blog.'
              : `${results.length} result${results.length === 1 ? '' : 's'}`}
          </p>

          <SearchResults
            results={results}
            emptyMessage={`Nothing matches "${query.trim()}". Try a different term, or browse the tools by category.`}
          />

          <p className={styles.fallback}>
            Looking for a specific calculator?{' '}
            <Link to="/#tools">Browse all tools by category</Link>.
          </p>
        </div>
      </main>
    </Layout>
  );
}
