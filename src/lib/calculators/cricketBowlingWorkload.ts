import {parseNumber} from './units';
import {rangeError} from './sportValidation';
import type {FieldErrors} from './validation';

export type BowlingType =
  | 'fast'
  | 'fast-medium'
  | 'medium'
  | 'spin-finger'
  | 'spin-wrist';

export type BowlingIntensity = 'light' | 'moderate' | 'high' | 'maximum';

export type CricketWorkloadValues = {
  bowlingType: BowlingType | '';
  ballsBowled: string;
  overs: string;
  sessionDuration: string;
  intensity: BowlingIntensity | '';
  daysSinceLast: string;
  age: string;
  experience: string;
  recentWorkload: string;
};

export type InjuryRiskLevel =
  | 'Very Low'
  | 'Low'
  | 'Medium'
  | 'High'
  | 'Very High';

export type FatigueLevel =
  | 'Very Low'
  | 'Low'
  | 'Moderate'
  | 'High'
  | 'Very High';

export type CricketWorkloadResult = {
  workloadScore: number;
  workloadScoreDisplay: string;
  acuteChronicRatio: number;
  acuteChronicRatioDisplay: string;
  injuryRisk: InjuryRiskLevel;
  fatigueLevel: FatigueLevel;
  performanceReadiness: number;
  performanceReadinessDisplay: string;
  recoveryRecommendation: string;
  workloadPercentage: number;
  workloadPercentageDisplay: string;
  ballsPerOver: number;
  ballsPerOverDisplay: string;
  ballsPerMinute: number;
  ballsPerMinuteDisplay: string;
  insights: readonly string[];
  recommendations: readonly string[];
};

export const BOWLING_TYPES: readonly {value: BowlingType; label: string}[] = [
  {value: 'fast', label: 'Fast Bowler'},
  {value: 'fast-medium', label: 'Fast-Medium'},
  {value: 'medium', label: 'Medium Pace'},
  {value: 'spin-finger', label: 'Finger Spinner'},
  {value: 'spin-wrist', label: 'Wrist Spinner'},
] as const;

export const BOWLING_INTENSITIES: readonly {
  value: BowlingIntensity;
  label: string;
}[] = [
  {value: 'light', label: 'Light (60-70% effort)'},
  {value: 'moderate', label: 'Moderate (70-85% effort)'},
  {value: 'high', label: 'High (85-95% effort)'},
  {value: 'maximum', label: 'Maximum (95-100% effort)'},
] as const;

export const CRICKET_ERRORS = {
  bowlingType: 'Please select a bowling type.',
  ballsBowled: 'Please enter a valid number of balls bowled.',
  overs: 'Please enter a valid number of overs.',
  sessionDuration: 'Please enter a valid session duration.',
  intensity: 'Please select an intensity level.',
  daysSinceLast: 'Please enter a valid number of days since your last session.',
  age: 'Please enter a valid age.',
  experience: 'Please enter a valid number of years of experience.',
  recentWorkload: 'Please enter a valid recent workload.',
} as const;

const INTENSITY_MULTIPLIERS: Record<BowlingIntensity, number> = {
  light: 0.8,
  moderate: 1.0,
  high: 1.3,
  maximum: 1.6,
};

const TYPE_ADJUSTMENTS: Record<BowlingType, number> = {
  fast: 1.3,
  'fast-medium': 1.2,
  medium: 1.0,
  'spin-finger': 0.8,
  'spin-wrist': 0.9,
};

const MAX_BALLS_TYPE_ADJUSTMENT: Record<BowlingType, number> = {
  fast: 0.8,
  'fast-medium': 0.85,
  medium: 1.0,
  'spin-finger': 1.1,
  'spin-wrist': 1.05,
};

const TYPE_RECOMMENDATIONS: Record<BowlingType, readonly string[]> = {
  fast: ['Focus on strengthening shoulder and core', 'Monitor elbow stress'],
  'fast-medium': ['Maintain balanced bowling action', 'Work on stamina'],
  medium: ['Focus on accuracy and variation', 'Build bowling endurance'],
  'spin-finger': ['Work on finger strength', 'Focus on revolutions'],
  'spin-wrist': ['Strengthen wrist and forearm', 'Focus on control'],
};

