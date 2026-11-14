import {parseNumber} from './units';
import {
  mifflinStJeorBmr,
  NUTRITION_ACTIVITY_FACTORS,
  type NutritionActivityLevel,
  type NutritionGender,
} from './nutritionMetrics';
import type {FieldErrors} from './validation';

export type WeightCutGender = 'male' | 'female';

export type WeightCutGoal =
  | 'weight-loss'
  | 'weight-gain'
  | 'body-recomp'
  | 'weight-maintenance';

export type WeightCutPriority =
  | 'aggressive'
  | 'moderate'
  | 'conservative'
  | 'performance';

export type WeightCutSport =
  | 'powerlifting'
  | 'bodybuilding'
  | 'weightlifting'
  | 'combat'
  | 'endurance'
  | 'team'
  | 'general'
  | 'other';

export type WeightCutCompetitionSchedule =
  | 'none'
  | '1month'
  | '3months'
  | '6months'
  | 'year';

export type WeightCutWeightClass =
  | 'none'
  | 'strict'
  | 'flexible'
  | 'advantage';

export type WeightCutStrengthPriority =
  | 'critical'
  | 'important'
  | 'moderate'
  | 'minimal';

export type WeightCutMedical =
  | 'none'
  | 'diabetes'
  | 'thyroid'
  | 'heart'
  | 'digestive'
  | 'other';

export type WeightCutMedication =
  | 'none'
  | 'metabolism'
  | 'hormones'
  | 'other';

export type WeightCutHistory =
  | 'none'
  | 'successful'
  | 'struggled'
  | 'yoyodieting'
  | 'experienced';

export type WeightCutSupport =
  | 'none'
  | 'friends'
  | 'coach'
  | 'nutritionist'
  | 'team';

export type WeightCutValues = {
  gender: WeightCutGender;
  age: string;
  currentWeight: string;
  height: string;
  bodyFat: string;
  activityLevel: NutritionActivityLevel | '';
  goalType: WeightCutGoal | '';
  targetWeight: string;
  targetDate: string;
  priority: WeightCutPriority | '';
  sportType: WeightCutSport | '';
  competitionSchedule: WeightCutCompetitionSchedule;
  weightClassRequirement: WeightCutWeightClass;
  strengthPriority: WeightCutStrengthPriority;
  medicalConditions: WeightCutMedical;
  medications: WeightCutMedication;
  previousWeightChanges: WeightCutHistory;
  supportSystem: WeightCutSupport;
};

export type WeightCutPhase = {
  name: string;
  duration: string;
  focus: string;
  weeklyTarget: string;
};

export type WeightCutGuidanceItem = {
  title: string;
  body: string;
};

export type WeightCutRisk = {
  level: 'Low' | 'Moderate' | 'High' | 'Very High';
  summary: string;
  factors: readonly string[];
};

export type WeightCutResult = {
  direction: 'loss' | 'gain' | 'maintain' | 'recomp';
  weeklyChangeKg: number;
  weeklyChangeDisplay: string;
  dailyCalorieAdjustment: number;
  dailyCalorieAdjustmentDisplay: string;
  timelineWeeks: number;
  timelineDisplay: string;
  successRate: number;
  successRateDisplay: string;
  tdee: number;
  targetCalories: number;
  targetProtein: number;
  targetCarbs: number;
  targetFats: number;
  phases: readonly WeightCutPhase[];
  approach: string;
  nutrition: readonly WeightCutGuidanceItem[];
  training: readonly WeightCutGuidanceItem[];
  monitoring: readonly WeightCutGuidanceItem[];
  risk: WeightCutRisk;
};

export const WEIGHT_CUT_GOALS: readonly {
  value: WeightCutGoal;
  label: string;
}[] = [
  {value: 'weight-loss', label: 'Weight Loss (Fat Loss)'},
  {value: 'weight-gain', label: 'Weight Gain (Muscle Building)'},
  {value: 'body-recomp', label: 'Body Recomposition'},
  {value: 'weight-maintenance', label: 'Weight Maintenance'},
] as const;

