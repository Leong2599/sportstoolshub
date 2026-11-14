import {useId, type ReactNode} from 'react';
import clsx from 'clsx';
import styles from './CalculatorKit.module.css';

export type ChoiceOption<TValue extends string> = {
  value: TValue;
  label: ReactNode;
  description?: ReactNode;
};

export type ChoiceFieldProps<TValue extends string> = {
  legend: string;
  value: TValue | '';
  onValueChange: (value: TValue) => void;
  options: readonly ChoiceOption<TValue>[];
  name?: string;
  hint?: ReactNode;
  error?: string;
  required?: boolean;
  layout?: 'grid' | 'list';
};

export function ChoiceField<TValue extends string>({
  legend,
  value,
  onValueChange,
  options,
  name,
  hint,
  error,
  required,
  layout = 'grid',
}: ChoiceFieldProps<TValue>): ReactNode {
  const generatedId = useId();
  const groupName = name ?? generatedId;
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
      <div
        className={clsx(
          styles.choiceOptions,
          layout === 'list' && styles.choiceOptionsList,
        )}
      >
        {options.map((option, index) => {
          const optionId = `${generatedId}-${index}`;
          const selected = value === option.value;

          return (
            <label
              key={option.value}
              htmlFor={optionId}
              className={clsx(styles.choice, selected && styles.choiceSelected)}
            >
              <input
                id={optionId}
                className={styles.choiceInput}
                type="radio"
                name={groupName}
                value={option.value}
                checked={selected}
                onChange={() => onValueChange(option.value)}
                required={required}
                aria-invalid={error ? true : undefined}
                aria-describedby={describedBy}
              />
              <span className={styles.choiceText}>
                <span>{option.label}</span>
                {option.description ? (
                  <span className={styles.choiceDescription}>
                    {option.description}
                  </span>
                ) : null}
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
