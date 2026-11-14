import {useId, type ReactNode} from 'react';
import clsx from 'clsx';
import styles from './CalculatorKit.module.css';

export type UnitOption<TUnit extends string> = {
  value: TUnit;
  label: string;
};

export type SecondaryUnit = {
  label: string;
  value: string;
  onValueChange: (value: string) => void;
  required?: boolean;
  placeholder?: string;
  error?: string;
  min?: number;
  max?: number;
  step?: number;
};

export type UnitFieldProps<TUnit extends string> = {
  id?: string;
  label: string;
  value: string;
  onValueChange: (value: string) => void;
  unit: TUnit;
  onUnitChange: (unit: TUnit) => void;
  units: readonly UnitOption<TUnit>[];
  hint?: ReactNode;
  error?: string;
  required?: boolean;
  placeholder?: string;
  min?: number;
  max?: number;
  step?: number;
  primaryLabel?: string;
  unitSelectLabel?: string;
  secondary?: SecondaryUnit;
};

export function UnitField<TUnit extends string>({
  id,
  label,
  value,
  onValueChange,
  unit,
  onUnitChange,
  units,
  hint,
  error,
  required,
  placeholder,
  min,
  max,
  step,
  primaryLabel,
  unitSelectLabel,
  secondary,
}: UnitFieldProps<TUnit>): ReactNode {
  const generatedId = useId();
  const fieldId = id ?? generatedId;
  const unitId = `${fieldId}-unit`;
  const secondaryId = `${fieldId}-secondary`;
  const hintId = hint ? `${fieldId}-hint` : undefined;
  const errorId = error ? `${fieldId}-error` : undefined;
  const secondaryErrorId = secondary?.error
    ? `${secondaryId}-error`
    : undefined;
  const describedBy =
    [hintId, errorId].filter(Boolean).join(' ') || undefined;
  const secondaryDescribedBy =
    [hintId, secondaryErrorId].filter(Boolean).join(' ') || undefined;

  return (
    <fieldset className={styles.field}>
      <legend className={styles.label}>
        {label}
        {required ? (
          <span className={styles.required} aria-hidden="true">
            {' '}
            *
          </span>
        ) : null}
      </legend>
      <div className={styles.unitRow}>
        <input
          id={fieldId}
          type="number"
          inputMode="decimal"
          className={styles.input}
          value={value}
          onChange={(event) => onValueChange(event.target.value)}
          placeholder={placeholder}
          min={min}
          max={max}
          step={step}
          required={required}
          aria-label={primaryLabel ?? label}
          aria-invalid={error ? true : undefined}
          aria-describedby={describedBy}
        />
        {secondary ? (
          <input
            id={secondaryId}
            type="number"
            inputMode="decimal"
            className={clsx(styles.input, styles.secondaryInput)}
            value={secondary.value}
            onChange={(event) => secondary.onValueChange(event.target.value)}
            placeholder={secondary.placeholder}
            min={secondary.min}
            max={secondary.max}
            step={secondary.step}
            required={secondary.required}
            aria-label={secondary.label}
            aria-invalid={secondary.error ? true : undefined}
            aria-describedby={secondaryDescribedBy}
          />
        ) : null}
        <select
          id={unitId}
          className={styles.select}
          value={unit}
          onChange={(event) => onUnitChange(event.target.value as TUnit)}
          aria-label={unitSelectLabel ?? `${label} unit`}
        >
          {units.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
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
      {secondary?.error ? (
        <p className={styles.error} id={secondaryErrorId} role="alert">
          {secondary.error}
        </p>
      ) : null}
    </fieldset>
  );
}
