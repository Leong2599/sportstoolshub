import {parseNumber, toKilograms, type WeightUnit} from './units';
import type {FieldErrors} from './validation';

export type YogaExperience = 'beginner' | 'intermediate' | 'advanced' | 'expert';

export type YogaStyle =
  | 'hatha'
  | 'vinyasa'
  | 'ashtanga'
  | 'power-yoga'
  | 'bikram'
  | 'yin'
  | 'restorative'
  | 'iyengar'
  | 'kundalini'
  | 'aerial'
  | 'acroyoga';

export type YogaIntensity = 'gentle' | 'moderate' | 'vigorous' | 'extreme';

export type YogaBodyComposition = 'balanced' | 'lean' | 'muscular' | 'higher-fat';

export type YogaFlexibility = 'limited' | 'moderate' | 'good' | 'excellent';

export type YogaBreathing = 'minimal' | 'moderate' | 'intensive';

export type YogaTemperatureUnit = 'celsius' | 'fahrenheit';

export type YogaValues = {
  weight: string;
  weightUnit: WeightUnit;
  gender: 'male' | 'female' | '';
  age: string;
  experience: YogaExperience;
  yogaStyle: YogaStyle | '';
  duration: string;
  intensity: YogaIntensity;
  temperature: string;
  temperatureUnit: YogaTemperatureUnit;
  heartRate: string;
  bodyComposition: YogaBodyComposition;
  flexibility: YogaFlexibility;
  breathing: YogaBreathing;
};

export type YogaBreakdown = {
  baseCalories: number;
  styleCalories: number;
  individualCalories: number;
  basePercent: number;
  stylePercent: number;
  individualPercent: number;
};

export type YogaStyleComparison = {
  style: string;
  calories: number;
  difference: number;
  diffText: string;
};

export type YogaResult = {
  calories: number;
  caloriesPerMinute: number;
  caloriesPerHour: number;
  equivalentWalkingMinutes: number;
  duration: number;
  yogaStyle: YogaStyle;
  yogaStyleLabel: string;
  intensity: YogaIntensity;
  intensityLabel: string;
  recommendation: string;
  breakdown: YogaBreakdown;
  comparisons: readonly YogaStyleComparison[];
};

const YOGA_REQUIRED_ERROR = 'Please fill in all required fields.';

export const YOGA_EXPERIENCES: readonly {value: YogaExperience; label: string}[] = [
  {value: 'beginner', label: 'Beginner (0-6 months)'},
  {value: 'intermediate', label: 'Intermediate (6 months-2 years)'},
  {value: 'advanced', label: 'Advanced (2+ years)'},
  {value: 'expert', label: 'Expert/Teacher (5+ years)'},
] as const;

export const YOGA_STYLES: readonly {value: YogaStyle; label: string}[] = [
  {value: 'hatha', label: 'Hatha Yoga'},
  {value: 'vinyasa', label: 'Vinyasa Flow'},
  {value: 'ashtanga', label: 'Ashtanga Yoga'},
  {value: 'power-yoga', label: 'Power Yoga'},
  {value: 'bikram', label: 'Bikram/Hot Yoga'},
  {value: 'yin', label: 'Yin Yoga'},
  {value: 'restorative', label: 'Restorative Yoga'},
  {value: 'iyengar', label: 'Iyengar Yoga'},
  {value: 'kundalini', label: 'Kundalini Yoga'},
  {value: 'aerial', label: 'Aerial Yoga'},
  {value: 'acroyoga', label: 'Acro Yoga'},
] as const;

export const YOGA_INTENSITIES: readonly {value: YogaIntensity; label: string}[] = [
  {value: 'gentle', label: 'Gentle (Beginner/Restorative)'},
  {value: 'moderate', label: 'Moderate (Intermediate)'},
  {value: 'vigorous', label: 'Vigorous (Advanced/Power)'},
  {value: 'extreme', label: 'Extreme (Hot Yoga/Advanced)'},
] as const;

export const YOGA_BODY_COMPOSITIONS: readonly {value: YogaBodyComposition; label: string}[] = [
  {value: 'balanced', label: 'Balanced'},
  {value: 'lean', label: 'Lean (Low body fat)'},
  {value: 'muscular', label: 'Muscular'},
  {value: 'higher-fat', label: 'Higher body fat'},
] as const;

export const YOGA_FLEXIBILITIES: readonly {value: YogaFlexibility; label: string}[] = [
  {value: 'limited', label: 'Limited'},
  {value: 'moderate', label: 'Moderate'},
  {value: 'good', label: 'Good'},
  {value: 'excellent', label: 'Excellent'},
] as const;

export const YOGA_BREATHING_OPTIONS: readonly {value: YogaBreathing; label: string}[] = [
  {value: 'minimal', label: 'Minimal focus'},
  {value: 'moderate', label: 'Moderate focus'},
  {value: 'intensive', label: 'Intensive pranayama'},
] as const;

export const YOGA_TEMPERATURE_UNITS: readonly {value: YogaTemperatureUnit; label: string}[] = [
  {value: 'celsius', label: '°C'},
  {value: 'fahrenheit', label: '°F'},
] as const;

