import {parseNumber} from './units';
import type {FieldErrors} from './validation';

export type SwimCalculationType = 'time-distance' | 'pace-distance' | 'intervals';

export type SwimDistanceUnit = 'meters' | 'yards';

export type SwimValues = {
  calculationType: SwimCalculationType | '';
  distance: string;
  distanceUnit: SwimDistanceUnit;
  minutes: string;
  seconds: string;
  hundredths: string;
  poolSize: string;
  targetDistance: string;
  targetDistanceUnit: SwimDistanceUnit;
  paceMinutes: string;
  paceSeconds: string;
  intervalDistance: string;
  intervalPaceMinutes: string;
  intervalPaceSeconds: string;
  restTime: string;
  numIntervals: string;
};

export type SwimSplit = {
  label: string;
  time: string;
};

export type SwimInterval = {
  number: number;
  distance: string;
  time: string;
  rest: string;
};

export type SwimStat = {
  label: string;
  value: string;
};

export type SwimResult = {
  calculationType: SwimCalculationType;
  headline: string;
  headlineLabel: string;
  stats: readonly SwimStat[];
  splits: readonly SwimSplit[];
  intervals: readonly SwimInterval[];
  recommendation: string;
};

export const SWIM_CALCULATION_TYPES: readonly {
  value: SwimCalculationType;
  label: string;
}[] = [
  {value: 'time-distance', label: 'Calculate Pace from Time & Distance'},
  {value: 'pace-distance', label: 'Calculate Time from Pace & Distance'},
  {value: 'intervals', label: 'Interval Training Calculator'},
] as const;

export const SWIM_DISTANCE_UNITS: readonly {
  value: SwimDistanceUnit;
  label: string;
}[] = [
  {value: 'meters', label: 'meters'},
  {value: 'yards', label: 'yards'},
] as const;

export const SWIM_POOL_SIZES: readonly {value: string; label: string}[] = [
  {value: '25', label: '25 meters'},
  {value: '50', label: '50 meters'},
  {value: '25y', label: '25 yards'},
  {value: '33.3', label: '33.3 meters (short course yards)'},
] as const;

export const SWIM_INTERVAL_DISTANCES: readonly {
  value: string;
  label: string;
}[] = [
  {value: '50', label: '50m'},
  {value: '100', label: '100m'},
  {value: '200', label: '200m'},
  {value: '400', label: '400m'},
] as const;

export const SWIM_ERRORS = {
  calculationType: 'Please select a calculation type.',
  distance: 'Please enter a valid distance.',
  time: 'Please enter a valid time.',
  pace: 'Please enter a valid pace.',
  intervals: 'Please enter valid interval details.',
  rest: 'Please enter a valid rest time (10-120 seconds).',
} as const;

const YARDS_TO_METERS = 0.9144;

function parseIntOrZero(value: string): number {
  const parsed = Number.parseInt(value, 10);
  return Number.isFinite(parsed) ? parsed : 0;
}

function toMeters(value: number, unit: SwimDistanceUnit): number {
  return unit === 'yards' ? value * YARDS_TO_METERS : value;
}

export function formatSwimTime(seconds: number): string {
  const minutes = Math.floor(seconds / 60);
  const remainder = Math.round(seconds % 60);

  return `${minutes}:${remainder.toString().padStart(2, '0')}`;
}

export function formatSwimHundredths(seconds: number): string {
  const minutes = Math.floor(seconds / 60);
  const wholeSeconds = Math.floor(seconds % 60);
  const hundredths = Math.round((seconds % 1) * 100);

  return `${minutes.toString().padStart(2, '0')}:${wholeSeconds
    .toString()
    .padStart(2, '0')}.${hundredths.toString().padStart(2, '0')}`;
}

export function validateSwimValues(
  values: SwimValues,
): FieldErrors<SwimValues> {
  const errors: FieldErrors<SwimValues> = {};

  if (!values.calculationType) {
    errors.calculationType = SWIM_ERRORS.calculationType;
    return errors;
  }

  if (values.calculationType === 'time-distance') {
    const distance = parseNumber(values.distance);

    if (distance === null || distance <= 0) {
      errors.distance = SWIM_ERRORS.distance;
    }

    if (
      parseIntOrZero(values.minutes) * 60 +
        parseIntOrZero(values.seconds) +
        parseIntOrZero(values.hundredths) / 100 <=
      0
    ) {
      errors.minutes = SWIM_ERRORS.time;
    }
  }

  if (values.calculationType === 'pace-distance') {
    const distance = parseNumber(values.targetDistance);

    if (distance === null || distance <= 0) {
      errors.targetDistance = SWIM_ERRORS.distance;
    }

    if (
      parseIntOrZero(values.paceMinutes) * 60 +
        parseIntOrZero(values.paceSeconds) <=
      0
    ) {
      errors.paceMinutes = SWIM_ERRORS.pace;
    }
  }

  if (values.calculationType === 'intervals') {
    const paceSeconds =
      parseIntOrZero(values.intervalPaceMinutes) * 60 +
      parseIntOrZero(values.intervalPaceSeconds);
    const numIntervals = parseNumber(values.numIntervals);
    const restTime = parseNumber(values.restTime);

    if (paceSeconds <= 0) {
      errors.intervalPaceMinutes = SWIM_ERRORS.pace;
    }

    if (numIntervals === null || numIntervals < 1 || numIntervals > 20) {
      errors.numIntervals = SWIM_ERRORS.intervals;
    }

    if (restTime === null || restTime < 10 || restTime > 120) {
      errors.restTime = SWIM_ERRORS.rest;
    }
  }

  return errors;
}

