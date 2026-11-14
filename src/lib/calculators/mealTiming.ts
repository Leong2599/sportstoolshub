import type {FieldErrors} from './validation';

export type MealTimingGoal =
  | 'muscle-gain'
  | 'fat-loss'
  | 'performance'
  | 'endurance'
  | 'strength'
  | 'general-health';

export type MealTimingWorkoutSchedule =
  | 'early-morning'
  | 'mid-morning'
  | 'lunch-time'
  | 'afternoon'
  | 'evening'
  | 'night';

export type MealTimingDuration = 'short' | 'medium' | 'long' | 'very-long';

export type MealTimingIntensity = 'low' | 'moderate' | 'high' | 'very-high';

export type MealTimingPreference =
  | 'vegetarian'
  | 'vegan'
  | 'gluten-free'
  | 'dairy-free'
  | 'low-carb'
  | 'keto';

export type MealTimingConsideration =
  | 'sensitive-stomach'
  | 'fast-metabolism'
  | 'slow-metabolism'
  | 'diabetes'
  | 'food-allergies'
  | 'intermittent-fasting';

export type MealTimingValues = {
  goal: MealTimingGoal | '';
  workoutSchedule: MealTimingWorkoutSchedule | '';
  workoutDuration: MealTimingDuration | '';
  workoutIntensity: MealTimingIntensity | '';
  frequency: string;
  wakeTime: string;
  sleepTime: string;
  dietaryPreferences: readonly MealTimingPreference[];
  specialConsiderations: readonly MealTimingConsideration[];
};

export type MealTimingMeal = {
  time: string;
  type: string;
  focus: string;
  isPreWorkout: boolean;
  isPostWorkout: boolean;
};

export type MealTimingTimelineItem = {
  time: string;
  title: string;
  body: string;
};

export type MealTimingRecommendation = {
  category: string;
  guideline: string;
};

export type MealTimingTip = {
  title: string;
  body: string;
};

export type MealTimingResult = {
  goal: MealTimingGoal;
  goalLabel: string;
  workoutLabel: string;
  frequency: number;
  wakeTime: string;
  sleepTime: string;
  scheduleLabel: string;
  meals: readonly MealTimingMeal[];
  timeline: readonly MealTimingTimelineItem[];
  recommendations: readonly MealTimingRecommendation[];
  tips: readonly MealTimingTip[];
};

export const MEAL_TIMING_GOALS: readonly {
  value: MealTimingGoal;
  label: string;
}[] = [
  {value: 'muscle-gain', label: 'Muscle Gain (Hypertrophy)'},
  {value: 'fat-loss', label: 'Fat Loss (Weight Loss)'},
  {value: 'performance', label: 'Athletic Performance'},
  {value: 'endurance', label: 'Endurance Training'},
  {value: 'strength', label: 'Strength Training'},
  {value: 'general-health', label: 'General Health'},
] as const;

export const MEAL_TIMING_SCHEDULES: readonly {
  value: MealTimingWorkoutSchedule;
  label: string;
}[] = [
  {value: 'early-morning', label: 'Early Morning (5-8 AM)'},
  {value: 'mid-morning', label: 'Mid-Morning (9-11 AM)'},
  {value: 'lunch-time', label: 'Lunch Time (12-2 PM)'},
  {value: 'afternoon', label: 'Afternoon (3-5 PM)'},
  {value: 'evening', label: 'Evening (6-8 PM)'},
  {value: 'night', label: 'Night (9-11 PM)'},
] as const;

export const MEAL_TIMING_DURATIONS: readonly {
  value: MealTimingDuration;
  label: string;
}[] = [
  {value: 'short', label: 'Short (30-45 minutes)'},
  {value: 'medium', label: 'Medium (45-75 minutes)'},
  {value: 'long', label: 'Long (75-120 minutes)'},
  {value: 'very-long', label: 'Very Long (2+ hours)'},
] as const;

export const MEAL_TIMING_INTENSITIES: readonly {
  value: MealTimingIntensity;
  label: string;
}[] = [
  {value: 'low', label: 'Low (Light, recovery)'},
  {value: 'moderate', label: 'Moderate (Steady pace)'},
  {value: 'high', label: 'High (Intense, challenging)'},
  {value: 'very-high', label: 'Very High (Maximum effort)'},
] as const;

export const MEAL_TIMING_FREQUENCIES: readonly {
  value: string;
  label: string;
}[] = [
  {value: '3', label: '3 meals per day'},
  {value: '4', label: '4 meals per day'},
  {value: '5', label: '5 meals per day'},
  {value: '6', label: '6 meals per day'},
] as const;

