import {
  parseNumber,
  toCentimeters,
  toKilograms,
  type HeightUnit,
  type WeightUnit,
} from './units';
import type {FieldErrors} from './validation';

export type LbmGender = 'male' | 'female';

export type LbmValues = {
  gender: LbmGender | '';
  weight: string;
  weightUnit: WeightUnit;
  height: string;
  heightUnit: HeightUnit;
  inches: string;
};

export type LbmResult = {
  lbmKg: number;
  lbmDisplay: string;
  bodyFatPercentage: number;
  bodyFatDisplay: string;
  weightKg: number;
  heightCm: number;
};

export const LBM_ERROR_HEIGHT_CM =
  'Please enter a valid height in cm (50-250).';

export const LBM_ERROR_HEIGHT_FEET_INCHES =
  'Please enter a valid height in feet (1-8) and inches (0-11).';

export function validateLbmValues(values: LbmValues): FieldErrors<LbmValues> {
  const errors: FieldErrors<LbmValues> = {};
  const weight = parseNumber(values.weight);

  if (!values.gender) {
    errors.gender = 'Please select your gender.';
  }

  if (weight === null || weight <= 0) {
    errors.weight = 'Please enter a valid weight.';
  }

  if (values.heightUnit === 'cm') {
    const height = parseNumber(values.height);

    if (height === null || height < 50 || height > 250) {
      errors.height = LBM_ERROR_HEIGHT_CM;
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
      errors.height = LBM_ERROR_HEIGHT_FEET_INCHES;
    }
  }

  return errors;
}

export function calculateLbm(values: LbmValues): LbmResult {
  const gender = values.gender;
  const weight = parseNumber(values.weight);
  const height = parseNumber(values.height);
  const inches =
    values.heightUnit === 'ft' ? parseNumber(values.inches) : 0;

  if (!gender || weight === null || weight <= 0 || height === null) {
    throw new Error('Invalid Lean Body Mass inputs.');
  }

  if (
    values.heightUnit === 'ft' &&
    (inches === null || inches < 0 || inches > 11)
  ) {
    throw new Error('Invalid Lean Body Mass inputs.');
  }

  const weightKg = toKilograms(weight, values.weightUnit);
  const heightCm = toCentimeters(height, values.heightUnit, inches ?? 0);

  let lbm: number;

  if (gender === 'male') {
    lbm = 0.407 * weightKg + 0.267 * heightCm - 19.2;
  } else {
    lbm = 0.252 * weightKg + 0.473 * heightCm - 48.3;
  }

  const bodyFatMass = weightKg - lbm;
  const bodyFatPercentage = weightKg > 0 ? (bodyFatMass / weightKg) * 100 : 0;

  return {
    lbmKg: lbm,
    lbmDisplay: lbm.toFixed(1),
    bodyFatPercentage,
    bodyFatDisplay: bodyFatPercentage.toFixed(1),
    weightKg,
    heightCm,
  };
}
