import {parseNumber} from './units';
import {
  acclimatizationProgressPercent,
  acclimatizationWeeks,
  feetToMeters,
} from './environmentAdjustment';
import {rangeError} from './sportValidation';
import type {FieldErrors} from './validation';

export type AltitudeActivityType =
  | 'running'
  | 'cycling'
  | 'swimming'
  | 'triathlon'
  | 'skiing'
  | 'mountaineering';

export type AltitudeFitnessLevel =
  | 'beginner'
  | 'recreational'
  | 'competitive'
  | 'elite';

export type AltitudeDurationUnit = 'minutes' | 'hours';

export type AltitudeLengthUnit = 'meters' | 'feet';

export type AltitudeCalculationType =
  | 'training'
  | 'racing'
  | 'comparison'
  | 'live-train';

export type AltitudeValues = {
  activityType: AltitudeActivityType | '';
  paceMinutes: string;
  paceSeconds: string;
  targetAltitude: string;
  altitudeUnit: AltitudeLengthUnit;
  homeAltitude: string;
  homeUnit: AltitudeLengthUnit;
  acclimationDays: string;
  fitnessLevel: AltitudeFitnessLevel | '';
  duration: string;
  durationUnit: AltitudeDurationUnit;
  calculationType: AltitudeCalculationType | '';
};

export type AltitudeTrainingZone = {
  name: string;
  seaLevelPace: string;
  altitudePace: string;
  adjustmentPercent: number;
};

export type AltitudeBenefits = {
  redBloodCellIncrease: number;
  hemoglobinIncrease: number;
  vo2MaxPotentialIncrease: number;
  performanceTimeframe: string;
};

export type AltitudeHealthRisk = 'Low' | 'Medium' | 'High' | 'Very High';

export type AltitudeResult = {
  seaLevelPace: string;
  adjustedPace: string;
  paceAdjustment: number;
  paceAdjustmentPercent: string;
  targetAltitude: string;
  homeAltitude: string;
  altitudeDifference: string;
  vo2MaxDecrease: string;
  performanceDecrease: string;
  healthRisks: AltitudeHealthRisk;
  trainingZones: readonly AltitudeTrainingZone[];
  altitudeBenefits: AltitudeBenefits;
  acclimationDays: number;
  acclimatizationPercent: number;
  calculationType: string;
  recommendations: readonly string[];
  insights: readonly string[];
};

export const ALTITUDE_ACTIVITY_TYPES: readonly {
  value: AltitudeActivityType;
  label: string;
}[] = [
  {value: 'running', label: 'Running'},
  {value: 'cycling', label: 'Cycling'},
  {value: 'swimming', label: 'Swimming'},
  {value: 'triathlon', label: 'Triathlon'},
  {value: 'skiing', label: 'Skiing/Snowboarding'},
  {value: 'mountaineering', label: 'Mountaineering'},
] as const;

export const ALTITUDE_FITNESS_LEVELS: readonly {
  value: AltitudeFitnessLevel;
  label: string;
}[] = [
  {value: 'beginner', label: 'Beginner'},
  {value: 'recreational', label: 'Recreational'},
  {value: 'competitive', label: 'Competitive'},
  {value: 'elite', label: 'Elite/Professional'},
] as const;

export const ALTITUDE_CALCULATION_TYPES: readonly {
  value: AltitudeCalculationType;
  label: string;
}[] = [
  {value: 'training', label: 'Training Adjustment'},
  {value: 'racing', label: 'Race Pacing'},
  {value: 'comparison', label: 'Performance Comparison'},
  {value: 'live-train', label: 'Live High Train Low'},
] as const;

export const ALTITUDE_DURATION_UNITS: readonly {
  value: AltitudeDurationUnit;
  label: string;
}[] = [
  {value: 'minutes', label: 'minutes'},
  {value: 'hours', label: 'hours'},
] as const;

export const ALTITUDE_LENGTH_UNITS: readonly {
  value: AltitudeLengthUnit;
  label: string;
}[] = [
  {value: 'meters', label: 'meters'},
  {value: 'feet', label: 'feet'},
] as const;

export const ALTITUDE_ERRORS = {
  activityType: 'Please select an activity type.',
  pace: 'Please enter a valid sea level pace.',
  targetAltitude: 'Please enter a valid target altitude.',
  homeAltitude: 'Please enter a valid home altitude.',
  acclimationDays: 'Please enter a valid number of acclimatization days.',
  fitnessLevel: 'Please select a fitness level.',
  duration: 'Please enter a valid activity duration.',
  calculationType: 'Please select a calculation type.',
} as const;

