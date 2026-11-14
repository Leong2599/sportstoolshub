import {parseNumber} from './units';
import type {FieldErrors} from './validation';

export type StrideInputType =
  | 'pace-cadence'
  | 'pace-stride'
  | 'cadence-stride'
  | 'height-based';

export type StrideExperience =
  | 'beginner'
  | 'novice'
  | 'intermediate'
  | 'advanced'
  | 'elite';

export type StrideDistance =
  | '5k'
  | '10k'
  | 'half-marathon'
  | 'marathon'
  | 'ultra'
  | 'mixed';

export type StrideGoal =
  | 'endurance'
  | 'speed'
  | 'efficiency'
  | 'injury-prevention'
  | 'general';

export type StrideHeightUnit = 'cm' | 'feet';

export type StrideValues = {
  inputType: StrideInputType | '';
  paceMinutes: string;
  paceSeconds: string;
  cadence: string;
  pace2Minutes: string;
  pace2Seconds: string;
  strideLength: string;
  cadence2: string;
  strideLength2: string;
  height: string;
  heightUnit: StrideHeightUnit;
  heightPaceMinutes: string;
  heightPaceSeconds: string;
  experience: StrideExperience | '';
  distance: StrideDistance | '';
  goal: StrideGoal | '';
};

export type StrideResult = {
  inputType: StrideInputType;
  pace: string;
  speed: string;
  cadence: number;
  strideLength: number;
  stepLength: number;
  efficiency: number;
  optimalCadence: number;
  optimalCadenceRange: readonly [number, number];
  groundContactTime: number;
  verticalOscillation: number;
  strideAngle: string;
  cadenceStatus: string;
  cadenceEfficiency: number;
  strideStatus: string;
  overallBalance: boolean;
  recommendations: readonly string[];
  insights: readonly string[];
};

export const STRIDE_INPUT_TYPES: readonly {
  value: StrideInputType;
  label: string;
}[] = [
  {value: 'pace-cadence', label: 'Pace & Cadence'},
  {value: 'pace-stride', label: 'Pace & Stride Length'},
  {value: 'cadence-stride', label: 'Cadence & Stride Length'},
  {value: 'height-based', label: 'Height-Based Estimate'},
] as const;

export const STRIDE_EXPERIENCES: readonly {
  value: StrideExperience;
  label: string;
}[] = [
  {value: 'beginner', label: 'Beginner (<6 months)'},
  {value: 'novice', label: 'Novice (6 months-2 years)'},
  {value: 'intermediate', label: 'Intermediate (2-5 years)'},
  {value: 'advanced', label: 'Advanced (5-10 years)'},
  {value: 'elite', label: 'Elite (>10 years)'},
] as const;

export const STRIDE_DISTANCES: readonly {value: StrideDistance; label: string}[] = [
  {value: '5k', label: '5K'},
  {value: '10k', label: '10K'},
  {value: 'half-marathon', label: 'Half Marathon'},
  {value: 'marathon', label: 'Marathon'},
  {value: 'ultra', label: 'Ultra Marathon'},
  {value: 'mixed', label: 'Mixed Distances'},
] as const;

export const STRIDE_GOALS: readonly {value: StrideGoal; label: string}[] = [
  {value: 'endurance', label: 'Endurance/Long Distance'},
  {value: 'speed', label: 'Speed/Short Distance'},
  {value: 'efficiency', label: 'Running Efficiency'},
  {value: 'injury-prevention', label: 'Injury Prevention'},
  {value: 'general', label: 'General Fitness'},
] as const;

export const STRIDE_ERRORS = {
  inputType: 'Please select an input type.',
  pace: 'Please enter a valid pace.',
  cadence: 'Please enter a valid cadence.',
  strideLength: 'Please enter a valid stride length.',
  height: 'Please enter a valid height.',
  experience: 'Please select your experience level.',
  distance: 'Please select your typical running distance.',
  goal: 'Please select your primary running goal.',
} as const;

const EXPERIENCE_STRIDE_MULTIPLIER: Record<StrideExperience, number> = {
  beginner: 0.43,
  novice: 0.44,
  intermediate: 0.45,
  advanced: 0.46,
  elite: 0.47,
};

const EXPERIENCE_CADENCE: Record<
  StrideExperience,
  {cadence: number; range: [number, number]}
> = {
  beginner: {cadence: 165, range: [160, 170]},
  novice: {cadence: 170, range: [165, 175]},
  intermediate: {cadence: 175, range: [170, 180]},
  advanced: {cadence: 180, range: [175, 185]},
  elite: {cadence: 185, range: [180, 190]},
};

