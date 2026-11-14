import {parseNumber} from './units';
import type {FieldErrors} from './validation';

export type FastingGender = 'male' | 'female';

export type FastingExperience =
  | 'beginner'
  | 'some'
  | 'regular'
  | 'experienced'
  | 'advanced';

export type FastingMethod =
  | '16:8'
  | '18:6'
  | '20:4'
  | 'eat-stop-eat'
  | '5:2'
  | 'custom';

export type FastingTrainingType =
  | 'strength'
  | 'endurance'
  | 'mixed'
  | 'hiit'
  | 'sports';

export type FastingTrainingTime =
  | 'early-morning'
  | 'morning'
  | 'midday'
  | 'afternoon'
  | 'evening'
  | 'flexible';

export type FastingIntensity = 'low' | 'moderate' | 'high' | 'very-high';

export type FastingGoal =
  | 'fat-loss'
  | 'muscle-gain'
  | 'body-recomp'
  | 'maintenance'
  | 'performance'
  | 'health';

export type FastingLifestyle =
  | 'sedentary'
  | 'active'
  | 'physically-demanding'
  | 'student'
  | 'shift-worker';

export type FastingDay =
  | 'monday'
  | 'tuesday'
  | 'wednesday'
  | 'thursday'
  | 'friday'
  | 'saturday'
  | 'sunday';

export type FastingValues = {
  gender: FastingGender;
  age: string;
  currentWeight: string;
  targetWeight: string;
  fastingExperience: FastingExperience | '';
  fastingMethod: FastingMethod;
  trainingFrequency: FastingFrequency | '';
  primaryTrainingType: FastingTrainingType | '';
  trainingTime: FastingTrainingTime | '';
  trainingIntensity: FastingIntensity | '';
  trainingDays: readonly FastingDay[];
  primaryGoal: FastingGoal | '';
  lifestyle: FastingLifestyle | '';
  customFastHours: string;
  customEatHours: string;
};

export type FastingFrequency = '2' | '3' | '4' | '5' | '6' | '7';

export type FastingMethodPlan = {
  method: FastingMethod;
  label: string;
  fastHours: number;
  eatHours: number;
  fastDaysPerWeek: number;
  restrictedDaysPerWeek: number;
  restrictedCalories: number | null;
};

export type FastingDayPlan = {
  day: FastingDay;
  dayLabel: string;
  isTrainingDay: boolean;
  trainingTimeLabel: string;
  eatWindow: string;
  fastWindow: string;
  note: string;
};

export type FastingGuidanceItem = {
  title: string;
  body: string;
};

export type FastingResult = {
  recommendedMethod: FastingMethodPlan;
  plannedMethod: FastingMethodPlan;
  matchesPreference: boolean;
  rationale: string;
  weeklyPlan: readonly FastingDayPlan[];
  alignment: readonly FastingGuidanceItem[];
  nutrition: readonly FastingGuidanceItem[];
  tips: readonly FastingGuidanceItem[];
  dailyProtein: number;
  proteinPerMeal: number;
  mealCount: number;
  carbsAroundTraining: string;
};

export const FASTING_EXPERIENCE_OPTIONS: readonly {
  value: FastingExperience;
  label: string;
}[] = [
  {value: 'beginner', label: 'Beginner (Never tried IF)'},
  {value: 'some', label: 'Some experience (Tried a few times)'},
  {value: 'regular', label: 'Regular (1-3 months)'},
  {value: 'experienced', label: 'Experienced (3+ months)'},
  {value: 'advanced', label: 'Advanced (1+ years)'},
] as const;

export const FASTING_METHOD_OPTIONS: readonly {
  value: FastingMethod;
  label: string;
}[] = [
  {value: '16:8', label: '16:8 Method (16h fast, 8h eat)'},
  {value: '18:6', label: '18:6 Method (18h fast, 6h eat)'},
  {value: '20:4', label: '20:4 Method (20h fast, 4h eat)'},
  {
    value: 'eat-stop-eat',
    label: 'Eat-Stop-Eat (24h fast, 1-2x/week)',
  },
  {value: '5:2', label: '5:2 Diet (500 calories 2x/week)'},
  {value: 'custom', label: 'Custom Schedule'},
] as const;

export const FASTING_TRAINING_TYPES: readonly {
  value: FastingTrainingType;
  label: string;
}[] = [
  {value: 'strength', label: 'Strength Training'},
  {value: 'endurance', label: 'Endurance/Cardio'},
  {value: 'mixed', label: 'Mixed Training'},
  {value: 'hiit', label: 'HIIT/Metabolic'},
  {value: 'sports', label: 'Team Sports'},
] as const;

