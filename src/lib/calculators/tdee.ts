import {
  parseNumber,
  toCentimeters,
  toKilograms,
  type HeightUnit,
  type WeightUnit,
} from './units';
import {
  NUTRITION_ACTIVITY_FACTORS,
  mifflinStJeorBmr,
  type NutritionActivityLevel,
} from './nutritionMetrics';
import type {FieldErrors} from './validation';

export type TdeeActivity = NutritionActivityLevel;

export type TdeeValues = {
  age: string;
  gender: 'male' | 'female' | '';
  weight: string;
  weightUnit: WeightUnit;
  height: string;
  heightUnit: HeightUnit;
  inches: string;
  activityLevel: TdeeActivity | '';
};

export type TdeeGoal = {
  key: string;
  label: string;
  calories: number;
  display: string;
};

export type TdeeResult = {
  bmr: number;
  tdee: number;
  display: string;
  goals: readonly TdeeGoal[];
};

export const TDEE_ACTIVITIES: readonly {
  value: TdeeActivity;
  label: string;
}[] = [
  {value: 'sedentary', label: 'Sedentary (little or no exercise)'},
  {
    value: 'light',
    label: 'Lightly Active (light exercise/sports 1-3 days/week)',
  },
  {
    value: 'moderate',
    label: 'Moderately Active (moderate exercise/sports 3-5 days/week)',
  },
  {
    value: 'active',
    label: 'Very Active (hard exercise/sports 6-7 days/week)',
  },
  {
    value: 'very-active',
    label: 'Extremely Active (very hard exercise/physical job)',
  },
] as const;

export const TDEE_ERRORS = {
  age: 'Please enter a valid age between 15 and 80.',
  gender: 'Please select your gender.',
  weight: 'Please enter a valid weight.',
  heightCm: 'Please enter a valid height in cm (50-300).',
  heightFeetInches:
    'Please enter a valid height in feet (1-9) and inches (0-11).',
  activityLevel: 'Please select your activity level.',
} as const;

const WEIGHT_GOALS: readonly {key: string; label: string; offset: number}[] = [
  {key: 'maintain', label: 'Maintain Weight', offset: 0},
  {
    key: 'mild-loss',
    label: 'Mild Weight Loss (0.25kg/0.5lb per week)',
    offset: -250,
  },
  {
    key: 'loss',
    label: 'Weight Loss (0.5kg/1lb per week)',
    offset: -500,
  },
  {
    key: 'extreme-loss',
    label: 'Extreme Weight Loss (1kg/2lb per week)',
    offset: -1000,
  },
  {
    key: 'mild-gain',
    label: 'Mild Weight Gain (0.25kg/0.5lb per week)',
    offset: 250,
  },
  {
    key: 'gain',
    label: 'Weight Gain (0.5kg/1lb per week)',
    offset: 500,
  },
] as const;

export function validateTdeeValues(
  values: TdeeValues,
): FieldErrors<TdeeValues> {
  const errors: FieldErrors<TdeeValues> = {};
  const age = parseNumber(values.age);
  const weight = parseNumber(values.weight);

  if (age === null || age < 15 || age > 80) {
    errors.age = TDEE_ERRORS.age;
  }

  if (!values.gender) {
    errors.gender = TDEE_ERRORS.gender;
  }

  if (weight === null || weight <= 0) {
    errors.weight = TDEE_ERRORS.weight;
  }

  if (values.heightUnit === 'cm') {
    const height = parseNumber(values.height);

    if (height === null || height < 50 || height > 300) {
      errors.height = TDEE_ERRORS.heightCm;
    }
  } else {
    const feet = parseNumber(values.height);
    const inches = parseNumber(values.inches);

    if (
      feet === null ||
      inches === null ||
      feet < 1 ||
      feet > 9 ||
      inches < 0 ||
      inches > 11
    ) {
      errors.height = TDEE_ERRORS.heightFeetInches;
    }
  }

  if (!values.activityLevel) {
    errors.activityLevel = TDEE_ERRORS.activityLevel;
  }

  return errors;
}

export function calculateTdee(values: TdeeValues): TdeeResult {
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
    height === null ||
    !values.activityLevel
  ) {
    throw new Error('Invalid TDEE inputs.');
  }

  if (
    values.heightUnit === 'ft' &&
    (inches < 0 || inches > 11)
  ) {
    throw new Error('Invalid TDEE inputs.');
  }

  const weightKg = toKilograms(weight, values.weightUnit);
  const heightCm = toCentimeters(height, values.heightUnit, inches);
  const bmr = mifflinStJeorBmr(values.gender, weightKg, heightCm, age);
  const tdee = bmr * NUTRITION_ACTIVITY_FACTORS[values.activityLevel];

  return {
    bmr,
    tdee,
    display: String(Math.round(tdee)),
    goals: WEIGHT_GOALS.map((goal) => {
      const calories = Math.round(tdee + goal.offset);

      return {
        key: goal.key,
        label: goal.label,
        calories,
        display: `${calories} Calories`,
      };
    }),
  };
}
