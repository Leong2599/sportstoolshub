import {parseNumber} from './units';
import {rangeError} from './sportValidation';
import type {FieldErrors} from './validation';

export type TrainingLoadSport =
  | 'running'
  | 'cycling'
  | 'swimming'
  | 'triathlon'
  | 'rowing'
  | 'other';

export type TrainingGoal =
  | 'base-building'
  | 'build-phase'
  | 'peak-phase'
  | 'taper'
  | 'recovery'
  | 'maintain';

export type TrainingExperience = 'beginner' | 'intermediate' | 'advanced' | 'elite';

export type UpcomingEvent =
  | 'none'
  | '5k-10k'
  | 'half-marathon'
  | 'marathon'
  | 'triathlon-sprint'
  | 'triathlon-olympic'
  | 'triathlon-703'
  | 'triathlon-1406';

export type TrainingLoadValues = {
  sport: TrainingLoadSport | '';
  currentCtl: string;
  currentAtl: string;
  todayTss: string;
  trainingGoal: TrainingGoal | '';
  experienceLevel: TrainingExperience | '';
  upcomingEvent: UpcomingEvent | '';
};

export type LoadProjection = {
  day: number;
  ctl: string;
  atl: string;
  tsb: string;
};

export type OptimalLoadRanges = {
  ctl: readonly [number, number];
  atl: readonly [number, number];
  tsb: readonly [number, number];
};

export type TrainingLoadResult = {
  currentCtl: string;
  currentAtl: string;
  currentTsb: string;
  newCtl: string;
  newAtl: string;
  newTsb: string;
  todayTss: number;
  fitnessChange: string;
  fatigueChange: string;
  formChange: string;
  tsbStatus: string;
  projections: readonly LoadProjection[];
  optimalRanges: OptimalLoadRanges;
  recommendations: readonly string[];
  insights: readonly string[];
};

export const TRAINING_LOAD_SPORTS: readonly {
  value: TrainingLoadSport;
  label: string;
}[] = [
  {value: 'running', label: 'Running'},
  {value: 'cycling', label: 'Cycling'},
  {value: 'swimming', label: 'Swimming'},
  {value: 'triathlon', label: 'Triathlon'},
  {value: 'rowing', label: 'Rowing'},
  {value: 'other', label: 'Other'},
] as const;

export const TRAINING_GOALS: readonly {value: TrainingGoal; label: string}[] = [
  {value: 'base-building', label: 'Base Building'},
  {value: 'build-phase', label: 'Build Phase'},
  {value: 'peak-phase', label: 'Peak Phase'},
  {value: 'taper', label: 'Taper Phase'},
  {value: 'recovery', label: 'Recovery Week'},
  {value: 'maintain', label: 'Maintenance'},
] as const;

export const TRAINING_EXPERIENCE_LEVELS: readonly {
  value: TrainingExperience;
  label: string;
}[] = [
  {value: 'beginner', label: 'Beginner (<2 years)'},
  {value: 'intermediate', label: 'Intermediate (2-5 years)'},
  {value: 'advanced', label: 'Advanced (5-10 years)'},
  {value: 'elite', label: 'Elite (>10 years)'},
] as const;

export const UPCOMING_EVENTS: readonly {
  value: UpcomingEvent;
  label: string;
}[] = [
  {value: 'none', label: 'No upcoming event'},
  {value: '5k-10k', label: '5K/10K (1-2 weeks)'},
  {value: 'half-marathon', label: 'Half Marathon (2-4 weeks)'},
  {value: 'marathon', label: 'Marathon (4-6 weeks)'},
  {value: 'triathlon-sprint', label: 'Sprint Triathlon (2-3 weeks)'},
  {value: 'triathlon-olympic', label: 'Olympic Triathlon (3-4 weeks)'},
  {value: 'triathlon-703', label: '70.3 Triathlon (4-6 weeks)'},
  {value: 'triathlon-1406', label: '140.6 Triathlon (6-8 weeks)'},
] as const;

export const TRAINING_LOAD_ERRORS = {
  sport: 'Please select a sport.',
  currentCtl: 'Please enter a valid current CTL.',
  currentAtl: 'Please enter a valid current ATL.',
  todayTss: 'Please enter a valid training stress score.',
  trainingGoal: 'Please select a training goal.',
  experienceLevel: 'Please select an experience level.',
  upcomingEvent: 'Please select an upcoming event.',
} as const;

const BASE_TSS: Record<TrainingExperience, number> = {
  beginner: 40,
  intermediate: 60,
  advanced: 80,
  elite: 100,
};

const GOAL_MULTIPLIERS: Record<TrainingGoal, number> = {
  'base-building': 0.8,
  'build-phase': 1.2,
  'peak-phase': 1.4,
  taper: 0.5,
  recovery: 0.3,
  maintain: 0.9,
};

const OPTIMAL_RANGES: Record<
  TrainingExperience,
  {ctl: [number, number]; atl: [number, number]; tsb: [number, number]}