export const FASTING_TRAINING_TIMES: readonly {
  value: FastingTrainingTime;
  label: string;
}[] = [
  {value: 'early-morning', label: 'Early Morning (5-7 AM)'},
  {value: 'morning', label: 'Morning (7-10 AM)'},
  {value: 'midday', label: 'Midday (11 AM-1 PM)'},
  {value: 'afternoon', label: 'Afternoon (2-5 PM)'},
  {value: 'evening', label: 'Evening (6-9 PM)'},
  {value: 'flexible', label: 'Flexible/Varies by day'},
] as const;

export const FASTING_INTENSITIES: readonly {
  value: FastingIntensity;
  label: string;
}[] = [
  {value: 'low', label: 'Low (Light, recovery-focused)'},
  {value: 'moderate', label: 'Moderate (Challenging but manageable)'},
  {value: 'high', label: 'High (Intense, demanding)'},
  {value: 'very-high', label: 'Very High (Peak performance)'},
] as const;

export const FASTING_GOALS: readonly {
  value: FastingGoal;
  label: string;
}[] = [
  {value: 'fat-loss', label: 'Fat Loss'},
  {value: 'muscle-gain', label: 'Muscle Gain'},
  {value: 'body-recomp', label: 'Body Recomposition'},
  {value: 'maintenance', label: 'Maintenance'},
  {value: 'performance', label: 'Athletic Performance'},
  {value: 'health', label: 'General Health'},
] as const;

export const FASTING_LIFESTYLES: readonly {
  value: FastingLifestyle;
  label: string;
}[] = [
  {value: 'sedentary', label: 'Sedentary (Desk job)'},
  {value: 'active', label: 'Active (On feet often)'},
  {
    value: 'physically-demanding',
    label: 'Physically Demanding Job',
  },
  {value: 'student', label: 'Student (Flexible schedule)'},
  {value: 'shift-worker', label: 'Shift Worker'},
] as const;

export const FASTING_DAYS: readonly {
  value: FastingDay;
  label: string;
}[] = [
  {value: 'monday', label: 'Monday'},
  {value: 'tuesday', label: 'Tuesday'},
  {value: 'wednesday', label: 'Wednesday'},
  {value: 'thursday', label: 'Thursday'},
  {value: 'friday', label: 'Friday'},
  {value: 'saturday', label: 'Saturday'},
  {value: 'sunday', label: 'Sunday'},
] as const;

export const FASTING_FREQUENCIES: readonly {
  value: FastingFrequency;
  label: string;
}[] = [
  {value: '2', label: '2 days/week'},
  {value: '3', label: '3 days/week'},
  {value: '4', label: '4 days/week'},
  {value: '5', label: '5 days/week'},
  {value: '6', label: '6 days/week'},
  {value: '7', label: '7 days/week'},
] as const;

export const FASTING_ERRORS = {
  age: 'Please enter an age between 18 and 80.',
  currentWeight: 'Please enter a current weight between 40 and 200 kg.',
  targetWeight: 'Please enter a target weight between 40 and 200 kg.',
  fastingExperience: 'Please select your fasting experience level.',
  trainingFrequency: 'Please select how many days per week you train.',
  primaryTrainingType: 'Please select your primary training type.',
  trainingTime: 'Please select your preferred training time.',
  trainingIntensity: 'Please select your training intensity.',
  trainingDays: 'Please select at least one training day.',
  primaryGoal: 'Please select your primary goal.',
  customFastHours: 'Please enter a fast length between 12 and 20 hours.',
  customEatHours: 'Please enter an eating window between 4 and 8 hours.',
} as const;

/**
 * The ladder only holds the daily protocols. Eat-Stop-Eat and 5:2 are
 * periodised protocols that cannot be expressed as a daily window, so they
 * are only ever used when the athlete picks them explicitly.
 */
const METHOD_LADDER: readonly FastingMethod[] = ['16:8', '18:6', '20:4'];

const METHOD_DETAILS: Record<
  Exclude<FastingMethod, 'custom'>,
  {label: string; fastHours: number; eatHours: number}
