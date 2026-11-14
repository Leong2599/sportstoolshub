import {parseNumber} from './units';
import type {FieldErrors} from './validation';

export type PostWorkoutFitness =
  | 'beginner'
  | 'intermediate'
  | 'advanced'
  | 'elite';

export type PostWorkoutGoal =
  | 'muscle-gain'
  | 'strength'
  | 'endurance'
  | 'fat-loss'
  | 'performance'
  | 'maintenance';

export type PostWorkoutType =
  | 'strength'
  | 'endurance'
  | 'hiit'
  | 'sports'
  | 'mixed'
  | 'endurance-strength';

export type PostWorkoutTimeSince =
  | 'immediately'
  | '30min'
  | '1hour'
  | '2hours'
  | '3hours';

export type PostWorkoutNextTime =
  | '8hours'
  | '12hours'
  | '24hours'
  | '48hours'
  | '72hours';

export type PostWorkoutNextType =
  | ''
  | 'strength'
  | 'endurance'
  | 'hiit'
  | 'sports'
  | 'recovery';

export type PostWorkoutDiet =
  | 'none'
  | 'vegetarian'
  | 'vegan'
  | 'gluten-free'
  | 'dairy-free'
  | 'low-fodmap'
  | 'paleo'
  | 'keto';

export type PostWorkoutMealType = 'shake' | 'light' | 'full' | 'flexible';

export type PostWorkoutValues = {
  currentWeight: string;
  bodyFat: string;
  fitnessLevel: PostWorkoutFitness | '';
  primaryGoal: PostWorkoutGoal | '';
  workoutType: PostWorkoutType | '';
  workoutDuration: string;
  workoutIntensity: string;
  timeSinceWorkout: PostWorkoutTimeSince;
  nextWorkoutTime: PostWorkoutNextTime | '';
  nextWorkoutType: PostWorkoutNextType;
  dietaryRestrictions: PostWorkoutDiet;
  mealType: PostWorkoutMealType;
};

export type PostWorkoutSuggestionGroup = {
  title: string;
  items: readonly string[];
};

export type PostWorkoutSupplement = {
  title: string;
  body: string;
};

export type PostWorkoutResult = {
  totalProtein: number;
  totalCarbs: number;
  totalCalories: number;
  ratioDisplay: string;
  timingTitle: string;
  timingBody: string;
  targetConsumption: string;
  suggestions: readonly PostWorkoutSuggestionGroup[];
  estimatedFluidLoss: number;
  immediateFluidGoal: number;
  supplements: readonly PostWorkoutSupplement[];
};

export const POST_WORKOUT_FITNESS_LEVELS: readonly {
  value: PostWorkoutFitness;
  label: string;
}[] = [
  {value: 'beginner', label: 'Beginner (< 6 months training)'},
  {
    value: 'intermediate',
    label: 'Intermediate (6 months - 2 years)',
  },
  {value: 'advanced', label: 'Advanced (2-5 years)'},
  {value: 'elite', label: 'Elite (> 5 years or competitive)'},
] as const;

export const POST_WORKOUT_GOALS: readonly {
  value: PostWorkoutGoal;
  label: string;
}[] = [
  {value: 'muscle-gain', label: 'Muscle Gain/Hypertrophy'},
  {value: 'strength', label: 'Strength Development'},
  {value: 'endurance', label: 'Endurance Performance'},
  {value: 'fat-loss', label: 'Fat Loss'},
  {value: 'performance', label: 'Athletic Performance'},
  {value: 'maintenance', label: 'General Maintenance'},
] as const;

export const POST_WORKOUT_TYPES: readonly {
  value: PostWorkoutType;
  label: string;
}[] = [
  {value: 'strength', label: 'Strength Training'},
  {value: 'endurance', label: 'Endurance/Cardio'},
  {value: 'hiit', label: 'HIIT/Metabolic Conditioning'},
  {value: 'sports', label: 'Team Sports/Game'},
  {value: 'mixed', label: 'Strength + Cardio'},
  {value: 'endurance-strength', label: 'Endurance + Strength'},
] as const;

