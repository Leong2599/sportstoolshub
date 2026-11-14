import type {ReactNode} from 'react';
import clsx from 'clsx';
import styles from './CalculatorKit.module.css';

export type PrintButtonProps = {
  onClick: () => void;
  label?: string;
  disabled?: boolean;
  className?: string;
};

export function PrintButton({
  onClick,
  label = 'Print results',
  disabled = false,
  className,
}: PrintButtonProps): ReactNode {
  return (
    <button
      type="button"
      className={clsx(styles.button, styles.buttonSecondary, className)}
      onClick={onClick}
      disabled={disabled}
    >
      {label}
    </button>
  );
}