const GROUND_CONTACT_FACTORS: Record<StrideExperience, number> = {
  beginner: 1.0,
  novice: 0.9,
  intermediate: 0.85,
  advanced: 0.8,
  elite: 0.75,
};

const OSCILLATION_FACTORS: Record<StrideExperience, number> = {
  beginner: 1.2,
  novice: 1.1,
  intermediate: 1.0,
  advanced: 0.9,
  elite: 0.8,
};

const AVERAGE_HEIGHT_CM = 175;

function parseIntOrZero(value: string): number {
  const parsed = Number.parseInt(value, 10);
  return Number.isFinite(parsed) ? parsed : 0;
}

function paceFromInputs(minutes: string, seconds: string): number {
  return parseIntOrZero(minutes) * 60 + parseIntOrZero(seconds);
}

export function calculateStrideLength(
  paceSeconds: number,
  cadenceSPM: number,
): number {
  const paceMinutes = paceSeconds / 60;
  const stepsPerKm = cadenceSPM * paceMinutes;

  return (1000 * 100) / stepsPerKm;
}

export function calculateCadence(
  paceSeconds: number,
  strideLengthCm: number,
): number {
  const stepsPerKm = (1000 * 100) / strideLengthCm;
  const paceMinutes = paceSeconds / 60;

  return stepsPerKm / paceMinutes;
}

export function calculatePaceFromCadenceStride(
  cadenceSPM: number,
  strideLengthCm: number,
): number {
  const stepsPerKm = (1000 * 100) / strideLengthCm;
  const paceMinutes = stepsPerKm / cadenceSPM;

  return paceMinutes * 60;
}

export function calculateOptimalStride(
  heightCm: number,
  experience: StrideExperience,
): {length: number; range: {min: number; max: number}} {
  return {
    length: heightCm * (EXPERIENCE_STRIDE_MULTIPLIER[experience] || 0.45),
    range: {
      min: heightCm * 0.4,
      max: heightCm * 0.5,
    },
  };
}

export function calculateOptimalValues(
  experience: StrideExperience,
  distance?: StrideDistance,
): {cadence: number; cadenceRange: readonly [number, number]} {
  const base =
    EXPERIENCE_CADENCE[experience] ?? EXPERIENCE_CADENCE.intermediate;
  let cadence = base.cadence;

  if (distance === 'marathon' || distance === 'ultra') {
    cadence += 5;
  } else if (distance === '5k') {
    cadence += 3;
  }

  return {cadence, cadenceRange: base.range};
}

export function calculateEfficiency(
  cadence: number,
  strideLength: number,
  experience: StrideExperience,
): number {
  const optimalValues = calculateOptimalValues(experience);
  let efficiency = 100;
  const cadenceDeviation = Math.abs(cadence - optimalValues.cadence);

  efficiency -= (cadenceDeviation / 20) * 50;

  const optimalStride = 110;
  const strideDeviation = Math.abs(strideLength - optimalStride) / optimalStride;

  efficiency -= strideDeviation * 30;

  const idealStride = (100000 / cadence) / 60;
  const balanceDeviation = Math.abs(strideLength - idealStride) / idealStride;

  efficiency -= balanceDeviation * 20;

  return Math.max(0, Math.min(100, efficiency));
}

export function calculateGroundContactTime(
  cadence: number,
  experience: StrideExperience,
): number {
  const baseGCT = 250;
  const cadenceFactor = Math.max(0.7, 1 - (cadence - 160) / 200);

  return Math.round(
    baseGCT * cadenceFactor * (GROUND_CONTACT_FACTORS[experience] || 0.85),
  );
}

export function calculateVerticalOscillation(
  strideLength: number,
  experience: StrideExperience,
): number {
  const baseOscillation = strideLength * 0.08;

  return Math.round(
    baseOscillation * (OSCILLATION_FACTORS[experience] || 1.0),
  );
}

export function calculateStrideAngle(strideLength: number): string {
  const angle =
    Math.atan(strideLength / AVERAGE_HEIGHT_CM) * (180 / Math.PI);

  return angle.toFixed(1);
}

export function analyzeEfficiency(
  cadence: number,
  strideLength: number,
  optimal: {cadence: number},
): {
  cadenceStatus: string;
  cadenceEfficiency: number;
  strideStatus: string;
  overallBalance: boolean;
} {
  const cadenceStatus =
    cadence > optimal.cadence + 10
      ? 'Too High'
      : cadence < optimal.cadence - 10
        ? 'Too Low'
        : 'Optimal';
  const cadenceEfficiency = Math.max(
    0,
    Math.min(100, 100 - Math.abs(cadence - optimal.cadence) * 0.5),
  );
  const strideStatus =
    strideLength > 120 ? 'Long' : strideLength < 90 ? 'Short' : 'Optimal';

  return {
    cadenceStatus,
    cadenceEfficiency,
    strideStatus,
    overallBalance:
      Math.abs(cadence - optimal.cadence) < 10 &&
      strideLength > 90 &&
      strideLength < 120,
  };
}

