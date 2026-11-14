import {
  distanceToKm,
  distanceToMeters,
  metersToKm,
  metersToMiles,
  parseNumber,
  PACE_MILE_TO_KM_FACTOR,
  SECONDS_PER_HOUR,
  SECONDS_PER_MINUTE,
  type DistanceUnit,
} from './units';
import type {FieldErrors} from './validation';

export type PaceCalculationType =
  | 'time-distance'
  | 'pace-distance'
  | 'race-prediction';

export type PaceUnit = 'min-per-km' | 'min-per-mile';

export type PaceRaceDistance = '5k' | '10k' | 'half-marathon' | 'marathon';

export type PaceValues = {
  calculationType: PaceCalculationType | '';
  distance: string;
  distanceUnit: DistanceUnit;
  hours: string;
  minutes: string;
  seconds: string;
  targetDistance: string;
  targetDistanceUnit: DistanceUnit;
  paceMinutes: string;
  paceSeconds: string;
  paceUnit: PaceUnit;
  recentDistance: PaceRaceDistance | '';
  recentHours: string;
  recentMinutes: string;
  recentSeconds: string;
};

export type PaceSplit = {
  label: string;
  time: string;
};

export type PacePrediction = {
  distance: string;
  time: string;
  seconds: number;
};

export type PaceResult = {
  calculationType: PaceCalculationType;
  headline: string;
  headlineLabel: string;
  secondary: string;
  secondaryLabel: string;
  speed: string;
  speedAlt: string;
  splits: readonly PaceSplit[];
  predictions: readonly PacePrediction[];
  recommendation: string;
};

export const PACE_CALCULATION_TYPES: readonly {
  value: PaceCalculationType;
  label: string;
}[] = [
  {value: 'time-distance', label: 'Calculate Pace from Time & Distance'},
  {value: 'pace-distance', label: 'Calculate Time from Pace & Distance'},
  {value: 'race-prediction', label: 'Race Time Prediction'},
] as const;

export const PACE_UNITS: readonly {value: PaceUnit; label: string}[] = [
  {value: 'min-per-km', label: 'min/km'},
  {value: 'min-per-mile', label: 'min/mile'},
] as const;

export const PACE_RACE_DISTANCES: readonly {
  value: PaceRaceDistance;
  label: string;
}[] = [
  {value: '5k', label: '5K'},
  {value: '10k', label: '10K'},
  {value: 'half-marathon', label: 'Half Marathon'},
  {value: 'marathon', label: 'Marathon'},
] as const;

export const PACE_RACE_DISTANCE_METERS: Record<PaceRaceDistance, number> = {
  '5k': 5000,
  '10k': 10000,
  'half-marathon': 21097.5,
  marathon: 42195,
};

const PREDICTION_DISTANCES: readonly {name: string; meters: number}[] = [
  {name: '5K', meters: 5000},
  {name: '10K', meters: 10000},
  {name: 'Half Marathon', meters: 21097.5},
  {name: 'Marathon', meters: 42195},
];

const RIEGEL_EXPONENT = 1.06;

export const PACE_ERRORS = {
  calculationType: 'Please select a calculation type.',
  distance: 'Please enter a valid distance.',
  time: 'Please enter a valid time.',
  pace: 'Please enter a valid pace.',
  raceDistance: 'Please select a race distance.',
} as const;

function parseIntOrZero(value: string): number {
  const parsed = Number.parseInt(value, 10);
  return Number.isFinite(parsed) ? parsed : 0;
}

function toTotalSeconds(hours: string, minutes: string, seconds: string): number {
  return (
    parseIntOrZero(hours) * SECONDS_PER_HOUR +
    parseIntOrZero(minutes) * SECONDS_PER_MINUTE +
    parseIntOrZero(seconds)
  );
}

export function formatPaceMinutes(
  paceSeconds: number,
): {minutes: number; seconds: number} {
  return {
    minutes: Math.floor(paceSeconds / SECONDS_PER_MINUTE),
    seconds: Math.round(paceSeconds % SECONDS_PER_MINUTE),
  };
}

export function formatPaceString(paceSeconds: number): string {
  const {minutes, seconds} = formatPaceMinutes(paceSeconds);

  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
}

