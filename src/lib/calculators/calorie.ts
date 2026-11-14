import {
  parseNumber,
  toCentimeters,
  toKilograms,
  type HeightUnit,
  type WeightUnit,
} from './units';
import type {FieldErrors} from './validation';

export type CalorieActivity =
  | 'sedentary'
  | 'light'
  | 'moderate'
  | 'active'
  | 'very-active'
  | 'extra-active';

export type CalorieGoal =
  | 'lose-weight-fast'
  | 'lose-weight'
  | 'maintain'
  | 'gain-weight-slow'
  | 'gain-weight'
  | 'gain-weight-fast';

export type CalorieValues = {
  age: string;
  gender: 'male' | 'female' | '';
  weight: string;
  weightUnit: WeightUnit;
  height: string;
  heightUnit: HeightUnit;
  inches: string;
  activityLevel: CalorieActivity | '';
  goal: CalorieGoal | '';
};

export type CalorieResult = {
  bmr: number;
  tdee: number;
  goalCalories: number;
  goalDescription: string;
  recommendations: string;
  proteinGrams: number;
  carbsGrams: number;
  fatsGrams: number;
  proteinCalories: number;
  carbsCalories: number;
  fatsCalories: number;
  activityLevel: CalorieActivity;
  goal: CalorieGoal;
};

const ACTIVITY_MULTIPLIERS: Record<CalorieActivity, number> = {
  sedentary: 1.2,
  light: 1.375,
  moderate: 1.55,
  active: 1.725,
  'very-active': 1.9,
  'extra-active': 2.0,
};

export const CALORIE_ACTIVITIES: readonly {value: CalorieActivity; label: string}[] = [
  {value: 'sedentary', label: 'Sedentary (little or no exercise)'},
  {value: 'light', label: 'Light (exercise 1-3 days/week)'},
  {value: 'moderate', label: 'Moderate (exercise 3-5 days/week)'},
  {value: 'active', label: 'Active (exercise 6-7 days/week)'},
  {value: 'very-active', label: 'Very Active (hard exercise 6-7 days/week)'},
  {value: 'extra-active', label: 'Extra Active (very hard exercise, physical job)'},
] as const;

export const CALORIE_GOALS: readonly {value: CalorieGoal; label: string; description: string; recommendation: string}[] = [
  {
    value: 'lose-weight-fast',
    label: 'Lose Weight Fast (-1kg/week)',
    description: 'Lose 1kg per week',
    recommendation:
      'A 1000 calorie deficit is aggressive. Ensure you\'re getting adequate protein and nutrients. Consider consulting with a healthcare professional.',
  },
  {
    value: 'lose-weight',
    label: 'Lose Weight (-0.5kg/week)',
    description: 'Lose 0.5kg per week',
    recommendation:
      'A moderate calorie deficit is sustainable for most people. Focus on nutrient-dense foods and regular exercise.',
  },
  {
    value: 'maintain',
    label: 'Maintain Weight',
    description: 'Maintain current weight',
    recommendation:
      'Great! Focus on maintaining a balanced diet and regular physical activity to support your health goals.',
  },
  {
    value: 'gain-weight-slow',
    label: 'Gain Weight Slow (+0.25kg/week)',
    description: 'Gain 0.25kg per week',
    recommendation:
      'A slight calorie surplus with adequate protein will support lean muscle gain. Combine with resistance training.',
  },
  {
    value: 'gain-weight',
    label: 'Gain Weight (+0.5kg/week)',
    description: 'Gain 0.5kg per week',
    recommendation:
      'A moderate calorie surplus supports muscle growth. Ensure adequate protein intake (1.6-2.2g per kg body weight).',
  },
  {
    value: 'gain-weight-fast',
    label: 'Gain Weight Fast (+1kg/week)',
    description: 'Gain 1kg per week',
    recommendation:
      'A 1000 calorie surplus is aggressive. Monitor for excessive fat gain and adjust as needed.',
  },
] as const;

export function validateCalorieValues(
  values: CalorieValues,
): FieldErrors<CalorieValues> {
  const errors: FieldErrors<CalorieValues> = {};
  const age = parseNumber(values.age);
  const weight = parseNumber(values.weight);

  if (age === null || age < 15 || age > 100) {
    errors.age = 'Please enter a valid age (15-100).';
  }

  if (!values.gender) {
    errors.gender = 'Please select your gender.';
  }

  if (weight === null || weight < 30) {
    errors.weight = 'Please enter a valid weight (min 30).';
  }

  if (!values.activityLevel) {
    errors.activityLevel = 'Please select your activity level.';
  }

  if (!values.goal) {
    errors.goal = 'Please select your fitness goal.';
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
      inches === null ||
      feet < 1 ||
      feet > 9 ||
      inches < 0 ||
      inches > 11
    ) {
      errors.height = 'Please enter a valid height in feet (1-9) and inches (0-11).';
    }
  }

  return errors;
}

function goalConfig(
  goal: CalorieGoal,
): {description: string; recommendation: string} {
  const found = CALORIE_GOALS.find((item) => item.value === goal);

  if (!found) {
    return {description: 'Maintain current weight', recommendation: ''};
  }

  return {description: found.description, recommendation: found.recommendation};
}

export function calculateCalories(values: CalorieValues): CalorieResult {
  const age = parseNumber(values.age);
  const weight = parseNumber(values.weight);
  const height = parseNumber(values.height);
  const inches =
    values.heightUnit === 'ft' ? (parseNumber(values.inches) ?? 0) : 0;

  if (
    age === null ||
    age < 15 ||
    age > 100 ||
    !values.gender ||
    weight === null ||
    weight < 30 ||
    height === null ||
    !values.activityLevel ||
    !values.goal
  ) {
    throw new Error('Invalid calorie inputs.');
  }

  if (
    values.heightUnit === 'ft' &&
    (inches === null || inches < 0 || inches > 11)
  ) {
    throw new Error('Invalid calorie inputs.');
  }

  const weightKg = toKilograms(weight, values.weightUnit);
  const heightCm = toCentimeters(height, values.heightUnit, inches);
  let bmr: number;

  if (values.gender === 'male') {
    bmr = 10 * weightKg + 6.25 * heightCm - 5 * age + 5;
  } else {
    bmr = 10 * weightKg + 6.25 * heightCm - 5 * age - 161;
  }

  const multiplier = ACTIVITY_MULTIPLIERS[values.activityLevel];
  const tdee = bmr * multiplier;
  const {description, recommendation} = goalConfig(values.goal);
  let goalCalories = tdee;

  switch (values.goal) {
    case 'lose-weight-fast':
      goalCalories = tdee - 1000;
      break;
    case 'lose-weight':
      goalCalories = tdee - 500;
      break;
    case 'maintain':
      goalCalories = tdee;
      break;
    case 'gain-weight-slow':
      goalCalories = tdee + 250;
      break;
    case 'gain-weight':
      goalCalories = tdee + 500;
      break;
    case 'gain-weight-fast':
      goalCalories = tdee + 1000;
      break;
  }

  const proteinCalories = goalCalories * 0.30;
  const carbsCalories = goalCalories * 0.40;
  const fatsCalories = goalCalories * 0.30;

  return {
    bmr,
    tdee,
    goalCalories,
    goalDescription: description,
    recommendations: recommendation,
    proteinGrams: Math.round(proteinCalories / 4),
    carbsGrams: Math.round(carbsCalories / 4),
    fatsGrams: Math.round(fatsCalories / 9),
    proteinCalories,
    carbsCalories,
    fatsCalories,
    activityLevel: values.activityLevel,
    goal: values.goal,
  };
}