export const WEIGHT_CUT_PRIORITIES: readonly {
  value: WeightCutPriority;
  label: string;
}[] = [
  {
    value: 'aggressive',
    label: 'Aggressive (Faster results, higher risk)',
  },
  {value: 'moderate', label: 'Moderate (Balanced approach)'},
  {
    value: 'conservative',
    label: 'Conservative (Sustainable, slower)',
  },
  {
    value: 'performance',
    label: 'Performance-focused (Maintain strength)',
  },
] as const;

export const WEIGHT_CUT_SPORTS: readonly {
  value: WeightCutSport;
  label: string;
}[] = [
  {value: 'powerlifting', label: 'Powerlifting/Strongman'},
  {value: 'bodybuilding', label: 'Bodybuilding/Physique'},
  {value: 'weightlifting', label: 'Olympic Weightlifting'},
  {value: 'combat', label: 'Combat Sports (MMA/Boxing)'},
  {value: 'endurance', label: 'Endurance (Running/Cycling)'},
  {value: 'team', label: 'Team Sports'},
  {value: 'general', label: 'General Fitness'},
  {value: 'other', label: 'Other'},
] as const;

export const WEIGHT_CUT_COMPETITION_SCHEDULES: readonly {
  value: WeightCutCompetitionSchedule;
  label: string;
}[] = [
  {value: 'none', label: 'No upcoming competitions'},
  {value: '1month', label: 'Within 1 month'},
  {value: '3months', label: 'Within 3 months'},
  {value: '6months', label: 'Within 6 months'},
  {value: 'year', label: 'Within 1 year'},
] as const;

export const WEIGHT_CUT_WEIGHT_CLASSES: readonly {
  value: WeightCutWeightClass;
  label: string;
}[] = [
  {value: 'none', label: 'No weight class'},
  {value: 'strict', label: 'Strict weight limit'},
  {value: 'flexible', label: 'Flexible (+/- small margin)'},
  {value: 'advantage', label: 'Weight advantage preferred'},
] as const;

export const WEIGHT_CUT_STRENGTH_PRIORITIES: readonly {
  value: WeightCutStrengthPriority;
  label: string;
}[] = [
  {value: 'critical', label: 'Critical (Must maintain)'},
  {value: 'important', label: 'Important (Minimize loss)'},
  {value: 'moderate', label: 'Moderate (Some loss acceptable)'},
  {value: 'minimal', label: 'Minimal (Weight > Strength)'},
] as const;

export const WEIGHT_CUT_MEDICAL: readonly {
  value: WeightCutMedical;
  label: string;
}[] = [
  {value: 'none', label: 'None'},
  {value: 'diabetes', label: 'Diabetes'},
  {value: 'thyroid', label: 'Thyroid issues'},
  {value: 'heart', label: 'Heart conditions'},
  {value: 'digestive', label: 'Digestive issues'},
  {value: 'other', label: 'Other conditions'},
] as const;

export const WEIGHT_CUT_MEDICATIONS: readonly {
  value: WeightCutMedication;
  label: string;
}[] = [
  {value: 'none', label: 'None'},
  {value: 'metabolism', label: 'Metabolism-affecting meds'},
  {value: 'hormones', label: 'Hormone medications'},
  {value: 'other', label: 'Other medications'},
] as const;

export const WEIGHT_CUT_HISTORY: readonly {
  value: WeightCutHistory;
  label: string;
}[] = [
  {value: 'none', label: 'Never attempted significant changes'},
  {value: 'successful', label: 'Previously successful'},
  {value: 'struggled', label: 'Struggled in the past'},
  {value: 'yoyodieting', label: 'History of yo-yo dieting'},
  {value: 'experienced', label: 'Very experienced'},
] as const;

