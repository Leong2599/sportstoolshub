import {
  parseNumber,
  toKilograms,
  type WeightUnit,
} from './units';
import type {FieldErrors} from './validation';

export type ProteinGender = 'male' | 'female';

export type ProteinActivity =
  | 'sedentary'
  | 'light'
  | 'moderate'
  | 'active'
  | 'very-active'
  | 'athlete';

export type ProteinGoal =
  | 'maintain'
  | 'lose-fat'
  | 'build-muscle'
  | 'gain-strength'
  | 'endurance'
  | 'general-health';

export type ProteinDiet =
  | 'omnivore'
  | 'vegetarian'
  | 'vegan'
  | 'pescatarian';

export type ProteinValues = {
  weight: string;
  weightUnit: WeightUnit;
  gender: ProteinGender | '';
  age: string;
  activityLevel: ProteinActivity | '';
  fitnessGoal: ProteinGoal | '';
  dietType: ProteinDiet | '';
};

export type ProteinMeal = {
  label: string;
  grams: number;
  display: string;
};

export type ProteinSourceGroup = {
  title: string;
  items: readonly string[];
};

export type ProteinResult = {
  weightKg: number;
  dailyProtein: number;
  display: string;
  proteinPerKg: string;
  perKgDisplay: string;
  meals: readonly ProteinMeal[];
  sources: readonly ProteinSourceGroup[];
  recommendations: string;
};

export const PROTEIN_ACTIVITIES: readonly {
  value: ProteinActivity;
  label: string;
}[] = [
  {value: 'sedentary', label: 'Sedentary (little or no exercise)'},
  {value: 'light', label: 'Light (exercise 1-3 days/week)'},
  {value: 'moderate', label: 'Moderate (exercise 3-5 days/week)'},
  {value: 'active', label: 'Active (exercise 6-7 days/week)'},
  {
    value: 'very-active',
    label: 'Very Active (hard exercise 6-7 days/week)',
  },
  {value: 'athlete', label: 'Athlete (elite training 2x/day)'},
] as const;

export const PROTEIN_GOALS: readonly {
  value: ProteinGoal;
  label: string;
}[] = [
  {value: 'maintain', label: 'Maintain Current Weight'},
  {value: 'lose-fat', label: 'Lose Fat (Weight Loss)'},
  {value: 'build-muscle', label: 'Build Muscle (Hypertrophy)'},
  {value: 'gain-strength', label: 'Gain Strength'},
  {value: 'endurance', label: 'Improve Endurance'},
  {value: 'general-health', label: 'General Health'},
] as const;

export const PROTEIN_DIETS: readonly {
  value: ProteinDiet;
  label: string;
}[] = [
  {value: 'omnivore', label: 'Omnivore (mixed diet)'},
  {value: 'vegetarian', label: 'Vegetarian'},
  {value: 'vegan', label: 'Vegan'},
  {value: 'pescatarian', label: 'Pescatarian'},
] as const;

export const PROTEIN_ERRORS = {
  weight: 'Please enter a valid weight (min 30).',
  gender: 'Please select your gender.',
  age: 'Please enter a valid age (15-100).',
  activityLevel: 'Please select your activity level.',
  fitnessGoal: 'Please select your fitness goal.',
  dietType: 'Please select your diet type.',
} as const;

const ACTIVITY_MULTIPLIERS: Record<ProteinActivity, number> = {
  sedentary: 0.8,
  light: 1.0,
  moderate: 1.2,
  active: 1.4,
  'very-active': 1.6,
  athlete: 2.0,
};

const GOAL_MULTIPLIERS: Record<ProteinGoal, number> = {
  maintain: 1.0,
  'lose-fat': 1.2,
  'build-muscle': 1.5,
  'gain-strength': 1.4,
  endurance: 1.3,
  'general-health': 1.0,
};

export function validateProteinValues(
  values: ProteinValues,
): FieldErrors<ProteinValues> {
  const errors: FieldErrors<ProteinValues> = {};
  const weight = parseNumber(values.weight);
  const age = parseNumber(values.age);

  if (weight === null || weight < 30) {
    errors.weight = PROTEIN_ERRORS.weight;
  }

  if (!values.gender) {
    errors.gender = PROTEIN_ERRORS.gender;
  }

  if (age === null || age < 15 || age > 100) {
    errors.age = PROTEIN_ERRORS.age;
  }

  if (!values.activityLevel) {
    errors.activityLevel = PROTEIN_ERRORS.activityLevel;
  }

  if (!values.fitnessGoal) {
    errors.fitnessGoal = PROTEIN_ERRORS.fitnessGoal;
  }

  if (!values.dietType) {
    errors.dietType = PROTEIN_ERRORS.dietType;
  }

  return errors;
}

