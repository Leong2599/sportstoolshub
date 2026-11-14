import {
  distanceToKm,
  parseNumber,
  PACE_MILE_TO_KM_FACTOR,
  SECONDS_PER_HOUR,
  SECONDS_PER_MINUTE,
  toKilograms,
  type DistanceUnit,
  type WeightUnit,
} from './units';
import type {FieldErrors} from './validation';

export type RunningMethod = 'distance-pace' | 'distance-time' | 'time-pace';

export type RunningTerrain =
  | 'flat-road'
  | 'hilly-road'
  | 'trail-flat'
  | 'trail-hilly'
  | 'sand'
  | 'treadmill';

export type RunningIntensity =
  | 'easy'
  | 'moderate'
  | 'hard'
  | 'very-hard'
  | 'race';

export type RunningPaceUnit = 'min-per-km' | 'min-per-mile';

export type ElevationUnit = 'meters' | 'feet';

export type RunningValues = {
  method: RunningMethod | '';
  weight: string;
  weightUnit: WeightUnit;
  gender: 'male' | 'female' | '';
  age: string;
  terrain: RunningTerrain;
  intensity: RunningIntensity;
  elevation: string;
  elevationUnit: ElevationUnit;
  distance: string;
  distanceUnit: DistanceUnit;
  paceMinutes: string;
  paceSeconds: string;
  paceUnit: RunningPaceUnit;
  dtDistance: string;
  dtDistanceUnit: DistanceUnit;
  timeHours: string;
  timeMinutes: string;
  timeSeconds: string;
  tpTimeHours: string;
  tpTimeMinutes: string;
  tpTimeSeconds: string;
  tpPaceMinutes: string;
  tpPaceSeconds: string;
  tpPaceUnit: RunningPaceUnit;
};

export type RunningBreakdown = {
  baseCalories: number;
  basePercent: number;
  elevationBonus: number;
  elevationPercent: number;
};

export type RunningComparison = {
  activity: string;
  calories: number;
};

export type RunningResult = {
  calories: number;
  distanceKm: number;
  timeHours: number;
  pacePerKm: string;
  speedKmh: string;
  caloriesPerKm: number;
  caloriesPerMinute: number;
  time: string;
  breakdown: RunningBreakdown;
  comparisons: readonly RunningComparison[];
  recommendation: string;
};

export const RUNNING_METHODS: readonly {value: RunningMethod; label: string}[] = [
  {value: 'distance-pace', label: 'Distance & Pace'},
  {value: 'distance-time', label: 'Distance & Time'},
  {value: 'time-pace', label: 'Time & Pace'},
] as const;

export const RUNNING_TERRAINS: readonly {
  value: RunningTerrain;
  label: string;
}[] = [
  {value: 'flat-road', label: 'Flat road'},
  {value: 'hilly-road', label: 'Hilly road'},
  {value: 'trail-flat', label: 'Flat trail'},
  {value: 'trail-hilly', label: 'Hilly trail'},
  {value: 'sand', label: 'Sand'},
  {value: 'treadmill', label: 'Treadmill'},
] as const;

export const RUNNING_INTENSITIES: readonly {
  value: RunningIntensity;
  label: string;
}[] = [
  {value: 'easy', label: 'Easy'},
  {value: 'moderate', label: 'Moderate'},
  {value: 'hard', label: 'Hard'},
  {value: 'very-hard', label: 'Very Hard'},
  {value: 'race', label: 'Race pace'},
] as const;

export const RUNNING_ELEVATION_UNITS: readonly {
  value: ElevationUnit;
  label: string;
}[] = [
  {value: 'meters', label: 'meters'},
  {value: 'feet', label: 'feet'},
] as const;

export const RUNNING_ERRORS = {
  required: 'Please fill in all required fields.',
  distance: 'Please enter a valid distance.',
  pace: 'Please enter a valid pace.',
  time: 'Please enter a valid time.',
  elevation: 'Please enter a valid elevation gain.',
} as const;

const TERRAIN_MULTIPLIERS: Record<RunningTerrain, number> = {
  'flat-road': 1.0,
  'hilly-road': 1.15,
  'trail-flat': 1.1,
  'trail-hilly': 1.25,
  sand: 1.4,
  treadmill: 0.95,
};

const INTENSITY_MULTIPLIERS: Record<RunningIntensity, number> = {
  easy: 0.9,
  moderate: 1.0,
  hard: 1.15,
  'very-hard': 1.25,
  race: 1.3,
};

const ELEVATION_CALORIES_PER_METER_PER_KG = 0.05;

export function getRunningMET(speedKmh: number): number {
  if (speedKmh < 6) return 6.0;
  if (speedKmh < 8) return 8.3;
  if (speedKmh < 10) return 9.8;
  if (speedKmh < 12) return 11.0;
  if (speedKmh < 14) return 12.3;
  if (speedKmh < 16) return 14.0;
  if (speedKmh < 18) return 16.0;
  return 18.0;
}