export const WEIGHT_CUT_SUPPORT: readonly {
  value: WeightCutSupport;
  label: string;
}[] = [
  {value: 'none', label: 'Working alone'},
  {value: 'friends', label: 'Friends/family support'},
  {value: 'coach', label: 'Working with coach'},
  {value: 'nutritionist', label: 'Working with nutritionist'},
  {value: 'team', label: 'Team support system'},
] as const;

export const WEIGHT_CUT_ERRORS = {
  age: 'Please enter an age between 16 and 80.',
  currentWeight: 'Please enter a current weight between 40 and 300 kg.',
  height: 'Please enter a height between 100 and 250 cm.',
  bodyFat: 'Please enter a body fat percentage between 3 and 60.',
  activityLevel: 'Please select your activity level.',
  goalType: 'Please select your goal type.',
  targetWeight: 'Please enter a target weight between 40 and 300 kg.',
  targetDate: 'Please enter a target date.',
  priority: 'Please select a priority level.',
  sportType: 'Please select your sport/training type.',
} as const;

/**
 * Weekly rate as a percentage of body weight. The source information card
 * states that 0.5-1% per week is sustainable for fat loss and 0.25-0.5% for
 * muscle gain, so every rate below stays inside that band.
 */
const WEEKLY_RATE: Record<
  WeightCutGoal,
  Record<WeightCutPriority, number>
> = {
  'weight-loss': {
    aggressive: 1.0,
    moderate: 0.75,
    conservative: 0.5,
    performance: 0.5,
  },
  'weight-gain': {
    aggressive: 0.5,
    moderate: 0.35,
    conservative: 0.25,
    performance: 0.25,
  },
  'body-recomp': {
    aggressive: 0.5,
    moderate: 0.35,
    conservative: 0.25,
    performance: 0.25,
  },
  'weight-maintenance': {
    aggressive: 0.25,
    moderate: 0.15,
    conservative: 0.1,
    performance: 0.1,
  },
};

const KCAL_PER_KG = 7700;
const PROTEIN_PER_KG_CUT = 2.2;
const PROTEIN_PER_KG_GAIN = 1.8;
const PROTEIN_PER_KG_MAINTAIN = 1.6;
/**
 * Maintenance and recomposition targets are not a scale goal, so they run on
 * a fixed twelve-week block instead of a count derived from weight change.
 */
const PLANNING_BLOCK_WEEKS = 12;

export function validateWeightCutValues(
  values: WeightCutValues,
): FieldErrors<WeightCutValues> {
  const errors: FieldErrors<WeightCutValues> = {};
  const age = parseNumber(values.age);
  const weight = parseNumber(values.currentWeight);
  const height = parseNumber(values.height);
  const bodyFat = values.bodyFat.trim() === '' ? null : parseNumber(values.bodyFat);
  const target = parseNumber(values.targetWeight);

  if (age === null || age < 16 || age > 80) {
    errors.age = WEIGHT_CUT_ERRORS.age;
  }

  if (weight === null || weight < 40 || weight > 300) {
    errors.currentWeight = WEIGHT_CUT_ERRORS.currentWeight;
  }

  if (height === null || height < 100 || height > 250) {
    errors.height = WEIGHT_CUT_ERRORS.height;
  }

  if (bodyFat !== null && (bodyFat < 3 || bodyFat > 60)) {
    errors.bodyFat = WEIGHT_CUT_ERRORS.bodyFat;
  }

  if (!values.activityLevel) {
    errors.activityLevel = WEIGHT_CUT_ERRORS.activityLevel;
  }

  if (!values.goalType) {
    errors.goalType = WEIGHT_CUT_ERRORS.goalType;
  }

  if (target === null || target < 40 || target > 300) {
    errors.targetWeight = WEIGHT_CUT_ERRORS.targetWeight;
  }

  if (!values.targetDate) {
    errors.targetDate = WEIGHT_CUT_ERRORS.targetDate;
  }

  if (!values.priority) {
    errors.priority = WEIGHT_CUT_ERRORS.priority;
  }

  if (!values.sportType) {
    errors.sportType = WEIGHT_CUT_ERRORS.sportType;
  }

  return errors;
}

