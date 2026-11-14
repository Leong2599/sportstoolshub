import {
  parseNumber,
  toCentimeters,
  toKilograms,
  type HeightUnit,
  type WeightUnit,
} from './units';
import {mifflinStJeorBmr} from './nutritionMetrics';
import type {FieldErrors} from './validation';

export type BmrGender = 'male' | 'female';

export type BmrValues = {
  age: string;
  gender: BmrGender | '';
  weight: string;
  weightUnit: WeightUnit;
  height: string;
  heightUnit: HeightUnit;
  inches: string;
};

export type BmrResult = {
  bmr: number;
  display: string;
  weightKg: number;
  heightCm: number;
};

export const BMR_ERRORS = {
  age: 'Please enter a valid age between 15 and 80.',
  gender: 'Please select your gender.',
  weight: 'Please enter a valid weight.',
  heightCm: 'Please enter a valid height in cm (50-250).',
  heightFeetInches:
    'Please enter a valid height in feet (1-8) and inches (0-11).',
} as const;

export function validateBmrValues(values: BmrValues): FieldErrors<BmrValues> {
  const errors: FieldErrors<BmrValues> = {};
  const age = parseNumber(values.age);
  const weight = parseNumber(values.weight);

  if (age === null || age < 15 || age > 80) {
    errors.age = BMR_ERRORS.age;
  }

  if (!values.gender) {
    errors.gender = BMR_ERRORS.gender;
  }

  if (weight === null || weight <= 0) {
    errors.weight = BMR_ERRORS.weight;
  }

  if (values.heightUnit === 'cm') {
    const height = parseNumber(values.height);

    if (height === null || height < 50 || height > 250) {
      errors.height = BMR_ERRORS.heightCm;
    }
  } else {
    const feet = parseNumber(values.height);
    const inches = parseNumber(values.inches);

    if (
      feet === null ||
      inches === null ||
      feet < 1 ||
      feet > 8 ||
      inches < 0 ||
      inches > 11
    ) {
      errors.height = BMR_ERRORS.heightFeetInches;
    }
  }

  return errors;
}

export function calculateBmr(values: BmrValues): BmrResult {
  const age = parseNumber(values.age);
  const weight = parseNumber(values.weight);
  const height = parseNumber(values.height);
  const inches =
    values.heightUnit === 'ft' ? parseNumber(values.inches) ?? 0 : 0;

  if (
    age === null ||
    age < 15 ||
    age > 80 ||
    !values.gender ||
    weight === null ||
    weight <= 0 ||
    height === null
  ) {
    throw new Error('Invalid BMR inputs.');
  }

  if (
    values.heightUnit === 'ft' &&
    (inches < 0 || inches > 11)
  ) {
    throw new Error('Invalid BMR inputs.');
  }

  const weightKg = toKilograms(weight, values.weightUnit);
  const heightCm = toCentimeters(height, values.heightUnit, inches);
  const bmr = mifflinStJeorBmr(values.gender, weightKg, heightCm, age);

  return {
    bmr,
    display: String(Math.round(bmr)),
    weightKg,
    heightCm,
  };
}
