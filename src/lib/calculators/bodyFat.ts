import {
  CM_PER_IN,
  parseNumber,
  toKilograms,
  type HeightUnit,
  type WeightUnit,
} from './units';
import type {FieldErrors} from './validation';

export const BODY_FAT_GENERAL_ERROR =
  'Could not calculate body fat. Please check your inputs and ensure they are realistic.';

export const BODY_FAT_METHODS = [
  {value: 'us-navy', label: 'US Navy Method'},
  {value: 'bmi', label: 'BMI-Based Method'},
  {value: 'skinfold', label: 'Skinfold Method'},
] as const;

export const CIRCUMFERENCE_UNITS = [
  {value: 'cm', label: 'cm'},
  {value: 'in', label: 'inches'},
] as const;

export type BodyFatMethod = (typeof BODY_FAT_METHODS)[number]['value'];
export type CircumferenceUnit =
  (typeof CIRCUMFERENCE_UNITS)[number]['value'];
export type BodyFatGender = 'male' | 'female';

export type BodyFatValues = {
  method: BodyFatMethod | '';
  gender: BodyFatGender | '';
  age: string;
  weight: string;
  weightUnit: WeightUnit;
  height: string;
  heightUnit: HeightUnit;
  inches: string;
  neck: string;
  neckUnit: CircumferenceUnit;
  waist: string;
  waistUnit: CircumferenceUnit;
  hip: string;
  hipUnit: CircumferenceUnit;
  chest: string;
  abdominal: string;
  thigh: string;
  triceps: string;
  suprailiac: string;
};

export type BodyFatCategory =
  | 'Essential Fat'
  | 'Athletes'
  | 'Fitness'
  | 'Acceptable'
  | 'Obese';

export type BodyFatRange = {
  name: BodyFatCategory;
  min: number;
  max: number;
  color: string;
};

export type BodyFatResult = {
  percentage: number;
  display: string;
  category: BodyFatCategory;
  fatMassKg: number;
  fatMassDisplay: string;
  leanMassKg: number;
  leanMassDisplay: string;
  ranges: readonly BodyFatRange[];
  recommendation: string;
};

const MALE_RANGES: readonly BodyFatRange[] = [
  {name: 'Essential Fat', min: 0, max: 6, color: '#3b82f6'},
  {name: 'Athletes', min: 6, max: 14, color: '#10b981'},
  {name: 'Fitness', min: 14, max: 18, color: '#f59e0b'},
  {name: 'Acceptable', min: 18, max: 25, color: '#f97316'},
  {name: 'Obese', min: 25, max: 100, color: '#ef4444'},
];

const FEMALE_RANGES: readonly BodyFatRange[] = [
  {name: 'Essential Fat', min: 0, max: 14, color: '#3b82f6'},
  {name: 'Athletes', min: 14, max: 21, color: '#10b981'},
  {name: 'Fitness', min: 21, max: 25, color: '#f59e0b'},
  {name: 'Acceptable', min: 25, max: 32, color: '#f97316'},
  {name: 'Obese', min: 32, max: 100, color: '#ef4444'},
];

export function getBodyFatCategory(
  gender: BodyFatGender,
  percentage: number,
): BodyFatCategory {
  if (gender === 'male') {
    if (percentage < 6) return 'Essential Fat';
    if (percentage < 14) return 'Athletes';
    if (percentage < 18) return 'Fitness';
    if (percentage < 25) return 'Acceptable';
    return 'Obese';
  }

  if (percentage < 14) return 'Essential Fat';
  if (percentage < 21) return 'Athletes';
  if (percentage < 25) return 'Fitness';
  if (percentage < 32) return 'Acceptable';
  return 'Obese';
}

export function getBodyFatRanges(
  gender: BodyFatGender,
): readonly BodyFatRange[] {
  return gender === 'male' ? MALE_RANGES : FEMALE_RANGES;
}

export function getBodyFatRecommendation(
  category: BodyFatCategory,
): string {
  switch (category) {
    case 'Essential Fat':
      return 'Your body fat percentage is at essential levels. This is typical for elite athletes but may be too low for general health. Ensure adequate nutrition and consider consulting a sports nutritionist.';
    case 'Athletes':
      return 'Excellent! You have an athletic body fat percentage. Maintain your current training and nutrition regimen. Focus on performance and recovery.';
    case 'Fitness':
      return "Great job! You're in the fitness range. Continue with balanced nutrition and regular exercise. Consider strength training to maintain lean mass.";
    case 'Acceptable':
      return "You're in a healthy range. For optimal fitness, consider incorporating more strength training and cardiovascular exercise. Focus on nutrient-dense foods.";
    case 'Obese':
      return 'Consider a structured approach to reduce body fat through a combination of caloric deficit, regular exercise (both cardio and strength training), and adequate protein. Consult healthcare professionals for personalized guidance.';
  }
}

