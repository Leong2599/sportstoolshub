import {parseNumber} from './units';
import type {FieldErrors} from './validation';

export type StrokeType =
  | 'freestyle'
  | 'backstroke'
  | 'breaststroke'
  | 'butterfly'
  | 'individual-medley';

export type StrokePoolLength =
  | '25'
  | '50'
  | '33.33'
  | '25-yards';

export type StrokeDistanceUnit = 'meters' | 'yards';

export type StrokeExperience =
  | 'beginner'
  | 'novice'
  | 'intermediate'
  | 'advanced'
  | 'elite';

export type StrokeTrainingGoal =
  | 'fitness'
  | 'technique'
  | 'endurance'
  | 'speed'
  | 'competition'
  | 'triathlon';

export type StrokeSwimmerType =
  | 'distance'
  | 'sprinter'
  | 'middle-distance'
  | 'triathlete'
  | 'masters';

export type StrokeValues = {
  strokeType: StrokeType | '';
  poolLength: StrokePoolLength | '';
  distance: string;
  distanceUnit: StrokeDistanceUnit;
  timeMinutes: string;
  timeSeconds: string;
  strokeCount: string;
  experienceLevel: StrokeExperience | '';
  trainingGoal: StrokeTrainingGoal | '';
  swimmerType: StrokeSwimmerType | '';
};

export type StrokeRange = {
  min: number;
  max: number;
};

export type StrokeOptimalRanges = {
  swolf: Record<StrokeExperience, StrokeRange>;
  strokeRate: Record<StrokeExperience, StrokeRange>;
  distancePerStroke: Record<StrokeExperience, StrokeRange>;
};

export type StrokeResult = {
  strokeType: StrokeType;
  poolLength: number;
  distance: number;
  time: number;
  pace: string;
  speed: string;
  strokeRate: number;
  distancePerStroke: string;
  swolf: number;
  strokesPerLength: number;
  efficiencyIndex: number;
  technicalEfficiency: number;
  performanceLevel: string;
  improvementAreas: readonly string[];
  trainingRecommendations: readonly string[];
  insights: readonly string[];
};

export const STROKE_TYPES: readonly {value: StrokeType; label: string}[] = [
  {value: 'freestyle', label: 'Freestyle (Front Crawl)'},
  {value: 'backstroke', label: 'Backstroke'},
  {value: 'breaststroke', label: 'Breaststroke'},
  {value: 'butterfly', label: 'Butterfly'},
  {value: 'individual-medley', label: 'Individual Medley'},
] as const;

export const STROKE_POOL_LENGTHS: readonly {
  value: StrokePoolLength;
  label: string;
}[] = [
  {value: '25', label: '25 meters (Short Course)'},
  {value: '50', label: '50 meters (Long Course)'},
  {value: '33.33', label: '33.33 yards (Short Course Yards)'},
  {value: '25-yards', label: '25 yards (Short Course Yards)'},
] as const;

export const STROKE_DISTANCE_UNITS: readonly {
  value: StrokeDistanceUnit;
  label: string;
}[] = [
  {value: 'meters', label: 'meters'},
  {value: 'yards', label: 'yards'},
] as const;

export const STROKE_EXPERIENCES: readonly {
  value: StrokeExperience;
  label: string;
}[] = [
  {value: 'beginner', label: 'Beginner (<1 year)'},
  {value: 'novice', label: 'Novice (1-2 years)'},
  {value: 'intermediate', label: 'Intermediate (2-5 years)'},
  {value: 'advanced', label: 'Advanced (5-10 years)'},
  {value: 'elite', label: 'Elite/Competitive (>10 years)'},
] as const;

export const STROKE_TRAINING_GOALS: readonly {
  value: StrokeTrainingGoal;
  label: string;
}[] = [
  {value: 'fitness', label: 'General Fitness'},
  {value: 'technique', label: 'Technique Improvement'},
  {value: 'endurance', label: 'Endurance Training'},
  {value: 'speed', label: 'Speed Development'},
  {value: 'competition', label: 'Competition Preparation'},
  {value: 'triathlon', label: 'Triathlon Swimming'},
] as const;

