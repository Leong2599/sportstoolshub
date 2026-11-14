import {useId, type ReactNode} from 'react';
import clsx from 'clsx';
import styles from './CalculatorKit.module.css';

export type CheckboxOption = {
  value: string;
  label: ReactNode;
};

export type CheckboxGroupProps = {
  legend: string;
  value: readonly string[];
  onValueChange: (value: string[]) => void;
  options: readonly CheckboxOption[];
  hint?: ReactNode;
  error?: string;
  required?: boolean;
};

export function CheckboxGroup({
  legend,
  value,
  onValueChange,
  options,
  hint,
  error,
  required,
}: CheckboxGroupProps): ReactNode {
  const generatedId = useId();
  const hintId = hint ? `${generatedId}-hint` : undefined;
  const errorId = error ? `${generatedId}-error` : undefined;
  const describedBy =
    [hintId, errorId].filter(Boolean).join(' ') || undefined;

  return (
    <fieldset className={styles.choiceGroup}>
      <legend className={styles.label}>
        {legend}
        {required ? (
          <span className={styles.required} aria-hidden="true">
            {' '}
            *
          </span>
        ) : null}
      </legend>
      <div className={styles.choiceOptions}>
        {options.map((option, index) => {
          const optionId = `${generatedId}-${index}`;
          const checked = value.includes(option.value);

          return (
            <label
              key={option.value}
              htmlFor={optionId}
              className={clsx(styles.choice, checked && styles.choiceSelected)}
            >
              <input
                id={optionId}
                className={styles.choiceInput}
                type="checkbox"
                value={option.value}
                checked={checked}
                onChange={() => {
                  onValueChange(
                    checked
                      ? value.filter((item) => item !== option.value)
                      : [...value, option.value],
                  );
                }}
                aria-invalid={error ? true : undefined}
                aria-describedby={describedBy}
              />
              <span className={styles.choiceText}>
                <span>{option.label}</span>
              </span>
            </label>
          );
        })}
      </div>
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
    </fieldset>
  );
}
