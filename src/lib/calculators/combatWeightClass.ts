import {parseNumber} from './units';
import {rangeError} from './sportValidation';
import type {FieldErrors} from './validation';

export type CombatSport =
  | 'mma'
  | 'boxing'
  | 'wrestling'
  | 'bjj'
  | 'muay-thai'
  | 'judo'
  | 'karate';

export type FightStyle =
  | 'striker'
  | 'grappler'
  | 'well-rounded'
  | 'counter-fighter'
  | 'pressure-fighter';

export type CompetitionLevel =
  | 'amateur'
  | 'semi-pro'
  | 'professional'
  | 'elite';

export type WeightCutHistory = 'none' | 'beginner' | 'intermediate' | 'advanced';

export type CombatWeightUnit = 'kg' | 'lbs';

export type CombatHeightUnit = 'cm' | 'feet';

export type CombatValues = {
  sport: CombatSport | '';
  currentWeight: string;
  weightUnit: CombatWeightUnit;
  height: string;
  heightUnit: CombatHeightUnit;
  bodyFat: string;
  experience: string;
  fightStyle: FightStyle | '';
  competitionLevel: CompetitionLevel | '';
  age: string;
  cutHistory: WeightCutHistory | '';
};

export type WeightClass = {
  name: string;
  min: number;
  max: number;
};

export type OptimalWeightClass = WeightClass & {
  weightRequired: number;
  cutRequired: number;
  cutPercentage: number;
  suitability: number;
};

export type CuttingDifficulty = 'Low' | 'Medium' | 'High' | 'Very High';

export type CombatHealthRisk = 'Low' | 'Medium' | 'High' | 'Very High';

export type CombatResult = {
  currentWeight: string;
  leanMass: string;
  currentClass: string;
  idealWeight: string;
  optimalClasses: readonly OptimalWeightClass[];
  powerToWeightRatio: string;
  reachAdvantage: string;
  cuttingDifficulty: CuttingDifficulty;
  performanceImpact: string;
  healthRisk: CombatHealthRisk;
  insights: readonly string[];
  recommendations: readonly string[];
};

export const COMBAT_SPORTS: readonly {value: CombatSport; label: string}[] = [
  {value: 'mma', label: 'Mixed Martial Arts (MMA)'},
  {value: 'boxing', label: 'Boxing'},
  {value: 'wrestling', label: 'Wrestling'},
  {value: 'bjj', label: 'Brazilian Jiu-Jitsu'},
  {value: 'muay-thai', label: 'Muay Thai'},
  {value: 'judo', label: 'Judo'},
  {value: 'karate', label: 'Karate'},
] as const;

export const FIGHT_STYLES: readonly {value: FightStyle; label: string}[] = [
  {value: 'striker', label: 'Striker (Stand-up)'},
  {value: 'grappler', label: 'Grappler (Ground)'},
  {value: 'well-rounded', label: 'Well-Rounded'},
  {value: 'counter-fighter', label: 'Counter-Fighter'},
  {value: 'pressure-fighter', label: 'Pressure Fighter'},
] as const;

export const COMPETITION_LEVELS: readonly {
  value: CompetitionLevel;
  label: string;
}[] = [
  {value: 'amateur', label: 'Amateur'},
  {value: 'semi-pro', label: 'Semi-Professional'},
  {value: 'professional', label: 'Professional'},
  {value: 'elite', label: 'Elite/International'},
] as const;

export const WEIGHT_CUT_HISTORY_OPTIONS: readonly {
  value: WeightCutHistory;
  label: string;
}[] = [
  {value: 'none', label: 'No experience'},
  {value: 'beginner', label: 'Beginner (1-2 cuts)'},
  {value: 'intermediate', label: 'Intermediate (3-5 cuts)'},
  {value: 'advanced', label: 'Advanced (6+ cuts)'},
] as const;

export const COMBAT_WEIGHT_UNITS: readonly {
  value: CombatWeightUnit;
  label: string;
}[] = [
  {value: 'kg', label: 'kg'},
  {value: 'lbs', label: 'lbs'},
] as const;

export const COMBAT_HEIGHT_UNITS: readonly {
  value: CombatHeightUnit;
  label: string;
}[] = [
  {value: 'cm', label: 'cm'},
  {value: 'feet', label: 'feet/inches'},
] as const;

