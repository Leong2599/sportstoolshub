import Link from '@docusaurus/Link';
import {Search} from 'lucide-react';
import {useState, type FormEvent, type ReactNode} from 'react';
import {SearchResults} from '../search';
import {useSearchResults} from '../search/useSearchResults';
import styles from './HomeHero.module.css';

const RESULT_LIMIT = 8;

export function HomeHero(): ReactNode {
  const [query, setQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);

  const trimmed = query.trim();
  const results = useSearchResults(trimmed, 'tools', RESULT_LIMIT);
  const isOpen = isFocused && trimmed.length > 0;

  function handleSubmit(event: FormEvent<HTMLFormElement>): void {
    // The results appear while typing; submitting only keeps the form from
    // reloading the page.
    event.preventDefault();
  }

  return (
    <section className={styles.hero} aria-labelledby="hero-title">
      <div className={styles.container}>
        <h1 className={styles.title} id="hero-title">
          Comprehensive Sports Tools &amp; Resources
        </h1>
        <p className={styles.subtitle}>
          Discover comprehensive tools, calculators, and expert insights to
          optimize your athletic performance and fitness journey
        </p>

        <form className={styles.search} role="search" onSubmit={handleSubmit}>
          <div className={styles.searchBox}>
            <input
              className={styles.searchInput}
              id="tool-search"
              type="search"
              placeholder="Search for tools, calculators, or sports activities..."
              aria-label="Search sports tools"
              aria-controls="tool-search-results"
              autoComplete="off"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
            />
            <button
              className={styles.searchButton}
              type="submit"
              aria-label="Search"
            >
              <Search aria-hidden="true" focusable="false" />
            </button>
          </div>

          {isOpen ? (
            <div
              className={styles.results}
              id="tool-search-results"
              aria-live="polite"
            >
              <div className={styles.resultsHeader}>
                <span className={styles.resultsCount}>
                  {results.length === 0
                    ? 'No matching tools'
                    : `${results.length} tool${results.length === 1 ? '' : 's'}`}
                </span>
                <button
                  className={styles.clearButton}
                  type="button"
                  onClick={() => setQuery('')}
                >
                  Clear
                </button>
              </div>
              <SearchResults
                results={results}
                emptyMessage={`No tools match "${trimmed}". Try a different term, or search the whole site.`}
              />
              <Link className={styles.searchAll} to="/search">
                Search tools and articles
              </Link>
            </div>
          ) : null}
        </form>

        <div className={styles.cta}>
          <a className="sth-btn sth-btn-primary" href="#tools">
            Explore Tools
          </a>
        </div>
      </div>
    </section>
  );
}
