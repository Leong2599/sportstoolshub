import type {ReactNode} from 'react';
import styles from './BlogIndexHeader.module.css';

export type BlogIndexHeaderProps = {
  title: string;
  description?: string;
};

/**
 * The visible heading of the blog index. The stock Docusaurus blog list page
 * renders no heading at all, while the legacy blog index opened with an `h1`,
 * so the swizzled list page renders this one.
 */
export function BlogIndexHeader({
  title,
  description,
}: BlogIndexHeaderProps): ReactNode {
  return (
    <header className={styles.header}>
      <h1 className={styles.title}>{title}</h1>
      {description ? <p className={styles.description}>{description}</p> : null}
    </header>
  );
}