export const POST_WORKOUT_TIME_SINCE: readonly {
  value: PostWorkoutTimeSince;
  label: string;
}[] = [
  {value: 'immediately', label: 'Immediately (within 15 min)'},
  {value: '30min', label: '30 minutes ago'},
  {value: '1hour', label: '1 hour ago'},
  {value: '2hours', label: '2 hours ago'},
  {value: '3hours', label: '3+ hours ago'},
] as const;

export const POST_WORKOUT_NEXT_TIMES: readonly {
  value: PostWorkoutNextTime;
  label: string;
}[] = [
  {value: '8hours', label: '8 hours (later today)'},
  {value: '12hours', label: '12 hours (tonight/early morning)'},
  {value: '24hours', label: '24 hours (tomorrow)'},
  {value: '48hours', label: '48 hours (day after tomorrow)'},
  {value: '72hours', label: '3+ days'},
] as const;

export const POST_WORKOUT_NEXT_TYPES: readonly {
  value: PostWorkoutNextType;
  label: string;
}[] = [
  {value: '', label: 'Same as today'},
  {value: 'strength', label: 'Strength Training'},
  {value: 'endurance', label: 'Endurance/Cardio'},
  {value: 'hiit', label: 'HIIT/Metabolic'},
  {value: 'sports', label: 'Team Sports/Game'},
  {value: 'recovery', label: 'Recovery/Active Rest'},
] as const;

export const POST_WORKOUT_DIETS: readonly {
  value: PostWorkoutDiet;
  label: string;
}[] = [
  {value: 'none', label: 'No restrictions'},
  {value: 'vegetarian', label: 'Vegetarian'},
  {value: 'vegan', label: 'Vegan'},
  {value: 'gluten-free', label: 'Gluten-free'},
  {value: 'dairy-free', label: 'Dairy-free'},
  {value: 'low-fodmap', label: 'Low FODMAP'},
  {value: 'paleo', label: 'Paleo'},
  {value: 'keto', label: 'Ketogenic'},
] as const;

export const POST_WORKOUT_MEAL_TYPES: readonly {
  value: PostWorkoutMealType;
  label: string;
}[] = [
  {value: 'shake', label: 'Recovery Shake/Smoothie'},
  {value: 'light', label: 'Light Meal/Snack'},
  {value: 'full', label: 'Full Meal'},
  {value: 'flexible', label: 'Flexible - whatever works'},
] as const;

export const POST_WORKOUT_ERRORS = {
  currentWeight: 'Please enter a valid body weight.',
  fitnessLevel: 'Please select your fitness level.',
  primaryGoal: 'Please select your primary training goal.',
  workoutType: 'Please select a workout type.',
  workoutDuration: 'Please enter a valid workout duration.',
  workoutIntensity: 'Please select a workout intensity (1-10).',
  nextWorkoutTime: 'Please select when your next workout is.',
} as const;

const SUPPLEMENTS: readonly PostWorkoutSupplement[] = [
  {
    title: 'Optional - Creatine',
    body: '5g post-workout for strength/power athletes',
  },
  {
    title: 'Optional - BCAA',
    body: '5-10g if training fasted or very intense',
  },
  {
    title: 'Optional - Tart Cherry',
    body: 'Reduces muscle soreness for recovery',
  },
] as const;

export function validatePostWorkoutValues(
  values: PostWorkoutValues,
): FieldErrors<PostWorkoutValues> {
  const errors: FieldErrors<PostWorkoutValues> = {};
  const weight = parseNumber(values.currentWeight);
  const duration = parseNumber(values.workoutDuration);
  const intensity = parseNumber(values.workoutIntensity);

  if (weight === null || weight <= 0) {
    errors.currentWeight = POST_WORKOUT_ERRORS.currentWeight;
  }

  if (!values.fitnessLevel) {
    errors.fitnessLevel = POST_WORKOUT_ERRORS.fitnessLevel;
  }

  if (!values.primaryGoal) {
    errors.primaryGoal = POST_WORKOUT_ERRORS.primaryGoal;
  }

  if (!values.workoutType) {
    errors.workoutType = POST_WORKOUT_ERRORS.workoutType;
  }

  if (duration === null || duration <= 0) {
    errors.workoutDuration = POST_WORKOUT_ERRORS.workoutDuration;
  }

  if (
    intensity === null ||
    !Number.isInteger(intensity) ||
    intensity < 1 ||
    intensity > 10
  ) {
    errors.workoutIntensity = POST_WORKOUT_ERRORS.workoutIntensity;
  }

  if (!values.nextWorkoutTime) {
    errors.nextWorkoutTime = POST_WORKOUT_ERRORS.nextWorkoutTime;
  }

  return errors;
}