function toInches(value: number, unit: CircumferenceUnit): number {
  return unit === 'cm' ? value / CM_PER_IN : value;
}

function calculateUsNavy(
  gender: BodyFatGender,
  heightCm: number,
  neck: number,
  waist: number,
  hip: number,
  neckUnit: CircumferenceUnit,
  waistUnit: CircumferenceUnit,
  hipUnit: CircumferenceUnit,
): number {
  const heightIn = heightCm / CM_PER_IN;
  const neckIn = toInches(neck, neckUnit);
  const waistIn = toInches(waist, waistUnit);
  const hipIn = toInches(hip, hipUnit);

  if (gender === 'male') {
    const value = waistIn - neckIn;

    if (value <= 0) {
      return Number.NaN;
    }

    return (
      86.01 * Math.log10(value) -
      70.041 * Math.log10(heightIn) +
      36.76
    );
  }

  const value = waistIn + hipIn - neckIn;

  if (value <= 0) {
    return Number.NaN;
  }

  return (
    163.205 * Math.log10(value) -
    97.684 * Math.log10(heightIn) -
    78.387
  );
}

function calculateBmiBased(
  gender: BodyFatGender,
  weightKg: number,
  heightCm: number,
  age: number,
): number {
  const bmi = weightKg / Math.pow(heightCm / 100, 2);

  return gender === 'male'
    ? 1.2 * bmi + 0.23 * age - 16.2
    : 1.2 * bmi + 0.23 * age - 5.4;
}

function calculateSkinfoldMale(
  age: number,
  chest: number,
  abdominal: number,
  thigh: number,
): number {
  const sumSkinfolds = chest + abdominal + thigh;
  const bodyDensity =
    1.10938 -
    0.0008267 * sumSkinfolds +
    0.0000016 * sumSkinfolds * sumSkinfolds -
    0.0002574 * age;

  return (4.95 / bodyDensity - 4.5) * 100;
}

function calculateSkinfoldFemale(
  age: number,
  triceps: number,
  suprailiac: number,
  thigh: number,
): number {
  const sumSkinfolds = triceps + suprailiac + thigh;
  const bodyDensity =
    1.0994921 -
    0.0009929 * sumSkinfolds +
    0.0000023 * sumSkinfolds * sumSkinfolds -
    0.0001392 * age;

  return (4.95 / bodyDensity - 4.5) * 100;
}

export function validateBodyFatValues(
  values: BodyFatValues,
): FieldErrors<BodyFatValues> {
  const errors: FieldErrors<BodyFatValues> = {};

  if (!values.method) {
    errors.method = 'Please select a calculation method.';
  }

  if (!values.gender) {
    errors.gender = 'Please select your gender.';
  }

  const age = parseNumber(values.age);

  if (age === null || age < 18 || age > 100) {
    errors.age = 'Please enter a valid age (18-100).';
  }

  const weight = parseNumber(values.weight);

  if (weight === null || weight < 30) {
    errors.weight = 'Please enter a valid weight (min 30).';
  }

  if (values.heightUnit === 'cm') {
    const height = parseNumber(values.height);

    if (height === null || height < 50 || height > 300) {
      errors.height = 'Please enter a valid height in cm (50-300).';
    }
  } else {
    const feet = parseNumber(values.height);
    const inches = parseNumber(values.inches);

    if (
      feet === null ||
      feet < 1 ||
      feet > 9 ||
      inches === null ||
      inches < 0 ||
      inches > 11
    ) {
      errors.height =
        'Please enter a valid height in feet (1-9) and inches (0-11).';
    }
  }

  if (values.method === 'us-navy') {
    const neck = parseNumber(values.neck);
    const waist = parseNumber(values.waist);

    if (neck === null || neck <= 0 || neck < 20) {
      errors.neck = 'Please enter a valid neck circumference.';
    }

    if (waist === null || waist <= 0 || waist < 50) {
      errors.waist = 'Please enter a valid waist circumference.';
    }

    if (values.gender === 'female') {
      const hip = parseNumber(values.hip);

      if (hip === null || hip <= 0 || hip < 70) {
        errors.hip = 'Please enter a valid hip circumference.';
      }
    }
  }

  if (values.method === 'skinfold') {
    const thigh = parseNumber(values.thigh);

    if (thigh === null || thigh < 1 || thigh > 50) {
      errors.thigh = 'Please enter a valid thigh skinfold measurement.';
    }

    if (values.gender === 'male') {
      const chest = parseNumber(values.chest);
      const abdominal = parseNumber(values.abdominal);

      if (chest === null || chest < 1 || chest > 50) {
        errors.chest = 'Please enter a valid chest skinfold measurement.';
      }

      if (abdominal === null || abdominal < 1 || abdominal > 50) {
        errors.abdominal =
          'Please enter a valid abdominal skinfold measurement.';
      }
    }

    if (values.gender === 'female') {
      const triceps = parseNumber(values.triceps);
      const suprailiac = parseNumber(values.suprailiac);

      if (triceps === null || triceps < 1 || triceps > 50) {
        errors.triceps =
          'Please enter a valid triceps skinfold measurement.';
      }

      if (suprailiac === null || suprailiac < 1 || suprailiac > 50) {
        errors.suprailiac =
          'Please enter a valid suprailiac skinfold measurement.';
      }
    }
  }

  if (Object.keys(errors).length === 0) {
    try {
      calculateBodyFat(values);
    } catch {
      errors.method = BODY_FAT_GENERAL_ERROR;
    }
  }

  return errors;
}