export const STROKE_SWIMMER_TYPES: readonly {
  value: StrokeSwimmerType;
  label: string;
}[] = [
  {value: 'distance', label: 'Distance Swimmer'},
  {value: 'sprinter', label: 'Sprint Swimmer'},
  {value: 'middle-distance', label: 'Middle Distance'},
  {value: 'triathlete', label: 'Triathlete'},
  {value: 'masters', label: 'Masters Swimmer'},
] as const;

export const STROKE_ERRORS = {
  strokeType: 'Please select a stroke type.',
  poolLength: 'Please select a pool length.',
  distance: 'Please enter a valid distance.',
  time: 'Please enter a valid time.',
  strokeCount: 'Please enter a valid stroke count.',
  experienceLevel: 'Please select your experience level.',
  trainingGoal: 'Please select a training goal.',
  swimmerType: 'Please select a swimmer type.',
} as const;

const YARDS_TO_METERS = 0.9144;

const STROKE_MULTIPLIERS: Record<StrokeType, number> = {
  freestyle: 1.0,
  backstroke: 0.95,
  breaststroke: 0.8,
  butterfly: 0.85,
  'individual-medley': 0.9,
};

const OPTIMAL_STROKE_RATES: Record<StrokeType, number> = {
  freestyle: 55,
  backstroke: 50,
  breaststroke: 40,
  butterfly: 48,
  'individual-medley': 52,
};

const ELITE_SWOLF: Record<StrokeType, number> = {
  freestyle: 25,
  backstroke: 30,
  breaststroke: 35,
  butterfly: 32,
  'individual-medley': 30,
};

const EXPERIENCE_MULTIPLIERS: Record<StrokeExperience, number> = {
  beginner: 1.5,
  novice: 1.3,
  intermediate: 1.1,
  advanced: 1.0,
  elite: 0.9,
};

const BASE_RANGES: Record<string, StrokeOptimalRanges> = {
  freestyle: {
    swolf: {
      beginner: {min: 40, max: 60},
      novice: {min: 35, max: 50},
      intermediate: {min: 30, max: 45},
      advanced: {min: 25, max: 40},
      elite: {min: 20, max: 35},
    },
    strokeRate: {
      beginner: {min: 30, max: 50},
      novice: {min: 40, max: 60},
      intermediate: {min: 45, max: 65},
      advanced: {min: 50, max: 70},
      elite: {min: 55, max: 80},
    },
    distancePerStroke: {
      beginner: {min: 1.0, max: 1.5},
      novice: {min: 1.3, max: 1.8},
      intermediate: {min: 1.5, max: 2.0},
      advanced: {min: 1.7, max: 2.2},
      elite: {min: 1.9, max: 2.5},
    },
  },
  backstroke: {
    swolf: {
      beginner: {min: 45, max: 65},
      novice: {min: 40, max: 55},
      intermediate: {min: 35, max: 50},
      advanced: {min: 30, max: 45},
      elite: {min: 25, max: 40},
    },
    strokeRate: {
      beginner: {min: 25, max: 45},
      novice: {min: 35, max: 55},
      intermediate: {min: 40, max: 60},
      advanced: {min: 45, max: 65},
      elite: {min: 50, max: 70},
    },
    distancePerStroke: {
      beginner: {min: 0.9, max: 1.4},
      novice: {min: 1.2, max: 1.7},
      intermediate: {min: 1.4, max: 1.9},
      advanced: {min: 1.6, max: 2.1},
      elite: {min: 1.8, max: 2.3},
    },
  },
  breaststroke: {
    swolf: {
      beginner: {min: 50, max: 70},
      novice: {min: 45, max: 60},
      intermediate: {min: 40, max: 55},
      advanced: {min: 35, max: 50},
      elite: {min: 30, max: 45},
    },
    strokeRate: {
      beginner: {min: 20, max: 35},
      novice: {min: 25, max: 40},
      intermediate: {min: 30, max: 45},
      advanced: {min: 35, max: 50},
      elite: {min: 40, max: 55},
    },
    distancePerStroke: {
      beginner: {min: 0.8, max: 1.3},
      novice: {min: 1.0, max: 1.5},
      intermediate: {min: 1.2, max: 1.7},
      advanced: {min: 1.4, max: 1.9},
      elite: {min: 1.6, max: 2.0},
    },
  },
  butterfly: {
    swolf: {
      beginner: {min: 55, max: 75},
      novice: {min: 45, max: 65},
      intermediate: {min: 40, max: 60},
      advanced: {min: 35, max: 55},
      elite: {min: 30, max: 50},
    },
    strokeRate: {
      beginner: {min: 25, max: 40},
      novice: {min: 30, max: 45},
      intermediate: {min: 35, max: 50},
      advanced: {min: 40, max: 60},
      elite: {min: 45, max: 65},
    },
    distancePerStroke: {
      beginner: {min: 0.8, max: 1.3},
      novice: {min: 1.0, max: 1.5},
      intermediate: {min: 1.2, max: 1.7},
      advanced: {min: 1.4, max: 1.9},
      elite: {min: 1.6, max: 2.0},
    },
  },
};