> = {
  '16:8': {label: '16:8 Method', fastHours: 16, eatHours: 8},
  '18:6': {label: '18:6 Method', fastHours: 18, eatHours: 6},
  '20:4': {label: '20:4 Method', fastHours: 20, eatHours: 4},
  'eat-stop-eat': {
    label: 'Eat-Stop-Eat',
    fastHours: 24,
    eatHours: 24,
  },
  '5:2': {label: '5:2 Diet', fastHours: 24, eatHours: 24},
};

const EXPERIENCE_BASIS: Record<FastingExperience, number> = {
  beginner: 0,
  some: 0,
  regular: 1,
  experienced: 2,
  advanced: 2,
};

const GOAL_SHIFT: Record<FastingGoal, number> = {
  'fat-loss': 1,
  'muscle-gain': -1,
  'body-recomp': 0,
  maintenance: 0,
  performance: -1,
  health: 0,
};

const INTENSITY_SHIFT: Record<FastingIntensity, number> = {
  low: 0,
  moderate: 0,
  high: -1,
  'very-high': -1,
};

const TRAINING_START_MINUTES: Record<FastingTrainingTime, number> = {
  'early-morning': 6 * 60,
  morning: 8 * 60,
  midday: 12 * 60,
  afternoon: 15 * 60,
  evening: 19 * 60,
  flexible: 17 * 60,
};

const PROTEIN_PER_KG: Record<FastingGoal, number> = {
  'fat-loss': 2.0,
  'muscle-gain': 2.2,
  'body-recomp': 2.0,
  maintenance: 1.6,
  performance: 1.8,
  health: 1.6,
};

export function formatClock(totalMinutes: number): string {
  const wrapped = ((totalMinutes % 1440) + 1440) % 1440;
  const hours = Math.floor(wrapped / 60);
  const minutes = Math.round(wrapped % 60);

  return `${hours.toString().padStart(2, '0')}:${minutes
    .toString()
    .padStart(2, '0')}`;
}

export function validateFastingValues(
  values: FastingValues,
): FieldErrors<FastingValues> {
  const errors: FieldErrors<FastingValues> = {};
  const age = parseNumber(values.age);
  const currentWeight = parseNumber(values.currentWeight);
  const targetWeight = parseNumber(values.targetWeight);

  if (age === null || age < 18 || age > 80) {
    errors.age = FASTING_ERRORS.age;
  }

  if (
    currentWeight === null ||
    currentWeight < 40 ||
    currentWeight > 200
  ) {
    errors.currentWeight = FASTING_ERRORS.currentWeight;
  }

  if (targetWeight === null || targetWeight < 40 || targetWeight > 200) {
    errors.targetWeight = FASTING_ERRORS.targetWeight;
  }

  if (!values.fastingExperience) {
    errors.fastingExperience = FASTING_ERRORS.fastingExperience;
  }

  if (!values.trainingFrequency) {
    errors.trainingFrequency = FASTING_ERRORS.trainingFrequency;
  }

  if (!values.primaryTrainingType) {
    errors.primaryTrainingType = FASTING_ERRORS.primaryTrainingType;
  }

  if (!values.trainingTime) {
    errors.trainingTime = FASTING_ERRORS.trainingTime;
  }

  if (!values.trainingIntensity) {
    errors.trainingIntensity = FASTING_ERRORS.trainingIntensity;
  }

  if (values.trainingDays.length === 0) {
    errors.trainingDays = FASTING_ERRORS.trainingDays;
  }

  if (!values.primaryGoal) {
    errors.primaryGoal = FASTING_ERRORS.primaryGoal;
  }

  if (values.fastingMethod === 'custom') {
    const fastHours = parseNumber(values.customFastHours);
    const eatHours = parseNumber(values.customEatHours);

    if (fastHours === null || fastHours < 12 || fastHours > 20) {
      errors.customFastHours = FASTING_ERRORS.customFastHours;
    }

    if (eatHours === null || eatHours < 4 || eatHours > 8) {
      errors.customEatHours = FASTING_ERRORS.customEatHours;
    }
  }

  return errors;
}

