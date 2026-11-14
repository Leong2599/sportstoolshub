import Link from '@docusaurus/Link';
import Layout from '@theme/Layout';
import type {ReactNode} from 'react';
import {buildCategories} from '../data/chrome';
import styles from './404.module.css';

// The site is served from the domain root, so the brand logo lives at the
// site root of `static/`.
const LOGO_SRC = '/img/logo.png';

export default function NotFound(): ReactNode {
  const categories = buildCategories();

  return (
    <Layout
      title="Page not found"
      description="The page you are looking for is not on Sports Tools Hub. Browse the tools by category instead."
    >
      <main className={styles.page}>
        <div className={styles.container}>
          <img
            className={styles.logo}
            src={LOGO_SRC}
            alt="Sports Tools Hub"
            width={72}
            height={72}
          />
          <p className={styles.code}>404</p>
          <h1 className={styles.title}>This page took a wrong turn</h1>
          <p className={styles.text}>
            The page you were looking for is not here. It may have moved, or the
            link that brought you here may be out of date. Every tool is still
            one click away.
          </p>

          <div className={styles.actions}>
            <Link className="sth-btn sth-btn-primary" to="/">
              Back to home
            </Link>
            <Link className="sth-btn sth-btn-secondary" to="/#tools">
              Browse the tools
            </Link>
          </div>

          <nav className={styles.categories} aria-label="Tool categories">
            <h2 className={styles.categoriesTitle}>Jump to a category</h2>
            <ul className={styles.categoryList}>
              {categories.map((category) => (
                <li key={category.category}>
                  <Link to={`/#${category.anchor}`}>{category.label}</Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </main>
    </Layout>
  );
}
