import {describe, expect, it} from 'vitest';
import {
  hasErrors,
  validateFields,
  validateNumber,
  validateSelection,
} from './validation';

describe('validateNumber', () => {
  it('requires a value by default', () => {
    expect(validateNumber('', {label: 'Weight'})).toBe('Weight is required.');
    expect(validateNumber('   ', {label: 'Weight'})).toBe(
      'Weight is required.',
    );
  });

  it('allows an empty optional value', () => {
    expect(validateNumber('', {required: false})).toBeUndefined();
  });

  it('rejects non-numeric values', () => {
    expect(validateNumber('heavy', {label: 'Weight'})).toBe(
      'Weight must be a number.',
    );
  });

  it('enforces minimum, maximum, and integer bounds', () => {
    expect(validateNumber('0', {label: 'Weight', min: 1})).toBe(
      'Weight must be at least 1.',
    );
    expect(validateNumber('13', {label: 'Inches', max: 11})).toBe(
      'Inches must be at most 11.',
    );
    expect(validateNumber('1.5', {label: 'Reps', integer: true})).toBe(
      'Reps must be a whole number.',
    );
  });

  it('supports custom messages without changing the checks', () => {
    expect(
      validateNumber('0', {
        label: 'Weight',
        min: 1,
        messages: {min: 'Enter a weight above zero.'},
      }),
    ).toBe('Enter a weight above zero.');
  });
});

describe('validateSelection', () => {
  it('requires a selection by default', () => {
    expect(validateSelection('', {label: 'Experience'})).toBe(
      'Experience is required.',
    );
  });

  it('accepts a selection or an optional empty value', () => {
    expect(validateSelection('regular')).toBeUndefined();
    expect(validateSelection('', {required: false})).toBeUndefined();
  });

  it('supports a custom message', () => {
    expect(
      validateSelection('', {
        label: 'Experience',
        message: 'Choose your experience level.',
      }),
    ).toBe('Choose your experience level.');
  });
});

describe('validateFields', () => {
  it('collects only failing fields', () => {
    const errors = validateFields(
      {weight: '', height: '175', age: '200'},
      {
        weight: (value) => validateNumber(value, {label: 'Weight'}),
        height: (value) => validateNumber(value, {label: 'Height'}),
        age: (value) => validateNumber(value, {label: 'Age', max: 120}),
      },
    );

    expect(errors).toEqual({
      weight: 'Weight is required.',
      age: 'Age must be at most 120.',
    });
    expect(hasErrors(errors)).toBe(true);
    expect(hasErrors({})).toBe(false);
  });
});