export const COMBAT_ERRORS = {
  sport: 'Please select a combat sport.',
  currentWeight: 'Please enter a valid current body weight.',
  height: 'Please enter a valid height.',
  bodyFat: 'Please enter a valid body fat percentage.',
  experience: 'Please enter a valid number of years of experience.',
  fightStyle: 'Please select a fighting style.',
  competitionLevel: 'Please select a competition level.',
  age: 'Please enter a valid age.',
  cutHistory: 'Please select your weight cut experience.',
} as const;

const WEIGHT_CLASSES: Record<string, readonly WeightClass[]> = {
  mma: [
    {name: 'Flyweight', min: 125, max: 125},
    {name: 'Bantamweight', min: 135, max: 135},
    {name: 'Featherweight', min: 145, max: 145},
    {name: 'Lightweight', min: 155, max: 155},
    {name: 'Welterweight', min: 170, max: 170},
    {name: 'Middleweight', min: 185, max: 185},
    {name: 'Light Heavyweight', min: 205, max: 205},
    {name: 'Heavyweight', min: 205, max: 265},
    {name: 'Super Heavyweight', min: 265, max: 400},
  ],
  boxing: [
    {name: 'Minimumweight', min: 105, max: 108},
    {name: 'Light Flyweight', min: 108, max: 112},
    {name: 'Flyweight', min: 112, max: 118},
    {name: 'Super Flyweight', min: 118, max: 122},
    {name: 'Bantamweight', min: 122, max: 126},
    {name: 'Super Bantamweight', min: 126, max: 130},
    {name: 'Featherweight', min: 130, max: 135},
    {name: 'Super Featherweight', min: 135, max: 140},
    {name: 'Lightweight', min: 140, max: 147},
    {name: 'Super Lightweight', min: 147, max: 154},
    {name: 'Welterweight', min: 154, max: 160},
    {name: 'Super Welterweight', min: 160, max: 168},
    {name: 'Middleweight', min: 168, max: 175},
    {name: 'Super Middleweight', min: 175, max: 184},
    {name: 'Light Heavyweight', min: 184, max: 200},
    {name: 'Heavyweight', min: 200, max: 400},
  ],
  wrestling: [
    {name: '125 lbs', min: 125, max: 125},
    {name: '133 lbs', min: 133, max: 133},
    {name: '141 lbs', min: 141, max: 141},
    {name: '149 lbs', min: 149, max: 149},
    {name: '157 lbs', min: 157, max: 157},
    {name: '165 lbs', min: 165, max: 165},
    {name: '174 lbs', min: 174, max: 174},
    {name: '184 lbs', min: 184, max: 184},
    {name: '197 lbs', min: 197, max: 197},
    {name: '285 lbs (Heavyweight)', min: 197, max: 285},
  ],
  bjj: [
    {name: 'Roosterweight', min: 127.5, max: 127.5},
    {name: 'Light Featherweight', min: 141, max: 141},
    {name: 'Featherweight', min: 154, max: 154},
    {name: 'Lightweight', min: 168, max: 168},
    {name: 'Middleweight', min: 181.5, max: 181.5},
    {name: 'Medium Heavyweight', min: 195, max: 195},
    {name: 'Heavyweight', min: 208, max: 208},
    {name: 'Super Heavyweight', min: 208, max: 400},
  ],
};

const STYLE_ADJUSTMENTS: Record<FightStyle, number> = {
  striker: -10,
  grappler: 5,
  'well-rounded': 0,
  'counter-fighter': -5,
  'pressure-fighter': 5,
};

const SPORT_ADJUSTMENTS: Record<string, number> = {
  mma: 0,
  boxing: -5,
  wrestling: 10,
  bjj: 5,
  'muay-thai': -3,
  judo: 8,
};

const STYLE_POWER_FACTORS: Record<FightStyle, number> = {
  striker: 1.2,
  grappler: 1.1,
  'well-rounded': 1.0,
  'counter-fighter': 0.9,
  'pressure-fighter': 1.15,
};

const CUT_HISTORY_SCORES: Record<WeightCutHistory, number> = {
  none: 3,
  beginner: 2,
  intermediate: 1,
  advanced: 0,
};

export function getWeightClassesForSport(sport: CombatSport): readonly WeightClass[] {
  const sportMapping: Record<string, string> = {
    bjj: 'bjj',
    'muay-thai': 'boxing',
    karate: 'boxing',
    judo: 'wrestling',
  };

  return (
    WEIGHT_CLASSES[sportMapping[sport] || sport] ?? WEIGHT_CLASSES.mma
  );
}

export function findWeightClass(
  weight: number,
  classes: readonly WeightClass[],
): string {
  for (const weightClass of classes) {
    if (weight <= weightClass.max) {
      return weightClass.name;
    }
  }

  return 'Above Heavyweight';
}

