import {parseNumber} from './units';
import {rangeError} from './sportValidation';
import type {FieldErrors} from './validation';

export type SoccerPosition =
  | 'goalkeeper'
  | 'defender'
  | 'fullback'
  | 'midfielder'
  | 'winger'
  | 'forward';

export type SoccerDistanceUnit = 'km' | 'miles';

export type SoccerTemperatureUnit = 'celsius' | 'fahrenheit';

export type SoccerMatchLoadValues = {
  position: SoccerPosition | '';
  matchDuration: string;
  distance: string;
  distanceUnit: SoccerDistanceUnit;
  highIntensity: string;
  highIntensityUnit: SoccerDistanceUnit;
  sprints: string;
  rating: string;
  temperature: string;
  temperatureUnit: SoccerTemperatureUnit;
};

export type SoccerFatigueRisk = 'Low' | 'Medium' | 'High' | 'Very High';

export type SoccerMatchLoadResult = {
  totalLoad: number;
  totalLoadDisplay: string;
  distancePerMinute: number;
  distancePerMinuteDisplay: string;
  highIntensityPercentage: number;
  highIntensityPercentageDisplay: string;
  sprintFrequency: number;
  sprintFrequencyDisplay: string;
  efficiency: number;
  efficiencyDisplay: string;
  performanceScore: number;
  recoveryTime: string;
  fatigueRisk: SoccerFatigueRisk;
  comparison: {
    distanceVsAverage: number;
    distanceVsAverageDisplay: string;
    highIntensityVsAverage: number;
    highIntensityVsAverageDisplay: string;
    sprintsVsAverage: number;
    sprintsVsAverageDisplay: string;
  };
  insights: readonly string[];
  recommendations: readonly string[];
};

export const SOCCER_POSITIONS: readonly {
  value: SoccerPosition;
  label: string;
}[] = [
  {value: 'goalkeeper', label: 'Goalkeeper'},
  {value: 'defender', label: 'Defender'},
  {value: 'fullback', label: 'Fullback'},
  {value: 'midfielder', label: 'Midfielder'},
  {value: 'winger', label: 'Winger'},
  {value: 'forward', label: 'Forward/Striker'},
] as const;

export const SOCCER_DISTANCE_UNITS: readonly {
  value: SoccerDistanceUnit;
  label: string;
}[] = [
  {value: 'km', label: 'kilometers'},
  {value: 'miles', label: 'miles'},
] as const;

export const SOCCER_TEMPERATURE_UNITS: readonly {
  value: SoccerTemperatureUnit;
  label: string;
}[] = [
  {value: 'celsius', label: '°C'},
  {value: 'fahrenheit', label: '°F'},
] as const;

export const SOCCER_ERRORS = {
  position: 'Please select a playing position.',
  matchDuration: 'Please enter a valid number of minutes played.',
  distance: 'Please enter a valid distance covered.',
  highIntensity: 'Please enter a valid high-intensity distance.',
  sprints: 'Please enter a valid number of sprints.',
  rating: 'Please enter a valid match rating.',
  temperature: 'Please enter a valid temperature.',
} as const;

const KM_PER_MILE = 1.60934;
const REFERENCE_MINUTES = 90;
const AVERAGE_RATING = 7.5;

type PositionStandard = {
  avgDistance: number;
  avgHighIntensity: number;
  avgSprints: number;
};

const POSITION_STANDARDS: Record<SoccerPosition, PositionStandard> = {
  goalkeeper: {avgDistance: 4, avgHighIntensity: 0.3, avgSprints: 10},
  defender: {avgDistance: 10, avgHighIntensity: 0.6, avgSprints: 20},
  fullback: {avgDistance: 11, avgHighIntensity: 0.8, avgSprints: 30},
  midfielder: {avgDistance: 12, avgHighIntensity: 0.7, avgSprints: 25},
  winger: {avgDistance: 10.5, avgHighIntensity: 0.9, avgSprints: 35},
  forward: {avgDistance: 9, avgHighIntensity: 0.6, avgSprints: 22},
};