> = {
  beginner: {ctl: [20, 40], atl: [30, 50], tsb: [5, 25]},
  intermediate: {ctl: [40, 70], atl: [40, 70], tsb: [0, 20]},
  advanced: {ctl: [70, 100], atl: [60, 90], tsb: [-10, 15]},
  elite: {ctl: [100, 150], atl: [80, 120], tsb: [-20, 10]},
};

const EVENT_TARGET_TSB: Record<UpcomingEvent, number> = {
  none: 10,
  '5k-10k': 15,
  'half-marathon': 20,
  marathon: 25,
  'triathlon-sprint': 12,
  'triathlon-olympic': 18,
  'triathlon-703': 22,
  'triathlon-1406': 25,
};

export function validateTrainingLoadValues(
  values: TrainingLoadValues,
): FieldErrors<TrainingLoadValues> {
  const errors: FieldErrors<TrainingLoadValues> = {};

  if (!values.sport) {
    errors.sport = TRAINING_LOAD_ERRORS.sport;
  }

  const ctl = parseNumber(values.currentCtl);

  if (ctl === null) {
    errors.currentCtl = TRAINING_LOAD_ERRORS.currentCtl;
  } else if (ctl < 0 || ctl > 200) {
    errors.currentCtl = rangeError('current CTL', 0, 200);
  }

  const atl = parseNumber(values.currentAtl);

  if (atl === null) {
    errors.currentAtl = TRAINING_LOAD_ERRORS.currentAtl;
  } else if (atl < 0 || atl > 200) {
    errors.currentAtl = rangeError('current ATL', 0, 200);
  }

  const tss = parseNumber(values.todayTss);

  if (tss === null) {
    errors.todayTss = TRAINING_LOAD_ERRORS.todayTss;
  } else if (tss < 0 || tss > 500) {
    errors.todayTss = rangeError('training stress score', 0, 500);
  }

  if (!values.trainingGoal) {
    errors.trainingGoal = TRAINING_LOAD_ERRORS.trainingGoal;
  }

  if (!values.experienceLevel) {
    errors.experienceLevel = TRAINING_LOAD_ERRORS.experienceLevel;
  }

  if (!values.upcomingEvent) {
    errors.upcomingEvent = TRAINING_LOAD_ERRORS.upcomingEvent;
  }

  return errors;
}

export function calculateCtl(currentCtl: number, todayTss: number): number {
  return currentCtl * (41 / 42) + todayTss * (1 / 42);
}

export function calculateAtl(currentAtl: number, todayTss: number): number {
  return currentAtl * (6 / 7) + todayTss * (1 / 7);
}

export function calculateTsb(ctl: number, atl: number): number {
  return ctl - atl;
}

export function getTargetTss(
  goal: TrainingGoal,
  experience: TrainingExperience,
): number {
  return (
    (BASE_TSS[experience] || 60) * (GOAL_MULTIPLIERS[goal] || 1.0)
  );
}

export function getOptimalRanges(
  experience: TrainingExperience,
): OptimalLoadRanges {
  return OPTIMAL_RANGES[experience] ?? OPTIMAL_RANGES.intermediate;
}

export function calculateFutureProjections(
  ctl: number,
  atl: number,
  goal: TrainingGoal,
  experience: TrainingExperience,
): LoadProjection[] {
  const projections: LoadProjection[] = [];
  let projCtl = ctl;
  let projAtl = atl;
  const targetTss = getTargetTss(goal, experience);

  for (let day = 1; day <= 14; day++) {
    if (day <= 7) {
      projAtl = projAtl * (6 / 7) + targetTss * (1 / 7);
    } else {
      projAtl = projAtl * (6 / 7) + targetTss * 0.8 * (1 / 7);
    }

    projCtl = projCtl * (41 / 42) + targetTss * (1 / 42);

    projections.push({
      day,
      ctl: projCtl.toFixed(1),
      atl: projAtl.toFixed(1),
      tsb: (projCtl - projAtl).toFixed(1),
    });
  }

  return projections;
}

export function getTsbStatus(tsb: number): string {
  if (tsb > 15) return 'Peak Form';
  if (tsb > 5) return 'Fresh';
  if (tsb > -5) return 'Balanced';
  if (tsb > -15) return 'Fatigued';

  return 'Over-trained';
}

export function getEventTargetTsb(event: UpcomingEvent): number {
  return EVENT_TARGET_TSB[event] ?? 10;
}