function weeksUntil(targetDate: string): number {
  const target = new Date(`${targetDate}T00:00:00`);
  const now = new Date();
  const diff = target.getTime() - now.getTime();

  if (Number.isNaN(diff) || diff <= 0) {
    return 0;
  }

  return Math.ceil(diff / (7 * 24 * 60 * 60 * 1000));
}

function successRateFor(
  values: WeightCutValues,
  goal: WeightCutGoal,
  rate: number,
  weeksAvailable: number,
  weeksNeeded: number,
): number {
  let rate_ = 90;

  if (goal === 'weight-loss') {
    rate_ -= (rate - 0.5) * 20;
  } else if (goal === 'weight-gain') {
    rate_ -= (0.5 - rate) * 40;
  }

  if (values.priority === 'aggressive') {
    rate_ -= 12;
  } else if (values.priority === 'conservative') {
    rate_ += 4;
  } else if (values.priority === 'performance') {
    rate_ += 2;
  }

  if (weeksAvailable > 0 && weeksNeeded > weeksAvailable) {
    rate_ -= 15;
  }

  if (values.previousWeightChanges === 'none') {
    rate_ -= 8;
  } else if (values.previousWeightChanges === 'struggled') {
    rate_ -= 12;
  } else if (values.previousWeightChanges === 'yoyodieting') {
    rate_ -= 15;
  } else if (
    values.previousWeightChanges === 'successful' ||
    values.previousWeightChanges === 'experienced'
  ) {
    rate_ += 8;
  }

  if (values.supportSystem === 'none') {
    rate_ -= 12;
  } else if (values.supportSystem === 'coach') {
    rate_ += 8;
  } else if (values.supportSystem === 'nutritionist') {
    rate_ += 6;
  } else if (values.supportSystem === 'team') {
    rate_ += 4;
  } else if (values.supportSystem === 'friends') {
    rate_ += 2;
  }

  if (values.medicalConditions !== 'none') {
    rate_ -= 10;
  }

  if (values.medications === 'metabolism' || values.medications === 'hormones') {
    rate_ -= 8;
  }

  if (values.competitionSchedule === '1month') {
    rate_ -= 8;
  }

  return Math.max(35, Math.min(97, Math.round(rate_)));
}