const STYLE_METS: Record<YogaStyle, Record<YogaIntensity, number>> = {
  hatha: {gentle: 2.0, moderate: 2.5, vigorous: 3.0, extreme: 3.5},
  vinyasa: {gentle: 3.0, moderate: 4.0, vigorous: 5.0, extreme: 6.0},
  ashtanga: {gentle: 3.5, moderate: 4.5, vigorous: 5.5, extreme: 6.5},
  'power-yoga': {gentle: 4.0, moderate: 5.0, vigorous: 6.5, extreme: 7.5},
  bikram: {gentle: 3.5, moderate: 4.5, vigorous: 5.5, extreme: 6.5},
  yin: {gentle: 1.5, moderate: 2.0, vigorous: 2.5, extreme: 3.0},
  restorative: {gentle: 1.5, moderate: 2.0, vigorous: 2.5, extreme: 3.0},
  iyengar: {gentle: 2.0, moderate: 2.5, vigorous: 3.0, extreme: 3.5},
  kundalini: {gentle: 2.5, moderate: 3.0, vigorous: 4.0, extreme: 5.0},
  aerial: {gentle: 3.0, moderate: 4.0, vigorous: 5.0, extreme: 6.0},
  acroyoga: {gentle: 3.5, moderate: 4.5, vigorous: 5.5, extreme: 6.5},
};

const STYLE_NAMES: Record<YogaStyle, string> = {
  hatha: 'Hatha Yoga',
  vinyasa: 'Vinyasa Flow',
  ashtanga: 'Ashtanga Yoga',
  'power-yoga': 'Power Yoga',
  bikram: 'Bikram/Hot Yoga',
  yin: 'Yin Yoga',
  restorative: 'Restorative Yoga',
  iyengar: 'Iyengar Yoga',
  kundalini: 'Kundalini Yoga',
  aerial: 'Aerial Yoga',
  acroyoga: 'Acro Yoga',
};

const EXPERIENCE_MULTIPLIERS: Record<YogaExperience, number> = {
  beginner: 0.85,
  intermediate: 1.0,
  advanced: 1.15,
  expert: 1.25,
};

const BODY_COMPOSITION_MULTIPLIERS: Record<YogaBodyComposition, number> = {
  balanced: 1.0,
  lean: 1.1,
  muscular: 1.15,
  'higher-fat': 0.9,
};

const FLEXIBILITY_MULTIPLIERS: Record<YogaFlexibility, number> = {
  limited: 0.9,
  moderate: 1.0,
  good: 1.05,
  excellent: 1.1,
};

const BREATHING_MULTIPLIERS: Record<YogaBreathing, number> = {
  minimal: 0.95,
  moderate: 1.0,
  intensive: 1.08,
};

const COMPARISON_STYLES: readonly YogaStyle[] = [
  'hatha',
  'vinyasa',
  'ashtanga',
  'power-yoga',
  'yin',
];

export function validateYogaValues(values: YogaValues): FieldErrors<YogaValues> {
  const errors: FieldErrors<YogaValues> = {};
  const weight = parseNumber(values.weight);
  const age = parseNumber(values.age);
  const duration = parseNumber(values.duration);

  if (weight === null || weight < 30) {
    errors.weight = YOGA_REQUIRED_ERROR;
  }

  if (!values.gender) {
    errors.gender = YOGA_REQUIRED_ERROR;
  }

  if (age === null || age < 13 || age > 100) {
    errors.age = YOGA_REQUIRED_ERROR;
  }

  if (!values.yogaStyle) {
    errors.yogaStyle = YOGA_REQUIRED_ERROR;
  }

  if (duration === null || duration < 10 || duration > 180) {
    errors.duration = YOGA_REQUIRED_ERROR;
  }

  const temperature = parseNumber(values.temperature);

  if (
    values.temperature.trim() !== '' &&
    (temperature === null || temperature < 15 || temperature > 45)
  ) {
    errors.temperature = 'Please enter a valid room temperature (15-45).';
  }

  const heartRate = parseNumber(values.heartRate);

  if (
    values.heartRate.trim() !== '' &&
    (heartRate === null || heartRate < 50 || heartRate > 180)
  ) {
    errors.heartRate = 'Please enter a valid average heart rate (50-180).';
  }

  return errors;
}

function getYogaMET(yogaStyle: YogaStyle, intensity: YogaIntensity): number {
  return STYLE_METS[yogaStyle]?.[intensity] ?? 2.5;
}

function formatYogaStyle(style: YogaStyle): string {
  return STYLE_NAMES[style] ?? style;
}

function formatIntensity(intensity: YogaIntensity): string {
  switch (intensity) {
    case 'gentle':
      return 'Gentle';
    case 'moderate':
      return 'Moderate';
    case 'vigorous':
      return 'Vigorous';
    case 'extreme':
      return 'Extreme';
    default:
      return intensity;
  }
}