export function getOptimalRanges(
  strokeType: StrokeType,
): StrokeOptimalRanges {
  return BASE_RANGES[strokeType] ?? BASE_RANGES.freestyle;
}

export function calculateStrokePace(
  timeSeconds: number,
  distanceMeters: number,
): string {
  const pacePer100m = (timeSeconds / distanceMeters) * 100;
  const minutes = Math.floor(pacePer100m / 60);
  const seconds = Math.round(pacePer100m % 60);

  return `${minutes}:${seconds.toString().padStart(2, '0')}`;
}

export function calculateSwolf(
  poolLengthMeters: number,
  timeSeconds: number,
  strokeCount: number,
  distanceMeters: number,
): number {
  const lengths = distanceMeters / poolLengthMeters;
  const timePerLength = timeSeconds / lengths;
  const strokesPerLength = strokeCount / lengths;

  return Math.round(timePerLength + strokesPerLength);
}

export function calculateEfficiencyIndex(
  distancePerStroke: number,
  strokeRate: number,
  strokeType: StrokeType,
): number {
  const optimalRate = OPTIMAL_STROKE_RATES[strokeType] || 55;
  const rateEfficiency = 1 - Math.abs(strokeRate - optimalRate) / optimalRate;
  const distanceScore = Math.min(distancePerStroke / 2.5, 1);

  return Math.round(
    (distanceScore * 0.6 + rateEfficiency * 0.4) *
      100 *
      (STROKE_MULTIPLIERS[strokeType] || 1.0),
  );
}

export function calculateTechnicalEfficiency(
  swolf: number,
  experienceLevel: StrokeExperience,
  strokeType: StrokeType,
): number {
  const eliteValue = ELITE_SWOLF[strokeType] || 30;
  const adjustedSWOLF = swolf / (EXPERIENCE_MULTIPLIERS[experienceLevel] || 1.1);
  const efficiency = Math.max(
    0,
    Math.min(100, (1 - (adjustedSWOLF - eliteValue) / eliteValue) * 100),
  );

  return Math.round(efficiency);
}

export function assessPerformanceLevel(
  swolf: number,
  strokeRate: number,
  distancePerStroke: number,
  experience: StrokeExperience,
): string {
  const ranges = getOptimalRanges('freestyle');
  let score = 0;

  const swolfRange = ranges.swolf[experience] || ranges.swolf.intermediate;

  if (swolf <= swolfRange.min) score += 40;
  else if (swolf <= swolfRange.max) score += 30;
  else score += 10;

  const rateRange =
    ranges.strokeRate[experience] || ranges.strokeRate.intermediate;

  if (strokeRate >= rateRange.min && strokeRate <= rateRange.max) score += 30;
  else if (
    Math.abs(strokeRate - (rateRange.min + rateRange.max) / 2) <= 10
  ) {
    score += 20;
  } else score += 10;

  const distanceRange =
    ranges.distancePerStroke[experience] || ranges.distancePerStroke.intermediate;

  if (distancePerStroke >= distanceRange.max) score += 30;
  else if (distancePerStroke >= distanceRange.min) score += 20;
  else score += 10;

  if (score >= 85) return 'Elite';
  if (score >= 70) return 'Advanced';
  if (score >= 55) return 'Intermediate';
  if (score >= 40) return 'Novice';

  return 'Beginner';
}

