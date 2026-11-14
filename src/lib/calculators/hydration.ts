import {
  LB_PER_KG,
  parseNumber,
  type WeightUnit,
} from './units';
import type {FieldErrors} from './validation';

export type HydrationGender = 'male' | 'female';

export type HydrationActivity =
  | 'sedentary'
  | 'light'
  | 'moderate'
  | 'active'
  | 'very-active'
  | 'athlete';

export type HydrationClimate =
  | 'temperate'
  | 'hot'
  | 'very-hot'
  | 'cold'
  | 'dry'
  | 'humid';

export type HydrationIntensity = 'light' | 'moderate' | 'vigorous';

export type HydrationCondition =
  | 'pregnancy'
  | 'breastfeeding'
  | 'fever'
  | 'diabetes'
  | 'kidney';

export type HydrationValues = {
  weight: string;
  weightUnit: WeightUnit;
  age: string;
  gender: HydrationGender | '';
  activityLevel: HydrationActivity | '';
  climate: HydrationClimate | '';
  exerciseDuration: string;
  exerciseIntensity: HydrationIntensity;
  healthConditions: readonly HydrationCondition[];
};

export type HydrationBreakdown = {
  base: number;
  activity: number;
  climate: number;
  health: number;
};

export type HydrationScheduleItem = {
  time: string;
  amount: number;
  display: string;
  note: string;
};

export type HydrationTip = {
  title: string;
  body: string;
};

export type HydrationResult = {
  totalOunces: number;
  ouncesDisplay: string;
  liters: string;
  glasses: number;
  breakdown: HydrationBreakdown;
  schedule: readonly HydrationScheduleItem[];
  tips: readonly HydrationTip[];
  recommendations: string;
};

export const HYDRATION_ACTIVITIES: readonly {
  value: HydrationActivity;
  label: string;
}[] = [
  {value: 'sedentary', label: 'Sedentary (little or no exercise)'},
  {value: 'light', label: 'Light (exercise 1-3 days/week)'},
  {value: 'moderate', label: 'Moderate (exercise 3-5 days/week)'},
  {value: 'active', label: 'Active (exercise 6-7 days/week)'},
  {
    value: 'very-active',
    label: 'Very Active (hard exercise 6-7 days/week)',
  },
  {value: 'athlete', label: 'Athlete (elite training 2x/day)'},
] as const;

export const HYDRATION_CLIMATES: readonly {
  value: HydrationClimate;
  label: string;
}[] = [
  {value: 'temperate', label: 'Temperate (moderate temperature)'},
  {value: 'hot', label: 'Hot (warm/hot climate)'},
  {value: 'very-hot', label: 'Very Hot (extreme heat)'},
  {value: 'cold', label: 'Cold (cold climate)'},
  {value: 'dry', label: 'Dry (arid climate)'},
  {value: 'humid', label: 'Humid (high humidity)'},
] as const;

export const HYDRATION_INTENSITIES: readonly {
  value: HydrationIntensity;
  label: string;
}[] = [
  {value: 'light', label: 'Light'},
  {value: 'moderate', label: 'Moderate'},
  {value: 'vigorous', label: 'Vigorous'},
] as const;

export const HYDRATION_CONDITIONS: readonly {
  value: HydrationCondition;
  label: string;
}[] = [
  {value: 'pregnancy', label: 'Pregnancy'},
  {value: 'breastfeeding', label: 'Breastfeeding'},
  {value: 'fever', label: 'Fever/Illness'},
  {value: 'diabetes', label: 'Diabetes'},
  {value: 'kidney', label: 'Kidney Conditions'},
] as const;

export const HYDRATION_ERRORS = {
  weight: 'Please enter a valid body weight (min 30).',
  age: 'Please enter a valid age (15-100).',
  gender: 'Please select your gender.',
  activityLevel: 'Please select your activity level.',
  climate: 'Please select your climate/environment.',
  exerciseDuration:
    'Please enter a valid daily exercise duration (0-300 minutes).',
  exerciseIntensity:
    'Please select exercise intensity if duration is greater than 0.',
} as const;

