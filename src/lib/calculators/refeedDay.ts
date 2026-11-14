import {parseNumber} from './units';
import type {FieldErrors} from './validation';

export type RefeedGender = 'male' | 'female';

export type RefeedTrainingType =
  | 'strength'
  | 'endurance'
  | 'mixed'
  | 'hiit'
  | 'sports';

export type RefeedIntensity = 'low' | 'moderate' | 'high' | 'very-high';

export type RefeedFrequency =
  | 'never'
  | 'weekly'
  | '10days'
  | '2weeks'
  | '3weeks'
  | 'monthly';

export type RefeedStyle = 'moderate' | 'aggressive' | 'conservative';

export type RefeedTiming =
  | 'rest-day'
  | 'light-training'
  | 'post-leg-day'
  | 'heavy-training'
  | 'flexible';

export type RefeedCarbSensitivity =
  | 'normal'
  | 'sensitive'
  | 'resistant'
  | 'unknown';

export type RefeedValues = {
  gender: RefeedGender;
  age: string;
  currentWeight: string;
  bodyFat: string;
  maintenanceCalories: string;
  cuttingCalories: string;
  cuttingProtein: string;
  cuttingCarbs: string;
  cuttingFats: string;
  weeksDieting: string;
  trainingFrequency: string;
  trainingIntensity: RefeedIntensity | '';
  primaryTraining: RefeedTrainingType | '';
  cardioAmount: string;
  refeedFrequency: RefeedFrequency | '';
  refeedStyle: RefeedStyle;
  refeedTiming: RefeedTiming;
  carbSensitivity: RefeedCarbSensitivity;
};

export type RefeedMacro = {
  label: string;
  grams: number;
  display: string;
};

export type RefeedScheduleItem = {
  label: string;
  value: string;
};

export type RefeedFoodItem = {
  name: string;
  portion: string;
  carbs: string;
};

export type RefeedGuidanceItem = {
  title: string;
  body: string;
};

export type RefeedResult = {
  recommendedFrequency: RefeedFrequency;
  frequencyLabel: string;
  frequencyIntervalDays: number;
  nextRefeedIn: string;
  styleLabel: string;
  calorieSurplusPercent: number;
  refeedCalories: number;
  calorieDifference: number;
  macros: readonly RefeedMacro[];
  proteinGrams: number;
  carbGrams: number;
  fatGrams: number;
  schedule: readonly RefeedScheduleItem[];
  foods: readonly RefeedFoodItem[];
  timing: readonly RefeedGuidanceItem[];
  postRefeed: readonly RefeedGuidanceItem[];
  progression: readonly RefeedGuidanceItem[];
};

export const REFEED_TRAINING_TYPES: readonly {
  value: RefeedTrainingType;
  label: string;
}[] = [
  {value: 'strength', label: 'Strength Training'},
  {value: 'endurance', label: 'Endurance/Cardio'},
  {value: 'mixed', label: 'Mixed Training'},
  {value: 'hiit', label: 'HIIT/Metabolic'},
  {value: 'sports', label: 'Team Sports'},
] as const;

export const REFEED_INTENSITIES: readonly {
  value: RefeedIntensity;
  label: string;
}[] = [
  {value: 'low', label: 'Low (Light, recovery-focused)'},
  {value: 'moderate', label: 'Moderate (Standard training)'},
  {value: 'high', label: 'High (Intense, demanding)'},
  {value: 'very-high', label: 'Very High (Elite level)'},
] as const;

export const REFEED_FREQUENCIES: readonly {
  value: RefeedFrequency;
  label: string;
}[] = [
  {value: 'never', label: 'Never - First refeed'},
  {value: 'weekly', label: 'Weekly (Every 7 days)'},
  {value: '10days', label: 'Every 10 days'},
  {value: '2weeks', label: 'Every 2 weeks'},
  {value: '3weeks', label: 'Every 3 weeks'},
  {value: 'monthly', label: 'Monthly'},
] as const;

export const REFEED_STYLES: readonly {
  value: RefeedStyle;
  label: string;
}[] = [
  {value: 'moderate', label: 'Moderate (30-50% above maintenance)'},
  {value: 'aggressive', label: 'Aggressive (50-75% above maintenance)'},
  {value: 'conservative', label: 'Conservative (20-30% above maintenance)'},
] as const;

