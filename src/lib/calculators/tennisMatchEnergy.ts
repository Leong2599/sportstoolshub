import {parseNumber} from './units';
import {rangeError} from './sportValidation';
import type {FieldErrors} from './validation';

export type TennisDurationUnit = 'minutes' | 'hours';

export type TennisWeightUnit = 'kg' | 'lbs';

export type TennisPlayingStyle =
  | 'serve-volley'
  | 'aggressive-baseline'
  | 'counter-puncher'
  | 'all-court';

export type TennisSurface = 'hard-court' | 'clay' | 'grass' | 'carpet';

export type TennisIntensity = 'casual' | 'moderate' | 'high' | 'professional';

export type TennisTemperatureUnit = 'celsius' | 'fahrenheit';

export type TennisMatchEnergyValues = {
  matchDuration: string;
  durationUnit: TennisDurationUnit;
  bodyWeight: string;
  weightUnit: TennisWeightUnit;
  playingStyle: TennisPlayingStyle | '';
  surface: TennisSurface | '';
  intensity: TennisIntensity | '';
  ralliesPerGame: string;
  temperature: string;
  temperatureUnit: TennisTemperatureUnit;
  humidity: string;
};

export type TennisMatchEnergyResult = {
  totalCalories: number;
  totalCaloriesDisplay: string;
  netCalories: number;
  netCaloriesDisplay: string;
  caloriesPerMinute: number;
  caloriesPerMinuteDisplay: string;
  metValue: number;
  metValueDisplay: string;
  distanceCovered: number;
  distanceCoveredDisplay: string;
  hydrationNeeds: number;
  hydrationNeedsDisplay: string;
  recoveryTime: string;
  glycogenDepletion: number;
  glycogenDepletionDisplay: string;
  electrolyteLoss: number;
  electrolyteLossDisplay: string;
  activePlayingTime: number;
  activePlayingTimeDisplay: string;
  energyDensity: number;
  energyDensityDisplay: string;
  insights: readonly string[];
  recommendations: readonly string[];
};

export const TENNIS_DURATION_UNITS: readonly {
  value: TennisDurationUnit;
  label: string;
}[] = [
  {value: 'minutes', label: 'minutes'},
  {value: 'hours', label: 'hours'},
] as const;

export const TENNIS_WEIGHT_UNITS: readonly {
  value: TennisWeightUnit;
  label: string;
}[] = [
  {value: 'kg', label: 'kg'},
  {value: 'lbs', label: 'lbs'},
] as const;

export const TENNIS_PLAYING_STYLES: readonly {
  value: TennisPlayingStyle;
  label: string;
}[] = [
  {value: 'serve-volley', label: 'Serve-and-Volley'},
  {value: 'aggressive-baseline', label: 'Aggressive Baseline'},
  {value: 'counter-puncher', label: 'Counter-Puncher'},
  {value: 'all-court', label: 'All-Court Player'},
] as const;

export const TENNIS_SURFACES: readonly {value: TennisSurface; label: string}[] = [
  {value: 'hard-court', label: 'Hard Court'},
  {value: 'clay', label: 'Clay Court'},
  {value: 'grass', label: 'Grass Court'},
  {value: 'carpet', label: 'Carpet Court'},
] as const;

export const TENNIS_INTENSITIES: readonly {
  value: TennisIntensity;
  label: string;
}[] = [
  {value: 'casual', label: 'Casual/Social Play'},
  {value: 'moderate', label: 'Club/League Match'},
  {value: 'high', label: 'Tournament Match'},
  {value: 'professional', label: 'Professional Level'},
] as const;

export const TENNIS_TEMPERATURE_UNITS: readonly {
  value: TennisTemperatureUnit;
  label: string;
}[] = [
  {value: 'celsius', label: '°C'},
  {value: 'fahrenheit', label: '°F'},
] as const;

export const TENNIS_ERRORS = {
  matchDuration: 'Please enter a valid match duration.',
  bodyWeight: 'Please enter a valid body weight.',
  playingStyle: 'Please select a playing style.',
  surface: 'Please select a court surface.',
  intensity: 'Please select a match intensity.',
  ralliesPerGame: 'Please enter a valid number of rallies per game.',
  temperature: 'Please enter a valid temperature.',
  humidity: 'Please enter a valid humidity.',
} as const;