const ACTIVITY_MULTIPLIERS: Record<HydrationActivity, number> = {
  sedentary: 1.0,
  light: 1.1,
  moderate: 1.2,
  active: 1.3,
  'very-active': 1.4,
  athlete: 1.5,
};

const CLIMATE_ADJUSTMENTS: Record<HydrationClimate, number> = {
  temperate: 0,
  hot: 0.2,
  'very-hot': 0.4,
  cold: -0.1,
  dry: 0.1,
  humid: 0.15,
};

const EXERCISE_OZ_PER_30_MIN: Record<HydrationIntensity, number> = {
  light: 6,
  moderate: 10,
  vigorous: 15,
};

const HEALTH_CONDITION_OUNCES: Record<HydrationCondition, number> = {
  pregnancy: 24,
  breastfeeding: 32,
  fever: 16,
  diabetes: 8,
  kidney: -8,
};

export function validateHydrationValues(
  values: HydrationValues,
): FieldErrors<HydrationValues> {
  const errors: FieldErrors<HydrationValues> = {};
  const weight = parseNumber(values.weight);
  const age = parseNumber(values.age);
  const duration =
    values.exerciseDuration.trim() === ''
      ? 0
      : parseNumber(values.exerciseDuration);

  if (weight === null || weight < 30) {
    errors.weight = HYDRATION_ERRORS.weight;
  }

  if (age === null || age < 15 || age > 100) {
    errors.age = HYDRATION_ERRORS.age;
  }

  if (!values.gender) {
    errors.gender = HYDRATION_ERRORS.gender;
  }

  if (!values.activityLevel) {
    errors.activityLevel = HYDRATION_ERRORS.activityLevel;
  }

  if (!values.climate) {
    errors.climate = HYDRATION_ERRORS.climate;
  }

  if (duration === null || duration < 0 || duration > 300) {
    errors.exerciseDuration = HYDRATION_ERRORS.exerciseDuration;
  } else if (duration > 0 && !values.exerciseIntensity) {
    errors.exerciseIntensity = HYDRATION_ERRORS.exerciseIntensity;
  }

  return errors;
}

function scheduleFor(totalWater: number): HydrationScheduleItem[] {
  const waterPerInterval = Math.round(totalWater / 6);
  const items = [
    {time: 'Upon Waking', amount: waterPerInterval, note: 'Start hydrated'},
    {time: 'Mid-Morning', amount: waterPerInterval, note: 'Between meals'},
    {time: 'Lunch Time', amount: waterPerInterval, note: 'With meal'},
    {time: 'Mid-Afternoon', amount: waterPerInterval, note: 'Stay energized'},
    {time: 'Dinner Time', amount: waterPerInterval, note: 'With meal'},
    {
      time: 'Evening',
      amount: Math.round(totalWater - waterPerInterval * 5),
      note: 'Before bed (small amount)',
    },
  ];

  return items
    .filter((item) => item.amount > 0)
    .map((item) => ({
      ...item,
      display: `${item.amount} oz`,
    }));
}

function hydrationTips(
  climate: HydrationClimate,
  exerciseDuration: number,
  healthConditions: readonly HydrationCondition[],
): HydrationTip[] {
  const tips: HydrationTip[] = [];

  if (climate === 'hot' || climate === 'very-hot') {
    tips.push({
      title: 'Hot Weather Tips',
      body: 'Drink before you feel thirsty. Monitor urine color - aim for pale yellow. Increase intake by 20-40%.',
    });
  }

  if (exerciseDuration > 0) {
    tips.push({
      title: 'Exercise Hydration',
      body: 'Drink 16-24 oz per hour of exercise. Add electrolytes for sessions over 60 minutes or in hot conditions.',
    });
  }

  if (
    healthConditions.includes('pregnancy') ||
    healthConditions.includes('breastfeeding')
  ) {
    tips.push({
      title: 'Pregnancy/Breastfeeding',
      body: 'Increased fluid needs are crucial. Listen to your body and consult your doctor for specific advice.',
    });
  }

  if (healthConditions.includes('kidney')) {
    tips.push({
      title: 'Kidney Conditions',
      body: 'Consult your doctor for specific fluid intake recommendations as needs can vary significantly.',
    });
  }

  tips.push({
    title: 'General Best Practices',
    body: 'Keep a reusable water bottle handy. Drink a glass of water before each meal.',
  });
  tips.push({
    title: 'Water-Rich Foods',
    body: 'Incorporate fruits and vegetables like watermelon, cucumber, and oranges into your diet.',
  });

  return tips;
}