export const REFEED_TIMINGS: readonly {
  value: RefeedTiming;
  label: string;
}[] = [
  {value: 'rest-day', label: 'Rest day (Recommended)'},
  {value: 'light-training', label: 'Light training day'},
  {value: 'post-leg-day', label: 'After leg day'},
  {value: 'heavy-training', label: 'Heavy training day'},
  {value: 'flexible', label: 'Flexible - whichever works'},
] as const;

export const REFEED_CARB_SENSITIVITY: readonly {
  value: RefeedCarbSensitivity;
  label: string;
}[] = [
  {value: 'normal', label: 'Normal (Can handle carbs well)'},
  {
    value: 'sensitive',
    label: 'Sensitive (Prone to bloating/water retention)',
  },
  {value: 'resistant', label: 'Resistant (Minimal water retention)'},
  {value: 'unknown', label: 'Not sure yet'},
] as const;

export const REFEED_ERRORS = {
  age: 'Please enter an age between 18 and 80.',
  currentWeight: 'Please enter a current weight between 40 and 200 kg.',
  bodyFat: 'Please enter a body fat percentage between 5 and 50.',
  maintenanceCalories:
    'Please enter maintenance calories between 1200 and 5000.',
  cuttingCalories:
    'Please enter current cutting calories between 1200 and 5000.',
  cuttingProtein: 'Please enter cutting protein between 50 and 400 g.',
  cuttingCarbs: 'Please enter cutting carbs between 20 and 500 g.',
  cuttingFats: 'Please enter cutting fats between 20 and 200 g.',
  weeksDieting: 'Please enter weeks dieting between 0 and 52.',
  trainingFrequency: 'Please select your training days per week.',
  trainingIntensity: 'Please select your training intensity.',
  primaryTraining: 'Please select your primary training type.',
  cardioAmount: 'Please enter weekly cardio between 0 and 600 minutes.',
  refeedFrequency: 'Please select your current refeed frequency.',
} as const;

const FREQUENCY_INTERVALS: Record<RefeedFrequency, number> = {
  never: 0,
  weekly: 7,
  '10days': 10,
  '2weeks': 14,
  '3weeks': 21,
  monthly: 30,
};

const FREQUENCY_LABELS: Record<RefeedFrequency, string> = {
  never: 'Never - First refeed',
  weekly: 'Weekly (Every 7 days)',
  '10days': 'Every 10 days',
  '2weeks': 'Every 2 weeks',
  '3weeks': 'Every 3 weeks',
  monthly: 'Monthly',
};

const STYLE_PERCENT: Record<RefeedStyle, number> = {
  conservative: 25,
  moderate: 40,
  aggressive: 62,
};

const STYLE_LABELS: Record<RefeedStyle, string> = {
  conservative: 'Conservative (20-30% above maintenance)',
  moderate: 'Moderate (30-50% above maintenance)',
  aggressive: 'Aggressive (50-75% above maintenance)',
};

const SENSITIVITY_PERCENT: Record<RefeedCarbSensitivity, number> = {
  sensitive: 0.8,
  normal: 1,
  resistant: 1.1,
  unknown: 0.9,
};

