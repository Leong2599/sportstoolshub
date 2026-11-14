import {parseNumber} from './units';
import type {FieldErrors} from './validation';

export type InjuryGender = 'male' | 'female';

export type InjurySport =
  | 'running'
  | 'cycling'
  | 'swimming'
  | 'weightlifting'
  | 'soccer'
  | 'basketball'
  | 'football'
  | 'tennis'
  | 'golf'
  | 'yoga'
  | 'crossfit'
  | 'martial-arts'
  | 'skiing'
  | 'other';

export type InjuryExperience = 'beginner' | 'intermediate' | 'advanced' | 'expert';

export type InjuryIntensity = 'low' | 'moderate' | 'high' | 'very-high';

export type InjuryWarmUp = 'none' | 'minimal' | 'moderate' | 'comprehensive';

export type InjuryCondition =
  | 'poor'
  | 'below-average'
  | 'average'
  | 'good'
  | 'excellent';

export type InjuryBodyWeight = 'underweight' | 'normal' | 'overweight' | 'obese';

export type InjuryPreviousInjuries = 'none' | '1' | '2' | '3' | '4+';

export type InjuryType =
  | 'none'
  | 'sprain'
  | 'strain'
  | 'fracture'
  | 'dislocation'
  | 'concussion'
  | 'overuse'
  | 'other';

export type InjuryRecoveryTime =
  | 'none'
  | '1-week'
  | '1-2-weeks'
  | '2-4-weeks'
  | '1-3-months'
  | '3+months';

export type InjuryCurrentPain = 'none' | 'mild' | 'moderate' | 'severe';

export type InjuryStress = 'low' | 'moderate' | 'high' | 'very-high';

export type InjuryNutrition = 'poor' | 'fair' | 'good' | 'excellent';

export type InjuryHydration = 'poor' | 'fair' | 'good' | 'excellent';

export type InjuryValues = {
  age: string;
  gender: InjuryGender | '';
  sport: InjurySport | '';
  experience: InjuryExperience;
  weeklySessions: string;
  sessionDuration: string;
  intensity: InjuryIntensity;
  warmUp: InjuryWarmUp;
  coolDown: InjuryWarmUp;
  flexibility: InjuryCondition;
  strength: InjuryCondition;
  balance: InjuryCondition;
  bodyWeight: InjuryBodyWeight;
  previousInjuries: InjuryPreviousInjuries;
  injuryType: InjuryType;
  recoveryTime: InjuryRecoveryTime;
  currentPain: InjuryCurrentPain;
  sleep: string;
  stress: InjuryStress;
  nutrition: InjuryNutrition;
  hydration: InjuryHydration;
};

export type InjuryRiskCategoryKey =
  | 'personal'
  | 'training'
  | 'physical'
  | 'history'
  | 'lifestyle';

export type InjuryRiskCategory =
  | 'Very Low Risk'
  | 'Low Risk'
  | 'Moderate Risk'
  | 'High Risk'
  | 'Very High Risk';

export type InjuryRiskScores = Record<InjuryRiskCategoryKey, number>;

export type InjuryResult = {
  overallRisk: number;
  category: InjuryRiskCategory;
  color: string;
  scores: InjuryRiskScores;
  recommendations: string;
};

export const INJURY_SPORTS: readonly {value: InjurySport; label: string}[] = [
  {value: 'running', label: 'Running/Jogging'},
  {value: 'cycling', label: 'Cycling'},
  {value: 'swimming', label: 'Swimming'},
  {value: 'weightlifting', label: 'Weightlifting/Strength Training'},
  {value: 'soccer', label: 'Soccer'},
  {value: 'basketball', label: 'Basketball'},
  {value: 'football', label: 'Football'},
  {value: 'tennis', label: 'Tennis'},
  {value: 'golf', label: 'Golf'},
  {value: 'yoga', label: 'Yoga'},
  {value: 'crossfit', label: 'CrossFit'},
  {value: 'martial-arts', label: 'Martial Arts'},
  {value: 'skiing', label: 'Skiing/Snowboarding'},
  {value: 'other', label: 'Other'},
] as const;

