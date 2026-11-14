import {
  parseNumber,
  toKilograms,
  toMeters,
  type HeightUnit,
  type WeightUnit,
} from './units';
import type {FieldErrors} from './validation';

export type BmiGender = 'male' | 'female';

export type BmiValues = {
  weight: string;
  weightUnit: WeightUnit;
  height: string;
  heightUnit: HeightUnit;
  inches: string;
  age: string;
  gender: BmiGender | '';
};

export type BmiCategory =
  | 'Underweight'
  | 'Normal weight'
  | 'Overweight'
  | 'Obese';

export type BmiRange = {
  category: BmiCategory;
  label: string;
  min: number;
  max: number | null;
  color: string;
  background: string;
  display: string;
};

export type BmiResult = {
  bmi: number;
  display: string;
  category: BmiCategory;
  color: string;
  recommendation: string;
};

export const BMI_RANGES: readonly BmiRange[] = [
  {
    category: 'Underweight',
    label: 'Underweight',
    min: 0,
    max: 18.5,
    color: '#1e40af',
    background: '#dbeafe',
    display: '< 18.5',
  },
  {
    category: 'Normal weight',
    label: 'Normal weight',
    min: 18.5,
    max: 25,
    color: '#065f46',
    background: '#d1fae5',
    display: '18.5 - 24.9',
  },
  {
    category: 'Overweight',
    label: 'Overweight',
    min: 25,
    max: 30,
    color: '#92400e',
    background: '#fef3c7',
    display: '25.0 - 29.9',
  },
  {
    category: 'Obese',
    label: 'Obese',
    min: 30,
    max: null,
    color: '#991b1b',
    background: '#fecaca',
    display: '≥ 30.0',
  },
];

export function formatBmi(bmi: number): string {
  return bmi.toFixed(1);
}

export function getBmiCategory(bmi: number): {
  category: BmiCategory;
  color: string;
  recommendation: string;
} {
  if (bmi < 18.5) {
    return {
      category: 'Underweight',
      color: '#3b82f6',
      recommendation:
        'Consider consulting with a healthcare provider about healthy weight gain strategies. Focus on nutrient-dense foods and strength training to build lean muscle mass.',
    };
  }

  if (bmi < 25) {
    return {
      category: 'Normal weight',
      color: '#10b981',
      recommendation:
        "Great job! You're within the healthy weight range. Continue maintaining a balanced diet and regular physical activity to support your overall health.",
    };
  }

  if (bmi < 30) {
    return {
      category: 'Overweight',
      color: '#f59e0b',
      recommendation:
        'Consider incorporating more physical activity into your routine and focusing on a balanced diet. Small, sustainable changes can lead to significant health improvements.',
    };
  }

  return {
    category: 'Obese',
    color: '#ef4444',
    recommendation:
      "It's recommended to consult with a healthcare provider for personalized advice. A combination of dietary changes, increased physical activity, and professional guidance can help achieve better health outcomes.",
  };
}

export function validateBmiValues(values: BmiValues): FieldErrors<BmiValues> {
  const errors: FieldErrors<BmiValues> = {};
  const weight = parseNumber(values.weight);

  if (weight === null || weight <= 0) {
    errors.weight = 'Please enter a valid weight.';
  } else if (weight < 1 || weight > 1000) {
    errors.weight = 'Please enter a valid weight between 1 and 1000';
  }

  if (values.heightUnit === 'cm') {
    const height = parseNumber(values.height);

    if (height === null || height <= 0) {
      errors.height = 'Please enter a valid height in cm.';
    } else if (height < 50 || height > 300) {
      errors.height = 'Please enter a valid height between 50 and 300 cm';
    }
  } else {
    const feet = parseNumber(values.height);
    const inches = parseNumber(values.inches);

    if (feet === null || inches === null || feet <= 0) {
      errors.height = 'Please enter a valid height in feet and inches.';
    } else if (feet < 2 || feet > 8) {
      errors.height = 'Please enter a valid height between 2 and 8 feet';
    } else if (inches < 0 || inches > 11) {
      errors.inches = 'Please enter valid inches between 0 and 11';
    }
  }

  const age = parseNumber(values.age);

  if (age === null || age < 1 || age > 120) {
    errors.age = 'Please enter a valid age.';
  }

  if (!values.gender) {
    errors.gender = 'Please select your gender.';
  }

  return errors;
}

export function calculateBmi(values: BmiValues): BmiResult {
  const weight = parseNumber(values.weight);
  const height = parseNumber(values.height);
  const inches =
    values.heightUnit === 'ft' ? parseNumber(values.inches) : 0;

  if (
    weight === null ||
    height === null ||
    inches === null ||
    weight <= 0 ||
    height <= 0
  ) {
    throw new Error('BMI values must be valid numbers.');
  }

  const weightKg = toKilograms(weight, values.weightUnit);
  const heightM = toMeters(height, values.heightUnit, inches);

  if (heightM <= 0) {
    throw new Error('Height must be greater than zero.');
  }

  const bmi = weightKg / (heightM * heightM);
  const category = getBmiCategory(bmi);

  return {
    bmi,
    display: formatBmi(bmi),
    ...category,
  };
}