export function validateRefeedValues(
  values: RefeedValues,
): FieldErrors<RefeedValues> {
  const errors: FieldErrors<RefeedValues> = {};
  const age = parseNumber(values.age);
  const weight = parseNumber(values.currentWeight);
  const bodyFat = values.bodyFat.trim() === '' ? null : parseNumber(values.bodyFat);
  const maintenance = parseNumber(values.maintenanceCalories);
  const cutting = parseNumber(values.cuttingCalories);
  const protein = parseNumber(values.cuttingProtein);
  const carbs = parseNumber(values.cuttingCarbs);
  const fats = parseNumber(values.cuttingFats);
  const weeks = parseNumber(values.weeksDieting);
  const cardio =
    values.cardioAmount.trim() === '' ? 0 : parseNumber(values.cardioAmount);

  if (age === null || age < 18 || age > 80) {
    errors.age = REFEED_ERRORS.age;
  }

  if (weight === null || weight < 40 || weight > 200) {
    errors.currentWeight = REFEED_ERRORS.currentWeight;
  }

  if (bodyFat !== null && (bodyFat < 5 || bodyFat > 50)) {
    errors.bodyFat = REFEED_ERRORS.bodyFat;
  }

  if (maintenance === null || maintenance < 1200 || maintenance > 5000) {
    errors.maintenanceCalories = REFEED_ERRORS.maintenanceCalories;
  }

  if (cutting === null || cutting < 1200 || cutting > 5000) {
    errors.cuttingCalories = REFEED_ERRORS.cuttingCalories;
  }

  if (protein === null || protein < 50 || protein > 400) {
    errors.cuttingProtein = REFEED_ERRORS.cuttingProtein;
  }

  if (carbs === null || carbs < 20 || carbs > 500) {
    errors.cuttingCarbs = REFEED_ERRORS.cuttingCarbs;
  }

  if (fats === null || fats < 20 || fats > 200) {
    errors.cuttingFats = REFEED_ERRORS.cuttingFats;
  }

  if (weeks === null || weeks < 0 || weeks > 52) {
    errors.weeksDieting = REFEED_ERRORS.weeksDieting;
  }

  if (!values.trainingFrequency) {
    errors.trainingFrequency = REFEED_ERRORS.trainingFrequency;
  }

  if (!values.trainingIntensity) {
    errors.trainingIntensity = REFEED_ERRORS.trainingIntensity;
  }

  if (!values.primaryTraining) {
    errors.primaryTraining = REFEED_ERRORS.primaryTraining;
  }

  if (cardio === null || cardio < 0 || cardio > 600) {
    errors.cardioAmount = REFEED_ERRORS.cardioAmount;
  }

  if (!values.refeedFrequency) {
    errors.refeedFrequency = REFEED_ERRORS.refeedFrequency;
  }

  return errors;
}

function recommendedFrequency(values: RefeedValues): RefeedFrequency {
  const current = values.refeedFrequency as RefeedFrequency;
  const weeks = parseNumber(values.weeksDieting) ?? 0;
  const intensity = values.trainingIntensity as RefeedIntensity;

  if (current === 'never') {
    return weeks >= 8 ? '2weeks' : 'weekly';
  }

  if (weeks >= 12 && current === 'monthly') {
    return '3weeks';
  }

  if (
    weeks >= 16 &&
    (intensity === 'high' || intensity === 'very-high') &&
    (current === '3weeks' || current === 'monthly')
  ) {
    return '2weeks';
  }

  return current;
}

function nextRefeedLabel(intervalDays: number): string {
  if (intervalDays <= 0) {
    return 'Start your first refeed this week';
  }

  if (intervalDays === 7) {
    return 'In 7 days';
  }

  return `In ${intervalDays} days`;
}

function buildSchedule(
  values: RefeedValues,
  frequency: RefeedFrequency,
  intervalDays: number,
  refeedCalories: number,
  difference: number,
  weeks: number,
): RefeedScheduleItem[] {
  const sensitivity = values.carbSensitivity;
  const items: RefeedScheduleItem[] = [
    {
      label: 'Recommended Frequency',
      value: FREQUENCY_LABELS[frequency],
    },
    {
      label: 'Next Refeed',
      value: nextRefeedLabel(intervalDays),
    },
    {
      label: 'Refeed Day Calories',
      value: `${refeedCalories} cal`,
    },
    {
      label: 'Difference From Cutting',
      value: `+${difference} cal`,
    },
    {
      label: 'Weeks Dieting',
      value: `${weeks} weeks`,
    },
  ];

  if (sensitivity === 'sensitive') {
    items.push({
      label: 'Water Retention Expectation',
      value: 'Expect 0.5-1.5kg scale change for 3-5 days',
    });
  } else if (sensitivity === 'resistant') {
    items.push({
      label: 'Water Retention Expectation',
      value: 'Minimal - under 0.5kg scale change',
    });
  } else if (sensitivity === 'unknown') {
    items.push({
      label: 'Water Retention Expectation',
      value: 'Track your scale trend over 3 refeeds to learn your response',
    });
  }

  return items;
}

