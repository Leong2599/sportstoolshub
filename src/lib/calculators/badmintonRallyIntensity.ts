import {parseNumber} from './units';
import {rangeError} from './sportValidation';
import type {FieldErrors} from './validation';

export type BadmintonDurationUnit = 'minutes' | 'hours';

export type BadmintonFormat = 'singles' | 'doubles' | 'mixed-doubles';

export type BadmintonPlayStyle =
  | 'attacking'
  | 'defensive'
  | 'all-round'
  | 'net-play';

export type BadmintonOpponentLevel =
  | 'beginner'
  | 'intermediate'
  | 'advanced'
  | 'professional';

export type BadmintonRallyValues = {
  matchDuration: string;
  durationUnit: BadmintonDurationUnit;
  totalRallies: string;
  avgRallyShots: string;
  playingFormat: BadmintonFormat | '';
  playStyle: BadmintonPlayStyle | '';
  opponentLevel: BadmintonOpponentLevel | '';
  smashCount: string;
  netShots: string;
  clears: string;
};

export type BadmintonPerformanceRating =
  | 'Excellent'
  | 'Very Good'
  | 'Good'
  | 'Average'
  | 'Needs Improvement';

export type BadmintonRallyResult = {
  intensityScore: number;
  intensityScoreDisplay: string;
  rallyFrequency: number;
  rallyFrequencyDisplay: string;
  avgRallyDuration: number;
  avgRallyDurationDisplay: string;
  shotsPerMinute: number;
  shotsPerMinuteDisplay: string;
  workRate: number;
  workRateDisplay: string;
  tacticalDiversity: number;
  tacticalDiversityDisplay: string;
  fatigueFactor: number;
  fatigueFactorDisplay: string;
  performanceRating: BadmintonPerformanceRating;
  smashPercentage: number;
  smashPercentageDisplay: string;
  netPlayPercentage: number;
  netPlayPercentageDisplay: string;
  clearPercentage: number;
  clearPercentageDisplay: string;
  insights: readonly string[];
  recommendations: readonly string[];
};

export const BADMINTON_DURATION_UNITS: readonly {
  value: BadmintonDurationUnit;
  label: string;
}[] = [
  {value: 'minutes', label: 'minutes'},
  {value: 'hours', label: 'hours'},
] as const;

export const BADMINTON_FORMATS: readonly {
  value: BadmintonFormat;
  label: string;
}[] = [
  {value: 'singles', label: 'Singles'},
  {value: 'doubles', label: 'Doubles'},
  {value: 'mixed-doubles', label: 'Mixed Doubles'},
] as const;

export const BADMINTON_PLAY_STYLES: readonly {
  value: BadmintonPlayStyle;
  label: string;
}[] = [
  {value: 'attacking', label: 'Attacking/Aggressive'},
  {value: 'defensive', label: 'Defensive/Controlled'},
  {value: 'all-round', label: 'All-Round'},
  {value: 'net-play', label: 'Net-Play Specialist'},
] as const;

export const BADMINTON_OPPONENT_LEVELS: readonly {
  value: BadmintonOpponentLevel;
  label: string;
}[] = [
  {value: 'beginner', label: 'Beginner'},
  {value: 'intermediate', label: 'Intermediate'},
  {value: 'advanced', label: 'Advanced'},
  {value: 'professional', label: 'Professional/Elite'},
] as const;

export const BADMINTON_ERRORS = {
  matchDuration: 'Please enter a valid match duration.',
  totalRallies: 'Please enter a valid number of rallies.',
  avgRallyShots: 'Please enter a valid average shots per rally.',
  playingFormat: 'Please select a playing format.',
  playStyle: 'Please select a playing style.',
  opponentLevel: 'Please select an opponent level.',
  smashCount: 'Please enter a valid number of smashes.',
  netShots: 'Please enter a valid number of net shots.',
  clears: 'Please enter a valid number of clears.',
} as const;

const STYLE_SCORES: Record<BadmintonPlayStyle, number> = {
  attacking: 15,
  'all-round': 10,
  'net-play': 8,
  defensive: 5,
};

