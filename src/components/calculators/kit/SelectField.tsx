import {useId, type ReactNode} from 'react';
import clsx from 'clsx';
import styles from './CalculatorKit.module.css';

export type SelectOption<TValue extends string> = {
  value: TValue;
  label: string;
};

export type SelectFieldProps<TValue extends string> = {
  id?: string;
  label: string;
  value: TValue | '';
  onValueChange: (value: TValue) => void;
  options: readonly SelectOption<TValue>[];
  placeholder?: string;
  hint?: ReactNode;
  error?: string;
  required?: boolean;
};

export function SelectField<TValue extends string>({
  id,
  label,
  value,
  onValueChange,
  options,
  placeholder,
  hint,
  error,
  required,
}: SelectFieldProps<TValue>): ReactNode {
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
      <select
        id={fieldId}
        className={clsx(styles.select, styles.selectFull)}
        value={value}
        onChange={(event) => onValueChange(event.target.value as TValue)}
        required={required}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy}
      >
        {placeholder ? <option value="">{placeholder}</option> : null}
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
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