function buildFoods(
  values: RefeedValues,
  carbGrams: number,
): RefeedFoodItem[] {
  const style = values.refeedStyle;
  const scale = carbGrams / 300;
  const items: RefeedFoodItem[] = [
    {
      name: 'White rice (cooked)',
      portion: `${Math.max(100, Math.round(150 * scale))}g`,
      carbs: `${Math.round(39 * scale)}g carbs`,
    },
    {
      name: 'Pasta (cooked)',
      portion: `${Math.max(100, Math.round(150 * scale))}g`,
      carbs: `${Math.round(37 * scale)}g carbs`,
    },
    {
      name: 'Potatoes (boiled)',
      portion: `${Math.max(100, Math.round(200 * scale))}g`,
      carbs: `${Math.round(31 * scale)}g carbs`,
    },
    {
      name: 'Oats (dry)',
      portion: `${Math.max(50, Math.round(80 * scale))}g`,
      carbs: `${Math.round(54 * scale)}g carbs`,
    },
    {
      name: 'Bananas',
      portion: `${Math.max(2, Math.round(2 * scale))}`,
      carbs: `${Math.round(27 * scale)}g carbs`,
    },
    {
      name: 'Dates',
      portion: `${Math.max(3, Math.round(4 * scale))}`,
      carbs: `${Math.round(32 * scale)}g carbs`,
    },
  ];

  if (style === 'aggressive') {
    items.push({
      name: 'White bread with honey',
      portion: '3 slices + 30g honey',
      carbs: '75g carbs',
    });
  }

  return items;
}

function buildTiming(values: RefeedValues): RefeedGuidanceItem[] {
  const timing = values.refeedTiming;
  const training = values.primaryTraining as RefeedTrainingType;
  const items: RefeedGuidanceItem[] = [];

  if (timing === 'rest-day') {
    items.push({
      title: 'Rest Day Refeed',
      body: 'A rest day lets you eat the surplus without competing with training fatigue. Keep the session light and let the glycogen refill.',
    });
  } else if (timing === 'light-training') {
    items.push({
      title: 'Light Training Day',
      body: 'Pair the refeed with an easy session so the extra carbohydrates drive glycogen resynthesis rather than adding fatigue.',
    });
  } else if (timing === 'post-leg-day') {
    items.push({
      title: 'After Leg Day',
      body: 'Leg day depletes glycogen hardest, so a post-leg refeed targets the muscles that need it most. Keep protein steady and let carbs do the work.',
    });
  } else if (timing === 'heavy-training') {
    items.push({
      title: 'Heavy Training Day',
      body: 'A heavy session plus a refeed is a large single-day swing. Front-load the carbohydrates in the meal before training and keep the rest of the day lighter.',
    });
  } else {
    items.push({
      title: 'Flexible Timing',
      body: 'Pick the refeed day after the most draining session of the week, so the surplus lands when recovery demand is highest.',
    });
  }

  if (training === 'endurance') {
    items.push({
      title: 'Endurance Sessions',
      body: 'Long sessions drain glycogen directly. Refeed on or just after a long endurance day to refill the tank you emptied.',
    });
  }

  if (training === 'strength') {
    items.push({
      title: 'Strength Sessions',
      body: 'Keep protein unchanged across the refeed. The extra calories should come from carbohydrates, not from a protein spike.',
    });
  }

  return items;
}

function buildPostRefeed(values: RefeedValues): RefeedGuidanceItem[] {
  const sensitivity = values.carbSensitivity;

  return [
    {
      title: 'Return To Cutting Calories The Next Day',
      body: 'A refeed is a single-day event. Drop straight back to your cutting calories the following morning to keep the fat-loss trend intact.',
    },
    {
      title: 'Do Not Chase The Scale',
      body:
        sensitivity === 'sensitive'
          ? 'Carbohydrate refeeds pull water into the muscle glycogen stores. Expect the scale to rise for 3-5 days and judge progress on the weekly average instead.'
          : 'Glycogen stores hold water. Judge progress on the weekly average and on how the clothes fit, not on the day-after reading.',
    },
    {
      title: 'Keep Protein Constant',
      body: 'Protein should not move on a refeed day. Changing it makes the comparison to a normal cutting day meaningless.',
    },
    {
      title: 'Refeed Before You Stall',
      body: 'Use a refeed to break a two-week plateau, not as a reward. If the scale has not moved for 14 days, that is the trigger.',
    },
  ];
}