const LB_PER_KG = 2.20462;

const BASE_MET_VALUES: Record<TennisIntensity, number> = {
  casual: 6.0,
  moderate: 8.0,
  high: 10.0,
  professional: 13.0,
};

const STYLE_MULTIPLIERS: Record<TennisPlayingStyle, number> = {
  'serve-volley': 0.9,
  'aggressive-baseline': 1.1,
  'counter-puncher': 1.0,
  'all-court': 1.05,
};

const SURFACE_MULTIPLIERS: Record<TennisSurface, number> = {
  'hard-court': 1.0,
  clay: 1.15,
  grass: 1.1,
  carpet: 0.95,
};

const DISTANCE_STYLE_FACTORS: Record<TennisPlayingStyle, number> = {
  'serve-volley': 0.8,
  'aggressive-baseline': 1.1,
  'counter-puncher': 1.0,
  'all-court': 1.05,
};

const DISTANCE_SURFACE_FACTORS: Record<TennisSurface, number> = {
  'hard-court': 1.0,
  clay: 1.15,
  grass: 0.95,
  carpet: 1.0,
};

export function validateTennisMatchEnergyValues(
  values: TennisMatchEnergyValues,
): FieldErrors<TennisMatchEnergyValues> {
  const errors: FieldErrors<TennisMatchEnergyValues> = {};

  const matchDuration = parseNumber(values.matchDuration);

  if (matchDuration === null) {
    errors.matchDuration = TENNIS_ERRORS.matchDuration;
  } else if (matchDuration <= 0) {
    errors.matchDuration = rangeError('match duration', 0, 1440);
  }

  const bodyWeight = parseNumber(values.bodyWeight);

  if (bodyWeight === null) {
    errors.bodyWeight = TENNIS_ERRORS.bodyWeight;
  } else if (bodyWeight < 30 || bodyWeight > 200) {
    errors.bodyWeight = rangeError('body weight', 30, 200);
  }

  if (!values.playingStyle) {
    errors.playingStyle = TENNIS_ERRORS.playingStyle;
  }

  if (!values.surface) {
    errors.surface = TENNIS_ERRORS.surface;
  }

  if (!values.intensity) {
    errors.intensity = TENNIS_ERRORS.intensity;
  }

  const rallies = parseNumber(values.ralliesPerGame);

  if (rallies === null) {
    errors.ralliesPerGame = TENNIS_ERRORS.ralliesPerGame;
  } else if (rallies < 1 || rallies > 100) {
    errors.ralliesPerGame = rangeError('rallies per game', 1, 100);
  }

  const temperature = parseNumber(values.temperature);

  if (temperature === null) {
    errors.temperature = TENNIS_ERRORS.temperature;
  } else if (temperature < -10 || temperature > 50) {
    errors.temperature = rangeError('temperature', -10, 50);
  }

  const humidity = parseNumber(values.humidity);

  if (humidity === null) {
    errors.humidity = TENNIS_ERRORS.humidity;
  } else if (humidity < 0 || humidity > 100) {
    errors.humidity = rangeError('humidity', 0, 100);
  }

  return errors;
}

export function getBaseMETs(intensity: TennisIntensity): number {
  return BASE_MET_VALUES[intensity] || 8.0;
}

export function getStyleMultiplier(
  style: TennisPlayingStyle,
  rallies: number,
): number {
  const baseMultiplier = STYLE_MULTIPLIERS[style] ?? 1.0;
  const rallyMultiplier =
    rallies > 8 ? 1.1 : rallies < 4 ? 0.95 : 1.0;

  return baseMultiplier * rallyMultiplier;
}

export function getSurfaceMultiplier(surface: TennisSurface): number {
  return SURFACE_MULTIPLIERS[surface] || 1.0;
}

export function getEnvironmentalFactor(
  temp: number,
  humidity: number,
): number {
  let factor = 1.0;

  if (temp > 30) factor *= 1.2;
  else if (temp > 25) factor *= 1.1;
  else if (temp < 10) factor *= 1.05;

  if (humidity > 70) factor *= 1.1;
  else if (humidity < 30) factor *= 0.95;

  return factor;
}