type PositionWeights = {
  distWeight: number;
  hiWeight: number;
  sprintWeight: number;
  ratingWeight: number;
};

const PERFORMANCE_WEIGHTS: Record<SoccerPosition, PositionWeights> = {
  goalkeeper: {distWeight: 0.3, hiWeight: 0.2, sprintWeight: 0.1, ratingWeight: 0.4},
  defender: {distWeight: 0.25, hiWeight: 0.25, sprintWeight: 0.2, ratingWeight: 0.3},
  fullback: {distWeight: 0.2, hiWeight: 0.3, sprintWeight: 0.3, ratingWeight: 0.2},
  midfielder: {distWeight: 0.3, hiWeight: 0.2, sprintWeight: 0.2, ratingWeight: 0.3},
  winger: {distWeight: 0.15, hiWeight: 0.35, sprintWeight: 0.3, ratingWeight: 0.2},
  forward: {distWeight: 0.2, hiWeight: 0.3, sprintWeight: 0.25, ratingWeight: 0.25},
};

const POSITION_RECOMMENDATIONS: Record<SoccerPosition, readonly string[]> = {
  goalkeeper: ['Practice explosive movements', 'Work on reaction time'],
  defender: [
    'Focus on positional awareness',
    'Improve recovery speed between sprints',
  ],
  fullback: [
    'Develop endurance for overlapping runs',
    'Work on crossing technique',
  ],
  midfielder: [
    'Improve stamina for 90-minute performance',
    'Focus on ball retention under pressure',
  ],
  winger: ['Develop explosive acceleration', 'Work on 1v1 situations'],
  forward: [
    'Improve finishing under fatigue',
    'Focus on movement off the ball',
  ],
};

export function validateSoccerMatchLoadValues(
  values: SoccerMatchLoadValues,
): FieldErrors<SoccerMatchLoadValues> {
  const errors: FieldErrors<SoccerMatchLoadValues> = {};

  if (!values.position) {
    errors.position = SOCCER_ERRORS.position;
  }

  const matchDuration = parseNumber(values.matchDuration);

  if (matchDuration === null) {
    errors.matchDuration = SOCCER_ERRORS.matchDuration;
  } else if (matchDuration < 1 || matchDuration > 120) {
    errors.matchDuration = rangeError('minutes played', 1, 120);
  }

  const distance = parseNumber(values.distance);

  if (distance === null) {
    errors.distance = SOCCER_ERRORS.distance;
  } else if (distance < 0 || distance > 20) {
    errors.distance = rangeError('distance covered', 0, 20);
  }

  const highIntensity = parseNumber(values.highIntensity);

  if (highIntensity === null) {
    errors.highIntensity = SOCCER_ERRORS.highIntensity;
  } else if (highIntensity < 0 || highIntensity > 5) {
    errors.highIntensity = rangeError('high-intensity distance', 0, 5);
  }

  const sprints = parseNumber(values.sprints);

  if (sprints === null) {
    errors.sprints = SOCCER_ERRORS.sprints;
  } else if (sprints < 0 || sprints > 100) {
    errors.sprints = rangeError('number of sprints', 0, 100);
  }

  const rating = parseNumber(values.rating);

  if (rating === null) {
    errors.rating = SOCCER_ERRORS.rating;
  } else if (rating < 1 || rating > 10) {
    errors.rating = rangeError('match rating', 1, 10);
  }

  const temperature = parseNumber(values.temperature);

  if (temperature === null) {
    errors.temperature = SOCCER_ERRORS.temperature;
  } else if (temperature < -10 || temperature > 45) {
    errors.temperature = rangeError('temperature', -10, 45);
  }

  return errors;
}