export function generateSwimSplits(
  pacePer100m: number,
  totalDistanceMeters: number,
  poolSize: number,
): SwimSplit[] {
  const numberOfLaps =
    poolSize > 0 ? Math.floor(totalDistanceMeters / poolSize) : 0;
  const splits: SwimSplit[] = [];

  for (let i = 1; i <= numberOfLaps; i++) {
    const lapDistance = i * poolSize;
    const lapTimeSeconds = (pacePer100m / 100) * lapDistance;

    splits.push({
      label: `Lap ${i} (${poolSize}m)`,
      time: formatSwimHundredths(lapTimeSeconds),
    });
  }

  return splits;
}

export function generateIntervalPlan(
  intervalDistance: number,
  intervalTimeSeconds: number,
  restTime: number,
  numIntervals: number,
): SwimInterval[] {
  const intervals: SwimInterval[] = [];

  for (let i = 1; i <= numIntervals; i++) {
    intervals.push({
      number: i,
      distance: `${intervalDistance}m`,
      time: formatSwimHundredths(intervalTimeSeconds),
      rest: i < numIntervals ? `${restTime}s rest` : 'Finish',
    });
  }

  return intervals;
}

export function getSwimRecommendation(pacePer100m: number): string {
  const paceMinutes = Math.floor(pacePer100m / 60);
  const paceSeconds = Math.floor(pacePer100m % 60);
  const totalPaceSeconds = paceMinutes * 60 + paceSeconds;

  if (totalPaceSeconds > 150) {
    return 'Focus on technique drills and building endurance. Include interval training to improve speed. Consider working with a coach for stroke improvement.';
  }

  if (totalPaceSeconds > 120) {
    return 'Good progress! Focus on maintaining form over longer distances. Include tempo swims and interval training. Add strength training for swimming-specific muscles.';
  }

  if (totalPaceSeconds > 90) {
    return 'Excellent pace! Focus on race-specific training and open water skills. Include threshold sets and sprint work. Maintain consistency in your training.';
  }

  return 'Outstanding swimming ability! Focus on fine-tuning technique and race strategy. Include high-intensity interval training and proper recovery.';
}

export function getIntervalRecommendation(
  intervalDistance: number,
  numIntervals: number,
): string {
  const totalDistance = intervalDistance * numIntervals;

  return `This interval set covers ${totalDistance}m total. Focus on maintaining consistent pace across all intervals. Use the rest time to recover and prepare for the next interval. Adjust the rest time based on your fitness level - shorter rest for advanced swimmers, longer rest for beginners.`;
}

