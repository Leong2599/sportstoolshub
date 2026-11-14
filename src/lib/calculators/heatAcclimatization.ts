import {parseNumber} from './units';
import {
  acclimatizationProgressPercent,
  acclimatizationWeeks,
  fahrenheitToCelsius,
  poundsToKilograms,
} from './environmentAdjustment';
import {rangeError} from './sportValidation';
import type {FieldErrors} from './validation';

export type HeatActivityType =
  | 'running'
  | 'cycling'
  | 'swimming'
  | 'triathlon'
  | 'hiking'
  | 'outdoor-sports';

export type HeatIntensity =
  | 'recovery'
  | 'easy'
  | 'moderate'
  | 'hard'
  | 'very-hard'
  | 'race';

export type HeatDurationUnit = 'minutes' | 'hours';

export type HeatWeightUnit = 'kg' | 'lbs';

export type HeatTemperatureUnit = 'celsius' | 'fahrenheit';

export type HeatValues = {
  activityType: HeatActivityType | '';
  paceMinutes: string;
  paceSeconds: string;
  temperature: string;
  temperatureUnit: HeatTemperatureUnit;
  humidity: string;
  acclimationDays: string;
  bodyWeight: string;
  weightUnit: HeatWeightUnit;
  duration: string;
  durationUnit: HeatDurationUnit;
  intensity: HeatIntensity | '';
};

export type HeatStressLevel =
  | 'Low'
  | 'Moderate'
  | 'High'
  | 'Very High'
  | 'Extreme';

export type PerformanceImpact =
  | 'Minimal'
  | 'Minor'
  | 'Moderate'
  | 'Significant'
  | 'Major';

export type HeatRiskAssessment = 'Low' | 'Medium' | 'High' | 'Very High';

export type HydrationStrategy = {
  totalFluid: number;
  fluidPerHour: number;
  electrolytes: number;
  electrolytesPerHour: number;
};

export type HeatResult = {
  normalPace: string;
  adjustedPace: string;
  paceAdjustment: number;
  paceAdjustmentPercent: string;
  temperature: string;
  heatIndex: string;
  wetBulbGlobeTemp: string;
  heatStressLevel: HeatStressLevel;
  performanceImpact: PerformanceImpact;
  riskAssessment: HeatRiskAssessment;
  hydrationStrategy: HydrationStrategy;
  acclimationDays: number;
  acclimatizationPercent: number;
  humidity: number;
  recommendations: readonly string[];
  insights: readonly string[];
};

export const HEAT_ACTIVITY_TYPES: readonly {
  value: HeatActivityType;
  label: string;
}[] = [
  {value: 'running', label: 'Running'},
  {value: 'cycling', label: 'Cycling'},
  {value: 'swimming', label: 'Swimming'},
  {value: 'triathlon', label: 'Triathlon'},
  {value: 'hiking', label: 'Hiking/Trekking'},
  {value: 'outdoor-sports', label: 'Outdoor Sports'},
] as const;

export const HEAT_INTENSITIES: readonly {value: HeatIntensity; label: string}[] = [
  {value: 'recovery', label: 'Recovery/Very Easy'},
  {value: 'easy', label: 'Easy/Aerobic'},
  {value: 'moderate', label: 'Moderate/Tempo'},
  {value: 'hard', label: 'Hard/Threshold'},
  {value: 'very-hard', label: 'Very Hard/Interval'},
  {value: 'race', label: 'Race Effort'},
] as const;

export const HEAT_DURATION_UNITS: readonly {
  value: HeatDurationUnit;
  label: string;
}[] = [
  {value: 'minutes', label: 'minutes'},
  {value: 'hours', label: 'hours'},
] as const;

export const HEAT_WEIGHT_UNITS: readonly {
  value: HeatWeightUnit;
  label: string;
}[] = [
  {value: 'kg', label: 'kg'},
  {value: 'lbs', label: 'lbs'},
] as const;

export const HEAT_TEMPERATURE_UNITS: readonly {
  value: HeatTemperatureUnit;
  label: string;
}[] = [
  {value: 'celsius', label: '°C'},
  {value: 'fahrenheit', label: '°F'},
] as const;

export const HEAT_ERRORS = {
  activityType: 'Please select an activity type.',
  pace: 'Please enter a valid normal pace.',
  temperature: 'Please enter a valid temperature.',
  humidity: 'Please enter a valid humidity.',
  acclimationDays: 'Please enter a valid number of acclimatization days.',
  bodyWeight: 'Please enter a valid body weight.',
  duration: 'Please enter a valid activity duration.',
  intensity: 'Please select an intensity level.',
} as const;