export function identifyImprovementAreas(
  swolf: number,
  strokeRate: number,
  distancePerStroke: number,
): string[] {
  const areas: string[] = [];

  if (swolf > 35) {
    areas.push('Reduce stroke count by improving catch and pull technique');
    areas.push('Focus on streamlining to reduce drag');
  }

  if (strokeRate < 40) {
    areas.push('Increase stroke rate for better rhythm and speed');
    areas.push('Practice tempo training with a metronome');
  } else if (strokeRate > 70) {
    areas.push('Reduce stroke rate to improve distance per stroke');
    areas.push('Focus on longer, more powerful strokes');
  }

  if (distancePerStroke < 1.5) {
    areas.push('Increase distance per stroke through better extension');
    areas.push('Work on catch technique and body rotation');
  }

  return areas;
}

export function generateTrainingRecommendations(
  swolf: number,
  strokeRate: number,
  distancePerStroke: number,
  goal: StrokeTrainingGoal,
): string[] {
  const recommendations: string[] = [];

  if (swolf > 40) {
    recommendations.push(
      'Drill: Focus on stroke count reduction (7-10% improvement goal)',
    );
    recommendations.push(
      'Technique: Work on high elbow catch and early forearm press',
    );
  }

  if (strokeRate < 45) {
    recommendations.push(
      'Training: Use tempo trainer at 50-60 strokes/minute',
    );
    recommendations.push(
      'Focus: Quick turnover while maintaining distance per stroke',
    );
  } else if (strokeRate > 65) {
    recommendations.push(
      'Training: Slow down stroke rate to 45-55 strokes/minute',
    );
    recommendations.push('Focus: Longer glide phase and body rotation');
  }

  if (distancePerStroke < 1.7) {
    recommendations.push(
      'Drill: Extension drills - reach full extension before pull',
    );
    recommendations.push('Focus: Body rotation and proper hand entry');
  }

  if (goal === 'triathlon') {
    recommendations.push(
      'Triathlon focus: Maintain efficiency over long distances',
    );
    recommendations.push('Practice sighting without breaking rhythm');
  } else if (goal === 'competition') {
    recommendations.push(
      'Competition focus: Fine-tune race pace and strategy',
    );
    recommendations.push(
      'Practice race-start pacing and negative splits',
    );
  } else if (goal === 'technique') {
    recommendations.push('Technique focus: Video analysis and stroke correction');
    recommendations.push(
      'Drill: 50% technique, 50% main sets for optimal learning',
    );
  }

  return recommendations;
}

export function generateStrokeInsights(
  swolf: number,
  strokeRate: number,
  distancePerStroke: number,
  performanceLevel: string,
  swimmerType: StrokeSwimmerType,
): string[] {
  const insights: string[] = [];

  if (swolf < 30) {
    insights.push(
      'Excellent SWOLF score - you have very efficient technique',
    );
  } else if (swolf > 45) {
    insights.push(
      'SWOLF score indicates room for significant efficiency improvement',
    );
  }

  if (strokeRate >= 50 && strokeRate <= 60) {
    insights.push('Optimal stroke rate for most swimming distances');
  }

  if (distancePerStroke > 2.0) {
    insights.push('Great distance per stroke - excellent efficiency');
  } else if (distancePerStroke < 1.5) {
    insights.push(
      'Distance per stroke could be improved with better technique',
    );
  }

  if (performanceLevel === 'Elite') {
    insights.push(
      'Elite performance level - focus on fine-tuning and race strategy',
    );
  } else if (performanceLevel === 'Beginner') {
    insights.push(
      'Focus on fundamental techniques before speed development',
    );
  }

  if (swimmerType === 'distance' && strokeRate > 55) {
    insights.push('Consider slightly lower stroke rate for distance events');
  } else if (swimmerType === 'sprinter' && strokeRate < 55) {
    insights.push('Increase stroke rate for sprint performance');
  }

  return insights;
}

