import {parseNumber, toKilograms, type WeightUnit} from './units';
import type {FieldErrors} from './validation';

export type CyclingPowerCalculationType =
  | 'power-speed'
  | 'ftp'
  | 'power-weight';

export type CyclingSpeedUnit = 'kmh' | 'mph';

export type CyclingPowerValues = {
  calculationType: CyclingPowerCalculationType | '';
  speed: string;
  speedUnit: CyclingSpeedUnit;
  totalWeight: string;
  weightUnit: WeightUnit;
  slope: string;
  wind: string;
  windUnit: CyclingSpeedUnit;
  testDuration: string;
  avgPower: string;
  bodyWeight: string;
  bodyWeightUnit: WeightUnit;
  powerOutput: string;
  riderWeight: string;
  riderWeightUnit: WeightUnit;
};

export type PowerZone = {
  name: string;
  description: string;
  min: number;
  max: number;
  minWatts: number;
  maxWatts: number;
  range: string;
};

export type CyclingPowerStat = {
  label: string;
  value: string;
};

export type CyclingPowerResult = {
  calculationType: CyclingPowerCalculationType;
  headline: string;
  headlineLabel: string;
  stats: readonly CyclingPowerStat[];
  zones: readonly PowerZone[];
  recommendation: string;
};

export const CYCLING_POWER_CALCULATION_TYPES: readonly {
  value: CyclingPowerCalculationType;
  label: string;
}[] = [
  {value: 'power-speed', label: 'Calculate Power from Speed'},
  {value: 'ftp', label: 'Functional Threshold Power (FTP)'},
  {value: 'power-weight', label: 'Power-to-Weight Ratio'},
] as const;

export const CYCLING_SPEED_UNITS: readonly {
  value: CyclingSpeedUnit;
  label: string;
}[] = [
  {value: 'kmh', label: 'km/h'},
  {value: 'mph', label: 'mph'},
] as const;

export const CYCLING_TEST_DURATIONS: readonly {value: string; label: string}[] = [
  {value: '20', label: '20 minutes (Standard)'},
  {value: '60', label: '60 minutes'},
  {value: '30', label: '30 minutes'},
  {value: '8', label: '8 minutes (Short)'},
] as const;

export const CYCLING_POWER_ERRORS = {
  calculationType: 'Please select a calculation type.',
  speed: 'Please enter a valid speed.',
  totalWeight: 'Please enter a valid total weight.',
  avgPower: 'Please enter a valid average power.',
  bodyWeight: 'Please enter a valid body weight.',
  powerOutput: 'Please enter a valid power output.',
  riderWeight: 'Please enter a valid rider weight.',
} as const;

const GRAVITY = 9.81;
const CDA = 0.4;
const ROLLING_RESISTANCE = 0.005;
const AIR_DENSITY = 1.225;
const MPH_TO_MPS = 0.44704;

const ZONE_DEFINITIONS: readonly {
  name: string;
  description: string;
  min: number;
  max: number;
}[] = [
  {name: 'Zone 1', description: 'Active Recovery', min: 0.0, max: 0.55},
  {name: 'Zone 2', description: 'Endurance', min: 0.55, max: 0.75},
  {name: 'Zone 3', description: 'Tempo', min: 0.75, max: 0.9},
  {name: 'Zone 4', description: 'Threshold', min: 0.9, max: 1.05},
  {name: 'Zone 5', description: 'VO2 Max', min: 1.05, max: 1.2},
  {name: 'Zone 6', description: 'Anaerobic', min: 1.2, max: 1.5},
  {name: 'Zone 7', description: 'Neuromuscular', min: 1.5, max: 2.0},
];

export function getPowerZones(ftpValue: number): PowerZone[] {
  return ZONE_DEFINITIONS.map((zone) => {
    const minWatts = Math.round(ftpValue * zone.min);
    const maxWatts = Math.round(ftpValue * zone.max);

    return {
      ...zone,
      minWatts,
      maxWatts,
      range: `${minWatts}-${maxWatts}W`,
    };
  });
}

function toMetresPerSecond(
  value: number,
  unit: CyclingSpeedUnit,
): number {
  return unit === 'mph' ? value * MPH_TO_MPS : value / 3.6;
}