const FORMAT_SCORES: Record<BadmintonFormat, number> = {
  singles: 15,
  doubles: 10,
  'mixed-doubles': 10,
};

const FORMAT_ADJUSTMENTS: Record<BadmintonFormat, number> = {
  singles: 1.2,
  doubles: 1.0,
  'mixed-doubles': 0.9,
};

const OPPONENT_MULTIPLIERS: Record<BadmintonOpponentLevel, number> = {
  beginner: 1.3,
  intermediate: 1.1,
  advanced: 1.0,
  professional: 0.9,
};

export function validateBadmintonRallyValues(
  values: BadmintonRallyValues,
): FieldErrors<BadmintonRallyValues> {
  const errors: FieldErrors<BadmintonRallyValues> = {};

  const matchDuration = parseNumber(values.matchDuration);

  if (matchDuration === null) {
    errors.matchDuration = BADMINTON_ERRORS.matchDuration;
  } else if (matchDuration <= 0) {
    errors.matchDuration = rangeError('match duration', 0, 1440);
  }

  const totalRallies = parseNumber(values.totalRallies);

  if (totalRallies === null) {
    errors.totalRallies = BADMINTON_ERRORS.totalRallies;
  } else if (totalRallies < 1 || totalRallies > 10000) {
    errors.totalRallies = rangeError('number of rallies', 1, 10000);
  }

  const avgRallyShots = parseNumber(values.avgRallyShots);

  if (avgRallyShots === null) {
    errors.avgRallyShots = BADMINTON_ERRORS.avgRallyShots;
  } else if (avgRallyShots < 1 || avgRallyShots > 100) {
    errors.avgRallyShots = rangeError('average shots per rally', 1, 100);
  }

  if (!values.playingFormat) {
    errors.playingFormat = BADMINTON_ERRORS.playingFormat;
  }

  if (!values.playStyle) {
    errors.playStyle = BADMINTON_ERRORS.playStyle;
  }

  if (!values.opponentLevel) {
    errors.opponentLevel = BADMINTON_ERRORS.opponentLevel;
  }

  const smashCount = parseNumber(values.smashCount);

  if (smashCount === null) {
    errors.smashCount = BADMINTON_ERRORS.smashCount;
  } else if (smashCount < 0 || smashCount > 10000) {
    errors.smashCount = rangeError('number of smashes', 0, 10000);
  }

  const netShots = parseNumber(values.netShots);

  if (netShots === null) {
    errors.netShots = BADMINTON_ERRORS.netShots;
  } else if (netShots < 0 || netShots > 10000) {
    errors.netShots = rangeError('number of net shots', 0, 10000);
  }

  const clears = parseNumber(values.clears);

  if (clears === null) {
    errors.clears = BADMINTON_ERRORS.clears;
  } else if (clears < 0 || clears > 10000) {
    errors.clears = rangeError('number of clears', 0, 10000);
  }

  return errors;
}

export function calculateBadmintonIntensityScore(
  avgShots: number,
  frequency: number,
  smashes: number,
  style: BadmintonPlayStyle,
  format: BadmintonFormat,
): number {
  let score = 0;

  if (avgShots > 15) score += 30;
  else if (avgShots > 10) score += 25;
  else if (avgShots > 7) score += 20;
  else if (avgShots > 5) score += 15;
  else score += 10;

  if (frequency > 3) score += 25;
  else if (frequency > 2.5) score += 20;
  else if (frequency > 2) score += 15;
  else if (frequency > 1.5) score += 10;
  else score += 5;

  const smashRatio = smashes / (avgShots * frequency * 60);

  if (smashRatio > 0.25) score += 20;
  else if (smashRatio > 0.2) score += 15;
  else if (smashRatio > 0.15) score += 10;
  else if (smashRatio > 0.1) score += 5;

  score += STYLE_SCORES[style] || 10;
  score += FORMAT_SCORES[format] || 10;

  return Math.min(100, score);
}