export function calculateBodyFat(values: BodyFatValues): BodyFatResult {
  const gender = values.gender;
  const method = values.method;
  const age = parseNumber(values.age);
  const weight = parseNumber(values.weight);
  const height = parseNumber(values.height);
  const inches =
    values.heightUnit === 'ft' ? parseNumber(values.inches) : 0;

  if (
    !gender ||
    !method ||
    age === null ||
    weight === null ||
    height === null ||
    inches === null
  ) {
    throw new Error(BODY_FAT_GENERAL_ERROR);
  }

  const heightCm =
    values.heightUnit === 'ft'
      ? height * 30.48 + inches * 2.54
      : height;
  const weightKg = toKilograms(weight, values.weightUnit);
  let percentage: number;

  if (method === 'us-navy') {
    const neck = parseNumber(values.neck);
    const waist = parseNumber(values.waist);
    const hip = gender === 'female' ? parseNumber(values.hip) : 0;

    if (neck === null || waist === null || hip === null) {
      throw new Error(BODY_FAT_GENERAL_ERROR);
    }

    percentage = calculateUsNavy(
      gender,
      heightCm,
      neck,
      waist,
      hip,
      values.neckUnit,
      values.waistUnit,
      values.hipUnit,
    );
  } else if (method === 'bmi') {
    percentage = calculateBmiBased(gender, weightKg, heightCm, age);
  } else {
    const thigh = parseNumber(values.thigh);

    if (thigh === null) {
      throw new Error(BODY_FAT_GENERAL_ERROR);
    }

    if (gender === 'male') {
      const chest = parseNumber(values.chest);
      const abdominal = parseNumber(values.abdominal);

      if (chest === null || abdominal === null) {
        throw new Error(BODY_FAT_GENERAL_ERROR);
      }

      percentage = calculateSkinfoldMale(age, chest, abdominal, thigh);
    } else {
      const triceps = parseNumber(values.triceps);
      const suprailiac = parseNumber(values.suprailiac);

      if (triceps === null || suprailiac === null) {
        throw new Error(BODY_FAT_GENERAL_ERROR);
      }

      percentage = calculateSkinfoldFemale(
        age,
        triceps,
        suprailiac,
        thigh,
      );
    }
  }

  if (!Number.isFinite(percentage) || percentage < 0 || percentage > 100) {
    throw new Error(BODY_FAT_GENERAL_ERROR);
  }

  const fatMassKg = weightKg * (percentage / 100);
  const leanMassKg = weightKg - fatMassKg;
  const category = getBodyFatCategory(gender, percentage);

  return {
    percentage,
    display: `${percentage.toFixed(1)}%`,
    category,
    fatMassKg,
    fatMassDisplay: `${fatMassKg.toFixed(1)} kg`,
    leanMassKg,
    leanMassDisplay: `${leanMassKg.toFixed(1)} kg`,
    ranges: getBodyFatRanges(gender),
    recommendation: getBodyFatRecommendation(category),
  };
}