const FITNESS_MULTIPLIERS: Record<AltitudeFitnessLevel, number> = {
  beginner: 1.2,
  recreational: 1.1,
  competitive: 1.0,
  elite: 0.9,
};

const TRAINING_ZONES: Partial<
  Record<AltitudeActivityType, readonly {name: string; percentage: number}[]>
> = {
  running: [
    {name: 'Recovery', percentage: 1.3},
    {name: 'Easy', percentage: 1.15},
    {name: 'Moderate', percentage: 1.05},
    {name: 'Threshold', percentage: 0.95},
    {name: 'VO2 Max', percentage: 0.85},
    {name: 'Speed', percentage: 0.75},
  ],
  cycling: [
    {name: 'Recovery', percentage: 1.25},
    {name: 'Endurance', percentage: 1.1},
    {name: 'Tempo', percentage: 0.95},
    {name: 'Threshold', percentage: 0.9},
    {name: 'VO2 Max', percentage: 0.8},
    {name: 'Anaerobic', percentage: 0.7},
  ],
};

export function formatAltitudePace(seconds: number): string {
  const minutes = Math.floor(seconds / 60);
  const secs = Math.round(seconds % 60);

  return `${minutes}:${secs.toString().padStart(2, '0')}`;
}

export function calculateVo2MaxDecrease(
  targetAltitude: number,
  homeAltitude: number,
): number {
  const effectiveAltitude = Math.max(0, targetAltitude - 1500);
  const homeEffectiveAltitude = Math.max(0, homeAltitude - 1500);
  const altitudeDifference = effectiveAltitude - homeEffectiveAltitude;

  if (altitudeDifference <= 0) return 0;

  return (altitudeDifference / 300) * 3;
}

export function calculatePerformanceDecrease(
  targetAltitude: number,
  homeAltitude: number,
  acclimationDays: number,
  fitnessLevel: AltitudeFitnessLevel,
): number {
  const baseDecrease = calculateVo2MaxDecrease(targetAltitude, homeAltitude);
  let adjustedDecrease = baseDecrease * (FITNESS_MULTIPLIERS[fitnessLevel] || 1.0);
  const acclimationBenefit = Math.min(0.8, acclimationDays / 17.5);

  adjustedDecrease *= 1 - acclimationBenefit;

  return adjustedDecrease;
}

export function calculatePaceAdjustment(
  seaLevelPaceSeconds: number,
  performanceDecrease: number,
): number {
  return Math.round(seaLevelPaceSeconds * (performanceDecrease / 100));
}

export function calculateTrainingZones(
  seaLevelPace: number,
  adjustedPace: number,
  activity: AltitudeActivityType,
): AltitudeTrainingZone[] {
  const activityZones = TRAINING_ZONES[activity] ?? TRAINING_ZONES.running;

  return (activityZones ?? []).map((zone) => ({
    name: zone.name,
    seaLevelPace: formatAltitudePace(seaLevelPace * zone.percentage),
    altitudePace: formatAltitudePace(adjustedPace * zone.percentage),
    adjustmentPercent:
      ((adjustedPace * zone.percentage) / (seaLevelPace * zone.percentage) - 1) *
      100,
  }));
}

export function calculateAltitudeBenefits(
  altitude: number,
  acclimationDays: number,
  duration: number,
): AltitudeBenefits {
  const benefits: AltitudeBenefits = {
    redBloodCellIncrease: 0,
    hemoglobinIncrease: 0,
    vo2MaxPotentialIncrease: 0,
    performanceTimeframe: '',
  };

  if (acclimationDays >= 14 && altitude >= 2000) {
    benefits.redBloodCellIncrease = Math.min(
      10,
      (acclimationDays / 28) * 10,
    );
    benefits.hemoglobinIncrease = Math.min(8, (acclimationDays / 28) * 8);
    benefits.vo2MaxPotentialIncrease = Math.min(
      5,
      (acclimationDays / 28) * 5,
    );
    benefits.performanceTimeframe = '2-3 weeks after return to sea level';
  }

  return benefits;
}

export function assessAltitudeHealthRisks(
  altitude: number,
  duration: number,
  acclimationDays: number,
  fitnessLevel: AltitudeFitnessLevel,
): AltitudeHealthRisk {
  let riskScore = 0;

  if (altitude > 2500) riskScore += 2;
  if (altitude > 3500) riskScore += 2;
  if (altitude > 4500) riskScore += 3;
  if (altitude > 5500) riskScore += 3;

  if (duration > 120) riskScore += 1;
  if (duration > 240) riskScore += 1;

  riskScore = Math.max(0, riskScore - acclimatizationWeeks(acclimationDays));

  if (fitnessLevel === 'elite') riskScore -= 1;
  else if (fitnessLevel === 'beginner') riskScore += 1;

  if (riskScore >= 6) return 'Very High';
  if (riskScore >= 4) return 'High';
  if (riskScore >= 2) return 'Medium';

  return 'Low';
}

