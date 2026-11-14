import {useId, type ReactNode} from 'react';
import clsx from 'clsx';
import styles from './CalculatorKit.module.css';

export type TimeFieldProps = {
  id?: string;
  label: string;
  value: string;
  onValueChange: (value: string) => void;
  hint?: ReactNode;
  error?: string;
  required?: boolean;
};

export function TimeField({
  id,
  label,
  value,
  onValueChange,
  hint,
  error,
  required,
}: TimeFieldProps): ReactNode {
  const generatedId = useId();
  const fieldId = id ?? generatedId;
  const hintId = hint ? `${fieldId}-hint` : undefined;
  const errorId = error ? `${fieldId}-error` : undefined;
  const describedBy =
    [hintId, errorId].filter(Boolean).join(' ') || undefined;

  return (
    <div className={styles.field}>
      <label className={styles.label} htmlFor={fieldId}>
        {label}
        {required ? (
          <span className={styles.required} aria-hidden="true">
            {' '}
            *
          </span>
        ) : null}
      </label>
      <input
        id={fieldId}
        type="time"
        className={clsx(styles.input)}
        value={value}
        onChange={(event) => onValueChange(event.target.value)}
        required={required}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy}
      />
      {hint ? (
        <p className={styles.hint} id={hintId}>
          {hint}
        </p>
      ) : null}
      {error ? (
        <p className={styles.error} id={errorId} role="alert">
          {error}
        </p>
      ) : null}
    </div>
  );
}