export function calculateBadmintonWorkRate(
  shotsPerMinute: number,
  format: BadmintonFormat,
): number {
  const baseWorkRate = shotsPerMinute * 10;

  return baseWorkRate * (FORMAT_ADJUSTMENTS[format] || 1.0);
}

export function calculateTacticalDiversity(
  smash: number,
  net: number,
  clear: number,
): number {
  const percentages = [smash, net, clear];
  const idealDistribution = [20, 40, 25];
  const weights = [0.3, 0.4, 0.3];

  let diversityScore = 100;

  percentages.forEach((percent, index) => {
    const deviation = Math.abs(percent - idealDistribution[index]);
    diversityScore -= deviation * weights[index];
  });

  return Math.max(0, Math.min(100, diversityScore));
}

export function calculateBadmintonFatigueFactor(
  intensity: number,
  duration: number,
  frequency: number,
): number {
  let fatigue = (intensity / 100) * 50;
  fatigue += (duration / 120) * 30;
  fatigue += (frequency / 3) * 20;

  return Math.min(100, fatigue);
}

export function calculateBadmintonPerformanceRating(
  intensity: number,
  diversity: number,
  opponentLevel: BadmintonOpponentLevel,
): BadmintonPerformanceRating {
  let rating = (intensity + diversity) / 2;

  rating *= OPPONENT_MULTIPLIERS[opponentLevel] || 1.0;
  rating = Math.min(100, rating);

  if (rating >= 85) return 'Excellent';
  if (rating >= 70) return 'Very Good';
  if (rating >= 55) return 'Good';
  if (rating >= 40) return 'Average';

  return 'Needs Improvement';
}

export function generateBadmintonInsights(
  intensity: number,
  avgShots: number,
  smashPercent: number,
  frequency: number,
  style: BadmintonPlayStyle,
): string[] {
  const insights: string[] = [];

  if (intensity > 80) {
    insights.push('Very high intensity - excellent conditioning level');
  } else if (intensity < 40) {
    insights.push('Lower intensity - opportunity to increase work rate');
  }

  if (avgShots > 12) {
    insights.push('Long rallies indicate good stamina and tactical patience');
  } else if (avgShots < 6) {
    insights.push('Short rallies suggest aggressive or defensive play style');
  }

  if (smashPercent > 25) {
    insights.push('High smash percentage - aggressive attacking style');
  } else if (smashPercent < 10) {
    insights.push(
      'Low smash usage - could be missing attacking opportunities',
    );
  }

  if (frequency > 2.5) {
    insights.push('High rally frequency - excellent game flow');
  }

  if (style === 'attacking' && smashPercent < 15) {
    insights.push('Consider increasing smash usage for attacking style');
  }

  return insights;
}

export function generateBadmintonRecommendations(
  intensity: number,
  fatigue: number,
  diversity: number,
  format: BadmintonFormat,
  style: BadmintonPlayStyle,
): string[] {
  const recommendations: string[] = [];

  if (intensity > 75) {
    recommendations.push('Maintain current intensity - focus on consistency');
  } else if (intensity < 50) {
    recommendations.push('Increase rally speed and shot frequency');
    recommendations.push('Practice interval training to boost intensity');
  }

  if (fatigue > 70) {
    recommendations.push('Focus on recovery and endurance training');
    recommendations.push(
      'Monitor hydration and nutrition during long matches',
    );
  }

  if (diversity < 60) {
    recommendations.push('Develop more varied shot selection');
    recommendations.push('Practice underutilized shot types in training');
  }

  if (format === 'singles') {
    recommendations.push('Focus on court coverage and stamina');
  } else {
    recommendations.push('Work on partner coordination and positioning');
  }

  if (style === 'attacking') {
    recommendations.push('Develop more reliable defensive shots');
  } else if (style === 'defensive') {
    recommendations.push('Add more attacking options to your game');
  } else if (style === 'net-play') {
    recommendations.push('Improve back court positioning and clears');
  }

  return recommendations;
}

