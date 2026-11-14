import Link from '@docusaurus/Link';
import type {ReactNode} from 'react';
import type {Props} from '@theme/BlogPostItems';
import BlogPostItems from '@theme-original/BlogPostItems';
import styles from './styles.module.css';

/**
 * Adds the blog search entry point above every list of posts: the blog index
 * and the tag pages.
 */
export default function BlogPostItemsWithSearch(props: Props): ReactNode {
  return (
    <>
      <Link className={styles.searchLink} to="/search?scope=articles">
        Search the blog
      </Link>
      <BlogPostItems {...props} />
    </>
  );
}