export function validateCricketWorkloadValues(
  values: CricketWorkloadValues,
): FieldErrors<CricketWorkloadValues> {
  const errors: FieldErrors<CricketWorkloadValues> = {};

  if (!values.bowlingType) {
    errors.bowlingType = CRICKET_ERRORS.bowlingType;
  }

  const balls = parseNumber(values.ballsBowled);

  if (balls === null) {
    errors.ballsBowled = CRICKET_ERRORS.ballsBowled;
  } else if (balls < 0 || balls > 500) {
    errors.ballsBowled = rangeError('number of balls bowled', 0, 500);
  }

  const overs = parseNumber(values.overs);

  if (overs === null) {
    errors.overs = CRICKET_ERRORS.overs;
  } else if (overs < 0 || overs > 60) {
    errors.overs = rangeError('number of overs', 0, 60);
  }

  const duration = parseNumber(values.sessionDuration);

  if (duration === null) {
    errors.sessionDuration = CRICKET_ERRORS.sessionDuration;
  } else if (duration < 1 || duration > 600) {
    errors.sessionDuration = rangeError('session duration', 1, 600);
  }

  if (!values.intensity) {
    errors.intensity = CRICKET_ERRORS.intensity;
  }

  const daysSinceLast = parseNumber(values.daysSinceLast);

  if (daysSinceLast === null) {
    errors.daysSinceLast = CRICKET_ERRORS.daysSinceLast;
  } else if (daysSinceLast < 0 || daysSinceLast > 365) {
    errors.daysSinceLast = rangeError('days since last session', 0, 365);
  }

  const age = parseNumber(values.age);

  if (age === null) {
    errors.age = CRICKET_ERRORS.age;
  } else if (age < 10 || age > 60) {
    errors.age = rangeError('age', 10, 60);
  }

  const experience = parseNumber(values.experience);

  if (experience === null) {
    errors.experience = CRICKET_ERRORS.experience;
  } else if (experience < 0 || experience > 50) {
    errors.experience = rangeError('years of experience', 0, 50);
  }

  const recentWorkload = parseNumber(values.recentWorkload);

  if (recentWorkload === null) {
    errors.recentWorkload = CRICKET_ERRORS.recentWorkload;
  } else if (recentWorkload < 0 || recentWorkload > 5000) {
    errors.recentWorkload = rangeError('recent workload', 0, 5000);
  }

  return errors;
}

export function calculateWorkloadScore(
  balls: number,
  duration: number,
  intensity: BowlingIntensity,
  bowlingType: BowlingType,
): number {
  const baseScore = (balls / duration) * 60;

  return (
    baseScore *
    (INTENSITY_MULTIPLIERS[intensity] || 1.0) *
    (TYPE_ADJUSTMENTS[bowlingType] || 1.0)
  );
}

export function calculateAcuteChronicRatio(
  currentBalls: number,
  recentWorkload: number,
): number {
  const estimatedChronic = recentWorkload || currentBalls * 2.5;
  const acuteWorkload = currentBalls;

  if (estimatedChronic === 0) return 1.0;

  return acuteWorkload / estimatedChronic;
}

export function calculateCricketInjuryRisk(
  workloadScore: number,
  acwr: number,
  daysSinceLast: number,
  age: number,
  experience: number,
): InjuryRiskLevel {
  let riskScore = 0;

  if (workloadScore > 100) riskScore += 3;
  else if (workloadScore > 75) riskScore += 2;
  else if (workloadScore > 50) riskScore += 1;

  if (acwr > 1.5) riskScore += 4;
  else if (acwr > 1.3) riskScore += 3;
  else if (acwr < 0.8) riskScore += 1;

  if (daysSinceLast < 2) riskScore += 3;
  else if (daysSinceLast < 3) riskScore += 2;

  if (age < 16) riskScore += 2;
  else if (age < 19 && age >= 16) riskScore += 1;

  if (experience < 2) riskScore += 2;
  else if (experience < 5) riskScore += 1;

  if (riskScore >= 8) return 'Very High';
  if (riskScore >= 6) return 'High';
  if (riskScore >= 4) return 'Medium';
  if (riskScore >= 2) return 'Low';

  return 'Very Low';
}