export const INJURY_EXPERIENCE_OPTIONS: readonly {
  value: InjuryExperience;
  label: string;
}[] = [
  {value: 'beginner', label: 'Beginner (0-1 year)'},
  {value: 'intermediate', label: 'Intermediate (1-3 years)'},
  {value: 'advanced', label: 'Advanced (3-5 years)'},
  {value: 'expert', label: 'Expert (5+ years)'},
] as const;

export const INJURY_INTENSITY_OPTIONS: readonly {
  value: InjuryIntensity;
  label: string;
}[] = [
  {value: 'low', label: 'Low (Recovery/Beginner)'},
  {value: 'moderate', label: 'Moderate (Steady State)'},
  {value: 'high', label: 'High (Vigorous/Competitive)'},
  {value: 'very-high', label: 'Very High (Elite/Professional)'},
] as const;

export const INJURY_WARM_UP_OPTIONS: readonly {
  value: InjuryWarmUp;
  label: string;
}[] = [
  {value: 'none', label: 'No warm-up'},
  {value: 'minimal', label: 'Minimal (1-3 minutes)'},
  {value: 'moderate', label: 'Moderate (5-10 minutes)'},
  {value: 'comprehensive', label: 'Comprehensive (10+ minutes with dynamic stretching)'},
] as const;

export const INJURY_COOL_DOWN_OPTIONS: readonly {
  value: InjuryWarmUp;
  label: string;
}[] = [
  {value: 'none', label: 'No cool-down'},
  {value: 'minimal', label: 'Minimal (1-3 minutes)'},
  {value: 'moderate', label: 'Moderate (5-10 minutes)'},
  {value: 'comprehensive', label: 'Comprehensive (10+ minutes with stretching)'},
] as const;

export const INJURY_CONDITION_OPTIONS: readonly {
  value: InjuryCondition;
  label: string;
}[] = [
  {value: 'poor', label: 'Poor'},
  {value: 'below-average', label: 'Below Average'},
  {value: 'average', label: 'Average'},
  {value: 'good', label: 'Good'},
  {value: 'excellent', label: 'Excellent'},
] as const;

export const INJURY_BODY_WEIGHT_OPTIONS: readonly {
  value: InjuryBodyWeight;
  label: string;
}[] = [
  {value: 'underweight', label: 'Underweight'},
  {value: 'normal', label: 'Normal'},
  {value: 'overweight', label: 'Overweight'},
  {value: 'obese', label: 'Obese'},
] as const;

export const INJURY_PREVIOUS_INJURY_OPTIONS: readonly {
  value: InjuryPreviousInjuries;
  label: string;
}[] = [
  {value: 'none', label: 'None'},
  {value: '1', label: '1 injury'},
  {value: '2', label: '2 injuries'},
  {value: '3', label: '3 injuries'},
  {value: '4+', label: '4 or more injuries'},
] as const;

export const INJURY_TYPE_OPTIONS: readonly {value: InjuryType; label: string}[] = [
  {value: 'none', label: 'No previous injuries'},
  {value: 'sprain', label: 'Sprain (Ligament)'},
  {value: 'strain', label: 'Strain (Muscle/Tendon)'},
  {value: 'fracture', label: 'Fracture'},
  {value: 'dislocation', label: 'Dislocation'},
  {value: 'concussion', label: 'Concussion'},
  {value: 'overuse', label: 'Overuse Injury'},
  {value: 'other', label: 'Other'},
] as const;

export const INJURY_RECOVERY_OPTIONS: readonly {
  value: InjuryRecoveryTime;
  label: string;
}[] = [
  {value: 'none', label: 'N/A'},
  {value: '1-week', label: 'Less than 1 week'},
  {value: '1-2-weeks', label: '1-2 weeks'},
  {value: '2-4-weeks', label: '2-4 weeks'},
  {value: '1-3-months', label: '1-3 months'},
  {value: '3+months', label: '3+ months'},
] as const;