export function calculateYogaCalories(values: YogaValues): YogaResult {
  const weight = parseNumber(values.weight);
  const age = parseNumber(values.age);
  const duration = parseNumber(values.duration);
  const temperature = parseNumber(values.temperature) || 20;
  const heartRate = parseNumber(values.heartRate) || 0;

  if (
    weight === null ||
    weight < 30 ||
    !values.gender ||
    age === null ||
    age < 13 ||
    age > 100 ||
    !values.yogaStyle ||
    duration === null ||
    duration < 10 ||
    duration > 180
  ) {
    throw new Error(YOGA_REQUIRED_ERROR);
  }

  const weightKg = toKilograms(weight, values.weightUnit);
  let temperatureCelsius = temperature;

  if (values.temperatureUnit === 'fahrenheit') {
    temperatureCelsius = (temperature - 32) * (5 / 9);
  }

  const baseMET = getYogaMET(values.yogaStyle, values.intensity);
  const experienceMultiplier = EXPERIENCE_MULTIPLIERS[values.experience];
  const genderAdjustment = values.gender === 'male' ? 1.0 : 0.95;
  const ageAdjustment = Math.max(0.8, 1.0 - ((age - 25) * 0.003));

  let temperatureAdjustment = 1.0;

  if (temperatureCelsius > 30) {
    temperatureAdjustment = 1.0 + ((temperatureCelsius - 30) * 0.01);
  } else if (temperatureCelsius < 18) {
    temperatureAdjustment = 0.95;
  }

  let heartRateAdjustment = 1.0;

  if (heartRate > 0) {
    const estimatedMETFromHR = (heartRate / 60) * 2.5;
    heartRateAdjustment = Math.min(1.5, estimatedMETFromHR / baseMET);
  }

  const finalMET =
    baseMET *
    experienceMultiplier *
    genderAdjustment *
    ageAdjustment *
    temperatureAdjustment *
    heartRateAdjustment *
    BODY_COMPOSITION_MULTIPLIERS[values.bodyComposition] *
    FLEXIBILITY_MULTIPLIERS[values.flexibility] *
    BREATHING_MULTIPLIERS[values.breathing];

  const hours = duration / 60;
  const calories = Math.round(finalMET * weightKg * hours);
  const caloriesPerMinute = Math.round((calories / duration) * 10) / 10;
  const caloriesPerHour = Math.round((calories / duration) * 60);
  const equivalentWalkingMinutes = Math.round(calories / 4);

  const baseCalories = Math.round(calories * 0.7);
  const styleCalories = Math.round(calories * 0.2);
  const individualCalories = calories - baseCalories - styleCalories;

  const breakdown: YogaBreakdown = {
    baseCalories,
    styleCalories,
    individualCalories,
    basePercent: parseFloat(((baseCalories / calories) * 100).toFixed(1)),
    stylePercent: parseFloat(((styleCalories / calories) * 100).toFixed(1)),
    individualPercent: parseFloat(
      ((individualCalories / calories) * 100).toFixed(1),
    ),
  };

  const comparisons: YogaStyleComparison[] = COMPARISON_STYLES.filter(
    (style) => style !== values.yogaStyle,
  ).map((style) => {
    const styleMET = getYogaMET(style, 'moderate');
    const estimatedCalories = Math.round(styleMET * 70 * (duration / 60));
    const difference = estimatedCalories - calories;
    const diffText = difference > 0 ? `+${difference}` : `${difference}`;

    return {
      style: formatYogaStyle(style),
      calories: estimatedCalories,
      difference,
      diffText,
    };
  });

  let recommendations = `Your ${duration}-minute ${formatYogaStyle(
    values.yogaStyle,
  )} session burned ${calories} calories. `;

  if (calories < 50) {
    recommendations +=
      'This was a gentle, restorative practice. Perfect for flexibility, stress relief, and recovery days.';
  } else if (calories < 150) {
    recommendations +=
      'This was a moderate yoga practice providing good benefits for both physical fitness and mental well-being.';
  } else if (calories < 250) {
    recommendations +=
      'Excellent calorie burn! This vigorous yoga session contributed significantly to your daily energy expenditure while providing mind-body benefits.';
  } else {
    recommendations +=
      'Outstanding calorie burn for yoga! This intense session provided excellent physical conditioning while maintaining yoga\'s mental and spiritual benefits.';
  }

  recommendations +=
    ' Remember that yoga offers benefits beyond calorie burn, including improved flexibility, balance, strength, and mental clarity. ';

  if (values.intensity === 'gentle' || values.intensity === 'moderate') {
    recommendations +=
      'Consider adding more vigorous sessions or longer durations for increased calorie burn.';
  } else {
    recommendations +=
      'Maintain consistency with your practice while allowing for gentler sessions for recovery.';
  }

  return {
    calories,
    caloriesPerMinute,
    caloriesPerHour,
    equivalentWalkingMinutes,
    duration,
    yogaStyle: values.yogaStyle,
    yogaStyleLabel: formatYogaStyle(values.yogaStyle),
    intensity: values.intensity,
    intensityLabel: formatIntensity(values.intensity),
    recommendation: recommendations,
    breakdown,
    comparisons,
  };
}