export function calculateIdealWeight(
  height: number,
  bodyFat: number,
  style: FightStyle,
  sport: CombatSport,
): number {
  let baseWeight = 0;

  if (height < 65) baseWeight = 125;
  else if (height < 68) baseWeight = 140;
  else if (height < 71) baseWeight = 155;
  else if (height < 74) baseWeight = 170;
  else if (height < 77) baseWeight = 185;
  else baseWeight = 205;

  baseWeight += STYLE_ADJUSTMENTS[style] || 0;

  return baseWeight + (SPORT_ADJUSTMENTS[sport] || 0);
}

export function calculateSuitability(
  targetWeight: number,
  weightClass: WeightClass,
  bodyFat: number,
): number {
  let suitability = 50;
  const weightDiff = Math.abs(targetWeight - weightClass.max);

  suitability -= weightDiff;

  if (bodyFat > 15 && weightClass.max < targetWeight - 10) suitability += 10;
  if (bodyFat < 8 && weightClass.max > targetWeight + 10) suitability -= 5;

  return Math.max(0, Math.min(100, suitability));
}

export function findOptimalWeightClasses(
  currentWeight: number,
  leanMass: number,
  classes: readonly WeightClass[],
  bodyFat: number,
  cutHistory: WeightCutHistory,
): OptimalWeightClass[] {
  const safeCutWeight = currentWeight - currentWeight * 0.05;
  const aggressiveCutWeight = currentWeight - currentWeight * 0.08;

  let targetWeight =
    cutHistory === 'advanced' ? aggressiveCutWeight : safeCutWeight;

  const minimumCompetitionWeight = leanMass / 0.85;
  targetWeight = Math.max(targetWeight, minimumCompetitionWeight);

  const suitableClasses: OptimalWeightClass[] = [];

  for (const weightClass of classes) {
    if (targetWeight >= weightClass.min - 5 && targetWeight <= weightClass.max + 5) {
      suitableClasses.push({
        ...weightClass,
        weightRequired: weightClass.max,
        cutRequired: Math.max(0, currentWeight - weightClass.max),
        cutPercentage:
          ((currentWeight - weightClass.max) / currentWeight) * 100,
        suitability: calculateSuitability(targetWeight, weightClass, bodyFat),
      });
    }
  }

  return suitableClasses.sort((a, b) => b.suitability - a.suitability);
}

export function calculatePowerToWeightRatio(
  weight: number,
  leanMass: number,
  style: FightStyle,
): number {
  return (leanMass / weight) * 100 * (STYLE_POWER_FACTORS[style] || 1.0);
}

export function getAverageHeightForWeightClass(weight: number): number {
  if (weight <= 125) return 64;
  if (weight <= 135) return 66;
  if (weight <= 145) return 68;
  if (weight <= 155) return 70;
  if (weight <= 170) return 72;
  if (weight <= 185) return 74;
  if (weight <= 205) return 76;

  return 78;
}

export function calculateReachAdvantage(
  height: number,
  optimalClasses: readonly OptimalWeightClass[],
): number {
  if (optimalClasses.length === 0) return 0;

  const targetClass = optimalClasses[0];
  const averageHeightForClass = getAverageHeightForWeightClass(
    targetClass.max,
  );

  return ((height - averageHeightForClass) / averageHeightForClass) * 100;
}

export function calculateCuttingDifficulty(
  bodyFat: number,
  age: number,
  cutHistory: WeightCutHistory,
  experience: number,
): CuttingDifficulty {
  let difficulty = 0;

  if (bodyFat > 15) difficulty = 1;
  else if (bodyFat > 12) difficulty = 2;
  else if (bodyFat > 10) difficulty = 3;
  else difficulty = 4;

  if (age > 35) difficulty += 2;
  else if (age > 25) difficulty += 1;

  difficulty += CUT_HISTORY_SCORES[cutHistory] || 2;

  if (experience < 2) difficulty += 1;

  if (difficulty <= 3) return 'Low';
  if (difficulty <= 6) return 'Medium';
  if (difficulty <= 9) return 'High';

  return 'Very High';
}

export function calculatePerformanceImpact(
  optimalClasses: readonly OptimalWeightClass[],
  cuttingDifficulty: CuttingDifficulty,
): string {
  if (optimalClasses.length === 0) return 'No suitable class found';

  const bestClass = optimalClasses[0];
  const cutPercentage = bestClass.cutPercentage;

  if (cutPercentage < 2) return 'Minimal impact';
  if (cutPercentage < 4) return 'Low impact';
  if (cutPercentage < 6) return 'Moderate impact';
  if (cutPercentage < 8) return 'High impact';

  return 'Very high impact';
}