export function generateStrideRecommendations(
  cadence: number,
  strideLength: number,
  efficiency: number,
  experience: StrideExperience,
  distance: StrideDistance,
  goal: StrideGoal,
): string[] {
  const recommendations: string[] = [];

  if (cadence < 170 && experience !== 'beginner') {
    recommendations.push(
      'Increase cadence by 5-10 steps per minute for better efficiency',
    );
  } else if (cadence > 190) {
    recommendations.push(
      'Consider slightly reducing cadence - may indicate overstriding',
    );
  }

  if (strideLength < 90) {
    recommendations.push(
      'Your stride is short - focus on increasing forward propulsion',
    );
  } else if (strideLength > 130) {
    recommendations.push(
      'Long stride detected - focus on higher cadence to reduce impact',
    );
  }

  if (efficiency < 70) {
    recommendations.push(
      'Low efficiency score - work on running form and technique',
    );
  } else if (efficiency > 90) {
    recommendations.push(
      'Excellent efficiency - maintain current form and focus on consistency',
    );
  }

  if (goal === 'injury-prevention') {
    recommendations.push(
      'Focus on cadence of 175-180 spm to minimize impact forces',
    );
  } else if (goal === 'speed') {
    recommendations.push(
      'Increase both cadence and stride length for maximum speed',
    );
  } else if (goal === 'endurance') {
    recommendations.push(
      'Maintain steady cadence 170-175 spm for energy conservation',
    );
  }

  if (distance === 'marathon') {
    recommendations.push(
      'For marathon distance, prioritize consistent cadence over stride length',
    );
  }

  return recommendations;
}

export function generateStrideInsights(
  efficiency: number,
  cadence: number,
  strideLength: number,
  experience: StrideExperience,
): string[] {
  const insights: string[] = [];

  if (efficiency > 85) {
    insights.push(
      'Excellent running efficiency - your form is well-optimized',
    );
  } else if (efficiency < 60) {
    insights.push(
      'Significant room for improvement in running efficiency',
    );
  }

  if (cadence >= 175 && cadence <= 185) {
    insights.push(
      'Ideal cadence range - optimal for injury prevention and efficiency',
    );
  }

  const stepLength = strideLength / 2;

  if (stepLength > 75 && stepLength < 85) {
    insights.push('Good step length balance between cadence and stride');
  }

  if (experience === 'elite' && cadence < 180) {
    insights.push('Elite runners typically benefit from cadence 180+ spm');
  }

  return insights;
}

export function formatStridePace(seconds: number): string {
  const minutes = Math.floor(seconds / 60);
  const secs = Math.round(seconds % 60);

  return `${minutes}:${secs.toString().padStart(2, '0')}`;
}

export function validateStrideValues(
  values: StrideValues,
): FieldErrors<StrideValues> {
  const errors: FieldErrors<StrideValues> = {};

  if (!values.inputType) {
    errors.inputType = STRIDE_ERRORS.inputType;
    return errors;
  }

  if (values.inputType === 'pace-cadence') {
    if (paceFromInputs(values.paceMinutes, values.paceSeconds) <= 0) {
      errors.paceMinutes = STRIDE_ERRORS.pace;
    }

    const cadence = parseNumber(values.cadence);

    if (cadence === null || cadence <= 0) {
      errors.cadence = STRIDE_ERRORS.cadence;
    }
  }

  if (values.inputType === 'pace-stride') {
    if (paceFromInputs(values.pace2Minutes, values.pace2Seconds) <= 0) {
      errors.pace2Minutes = STRIDE_ERRORS.pace;
    }

    const strideLength = parseNumber(values.strideLength);

    if (strideLength === null || strideLength <= 0) {
      errors.strideLength = STRIDE_ERRORS.strideLength;
    }
  }

  if (values.inputType === 'cadence-stride') {
    const cadence = parseNumber(values.cadence2);

    if (cadence === null || cadence <= 0) {
      errors.cadence2 = STRIDE_ERRORS.cadence;
    }

    const strideLength = parseNumber(values.strideLength2);

    if (strideLength === null || strideLength <= 0) {
      errors.strideLength2 = STRIDE_ERRORS.strideLength;
    }
  }

  if (values.inputType === 'height-based') {
    const height = parseNumber(values.height);

    if (height === null || height <= 0) {
      errors.height = STRIDE_ERRORS.height;
    }

    if (
      paceFromInputs(values.heightPaceMinutes, values.heightPaceSeconds) <= 0
    ) {
      errors.heightPaceMinutes = STRIDE_ERRORS.pace;
    }
  }

  if (!values.experience) {
    errors.experience = STRIDE_ERRORS.experience;
  }

  if (!values.distance) {
    errors.distance = STRIDE_ERRORS.distance;
  }

  if (!values.goal) {
    errors.goal = STRIDE_ERRORS.goal;
  }

  return errors;
}