export function calculateTotalLoad(
  distance: number,
  highIntensity: number,
  sprints: number,
  duration: number,
  rating: number,
  temperature: number,
): number {
  let baseLoad = distance * 10 + highIntensity * 30 + sprints * 0.5;

  baseLoad *= REFERENCE_MINUTES / duration;
  baseLoad *= rating / AVERAGE_RATING;

  if (temperature > 25) {
    baseLoad *= 1.2;
  } else if (temperature < 5) {
    baseLoad *= 1.1;
  }

  return baseLoad;
}

export function calculateEfficiency(
  distance: number,
  highIntensity: number,
  sprints: number,
  rating: number,
): number {
  const output = rating * 10;
  const physicalOutput =
    distance * 5 + highIntensity * 20 + sprints * 0.3;

  return (output / physicalOutput) * 100;
}

export function calculatePerformanceScore(
  position: SoccerPosition,
  distance: number,
  highIntensity: number,
  sprints: number,
  rating: number,
): number {
  const weights = PERFORMANCE_WEIGHTS[position] ?? PERFORMANCE_WEIGHTS.midfielder;
  const norms = {dist: 11, hi: 0.7, sprint: 25, rating: 7.5};

  const distScore = Math.min(100, (distance / norms.dist) * 100);
  const hiScore = Math.min(100, (highIntensity / norms.hi) * 100);
  const sprintScore = Math.min(100, (sprints / norms.sprint) * 100);
  const ratingScore = (rating / 10) * 100;

  const score =
    distScore * weights.distWeight +
    hiScore * weights.hiWeight +
    sprintScore * weights.sprintWeight +
    ratingScore * weights.ratingWeight;

  return Math.min(100, score);
}

export function calculateRecoveryTime(totalLoad: number): string {
  if (totalLoad < 8) return '24-48 hours';
  if (totalLoad < 12) return '48-72 hours';
  if (totalLoad < 16) return '72-96 hours';

  return '96+ hours';
}

export function calculateFatigueRisk(
  load: number,
  duration: number,
  temperature: number,
): SoccerFatigueRisk {
  let risk: SoccerFatigueRisk = 'Low';

  if (load > 12 || duration > 90 || temperature > 28) risk = 'Medium';
  if (load > 16 || duration > 105 || temperature > 32) risk = 'High';
  if (load > 20 || duration > 115 || temperature > 35) risk = 'Very High';

  return risk;
}

export function generateSoccerInsights(
  position: SoccerPosition,
  load: number,
  score: number,
  efficiency: number,
  hiPercent: number,
  sprintFreq: number,
): string[] {
  const insights: string[] = [];

  if (load > 15) {
    insights.push('High match load detected - prioritize recovery');
  } else if (load < 6) {
    insights.push('Low match load - consider additional training');
  }

  if (score > 80) {
    insights.push(
      'Excellent performance relative to position standards',
    );
  } else if (score < 60) {
    insights.push('Room for improvement in key performance areas');
  }

  if (efficiency > 80) {
    insights.push('High efficiency - great performance optimization');
  } else if (efficiency < 60) {
    insights.push(
      'Consider technique improvements for better efficiency',
    );
  }

  if (hiPercent > 10) {
    insights.push('Excellent high-intensity work rate');
  } else if (hiPercent < 6) {
    insights.push('Focus on increasing high-intensity running');
  }

  if (sprintFreq > 25 && position === 'midfielder') {
    insights.push('Exceptional sprint frequency for midfield role');
  }

  return insights;
}

export function generateSoccerRecommendations(
  load: number,
  recovery: string,
  risk: SoccerFatigueRisk,
  position: SoccerPosition,
): string[] {
  const recommendations: string[] = [];

  if (recovery.includes('72+')) {
    recommendations.push(
      'Schedule adequate recovery time before next match',
    );
    recommendations.push(
      'Focus on hydration and nutrition for recovery',
    );
  }

  if (risk === 'High' || risk === 'Very High') {
    recommendations.push('Monitor for overtraining symptoms');
    recommendations.push('Consider lighter training sessions');
  }

  recommendations.push(...(POSITION_RECOMMENDATIONS[position] ?? []));

  return recommendations;
}