export function validateCyclingPowerValues(
  values: CyclingPowerValues,
): FieldErrors<CyclingPowerValues> {
  const errors: FieldErrors<CyclingPowerValues> = {};

  if (!values.calculationType) {
    errors.calculationType = CYCLING_POWER_ERRORS.calculationType;
    return errors;
  }

  if (values.calculationType === 'power-speed') {
    const speed = parseNumber(values.speed);
    const weight = parseNumber(values.totalWeight);

    if (speed === null || speed <= 0) {
      errors.speed = CYCLING_POWER_ERRORS.speed;
    }

    if (weight === null || weight <= 0) {
      errors.totalWeight = CYCLING_POWER_ERRORS.totalWeight;
    }
  }

  if (values.calculationType === 'ftp') {
    const avgPower = parseNumber(values.avgPower);
    const bodyWeight = parseNumber(values.bodyWeight);

    if (avgPower === null || avgPower <= 0) {
      errors.avgPower = CYCLING_POWER_ERRORS.avgPower;
    }

    if (bodyWeight === null || bodyWeight <= 0) {
      errors.bodyWeight = CYCLING_POWER_ERRORS.bodyWeight;
    }
  }

  if (values.calculationType === 'power-weight') {
    const powerOutput = parseNumber(values.powerOutput);
    const riderWeight = parseNumber(values.riderWeight);

    if (powerOutput === null || powerOutput <= 0) {
      errors.powerOutput = CYCLING_POWER_ERRORS.powerOutput;
    }

    if (riderWeight === null || riderWeight <= 0) {
      errors.riderWeight = CYCLING_POWER_ERRORS.riderWeight;
    }
  }

  return errors;
}

export function getPowerFromSpeedRecommendation(
  power: number,
  weightKg: number,
): string {
  const powerToWeight = power / weightKg;
  let recommendations = `Your estimated power output is ${power} watts, which results in a power-to-weight ratio of ${powerToWeight.toFixed(
    2,
  )} W/kg. `;

  if (powerToWeight < 2.0) {
    recommendations +=
      'Focus on building your aerobic base with longer rides at moderate intensity. Include some hill repeats to build strength. Consider a structured training plan to improve your power output.';
  } else if (powerToWeight < 3.5) {
    recommendations +=
      'Good power output! Focus on threshold training (Zone 4) to improve your FTP. Include interval training and tempo rides. Maintain consistency in your training schedule.';
  } else if (powerToWeight < 4.5) {
    recommendations +=
      'Excellent power level! Incorporate sweet spot training (88-94% of FTP) and VO2 max intervals. Focus on race-specific efforts and maintain proper recovery.';
  } else {
    recommendations +=
      "Outstanding power output! You're at an elite level. Focus on periodization, race-specific training, and recovery. Consider working with a coach for optimal performance.";
  }

  return recommendations;
}

export function getFtpRecommendation(
  ftp: number,
  powerToWeight: string,
): string {
  const ratio = Number(powerToWeight);
  let recommendations = `Your FTP is ${ftp} watts with a power-to-weight ratio of ${powerToWeight} W/kg. `;

  if (ratio < 2.5) {
    recommendations +=
      'Focus on building your aerobic base with Zone 2 training. Include 2-3 FTP tests per year to track progress.';
  } else if (ratio < 3.5) {
    recommendations +=
      'Good fitness level! Include threshold workouts (Zone 4) 1-2 times per week. Use your FTP zones for structured training.';
  } else if (ratio < 4.5) {
    recommendations +=
      'Excellent level! Incorporate sweet spot training and VO2 max intervals. Use power-based training zones for optimal results.';
  } else {
    recommendations +=
      'Elite level! Focus on race-specific power outputs and periodization. Regular FTP testing will help maintain peak performance.';
  }

  return recommendations;
}

export function getPowerToWeightRecommendation(
  powerToWeight: number,
): string {
  if (powerToWeight < 2.0) {
    return 'Your power-to-weight ratio is below average for cyclists. Focus on increasing power output through structured training while maintaining or slightly reducing body weight.';
  }

  if (powerToWeight < 3.0) {
    return 'Good power-to-weight ratio for recreational cycling. Continue with balanced training and proper nutrition to maintain or improve this ratio.';
  }

  if (powerToWeight < 4.0) {
    return "Excellent power-to-weight ratio! You're at a strong amateur level. Focus on race-specific power outputs and maintaining this ratio through proper training and nutrition.";
  }

  if (powerToWeight < 5.0) {
    return 'Outstanding power-to-weight ratio! You\'re at an elite level. Focus on race-specific demands and recovery to maintain peak performance.';
  }

  return "Exceptional power-to-weight ratio! You're at a world-class level. Focus on periodization, race-specific training, and working with professional coaches.";
}

