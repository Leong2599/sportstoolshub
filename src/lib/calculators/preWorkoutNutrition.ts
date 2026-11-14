import {parseNumber} from './units';
import type {FieldErrors} from './validation';

export type PreWorkoutGender = 'male' | 'female';

export type PreWorkoutType =
  | 'strength'
  | 'endurance'
  | 'hiit'
  | 'sports'
  | 'flexibility'
  | 'mixed';

export type PreWorkoutIntensity = 'low' | 'moderate' | 'high' | 'maximal';

export type PreWorkoutGoal =
  | 'performance'
  | 'endurance'
  | 'strength'
  | 'weight-loss'
  | 'muscle-gain'
  | 'general';

export type PreWorkoutDigestion = 'high' | 'moderate' | 'low';

export type PreWorkoutDiet =
  | 'none'
  | 'vegetarian'
  | 'vegan'
  | 'gluten-free'
  | 'dairy-free'
  | 'low-fodmap'
  | 'keto';

export type PreWorkoutValues = {
  bodyWeight: string;
  gender: PreWorkoutGender;
  workoutType: PreWorkoutType | '';
  workoutDuration: string;
  workoutIntensity: PreWorkoutIntensity | '';
  workoutTime: string;
  primaryGoal: PreWorkoutGoal | '';
  digestionComfort: PreWorkoutDigestion | '';
  dietaryRestrictions: PreWorkoutDiet;
};

export type PreWorkoutTimelineItem = {
  time: string;
  meal: string;
};

export type PreWorkoutSuggestionGroup = {
  title: string;
  items: readonly string[];
};

export type PreWorkoutHydrationItem = {
  time: string;
  amount: string;
};

export type PreWorkoutResult = {
  totalCarbs: number;
  totalProtein: number;
  totalCalories: number;
  caloriesPerKg: string;
  timeline: readonly PreWorkoutTimelineItem[];
  suggestions: readonly PreWorkoutSuggestionGroup[];
  hydration: readonly PreWorkoutHydrationItem[];
};

export const PRE_WORKOUT_TYPES: readonly {
  value: PreWorkoutType;
  label: string;
}[] = [
  {value: 'strength', label: 'Strength Training'},
  {value: 'endurance', label: 'Endurance/Cardio'},
  {value: 'hiit', label: 'HIIT/Interval Training'},
  {value: 'sports', label: 'Team Sports'},
  {value: 'flexibility', label: 'Flexibility/Yoga'},
  {value: 'mixed', label: 'Mixed Training'},
] as const;

export const PRE_WORKOUT_INTENSITIES: readonly {
  value: PreWorkoutIntensity;
  label: string;
}[] = [
  {value: 'low', label: 'Low (Light activity)'},
  {value: 'moderate', label: 'Moderate (Challenging but manageable)'},
  {value: 'high', label: 'High (Very challenging)'},
  {value: 'maximal', label: 'Maximal (Competition/intense)'},
] as const;

export const PRE_WORKOUT_GOALS: readonly {
  value: PreWorkoutGoal;
  label: string;
}[] = [
  {value: 'performance', label: 'Maximum Performance'},
  {value: 'endurance', label: 'Endurance/Sustained Energy'},
  {value: 'strength', label: 'Power/Strength'},
  {value: 'weight-loss', label: 'Weight Loss'},
  {value: 'muscle-gain', label: 'Muscle Gain'},
  {value: 'general', label: 'General Fitness'},
] as const;

export const PRE_WORKOUT_DIGESTION: readonly {
  value: PreWorkoutDigestion;
  label: string;
}[] = [
  {value: 'high', label: 'High (Easily digestible foods only)'},
  {value: 'moderate', label: 'Moderate (Standard recommendations)'},
  {value: 'low', label: 'Low (Can handle varied foods)'},
] as const;

export const PRE_WORKOUT_DIETS: readonly {
  value: PreWorkoutDiet;
  label: string;
}[] = [
  {value: 'none', label: 'No restrictions'},
  {value: 'vegetarian', label: 'Vegetarian'},
  {value: 'vegan', label: 'Vegan'},
  {value: 'gluten-free', label: 'Gluten-free'},
  {value: 'dairy-free', label: 'Dairy-free'},
  {value: 'low-fodmap', label: 'Low FODMAP'},
  {value: 'keto', label: 'Ketogenic'},
] as const;

export const PRE_WORKOUT_GENDERS: readonly {
  value: PreWorkoutGender;
  label: string;
}[] = [
  {value: 'male', label: 'Male'},
  {value: 'female', label: 'Female'},
] as const;

export const PRE_WORKOUT_ERRORS = {
  bodyWeight: 'Please enter a valid body weight.',
  workoutType: 'Please select a workout type.',
  workoutDuration: 'Please enter a valid workout duration.',
  workoutIntensity: 'Please select an intensity level.',
  workoutTime: 'Please enter your workout start time.',
  primaryGoal: 'Please select a primary goal.',
  digestionComfort: 'Please select a digestive comfort priority.',
} as const;

