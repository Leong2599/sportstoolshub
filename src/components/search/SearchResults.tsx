import Link from '@docusaurus/Link';
import type {ReactNode} from 'react';
import type {SearchEntry} from '../../data/search';
import styles from './SearchResults.module.css';

export type SearchResultsProps = {
  results: SearchEntry[];
  emptyMessage: string;
};

/**
 * The result list, shared by the home hero dropdown and the search page.
 */
export function SearchResults({
  results,
  emptyMessage,
}: SearchResultsProps): ReactNode {
  if (results.length === 0) {
    return <p className={styles.empty}>{emptyMessage}</p>;
  }

  return (
    <ul className={styles.list}>
      {results.map((entry) => (
        <li key={entry.url} className={styles.item}>
          <div className={styles.heading}>
            <Link className={styles.title} to={entry.url}>
              {entry.title}
            </Link>
            <span className={styles.badge}>{entry.categoryLabel}</span>
          </div>
          {entry.description ? (
            <p className={styles.description}>{entry.description}</p>
          ) : null}
        </li>
      ))}
    </ul>
  );
}