export function generateAltitudeRecommendations(
  altitude: number,
  acclimationDays: number,
  fitness: AltitudeFitnessLevel,
  calculationType: AltitudeCalculationType,
  risks: AltitudeHealthRisk,
): string[] {
  const recommendations: string[] = [];

  if (acclimationDays < 7) {
    recommendations.push('Allow 1-2 weeks for gradual acclimatization');
    recommendations.push(
      'Reduce training intensity by 30-40% initially',
    );
  }

  if (altitude > 2500) {
    recommendations.push('Monitor for altitude sickness symptoms');
    recommendations.push(
      'Stay well hydrated - increase fluid intake by 20-30%',
    );
  }

  if (calculationType === 'racing') {
    recommendations.push('Adjust race goals - focus on effort over time');
    recommendations.push('Start conservatively and build into race');
  }

  if (calculationType === 'training') {
    recommendations.push('Use heart rate monitor rather than pace');
    recommendations.push('Include interval work to maintain intensity');
  }

  if (risks === 'High' || risks === 'Very High') {
    recommendations.push('Consider medical consultation before trip');
    recommendations.push('Have descent plan if symptoms worsen');
  }

  if (fitness === 'beginner' && altitude > 2000) {
    recommendations.push(
      'Start with moderate altitude (1500-2000m) first',
    );
    recommendations.push('Consider shorter initial exposure periods');
  }

  return recommendations;
}

export function generateAltitudeInsights(
  altitudeDifference: number,
  vo2Decrease: number,
  performanceDecrease: number,
  acclimationDays: number,
  activity: AltitudeActivityType,
): string[] {
  const insights: string[] = [];

  if (altitudeDifference > 1000) {
    insights.push(
      `Significant altitude change of ${altitudeDifference.toFixed(0)}m requires major adjustment`,
    );
  }

  if (vo2Decrease > 5) {
    insights.push(
      `${vo2Decrease.toFixed(1)}% VO2 max decrease will significantly affect performance`,
    );
  }

  if (acclimationDays >= 14) {
    insights.push(
      'Well acclimated - expect near-maximum performance for altitude',
    );
  } else if (acclimationDays === 0) {
    insights.push('No acclimation - expect 15-30% performance decrease');
  }

  if (activity === 'running' && altitudeDifference > 1500) {
    insights.push(
      'Running is most affected by altitude - adjust expectations accordingly',
    );
  }

  if (performanceDecrease > 10) {
    insights.push(
      'Major performance impact expected - focus on effort management',
    );
  }

  return insights;
}

export function validateAltitudeValues(
  values: AltitudeValues,
): FieldErrors<AltitudeValues> {
  const errors: FieldErrors<AltitudeValues> = {};

  if (!values.activityType) {
    errors.activityType = ALTITUDE_ERRORS.activityType;
  }

  const paceMinutes = parseNumber(values.paceMinutes);
  const paceSeconds = parseNumber(values.paceSeconds);

  if (
    paceMinutes === null ||
    paceSeconds === null ||
    paceMinutes * 60 + paceSeconds <= 0
  ) {
    errors.paceMinutes = ALTITUDE_ERRORS.pace;
  }

  const targetAltitude = parseNumber(values.targetAltitude);

  if (targetAltitude === null) {
    errors.targetAltitude = ALTITUDE_ERRORS.targetAltitude;
  } else if (targetAltitude < 0 || targetAltitude > 8000) {
    errors.targetAltitude = rangeError('target altitude', 0, 8000);
  }

  const homeAltitude = parseNumber(values.homeAltitude);

  if (homeAltitude === null) {
    errors.homeAltitude = ALTITUDE_ERRORS.homeAltitude;
  } else if (homeAltitude < 0 || homeAltitude > 8000) {
    errors.homeAltitude = rangeError('home altitude', 0, 8000);
  }

  const acclimationDays = parseNumber(values.acclimationDays);

  if (acclimationDays === null) {
    errors.acclimationDays = ALTITUDE_ERRORS.acclimationDays;
  } else if (acclimationDays < 0 || acclimationDays > 30) {
    errors.acclimationDays = rangeError('acclimatization days', 0, 30);
  }

  if (!values.fitnessLevel) {
    errors.fitnessLevel = ALTITUDE_ERRORS.fitnessLevel;
  }

  const duration = parseNumber(values.duration);

  if (duration === null) {
    errors.duration = ALTITUDE_ERRORS.duration;
  } else {
    const [minDuration, maxDuration] =
      values.durationUnit === 'hours' ? [0.25, 8] : [15, 480];

    if (duration < minDuration || duration > maxDuration) {
      errors.duration = rangeError('activity duration', minDuration, maxDuration);
    }
  }

  if (!values.calculationType) {
    errors.calculationType = ALTITUDE_ERRORS.calculationType;
  }

  return errors;
}