export function generateTrainingLoadInsights(
  currentCtl: number,
  newCtl: number,
  currentAtl: number,
  newAtl: number,
  goal: TrainingGoal,
): string[] {
  const insights: string[] = [];
  const currentTsb = currentCtl - currentAtl;
  const newTsb = newCtl - newAtl;

  if (Math.abs(newCtl - currentCtl) > 5) {
    insights.push(
      'Significant fitness change detected - good progress if positive',
    );
  }

  if (newAtl > currentAtl * 1.2) {
    insights.push(
      'Fatigue increasing rapidly - watch for overtraining signs',
    );
  }

  if (newTsb < -30 && goal !== 'peak-phase') {
    insights.push('High fatigue level - consider recovery day soon');
  }

  if (newTsb > 20 && goal === 'peak-phase') {
    insights.push('Excellent form for peak performance');
  }

  if (currentCtl < 30 && newCtl > 35) {
    insights.push('Building good base fitness - continue consistent training');
  }

  return insights;
}

export function generateTrainingLoadRecommendations(
  ctl: number,
  atl: number,
  tsb: number,
  goal: TrainingGoal,
  experience: TrainingExperience,
  event: UpcomingEvent,
): string[] {
  const recommendations: string[] = [];
  const ranges = getOptimalRanges(experience);

  if (ctl < ranges.ctl[0]) {
    recommendations.push(
      'Increase training volume to build fitness base',
    );
  } else if (ctl > ranges.ctl[1]) {
    recommendations.push(
      'Excellent fitness level - focus on quality over quantity',
    );
  }

  if (atl < ranges.atl[0]) {
    recommendations.push(
      'Add more intensity or volume to increase training load',
    );
  } else if (atl > ranges.atl[1]) {
    recommendations.push(
      'High fatigue detected - schedule recovery soon',
    );
  }

  if (tsb < ranges.tsb[0]) {
    if (goal === 'recovery' || goal === 'taper') {
      recommendations.push('Perfect! Resting as planned for recovery');
    } else {
      recommendations.push(
        'High fatigue - consider reducing intensity or adding rest',
      );
    }
  } else if (tsb > ranges.tsb[1]) {
    if (goal === 'base-building' || goal === 'build-phase') {
      recommendations.push(
        'Good freshness - can handle more training load',
      );
    } else {
      recommendations.push(
        'Excellent form - ready for high-quality workouts',
      );
    }
  }

  if (event !== 'none') {
    const eventTsb = getEventTargetTsb(event);

    if (tsb < eventTsb - 10) {
      recommendations.push(
        `Need to reduce training load to reach target TSB of ${eventTsb} for event`,
      );
    }
  }

  return recommendations;
}

export function calculateTrainingLoad(
  values: TrainingLoadValues,
): TrainingLoadResult {
  if (!values.sport) {
    throw new Error(TRAINING_LOAD_ERRORS.sport);
  }

  const currentCtl = parseNumber(values.currentCtl);
  const currentAtl = parseNumber(values.currentAtl);
  const todayTss = parseNumber(values.todayTss);

  if (currentCtl === null) {
    throw new Error(TRAINING_LOAD_ERRORS.currentCtl);
  }

  if (currentAtl === null) {
    throw new Error(TRAINING_LOAD_ERRORS.currentAtl);
  }

  if (todayTss === null) {
    throw new Error(TRAINING_LOAD_ERRORS.todayTss);
  }

  if (!values.trainingGoal) {
    throw new Error(TRAINING_LOAD_ERRORS.trainingGoal);
  }

  if (!values.experienceLevel) {
    throw new Error(TRAINING_LOAD_ERRORS.experienceLevel);
  }

  if (!values.upcomingEvent) {
    throw new Error(TRAINING_LOAD_ERRORS.upcomingEvent);
  }

  const newAtl = calculateAtl(currentAtl, todayTss);
  const newCtl = calculateCtl(currentCtl, todayTss);
  const newTsb = calculateTsb(newCtl, newAtl);
  const currentTsb = calculateTsb(currentCtl, currentAtl);

  return {
    currentCtl: currentCtl.toFixed(1),
    currentAtl: currentAtl.toFixed(1),
    currentTsb: currentTsb.toFixed(1),
    newCtl: newCtl.toFixed(1),
    newAtl: newAtl.toFixed(1),
    newTsb: newTsb.toFixed(1),
    todayTss,
    fitnessChange: (((newCtl - currentCtl) / currentCtl) * 100).toFixed(1),
    fatigueChange: (((newAtl - currentAtl) / currentAtl) * 100).toFixed(1),
    formChange:
      (((newTsb - currentTsb) / Math.abs(currentTsb + 1)) * 100).toFixed(1),
    tsbStatus: getTsbStatus(newTsb),
    projections: calculateFutureProjections(
      newCtl,
      newAtl,
      values.trainingGoal,
      values.experienceLevel,
    ),
    optimalRanges: getOptimalRanges(values.experienceLevel),
    recommendations: generateTrainingLoadRecommendations(
      newCtl,
      newAtl,
      newTsb,
      values.trainingGoal,
      values.experienceLevel,
      values.upcomingEvent,
    ),
    insights: generateTrainingLoadInsights(
      currentCtl,
      newCtl,
      currentAtl,
      newAtl,
      values.trainingGoal,
    ),
  };
}