export function calculateSoccerMatchLoad(
  values: SoccerMatchLoadValues,
): SoccerMatchLoadResult {
  if (!values.position) {
    throw new Error(SOCCER_ERRORS.position);
  }

  const matchDuration = parseNumber(values.matchDuration);
  const distance = parseNumber(values.distance);
  const highIntensity = parseNumber(values.highIntensity);
  const sprints = parseNumber(values.sprints);
  const rating = parseNumber(values.rating);
  const temperature = parseNumber(values.temperature);

  if (matchDuration === null) {
    throw new Error(SOCCER_ERRORS.matchDuration);
  }

  if (distance === null) {
    throw new Error(SOCCER_ERRORS.distance);
  }

  if (highIntensity === null) {
    throw new Error(SOCCER_ERRORS.highIntensity);
  }

  if (sprints === null) {
    throw new Error(SOCCER_ERRORS.sprints);
  }

  if (rating === null) {
    throw new Error(SOCCER_ERRORS.rating);
  }

  if (temperature === null) {
    throw new Error(SOCCER_ERRORS.temperature);
  }

  const distanceKm =
    values.distanceUnit === 'miles' ? distance * KM_PER_MILE : distance;
  const highIntensityKm =
    values.highIntensityUnit === 'miles'
      ? highIntensity * KM_PER_MILE
      : highIntensity;
  const tempCelsius =
    values.temperatureUnit === 'fahrenheit'
      ? (temperature - 32) * (5 / 9)
      : temperature;

  const standards =
    POSITION_STANDARDS[values.position] ?? POSITION_STANDARDS.midfielder;

  const totalLoad = calculateTotalLoad(
    distanceKm,
    highIntensityKm,
    sprints,
    matchDuration,
    rating,
    tempCelsius,
  );
  const distancePerMinute = distanceKm / (matchDuration / REFERENCE_MINUTES);
  const highIntensityPercentage = (highIntensityKm / distanceKm) * 100;
  const sprintFrequency = sprints / (matchDuration / REFERENCE_MINUTES);
  const efficiency = calculateEfficiency(
    distanceKm,
    highIntensityKm,
    sprints,
    rating,
  );
  const performanceScore = calculatePerformanceScore(
    values.position,
    distanceKm,
    highIntensityKm,
    sprints,
    rating,
  );
  const recoveryTime = calculateRecoveryTime(totalLoad);
  const fatigueRisk = calculateFatigueRisk(
    totalLoad,
    matchDuration,
    tempCelsius,
  );

  return {
    totalLoad,
    totalLoadDisplay: totalLoad.toFixed(1),
    distancePerMinute,
    distancePerMinuteDisplay: distancePerMinute.toFixed(2),
    highIntensityPercentage,
    highIntensityPercentageDisplay: highIntensityPercentage.toFixed(1),
    sprintFrequency,
    sprintFrequencyDisplay: sprintFrequency.toFixed(1),
    efficiency,
    efficiencyDisplay: efficiency.toFixed(1),
    performanceScore,
    recoveryTime,
    fatigueRisk,
    comparison: {
      distanceVsAverage: (distanceKm / standards.avgDistance) * 100,
      distanceVsAverageDisplay: (
        (distanceKm / standards.avgDistance) *
        100
      ).toFixed(0),
      highIntensityVsAverage:
        (highIntensityKm / standards.avgHighIntensity) * 100,
      highIntensityVsAverageDisplay: (
        (highIntensityKm / standards.avgHighIntensity) *
        100
      ).toFixed(0),
      sprintsVsAverage: (sprints / standards.avgSprints) * 100,
      sprintsVsAverageDisplay: (
        (sprints / standards.avgSprints) *
        100
      ).toFixed(0),
    },
    insights: generateSoccerInsights(
      values.position,
      totalLoad,
      performanceScore,
      efficiency,
      highIntensityPercentage,
      sprintFrequency,
    ),
    recommendations: generateSoccerRecommendations(
      totalLoad,
      recoveryTime,
      fatigueRisk,
      values.position,
    ),
  };
}