export function calculateTennisDistanceCovered(
  duration: number,
  style: TennisPlayingStyle,
  surface: TennisSurface,
): number {
  const baseDistance = duration * 0.06;

  return (
    baseDistance *
    (DISTANCE_STYLE_FACTORS[style] || 1.0) *
    (DISTANCE_SURFACE_FACTORS[surface] || 1.0)
  );
}

export function calculateTennisHydrationNeeds(
  duration: number,
  intensity: TennisIntensity,
  temp: number,
  humidity: number,
): number {
  let baseHydration = duration * 0.6;

  if (intensity === 'high' || intensity === 'professional') {
    baseHydration *= 1.3;
  } else if (intensity === 'moderate') {
    baseHydration *= 1.15;
  }

  if (temp > 25) baseHydration *= 1.2;
  if (humidity > 70) baseHydration *= 1.1;

  return baseHydration;
}

export function calculateTennisRecoveryTime(
  calories: number,
  duration: number,
  intensity: TennisIntensity,
): string {
  let recoveryHours = duration / 60;

  if (calories > 800) recoveryHours *= 1.5;
  else if (calories > 500) recoveryHours *= 1.2;

  if (intensity === 'professional') recoveryHours *= 1.3;
  else if (intensity === 'high') recoveryHours *= 1.2;

  return `${Math.round(recoveryHours * 24)}-${Math.round(recoveryHours * 36)} hours`;
}

export function calculateGlycogenDepletion(
  calories: number,
): number {
  const carbsUsed = calories * 0.6;

  return carbsUsed / 4;
}

export function calculateElectrolyteLoss(
  duration: number,
  temp: number,
  humidity: number,
): number {
  let baseLoss = duration * 0.5;

  if (temp > 25) baseLoss *= 1.5;
  if (humidity > 70) baseLoss *= 1.2;

  return baseLoss;
}

export function generateTennisInsights(
  calories: number,
  intensity: TennisIntensity,
  duration: number,
  style: TennisPlayingStyle,
  temp: number,
): string[] {
  const insights: string[] = [];

  if (calories > 1000) {
    insights.push(
      'High-calorie burn - excellent for fitness and weight management',
    );
  } else if (calories < 300) {
    insights.push('Lower intensity session - good for technique practice');
  }

  if (duration > 120) {
    insights.push('Extended match duration - focus on endurance recovery');
  }

  if (style === 'aggressive-baseline') {
    insights.push(
      'Aggressive baseline style maximizes calorie expenditure',
    );
  }

  if (temp > 25) {
    insights.push(
      'Hot conditions increase energy demand and hydration needs',
    );
  }

  if (intensity === 'professional') {
    insights.push(
      'Professional-level intensity requires elite recovery strategies',
    );
  }

  return insights;
}

export function generateTennisRecommendations(
  calories: number,
  hydration: number,
  recovery: string,
  glycogen: number,
  intensity: TennisIntensity,
): string[] {
  const recommendations: string[] = [];

  if (calories > 600) {
    recommendations.push(
      'Consume 300-500 calories within 30 minutes post-match',
    );
    recommendations.push(
      'Focus on 3:1 or 4:1 carb-to-protein ratio for recovery',
    );
  } else if (calories > 300) {
    recommendations.push(
      'Consume 200-300 calories within 60 minutes post-match',
    );
  }

  if (hydration > 1000) {
    recommendations.push(
      'Aggressive hydration strategy needed - 150% of fluid loss',
    );
    recommendations.push('Include electrolyte replacement drinks');
  } else {
    recommendations.push('Maintain regular hydration throughout recovery');
  }

  if (recovery.includes('48') || recovery.includes('72')) {
    recommendations.push('Schedule adequate rest before next intense session');
    recommendations.push('Include active recovery on light days');
  }

  if (glycogen > 100) {
    recommendations.push(
      'Significant glycogen depletion - carb-rich meals needed',
    );
    recommendations.push(
      'Consider 1.2-1.5g carbs per kg body weight post-match',
    );
  }

  if (intensity === 'professional') {
    recommendations.push(
      'Professional recovery protocol: ice bath, compression, massage',
    );
  } else if (intensity === 'high') {
    recommendations.push(
      'Include foam rolling and light stretching in recovery',
    );
  }

  return recommendations;
}