export const MEAL_TIMING_PREFERENCES: readonly {
  value: MealTimingPreference;
  label: string;
}[] = [
  {value: 'vegetarian', label: 'Vegetarian'},
  {value: 'vegan', label: 'Vegan'},
  {value: 'gluten-free', label: 'Gluten-Free'},
  {value: 'dairy-free', label: 'Dairy-Free'},
  {value: 'low-carb', label: 'Low Carb'},
  {value: 'keto', label: 'Ketogenic'},
] as const;

export const MEAL_TIMING_CONSIDERATIONS: readonly {
  value: MealTimingConsideration;
  label: string;
}[] = [
  {value: 'sensitive-stomach', label: 'Sensitive Stomach'},
  {value: 'fast-metabolism', label: 'Fast Metabolism'},
  {value: 'slow-metabolism', label: 'Slow Metabolism'},
  {value: 'diabetes', label: 'Diabetes'},
  {value: 'food-allergies', label: 'Food Allergies'},
  {value: 'intermittent-fasting', label: 'Intermittent Fasting'},
] as const;

export const MEAL_TIMING_ERRORS = {
  goal: 'Please select your primary fitness goal.',
  workoutSchedule: 'Please select your workout schedule.',
  workoutDuration: 'Please select your typical workout duration.',
  workoutIntensity: 'Please select your workout intensity.',
  frequency: 'Please select a valid daily meal frequency (3-6).',
  wakeTime: 'Please enter your typical wake-up time.',
  sleepTime: 'Please enter your typical bedtime.',
  timeFormat: 'Invalid wake-up or bedtime format. Please use HH:MM.',
  awakeTime:
    'Awake time cannot be zero or negative. Please check wake-up and bedtime.',
} as const;

const MEAL_NAMES = [
  'Breakfast',
  'Mid-Morning Meal',
  'Lunch',
  'Afternoon Meal',
  'Dinner',
  'Evening Meal',
] as const;

const TIMELINE: readonly MealTimingTimelineItem[] = [
  {
    time: '2-3 Hours Before Workout',
    title: 'Pre-Workout Meal',
    body: 'Balanced meal with complex carbs and moderate protein. Avoid heavy fats and fiber.',
  },
  {
    time: 'During Workout',
    title: 'Workout Fuel',
    body: 'Hydration with electrolytes. For sessions >60min, consider carbs (30-60g per hour).',
  },
  {
    time: '30-60 Minutes After Workout',
    title: 'Recovery Meal',
    body: 'Protein (20-40g) + carbs for glycogen replenishment. 3:1 or 4:1 carb:protein ratio.',
  },
] as const;

const TIPS: readonly MealTimingTip[] = [
  {
    title: 'Consistency is Key',
    body: 'Eat at the same times daily to regulate metabolism and hunger cues.',
  },
  {
    title: 'Workout Nutrition',
    body: 'Never train completely fasted. Have a small snack 30-60 minutes before exercise.',
  },
  {
    title: 'Recovery Window',
    body: 'The 30-60 minute post-workout window is crucial for muscle repair and glycogen replenishment.',
  },
  {
    title: 'Nighttime Nutrition',
    body: 'Consider casein protein before bed for overnight muscle recovery.',
  },
  {
    title: 'Hydration Timing',
    body: 'Drink water throughout the day, not just with meals. Aim for 8-10 glasses daily.',
  },
] as const;

type GoalRecommendations = {
  protein: string;
  carbs: string;
  fats: string;
  timing: string;
};

const GOAL_RECOMMENDATIONS: Record<MealTimingGoal, GoalRecommendations> = {
  'muscle-gain': {
    protein: '25-35g per meal',
    carbs: 'Time around workouts',
    fats: 'Moderate amounts',
    timing: 'Protein every 3-4 hours',
  },
  'fat-loss': {
    protein: '20-30g per meal',
    carbs: 'Around workouts only',
    fats: 'Higher for satiety',
    timing: 'Carb timing around exercise',
  },
  performance: {
    protein: '20-30g per meal',
    carbs: 'Before/during exercise',
    fats: 'Moderate',
    timing: 'Strategic carb loading',
  },
  endurance: {
    protein: '15-25g per meal',
    carbs: 'High throughout day',
    fats: 'Moderate',
    timing: 'Continuous carb intake',
  },
  strength: {
    protein: '20-30g per meal',
    carbs: 'Balanced throughout day',
    fats: 'Moderate amounts',
    timing: 'Consistent meal schedule',
  },
  'general-health': {
    protein: '20-30g per meal',
    carbs: 'Balanced throughout day',
    fats: 'Moderate amounts',
    timing: 'Consistent meal schedule',
  },
};