function methodPlan(
  method: FastingMethod,
  values: FastingValues,
): FastingMethodPlan {
  if (method === 'custom') {
    const fastHours = parseNumber(values.customFastHours) ?? 16;
    const eatHours = parseNumber(values.customEatHours) ?? 8;

    return {
      method,
      label: `Custom ${fastHours}:${eatHours}`,
      fastHours,
      eatHours,
      fastDaysPerWeek: 7,
      restrictedDaysPerWeek: 0,
      restrictedCalories: null,
    };
  }

  const details = METHOD_DETAILS[method];

  if (method === 'eat-stop-eat') {
    return {
      method,
      label: details.label,
      fastHours: details.fastHours,
      eatHours: details.eatHours,
      fastDaysPerWeek: 1,
      restrictedDaysPerWeek: 1,
      restrictedCalories: 0,
    };
  }

  if (method === '5:2') {
    return {
      method,
      label: details.label,
      fastHours: details.fastHours,
      eatHours: details.eatHours,
      fastDaysPerWeek: 5,
      restrictedDaysPerWeek: 2,
      restrictedCalories: 500,
    };
  }

  return {
    method,
    label: details.label,
    fastHours: details.fastHours,
    eatHours: details.eatHours,
    fastDaysPerWeek: 7,
    restrictedDaysPerWeek: 0,
    restrictedCalories: null,
  };
}

function recommendedMethod(values: FastingValues): FastingMethod {
  const experience = values.fastingExperience as FastingExperience;
  const goal = values.primaryGoal as FastingGoal;
  const intensity = values.trainingIntensity as FastingIntensity;
  const basis = EXPERIENCE_BASIS[experience];

  let index = basis + GOAL_SHIFT[goal] + INTENSITY_SHIFT[intensity];

  if (index < 0) {
    index = 0;
  }

  const maxIndex = basis === 0 ? 0 : Math.min(METHOD_LADDER.length - 1, basis + 1);

  if (index > maxIndex) {
    index = maxIndex;
  }

  if (experience === 'advanced' && goal === 'fat-loss') {
    return 'eat-stop-eat';
  }

  return METHOD_LADDER[index];
}

/**
 * The plan follows the athlete's explicit preference when they pick a
 * protocol the recommendation ladder cannot express - Eat-Stop-Eat, 5:2, or a
 * custom schedule. Everything else follows the recommendation.
 */
function plannedMethod(values: FastingValues): FastingMethod {
  const preference = values.fastingMethod;

  if (
    preference === 'eat-stop-eat' ||
    preference === '5:2' ||
    preference === 'custom'
  ) {
    return preference;
  }

  return recommendedMethod(values);
}

function rationaleFor(
  method: FastingMethod,
  values: FastingValues,
): string {
  const experience = values.fastingExperience as FastingExperience;
  const intensity = values.trainingIntensity as FastingIntensity;
  const goal = values.primaryGoal as FastingGoal;

  if (intensity === 'high' || intensity === 'very-high') {
    return `${method} keeps a ${methodPlan(method, values).eatHours}h eating window to fuel demanding sessions while keeping the fast long enough for fat oxidation.`;
  }

  if (goal === 'fat-loss') {
    return `${method} extends the fasting window for fat loss while staying inside the range your ${experience} experience can sustain.`;
  }

  if (goal === 'muscle-gain' || goal === 'performance') {
    return `${method} keeps enough eating time to hit your protein and carbohydrate targets for ${goal === 'muscle-gain' ? 'muscle gain' : 'performance'}.`;
  }

  return `${method} matches a ${experience} experience level with a sustainable balance between fasting and eating time.`;
}