function hydrationRecommendations(
  totalWater: number,
  activityLevel: HydrationActivity,
  climate: HydrationClimate,
  healthConditions: readonly HydrationCondition[],
): string {
  let recommendations = `Your daily hydration need is ${Math.round(totalWater)} ounces (${(totalWater * 0.0295735).toFixed(1)} liters). `;

  if (activityLevel === 'athlete' || activityLevel === 'very-active') {
    recommendations +=
      'As an active individual, prioritize hydration before, during, and after exercise. Consider electrolyte drinks for sessions over 60 minutes. ';
  }

  if (climate === 'hot' || climate === 'very-hot') {
    recommendations +=
      'In hot climates, increase fluid intake and monitor for signs of heat exhaustion. ';
  }

  if (healthConditions.includes('pregnancy')) {
    recommendations +=
      'During pregnancy, stay well-hydrated to support amniotic fluid and blood volume. ';
  }

  if (healthConditions.includes('breastfeeding')) {
    recommendations +=
      'While breastfeeding, drink extra fluids to support milk production. ';
  }

  if (healthConditions.includes('kidney')) {
    recommendations +=
      'Given your health condition, consult a doctor for tailored hydration advice. ';
  } else {
    recommendations +=
      "Spread your fluid intake throughout the day rather than consuming large amounts at once. Listen to your body's thirst signals and adjust intake based on urine color and activity level.";
  }

  return recommendations;
}

export function calculateHydration(
  values: HydrationValues,
): HydrationResult {
  const weight = parseNumber(values.weight);
  const age = parseNumber(values.age);
  const exerciseDuration =
    values.exerciseDuration.trim() === ''
      ? 0
      : parseNumber(values.exerciseDuration);

  if (
    weight === null ||
    weight < 30 ||
    age === null ||
    age < 15 ||
    age > 100 ||
    !values.gender ||
    !values.activityLevel ||
    !values.climate ||
    exerciseDuration === null ||
    exerciseDuration < 0 ||
    exerciseDuration > 300
  ) {
    throw new Error('Invalid hydration inputs.');
  }

  if (exerciseDuration > 0 && !values.exerciseIntensity) {
    throw new Error('Invalid hydration inputs.');
  }

  const weightLbs =
    values.weightUnit === 'kg' ? weight * LB_PER_KG : weight;
  const baseWater = weightLbs * 0.5;
  const activityWater =
    baseWater * (ACTIVITY_MULTIPLIERS[values.activityLevel] - 1) +
    (exerciseDuration / 30) *
      (EXERCISE_OZ_PER_30_MIN[values.exerciseIntensity] ?? 0);
  const climateWater =
    baseWater * (CLIMATE_ADJUSTMENTS[values.climate] ?? 0);
  const healthWater = values.healthConditions.reduce(
    (total, condition) => total + (HEALTH_CONDITION_OUNCES[condition] ?? 0),
    0,
  );
  const totalWater = Math.max(
    0,
    baseWater + activityWater + climateWater + healthWater,
  );

  return {
    totalOunces: totalWater,
    ouncesDisplay: `${Math.round(totalWater)} oz`,
    liters: (totalWater * 0.0295735).toFixed(1),
    glasses: Math.round(totalWater / 8),
    breakdown: {
      base: baseWater,
      activity: activityWater,
      climate: climateWater,
      health: healthWater,
    },
    schedule: scheduleFor(totalWater),
    tips: hydrationTips(
      values.climate,
      exerciseDuration,
      values.healthConditions,
    ),
    recommendations: hydrationRecommendations(
      totalWater,
      values.activityLevel,
      values.climate,
      values.healthConditions,
    ),
  };
}