export const INJURY_PAIN_OPTIONS: readonly {
  value: InjuryCurrentPain;
  label: string;
}[] = [
  {value: 'none', label: 'None'},
  {value: 'mild', label: 'Mild (occasional, doesn’t limit activity)'},
  {value: 'moderate', label: 'Moderate (frequent, somewhat limits activity)'},
  {value: 'severe', label: 'Severe (constant, significantly limits activity)'},
] as const;

export const INJURY_STRESS_OPTIONS: readonly {
  value: InjuryStress;
  label: string;
}[] = [
  {value: 'low', label: 'Low (well-managed)'},
  {value: 'moderate', label: 'Moderate (manageable)'},
  {value: 'high', label: 'High (frequent stress)'},
  {value: 'very-high', label: 'Very High (chronic stress)'},
] as const;

export const INJURY_NUTRITION_OPTIONS: readonly {
  value: InjuryNutrition;
  label: string;
}[] = [
  {value: 'poor', label: 'Poor (frequent processed foods, inadequate nutrients)'},
  {value: 'fair', label: 'Fair (mixed diet, some gaps)'},
  {value: 'good', label: 'Good (balanced, mostly whole foods)'},
  {value: 'excellent', label: 'Excellent (optimal nutrition, well-planned)'},
] as const;

export const INJURY_HYDRATION_OPTIONS: readonly {
  value: InjuryHydration;
  label: string;
}[] = [
  {value: 'poor', label: 'Poor (rarely drink water)'},
  {value: 'fair', label: 'Fair (occasional water intake)'},
  {value: 'good', label: 'Good (regular water intake)'},
  {value: 'excellent', label: 'Excellent (consistent, adequate hydration)'},
] as const;

export const INJURY_ERRORS = {
  required: 'Please fill in all required fields.',
  age: 'Please enter a valid age (13-100).',
  sessions: 'Please enter a valid number of sessions (1-20).',
  duration: 'Please enter a valid session duration (15-300 minutes).',
  sleep: 'Please enter a valid sleep value (3-12 hours).',
} as const;

const EXPERIENCE_RISK: Record<InjuryExperience, number> = {
  beginner: 20,
  intermediate: 10,
  advanced: 5,
  expert: 10,
};

const INTENSITY_RISK: Record<InjuryIntensity, number> = {
  low: 5,
  moderate: 10,
  high: 20,
  'very-high': 30,
};

const WARM_UP_RISK: Record<InjuryWarmUp, number> = {
  none: 25,
  minimal: 15,
  moderate: 5,
  comprehensive: 0,
};

const COOL_DOWN_RISK: Record<InjuryWarmUp, number> = {
  none: 20,
  minimal: 10,
  moderate: 5,
  comprehensive: 0,
};

const FLEXIBILITY_RISK: Record<InjuryCondition, number> = {
  poor: 25,
  'below-average': 15,
  average: 10,
  good: 5,
  excellent: 0,
};

const STRENGTH_RISK: Record<InjuryCondition, number> = {
  poor: 20,
  'below-average': 15,
  average: 5,
  good: 0,
  excellent: 0,
};

const BALANCE_RISK: Record<InjuryCondition, number> = {
  poor: 20,
  'below-average': 15,
  average: 5,
  good: 0,
  excellent: 0,
};

const BODY_WEIGHT_RISK: Record<InjuryBodyWeight, number> = {
  underweight: 15,
  normal: 0,
  overweight: 10,
  obese: 25,
};

const INJURY_COUNT_RISK: Record<InjuryPreviousInjuries, number> = {
  none: 0,
  '1': 15,
  '2': 25,
  '3': 35,
  '4+': 45,
};

const RECOVERY_RISK: Record<InjuryRecoveryTime, number> = {
  none: 0,
  '1-week': 5,
  '1-2-weeks': 10,
  '2-4-weeks': 15,
  '1-3-months': 25,
  '3+months': 35,
};