function buildProgression(values: RefeedValues): RefeedGuidanceItem[] {
  const weeks = parseNumber(values.weeksDieting) ?? 0;
  const items: RefeedGuidanceItem[] = [];

  if (weeks < 4) {
    items.push({
      title: 'Still Early In The Cut',
      body: 'Under 4 weeks of dieting, hormones are still responding normally. Hold the refeed frequency steady and re-evaluate after 6 weeks.',
    });
  } else if (weeks < 8) {
    items.push({
      title: 'Approaching The Adaptation Window',
      body: 'Between 4 and 8 weeks, leptin and thyroid output begin to drift down. Keep the refeed weekly and watch energy, mood, and training output.',
    });
  } else if (weeks < 12) {
    items.push({
      title: 'Refeed More Often',
      body: 'Past 8 weeks, a weekly refeed is usually the minimum that keeps hormones responsive. Consider moving to every 10 days if output drops.',
    });
  } else {
    items.push({
      title: 'Long Cut - Prioritise Recovery',
      body: 'Beyond 12 weeks, recovery quality dominates. Keep the refeed, add a diet break every 6-8 weeks, and reduce the training volume before the calories.',
    });
  }

  if (values.carbSensitivity === 'unknown') {
    items.push({
      title: 'Learn Your Response',
      body: 'Run three refeeds at the same size and compare your 3-day weight average with your 3-day average before a refeed. That is your personal response.',
    });
  }

  items.push({
    title: 'Escalate Only With Data',
    body: 'Increase the refeed size only after two consecutive weeks of no progress at the current frequency and size.',
  });

  return items;
}

export function calculateRefeed(values: RefeedValues): RefeedResult {
  const errors = validateRefeedValues(values);

  if (Object.keys(errors).length > 0) {
    throw new Error('Invalid refeed inputs.');
  }

  const maintenance = parseNumber(values.maintenanceCalories) as number;
  const cutting = parseNumber(values.cuttingCalories) as number;
  const cuttingProtein = parseNumber(values.cuttingProtein) as number;
  const cuttingCarbs = parseNumber(values.cuttingCarbs) as number;
  const cuttingFats = parseNumber(values.cuttingFats) as number;
  const weeks = parseNumber(values.weeksDieting) ?? 0;
  const style = values.refeedStyle;
  const sensitivity = values.carbSensitivity;

  const percent = Math.round(
    STYLE_PERCENT[style] * SENSITIVITY_PERCENT[sensitivity],
  );
  const refeedCalories = Math.round(maintenance * (1 + percent / 100));
  const difference = refeedCalories - cutting;

  const proteinGrams = cuttingProtein;
  const fatGrams = cuttingFats;
  const carbCalories = Math.max(
    0,
    refeedCalories - proteinGrams * 4 - fatGrams * 4,
  );
  const carbGrams = Math.round(carbCalories / 4);
  const frequency = recommendedFrequency(values);
  const intervalDays = FREQUENCY_INTERVALS[frequency];

  return {
    recommendedFrequency: frequency,
    frequencyLabel: FREQUENCY_LABELS[frequency],
    frequencyIntervalDays: intervalDays,
    nextRefeedIn: nextRefeedLabel(intervalDays),
    styleLabel: STYLE_LABELS[style],
    calorieSurplusPercent: percent,
    refeedCalories,
    calorieDifference: difference,
    macros: [
      {label: 'Calories', grams: refeedCalories, display: `${refeedCalories} cal`},
      {
        label: 'Protein',
        grams: proteinGrams,
        display: `${proteinGrams}g`,
      },
      {label: 'Carbs', grams: carbGrams, display: `${carbGrams}g`},
      {label: 'Fats', grams: fatGrams, display: `${fatGrams}g`},
    ],
    proteinGrams,
    carbGrams,
    fatGrams,
    schedule: buildSchedule(
      values,
      frequency,
      intervalDays,
      refeedCalories,
      difference,
      weeks,
    ),
    foods: buildFoods(values, carbGrams),
    timing: buildTiming(values),
    postRefeed: buildPostRefeed(values),
    progression: buildProgression(values),
  };
}