export function getTerrainMultiplier(terrain: RunningTerrain): number {
  return TERRAIN_MULTIPLIERS[terrain] ?? 1.0;
}

export function getIntensityMultiplier(intensity: RunningIntensity): number {
  return INTENSITY_MULTIPLIERS[intensity] ?? 1.0;
}

export function formatRunningTime(hours: number): string {
  const totalMinutes = hours * SECONDS_PER_MINUTE;
  const h = Math.floor(totalMinutes / SECONDS_PER_MINUTE);
  const m = Math.round(totalMinutes % SECONDS_PER_MINUTE);

  if (h > 0) {
    return `${h}h ${m}m`;
  }

  return `${m} minutes`;
}

export function formatRunningPace(minutesPerKm: number): string {
  const mins = Math.floor(minutesPerKm);
  const secs = Math.round((minutesPerKm - mins) * SECONDS_PER_MINUTE);

  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

function parseIntOrZero(value: string): number {
  const parsed = Number.parseInt(value, 10);
  return Number.isFinite(parsed) ? parsed : 0;
}

export function validateRunningValues(
  values: RunningValues,
): FieldErrors<RunningValues> {
  const errors: FieldErrors<RunningValues> = {};
  const weight = parseNumber(values.weight);
  const age = parseNumber(values.age);

  if (!values.method) {
    errors.method = RUNNING_ERRORS.required;
  }

  if (weight === null || weight <= 0) {
    errors.weight = RUNNING_ERRORS.required;
  }

  if (!values.gender) {
    errors.gender = RUNNING_ERRORS.required;
  }

  if (age === null || age <= 0) {
    errors.age = RUNNING_ERRORS.required;
  }

  if (values.method === 'distance-pace') {
    const distance = parseNumber(values.distance);

    if (distance === null || distance <= 0) {
      errors.distance = RUNNING_ERRORS.distance;
    }

    const paceSeconds =
      parseIntOrZero(values.paceMinutes) * SECONDS_PER_MINUTE +
      parseIntOrZero(values.paceSeconds);

    if (paceSeconds <= 0) {
      errors.paceMinutes = RUNNING_ERRORS.pace;
    }
  }

  if (values.method === 'distance-time') {
    const distance = parseNumber(values.dtDistance);

    if (distance === null || distance <= 0) {
      errors.dtDistance = RUNNING_ERRORS.distance;
    }

    const totalSeconds =
      parseIntOrZero(values.timeHours) * SECONDS_PER_HOUR +
      parseIntOrZero(values.timeMinutes) * SECONDS_PER_MINUTE +
      parseIntOrZero(values.timeSeconds);

    if (totalSeconds <= 0) {
      errors.timeHours = RUNNING_ERRORS.time;
    }
  }

  if (values.method === 'time-pace') {
    const totalSeconds =
      parseIntOrZero(values.tpTimeHours) * SECONDS_PER_HOUR +
      parseIntOrZero(values.tpTimeMinutes) * SECONDS_PER_MINUTE +
      parseIntOrZero(values.tpTimeSeconds);

    if (totalSeconds <= 0) {
      errors.tpTimeHours = RUNNING_ERRORS.time;
    }

    const paceSeconds =
      parseIntOrZero(values.tpPaceMinutes) * SECONDS_PER_MINUTE +
      parseIntOrZero(values.tpPaceSeconds);

    if (paceSeconds <= 0) {
      errors.tpPaceMinutes = RUNNING_ERRORS.pace;
    }
  }

  if (values.elevation.trim() !== '') {
    const elevation = parseNumber(values.elevation);

    if (elevation === null || elevation < 0) {
      errors.elevation = RUNNING_ERRORS.elevation;
    }
  }

  return errors;
}

function resolveDistanceAndTime(
  values: RunningValues,
): {distanceKm: number; timeHours: number} {
  if (values.method === 'distance-pace') {
    const distance = parseNumber(values.distance) ?? 0;
    const distanceKm = distanceToKm(distance, values.distanceUnit);
    const paceSecondsPerUnit =
      parseIntOrZero(values.paceMinutes) * SECONDS_PER_MINUTE +
      parseIntOrZero(values.paceSeconds);
    const paceSecondsPerKm =
      values.paceUnit === 'min-per-km'
        ? paceSecondsPerUnit
        : paceSecondsPerUnit * PACE_MILE_TO_KM_FACTOR;

    return {
      distanceKm,
      timeHours: (paceSecondsPerKm * distanceKm) / SECONDS_PER_HOUR,
    };
  }

  if (values.method === 'distance-time') {
    const distance = parseNumber(values.dtDistance) ?? 0;

    return {
      distanceKm: distanceToKm(distance, values.dtDistanceUnit),
      timeHours:
        parseIntOrZero(values.timeHours) +
        parseIntOrZero(values.timeMinutes) / SECONDS_PER_MINUTE +
        parseIntOrZero(values.timeSeconds) / SECONDS_PER_HOUR,
    };
  }

  const timeHours =
    parseIntOrZero(values.tpTimeHours) +
    parseIntOrZero(values.tpTimeMinutes) / SECONDS_PER_MINUTE +
    parseIntOrZero(values.tpTimeSeconds) / SECONDS_PER_HOUR;
  const paceSecondsPerUnit =
    parseIntOrZero(values.tpPaceMinutes) * SECONDS_PER_MINUTE +
    parseIntOrZero(values.tpPaceSeconds);
  const distanceKm =
    values.tpPaceUnit === 'min-per-km'
      ? (timeHours * SECONDS_PER_HOUR) / paceSecondsPerUnit
      : (timeHours * SECONDS_PER_HOUR) /
        (paceSecondsPerUnit * PACE_MILE_TO_KM_FACTOR);

  return {distanceKm, timeHours};
}

export function calculateRunningCalories(values: RunningValues): RunningResult {
  if (!values.method) {
    throw new Error(RUNNING_ERRORS.required);
  }

  const weight = parseNumber(values.weight);
  const age = parseNumber(values.age);

  if (weight === null || weight <= 0 || age === null || age <= 0) {
    throw new Error(RUNNING_ERRORS.required);
  }

  if (!values.gender) {
    throw new Error(RUNNING_ERRORS.required);
  }

  const weightKg = toKilograms(weight, values.weightUnit);
  const {distanceKm, timeHours} = resolveDistanceAndTime(values);

  if (timeHours <= 0) {
    throw new Error(RUNNING_ERRORS.time);
  }

  const speedKmh = distanceKm / timeHours;
  const baseMET = getRunningMET(speedKmh);
  const terrainMultiplier = getTerrainMultiplier(values.terrain);
  const intensityMultiplier = getIntensityMultiplier(values.intensity);
  const genderAdjustment = values.gender === 'male' ? 1.0 : 0.9;
  const ageAdjustment = Math.max(0.8, 1.0 - (age - 25) * 0.005);

  const caloriesPerHour =
    baseMET *
    weightKg *
    terrainMultiplier *
    intensityMultiplier *
    genderAdjustment *
    ageAdjustment;
  const totalCalories = caloriesPerHour * timeHours;

  const elevationGain = parseNumber(values.elevation) ?? 0;
  const elevationMeters =
    values.elevationUnit === 'feet' ? elevationGain * 0.3048 : elevationGain;
  const elevationBonus =
    elevationMeters * ELEVATION_CALORIES_PER_METER_PER_KG * weightKg;

  const calories = Math.round(totalCalories + elevationBonus);
  const caloriesPerKm = Math.round(calories / distanceKm);
  const caloriesPerMinute = Math.round(calories / (timeHours * SECONDS_PER_MINUTE));
  const paceMinPerKm = (timeHours * SECONDS_PER_MINUTE) / distanceKm;

  const baseCalories = Math.round(calories * 0.85);
  const breakdownBonus = calories - baseCalories;

  const breakdown: RunningBreakdown = {
    baseCalories,
    basePercent: parseFloat(((baseCalories / calories) * 100).toFixed(1)),
    elevationBonus: breakdownBonus,
    elevationPercent: parseFloat(
      ((breakdownBonus / calories) * 100).toFixed(1),
    ),
  };

  const comparisons: RunningComparison[] = [
    {activity: 'Walking (1 hour)', calories: Math.round(calories * 0.4)},
    {
      activity: 'Cycling (moderate, 1 hour)',
      calories: Math.round(calories * 0.8),
    },
    {
      activity: 'Swimming (moderate, 1 hour)',
      calories: Math.round(calories * 0.9),
    },
    {activity: 'Weight Training (1 hour)', calories: Math.round(calories * 0.6)},
    {activity: 'Yoga (1 hour)', calories: Math.round(calories * 0.3)},
  ];

  let recommendation = `You burned ${calories} calories during your ${distanceKm.toFixed(
    1,
  )}km run. `;

  if (calories < 200) {
    recommendation +=
      'This was a light workout. Consider increasing duration or intensity for more calorie burn.';
  } else if (calories < 400) {
    recommendation +=
      'Good job! This is a solid calorie-burning workout that contributes well to your fitness goals.';
  } else if (calories < 600) {
    recommendation +=
      'Excellent calorie burn! Make sure to refuel properly with carbohydrates and protein within 30-60 minutes post-run.';
  } else {
    recommendation +=
      'Outstanding calorie burn! This was a significant workout. Focus on proper recovery with adequate nutrition, hydration, and rest.';
  }

  recommendation +=
    ' For optimal recovery, consume a mix of carbohydrates and protein within 2 hours of your run, and stay well-hydrated throughout the day.';

  return {
    calories,
    distanceKm,
    timeHours,
    pacePerKm: formatRunningPace(paceMinPerKm),
    speedKmh: speedKmh.toFixed(1),
    caloriesPerKm,
    caloriesPerMinute,
    time: formatRunningTime(timeHours),
    breakdown,
    comparisons,
    recommendation,
  };
}