const PACE_ADJUSTMENT_ACTIVITY: Record<HeatActivityType, number> = {
  running: 1.0,
  cycling: 0.8,
  swimming: 0.6,
  triathlon: 0.9,
  hiking: 1.1,
  'outdoor-sports': 1.2,
};

const PACE_ADJUSTMENT_INTENSITY: Record<HeatIntensity, number> = {
  recovery: 1.3,
  easy: 1.2,
  moderate: 1.1,
  hard: 1.0,
  'very-hard': 0.9,
  race: 0.8,
};

const HYDRATION_ACTIVITY: Record<HeatActivityType, number> = {
  running: 1.2,
  cycling: 1.0,
  swimming: 0.8,
  triathlon: 1.1,
  hiking: 0.9,
  'outdoor-sports': 1.3,
};

const HYDRATION_INTENSITY: Record<HeatIntensity, number> = {
  recovery: 0.8,
  easy: 0.9,
  moderate: 1.0,
  hard: 1.2,
  'very-hard': 1.4,
  race: 1.5,
};

export function formatHeatPace(seconds: number): string {
  const minutes = Math.floor(seconds / 60);
  const secs = Math.round(seconds % 60);

  return `${minutes}:${secs.toString().padStart(2, '0')}`;
}

export function calculateHeatIndex(temp: number, humidity: number): number {
  if (temp < 27) return temp;

  const t = temp;
  const h = humidity;

  let heatIndex = t;

  if (t >= 27 && h >= 40) {
    heatIndex =
      0.5 * (t + 61.0 + (t - 68.0) * 1.2 + h * 0.094);

    if (heatIndex > 26) {
      heatIndex =
        -42.379 +
        2.04901523 * t +
        10.14333127 * h -
        0.22475541 * t * h -
        0.00683783 * t * t -
        0.05481717 * h * h +
        0.00122874 * t * t * h +
        0.00085282 * t * h * h -
        0.00000199 * t * t * h * h;
    }
  }

  return heatIndex;
}

export function calculateWbgt(temp: number, humidity: number): number {
  const wetBulb = temp - (100 - humidity) / 5;
  const globeTemp = temp + 5;

  return 0.7 * wetBulb + 0.2 * globeTemp + 0.1 * temp;
}

export function determineHeatStressLevel(
  heatIndex: number,
  wbgt: number,
): HeatStressLevel {
  if (wbgt < 18) return 'Low';
  if (wbgt < 23) return 'Moderate';
  if (wbgt < 28) return 'High';
  if (wbgt < 30) return 'Very High';

  return 'Extreme';
}

export function calculatePaceAdjustment(
  temp: number,
  humidity: number,
  activity: HeatActivityType,
  acclimationDays: number,
  intensity: HeatIntensity,
): number {
  let baseAdjustment = 0;

  if (temp > 25) {
    baseAdjustment += (temp - 25) * 8;
  } else if (temp > 20) {
    baseAdjustment += (temp - 20) * 4;
  } else if (temp > 15) {
    baseAdjustment += (temp - 15) * 2;
  }

  if (humidity > 70) {
    baseAdjustment += (humidity - 70) * 1.5;
  } else if (humidity > 50) {
    baseAdjustment += (humidity - 50) * 0.5;
  }

  baseAdjustment *= PACE_ADJUSTMENT_ACTIVITY[activity] || 1.0;
  baseAdjustment *= PACE_ADJUSTMENT_INTENSITY[intensity] || 1.0;

  const acclimationBenefit = Math.min(0.4, acclimationDays / 35);
  baseAdjustment *= 1 - acclimationBenefit;

  return Math.round(baseAdjustment);
}

export function calculateHydrationStrategy(
  duration: number,
  temp: number,
  humidity: number,
  weight: number,
  activity: HeatActivityType,
  intensity: HeatIntensity,
): HydrationStrategy {
  let baseFluidPerHour = 600;

  if (temp > 25) {
    baseFluidPerHour += (temp - 25) * 100;
  }

  if (humidity > 60) {
    baseFluidPerHour += (humidity - 60) * 20;
  }

  baseFluidPerHour *= HYDRATION_ACTIVITY[activity] || 1.0;
  baseFluidPerHour *= HYDRATION_INTENSITY[intensity] || 1.0;

  const totalFluid = Math.round(baseFluidPerHour * (duration / 60));
  const electrolytesPerHour = Math.round(300 + (temp - 20) * 20);
  const totalElectrolytes = Math.round(
    electrolytesPerHour * (duration / 60),
  );

  return {
    totalFluid,
    fluidPerHour: Math.round(baseFluidPerHour),
    electrolytes: totalElectrolytes,
    electrolytesPerHour,
  };
}