const PAIN_RISK: Record<InjuryCurrentPain, number> = {
  none: 0,
  mild: 10,
  moderate: 25,
  severe: 40,
};

const STRESS_RISK: Record<InjuryStress, number> = {
  low: 0,
  moderate: 10,
  high: 20,
  'very-high': 30,
};

const NUTRITION_RISK: Record<InjuryNutrition, number> = {
  poor: 25,
  fair: 15,
  good: 5,
  excellent: 0,
};

const HYDRATION_RISK: Record<InjuryHydration, number> = {
  poor: 20,
  fair: 10,
  good: 0,
  excellent: 0,
};

const RISK_WEIGHTS: Record<InjuryRiskCategoryKey, number> = {
  personal: 0.15,
  training: 0.25,
  physical: 0.2,
  history: 0.25,
  lifestyle: 0.15,
};

const DEFAULT_SLEEP = 7;

export const INJURY_CATEGORY_LABELS: Record<InjuryRiskCategoryKey, string> = {
  personal: 'Personal Factors',
  training: 'Training Factors',
  physical: 'Physical Condition',
  history: 'Injury History',
  lifestyle: 'Lifestyle Factors',
};

export function getRiskCategory(risk: number): InjuryRiskCategory {
  if (risk < 20) return 'Very Low Risk';
  if (risk < 35) return 'Low Risk';
  if (risk < 50) return 'Moderate Risk';
  if (risk < 70) return 'High Risk';
  return 'Very High Risk';
}

export function getRiskColor(risk: number): string {
  if (risk < 20) return '#10b981';
  if (risk < 35) return '#3b82f6';
  if (risk < 50) return '#f59e0b';
  if (risk < 70) return '#ef4444';
  return '#991b1b';
}

export function validateInjuryValues(
  values: InjuryValues,
): FieldErrors<InjuryValues> {
  const errors: FieldErrors<InjuryValues> = {};
  const age = parseNumber(values.age);

  if (!values.gender) {
    errors.gender = INJURY_ERRORS.required;
  }

  if (!values.sport) {
    errors.sport = INJURY_ERRORS.required;
  }

  if (age === null || age < 13 || age > 100) {
    errors.age = INJURY_ERRORS.age;
  }

  if (values.weeklySessions.trim() !== '') {
    const sessions = parseNumber(values.weeklySessions);

    if (sessions === null || sessions < 1 || sessions > 20) {
      errors.weeklySessions = INJURY_ERRORS.sessions;
    }
  }

  if (values.sessionDuration.trim() !== '') {
    const duration = parseNumber(values.sessionDuration);

    if (duration === null || duration < 15 || duration > 300) {
      errors.sessionDuration = INJURY_ERRORS.duration;
    }
  }

  if (values.sleep.trim() !== '') {
    const sleep = parseNumber(values.sleep);

    if (sleep === null || sleep < 3 || sleep > 12) {
      errors.sleep = INJURY_ERRORS.sleep;
    }
  }

  return errors;
}

export function calculatePersonalRisk(values: InjuryValues): number {
  let risk = 0;
  const age = parseNumber(values.age) ?? 0;

  if (age < 16) risk += 15;
  else if (age >= 40) risk += 10;

  if (values.gender === 'female') risk += 5;

  risk += EXPERIENCE_RISK[values.experience] || 10;

  return Math.min(100, risk);
}

export function calculateTrainingRisk(values: InjuryValues): number {
  let risk = 0;
  const sessions = Number.parseInt(values.weeklySessions, 10) || 0;
  const duration = Number.parseInt(values.sessionDuration, 10) || 0;
  const weeklyHours = (sessions * duration) / 60;

  if (weeklyHours > 15) risk += 20;
  else if (weeklyHours > 10) risk += 10;
  else if (weeklyHours < 3) risk += 15;

  risk += INTENSITY_RISK[values.intensity] || 10;
  risk += WARM_UP_RISK[values.warmUp] || 10;
  risk += COOL_DOWN_RISK[values.coolDown] || 5;

  return Math.min(100, risk);
}