export function validateStrokeValues(
  values: StrokeValues,
): FieldErrors<StrokeValues> {
  const errors: FieldErrors<StrokeValues> = {};

  if (!values.strokeType) {
    errors.strokeType = STROKE_ERRORS.strokeType;
  }

  if (!values.poolLength) {
    errors.poolLength = STROKE_ERRORS.poolLength;
  }

  const distance = parseNumber(values.distance);

  if (distance === null || distance <= 0) {
    errors.distance = STROKE_ERRORS.distance;
  }

  const minutes = Number.parseInt(values.timeMinutes, 10);
  const seconds = Number.parseInt(values.timeSeconds, 10);

  if (
    Number.isNaN(minutes) ||
    Number.isNaN(seconds) ||
    minutes * 60 + seconds <= 0
  ) {
    errors.timeMinutes = STROKE_ERRORS.time;
  }

  const strokeCount = parseNumber(values.strokeCount);

  if (strokeCount === null || strokeCount <= 0) {
    errors.strokeCount = STROKE_ERRORS.strokeCount;
  }

  if (!values.experienceLevel) {
    errors.experienceLevel = STROKE_ERRORS.experienceLevel;
  }

  if (!values.trainingGoal) {
    errors.trainingGoal = STROKE_ERRORS.trainingGoal;
  }

  if (!values.swimmerType) {
    errors.swimmerType = STROKE_ERRORS.swimmerType;
  }

  return errors;
}

export function calculateStrokeEfficiency(
  values: StrokeValues,
): StrokeResult {
  if (!values.strokeType) {
    throw new Error(STROKE_ERRORS.strokeType);
  }

  if (!values.poolLength) {
    throw new Error(STROKE_ERRORS.poolLength);
  }

  const distance = parseNumber(values.distance);

  if (distance === null || distance <= 0) {
    throw new Error(STROKE_ERRORS.distance);
  }

  const minutes = Number.parseInt(values.timeMinutes, 10);
  const seconds = Number.parseInt(values.timeSeconds, 10);

  if (Number.isNaN(minutes) || Number.isNaN(seconds) || minutes * 60 + seconds <= 0) {
    throw new Error(STROKE_ERRORS.time);
  }

  const strokeCount = parseNumber(values.strokeCount);

  if (strokeCount === null || strokeCount <= 0) {
    throw new Error(STROKE_ERRORS.strokeCount);
  }

  if (!values.experienceLevel) {
    throw new Error(STROKE_ERRORS.experienceLevel);
  }

  if (!values.trainingGoal) {
    throw new Error(STROKE_ERRORS.trainingGoal);
  }

  if (!values.swimmerType) {
    throw new Error(STROKE_ERRORS.swimmerType);
  }

  const distanceMeters =
    values.distanceUnit === 'yards' ? distance * YARDS_TO_METERS : distance;
  const totalTimeSeconds = minutes * 60 + seconds;
  const poolLengthMeters = Number.parseFloat(values.poolLength);

  const pace = calculateStrokePace(totalTimeSeconds, distanceMeters);
  const speed = ((distanceMeters / totalTimeSeconds) * 3.6).toFixed(2);
  const strokeRate = Math.round((strokeCount / totalTimeSeconds) * 60);
  const distancePerStroke = (distanceMeters / strokeCount).toFixed(2);
  const swolf = calculateSwolf(
    poolLengthMeters,
    totalTimeSeconds,
    strokeCount,
    distanceMeters,
  );
  const strokesPerLength = Math.round(
    strokeCount / (distanceMeters / poolLengthMeters),
  );
  const efficiencyIndex = calculateEfficiencyIndex(
    Number(distancePerStroke),
    strokeRate,
    values.strokeType,
  );
  const technicalEfficiency = calculateTechnicalEfficiency(
    swolf,
    values.experienceLevel,
    values.strokeType,
  );
  const performanceLevel = assessPerformanceLevel(
    swolf,
    strokeRate,
    Number(distancePerStroke),
    values.experienceLevel,
  );

  return {
    strokeType: values.strokeType,
    poolLength: poolLengthMeters,
    distance: distanceMeters,
    time: totalTimeSeconds,
    pace,
    speed,
    strokeRate,
    distancePerStroke,
    swolf,
    strokesPerLength,
    efficiencyIndex,
    technicalEfficiency,
    performanceLevel,
    improvementAreas: identifyImprovementAreas(
      swolf,
      strokeRate,
      Number(distancePerStroke),
    ),
    trainingRecommendations: generateTrainingRecommendations(
      swolf,
      strokeRate,
      Number(distancePerStroke),
      values.trainingGoal,
    ),
    insights: generateStrokeInsights(
      swolf,
      strokeRate,
      Number(distancePerStroke),
      performanceLevel,
      values.swimmerType,
    ),
  };
}