export function calculatePerformanceImpact(
  paceAdjustment: number,
  stressLevel: HeatStressLevel,
  acclimationDays: number,
): PerformanceImpact {
  const impactScore = Math.abs(paceAdjustment);

  let impact: PerformanceImpact = 'Minimal';

  if (impactScore > 60) impact = 'Major';
  else if (impactScore > 40) impact = 'Significant';
  else if (impactScore > 20) impact = 'Moderate';
  else if (impactScore > 10) impact = 'Minor';

  if (acclimationDays >= 14 && impact !== 'Minimal') {
    impact =
      impact === 'Major'
        ? 'Significant'
        : impact === 'Significant'
          ? 'Moderate'
          : impact === 'Moderate'
            ? 'Minor'
            : 'Minimal';
  }

  return impact;
}

export function assessHealthRisk(
  heatIndex: number,
  wbgt: number,
  duration: number,
  acclimationDays: number,
): HeatRiskAssessment {
  let riskScore = 0;

  if (wbgt > 30) riskScore += 4;
  else if (wbgt > 28) riskScore += 3;
  else if (wbgt > 23) riskScore += 2;
  else if (wbgt > 18) riskScore += 1;

  if (duration > 180) riskScore += 2;
  else if (duration > 90) riskScore += 1;

  riskScore = Math.max(0, riskScore - acclimatizationWeeks(acclimationDays));

  if (riskScore >= 5) return 'Very High';
  if (riskScore >= 4) return 'High';
  if (riskScore >= 2) return 'Medium';

  return 'Low';
}

export function generateHeatRecommendations(
  stressLevel: HeatStressLevel,
  acclimationDays: number,
  activity: HeatActivityType,
  intensity: HeatIntensity,
  risk: HeatRiskAssessment,
): string[] {
  const recommendations: string[] = [];

  if (acclimationDays < 7) {
    recommendations.push(
      'Reduce intensity by 20-30% until better acclimated',
    );
    recommendations.push('Take extra rest breaks in shaded areas');
  }

  if (stressLevel === 'Extreme' || stressLevel === 'Very High') {
    recommendations.push(
      'Consider postponing or moving to cooler times',
    );
    recommendations.push('Monitor for heat illness symptoms closely');
  }

  if (risk === 'High' || risk === 'Very High') {
    recommendations.push('Have emergency plan and phone available');
    recommendations.push('Train with a partner if possible');
  }

  if (intensity === 'race' && stressLevel !== 'Low') {
    recommendations.push(
      'Adjust race goals - focus on completion over time',
    );
  }

  return recommendations;
}

export function generateHeatInsights(
  paceAdjustment: number,
  heatIndex: number,
  humidity: number,
  acclimationDays: number,
  activity: HeatActivityType,
): string[] {
  const insights: string[] = [];

  if (paceAdjustment > 30) {
    insights.push(
      'Significant pace adjustment required - heat is major factor',
    );
  }

  if (humidity > 70 && heatIndex > 25) {
    insights.push(
      'High humidity reduces evaporative cooling - slow down more than temperature alone suggests',
    );
  }

  if (acclimationDays >= 14) {
    insights.push('Well acclimated - your body has adapted to heat stress');
  } else if (acclimationDays === 0) {
    insights.push('No acclimation - expect reduced performance of 15-25%');
  }

  if (activity === 'running' && heatIndex > 28) {
    insights.push(
      'Running in these conditions significantly increases core temperature',
    );
  }

  return insights;
}

export function validateHeatValues(
  values: HeatValues,
): FieldErrors<HeatValues> {
  const errors: FieldErrors<HeatValues> = {};

  if (!values.activityType) {
    errors.activityType = HEAT_ERRORS.activityType;
  }

  const paceMinutes = parseNumber(values.paceMinutes);
  const paceSeconds = parseNumber(values.paceSeconds);

  if (
    paceMinutes === null ||
    paceSeconds === null ||
    paceMinutes * 60 + paceSeconds <= 0
  ) {
    errors.paceMinutes = HEAT_ERRORS.pace;
  }

  const temperature = parseNumber(values.temperature);

  if (temperature === null) {
    errors.temperature = HEAT_ERRORS.temperature;
  } else if (temperature < -10 || temperature > 50) {
    errors.temperature = rangeError('temperature', -10, 50);
  }

  const humidity = parseNumber(values.humidity);

  if (humidity === null) {
    errors.humidity = HEAT_ERRORS.humidity;
  } else if (humidity < 0 || humidity > 100) {
    errors.humidity = rangeError('humidity', 0, 100);
  }

  const acclimationDays = parseNumber(values.acclimationDays);

  if (acclimationDays === null) {
    errors.acclimationDays = HEAT_ERRORS.acclimationDays;
  } else if (acclimationDays < 0 || acclimationDays > 30) {
    errors.acclimationDays = rangeError('acclimatization days', 0, 30);
  }

  const bodyWeight = parseNumber(values.bodyWeight);

  if (bodyWeight === null) {
    errors.bodyWeight = HEAT_ERRORS.bodyWeight;
  } else if (bodyWeight < 30 || bodyWeight > 200) {
    errors.bodyWeight = rangeError('body weight', 30, 200);
  }

  const duration = parseNumber(values.duration);

  if (duration === null) {
    errors.duration = HEAT_ERRORS.duration;
  } else {
    const [minDuration, maxDuration] =
      values.durationUnit === 'hours' ? [0.25, 8] : [15, 480];

    if (duration < minDuration || duration > maxDuration) {
      errors.duration = rangeError('activity duration', minDuration, maxDuration);
    }
  }

  if (!values.intensity) {
    errors.intensity = HEAT_ERRORS.intensity;
  }

  return errors;
}