export function calculateStride(values: StrideValues): StrideResult {
  if (!values.inputType) {
    throw new Error(STRIDE_ERRORS.inputType);
  }

  if (!values.experience) {
    throw new Error(STRIDE_ERRORS.experience);
  }

  if (!values.distance) {
    throw new Error(STRIDE_ERRORS.distance);
  }

  if (!values.goal) {
    throw new Error(STRIDE_ERRORS.goal);
  }

  let pace: number;
  let cadence: number;
  let strideLength: number;

  if (values.inputType === 'pace-cadence') {
    pace = paceFromInputs(values.paceMinutes, values.paceSeconds);
    cadence = parseNumber(values.cadence) ?? 0;

    if (pace <= 0) {
      throw new Error(STRIDE_ERRORS.pace);
    }

    if (cadence <= 0) {
      throw new Error(STRIDE_ERRORS.cadence);
    }

    strideLength = calculateStrideLength(pace, cadence);
  } else if (values.inputType === 'pace-stride') {
    pace = paceFromInputs(values.pace2Minutes, values.pace2Seconds);
    strideLength = parseNumber(values.strideLength) ?? 0;

    if (pace <= 0) {
      throw new Error(STRIDE_ERRORS.pace);
    }

    if (strideLength <= 0) {
      throw new Error(STRIDE_ERRORS.strideLength);
    }

    cadence = calculateCadence(pace, strideLength);
  } else if (values.inputType === 'cadence-stride') {
    cadence = parseNumber(values.cadence2) ?? 0;
    strideLength = parseNumber(values.strideLength2) ?? 0;

    if (cadence <= 0) {
      throw new Error(STRIDE_ERRORS.cadence);
    }

    if (strideLength <= 0) {
      throw new Error(STRIDE_ERRORS.strideLength);
    }

    pace = calculatePaceFromCadenceStride(cadence, strideLength);
  } else {
    const heightRaw = parseNumber(values.height) ?? 0;

    if (heightRaw <= 0) {
      throw new Error(STRIDE_ERRORS.height);
    }

    pace = paceFromInputs(
      values.heightPaceMinutes,
      values.heightPaceSeconds,
    );

    if (pace <= 0) {
      throw new Error(STRIDE_ERRORS.pace);
    }

    const heightCm =
      values.heightUnit === 'feet' ? heightRaw * 30.48 : heightRaw;
    const optimalStride = calculateOptimalStride(heightCm, values.experience);

    strideLength = optimalStride.length;
    cadence = calculateCadence(pace, strideLength);
  }

  const speed = 3600 / pace;
  const efficiency = calculateEfficiency(cadence, strideLength, values.experience);
  const optimalValues = calculateOptimalValues(values.experience, values.distance);
  const groundContact = calculateGroundContactTime(cadence, values.experience);
  const verticalOscillation = calculateVerticalOscillation(
    strideLength,
    values.experience,
  );
  const strideAngle = calculateStrideAngle(strideLength);
  const efficiencyAnalysis = analyzeEfficiency(
    cadence,
    strideLength,
    optimalValues,
  );

  return {
    inputType: values.inputType,
    pace: formatStridePace(pace),
    speed: speed.toFixed(2),
    cadence,
    strideLength,
    stepLength: strideLength / 2,
    efficiency,
    optimalCadence: optimalValues.cadence,
    optimalCadenceRange: optimalValues.cadenceRange,
    groundContactTime: groundContact,
    verticalOscillation,
    strideAngle,
    cadenceStatus: efficiencyAnalysis.cadenceStatus,
    cadenceEfficiency: efficiencyAnalysis.cadenceEfficiency,
    strideStatus: efficiencyAnalysis.strideStatus,
    overallBalance: efficiencyAnalysis.overallBalance,
    recommendations: generateStrideRecommendations(
      cadence,
      strideLength,
      efficiency,
      values.experience,
      values.distance,
      values.goal,
    ),
    insights: generateStrideInsights(
      efficiency,
      cadence,
      strideLength,
      values.experience,
    ),
  };
}
