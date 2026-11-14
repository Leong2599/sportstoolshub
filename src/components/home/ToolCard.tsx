import Link from '@docusaurus/Link';
import type {ReactNode} from 'react';
import {TOOL_ICONS} from '../../data/icons';
import type {Tool} from '../../data/tools';
import styles from './ToolCard.module.css';

export type ToolCardProps = {
  tool: Tool;
};

export function ToolCard({tool}: ToolCardProps): ReactNode {
  const Icon = TOOL_ICONS[tool.icon];

  return (
    <article className={styles.card}>
      <div className={styles.icon}>
        <Icon aria-hidden="true" focusable="false" />
      </div>
      <h4 className={styles.title}>{tool.title}</h4>
      <p className={styles.description}>{tool.description}</p>
      <Link className={styles.link} to={`/tools/${tool.slug}`}>
        {tool.linkLabel}
      </Link>
    </article>
  );
}
