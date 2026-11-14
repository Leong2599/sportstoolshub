import {parseNumber} from './units';
import type {FieldErrors} from './validation';

/**
 * Shared validation helpers for the sport-specific trackers. These tools use
 * the same wording so a user moving between them sees one consistent set of
 * messages; the legacy sources used a single `alert()` per form, so the exact
 * strings here are our own.
 */
export const REQUIRED_FIELD_MESSAGE = 'Please fill in all required fields.';

export function requiredFieldError(
  label: string,
): string {
  return `Please enter a valid ${label}.`;
}

export function rangeError(
  label: string,
  min: number,
  max: number,
): string {
  return `Please enter ${label} between ${min} and ${max}.`;
}

export function validateRequiredNumber(
  value: string,
  label: string,
  errors: Record<string, string>,
  key: string,
): void {
  const parsed = parseNumber(value);

  if (parsed === null) {
    errors[key] = requiredFieldError(label);
  }
}

export function validateRange(
  value: string,
  label: string,
  min: number,
  max: number,
  errors: Record<string, string>,
  key: string,
): void {
  const parsed = parseNumber(value);

  if (parsed === null) {
    errors[key] = requiredFieldError(label);
    return;
  }

  if (parsed < min || parsed > max) {
    errors[key] = rangeError(label, min, max);
  }
}