function buildPhases(
  goal: WeightCutGoal,
  priority: WeightCutPriority,
  weeksNeeded: number,
  rate: number,
  bodyWeight: number,
): WeightCutPhase[] {
  const weeklyKg = Math.round((rate * bodyWeight) / 100 * 10) / 10;
  const magnitude = Math.abs(weeklyKg).toFixed(1);

  if (goal === 'weight-loss') {
    return [
      {
        name: 'Phase 1 - Adaptation',
        duration: weeksNeeded <= 4 ? '1-2 weeks' : '2-3 weeks',
        focus: 'Hold the largest deficit while the body adjusts. Expect the scale to move fastest in week one, then slow.',
        weeklyTarget: `${magnitude} kg per week`,
      },
      {
        name: 'Phase 2 - Steady Progress',
        duration: '4-8 weeks',
        focus:
          priority === 'aggressive'
            ? 'Maintain the aggressive rate while strength holds, then reassess. Do not extend the phase without a checkpoint.'
            : 'Hold a consistent rate and protect training quality. A diet break here costs less than a stalled cut later.',
        weeklyTarget: `${magnitude} kg per week`,
      },
      {
        name: 'Phase 3 - Consolidation',
        duration: '2-4 weeks',
        focus: 'Taper the deficit, raise carbohydrate intake, and bring training volume back up for the final stretch.',
        weeklyTarget: `${(Math.abs(weeklyKg) * 0.6).toFixed(1)} kg per week`,
      },
    ];
  }

  if (goal === 'weight-gain') {
    return [
      {
        name: 'Phase 1 - Surplus Ramp',
        duration: '2-4 weeks',
        focus: 'Start with a small surplus and check that appetite and digestion can keep pace before pushing higher.',
        weeklyTarget: `+${magnitude} kg per week`,
      },
      {
        name: 'Phase 2 - Accumulation',
        duration: '6-12 weeks',
        focus: 'Push calories and training volume together. Track the weekly average so a single heavy session does not mislead you.',
        weeklyTarget: `+${magnitude} kg per week`,
      },
      {
        name: 'Phase 3 - Consolidation',
        duration: '2-4 weeks',
        focus: 'Ease the surplus back toward maintenance and consolidate the gains before the next block.',
        weeklyTarget: `+${(Math.abs(weeklyKg) * 0.5).toFixed(1)} kg per week`,
      },
    ];
  }

  if (goal === 'body-recomp') {
    return [
      {
        name: 'Phase 1 - Recalibration',
        duration: '2-3 weeks',
        focus: 'Hold calories near maintenance while training volume goes up and body fat comes down.',
        weeklyTarget: 'Scale weight stable',
      },
      {
        name: 'Phase 2 - Concurrent Shift',
        duration: '4-8 weeks',
        focus: 'Creep calories down slowly while keeping protein high and training load high.',
        weeklyTarget: `${magnitude} kg per week`,
      },
      {
        name: 'Phase 3 - Consolidation',
        duration: '2-4 weeks',
        focus: 'Return to maintenance, keep protein and training habits, and hold the new composition.',
        weeklyTarget: 'Scale weight stable',
      },
    ];
  }

  return [
    {
      name: 'Phase 1 - Establish Baseline',
      duration: '2-3 weeks',
      focus: 'Confirm your true maintenance calories by holding weight steady while training consistently.',
      weeklyTarget: 'Scale weight stable',
    },
    {
      name: 'Phase 2 - Maintenance Block',
      duration: '4-12 weeks',
      focus: 'Hold maintenance while training changes. Recalculate if the weekly average drifts more than 0.5 kg.',
      weeklyTarget: 'Scale weight stable',
    },
    {
      name: 'Phase 3 - Recalibrate',
      duration: '1-2 weeks',
      focus: 'Update maintenance calories from the observed trend and set the next block.',
      weeklyTarget: 'Scale weight stable',
    },
  ];
}

function buildNutrition(
  goal: WeightCutGoal,
  proteinGrams: number,
  targetCalories: number,
  carbGrams: number,
  fatGrams: number,
): WeightCutGuidanceItem[] {
  return [
    {
      title: 'Protein Target',
      body: `${proteinGrams}g per day keeps muscle mass protected while calories move in the direction you chose. Spread it across 3-5 meals.`,
    },
    {
      title: 'Carbohydrate Placement',
      body:
        goal === 'weight-loss'
          ? `Around ${carbGrams}g per day, place the larger serving within a few hours of your hardest training session.`
          : `Around ${carbGrams}g per day, front-load the larger serving before training to fuel the session and the recovery after it.`,
    },
    {
      title: 'Fat Target',
      body: `${fatGrams}g per day, kept away from the pre-training meal so digestion does not compete with the session.`,
    },
    {
      title: 'Total Calories',
      body: `${targetCalories} calories per day, adjusted weekly against the trend on the scale rather than a single reading.`,
    },
  ];
}