export function calculateCricketFatigueLevel(
  workloadScore: number,
  daysSinceLast: number,
  recentWorkload: number,
): FatigueLevel {
  let fatigueScore = workloadScore * 0.3;
  fatigueScore += (recentWorkload / 100) * 0.4;
  fatigueScore += Math.max(0, (3 - daysSinceLast) * 5) * 0.3;

  if (fatigueScore > 80) return 'Very High';
  if (fatigueScore > 60) return 'High';
  if (fatigueScore > 40) return 'Moderate';
  if (fatigueScore > 20) return 'Low';

  return 'Very Low';
}

export function calculatePerformanceReadiness(
  fatigueLevel: FatigueLevel,
  daysSinceLast: number,
  injuryRisk: InjuryRiskLevel,
): number {
  let readiness = 100;

  const fatigueImpact: Record<FatigueLevel, number> = {
    'Very High': -40,
    High: -25,
    Moderate: -15,
    Low: -5,
    'Very Low': 0,
  };

  const recoveryImpact =
    daysSinceLast < 2 ? -20 : daysSinceLast < 3 ? -10 : 0;

  const riskImpact: Record<InjuryRiskLevel, number> = {
    'Very High': -30,
    High: -20,
    Medium: -10,
    Low: -5,
    'Very Low': 0,
  };

  readiness +=
    fatigueImpact[fatigueLevel] + recoveryImpact + riskImpact[injuryRisk];

  return Math.max(0, readiness);
}

export function getCricketRecoveryRecommendation(
  workloadScore: number,
  intensity: BowlingIntensity,
  daysSinceLast: number,
): string {
  if (workloadScore > 80 || intensity === 'maximum') return '72-96 hours';
  if (workloadScore > 60 || intensity === 'high') return '48-72 hours';
  if (workloadScore > 40) return '24-48 hours';
  if (daysSinceLast < 2) return '48+ hours';

  return '24 hours';
}

export function calculateWorkloadPercentage(
  balls: number,
  age: number,
  bowlingType: BowlingType,
): number {
  const maxBalls =
    age < 16 ? 80 : age < 19 ? 120 : age < 23 ? 180 : 240;
  const adjustedMax =
    maxBalls * (MAX_BALLS_TYPE_ADJUSTMENT[bowlingType] || 1.0);

  return (balls / adjustedMax) * 100;
}

export function generateCricketInsights(
  workloadScore: number,
  acwr: number,
  injuryRisk: InjuryRiskLevel,
  fatigue: FatigueLevel,
  balls: number,
  overs: number,
): string[] {
  const insights: string[] = [];

  if (acwr > 1.3) {
    insights.push('Acute workload spike detected - monitor closely');
  } else if (acwr < 0.8) {
    insights.push(
      'Workload below recent average - consider gradual increase',
    );
  }

  if (fatigue === 'Very High') {
    insights.push('High fatigue detected - prioritize recovery');
  } else if (fatigue === 'Low') {
    insights.push('Low fatigue - good condition for training');
  }

  if (balls / overs > 7) {
    insights.push('High balls per over rate - ensure adequate rest');
  } else if (balls / overs < 5) {
    insights.push(
      'Low bowling rate - consider increasing workload gradually',
    );
  }

  if (workloadScore > 70) {
    insights.push(
      'High intensity session - excellent for building fitness',
    );
  }

  if (injuryRisk === 'High' || injuryRisk === 'Very High') {
    insights.push('Elevated injury risk - review training plan');
  }

  return insights;
}