function timingFor(
  timeSince: PostWorkoutTimeSince,
): Pick<PostWorkoutResult, 'timingTitle' | 'timingBody'> {
  if (timeSince === 'immediately') {
    return {
      timingTitle: 'Immediate Recovery Window',
      timingBody:
        'Perfect timing! This is when muscle protein synthesis is highest.',
    };
  }

  if (timeSince === '30min') {
    return {
      timingTitle: 'Optimal Recovery Window',
      timingBody:
        'Great timing! Still within optimal window for recovery.',
    };
  }

  return {
    timingTitle: 'Delayed Recovery',
    timingBody:
      'Late, but still beneficial. Focus on quickly digestible nutrients.',
  };
}

function suggestionGroups(
  diet: PostWorkoutDiet,
  totalProtein: number,
  totalCarbs: number,
): PostWorkoutSuggestionGroup[] {
  if (diet === 'vegan') {
    return [
      {
        title: 'Plant-Based Recovery',
        items: [
          'Plant protein shake with banana',
          'Quinoa bowl with beans and vegetables',
          'Smoothie with plant protein and berries',
        ],
      },
    ];
  }

  return [
    {
      title: 'Quick Recovery Options',
      items: [
        'Protein shake with banana',
        'Greek yogurt with honey and berries',
        'Chicken breast with sweet potato',
      ],
    },
    {
      title: 'Meal Combinations',
      items: [
        `${totalProtein}g protein + ${totalCarbs}g fast carbs`,
        'Chocolate milk (natural 3:1 ratio)',
        'Salmon with rice and vegetables',
      ],
    },
  ];
}

export function calculatePostWorkout(
  values: PostWorkoutValues,
): PostWorkoutResult {
  const errors = validatePostWorkoutValues(values);

  if (Object.keys(errors).length > 0) {
    throw new Error('Invalid post-workout inputs.');
  }

  const currentWeight = parseNumber(values.currentWeight) as number;
  const workoutType = values.workoutType as PostWorkoutType;
  const workoutDuration = parseNumber(values.workoutDuration) as number;
  const workoutIntensity = parseNumber(values.workoutIntensity) as number;
  const intensityMultiplier = workoutIntensity / 5;
  let proteinPerKg = 0.25;

  if (workoutType === 'strength') {
    proteinPerKg = 0.3;
  } else if (workoutType === 'endurance') {
    proteinPerKg = 0.2;
  } else if (workoutType === 'hiit') {
    proteinPerKg = 0.35;
  }

  proteinPerKg *= intensityMultiplier;

  const totalProtein = Math.max(
    20,
    Math.min(40, Math.round(proteinPerKg * currentWeight)),
  );
  let carbsPerKg = 1.0;

  if (workoutType === 'endurance') {
    carbsPerKg = 1.2;
  } else if (workoutType === 'strength') {
    carbsPerKg = 0.8;
  } else if (workoutType === 'hiit') {
    carbsPerKg = 1.0;
  }

  if (workoutDuration > 90) {
    carbsPerKg *= 1.2;
  } else if (workoutDuration < 30) {
    carbsPerKg *= 0.7;
  }

  const totalCarbs = Math.round(carbsPerKg * currentWeight);
  const totalCalories = totalProtein * 4 + totalCarbs * 4;
  const timing = timingFor(values.timeSinceWorkout);
  const estimatedFluidLoss = Math.round(
    workoutDuration * 15 * intensityMultiplier,
  );

  return {
    totalProtein,
    totalCarbs,
    totalCalories,
    ratioDisplay: `${Math.round(totalCarbs / totalProtein)}:1`,
    timingTitle: timing.timingTitle,
    timingBody: timing.timingBody,
    targetConsumption: 'Within 30-120 minutes post-workout',
    suggestions: suggestionGroups(
      values.dietaryRestrictions,
      totalProtein,
      totalCarbs,
    ),
    estimatedFluidLoss,
    immediateFluidGoal: Math.round(estimatedFluidLoss * 1.5),
    supplements: SUPPLEMENTS,
  };
}