const HYDRATION: readonly PreWorkoutHydrationItem[] = [
  {time: '2-3 hours before', amount: '500-600ml water'},
  {time: '20-30 minutes before', amount: '200-300ml water'},
  {time: 'During workout', amount: '150-200ml every 15-20 min'},
  {time: 'For >90min sessions', amount: 'Consider electrolyte drink'},
] as const;

export function validatePreWorkoutValues(
  values: PreWorkoutValues,
): FieldErrors<PreWorkoutValues> {
  const errors: FieldErrors<PreWorkoutValues> = {};
  const bodyWeight = parseNumber(values.bodyWeight);
  const duration = parseNumber(values.workoutDuration);

  if (bodyWeight === null || bodyWeight <= 0) {
    errors.bodyWeight = PRE_WORKOUT_ERRORS.bodyWeight;
  }

  if (!values.workoutType) {
    errors.workoutType = PRE_WORKOUT_ERRORS.workoutType;
  }

  if (duration === null || duration <= 0) {
    errors.workoutDuration = PRE_WORKOUT_ERRORS.workoutDuration;
  }

  if (!values.workoutIntensity) {
    errors.workoutIntensity = PRE_WORKOUT_ERRORS.workoutIntensity;
  }

  if (!values.workoutTime) {
    errors.workoutTime = PRE_WORKOUT_ERRORS.workoutTime;
  }

  if (!values.primaryGoal) {
    errors.primaryGoal = PRE_WORKOUT_ERRORS.primaryGoal;
  }

  if (!values.digestionComfort) {
    errors.digestionComfort = PRE_WORKOUT_ERRORS.digestionComfort;
  }

  return errors;
}

function suggestionGroups(
  diet: PreWorkoutDiet,
): PreWorkoutSuggestionGroup[] {
  if (diet === 'vegan' || diet === 'vegetarian') {
    return [
      {
        title: 'Plant-Based Options',
        items: [
          'Oatmeal with banana and nut butter',
          'Quinoa bowl with sweet potato',
          'Smoothie with plant protein',
        ],
      },
    ];
  }

  return [
    {
      title: 'Quick Energy Sources',
      items: [
        'Banana with almond butter',
        'Oatmeal with berries',
        'Rice cakes with honey',
      ],
    },
    {
      title: 'Protein Sources',
      items: [
        'Greek yogurt',
        'Protein shake',
        'Chicken breast (3+ hours before)',
      ],
    },
  ];
}

export function calculatePreWorkout(
  values: PreWorkoutValues,
): PreWorkoutResult {
  const errors = validatePreWorkoutValues(values);

  if (Object.keys(errors).length > 0) {
    throw new Error('Invalid pre-workout inputs.');
  }

  const bodyWeight = parseNumber(values.bodyWeight) as number;
  const workoutType = values.workoutType as PreWorkoutType;
  const workoutIntensity = values.workoutIntensity as PreWorkoutIntensity;
  let carbsPerKg = 1.5;
  let proteinPerKg = 0.25;

  if (workoutType === 'endurance') {
    carbsPerKg = 3.0;
    proteinPerKg = 0.2;
  } else if (workoutType === 'hiit') {
    carbsPerKg = 2.0;
    proteinPerKg = 0.3;
  } else if (workoutType === 'strength') {
    carbsPerKg = 1.0;
    proteinPerKg = 0.4;
  }

  const intensityMultiplier =
    workoutIntensity === 'low'
      ? 0.8
      : workoutIntensity === 'moderate'
        ? 1.0
        : workoutIntensity === 'high'
          ? 1.2
          : 1.4;

  carbsPerKg *= intensityMultiplier;
  proteinPerKg *= intensityMultiplier;

  const totalCarbs = Math.round(carbsPerKg * bodyWeight);
  const totalProtein = Math.round(proteinPerKg * bodyWeight);
  const totalCalories = totalCarbs * 4 + totalProtein * 4;
  const timeline: PreWorkoutTimelineItem[] = [
    {time: '3-4 hours before', meal: 'Full meal: 50-60% of total carbs'},
    {time: '1-2 hours before', meal: 'Light snack: 20-30% of total carbs'},
    {
      time: '30-60 minutes before',
      meal:
        workoutType === 'endurance'
          ? 'Quick fuel: 10-20% of total carbs'
          : 'Optional light snack',
    },
    {time: 'Workout time', meal: 'Focus on hydration during exercise'},
  ];

  return {
    totalCarbs,
    totalProtein,
    totalCalories,
    caloriesPerKg: (totalCalories / bodyWeight).toFixed(1),
    timeline,
    suggestions: suggestionGroups(values.dietaryRestrictions),
    hydration: HYDRATION,
  };
}
