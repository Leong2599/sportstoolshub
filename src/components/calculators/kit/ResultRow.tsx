import type {ReactNode} from 'react';
import clsx from 'clsx';
import styles from './CalculatorKit.module.css';

export type ResultRowProps = {
  label: ReactNode;
  value: ReactNode;
  strong?: boolean;
};

export function ResultRow({
  label,
  value,
  strong = false,
}: ResultRowProps): ReactNode {
  return (
    <div className={clsx(styles.resultRow, strong && styles.resultRowStrong)}>
      <span className={styles.resultRowLabel}>{label}</span>
      <span className={styles.resultRowValue}>{value}</span>
    </div>
  );
}