function formatMeal(label: string, grams: number): ProteinMeal {
  return {label, grams, display: `${grams}g`};
}

function proteinSources(dietType: ProteinDiet): ProteinSourceGroup[] {
  const sources: ProteinSourceGroup[] = [];

  if (dietType === 'omnivore' || dietType === 'pescatarian') {
    sources.push({
      title: 'Complete Protein Sources',
      items: [
        'Chicken breast, turkey, lean beef',
        'Fish (salmon, tuna, cod)',
        'Eggs and dairy products',
        'Greek yogurt, cottage cheese',
      ],
    });
  }

  if (dietType === 'vegetarian' || dietType === 'vegan') {
    sources.push({
      title: 'Plant-Based Proteins',
      items: [
        'Legumes (lentils, beans, chickpeas)',
        'Quinoa and whole grains',
        'Nuts and seeds (hemp, chia, pumpkin)',
        'Tofu, tempeh, edamame',
        'Protein powder (pea, rice, hemp)',
      ],
    });
  }

  sources.push({
    title: 'Protein Timing Tips',
    items: [
      'Aim for 20-30g protein per meal',
      'Include protein within 2 hours post-workout',
      'Consider casein before bed for recovery',
      'Spread intake evenly throughout the day',
    ],
  });

  return sources;
}

function proteinRecommendations(
  dailyProtein: number,
  proteinPerKg: string,
  fitnessGoal: ProteinGoal,
  dietType: ProteinDiet,
): string {
  let recommendations = `Your daily protein requirement is ${dailyProtein}g (${proteinPerKg}g per kg body weight). `;

  switch (fitnessGoal) {
    case 'build-muscle':
      recommendations +=
        'For muscle building, consume protein within 2 hours post-workout and include a complete protein source in each meal. Consider creatine supplementation for enhanced results.';
      break;
    case 'lose-fat':
      recommendations +=
        'For fat loss, high protein intake helps preserve muscle mass and increases satiety. Focus on lean protein sources and spread intake evenly throughout the day.';
      break;
    case 'gain-strength':
      recommendations +=
        'For strength gains, prioritize protein around training sessions. Include both fast-digesting (post-workout) and slow-digesting (before bed) proteins.';
      break;
    case 'endurance':
      recommendations +=
        'For endurance, protein helps repair muscle damage from long training sessions. Include protein in recovery meals and consider carbohydrate-protein combinations during long events.';
      break;
    default:
      recommendations +=
        'Maintain consistent protein intake across meals for optimal health and muscle maintenance.';
  }

  if (dietType === 'vegan' || dietType === 'vegetarian') {
    recommendations +=
      ' Since you follow a plant-based diet, focus on combining different protein sources to ensure complete amino acid profiles. Consider fortified foods or supplements for vitamin B12.';
  }

  return recommendations;
}

export function calculateProtein(values: ProteinValues): ProteinResult {
  const weight = parseNumber(values.weight);
  const age = parseNumber(values.age);

  if (
    weight === null ||
    weight < 30 ||
    age === null ||
    age < 15 ||
    age > 100 ||
    !values.gender ||
    !values.activityLevel ||
    !values.fitnessGoal ||
    !values.dietType
  ) {
    throw new Error('Invalid protein inputs.');
  }

  const weightKg = toKilograms(weight, values.weightUnit);
  let proteinMultiplier = 1.0;

  if (age > 65) {
    proteinMultiplier += 0.1;
  }

  const baseMultiplier =
    ACTIVITY_MULTIPLIERS[values.activityLevel] *
    GOAL_MULTIPLIERS[values.fitnessGoal];
  proteinMultiplier = baseMultiplier * proteinMultiplier;

  if (values.dietType === 'vegan' || values.dietType === 'vegetarian') {
    proteinMultiplier *= 1.1;
  }

  const dailyProtein = Math.round(weightKg * proteinMultiplier);
  const proteinPerKg = (dailyProtein / weightKg).toFixed(1);
  const breakfast = Math.round(dailyProtein * 0.25);
  const lunch = Math.round(dailyProtein * 0.3);
  const dinner = Math.round(dailyProtein * 0.3);
  const snacks = dailyProtein - breakfast - lunch - dinner;

  return {
    weightKg,
    dailyProtein,
    display: `${dailyProtein}g`,
    proteinPerKg,
    perKgDisplay: `${proteinPerKg}g/kg`,
    meals: [
      formatMeal('Breakfast', breakfast),
      formatMeal('Lunch', lunch),
      formatMeal('Dinner', dinner),
      formatMeal('Snacks', snacks),
    ],
    sources: proteinSources(values.dietType),
    recommendations: proteinRecommendations(
      dailyProtein,
      proteinPerKg,
      values.fitnessGoal,
      values.dietType,
    ),
  };
}