export function calculateBadmintonRally(
  values: BadmintonRallyValues,
): BadmintonRallyResult {
  if (!values.playingFormat) {
    throw new Error(BADMINTON_ERRORS.playingFormat);
  }

  if (!values.playStyle) {
    throw new Error(BADMINTON_ERRORS.playStyle);
  }

  if (!values.opponentLevel) {
    throw new Error(BADMINTON_ERRORS.opponentLevel);
  }

  const matchDuration = parseNumber(values.matchDuration);
  const totalRallies = parseNumber(values.totalRallies);
  const avgRallyShots = parseNumber(values.avgRallyShots);
  const smashCount = parseNumber(values.smashCount);
  const netShots = parseNumber(values.netShots);
  const clears = parseNumber(values.clears);

  if (matchDuration === null) {
    throw new Error(BADMINTON_ERRORS.matchDuration);
  }

  if (totalRallies === null) {
    throw new Error(BADMINTON_ERRORS.totalRallies);
  }

  if (avgRallyShots === null) {
    throw new Error(BADMINTON_ERRORS.avgRallyShots);
  }

  if (smashCount === null) {
    throw new Error(BADMINTON_ERRORS.smashCount);
  }

  if (netShots === null) {
    throw new Error(BADMINTON_ERRORS.netShots);
  }

  if (clears === null) {
    throw new Error(BADMINTON_ERRORS.clears);
  }

  const durationMinutes =
    values.durationUnit === 'hours' ? matchDuration * 60 : matchDuration;

  const totalShots = totalRallies * avgRallyShots;
  const rallyFrequency = totalRallies / durationMinutes;
  const shotFrequency = totalShots / durationMinutes;
  const avgRallyDuration = (durationMinutes * 60) / totalRallies;
  const shotsPerMinute = totalShots / durationMinutes;

  const intensityScore = calculateBadmintonIntensityScore(
    avgRallyShots,
    rallyFrequency,
    smashCount,
    values.playStyle,
    values.playingFormat,
  );

  const totalAnalyzedShots = smashCount + netShots + clears;
  const smashPercentage = (smashCount / totalAnalyzedShots) * 100;
  const netPlayPercentage = (netShots / totalAnalyzedShots) * 100;
  const clearPercentage = (clears / totalAnalyzedShots) * 100;

  const workRate = calculateBadmintonWorkRate(
    shotsPerMinute,
    values.playingFormat,
  );
  const tacticalDiversity = calculateTacticalDiversity(
    smashPercentage,
    netPlayPercentage,
    clearPercentage,
  );
  const fatigueFactor = calculateBadmintonFatigueFactor(
    intensityScore,
    durationMinutes,
    rallyFrequency,
  );
  const performanceRating = calculateBadmintonPerformanceRating(
    intensityScore,
    tacticalDiversity,
    values.opponentLevel,
  );

  return {
    intensityScore,
    intensityScoreDisplay: intensityScore.toFixed(1),
    rallyFrequency,
    rallyFrequencyDisplay: rallyFrequency.toFixed(1),
    avgRallyDuration,
    avgRallyDurationDisplay: avgRallyDuration.toFixed(1),
    shotsPerMinute,
    shotsPerMinuteDisplay: shotsPerMinute.toFixed(1),
    workRate,
    workRateDisplay: workRate.toFixed(0),
    tacticalDiversity,
    tacticalDiversityDisplay: tacticalDiversity.toFixed(1),
    fatigueFactor,
    fatigueFactorDisplay: fatigueFactor.toFixed(0),
    performanceRating,
    smashPercentage,
    smashPercentageDisplay: smashPercentage.toFixed(1),
    netPlayPercentage,
    netPlayPercentageDisplay: netPlayPercentage.toFixed(1),
    clearPercentage,
    clearPercentageDisplay: clearPercentage.toFixed(1),
    insights: generateBadmintonInsights(
      intensityScore,
      avgRallyShots,
      smashPercentage,
      rallyFrequency,
      values.playStyle,
    ),
    recommendations: generateBadmintonRecommendations(
      intensityScore,
      fatigueFactor,
      tacticalDiversity,
      values.playingFormat,
      values.playStyle,
    ),
  };
}
