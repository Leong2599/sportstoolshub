import {
  parseNumber,
  toCentimeters,
  toKilograms,
  type HeightUnit,
  type WeightUnit,
} from './units';
import type {FieldErrors} from './validation';

export type HeartRateMethod = 'karvonen' | 'age-predicted';

export type HeartRateFitnessLevel =
  | 'beginner'
  | 'intermediate'
  | 'advanced'
  | 'athlete';

export type HeartRateValues = {
  age: string;
  restingHeartRate: string;
  fitnessLevel: HeartRateFitnessLevel | '';
  method: HeartRateMethod | '';
};

export type HeartRateZone = {
  zone: number;
  label: string;
  intensity: string;
  min: number;
  max: number;
  percentage: string;
  description: string;
};

export type HeartRateResult = {
  maxHR: number;
  zones: readonly HeartRateZone[];
  recommendation: string;
  method: HeartRateMethod;
  restingHeartRate: number;
};

const HEART_RATE_ZONES: readonly {
  zone: number;
  label: string;
  intensity: string;
  percentage: string;
  lowFactor: number;
  highFactor: number;
  description: string;
}[] = [
  {
    zone: 1,
    label: 'Zone 1',
    intensity: 'Warm-up/Recovery',
    percentage: '50-60% Max HR',
    lowFactor: 0.5,
    highFactor: 0.6,
    description:
      'Very light intensity. Good for warm-ups, cool-downs, and active recovery.',
  },
  {
    zone: 2,
    label: 'Zone 2',
    intensity: 'Fat Burn',
    percentage: '60-70% Max HR',
    lowFactor: 0.6,
    highFactor: 0.7,
    description:
      'Light intensity. Improves endurance and promotes fat burning.',
  },
  {
    zone: 3,
    label: 'Zone 3',
    intensity: 'Cardio',
    percentage: '70-80% Max HR',
    lowFactor: 0.7,
    highFactor: 0.8,
    description:
      'Moderate intensity. Improves cardiovascular fitness and aerobic capacity.',
  },
  {
    zone: 4,
    label: 'Zone 4',
    intensity: 'Threshold',
    percentage: '80-90% Max HR',
    lowFactor: 0.8,
    highFactor: 0.9,
    description:
      'Hard intensity. Improves lactate threshold and race performance.',
  },
  {
    zone: 5,
    label: 'Zone 5',
    intensity: 'Maximum',
    percentage: '90-100% Max HR',
    lowFactor: 0.9,
    highFactor: 1.0,
    description:
      'Maximum intensity. For short bursts and high-intensity interval training.',
  },
];

export const HEART_RATE_METHODS: readonly {
  value: HeartRateMethod;
  label: string;
}[] = [
  {value: 'karvonen', label: 'Karvonen (Heart Rate Reserve)'},
  {value: 'age-predicted', label: 'Age-Predicted (220-age)'},
] as const;

export const HEART_RATE_FITNESS_LEVELS: readonly {
  value: HeartRateFitnessLevel;
  label: string;
}[] = [
  {value: 'beginner', label: 'Beginner (new to exercise)'},
  {value: 'intermediate', label: 'Intermediate (regular exercise 2-3x/week)'},
  {value: 'advanced', label: 'Advanced (intense exercise 4-5x/week)'},
  {value: 'athlete', label: 'Athlete (elite training 6-7x/week)'},
] as const;

export function validateHeartRateValues(
  values: HeartRateValues,
): FieldErrors<HeartRateValues> {
  const errors: FieldErrors<HeartRateValues> = {};
  const age = parseNumber(values.age);
  const restingHR = parseNumber(values.restingHeartRate);

  if (age === null || age < 15 || age > 100) {
    errors.age = 'Please enter a valid age (15-100).';
  }

  if (
    values.restingHeartRate.trim() !== '' &&
    restingHR !== null &&
    restingHR !== 0 &&
    (restingHR < 40 || restingHR > 100)
  ) {
    errors.restingHeartRate =
      'Please enter a valid resting heart rate (40-100) or leave blank.';
  }

  if (!values.fitnessLevel) {
    errors.fitnessLevel = 'Please select your fitness level.';
  }

  if (!values.method) {
    errors.method = 'Please select a calculation method.';
  }

  return errors;
}

function fitnessRecommendation(
  fitnessLevel: HeartRateFitnessLevel,
): string {
  switch (fitnessLevel) {
    case 'beginner':
      return 'As a beginner, focus on Zone 2 (60-70% Max HR) for most of your training to build aerobic base. Include some Zone 1 work for warm-up and recovery. Limit high-intensity work to 1-2 sessions per week.';
    case 'intermediate':
      return 'With regular exercise experience, aim for 60% Zone 2, 20% Zone 3, and 10% each in Zones 1 and 4. Include one Zone 5 session per week for intensity. This balanced approach improves both endurance and speed.';
    case 'advanced':
      return 'As an advanced athlete, use a polarized approach: 80% low intensity (Zones 1-2) and 20% high intensity (Zones 4-5). Include threshold work (Zone 3) 1-2 times per week for race-specific fitness.';
    case 'athlete':
      return 'Elite training requires periodization. Focus on base building in Zones 1-2 during off-season, add threshold work (Zone 3) in pre-season, and incorporate high-intensity (Zones 4-5) during competition phase. Always prioritize recovery.';
    default:
      return '';
  }
}

export function calculateHeartRateZones(
  values: HeartRateValues,
): HeartRateResult {
  const age = parseNumber(values.age);
  const restingHRInput = parseNumber(values.restingHeartRate);
  const restingHeartRate = restingHRInput === null ? 0 : restingHRInput;

  if (age === null || age < 15 || age > 100) {
    throw new Error('Please enter a valid age (15-100).');
  }

  if (
    values.restingHeartRate.trim() !== '' &&
    restingHRInput !== null &&
    restingHRInput !== 0 &&
    (restingHRInput < 40 || restingHRInput > 100)
  ) {
    throw new Error(
      'Please enter a valid resting heart rate (40-100) or leave blank.',
    );
  }

  if (!values.fitnessLevel || !values.method) {
    throw new Error('Please select your fitness level and calculation method.');
  }

  const maxHR = 220 - age;

  const heartRateReserve = maxHR - restingHeartRate;
  const useKarvonen =
    values.method === 'karvonen' && restingHeartRate > 0;

  const zones: HeartRateZone[] = HEART_RATE_ZONES.map(
    ({zone, label, intensity, percentage, description, lowFactor, highFactor}) => {
      let min: number;
      let max: number;

      if (useKarvonen) {
        min = Math.round(
          restingHeartRate + heartRateReserve * lowFactor,
        );
        max = Math.round(
          restingHeartRate + heartRateReserve * highFactor,
        );
      } else {
        min = Math.round(maxHR * lowFactor);
        max = Math.round(maxHR * highFactor);
      }

      return {
        zone,
        label,
        intensity,
        percentage,
        description,
        min,
        max,
      };
    },
  );

  let recommendations = fitnessRecommendation(values.fitnessLevel);

  if (useKarvonen) {
    recommendations +=
      ' The Karvonen method provides more accurate zones since it accounts for your fitness level through resting heart rate.';
  } else {
    recommendations +=
      ' Consider measuring your resting heart rate for more accurate zone calculations using the Karvonen method.';
  }

  return {
    maxHR,
    zones,
    recommendation: recommendations,
    method: values.method,
    restingHeartRate,
  };
}