function buildWeeklyPlan(
  plan: FastingMethodPlan,
  values: FastingValues,
): FastingDayPlan[] {
  const trainingDays = new Set(values.trainingDays);
  const trainingTime = values.trainingTime as FastingTrainingTime;
  const intensity = values.trainingIntensity as FastingIntensity;
  const trainingStart = TRAINING_START_MINUTES[trainingTime];
  const offsetHours =
    intensity === 'high' || intensity === 'very-high' ? 1 : 2;
  const restDays = FASTING_DAYS.filter((day) => !trainingDays.has(day.value));
  const restrictedDays = new Set(
    restDays
      .slice(0, Math.min(plan.restrictedDaysPerWeek, restDays.length))
      .map((day) => day.value),
  );

  return FASTING_DAYS.map((day) => {
    const isTrainingDay = trainingDays.has(day.value);
    const isRestrictedDay = restrictedDays.has(day.value);
    const eatStart = isTrainingDay
      ? trainingStart + offsetHours * 60
      : 12 * 60;

    if (plan.method === 'eat-stop-eat' && isRestrictedDay) {
      return {
        day: day.value,
        dayLabel: day.label,
        isTrainingDay,
        trainingTimeLabel: isTrainingDay
          ? (FASTING_TRAINING_TIMES.find(
              (option) => option.value === trainingTime,
            )?.label ?? '')
          : 'Rest day',
        eatWindow: 'No eating window',
        fastWindow: '00:00 - 00:00 (24h fast)',
        note: isTrainingDay
          ? 'Full fast day - keep hydration and electrolytes up.'
          : 'Full fast day - rest day preferred for recovery.',
      };
    }

    if (plan.method === '5:2' && isRestrictedDay) {
      return {
        day: day.value,
        dayLabel: day.label,
        isTrainingDay,
        trainingTimeLabel: isTrainingDay
          ? (FASTING_TRAINING_TIMES.find(
              (option) => option.value === trainingTime,
            )?.label ?? '')
          : 'Rest day',
        eatWindow: '500 calories',
        fastWindow: 'No eating window',
        note: isTrainingDay
          ? '500-calorie day - schedule this away from hard training.'
          : '500-calorie day - rest day preferred for recovery.',
      };
    }

    const eatEnd = eatStart + plan.eatHours * 60;

    return {
      day: day.value,
      dayLabel: day.label,
      isTrainingDay,
      trainingTimeLabel: isTrainingDay
        ? (FASTING_TRAINING_TIMES.find(
            (option) => option.value === trainingTime,
          )?.label ?? '')
        : 'Rest day',
      eatWindow: `${formatClock(eatStart)} - ${formatClock(eatEnd)}`,
      fastWindow: `${formatClock(eatEnd)} - ${formatClock(eatStart)}`,
      note: isTrainingDay
        ? `Training ${FASTING_TRAINING_TIMES.find(
            (option) => option.value === trainingTime,
          )?.label.toLowerCase() ?? ''} - break the fast within 1h of finishing.`
        : 'Rest day - spread your meals evenly across the eating window.',
    };
  });
}

function buildAlignment(
  plan: FastingMethodPlan,
  values: FastingValues,
): FastingGuidanceItem[] {
  const intensity = values.trainingIntensity as FastingIntensity;
  const trainingTime = values.trainingTime as FastingTrainingTime;
  const trainingType = values.primaryTrainingType as FastingTrainingType;
  const items: FastingGuidanceItem[] = [];

  if (intensity === 'low' || intensity === 'moderate') {
    items.push({
      title: 'Train Fasted',
      body: 'Low-to-moderate intensity training works well fasted. Keep water, and add electrolytes if the session runs past 60 minutes.',
    });
  } else {
    items.push({
      title: 'Break The Fast Around High-Intensity Work',
      body: 'For high-intensity sessions, train just before breaking your fast so the post-workout meal lands inside the eating window.',
    });
  }

  if (trainingTime === 'early-morning') {
    items.push({
      title: 'Early Sessions',
      body: 'An early-morning session sits comfortably inside the fast. Keep the pre-session meal light and let the post-session meal open your eating window.',
    });
  } else if (trainingTime === 'flexible') {
    items.push({
      title: 'Flexible Schedule',
      body: 'With a variable schedule, anchor the eating window to a fixed clock time and treat the training session as the variable around it.',
    });
  } else {
    items.push({
      title: 'Keep The Window Fixed',
      body: `A ${trainingTime.replace('-', ' ')} session works best when your ${plan.eatHours}h eating window opens within an hour or two of training.`,
    });
  }

  if (trainingType === 'endurance' || trainingType === 'hiit') {
    items.push({
      title: 'Carbohydrate Timing',
      body: 'Longer or interval work drains glycogen faster. Add 30-60g of fast carbohydrates in the first meal after the session.',
    });
  }

  if (plan.fastHours >= 18) {
    items.push({
      title: 'Long Fasts Need Electrolytes',
      body: 'Fasts beyond 18 hours deplete sodium and potassium. Add electrolytes to water and watch for dizziness, cramps, or fatigue.',
    });
  }

  return items;
}

function buildNutrition(
  values: FastingValues,
  mealCount: number,
  dailyProtein: number,
  proteinPerMeal: number,
): FastingGuidanceItem[] {
  const goal = values.primaryGoal as FastingGoal;
  const intensity = values.trainingIntensity as FastingIntensity;

  return [
    {
      title: 'Protein Per Meal',
      body: `Spread ${dailyProtein}g of protein across ${mealCount} meals - about ${proteinPerMeal}g each - to preserve muscle mass while your eating window is compressed.`,
    },
    {
      title: 'Carbohydrates Around Training',
      body:
        intensity === 'high' || intensity === 'very-high'
          ? 'Front-load 30-60g of fast carbohydrates in the meal right after training to refill glycogen.'
          : 'Place the larger carbohydrate serving closest to your training session, even on lower-intensity days.',
    },
    {
      title: 'Fat And Fibre',
      body:
        goal === 'fat-loss'
          ? 'Keep fat moderate and fibre high in the meals furthest from your session to keep fullness through the fast.'
          : 'Keep fats moderate so they do not slow digestion of the meal that opens your window.',
    },
    {
      title: 'Hydration And Electrolytes',
      body: 'Drink water through the fast and add electrolytes around training. Hunger often reads as thirst when the fast runs long.',
    },
  ];
}

