import Heading from '@theme/Heading';
import type {ReactNode} from 'react';
import {TOOLS_ANCHOR, type ChromeCategory} from '../../data/chrome';
import {ToolCard} from './ToolCard';
import styles from './ToolGrid.module.css';

export type ToolGridProps = {
  sections: readonly ChromeCategory[];
};

export function ToolGrid({sections}: ToolGridProps): ReactNode {
  return (
    <section className={styles.section} aria-labelledby={TOOLS_ANCHOR}>
      <Heading as="h2" id={TOOLS_ANCHOR} className={styles.title}>
        Sports Tools by Category
      </Heading>

      {sections.length === 0 ? (
        <p className={styles.empty}>No tools are available yet.</p>
      ) : (
        sections.map((section) => (
          <section key={section.category} className={styles.category}>
            <Heading as="h3" id={section.anchor} className={styles.categoryTitle}>
              {section.label}
            </Heading>
            <div className={styles.grid}>
              {section.tools.map((tool) => (
                <ToolCard key={tool.slug} tool={tool} />
              ))}
            </div>
          </section>
        ))
      )}
    </section>
  );
}