function buildTraining(
  values: WeightCutValues,
  goal: WeightCutGoal,
  priority: WeightCutPriority,
): WeightCutGuidanceItem[] {
  const items: WeightCutGuidanceItem[] = [];
  const strengthPriority = values.strengthPriority;
  const sport = values.sportType;

  if (goal === 'weight-loss') {
    if (priority === 'aggressive') {
      items.push({
        title: 'Hold Intensity, Cut Volume',
        body: 'Keep the loads on the bar and remove one accessory block per session. Losing volume is recoverable; losing intensity is not.',
      });
    } else {
      items.push({
        title: 'Keep The Program Intact',
        body: 'Maintain both intensity and volume. A moderate deficit is compatible with full training if recovery and protein are handled.',
      });
    }
  }

  if (goal === 'weight-gain') {
    items.push({
      title: 'Progressive Overload First',
      body: 'Spend the surplus on progressive overload and technique work, not on extra conditioning.',
    });
  }

  if (goal === 'body-recomp') {
    items.push({
      title: 'Train For The Outcome',
      body: 'More volume and higher intensity with calories near maintenance is what moves body composition. Do not under-fuel it.',
    });
  }

  if (strengthPriority === 'critical') {
    items.push({
      title: 'Strength Is Non-Negotiable',
      body: 'Cap the deficit, keep protein high, and treat any strength regression as a signal to back off the calorie change.',
    });
  } else if (strengthPriority === 'minimal') {
    items.push({
      title: 'Weight Outweighs Strength',
      body: 'You can afford a larger deficit and a temporary strength dip, but keep one heavy session per week to maintain the pattern.',
    });
  }

  if (
    values.weightClassRequirement === 'strict' ||
    values.weightClassRequirement === 'flexible'
  ) {
    items.push({
      title: 'Weight Class Protocol',
      body: 'Weigh in at the same time each morning and make the final adjustment with water and gut content, not with a crash diet.',
    });
  }

  if (sport === 'endurance') {
    items.push({
      title: 'Fuel Endurance Work',
      body: 'Long sessions need carbohydrate availability. Do not take a deficit so deep that training quality or recovery collapses.',
    });
  } else if (sport === 'team' || sport === 'combat') {
    items.push({
      title: 'Missed Sessions Cost More',
      body: 'Team and combat schedules are unpredictable. Keep the deficit modest so a missed session never turns into a missed week.',
    });
  }

  return items;
}

function buildMonitoring(
  goal: WeightCutGoal,
  priority: WeightCutPriority,
): WeightCutGuidanceItem[] {
  return [
    {
      title: 'Weigh Daily, Judge Weekly',
      body: 'Weigh in every morning under the same conditions and compare weekly averages. Daily numbers are noise.',
    },
    {
      title: 'Adjust Every Two Weeks',
      body:
        goal === 'weight-loss'
          ? 'If the weekly average has not moved for two weeks, cut 100-200 calories or add one cardio session. If it moves faster than the plan, add calories back.'
          : 'If the weekly average has not moved for two weeks, add 150-250 calories. If it moves faster than the plan, reduce the surplus.',
    },
    {
      title: 'Track More Than Scale Weight',
      body: 'Record waist measurements, photos every four weeks, and training output. Those catch progress the scale cannot see.',
    },
    {
      title: 'Review Sleep And Energy',
      body: 'A flat trend with poor sleep and low energy means the plan is too aggressive, not that you need more discipline.',
    },
    {
      title: 'Plan A Diet Break',
      body:
        priority === 'aggressive'
          ? 'Schedule a 1-2 week maintenance block before you stall. An aggressive cut without a planned break usually ends in a rebound.'
          : 'Schedule a 1-week maintenance block every 6-8 weeks to protect hormone levels and training quality.',
    },
  ];
}