export function calculateAltitudeAdjustments(
  values: AltitudeValues,
): AltitudeResult {
  if (!values.activityType) {
    throw new Error(ALTITUDE_ERRORS.activityType);
  }

  if (!values.fitnessLevel) {
    throw new Error(ALTITUDE_ERRORS.fitnessLevel);
  }

  if (!values.calculationType) {
    throw new Error(ALTITUDE_ERRORS.calculationType);
  }

  const paceMinutes = parseNumber(values.paceMinutes);
  const paceSeconds = parseNumber(values.paceSeconds);
  const targetAltitude = parseNumber(values.targetAltitude);
  const homeAltitude = parseNumber(values.homeAltitude);
  const acclimationDays = parseNumber(values.acclimationDays);
  const duration = parseNumber(values.duration);

  if (paceMinutes === null || paceSeconds === null) {
    throw new Error(ALTITUDE_ERRORS.pace);
  }

  if (targetAltitude === null) {
    throw new Error(ALTITUDE_ERRORS.targetAltitude);
  }

  if (homeAltitude === null) {
    throw new Error(ALTITUDE_ERRORS.homeAltitude);
  }

  if (acclimationDays === null) {
    throw new Error(ALTITUDE_ERRORS.acclimationDays);
  }

  if (duration === null) {
    throw new Error(ALTITUDE_ERRORS.duration);
  }

  const targetAltitudeMeters =
    values.altitudeUnit === 'feet'
      ? feetToMeters(targetAltitude)
      : targetAltitude;
  const homeAltitudeMeters =
    values.homeUnit === 'feet' ? feetToMeters(homeAltitude) : homeAltitude;
  const durationMinutes =
    values.durationUnit === 'hours' ? duration * 60 : duration;
  const seaLevelPaceSeconds = paceMinutes * 60 + paceSeconds;

  const altitudeDifference = targetAltitudeMeters - homeAltitudeMeters;
  const vo2MaxDecrease = calculateVo2MaxDecrease(
    targetAltitudeMeters,
    homeAltitudeMeters,
  );
  const performanceDecrease = calculatePerformanceDecrease(
    targetAltitudeMeters,
    homeAltitudeMeters,
    acclimationDays,
    values.fitnessLevel,
  );

  const paceAdjustmentSeconds = calculatePaceAdjustment(
    seaLevelPaceSeconds,
    performanceDecrease,
  );
  const adjustedPace = seaLevelPaceSeconds + paceAdjustmentSeconds;

  const trainingZones = calculateTrainingZones(
    seaLevelPaceSeconds,
    adjustedPace,
    values.activityType,
  );

  const altitudeBenefits = calculateAltitudeBenefits(
    targetAltitudeMeters,
    acclimationDays,
    durationMinutes,
  );
  const healthRisks = assessAltitudeHealthRisks(
    targetAltitudeMeters,
    durationMinutes,
    acclimationDays,
    values.fitnessLevel,
  );

  return {
    seaLevelPace: formatAltitudePace(seaLevelPaceSeconds),
    adjustedPace: formatAltitudePace(adjustedPace),
    paceAdjustment: Math.abs(paceAdjustmentSeconds),
    paceAdjustmentPercent: (
      (paceAdjustmentSeconds / seaLevelPaceSeconds) *
      100
    ).toFixed(1),
    targetAltitude: targetAltitudeMeters.toFixed(0),
    homeAltitude: homeAltitudeMeters.toFixed(0),
    altitudeDifference: altitudeDifference.toFixed(0),
    vo2MaxDecrease: vo2MaxDecrease.toFixed(1),
    performanceDecrease: performanceDecrease.toFixed(1),
    healthRisks,
    trainingZones,
    altitudeBenefits,
    acclimationDays,
    acclimatizationPercent: acclimatizationProgressPercent(acclimationDays),
    calculationType: values.calculationType,
    recommendations: generateAltitudeRecommendations(
      targetAltitudeMeters,
      acclimationDays,
      values.fitnessLevel,
      values.calculationType,
      healthRisks,
    ),
    insights: generateAltitudeInsights(
      altitudeDifference,
      vo2MaxDecrease,
      performanceDecrease,
      acclimationDays,
      values.activityType,
    ),
  };
}