export function formatClockString(totalSeconds: number): string {
  const hours = Math.floor(totalSeconds / SECONDS_PER_HOUR);
  const minutes = Math.floor(
    (totalSeconds % SECONDS_PER_HOUR) / SECONDS_PER_MINUTE,
  );
  const seconds = Math.round(totalSeconds % SECONDS_PER_MINUTE);

  return `${hours.toString().padStart(2, '0')}:${minutes
    .toString()
    .padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

export function formatSplitTime(totalSeconds: number): string {
  const hours = Math.floor(totalSeconds / SECONDS_PER_HOUR);
  const minutes = Math.floor(
    (totalSeconds % SECONDS_PER_HOUR) / SECONDS_PER_MINUTE,
  );
  const seconds = Math.round(totalSeconds % SECONDS_PER_MINUTE);

  if (hours > 0) {
    return `${hours.toString().padStart(2, '0')}:${minutes
      .toString()
      .padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  }

  return `${minutes.toString().padStart(2, '0')}:${seconds
    .toString()
    .padStart(2, '0')}`;
}

export function validatePaceValues(values: PaceValues): FieldErrors<PaceValues> {
  const errors: FieldErrors<PaceValues> = {};

  if (!values.calculationType) {
    errors.calculationType = PACE_ERRORS.calculationType;
    return errors;
  }

  if (values.calculationType === 'time-distance') {
    const distance = parseNumber(values.distance);

    if (distance === null || distance <= 0) {
      errors.distance = PACE_ERRORS.distance;
    }

    if (toTotalSeconds(values.hours, values.minutes, values.seconds) <= 0) {
      errors.hours = PACE_ERRORS.time;
    }
  }

  if (values.calculationType === 'pace-distance') {
    const distance = parseNumber(values.targetDistance);

    if (distance === null || distance <= 0) {
      errors.targetDistance = PACE_ERRORS.distance;
    }

    const paceSeconds =
      parseIntOrZero(values.paceMinutes) * SECONDS_PER_MINUTE +
      parseIntOrZero(values.paceSeconds);

    if (paceSeconds <= 0) {
      errors.paceMinutes = PACE_ERRORS.pace;
    }
  }

  if (values.calculationType === 'race-prediction') {
    if (!values.recentDistance) {
      errors.recentDistance = PACE_ERRORS.raceDistance;
    }

    if (
      toTotalSeconds(
        values.recentHours,
        values.recentMinutes,
        values.recentSeconds,
      ) <= 0
    ) {
      errors.recentHours = PACE_ERRORS.time;
    }
  }

  return errors;
}

export function generatePaceSplits(
  paceSecondsPerKm: number,
  totalDistanceMeters: number,
): PaceSplit[] {
  const numberOfSplits = Math.floor(totalDistanceMeters / 1000);
  const splits: PaceSplit[] = [];

  for (let i = 1; i <= numberOfSplits; i++) {
    splits.push({
      label: `Km ${i}`,
      time: formatSplitTime(paceSecondsPerKm * i),
    });
  }

  return splits;
}

export function generatePaceRecommendation(
  totalDistanceMeters: number,
): string {
  const totalDistanceKm = metersToKm(totalDistanceMeters);

  if (totalDistanceKm >= 42.195) {
    return 'For marathon training, include long runs at 30-60 seconds slower than goal pace, tempo runs at goal pace, and interval training at faster paces. Focus on nutrition and hydration during long runs.';
  }

  if (totalDistanceKm >= 21.0975) {
    return 'For half marathon training, build your long run distance gradually, include tempo runs at goal pace, and add speed work to improve your lactate threshold.';
  }

  if (totalDistanceKm >= 10) {
    return 'For 10K training, focus on threshold runs and interval training. Include weekly long runs and maintain consistency in your training schedule.';
  }

  return 'For 5K training, incorporate interval training, tempo runs, and hill repeats. Focus on leg speed and running economy.';
}

export const PACE_RACE_RECOMMENDATION =
  'These predictions are based on the Riegel formula and assume consistent training and ideal race conditions. Use them as goal-setting tools, but remember that factors like weather, terrain, and race day performance can affect actual times.';