function buildRisk(
  values: WeightCutValues,
  goal: WeightCutGoal,
  rate: number,
  weeksNeeded: number,
  weeksAvailable: number,
): WeightCutRisk {
  const factors: string[] = [];
  let score = 0;

  if (goal === 'weight-loss') {
    if (rate >= 1) {
      score += 2;
      factors.push(
        'Weekly rate is at or above 1% of body weight, which is the upper end of the sustainable band.',
      );
    } else if (rate > 0.75) {
      score += 1;
      factors.push(
        'Weekly rate is above 0.75% of body weight, close to the upper end of the sustainable band.',
      );
    }
  }

  if (values.priority === 'aggressive') {
    score += 2;
    factors.push(
      'Aggressive priority increases the risk of performance loss and rebound weight gain.',
    );
  }

  if (values.competitionSchedule === '1month') {
    score += 2;
    factors.push(
      'A competition within one month leaves little room for a missed session or a plateau.',
    );
  }

  if (values.weightClassRequirement === 'strict') {
    score += 1;
    factors.push(
      'A strict weight class adds pressure to cut below a healthy body fat percentage.',
    );
  }

  if (values.medicalConditions !== 'none') {
    score += 3;
    factors.push(
      'A medical condition is present. Clear the plan with a doctor before starting any deficit or surplus.',
    );
  }

  if (
    values.medications === 'metabolism' ||
    values.medications === 'hormones'
  ) {
    score += 2;
    factors.push(
      'Current medications affect metabolism or hormones, which changes the expected rate of change.',
    );
  }

  if (values.previousWeightChanges === 'yoyodieting') {
    score += 2;
    factors.push(
      'A history of yo-yo dieting raises the risk of repeating the cycle without a structured approach.',
    );
  }

  if (values.supportSystem === 'none') {
    score += 1;
    factors.push(
      'Working without support raises the risk of dropping the plan when it gets hard.',
    );
  }

  if (weeksAvailable > 0 && weeksNeeded > weeksAvailable) {
    score += 2;
    factors.push(
      `The target date gives ${weeksAvailable} weeks but the plan needs ${weeksNeeded} weeks. The date is not achievable at this rate.`,
    );
  }

  const bodyFat =
    values.bodyFat.trim() === '' ? null : parseNumber(values.bodyFat);

  if (bodyFat !== null && goal === 'weight-loss' && bodyFat < 10) {
    score += 2;
    factors.push(
      'Starting body fat is already low, so the achievable fat loss is smaller than the weight target suggests.',
    );
  }

  let level: WeightCutRisk['level'];

  if (score >= 6) {
    level = 'Very High';
  } else if (score >= 4) {
    level = 'High';
  } else if (score >= 2) {
    level = 'Moderate';
  } else {
    level = 'Low';
  }

  const summary =
    score === 0
      ? 'This plan sits inside the sustainable ranges for rate, timeline, and risk factors.'
      : `${score} risk factor${score === 1 ? '' : 's'} identified. Review the flagged items before starting.`;

  return {level, summary, factors};
}

