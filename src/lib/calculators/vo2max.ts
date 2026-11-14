import {parseNumber, toKilograms, type WeightUnit} from './units';
import type {FieldErrors} from './validation';

export type Vo2MaxMethod =
  | 'resting-heart-rate'
  | '1.5-mile-run'
  | '12-minute-run'
  | 'step-test';

export type Vo2MaxGender = 'male' | 'female';

export type Vo2MaxDistanceUnit = 'km' | 'miles' | 'meters';

export type Vo2MaxValues = {
  method: Vo2MaxMethod | '';
  age: string;
  gender: Vo2MaxGender | '';
  weight: string;
  weightUnit: WeightUnit;
  restingHeartRate: string;
  runMinutes: string;
  runSeconds: string;
  distanceCovered: string;
  distanceUnit: Vo2MaxDistanceUnit;
  stepDuration: string;
  postExerciseHr: string;
  recoveryHr: string;
};

export type Vo2MaxCategory =
  | 'Excellent'
  | 'Superior'
  | 'Good'
  | 'Average'
  | 'Fair'
  | 'Poor'
  | 'Very Poor';

export type Vo2MaxRange = {
  category: Vo2MaxCategory;
  min: number;
  color: string;
};

export type Vo2MaxResult = {
  vo2Max: number;
  display: string;
  category: Vo2MaxCategory;
  color: string;
  ranges: readonly Vo2MaxRange[];
  recommendation: string;
};

export const VO2_MAX_METHODS: readonly {value: Vo2MaxMethod; label: string}[] = [
  {value: 'resting-heart-rate', label: 'Resting Heart Rate Method'},
  {value: '1.5-mile-run', label: '1.5 Mile Run Test'},
  {value: '12-minute-run', label: '12 Minute Run Test'},
  {value: 'step-test', label: 'Step Test'},
] as const;

export const VO2_MAX_DISTANCE_UNITS: readonly {
  value: Vo2MaxDistanceUnit;
  label: string;
}[] = [
  {value: 'km', label: 'kilometers'},
  {value: 'miles', label: 'miles'},
  {value: 'meters', label: 'meters'},
] as const;

export const VO2_MAX_ERRORS = {
  required: 'Please fill in all required fields.',
  method: 'Please select a calculation method.',
  invalid: 'Invalid input values. Please check your entries.',
  restingHeartRate: 'Please enter a valid resting heart rate (40-120).',
  runTime: 'Please enter a valid run time.',
  distance: 'Please enter a valid distance covered.',
  heartRate: 'Please enter valid heart rate values.',
} as const;

const FEMALE_MULTIPLIER = 0.85;

export function getVo2MaxRanges(age: number, gender: Vo2MaxGender): Vo2MaxRange[] {
  const baseRanges: {category: Vo2MaxCategory; min: number}[] = [
    {min: 60, category: 'Excellent'},
    {min: 50, category: 'Good'},
    {min: 40, category: 'Average'},
    {min: 30, category: 'Fair'},
    {min: 0, category: 'Poor'},
  ];

  if (age > 40) {
    baseRanges.forEach((range) => {
      range.min *= 0.85;
    });
  }

  if (gender === 'female') {
    baseRanges.forEach((range) => {
      range.min *= 0.85;
    });
  }

  return baseRanges.map((range) => ({
    category: range.category,
    min: range.min,
    color: getVo2MaxColor(range.category),
  }));
}

export function getVo2MaxCategory(
  vo2Max: number,
  age: number,
  gender: Vo2MaxGender,
): Vo2MaxCategory {
  const ranges = getVo2MaxRanges(age, gender);

  for (const range of ranges) {
    if (vo2Max >= range.min) {
      return range.category;
    }
  }

  return 'Very Poor';
}

export function getVo2MaxColor(category: Vo2MaxCategory): string {
  const colors: Record<Vo2MaxCategory, string> = {
    Excellent: '#10b981',
    Superior: '#10b981',
    Good: '#3b82f6',
    Average: '#f59e0b',
    Fair: '#f59e0b',
    Poor: '#ef4444',
    'Very Poor': '#ef4444',
  };

  return colors[category] ?? '#6b7280';
}

export function getVo2MaxRecommendation(
  category: Vo2MaxCategory,
): string {
  let recommendation: string;

  switch (category) {
    case 'Excellent':
    case 'Superior':
      recommendation =
        'Outstanding cardiovascular fitness! Maintain your current training program with 3-5 sessions per week. Consider adding variety with different types of cardio and ensure adequate recovery.';
      break;
    case 'Good':
      recommendation =
        'Great fitness level! Continue with regular aerobic exercise 3-4 times per week. Incorporate both steady-state and interval training to further improve your VO2 Max.';
      break;
    case 'Average':
      recommendation =
        'Good foundation for improvement. Aim for 3-4 cardio sessions per week, gradually increasing intensity. Include interval training and longer duration sessions to boost your cardiovascular fitness.';
      break;
    case 'Fair':
    case 'Poor':
      recommendation =
        'Focus on building your aerobic base with regular moderate-intensity exercise 3-4 times per week. Start with 20-30 minute sessions and gradually increase duration and intensity. Consult with a healthcare provider before starting a new exercise program.';
      break;
    default:
      recommendation =
        'Regular cardiovascular exercise is essential for health. Start with low-intensity activities and gradually progress. Consider consulting with a fitness professional for a personalized program.';
  }

  recommendation +=
    ' Remember that consistency is key, and proper recovery is just as important as training.';

  return recommendation;
}