export function calculateCombatHealthRisk(
  cuttingDifficulty: CuttingDifficulty,
  bodyFat: number,
  age: number,
): CombatHealthRisk {
  const difficultyScores: Record<CuttingDifficulty, number> = {
    Low: 1,
    Medium: 2,
    High: 3,
    'Very High': 4,
  };

  let riskScore = difficultyScores[cuttingDifficulty] || 2;

  if (bodyFat < 8) riskScore += 2;
  else if (bodyFat < 10) riskScore += 1;

  if (age > 35) riskScore += 2;
  else if (age > 25) riskScore += 1;

  if (riskScore <= 2) return 'Low';
  if (riskScore <= 4) return 'Medium';
  if (riskScore <= 6) return 'High';

  return 'Very High';
}

export function generateCombatInsights(
  weight: number,
  leanMass: number,
  optimalClasses: readonly OptimalWeightClass[],
  cuttingDifficulty: CuttingDifficulty,
  fightStyle: FightStyle,
): string[] {
  const insights: string[] = [];

  if (optimalClasses.length > 0) {
    const bestOption = optimalClasses[0];

    if (bestOption.cutPercentage > 5) {
      insights.push(
        'Significant weight cut required - consider long-term health implications',
      );
    } else if (bestOption.cutPercentage < 2) {
      insights.push(
        'Minimal weight cutting needed - excellent for performance retention',
      );
    }

    if (
      cuttingDifficulty === 'High' ||
      cuttingDifficulty === 'Very High'
    ) {
      insights.push(
        'Weight cutting will be challenging - may affect performance',
      );
    }
  }

  const leanMassPercentage = (leanMass / weight) * 100;

  if (leanMassPercentage > 85) {
    insights.push('High lean mass percentage - excellent for combat sports');
  } else if (leanMassPercentage < 75) {
    insights.push('Consider body recomposition before competition');
  }

  if (
    fightStyle === 'grappler' &&
    optimalClasses.some((weightClass) => weightClass.max > weight)
  ) {
    insights.push('Higher weight class may benefit grappling style');
  }

  return insights;
}

export function generateCombatRecommendations(
  optimalClasses: readonly OptimalWeightClass[],
  cuttingDifficulty: CuttingDifficulty,
  healthRisk: CombatHealthRisk,
  competitionLevel: CompetitionLevel,
  experience: number,
): string[] {
  const recommendations: string[] = [];

  if (optimalClasses.length > 0) {
    const bestOption = optimalClasses[0];

    recommendations.push(
      `Primary recommendation: ${bestOption.name} (${bestOption.weightRequired} lbs)`,
    );
    recommendations.push(
      `Weight cut required: ${bestOption.cutPercentage.toFixed(1)}%`,
    );

    if (bestOption.cutPercentage > 5) {
      recommendations.push('Plan 8-12 weeks gradual weight cut');
      recommendations.push('Consider professional nutrition guidance');
    }
  }

  if (
    cuttingDifficulty === 'High' ||
    cuttingDifficulty === 'Very High'
  ) {
    recommendations.push('Consider staying in current weight class');
    recommendations.push(
      'Focus on skill development over weight advantage',
    );
  }

  if (healthRisk === 'High' || healthRisk === 'Very High') {
    recommendations.push(
      'Medical supervision recommended for weight cutting',
    );
    recommendations.push('Regular health monitoring during cut');
  }

  if (experience < 3) {
    recommendations.push(
      'Focus on technical skills before weight class optimization',
    );
  }

  if (competitionLevel === 'amateur') {
    recommendations.push(
      'Prioritize skill development over weight advantage',
    );
  }

  return recommendations;
}