function buildTips(values: FastingValues): FastingGuidanceItem[] {
  const experience = values.fastingExperience as FastingExperience;
  const lifestyle = values.lifestyle as FastingLifestyle;
  const tips: FastingGuidanceItem[] = [];

  if (experience === 'beginner') {
    tips.push({
      title: 'Start With The Easiest Window',
      body: 'Initial adaptation may take 2-4 weeks. Start with a 14-16 hour fast and lengthen it only once the schedule feels automatic.',
    });
  } else if (experience === 'some' || experience === 'regular') {
    tips.push({
      title: 'Progress One Step At A Time',
      body: 'Move to a longer fast only after a full week at the current length. Jumping straight to the hardest schedule is the fastest route to quitting.',
    });
  } else {
    tips.push({
      title: 'Protect Recovery Days',
      body: 'With an advanced schedule, keep one full eating day and prioritise sleep, because recovery debt is what breaks experienced fasters first.',
    });
  }

  if (lifestyle === 'shift-worker') {
    tips.push({
      title: 'Anchor To Sleep, Not To The Clock',
      body: 'Shift workers should anchor the eating window to wake time rather than midnight, so the fast ends with a consistent sleep and training rhythm.',
    });
  } else if (lifestyle === 'physically-demanding') {
    tips.push({
      title: 'Fuel Physical Work',
      body: 'A physically demanding job is training volume. Consider the milder end of the fasting spectrum and keep carbohydrates around the hardest work blocks.',
    });
  } else if (lifestyle === 'student') {
    tips.push({
      title: 'Use Your Flexible Schedule',
      body: 'A flexible schedule is an advantage: shift the eating window to match exam blocks and training rather than forcing a fixed clock time.',
    });
  } else {
    tips.push({
      title: 'Keep The Same Wake Time',
      body: 'A consistent wake time keeps the fasting window stable even when the eating window moves.',
    });
  }

  tips.push({
    title: 'Track Energy, Not Just Weight',
    body: 'Log training performance, sleep quality, and hunger through each fast. Those three signals tell you when to adjust long before the scale does.',
  });

  tips.push({
    title: 'Have A Plan For Social Meals',
    body: 'Decide the eating-window hours before the social event arrives. Most fasts end early because the plan was never made.',
  });

  return tips;
}

export function calculateFasting(values: FastingValues): FastingResult {
  const errors = validateFastingValues(values);

  if (Object.keys(errors).length > 0) {
    throw new Error('Invalid fasting inputs.');
  }

  const weight = parseNumber(values.currentWeight) as number;
  const goal = values.primaryGoal as FastingGoal;
  const method = plannedMethod(values);
  const recommendation = recommendedMethod(values);
  const plan = methodPlan(method, values);
  const recommendedPlan = methodPlan(recommendation, values);
  const mealCount =
    plan.method === 'eat-stop-eat' || plan.method === '5:2'
      ? 3
      : Math.max(2, Math.round(plan.eatHours / 3));
  const dailyProtein = Math.round(weight * PROTEIN_PER_KG[goal]);
  const proteinPerMeal = Math.round(dailyProtein / mealCount);

  return {
    recommendedMethod: recommendedPlan,
    plannedMethod: plan,
    matchesPreference: plan.method === values.fastingMethod,
    rationale: rationaleFor(plan.method, values),
    weeklyPlan: buildWeeklyPlan(plan, values),
    alignment: buildAlignment(plan, values),
    nutrition: buildNutrition(
      values,
      mealCount,
      dailyProtein,
      proteinPerMeal,
    ),
    tips: buildTips(values),
    dailyProtein,
    proteinPerMeal,
    mealCount,
    carbsAroundTraining:
      values.trainingIntensity === 'high' ||
      values.trainingIntensity === 'very-high'
        ? '30-60g fast carbs'
        : '20-40g carbs',
  };
}