export function validateVo2MaxValues(
  values: Vo2MaxValues,
): FieldErrors<Vo2MaxValues> {
  const errors: FieldErrors<Vo2MaxValues> = {};
  const age = parseNumber(values.age);
  const weight = parseNumber(values.weight);

  if (!values.method) {
    errors.method = VO2_MAX_ERRORS.method;
  }

  if (age === null || age < 13 || age > 100) {
    errors.age = VO2_MAX_ERRORS.required;
  }

  if (!values.gender) {
    errors.gender = VO2_MAX_ERRORS.required;
  }

  if (weight === null || weight < 30 || weight > 300) {
    errors.weight = VO2_MAX_ERRORS.required;
  }

  if (values.method === 'resting-heart-rate') {
    const restingHr = parseNumber(values.restingHeartRate);

    if (restingHr === null || restingHr < 40 || restingHr > 120) {
      errors.restingHeartRate = VO2_MAX_ERRORS.restingHeartRate;
    }
  }

  if (values.method === '1.5-mile-run') {
    const minutes = parseNumber(values.runMinutes);
    const seconds = parseNumber(values.runSeconds);

    if (
      minutes === null ||
      seconds === null ||
      minutes < 0 ||
      minutes > 59 ||
      seconds < 0 ||
      seconds > 59 ||
      minutes * 60 + seconds <= 0
    ) {
      errors.runMinutes = VO2_MAX_ERRORS.runTime;
    }
  }

  if (values.method === '12-minute-run') {
    const distance = parseNumber(values.distanceCovered);

    if (distance === null || distance <= 0) {
      errors.distanceCovered = VO2_MAX_ERRORS.distance;
    }
  }

  if (values.method === 'step-test') {
    const postExerciseHr = parseNumber(values.postExerciseHr);
    const recoveryHr = parseNumber(values.recoveryHr);

    if (
      postExerciseHr === null ||
      recoveryHr === null ||
      postExerciseHr < 80 ||
      postExerciseHr > 200 ||
      recoveryHr < 80 ||
      recoveryHr > 200
    ) {
      errors.postExerciseHr = VO2_MAX_ERRORS.heartRate;
    }
  }

  return errors;
}

export function calculateVo2Max(values: Vo2MaxValues): Vo2MaxResult {
  const age = parseNumber(values.age);
  const weight = parseNumber(values.weight);

  if (!values.method) {
    throw new Error(VO2_MAX_ERRORS.method);
  }

  if (age === null || !values.gender || weight === null) {
    throw new Error(VO2_MAX_ERRORS.required);
  }

  const weightKg = toKilograms(weight, values.weightUnit);
  let vo2max = 0;

  switch (values.method) {
    case 'resting-heart-rate': {
      const restingHr = parseNumber(values.restingHeartRate);

      if (restingHr === null) {
        throw new Error(VO2_MAX_ERRORS.invalid);
      }

      const maxHR = 220 - age;
      vo2max = 15.3 * (maxHR / restingHr);
      break;
    }
    case '1.5-mile-run': {
      const minutes = Number.parseInt(values.runMinutes, 10) || 0;
      const seconds = Number.parseInt(values.runSeconds, 10) || 0;
      const totalTimeMinutes = minutes + seconds / 60;

      vo2max =
        100.5 -
        0.163 * weightKg -
        2.2 * totalTimeMinutes -
        0.071 * age;
      break;
    }
    case '12-minute-run': {
      const distance = parseNumber(values.distanceCovered);

      if (distance === null) {
        throw new Error(VO2_MAX_ERRORS.invalid);
      }

      let distanceMeters = distance;

      if (values.distanceUnit === 'km') {
        distanceMeters = distance * 1000;
      } else if (values.distanceUnit === 'miles') {
        distanceMeters = distance * 1609.34;
      }

      vo2max = (distanceMeters - 504.9) / 44.73;
      break;
    }
    case 'step-test': {
      const postExerciseHr = parseNumber(values.postExerciseHr);
      const recoveryHr = parseNumber(values.recoveryHr);
      const duration = Number.parseInt(values.stepDuration, 10) || 0;

      if (postExerciseHr === null || recoveryHr === null) {
        throw new Error(VO2_MAX_ERRORS.invalid);
      }

      const heartRateRecovery = postExerciseHr - recoveryHr;
      vo2max =
        111.33 -
        0.42 * postExerciseHr +
        0.234 * age +
        0.845 * heartRateRecovery -
        2.9 * duration;
      break;
    }
    default:
      throw new Error(VO2_MAX_ERRORS.method);
  }

  if (values.gender === 'female') {
    vo2max *= FEMALE_MULTIPLIER;
  }

  if (values.method === '12-minute-run') {
    const ageFactor = Math.max(0.7, 1 - (age - 25) * 0.01);
    vo2max *= ageFactor;
  }

  if (vo2max <= 0) {
    throw new Error(VO2_MAX_ERRORS.invalid);
  }

  const category = getVo2MaxCategory(vo2max, age, values.gender);

  return {
    vo2Max: vo2max,
    display: `${(Math.round(vo2max * 10) / 10).toFixed(1)} ml/kg/min`,
    category,
    color: getVo2MaxColor(category),
    ranges: getVo2MaxRanges(age, values.gender),
    recommendation: getVo2MaxRecommendation(category),
  };
}