export function generateCricketRecommendations(
  injuryRisk: InjuryRiskLevel,
  fatigue: FatigueLevel,
  acwr: number,
  bowlingType: BowlingType,
  age: number,
): string[] {
  const recommendations: string[] = [];

  if (injuryRisk === 'High' || injuryRisk === 'Very High') {
    recommendations.push('Consider reducing session volume or intensity');
    recommendations.push('Schedule additional recovery time');
    recommendations.push('Monitor for any pain or discomfort');
  }

  if (fatigue === 'High' || fatigue === 'Very High') {
    recommendations.push('Focus on recovery nutrition and hydration');
    recommendations.push('Include mobility work and stretching');
    recommendations.push('Consider lighter training session next');
  }

  if (acwr > 1.3) {
    recommendations.push('Gradually reduce workload to safer levels');
  } else if (acwr < 0.8) {
    recommendations.push('Gradually increase training volume');
  }

  recommendations.push(...(TYPE_RECOMMENDATIONS[bowlingType] ?? []));

  if (age < 16) {
    recommendations.push('Limit maximum effort bowling');
    recommendations.push('Focus on technique over pace');
  } else if (age < 19) {
    recommendations.push('Gradual workload progression');
    recommendations.push('Monitor growth-related injury risks');
  }

  return recommendations;
}

export function calculateCricketWorkload(
  values: CricketWorkloadValues,
): CricketWorkloadResult {
  if (!values.bowlingType) {
    throw new Error(CRICKET_ERRORS.bowlingType);
  }

  if (!values.intensity) {
    throw new Error(CRICKET_ERRORS.intensity);
  }

  const balls = parseNumber(values.ballsBowled);
  const overs = parseNumber(values.overs);
  const duration = parseNumber(values.sessionDuration);
  const daysSinceLast = parseNumber(values.daysSinceLast);
  const age = parseNumber(values.age);
  const experience = parseNumber(values.experience);
  const recentWorkload = parseNumber(values.recentWorkload);

  if (balls === null) throw new Error(CRICKET_ERRORS.ballsBowled);
  if (overs === null) throw new Error(CRICKET_ERRORS.overs);
  if (duration === null) throw new Error(CRICKET_ERRORS.sessionDuration);
  if (daysSinceLast === null) {
    throw new Error(CRICKET_ERRORS.daysSinceLast);
  }
  if (age === null) throw new Error(CRICKET_ERRORS.age);
  if (experience === null) throw new Error(CRICKET_ERRORS.experience);
  if (recentWorkload === null) {
    throw new Error(CRICKET_ERRORS.recentWorkload);
  }

  const workloadScore = calculateWorkloadScore(
    balls,
    duration,
    values.intensity,
    values.bowlingType,
  );
  const acuteChronicRatio = calculateAcuteChronicRatio(
    balls,
    recentWorkload,
  );
  const injuryRisk = calculateCricketInjuryRisk(
    workloadScore,
    acuteChronicRatio,
    daysSinceLast,
    age,
    experience,
  );
  const fatigueLevel = calculateCricketFatigueLevel(
    workloadScore,
    daysSinceLast,
    recentWorkload,
  );
  const performanceReadiness = calculatePerformanceReadiness(
    fatigueLevel,
    daysSinceLast,
    injuryRisk,
  );
  const recoveryRecommendation = getCricketRecoveryRecommendation(
    workloadScore,
    values.intensity,
    daysSinceLast,
  );
  const workloadPercentage = calculateWorkloadPercentage(
    balls,
    age,
    values.bowlingType,
  );

  return {
    workloadScore,
    workloadScoreDisplay: workloadScore.toFixed(1),
    acuteChronicRatio,
    acuteChronicRatioDisplay: acuteChronicRatio.toFixed(2),
    injuryRisk,
    fatigueLevel,
    performanceReadiness,
    performanceReadinessDisplay: performanceReadiness.toFixed(0),
    recoveryRecommendation,
    workloadPercentage,
    workloadPercentageDisplay: workloadPercentage.toFixed(0),
    ballsPerOver: balls / overs,
    ballsPerOverDisplay: (balls / overs).toFixed(1),
    ballsPerMinute: (balls / duration) * 60,
    ballsPerMinuteDisplay: ((balls / duration) * 60).toFixed(1),
    insights: generateCricketInsights(
      workloadScore,
      acuteChronicRatio,
      injuryRisk,
      fatigueLevel,
      balls,
      overs,
    ),
    recommendations: generateCricketRecommendations(
      injuryRisk,
      fatigueLevel,
      acuteChronicRatio,
      values.bowlingType,
      age,
    ),
  };
}
