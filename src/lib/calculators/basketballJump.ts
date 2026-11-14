import {parseNumber} from './units';
import {rangeError} from './sportValidation';
import type {FieldErrors} from './validation';

export type JumpHeightUnit = 'inches' | 'cm';

export type JumpWeightUnit = 'lbs' | 'kg';

export type JumpDistanceUnit = 'feet' | 'meters';

export type JumpGender = 'male' | 'female';

export type BasketballJumpValues = {
  jumpHeight: string;
  jumpUnit: JumpHeightUnit;
  bodyWeight: string;
  weightUnit: JumpWeightUnit;
  approachDistance: string;
  distanceUnit: JumpDistanceUnit;
  age: string;
  gender: JumpGender | '';
};

export type JumpRating =
  | 'Elite'
  | 'Excellent'
  | 'Very Good'
  | 'Good'
  | 'Average'
  | 'Below Average';

export type BasketballJumpResult = {
  jumpHeightInches: number;
  jumpHeightDisplay: string;
  powerOutput: number;
  powerOutputDisplay: string;
  forceGeneration: number;
  forceGenerationDisplay: string;
  percentile: number;
  approachBonus: number;
  rating: JumpRating;
  recommendations: readonly string[];
};

export const JUMP_HEIGHT_UNITS: readonly {
  value: JumpHeightUnit;
  label: string;
}[] = [
  {value: 'inches', label: 'inches'},
  {value: 'cm', label: 'cm'},
] as const;

export const JUMP_WEIGHT_UNITS: readonly {
  value: JumpWeightUnit;
  label: string;
}[] = [
  {value: 'lbs', label: 'lbs'},
  {value: 'kg', label: 'kg'},
] as const;

export const JUMP_DISTANCE_UNITS: readonly {
  value: JumpDistanceUnit;
  label: string;
}[] = [
  {value: 'feet', label: 'feet'},
  {value: 'meters', label: 'meters'},
] as const;

export const JUMP_GENDERS: readonly {value: JumpGender; label: string}[] = [
  {value: 'male', label: 'Male'},
  {value: 'female', label: 'Female'},
] as const;

export const JUMP_ERRORS = {
  jumpHeight: 'Please enter a valid vertical jump height.',
  bodyWeight: 'Please enter a valid body weight.',
  approachDistance: 'Please enter a valid approach distance.',
  age: 'Please enter a valid age.',
  gender: 'Please select a gender.',
} as const;

const GRAVITY = 9.81;
const METERS_TO_FEET = 3.28084;
const KG_PER_LB = 2.20462;
const PUSH_OFF_SECONDS = 0.15;

type AgeStandard = {avg: number; excellent: number};

type GenderStandards = Record<number, AgeStandard>;

const PERCENTILE_STANDARDS: Record<JumpGender, GenderStandards> = {
  male: {
    15: {avg: 20, excellent: 28},
    20: {avg: 22, excellent: 30},
    25: {avg: 24, excellent: 32},
    30: {avg: 23, excellent: 31},
  },
  female: {
    15: {avg: 16, excellent: 22},
    20: {avg: 18, excellent: 24},
    25: {avg: 19, excellent: 25},
    30: {avg: 18, excellent: 24},
  },
};

export function validateBasketballJumpValues(
  values: BasketballJumpValues,
): FieldErrors<BasketballJumpValues> {
  const errors: FieldErrors<BasketballJumpValues> = {};
  const jumpHeight = parseNumber(values.jumpHeight);
  const bodyWeight = parseNumber(values.bodyWeight);
  const approachDistance = parseNumber(values.approachDistance);
  const age = parseNumber(values.age);

  if (jumpHeight === null) {
    errors.jumpHeight = JUMP_ERRORS.jumpHeight;
  } else if (jumpHeight < 0 || jumpHeight > 60) {
    errors.jumpHeight = rangeError('vertical jump height', 0, 60);
  }

  if (bodyWeight === null) {
    errors.bodyWeight = JUMP_ERRORS.bodyWeight;
  } else if (bodyWeight < 50 || bodyWeight > 400) {
    errors.bodyWeight = rangeError('body weight', 50, 400);
  }

  if (approachDistance === null) {
    errors.approachDistance = JUMP_ERRORS.approachDistance;
  } else if (approachDistance < 0 || approachDistance > 20) {
    errors.approachDistance = rangeError('approach distance', 0, 20);
  }

  if (age === null) {
    errors.age = JUMP_ERRORS.age;
  } else if (age < 10 || age > 50) {
    errors.age = rangeError('age', 10, 50);
  }

  if (!values.gender) {
    errors.gender = JUMP_ERRORS.gender;
  }

  return errors;
}