export function calculateSwimPace(values: SwimValues): SwimResult {
  if (!values.calculationType) {
    throw new Error(SWIM_ERRORS.calculationType);
  }

  if (values.calculationType === 'time-distance') {
    const distance = parseNumber(values.distance);

    if (distance === null || distance <= 0) {
      throw new Error(SWIM_ERRORS.distance);
    }

    const minutes = parseIntOrZero(values.minutes);
    const seconds = parseIntOrZero(values.seconds);
    const hundredths = parseIntOrZero(values.hundredths);
    const totalSeconds = minutes * 60 + seconds + hundredths / 100;

    if (totalSeconds <= 0) {
      throw new Error(SWIM_ERRORS.time);
    }

    const distanceMeters = toMeters(distance, values.distanceUnit);
    const poolSize = Number.parseFloat(values.poolSize) || 25;
    const pacePer100m = (totalSeconds / distanceMeters) * 100;
    const paceMinutes = Math.floor(pacePer100m / 60);
    const paceSeconds = Math.floor(pacePer100m % 60);
    const paceHundredths = Math.round((pacePer100m % 1) * 100);
    const pacePer50m = pacePer100m / 2;
    const pace50Minutes = Math.floor(pacePer50m / 60);
    const pace50Seconds = Math.floor(pacePer50m % 60);
    const pace50Hundredths = Math.round((pacePer50m % 1) * 100);

    return {
      calculationType: values.calculationType,
      headline: `${paceMinutes}:${paceSeconds
        .toString()
        .padStart(2, '0')}.${paceHundredths.toString().padStart(2, '0')} /100m`,
      headlineLabel: 'Your Swimming Pace',
      stats: [
        {
          label: 'Pace per 50m',
          value: `${pace50Minutes}:${pace50Seconds
            .toString()
            .padStart(2, '0')}.${pace50Hundredths.toString().padStart(2, '0')} /50m`,
        },
        {
          label: 'Speed',
          value: `${((distanceMeters / totalSeconds) * 3.6).toFixed(2)} km/h`,
        },
        {
          label: 'Speed',
          value: `${((distanceMeters / totalSeconds) * 2.237).toFixed(2)} mph`,
        },
      ],
      splits: generateSwimSplits(pacePer100m, distanceMeters, poolSize),
      intervals: [],
      recommendation: getSwimRecommendation(pacePer100m),
    };
  }

  if (values.calculationType === 'pace-distance') {
    const distance = parseNumber(values.targetDistance);

    if (distance === null || distance <= 0) {
      throw new Error(SWIM_ERRORS.distance);
    }

    const paceMinutes = parseIntOrZero(values.paceMinutes);
    const paceSeconds = parseIntOrZero(values.paceSeconds);
    const pacePer100m = paceMinutes * 60 + paceSeconds;

    if (pacePer100m <= 0) {
      throw new Error(SWIM_ERRORS.pace);
    }

    const distanceMeters = toMeters(distance, values.targetDistanceUnit);
    const totalSeconds = (pacePer100m / 100) * distanceMeters;
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = Math.floor(totalSeconds % 60);
    const hundredths = Math.round((totalSeconds % 1) * 100);

    return {
      calculationType: values.calculationType,
      headline: `${minutes.toString().padStart(2, '0')}:${seconds
        .toString()
        .padStart(2, '0')}.${hundredths.toString().padStart(2, '0')}`,
      headlineLabel: 'Predicted Finish Time',
      stats: [
        {
          label: 'Target Pace',
          value: `${paceMinutes}:${paceSeconds.toString().padStart(2, '0')} /100m`,
        },
      ],
      splits: generateSwimSplits(pacePer100m, distanceMeters, 25),
      intervals: [],
      recommendation: getSwimRecommendation(pacePer100m),
    };
  }

  const intervalDistance = parseIntOrZero(values.intervalDistance);
  const paceSeconds =
    parseIntOrZero(values.intervalPaceMinutes) * 60 +
    parseIntOrZero(values.intervalPaceSeconds);
  const restTime = parseIntOrZero(values.restTime);
  const numIntervals = parseNumber(values.numIntervals);

  if (paceSeconds <= 0) {
    throw new Error(SWIM_ERRORS.pace);
  }

  if (numIntervals === null || numIntervals < 1 || numIntervals > 20) {
    throw new Error(SWIM_ERRORS.intervals);
  }

  if (restTime < 10 || restTime > 120) {
    throw new Error(SWIM_ERRORS.rest);
  }

  const pacePer100m = paceSeconds;
  const intervalTimeSeconds = (pacePer100m / 100) * intervalDistance;
  const totalSwimTime = intervalTimeSeconds * numIntervals;
  const totalRestTime = restTime * (numIntervals - 1);
  const totalWorkoutTime = totalSwimTime + totalRestTime;

  return {
    calculationType: values.calculationType,
    headline: `${Math.floor(totalWorkoutTime / 60)}:${(
      totalWorkoutTime % 60
    )
      .toString()
      .padStart(2, '0')}`,
    headlineLabel: 'Total Workout Time',
    stats: [
      {label: 'Distance', value: `${intervalDistance}m`},
      {
        label: 'Pace',
        value: `${parseIntOrZero(values.intervalPaceMinutes)}:${parseIntOrZero(
          values.intervalPaceSeconds,
        )
          .toString()
          .padStart(2, '0')} /100m`,
      },
      {label: 'Rest', value: `${restTime}s`},
      {label: 'Repeats', value: `${numIntervals}x`},
      {
        label: 'Swim',
        value: `${Math.floor(totalSwimTime / 60)}:${(
          totalSwimTime % 60
        )
          .toString()
          .padStart(2, '0')}`,
      },
      {
        label: 'Rest',
        value: `${Math.floor(totalRestTime / 60)}:${(
          totalRestTime % 60
        )
          .toString()
          .padStart(2, '0')}`,
      },
    ],
    splits: [],
    intervals: generateIntervalPlan(
      intervalDistance,
      intervalTimeSeconds,
      restTime,
      numIntervals,
    ),
    recommendation: getIntervalRecommendation(intervalDistance, numIntervals),
  };
}
