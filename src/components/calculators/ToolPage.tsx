import type {ReactNode} from 'react';
import styles from './ToolPage.module.css';

export type ToolPageProps = {
  title: string;
  subtitle: ReactNode;
  children: ReactNode;
};

export type ToolInfoProps = {
  children: ReactNode;
};

export function ToolPage({
  title,
  subtitle,
  children,
}: ToolPageProps): ReactNode {
  return (
    <div className={styles.page}>
      <section className={styles.hero} aria-labelledby="tool-title">
        <div className={styles.container}>
          <h1 className={styles.title} id="tool-title">
            {title}
          </h1>
          <p className={styles.subtitle}>{subtitle}</p>
        </div>
      </section>
      <section className={styles.body}>
        <div className={styles.container}>
          <div className={styles.content}>{children}</div>
        </div>
      </section>
    </div>
  );
}

export function ToolInfo({children}: ToolInfoProps): ReactNode {
  return (
    <section className={styles.infoCard}>
      <div className="sth-prose">{children}</div>
    </section>
  );
}
