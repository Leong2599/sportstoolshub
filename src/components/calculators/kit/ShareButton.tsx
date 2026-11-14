import {useId, type ReactNode} from 'react';
import clsx from 'clsx';
import type {ShareStatus} from '../../../lib/calculators/share';
import styles from './CalculatorKit.module.css';

export const SHARE_STATUS_LABELS: Record<ShareStatus, string> = {
  idle: 'Share results',
  sharing: 'Sharing...',
  shared: 'Results shared',
  copied: 'Copied to clipboard',
  cancelled: 'Share cancelled',
  unsupported: 'Sharing unavailable',
  failed: 'Could not share results',
};

export type ShareButtonProps = {
  onClick: () => void | Promise<void>;
  status?: ShareStatus;
  idleLabel?: string;
  disabled?: boolean;
  className?: string;
};

export function ShareButton({
  onClick,
  status = 'idle',
  idleLabel,
  disabled = false,
  className,
}: ShareButtonProps): ReactNode {
  const statusId = useId();
  const label =
    status === 'idle'
      ? idleLabel ?? SHARE_STATUS_LABELS.idle
      : SHARE_STATUS_LABELS[status];

  return (
    <>
      <button
        type="button"
        className={clsx(styles.button, styles.buttonSecondary, className)}
        onClick={() => {
          void onClick();
        }}
        disabled={disabled || status === 'sharing'}
        aria-describedby={statusId}
      >
        {label}
      </button>
      <span
        className={styles.srOnly}
        id={statusId}
        role="status"
        aria-live="polite"
      >
        {status === 'idle' ? '' : SHARE_STATUS_LABELS[status]}
      </span>
    </>
  );
}