export function calculatePace(values: PaceValues): PaceResult {
  if (!values.calculationType) {
    throw new Error(PACE_ERRORS.calculationType);
  }

  if (values.calculationType === 'time-distance') {
    const distance = parseNumber(values.distance);

    if (distance === null || distance <= 0) {
      throw new Error(PACE_ERRORS.distance);
    }

    const totalSeconds = toTotalSeconds(
      values.hours,
      values.minutes,
      values.seconds,
    );

    if (totalSeconds <= 0) {
      throw new Error(PACE_ERRORS.time);
    }

    const distanceMeters = distanceToMeters(distance, values.distanceUnit);
    const paceSecondsPerKm = totalSeconds / metersToKm(distanceMeters);
    const paceSecondsPerMile = totalSeconds / metersToMiles(distanceMeters);
    const speedKmh = metersToKm(distanceMeters) / (totalSeconds / SECONDS_PER_HOUR);
    const speedMph = metersToMiles(distanceMeters) / (totalSeconds / SECONDS_PER_HOUR);
    const paceKm = formatPaceMinutes(paceSecondsPerKm);
    const paceMile = formatPaceMinutes(paceSecondsPerMile);

    return {
      calculationType: values.calculationType,
      headline: `${paceKm.minutes}:${paceKm.seconds
        .toString()
        .padStart(2, '0')} min/km`,
      headlineLabel: 'Your Running Pace',
      secondary: `${paceMile.minutes}:${paceMile.seconds
        .toString()
        .padStart(2, '0')} min/mile`,
      secondaryLabel: 'Pace',
      speed: `${speedKmh.toFixed(2)} km/h`,
      speedAlt: `${speedMph.toFixed(2)} mph`,
      splits: generatePaceSplits(paceSecondsPerKm, distanceMeters),
      predictions: [],
      recommendation: generatePaceRecommendation(distanceMeters),
    };
  }

  if (values.calculationType === 'pace-distance') {
    const distance = parseNumber(values.targetDistance);

    if (distance === null || distance <= 0) {
      throw new Error(PACE_ERRORS.distance);
    }

    const paceSecondsPerUnit =
      parseIntOrZero(values.paceMinutes) * SECONDS_PER_MINUTE +
      parseIntOrZero(values.paceSeconds);

    if (paceSecondsPerUnit <= 0) {
      throw new Error(PACE_ERRORS.pace);
    }

    const distanceMeters = distanceToMeters(
      distance,
      values.targetDistanceUnit,
    );
    const totalSeconds =
      values.paceUnit === 'min-per-km'
        ? paceSecondsPerUnit * metersToKm(distanceMeters)
        : paceSecondsPerUnit * metersToMiles(distanceMeters);
    const paceSecondsPerKm =
      values.paceUnit === 'min-per-km'
        ? paceSecondsPerUnit
        : paceSecondsPerUnit * PACE_MILE_TO_KM_FACTOR;

    return {
      calculationType: values.calculationType,
      headline: formatClockString(totalSeconds),
      headlineLabel: 'Predicted Finish Time',
      secondary: `${parseIntOrZero(values.paceMinutes)}:${parseIntOrZero(
        values.paceSeconds,
      )
        .toString()
        .padStart(2, '0')} ${values.paceUnit}`,
      secondaryLabel: 'Target Pace',
      speed: '',
      speedAlt: '',
      splits: generatePaceSplits(paceSecondsPerKm, distanceMeters),
      predictions: [],
      recommendation: generatePaceRecommendation(distanceMeters),
    };
  }

  if (!values.recentDistance) {
    throw new Error(PACE_ERRORS.raceDistance);
  }

  const totalSeconds = toTotalSeconds(
    values.recentHours,
    values.recentMinutes,
    values.recentSeconds,
  );

  if (totalSeconds <= 0) {
    throw new Error(PACE_ERRORS.time);
  }

  const recentDistanceMeters =
    PACE_RACE_DISTANCE_METERS[values.recentDistance];
  const predictions: PacePrediction[] = [];

  for (const distance of PREDICTION_DISTANCES) {
    if (distance.meters === recentDistanceMeters) {
      continue;
    }

    const predictedTimeSeconds =
      totalSeconds *
      Math.pow(distance.meters / recentDistanceMeters, RIEGEL_EXPONENT);

    predictions.push({
      distance: distance.name,
      time: formatSplitTime(predictedTimeSeconds),
      seconds: predictedTimeSeconds,
    });
  }

  return {
    calculationType: values.calculationType,
    headline: formatClockString(totalSeconds),
    headlineLabel: 'Recent Race Time',
    secondary: values.recentDistance.toUpperCase(),
    secondaryLabel: 'Recent Race Performance',
    speed: '',
    speedAlt: '',
    splits: [],
    predictions,
    recommendation: PACE_RACE_RECOMMENDATION,
  };
}