export function calculateWeightCut(
  values: WeightCutValues,
): WeightCutResult {
  const errors = validateWeightCutValues(values);

  if (Object.keys(errors).length > 0) {
    throw new Error('Invalid weight change inputs.');
  }

  const gender = values.gender as WeightCutGender;
  const weight = parseNumber(values.currentWeight) as number;
  const height = parseNumber(values.height) as number;
  const age = parseNumber(values.age) as number;
  const target = parseNumber(values.targetWeight) as number;
  const activity = values.activityLevel as NutritionActivityLevel;
  const goal = values.goalType as WeightCutGoal;
  const priority = values.priority as WeightCutPriority;

  const rate = WEEKLY_RATE[goal][priority];
  const bmr = mifflinStJeorBmr(
    gender as NutritionGender,
    weight,
    height,
    age,
  );
  const tdee = Math.round(bmr * NUTRITION_ACTIVITY_FACTORS[activity]);
  const weightDifference = target - weight;
  const weeklyChangeKg =
    goal === 'weight-gain'
      ? Math.round((rate * weight) / 100 * 10) / 10
      : goal === 'weight-loss'
        ? -Math.round((rate * weight) / 100 * 10) / 10
        : 0;

  const dailyCalorieAdjustment = Math.round(
    (Math.abs(weeklyChangeKg) * KCAL_PER_KG) / 7,
  );
  const targetCalories =
    goal === 'weight-loss'
      ? Math.max(1200, tdee - dailyCalorieAdjustment)
      : goal === 'weight-gain'
        ? tdee + dailyCalorieAdjustment
        : tdee;

  const weeksNeeded =
    goal === 'weight-maintenance' || goal === 'body-recomp'
      ? PLANNING_BLOCK_WEEKS
      : Math.max(
          1,
          Math.ceil(
            Math.abs(weightDifference) / Math.max(0.1, Math.abs(weeklyChangeKg)),
          ),
        );
  const weeksAvailable = weeksUntil(values.targetDate);

  const proteinPerKg =
    goal === 'weight-loss'
      ? PROTEIN_PER_KG_CUT
      : goal === 'weight-gain'
        ? PROTEIN_PER_KG_GAIN
        : PROTEIN_PER_KG_MAINTAIN;
  const targetProtein = Math.round(weight * proteinPerKg);
  const fatGrams = Math.round(
    Math.max(
      40,
      (targetCalories * (goal === 'weight-gain' ? 0.25 : 0.3)) / 9,
    ),
  );
  const carbGrams = Math.max(
    0,
    Math.round((targetCalories - targetProtein * 4 - fatGrams * 9) / 4),
  );

  const successRate = successRateFor(
    values,
    goal,
    rate,
    weeksAvailable,
    weeksNeeded,
  );

  const direction: WeightCutResult['direction'] =
    goal === 'weight-loss'
      ? 'loss'
      : goal === 'weight-gain'
        ? 'gain'
        : goal === 'body-recomp'
          ? 'recomp'
          : 'maintain';

  return {
    direction,
    weeklyChangeKg,
    weeklyChangeDisplay:
      weeklyChangeKg === 0
        ? '0 kg per week'
        : `${weeklyChangeKg > 0 ? '+' : ''}${weeklyChangeKg} kg per week`,
    dailyCalorieAdjustment:
      goal === 'weight-loss'
        ? -dailyCalorieAdjustment
        : goal === 'weight-gain'
          ? dailyCalorieAdjustment
          : 0,
    dailyCalorieAdjustmentDisplay:
      goal === 'weight-loss'
        ? `-${dailyCalorieAdjustment} cal per day`
        : goal === 'weight-gain'
          ? `+${dailyCalorieAdjustment} cal per day`
          : 'No calorie adjustment',
    timelineWeeks: weeksNeeded,
    timelineDisplay: `${weeksNeeded} weeks`,
    successRate,
    successRateDisplay: `${successRate}%`,
    tdee,
    targetCalories,
    targetProtein,
    targetCarbs: carbGrams,
    targetFats: fatGrams,
    phases: buildPhases(goal, priority, weeksNeeded, rate, weight),
    approach: buildApproach(goal, priority, rate, weeksNeeded),
    nutrition: buildNutrition(
      goal,
      targetProtein,
      targetCalories,
      carbGrams,
      fatGrams,
    ),
    training: buildTraining(values, goal, priority),
    monitoring: buildMonitoring(goal, priority),
    risk: buildRisk(values, goal, rate, weeksNeeded, weeksAvailable),
  };
}

function buildApproach(
  goal: WeightCutGoal,
  priority: WeightCutPriority,
  rate: number,
  weeksNeeded: number,
): string {
  const rateText = `${rate}% of body weight per week`;

  if (goal === 'weight-loss') {
    return `A ${priority} fat-loss plan targeting ${rateText}, reaching the target in about ${weeksNeeded} weeks. ${
      priority === 'aggressive'
        ? 'This rate is at the top of the sustainable band, so plan a maintenance break and judge progress on the weekly average.'
        : 'This rate leaves room for training quality to hold steady while the deficit does its work.'
    }`;
  }

  if (goal === 'weight-gain') {
    return `A ${priority} lean-gain plan adding ${rateText}, reaching the target in about ${weeksNeeded} weeks. ${
      priority === 'aggressive'
        ? 'Watch your appetite and training quality closely, because the surplus is only useful if you can eat and recover on it.'
        : 'A steady surplus is easier to sustain and protects the training adaptations that make the gain useful.'
    }`;
  }

  if (goal === 'body-recomp') {
    return `A ${priority} recomposition plan holding calories near maintenance while body composition changes, framed over about ${weeksNeeded} weeks. The scale will barely move, so track waist measurements and training output instead.`;
  }

  return `A ${priority} maintenance plan that establishes your true maintenance calories and holds the line for about ${weeksNeeded} weeks. Recalculate once you have two solid weeks of data.`;
}