export function calculateTennisMatchEnergy(
  values: TennisMatchEnergyValues,
): TennisMatchEnergyResult {
  if (!values.playingStyle) {
    throw new Error(TENNIS_ERRORS.playingStyle);
  }

  if (!values.surface) {
    throw new Error(TENNIS_ERRORS.surface);
  }

  if (!values.intensity) {
    throw new Error(TENNIS_ERRORS.intensity);
  }

  const matchDuration = parseNumber(values.matchDuration);
  const bodyWeight = parseNumber(values.bodyWeight);
  const ralliesPerGame = parseNumber(values.ralliesPerGame);
  const temperature = parseNumber(values.temperature);
  const humidity = parseNumber(values.humidity);

  if (matchDuration === null) {
    throw new Error(TENNIS_ERRORS.matchDuration);
  }

  if (bodyWeight === null) {
    throw new Error(TENNIS_ERRORS.bodyWeight);
  }

  if (ralliesPerGame === null) {
    throw new Error(TENNIS_ERRORS.ralliesPerGame);
  }

  if (temperature === null) {
    throw new Error(TENNIS_ERRORS.temperature);
  }

  if (humidity === null) {
    throw new Error(TENNIS_ERRORS.humidity);
  }

  const durationMinutes =
    values.durationUnit === 'hours' ? matchDuration * 60 : matchDuration;
  const weightKg =
    values.weightUnit === 'lbs' ? bodyWeight / LB_PER_KG : bodyWeight;
  const tempCelsius =
    values.temperatureUnit === 'fahrenheit'
      ? (temperature - 32) * (5 / 9)
      : temperature;

  const baseMETs = getBaseMETs(values.intensity);
  const styleMultiplier = getStyleMultiplier(
    values.playingStyle,
    ralliesPerGame,
  );
  const surfaceMultiplier = getSurfaceMultiplier(values.surface);
  const environmentalFactor = getEnvironmentalFactor(
    tempCelsius,
    humidity,
  );

  const metValue =
    baseMETs * styleMultiplier * surfaceMultiplier * environmentalFactor;
  const caloriesPerMinute = (metValue * weightKg * 3.5) / 200;
  const totalCalories = caloriesPerMinute * durationMinutes;

  const activePlayingTime = durationMinutes * 0.7;
  const restingCalories = ((1 * weightKg * 3.5) / 200) * durationMinutes;
  const netCalories = totalCalories - restingCalories;

  const distanceCovered = calculateTennisDistanceCovered(
    durationMinutes,
    values.playingStyle,
    values.surface,
  );
  const hydrationNeeds = calculateTennisHydrationNeeds(
    durationMinutes,
    values.intensity,
    tempCelsius,
    humidity,
  );
  const recoveryTime = calculateTennisRecoveryTime(
    totalCalories,
    durationMinutes,
    values.intensity,
  );
  const glycogenDepletion = calculateGlycogenDepletion(totalCalories);
  const electrolyteLoss = calculateElectrolyteLoss(
    durationMinutes,
    tempCelsius,
    humidity,
  );

  return {
    totalCalories,
    totalCaloriesDisplay: totalCalories.toFixed(0),
    netCalories,
    netCaloriesDisplay: netCalories.toFixed(0),
    caloriesPerMinute,
    caloriesPerMinuteDisplay: caloriesPerMinute.toFixed(1),
    metValue,
    metValueDisplay: metValue.toFixed(1),
    distanceCovered,
    distanceCoveredDisplay: distanceCovered.toFixed(1),
    hydrationNeeds,
    hydrationNeedsDisplay: hydrationNeeds.toFixed(0),
    recoveryTime,
    glycogenDepletion,
    glycogenDepletionDisplay: glycogenDepletion.toFixed(0),
    electrolyteLoss,
    electrolyteLossDisplay: electrolyteLoss.toFixed(0),
    activePlayingTime,
    activePlayingTimeDisplay: activePlayingTime.toFixed(0),
    energyDensity: totalCalories / durationMinutes,
    energyDensityDisplay: (totalCalories / durationMinutes).toFixed(1),
    insights: generateTennisInsights(
      totalCalories,
      values.intensity,
      durationMinutes,
      values.playingStyle,
      tempCelsius,
    ),
    recommendations: generateTennisRecommendations(
      totalCalories,
      hydrationNeeds,
      recoveryTime,
      glycogenDepletion,
      values.intensity,
    ),
  };
}