export function parseTimeIntoMinutes(timeString: string): number {
  if (!timeString) {
    return Number.NaN;
  }

  const [hours, minutes] = timeString.split(':').map(Number);
  return hours * 60 + minutes;
}

export function formatMinutesToTime(totalMinutes: number): string {
  const hours = Math.floor(totalMinutes / 60) % 24;
  let minutes = Math.round(totalMinutes % 60);

  if (minutes === 60) {
    minutes = 0;
  }

  return `${hours.toString().padStart(2, '0')}:${minutes
    .toString()
    .padStart(2, '0')}`;
}

function getDurationInMinutes(duration: MealTimingDuration): number {
  switch (duration) {
    case 'short':
      return 30;
    case 'medium':
      return 60;
    case 'long':
      return 90;
    case 'very-long':
      return 150;
    default:
      return 60;
  }
}

function getWorkoutStartMinutes(
  workoutSchedule: MealTimingWorkoutSchedule,
): number {
  let workoutHour: number;

  switch (workoutSchedule) {
    case 'early-morning':
      workoutHour = 6;
      break;
    case 'mid-morning':
      workoutHour = 10;
      break;
    case 'lunch-time':
      workoutHour = 13;
      break;
    case 'afternoon':
      workoutHour = 16;
      break;
    case 'evening':
      workoutHour = 19;
      break;
    case 'night':
      workoutHour = 22;
      break;
    default:
      workoutHour = 12;
  }

  return workoutHour * 60;
}

function getMealTypeFromIndex(index: number, frequency: number): string {
  return MEAL_NAMES[index] ?? `Meal ${index + 1}`;
}

function getMealFocus(
  mealType: string,
  goal: MealTimingGoal,
): string {
  if (mealType.includes('Workout')) {
    return mealType.includes('Pre')
      ? 'Complex Carbs & Protein, Low Fat'
      : 'Fast Carbs & High Protein';
  }

  switch (goal) {
    case 'muscle-gain':
      return 'High Protein, Moderate Carbs';
    case 'fat-loss':
      return 'High Protein, High Fiber';
    case 'performance':
      return 'Balanced Macronutrients';
    case 'endurance':
      return 'Carb-focused';
    case 'strength':
      return 'Protein & Carb focused';
    case 'general-health':
      return 'Balanced Whole Foods';
    default:
      return 'Balanced';
  }
}

function isPreWorkout(
  mealAbsoluteMinutes: number,
  workoutStartMinutes: number,
): boolean {
  const windowStart = workoutStartMinutes - 180;
  const windowEnd = workoutStartMinutes - 60;
  return (
    mealAbsoluteMinutes >= windowStart && mealAbsoluteMinutes <= windowEnd
  );
}

function isPostWorkout(
  mealAbsoluteMinutes: number,
  workoutEndMinutes: number,
): boolean {
  const windowStart = workoutEndMinutes;
  const windowEnd = workoutEndMinutes + 60;
  return (
    mealAbsoluteMinutes >= windowStart && mealAbsoluteMinutes <= windowEnd
  );
}

function buildRecommendations(
  goal: MealTimingGoal,
): MealTimingRecommendation[] {
  const recommendations = GOAL_RECOMMENDATIONS[goal];

  return Object.entries(recommendations).map(([key, value]) => ({
    category: key.charAt(0).toUpperCase() + key.slice(1),
    guideline: value,
  }));
}

export function validateMealTimingValues(
  values: MealTimingValues,
): FieldErrors<MealTimingValues> {
  const errors: FieldErrors<MealTimingValues> = {};
  const frequency = Number(values.frequency);

  if (!values.goal) {
    errors.goal = MEAL_TIMING_ERRORS.goal;
  }

  if (!values.workoutSchedule) {
    errors.workoutSchedule = MEAL_TIMING_ERRORS.workoutSchedule;
  }

  if (!values.workoutDuration) {
    errors.workoutDuration = MEAL_TIMING_ERRORS.workoutDuration;
  }

  if (!values.workoutIntensity) {
    errors.workoutIntensity = MEAL_TIMING_ERRORS.workoutIntensity;
  }

  if (
    !Number.isInteger(frequency) ||
    frequency < 3 ||
    frequency > 6
  ) {
    errors.frequency = MEAL_TIMING_ERRORS.frequency;
  }

  if (!values.wakeTime) {
    errors.wakeTime = MEAL_TIMING_ERRORS.wakeTime;
  }

  if (!values.sleepTime) {
    errors.sleepTime = MEAL_TIMING_ERRORS.sleepTime;
  }

  if (values.wakeTime && values.sleepTime) {
    const wakeMinutes = parseTimeIntoMinutes(values.wakeTime);
    let sleepMinutes = parseTimeIntoMinutes(values.sleepTime);

    if (
      !Number.isFinite(wakeMinutes) ||
      !Number.isFinite(sleepMinutes)
    ) {
      errors.wakeTime = MEAL_TIMING_ERRORS.timeFormat;
      errors.sleepTime = MEAL_TIMING_ERRORS.timeFormat;
    } else {
      if (sleepMinutes <= wakeMinutes) {
        sleepMinutes += 24 * 60;
      }

      if (sleepMinutes - wakeMinutes <= 0) {
        errors.sleepTime = MEAL_TIMING_ERRORS.awakeTime;
      }
    }
  }

  return errors;
}

