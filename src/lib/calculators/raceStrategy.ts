import {parseNumber} from './units';
import {rangeError} from './sportValidation';
import type {FieldErrors} from './validation';

export type RaceType =
  | '5k'
  | '10k'
  | 'half-marathon'
  | 'marathon'
  | '50k'
  | '100k'
  | 'sprint-triathlon'
  | 'olympic-triathlon'
  | '703-triathlon'
  | '1406-triathlon'
  | 'cycling-40k'
  | 'cycling-100k'
  | 'swimming-1500';

export type RaceExperience =
  | 'beginner'
  | 'novice'
  | 'intermediate'
  | 'advanced'
  | 'elite';

export type RaceGoal =
  | 'finish'
  | 'pr'
  | 'age-group'
  | 'overall'
  | 'qualify';

export type PaceStrategy =
  | 'negative-split'
  | 'even-pace'
  | 'positive-split'
  | 'conservative-start'
  | 'aggressive-start';

export type RaceWeightUnit = 'kg' | 'lbs';

export type RaceTemperatureUnit = 'celsius' | 'fahrenheit';

export type RaceStrategyValues = {
  raceType: RaceType | '';
  hours: string;
  minutes: string;
  seconds: string;
  experienceLevel: RaceExperience | '';
  goalType: RaceGoal | '';
  paceStrategy: PaceStrategy | '';
  bodyWeight: string;
  weightUnit: RaceWeightUnit;
  temperature: string;
  temperatureUnit: RaceTemperatureUnit;
  humidity: string;
};

export type RaceDetails = {
  name: string;
  distance: number;
  unit: string;
  duration: number;
  discipline: 'running' | 'triathlon' | 'cycling' | 'swimming';
};

export type RaceSplit = {
  name: string;
  time: number;
  percentage: number;
};

export type RaceFuelingItem = {
  time: number;
  amount: number;
  description: string;
};

export type RaceFuelingStrategy = {
  fluids: readonly RaceFuelingItem[];
  calories: readonly RaceFuelingItem[];
  electrolytes: readonly RaceFuelingItem[];
};

export type RaceEnvironmentalAdjustments = {
  temperature: number;
  humidity: number;
  paceAdjustment: number;
  fluidAdjustment: number;
  riskLevel: 'Low' | 'Medium' | 'High';
};

export type RacePace = string | {
  swim: string;
  bike: string;
  run: string;
  overall: string;
};

export type RaceStrategyResult = {
  raceType: string;
  targetTime: string;
  targetPace: RacePace;
  targetPaceDisplay: string;
  splitStrategy: readonly RaceSplit[];
  fuelingStrategy: RaceFuelingStrategy;
  environmentalAdjustments: RaceEnvironmentalAdjustments;
  recommendations: readonly string[];
  insights: readonly string[];
};

export const RACE_TYPES: readonly {value: RaceType; label: string}[] = [
  {value: '5k', label: '5K Run'},
  {value: '10k', label: '10K Run'},
  {value: 'half-marathon', label: 'Half Marathon (21.1K)'},
  {value: 'marathon', label: 'Marathon (42.2K)'},
  {value: '50k', label: '50K Ultra'},
  {value: '100k', label: '100K Ultra'},
  {value: 'sprint-triathlon', label: 'Sprint Triathlon'},
  {value: 'olympic-triathlon', label: 'Olympic Triathlon'},
  {value: '703-triathlon', label: '70.3 Triathlon'},
  {value: '1406-triathlon', label: '140.6 Triathlon'},
  {value: 'cycling-40k', label: '40K Cycling TT'},
  {value: 'cycling-100k', label: '100K Cycling Race'},
  {value: 'swimming-1500', label: '1500m Swimming'},
] as const;

export const RACE_EXPERIENCE_LEVELS: readonly {
  value: RaceExperience;
  label: string;
}[] = [
  {value: 'beginner', label: 'Beginner (First timer)'},
  {value: 'novice', label: 'Novice (1-3 races)'},
  {value: 'intermediate', label: 'Intermediate (3-10 races)'},
  {value: 'advanced', label: 'Advanced (10+ races)'},
  {value: 'elite', label: 'Elite/Competitive'},
] as const;