export function validateCombatValues(
  values: CombatValues,
): FieldErrors<CombatValues> {
  const errors: FieldErrors<CombatValues> = {};

  if (!values.sport) {
    errors.sport = COMBAT_ERRORS.sport;
  }

  const currentWeight = parseNumber(values.currentWeight);

  if (currentWeight === null) {
    errors.currentWeight = COMBAT_ERRORS.currentWeight;
  } else if (currentWeight <= 0) {
    errors.currentWeight = rangeError('current body weight', 0, 500);
  }

  const height = parseNumber(values.height);

  if (height === null) {
    errors.height = COMBAT_ERRORS.height;
  } else if (height <= 0) {
    errors.height = rangeError('height', 0, 300);
  }

  const bodyFat = parseNumber(values.bodyFat);

  if (bodyFat === null) {
    errors.bodyFat = COMBAT_ERRORS.bodyFat;
  } else if (bodyFat < 2 || bodyFat > 60) {
    errors.bodyFat = rangeError('body fat percentage', 2, 60);
  }

  const experience = parseNumber(values.experience);

  if (experience === null) {
    errors.experience = COMBAT_ERRORS.experience;
  } else if (experience < 0 || experience > 50) {
    errors.experience = rangeError('years of experience', 0, 50);
  }

  if (!values.fightStyle) {
    errors.fightStyle = COMBAT_ERRORS.fightStyle;
  }

  if (!values.competitionLevel) {
    errors.competitionLevel = COMBAT_ERRORS.competitionLevel;
  }

  const age = parseNumber(values.age);

  if (age === null) {
    errors.age = COMBAT_ERRORS.age;
  } else if (age < 12 || age > 70) {
    errors.age = rangeError('age', 12, 70);
  }

  if (!values.cutHistory) {
    errors.cutHistory = COMBAT_ERRORS.cutHistory;
  }

  return errors;
}

export function optimizeWeightClass(values: CombatValues): CombatResult {
  if (!values.sport) {
    throw new Error(COMBAT_ERRORS.sport);
  }

  if (!values.fightStyle) {
    throw new Error(COMBAT_ERRORS.fightStyle);
  }

  if (!values.competitionLevel) {
    throw new Error(COMBAT_ERRORS.competitionLevel);
  }

  if (!values.cutHistory) {
    throw new Error(COMBAT_ERRORS.cutHistory);
  }

  const currentWeight = parseNumber(values.currentWeight);
  const height = parseNumber(values.height);
  const bodyFat = parseNumber(values.bodyFat);
  const experience = parseNumber(values.experience);
  const age = parseNumber(values.age);

  if (currentWeight === null) {
    throw new Error(COMBAT_ERRORS.currentWeight);
  }

  if (height === null) {
    throw new Error(COMBAT_ERRORS.height);
  }

  if (bodyFat === null) {
    throw new Error(COMBAT_ERRORS.bodyFat);
  }

  if (experience === null) {
    throw new Error(COMBAT_ERRORS.experience);
  }

  if (age === null) {
    throw new Error(COMBAT_ERRORS.age);
  }

  const weightLbs =
    values.weightUnit === 'kg' ? currentWeight * 2.20462 : currentWeight;
  const heightInches =
    values.heightUnit === 'cm' ? height / 2.54 : height * 12;

  const classes = getWeightClassesForSport(values.sport);
  const currentClass = findWeightClass(weightLbs, classes);
  const leanMass = weightLbs * (1 - bodyFat / 100);
  const idealWeight = calculateIdealWeight(
    heightInches,
    bodyFat,
    values.fightStyle,
    values.sport,
  );

  const optimalClasses = findOptimalWeightClasses(
    weightLbs,
    leanMass,
    classes,
    bodyFat,
    values.cutHistory,
  );

  const powerToWeightRatio = calculatePowerToWeightRatio(
    weightLbs,
    leanMass,
    values.fightStyle,
  );
  const reachAdvantage = calculateReachAdvantage(heightInches, optimalClasses);
  const cuttingDifficulty = calculateCuttingDifficulty(
    bodyFat,
    age,
    values.cutHistory,
    experience,
  );
  const performanceImpact = calculatePerformanceImpact(
    optimalClasses,
    cuttingDifficulty,
  );
  const healthRisk = calculateCombatHealthRisk(
    cuttingDifficulty,
    bodyFat,
    age,
  );

  return {
    currentWeight: weightLbs.toFixed(1),
    leanMass: leanMass.toFixed(1),
    currentClass,
    idealWeight: idealWeight.toFixed(1),
    optimalClasses,
    powerToWeightRatio: powerToWeightRatio.toFixed(1),
    reachAdvantage: reachAdvantage.toFixed(0),
    cuttingDifficulty,
    performanceImpact,
    healthRisk,
    insights: generateCombatInsights(
      weightLbs,
      leanMass,
      optimalClasses,
      cuttingDifficulty,
      values.fightStyle,
    ),
    recommendations: generateCombatRecommendations(
      optimalClasses,
      cuttingDifficulty,
      healthRisk,
      values.competitionLevel,
      experience,
    ),
  };
}