export function calculateMealTiming(
  values: MealTimingValues,
): MealTimingResult {
  const errors = validateMealTimingValues(values);

  if (Object.keys(errors).length > 0) {
    throw new Error('Invalid meal timing inputs.');
  }

  const goal = values.goal as MealTimingGoal;
  const workoutSchedule =
    values.workoutSchedule as MealTimingWorkoutSchedule;
  const workoutDuration = values.workoutDuration as MealTimingDuration;
  const frequency = Number(values.frequency);
  const wakeMinutes = parseTimeIntoMinutes(values.wakeTime);
  let sleepMinutes = parseTimeIntoMinutes(values.sleepTime);

  if (sleepMinutes <= wakeMinutes) {
    sleepMinutes += 24 * 60;
  }

  const awakeMinutes = sleepMinutes - wakeMinutes;
  const mealIntervalMinutes = awakeMinutes / frequency;
  const workoutStartMinutes = getWorkoutStartMinutes(workoutSchedule);
  const workoutEndMinutes =
    workoutStartMinutes + getDurationInMinutes(workoutDuration);
  const meals: MealTimingMeal[] = [];

  for (let index = 0; index < frequency; index += 1) {
    const mealAbsoluteMinutes = wakeMinutes + index * mealIntervalMinutes;
    const mealType = getMealTypeFromIndex(index, frequency);

    meals.push({
      time: formatMinutesToTime(mealAbsoluteMinutes),
      type: mealType,
      focus: getMealFocus(mealType, goal),
      isPreWorkout: isPreWorkout(mealAbsoluteMinutes, workoutStartMinutes),
      isPostWorkout: isPostWorkout(mealAbsoluteMinutes, workoutEndMinutes),
    });
  }

  const hasPre = meals.some((meal) => meal.isPreWorkout);
  const hasPost = meals.some((meal) => meal.isPostWorkout);

  if (!hasPre) {
    const idealPreMinutes = workoutStartMinutes - 90;

    if (
      idealPreMinutes > wakeMinutes &&
      !meals.some(
        (meal) => parseTimeIntoMinutes(meal.time) === idealPreMinutes,
      )
    ) {
      meals.push({
        time: formatMinutesToTime(idealPreMinutes),
        type: 'Pre-Workout Snack',
        focus: getMealFocus('Pre-Workout Snack', goal),
        isPreWorkout: true,
        isPostWorkout: false,
      });
    }
  }

  if (!hasPost) {
    const idealPostMinutes = workoutEndMinutes + 30;

    if (
      idealPostMinutes < sleepMinutes &&
      !meals.some(
        (meal) => parseTimeIntoMinutes(meal.time) === idealPostMinutes,
      )
    ) {
      meals.push({
        time: formatMinutesToTime(idealPostMinutes),
        type: 'Post-Workout Shake/Meal',
        focus: getMealFocus('Post-Workout Shake/Meal', goal),
        isPreWorkout: false,
        isPostWorkout: true,
      });
    }
  }

  meals.sort(
    (first, second) =>
      parseTimeIntoMinutes(first.time) - parseTimeIntoMinutes(second.time),
  );

  return {
    goal,
    goalLabel: goal.replace('-', ' ').toUpperCase(),
    workoutLabel: workoutSchedule.replace('-', ' ').toUpperCase(),
    frequency,
    wakeTime: values.wakeTime,
    sleepTime: values.sleepTime,
    scheduleLabel: `${values.wakeTime} - ${values.sleepTime}`,
    meals,
    timeline: TIMELINE,
    recommendations: buildRecommendations(goal),
    tips: TIPS,
  };
}