export function calculatePowerOutput(
  jumpHeightInches: number,
  bodyWeightKg: number,
): number {
  const time = Math.sqrt((2 * jumpHeightInches * 0.0254) / GRAVITY);

  return (bodyWeightKg * GRAVITY * jumpHeightInches * 0.0254) / time;
}

export function calculateForceGeneration(
  jumpHeightInches: number,
  bodyWeightKg: number,
): number {
  const velocity = Math.sqrt(2 * GRAVITY * jumpHeightInches * 0.0254);
  const acceleration = velocity / PUSH_OFF_SECONDS;

  return bodyWeightKg * (GRAVITY + acceleration);
}

export function calculateJumpPercentile(
  jumpHeightInches: number,
  age: number,
  gender: JumpGender,
): number {
  const ageGroup = Math.min(Math.floor(age / 5) * 5 + 15, 30);
  const standard =
    PERCENTILE_STANDARDS[gender]?.[ageGroup] ??
    PERCENTILE_STANDARDS.male[20];
  const percentile =
    ((jumpHeightInches - standard.avg) /
      (standard.excellent - standard.avg)) *
      50 +
    50;

  return Math.max(0, Math.min(99, Math.round(percentile)));
}

export function calculateApproachBonus(
  approachDistance: number,
  unit: JumpDistanceUnit,
): number {
  const distanceFt =
    unit === 'meters' ? approachDistance * METERS_TO_FEET : approachDistance;

  return Math.min(15, distanceFt * 1.5);
}

export function getJumpRating(jumpHeightInches: number): JumpRating {
  if (jumpHeightInches >= 40) return 'Elite';
  if (jumpHeightInches >= 35) return 'Excellent';
  if (jumpHeightInches >= 30) return 'Very Good';
  if (jumpHeightInches >= 25) return 'Good';
  if (jumpHeightInches >= 20) return 'Average';

  return 'Below Average';
}

export function generateJumpRecommendations(
  jumpHeightInches: number,
  age: number,
  powerOutput: number,
): string[] {
  const recommendations: string[] = [];

  if (jumpHeightInches < 25) {
    recommendations.push(
      'Focus on plyometric training 2-3 times per week',
    );
    recommendations.push('Include squats and deadlifts in strength training');
  } else if (jumpHeightInches < 35) {
    recommendations.push('Add depth jumps and box jumps to your routine');
    recommendations.push('Incorporate Olympic lifts for explosive power');
  } else {
    recommendations.push(
      'Maintain current training with progressive overload',
    );
    recommendations.push('Focus on landing mechanics and injury prevention');
  }

  if (powerOutput < 3000) {
    recommendations.push('Increase lower body strength training');
  }

  if (age < 20) {
    recommendations.push('Focus on proper technique and gradual progression');
  } else if (age > 30) {
    recommendations.push('Include recovery days and mobility work');
  }

  return recommendations;
}

export function calculateBasketballJump(
  values: BasketballJumpValues,
): BasketballJumpResult {
  const jumpHeight = parseNumber(values.jumpHeight);
  const bodyWeight = parseNumber(values.bodyWeight);
  const approachDistance = parseNumber(values.approachDistance);
  const age = parseNumber(values.age);

  if (jumpHeight === null) {
    throw new Error(JUMP_ERRORS.jumpHeight);
  }

  if (bodyWeight === null) {
    throw new Error(JUMP_ERRORS.bodyWeight);
  }

  if (approachDistance === null) {
    throw new Error(JUMP_ERRORS.approachDistance);
  }

  if (age === null) {
    throw new Error(JUMP_ERRORS.age);
  }

  if (!values.gender) {
    throw new Error(JUMP_ERRORS.gender);
  }

  const jumpHeightInches =
    values.jumpUnit === 'cm' ? jumpHeight / 2.54 : jumpHeight;
  const bodyWeightKg =
    values.weightUnit === 'lbs' ? bodyWeight / KG_PER_LB : bodyWeight;
  const powerOutput = calculatePowerOutput(jumpHeightInches, bodyWeightKg);
  const forceGeneration = calculateForceGeneration(
    jumpHeightInches,
    bodyWeightKg,
  );
  const percentile = calculateJumpPercentile(
    jumpHeightInches,
    age,
    values.gender,
  );
  const approachBonus = calculateApproachBonus(
    approachDistance,
    values.distanceUnit,
  );
  const rating = getJumpRating(jumpHeightInches);

  return {
    jumpHeightInches,
    jumpHeightDisplay: jumpHeightInches.toFixed(1),
    powerOutput,
    powerOutputDisplay: powerOutput.toFixed(0),
    forceGeneration,
    forceGenerationDisplay: forceGeneration.toFixed(0),
    percentile,
    approachBonus,
    rating,
    recommendations: generateJumpRecommendations(
      jumpHeightInches,
      age,
      powerOutput,
    ),
  };
}
