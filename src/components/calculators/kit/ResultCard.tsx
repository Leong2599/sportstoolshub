import {forwardRef, useId, type ReactNode} from 'react';
import styles from './CalculatorKit.module.css';

export type ResultCardProps = {
  title?: ReactNode;
  value?: ReactNode;
  unit?: ReactNode;
  category?: ReactNode;
  description?: ReactNode;
  actions?: ReactNode;
  children?: ReactNode;
  'aria-label'?: string;
};

export const ResultCard = forwardRef<HTMLDivElement, ResultCardProps>(
  function ResultCard(
    {
      title,
      value,
      unit,
      category,
      description,
      actions,
      children,
      'aria-label': ariaLabel,
    },
    ref,
  ) {
    const titleId = useId();

    return (
      <section
        ref={ref}
        className={styles.resultCard}
        aria-live="polite"
        aria-atomic="true"
        aria-labelledby={title ? titleId : undefined}
        aria-label={!title ? ariaLabel : undefined}
        tabIndex={-1}
      >
        {title ? (
          <h2 className={styles.resultTitle} id={titleId}>
            {title}
          </h2>
        ) : null}
        <div className={styles.resultDisplay}>
          <div className={styles.resultValue}>
            {value ?? '--'}
            {unit ? <span className={styles.resultUnit}>{unit}</span> : null}
          </div>
          {category ? <p className={styles.resultCategory}>{category}</p> : null}
          {description ? (
            <p className={styles.resultDescription}>{description}</p>
          ) : null}
        </div>
        {children ? <div className={styles.resultBody}>{children}</div> : null}
        {actions ? <div className={styles.resultActions}>{actions}</div> : null}
      </section>
    );
  },
);

ResultCard.displayName = 'ResultCard';