export const RACE_GOALS: readonly {value: RaceGoal; label: string}[] = [
  {value: 'finish', label: 'Just Finish'},
  {value: 'pr', label: 'Personal Record (PR)'},
  {value: 'age-group', label: 'Age Group Podium'},
  {value: 'overall', label: 'Overall Podium'},
  {value: 'qualify', label: 'Qualification (Boston/Kona/etc)'},
] as const;

export const PACE_STRATEGIES: readonly {value: PaceStrategy; label: string}[] = [
  {value: 'negative-split', label: 'Negative Split (Faster second half)'},
  {value: 'even-pace', label: 'Even Pace (Consistent throughout)'},
  {value: 'positive-split', label: 'Positive Split (Faster first half)'},
  {value: 'conservative-start', label: 'Conservative Start, Strong Finish'},
  {value: 'aggressive-start', label: 'Aggressive Start, Hold On'},
] as const;

export const RACE_WEIGHT_UNITS: readonly {
  value: RaceWeightUnit;
  label: string;
}[] = [
  {value: 'kg', label: 'kg'},
  {value: 'lbs', label: 'lbs'},
] as const;

export const RACE_TEMPERATURE_UNITS: readonly {
  value: RaceTemperatureUnit;
  label: string;
}[] = [
  {value: 'celsius', label: '°C'},
  {value: 'fahrenheit', label: '°F'},
] as const;

export const RACE_STRATEGY_ERRORS = {
  raceType: 'Please select a race type.',
  targetTime: 'Please enter a valid target finish time.',
  experienceLevel: 'Please select an experience level.',
  goalType: 'Please select a race goal.',
  paceStrategy: 'Please select a pacing strategy.',
  bodyWeight: 'Please enter a valid body weight.',
  temperature: 'Please enter a valid temperature.',
  humidity: 'Please enter a valid humidity.',
} as const;

const LB_PER_KG = 2.20462;

const RACE_DETAILS: Record<RaceType, RaceDetails> = {
  '5k': {name: '5K Run', distance: 5, unit: 'km', duration: 25, discipline: 'running'},
  '10k': {name: '10K Run', distance: 10, unit: 'km', duration: 50, discipline: 'running'},
  'half-marathon': {name: 'Half Marathon', distance: 21.1, unit: 'km', duration: 110, discipline: 'running'},
  marathon: {name: 'Marathon', distance: 42.2, unit: 'km', duration: 240, discipline: 'running'},
  '50k': {name: '50K Ultra', distance: 50, unit: 'km', duration: 300, discipline: 'running'},
  '100k': {name: '100K Ultra', distance: 100, unit: 'km', duration: 600, discipline: 'running'},
  'sprint-triathlon': {name: 'Sprint Triathlon', distance: 750, unit: 'swim', duration: 90, discipline: 'triathlon'},
  'olympic-triathlon': {name: 'Olympic Triathlon', distance: 1500, unit: 'swim', duration: 150, discipline: 'triathlon'},
  '703-triathlon': {name: '70.3 Triathlon', distance: 1900, unit: 'swim', duration: 330, discipline: 'triathlon'},
  '1406-triathlon': {name: '140.6 Triathlon', distance: 3800, unit: 'swim', duration: 720, discipline: 'triathlon'},
  'cycling-40k': {name: '40K Cycling TT', distance: 40, unit: 'km', duration: 60, discipline: 'cycling'},
  'cycling-100k': {name: '100K Cycling Race', distance: 100, unit: 'km', duration: 150, discipline: 'cycling'},
  'swimming-1500': {name: '1500m Swimming', distance: 1500, unit: 'm', duration: 25, discipline: 'swimming'},
};

export function getRaceDetails(raceType: RaceType): RaceDetails {
  return RACE_DETAILS[raceType] ?? RACE_DETAILS['10k'];
}