export function calculateHeatAdjustments(values: HeatValues): HeatResult {
  if (!values.activityType) {
    throw new Error(HEAT_ERRORS.activityType);
  }

  if (!values.intensity) {
    throw new Error(HEAT_ERRORS.intensity);
  }

  const paceMinutes = parseNumber(values.paceMinutes);
  const paceSeconds = parseNumber(values.paceSeconds);
  const temperature = parseNumber(values.temperature);
  const humidity = parseNumber(values.humidity);
  const acclimationDays = parseNumber(values.acclimationDays);
  const bodyWeight = parseNumber(values.bodyWeight);
  const duration = parseNumber(values.duration);

  if (paceMinutes === null || paceSeconds === null) {
    throw new Error(HEAT_ERRORS.pace);
  }

  if (temperature === null) {
    throw new Error(HEAT_ERRORS.temperature);
  }

  if (humidity === null) {
    throw new Error(HEAT_ERRORS.humidity);
  }

  if (acclimationDays === null) {
    throw new Error(HEAT_ERRORS.acclimationDays);
  }

  if (bodyWeight === null) {
    throw new Error(HEAT_ERRORS.bodyWeight);
  }

  if (duration === null) {
    throw new Error(HEAT_ERRORS.duration);
  }

  const tempCelsius =
    values.temperatureUnit === 'fahrenheit'
      ? fahrenheitToCelsius(temperature)
      : temperature;
  const durationMinutes =
    values.durationUnit === 'hours' ? duration * 60 : duration;
  const bodyWeightKg =
    values.weightUnit === 'lbs'
      ? poundsToKilograms(bodyWeight)
      : bodyWeight;
  const normalPaceSeconds = paceMinutes * 60 + paceSeconds;

  const heatIndex = calculateHeatIndex(tempCelsius, humidity);
  const wetBulbGlobeTemp = calculateWbgt(tempCelsius, humidity);
  const heatStressLevel = determineHeatStressLevel(
    heatIndex,
    wetBulbGlobeTemp,
  );

  const paceAdjustment = calculatePaceAdjustment(
    tempCelsius,
    humidity,
    values.activityType,
    acclimationDays,
    values.intensity,
  );
  const adjustedPace = normalPaceSeconds + paceAdjustment;

  const hydrationStrategy = calculateHydrationStrategy(
    durationMinutes,
    tempCelsius,
    humidity,
    bodyWeightKg,
    values.activityType,
    values.intensity,
  );

  const performanceImpact = calculatePerformanceImpact(
    paceAdjustment,
    heatStressLevel,
    acclimationDays,
  );

  const riskAssessment = assessHealthRisk(
    heatIndex,
    wetBulbGlobeTemp,
    durationMinutes,
    acclimationDays,
  );

  return {
    normalPace: formatHeatPace(normalPaceSeconds),
    adjustedPace: formatHeatPace(adjustedPace),
    paceAdjustment: Math.abs(paceAdjustment),
    paceAdjustmentPercent: (
      (paceAdjustment / normalPaceSeconds) *
      100
    ).toFixed(1),
    temperature: tempCelsius.toFixed(1),
    heatIndex: heatIndex.toFixed(1),
    wetBulbGlobeTemp: wetBulbGlobeTemp.toFixed(1),
    heatStressLevel,
    performanceImpact,
    riskAssessment,
    hydrationStrategy,
    acclimationDays,
    acclimatizationPercent: acclimatizationProgressPercent(acclimationDays),
    humidity,
    recommendations: generateHeatRecommendations(
      heatStressLevel,
      acclimationDays,
      values.activityType,
      values.intensity,
      riskAssessment,
    ),
    insights: generateHeatInsights(
      paceAdjustment,
      heatIndex,
      humidity,
      acclimationDays,
      values.activityType,
    ),
  };
}