export function calculateCyclingPower(
  values: CyclingPowerValues,
): CyclingPowerResult {
  if (!values.calculationType) {
    throw new Error(CYCLING_POWER_ERRORS.calculationType);
  }

  if (values.calculationType === 'power-speed') {
    const speed = parseNumber(values.speed);
    const weight = parseNumber(values.totalWeight);

    if (speed === null || speed <= 0) {
      throw new Error(CYCLING_POWER_ERRORS.speed);
    }

    if (weight === null || weight <= 0) {
      throw new Error(CYCLING_POWER_ERRORS.totalWeight);
    }

    const slope = parseNumber(values.slope) || 0;
    const wind = parseNumber(values.wind) || 0;
    const speedMs = toMetresPerSecond(speed, values.speedUnit);
    const weightKg = toKilograms(weight, values.weightUnit);
    const windMs = toMetresPerSecond(wind, values.windUnit);

    const climbingPower =
      weightKg * GRAVITY * speedMs * (slope / 100);
    const rollingResistancePower =
      weightKg * GRAVITY * speedMs * ROLLING_RESISTANCE;
    const effectiveSpeedMs = speedMs + windMs;
    const airResistancePower =
      0.5 *
      AIR_DENSITY *
      CDA *
      Math.pow(effectiveSpeedMs, 2) *
      speedMs;
    const totalPower = Math.round(
      climbingPower + rollingResistancePower + airResistancePower,
    );

    return {
      calculationType: values.calculationType,
      headline: `${totalPower} watts`,
      headlineLabel: 'Estimated Power Output',
      stats: [
        {label: 'Speed', value: `${speed.toFixed(1)} ${values.speedUnit}`},
        {label: 'Slope', value: `${slope}%`},
        {label: 'Total Weight', value: `${weightKg.toFixed(1)} kg`},
        {label: 'Wind', value: `${wind.toFixed(1)} ${values.windUnit}`},
      ],
      zones: getPowerZones(totalPower),
      recommendation: getPowerFromSpeedRecommendation(totalPower, weightKg),
    };
  }

  if (values.calculationType === 'ftp') {
    const avgPower = parseNumber(values.avgPower);
    const bodyWeight = parseNumber(values.bodyWeight);

    if (avgPower === null || avgPower <= 0) {
      throw new Error(CYCLING_POWER_ERRORS.avgPower);
    }

    if (bodyWeight === null || bodyWeight <= 0) {
      throw new Error(CYCLING_POWER_ERRORS.bodyWeight);
    }

    const testDuration = Number.parseFloat(values.testDuration);
    const bodyWeightKg = toKilograms(bodyWeight, values.bodyWeightUnit);

    let ftp: number;

    if (testDuration === 20) {
      ftp = Math.round(avgPower * 0.95);
    } else if (testDuration === 60) {
      ftp = avgPower;
    } else if (testDuration === 30) {
      ftp = Math.round(avgPower * 0.93);
    } else if (testDuration === 8) {
      ftp = Math.round(avgPower * 0.9);
    } else {
      ftp = 0;
    }

    const powerToWeight = (ftp / bodyWeightKg).toFixed(2);

    return {
      calculationType: values.calculationType,
      headline: `${ftp} watts`,
      headlineLabel: 'Functional Threshold Power (FTP)',
      stats: [
        {
          label: 'Power-to-Weight Ratio',
          value: `${powerToWeight} W/kg`,
        },
        {label: 'Test Duration', value: `${testDuration} minutes`},
        {label: 'Average Power', value: `${avgPower} watts`},
        {label: 'Body Weight', value: `${bodyWeightKg.toFixed(1)} kg`},
      ],
      zones: getPowerZones(ftp),
      recommendation: getFtpRecommendation(ftp, powerToWeight),
    };
  }

  const powerOutput = parseNumber(values.powerOutput);
  const riderWeight = parseNumber(values.riderWeight);

  if (powerOutput === null || powerOutput <= 0) {
    throw new Error(CYCLING_POWER_ERRORS.powerOutput);
  }

  if (riderWeight === null || riderWeight <= 0) {
    throw new Error(CYCLING_POWER_ERRORS.riderWeight);
  }

  const riderWeightKg = toKilograms(riderWeight, values.riderWeightUnit);
  const powerToWeight = (powerOutput / riderWeightKg).toFixed(2);

  return {
    calculationType: values.calculationType,
    headline: `${powerToWeight} W/kg`,
    headlineLabel: 'Power-to-Weight Ratio',
    stats: [
      {label: 'Power Output', value: `${powerOutput} watts`},
      {label: 'Rider Weight', value: `${riderWeightKg.toFixed(1)} kg`},
    ],
    zones: getPowerZones(powerOutput),
    recommendation: getPowerToWeightRecommendation(
      Number(powerToWeight),
    ),
  };
}