export function formatRacePace(
  secondsPerUnit: number,
  type: string,
): string {
  const minutes = Math.floor(secondsPerUnit / 60);
  const seconds = Math.round(secondsPerUnit % 60);

  if (type === 'swim') {
    return `${minutes}:${seconds.toString().padStart(2, '0')}/100m`;
  }

  if (type === 'bike') {
    return `${(3600 / secondsPerUnit).toFixed(1)} km/h`;
  }

  return `${minutes}:${seconds.toString().padStart(2, '0')}/km`;
}

export function formatRaceTime(seconds: number): string {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = Math.round(seconds % 60);

  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, '0')}:${secs
      .toString()
      .padStart(2, '0')}`;
  }

  return `${minutes}:${secs.toString().padStart(2, '0')}`;
}

export function calculateTargetPace(
  distance: number,
  timeSeconds: number,
  raceType: RaceType,
): RacePace {
  if (raceType.includes('triathlon')) {
    return {
      swim: formatRacePace((timeSeconds * 0.2) / distance, 'swim'),
      bike: formatRacePace((timeSeconds * 0.5) / distance, 'bike'),
      run: formatRacePace((timeSeconds * 0.3) / distance, 'run'),
      overall: formatRacePace(timeSeconds / distance, 'overall'),
    };
  }

  return formatRacePace(timeSeconds / distance, raceType);
}

export function calculateSplitStrategy(
  targetTime: number,
  strategy: PaceStrategy,
): RaceSplit[] {
  const halfTime = targetTime / 2;
  const splits: RaceSplit[] = [];

  const push = (name: string, time: number, percentage: number): void => {
    splits.push({name, time: Math.round(time), percentage});
  };

  switch (strategy) {
    case 'negative-split':
      push('First Half', halfTime * 0.48, 48);
      push('Second Half', halfTime * 0.52, 52);
      break;
    case 'even-pace':
      push('First Half', halfTime, 50);
      push('Second Half', halfTime, 50);
      break;
    case 'positive-split':
      push('First Half', halfTime * 0.52, 52);
      push('Second Half', halfTime * 0.48, 48);
      break;
    case 'conservative-start':
      push('First 25%', targetTime * 0.26, 26);
      push('Middle 50%', targetTime * 0.48, 48);
      push('Final 25%', targetTime * 0.26, 26);
      break;
    case 'aggressive-start':
      push('First 25%', targetTime * 0.24, 24);
      push('Middle 50%', targetTime * 0.5, 50);
      push('Final 25%', targetTime * 0.26, 26);
      break;
    default:
      push('Even Split', halfTime, 50);
      push('Even Split', halfTime, 50);
      break;
  }

  return splits;
}

export function calculateFuelingStrategy(
  raceDetails: RaceDetails,
  duration: number,
  weight: number,
  temp: number,
  humidity: number,
): RaceFuelingStrategy {
  const fluids: RaceFuelingItem[] = [];
  const calories: RaceFuelingItem[] = [];
  const electrolytes: RaceFuelingItem[] = [];

  let baseFluid = 500;

  if (temp > 20) baseFluid += (temp - 20) * 50;
  if (humidity > 70) baseFluid += 100;
  if (raceDetails.discipline === 'running') baseFluid += 100;

  let baseCalories = weight * 8;

  if (duration > 120) baseCalories = Math.min(baseCalories, 300);
  if (duration > 240) baseCalories = Math.min(baseCalories, 250);

  const sodium = Math.max(300, weight * 5);
  const intervals = Math.ceil(duration / 30);

  for (let i = 0; i < intervals; i++) {
    const time = i * 30;
    const fluidAmount = Math.round(baseFluid * 0.5);
    const calorieAmount = Math.round(baseCalories * 0.5);
    const sodiumAmount = Math.round(sodium * 0.5);

    fluids.push({
      time,
      amount: fluidAmount,
      description: `${fluidAmount}ml fluid`,
    });

    if (duration > 90) {
      calories.push({
        time,
        amount: calorieAmount,
        description: `${calorieAmount} calories`,
      });
    }

    if (duration > 60) {
      electrolytes.push({
        time,
        amount: sodiumAmount,
        description: `${sodiumAmount}mg sodium`,
      });
    }
  }

  return {fluids, calories, electrolytes};
}

export function calculateEnvironmentalAdjustments(
  temp: number,
  humidity: number,
  raceType: RaceType,
): RaceEnvironmentalAdjustments {
  const adjustments: RaceEnvironmentalAdjustments = {
    temperature: temp,
    humidity,
    paceAdjustment: 0,
    fluidAdjustment: 0,
    riskLevel: 'Low',
  };

  if (temp > 27 && humidity > 40) {
    adjustments.riskLevel = 'High';
    adjustments.paceAdjustment = -15;
    adjustments.fluidAdjustment = 25;
  } else if (temp > 20) {
    adjustments.riskLevel = 'Medium';
    adjustments.paceAdjustment = -8;
    adjustments.fluidAdjustment = 15;
  }

  if (raceType.includes('cycling')) {
    adjustments.paceAdjustment *= 1.2;
  } else if (raceType.includes('running')) {
    adjustments.fluidAdjustment *= 1.3;
  }

  return adjustments;
}

export function generateRaceRecommendations(
  experience: RaceExperience,
  goal: RaceGoal,
  strategy: PaceStrategy,
  race: RaceDetails,
  duration: number,
): string[] {
  const recommendations: string[] = [];

  if (experience === 'beginner') {
    recommendations.push('Focus on finishing rather than time goals');
    recommendations.push('Start conservatively and maintain steady effort');
  } else if (experience === 'elite') {
    recommendations.push('Push negative split strategy for optimal performance');
    recommendations.push('Practice race pace efforts in training');
  }

  if (goal === 'pr' || goal.includes('podium')) {
    recommendations.push('Stick to calculated paces religiously');
    recommendations.push('Practice race day nutrition exactly as planned');
  }

  if (duration > 180) {
    recommendations.push('Test all fueling products during long training');
    recommendations.push('Have backup nutrition plan for race day');
  }

  if (strategy === 'negative-split') {
    recommendations.push(
      'Resist temptation to start fast - hold back 5-10%',
    );
    recommendations.push('Build gradually through middle section');
  }

  return recommendations;
}

export function generateRaceInsights(
  strategy: PaceStrategy,
  fueling: RaceFuelingStrategy,
  environmental: RaceEnvironmentalAdjustments,
  experience: RaceExperience,
): string[] {
  const insights: string[] = [];

  if (strategy === 'negative-split') {
    insights.push(
      'Negative splits show 2-5% better finishing times on average',
    );
  }

  if (environmental.riskLevel === 'High') {
    insights.push(
      'High heat/humidity expected - prioritize hydration over pace',
    );
  }

  if (fueling.calories.length > 0) {
    insights.push('Event duration requires planned fueling strategy');
  }

  if (experience === 'beginner') {
    insights.push(
      'Your first race - experience is more valuable than time',
    );
  }

  return insights;
}

export function validateRaceStrategyValues(
  values: RaceStrategyValues,
): FieldErrors<RaceStrategyValues> {
  const errors: FieldErrors<RaceStrategyValues> = {};

  if (!values.raceType) {
    errors.raceType = RACE_STRATEGY_ERRORS.raceType;
  }

  const hours = parseNumber(values.hours) ?? 0;
  const minutes = parseNumber(values.minutes) ?? 0;
  const seconds = parseNumber(values.seconds) ?? 0;

  if (hours * 3600 + minutes * 60 + seconds <= 0) {
    errors.hours = RACE_STRATEGY_ERRORS.targetTime;
  } else if (hours < 0 || hours > 24) {
    errors.hours = rangeError('target time hours', 0, 24);
  }

  if (!values.experienceLevel) {
    errors.experienceLevel = RACE_STRATEGY_ERRORS.experienceLevel;
  }

  if (!values.goalType) {
    errors.goalType = RACE_STRATEGY_ERRORS.goalType;
  }

  if (!values.paceStrategy) {
    errors.paceStrategy = RACE_STRATEGY_ERRORS.paceStrategy;
  }

  const bodyWeight = parseNumber(values.bodyWeight);

  if (bodyWeight === null) {
    errors.bodyWeight = RACE_STRATEGY_ERRORS.bodyWeight;
  } else if (bodyWeight < 30 || bodyWeight > 200) {
    errors.bodyWeight = rangeError('body weight', 30, 200);
  }

  const temperature = parseNumber(values.temperature);

  if (temperature === null) {
    errors.temperature = RACE_STRATEGY_ERRORS.temperature;
  } else if (temperature < -10 || temperature > 45) {
    errors.temperature = rangeError('temperature', -10, 45);
  }

  const humidity = parseNumber(values.humidity);

  if (humidity === null) {
    errors.humidity = RACE_STRATEGY_ERRORS.humidity;
  } else if (humidity < 0 || humidity > 100) {
    errors.humidity = rangeError('humidity', 0, 100);
  }

  return errors;
}

export function calculateRaceStrategy(
  values: RaceStrategyValues,
): RaceStrategyResult {
  if (!values.raceType) {
    throw new Error(RACE_STRATEGY_ERRORS.raceType);
  }

  const hours = parseNumber(values.hours) ?? 0;
  const minutes = parseNumber(values.minutes) ?? 0;
  const seconds = parseNumber(values.seconds) ?? 0;

  if (hours * 3600 + minutes * 60 + seconds <= 0) {
    throw new Error(RACE_STRATEGY_ERRORS.targetTime);
  }

  if (!values.experienceLevel) {
    throw new Error(RACE_STRATEGY_ERRORS.experienceLevel);
  }

  if (!values.goalType) {
    throw new Error(RACE_STRATEGY_ERRORS.goalType);
  }

  if (!values.paceStrategy) {
    throw new Error(RACE_STRATEGY_ERRORS.paceStrategy);
  }

  const bodyWeight = parseNumber(values.bodyWeight);
  const temperature = parseNumber(values.temperature);
  const humidity = parseNumber(values.humidity);

  if (bodyWeight === null) {
    throw new Error(RACE_STRATEGY_ERRORS.bodyWeight);
  }

  if (temperature === null) {
    throw new Error(RACE_STRATEGY_ERRORS.temperature);
  }

  if (humidity === null) {
    throw new Error(RACE_STRATEGY_ERRORS.humidity);
  }

  const targetTimeSeconds = hours * 3600 + minutes * 60 + seconds;
  const bodyWeightKg =
    values.weightUnit === 'lbs' ? bodyWeight / LB_PER_KG : bodyWeight;
  const tempCelsius =
    values.temperatureUnit === 'fahrenheit'
      ? (temperature - 32) * (5 / 9)
      : temperature;

  const raceDetails = getRaceDetails(values.raceType);
  const targetTimeMinutes = targetTimeSeconds / 60;
  const targetPace = calculateTargetPace(
    raceDetails.distance,
    targetTimeSeconds,
    values.raceType,
  );
  const splitStrategy = calculateSplitStrategy(
    targetTimeSeconds,
    values.paceStrategy,
  );
  const fuelingStrategy = calculateFuelingStrategy(
    raceDetails,
    targetTimeMinutes,
    bodyWeightKg,
    tempCelsius,
    humidity,
  );
  const environmentalAdjustments = calculateEnvironmentalAdjustments(
    tempCelsius,
    humidity,
    values.raceType,
  );

  return {
    raceType: raceDetails.name,
    targetTime: formatRaceTime(targetTimeSeconds),
    targetPace,
    targetPaceDisplay:
      typeof targetPace === 'object'
        ? Object.values(targetPace).join(' | ')
        : targetPace,
    splitStrategy,
    fuelingStrategy,
    environmentalAdjustments,
    recommendations: generateRaceRecommendations(
      values.experienceLevel,
      values.goalType,
      values.paceStrategy,
      raceDetails,
      targetTimeMinutes,
    ),
    insights: generateRaceInsights(
      values.paceStrategy,
      fuelingStrategy,
      environmentalAdjustments,
      values.experienceLevel,
    ),
  };
}