export function calculatePhysicalRisk(values: InjuryValues): number {
  let risk = 0;

  risk += FLEXIBILITY_RISK[values.flexibility] || 10;
  risk += STRENGTH_RISK[values.strength] || 5;
  risk += BALANCE_RISK[values.balance] || 5;
  risk += BODY_WEIGHT_RISK[values.bodyWeight] || 5;

  return Math.min(100, risk);
}

export function calculateHistoryRisk(values: InjuryValues): number {
  let risk = 0;

  risk += INJURY_COUNT_RISK[values.previousInjuries] || 0;
  risk += RECOVERY_RISK[values.recoveryTime] || 0;
  risk += PAIN_RISK[values.currentPain] || 0;

  return Math.min(100, risk);
}

export function calculateLifestyleRisk(values: InjuryValues): number {
  let risk = 0;
  const sleep = parseNumber(values.sleep) || DEFAULT_SLEEP;

  if (sleep < 6) risk += 20;
  else if (sleep < 7) risk += 10;
  else if (sleep > 9) risk += 5;

  risk += STRESS_RISK[values.stress] || 10;
  risk += NUTRITION_RISK[values.nutrition] || 10;
  risk += HYDRATION_RISK[values.hydration] || 5;

  return Math.min(100, risk);
}

export function calculateInjuryRisk(values: InjuryValues): InjuryResult {
  if (!values.gender || !values.sport) {
    throw new Error(INJURY_ERRORS.required);
  }

  const scores: InjuryRiskScores = {
    personal: calculatePersonalRisk(values),
    training: calculateTrainingRisk(values),
    physical: calculatePhysicalRisk(values),
    history: calculateHistoryRisk(values),
    lifestyle: calculateLifestyleRisk(values),
  };

  let totalRisk = 0;

  for (const [category, score] of Object.entries(scores) as Array<
    [InjuryRiskCategoryKey, number]
  >) {
    totalRisk += score * RISK_WEIGHTS[category];
  }

  const overallRisk = Math.round(totalRisk);
  const category = getRiskCategory(overallRisk);
  const color = getRiskColor(overallRisk);

  let recommendations = `Based on your assessment, your overall injury risk is ${overallRisk}%. `;

  const highRiskAreas = (Object.entries(scores) as Array<
    [InjuryRiskCategoryKey, number]
  >)
    .filter(([, score]) => score > 60)
    .map(([area]) => area);

  if (highRiskAreas.length > 0) {
    recommendations += `Your highest risk areas are: ${highRiskAreas.join(
      ', ',
    )}. `;
  }

  if (scores.training > 50) {
    recommendations +=
      'Focus on proper warm-up and cool-down routines. Consider reducing training intensity or volume if experiencing fatigue. ';
  }

  if (scores.physical > 50) {
    recommendations +=
      'Incorporate regular flexibility, strength, and balance training into your routine. Consider working with a physical therapist or trainer. ';
  }

  if (scores.history > 50) {
    recommendations +=
      'Ensure complete recovery before returning to sport. Consider gradual return-to-play protocols and address any underlying biomechanical issues. ';
  }

  if (scores.lifestyle > 50) {
    recommendations +=
      'Prioritize sleep (7-9 hours), manage stress through relaxation techniques, maintain proper nutrition, and stay well-hydrated. ';
  }

  if (overallRisk < 35) {
    recommendations +=
      'Continue with good injury prevention practices and maintain your current training routine.';
  } else if (overallRisk < 50) {
    recommendations +=
      'Implement targeted prevention strategies and monitor for warning signs.';
  } else if (overallRisk < 70) {
    recommendations +=
      'Consider consulting with a sports medicine professional for a comprehensive evaluation and personalized prevention plan.';
  } else {
    recommendations +=
      'Strongly recommend immediate consultation with a sports medicine professional. Modify or pause training until risk factors are addressed.';
  }

  return {
    overallRisk,
    category,
    color,
    scores,
    recommendations,
  };
}
