import {
  parseNumber,
  toKilograms,
  type HeightUnit,
  type WeightUnit,
} from './units';
import {
  NUTRITION_ACTIVITY_FACTORS,
  harrisBenedictBmr,
  macroTdeeHeightCm,
  type NutritionActivityLevel,
  type NutritionGender,
} from './nutritionMetrics';
import type {FieldErrors} from './validation';

export type MacroCalculationMethod = 'tdee' | 'manual';

export type MacroGoal =
  | 'lose-weight'
  | 'maintain'
  | 'gain-muscle'
  | 'gain-strength'
  | 'endurance'
  | 'ketogenic'
  | 'custom';

export type MacroDiet =
  | 'standard'
  | 'low-carb'
  | 'high-carb'
  | 'low-fat'
  | 'high-fat'
  | 'vegetarian'
  | 'vegan'
  | 'paleo';

export type MacroValues = {
  calculationMethod: MacroCalculationMethod | '';
  weight: string;
  weightUnit: WeightUnit;
  height: string;
  heightUnit: HeightUnit;
  inches: string;
  age: string;
  gender: NutritionGender | '';
  activityLevel: NutritionActivityLevel | '';
  dailyCalories: string;
  fitnessGoal: MacroGoal | '';
  customProtein: string;
  customCarbs: string;
  customFats: string;
  dietPreference: MacroDiet;
};

export type MacroRatios = {
  protein: number;
  carbs: number;
  fats: number;
};

export type MacroBreakdown = {
  grams: number;
  calories: number;
  percentage: number;
};

export type MacroMeal = {
  name: string;
  protein: number;
  carbs: number;
  fats: number;
};

export type MacroFoodSource = {
  title: string;
  items: readonly string[];
};

export type MacroResult = {
  dailyCalories: number;
  display: string;
  ratios: MacroRatios;
  macros: {
    protein: MacroBreakdown;
    carbs: MacroBreakdown;
    fats: MacroBreakdown;
  };
  mealPlan: readonly MacroMeal[];
  foodSources: readonly MacroFoodSource[];
  recommendations: string;
};

export const MACRO_METHODS: readonly {
  value: MacroCalculationMethod;
  label: string;
}[] = [
  {
    value: 'tdee',
    label: 'Based on TDEE (Total Daily Energy Expenditure)',
  },
  {value: 'manual', label: 'Manual Calorie Input'},
] as const;

export const MACRO_ACTIVITIES: readonly {
  value: NutritionActivityLevel;
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
] as const;

export const MACRO_GOALS: readonly {
  value: MacroGoal;
  label: string;
}[] = [
  {value: 'lose-weight', label: 'Lose Weight (Cutting)'},
  {value: 'maintain', label: 'Maintain Weight'},
  {value: 'gain-muscle', label: 'Gain Muscle (Bulking)'},
  {value: 'gain-strength', label: 'Gain Strength'},
  {value: 'endurance', label: 'Improve Endurance'},
  {value: 'ketogenic', label: 'Ketogenic Diet'},
  {value: 'custom', label: 'Custom Ratios'},
] as const;

export const MACRO_DIETS: readonly {
  value: MacroDiet;
  label: string;
}[] = [
  {value: 'standard', label: 'Standard (Balanced)'},
  {value: 'low-carb', label: 'Low Carb'},
  {value: 'high-carb', label: 'High Carb'},
  {value: 'low-fat', label: 'Low Fat'},
  {value: 'high-fat', label: 'High Fat'},
  {value: 'vegetarian', label: 'Vegetarian'},
  {value: 'vegan', label: 'Vegan'},
  {value: 'paleo', label: 'Paleo'},
] as const;

export const MACRO_ERRORS = {
  calculationMethod: 'Please select a calculation method.',
  age: 'Please enter a valid age (15-100).',
  gender: 'Please select your gender.',
  weight: 'Please enter a valid weight (min 30).',
  activityLevel: 'Please select your activity level.',
  heightCm: 'Please enter a valid height in cm (50-300).',
  heightFeetInches:
    'Please enter a valid height in feet (1-9) and inches (0-11).',
  dailyCalories: 'Please enter a valid daily calorie target (800-5000).',
  fitnessGoal: 'Please select a fitness goal.',
  customRatios: 'Please enter valid custom macro percentages.',
  customTotal: 'Custom macro percentages must total 100%',
} as const;

const GOAL_RATIOS: Record<Exclude<MacroGoal, 'custom'>, MacroRatios> = {
  'lose-weight': {protein: 40, carbs: 30, fats: 30},
  maintain: {protein: 30, carbs: 40, fats: 30},
  'gain-muscle': {protein: 30, carbs: 45, fats: 25},
  'gain-strength': {protein: 35, carbs: 40, fats: 25},
  endurance: {protein: 25, carbs: 55, fats: 20},
  ketogenic: {protein: 25, carbs: 5, fats: 70},
};

export function adjustRatiosForDiet(
  ratios: MacroRatios,
  diet: MacroDiet,
): MacroRatios {
  const adjusted = {...ratios};
  const minMacro = 5;

  switch (diet) {
    case 'low-carb':
      adjusted.carbs = Math.max(minMacro, Math.min(adjusted.carbs, 20));
      adjusted.protein = Math.max(adjusted.protein, 35);
      adjusted.fats = Math.max(
        minMacro,
        100 - adjusted.carbs - adjusted.protein,
      );
      break;
    case 'high-carb':
      adjusted.carbs = Math.min(70, Math.max(adjusted.carbs, 50));
      adjusted.fats = Math.min(adjusted.fats, 25);
      adjusted.protein = Math.max(
        minMacro,
        100 - adjusted.carbs - adjusted.fats,
      );
      break;
    case 'low-fat':
      adjusted.fats = Math.max(minMacro, Math.min(adjusted.fats, 20));
      adjusted.protein = Math.max(adjusted.protein, 35);
      adjusted.carbs = Math.max(
        minMacro,
        100 - adjusted.fats - adjusted.protein,
      );
      break;
    case 'high-fat':
      adjusted.fats = Math.min(70, Math.max(adjusted.fats, 40));
      adjusted.carbs = Math.min(adjusted.carbs, 30);
      adjusted.protein = Math.max(
        minMacro,
        100 - adjusted.fats - adjusted.carbs,
      );
      break;
    case 'vegetarian':
    case 'vegan':
      adjusted.protein = Math.min(
        40,
        Math.max(adjusted.protein, adjusted.protein + 5),
      );
      adjusted.carbs = Math.max(minMacro, adjusted.carbs - 2);
      adjusted.fats = Math.max(
        minMacro,
        100 - adjusted.carbs - adjusted.protein,
      );
      break;
    default:
      break;
  }

  const totalAdjusted =
    adjusted.protein + adjusted.carbs + adjusted.fats;

  if (totalAdjusted !== 100 && totalAdjusted > 0) {
    adjusted.protein = Math.round((adjusted.protein / totalAdjusted) * 100);
    adjusted.carbs = Math.round((adjusted.carbs / totalAdjusted) * 100);
    adjusted.fats = 100 - adjusted.protein - adjusted.carbs;
  }

  return adjusted;
}

export function validateMacroValues(
  values: MacroValues,
): FieldErrors<MacroValues> {
  const errors: FieldErrors<MacroValues> = {};

  if (!values.calculationMethod) {
    errors.calculationMethod = MACRO_ERRORS.calculationMethod;
  } else if (values.calculationMethod === 'tdee') {
    const age = parseNumber(values.age);
    const weight = parseNumber(values.weight);

    if (age === null || age < 15 || age > 100) {
      errors.age = MACRO_ERRORS.age;
    }

    if (!values.gender) {
      errors.gender = MACRO_ERRORS.gender;
    }

    if (weight === null || weight < 30) {
      errors.weight = MACRO_ERRORS.weight;
    }

    if (!values.activityLevel) {
      errors.activityLevel = MACRO_ERRORS.activityLevel;
    }

    if (values.heightUnit === 'cm') {
      const height = parseNumber(values.height);

      if (height === null || height < 50 || height > 300) {
        errors.height = MACRO_ERRORS.heightCm;
      }
    } else {
      const feet = parseNumber(values.height);
      const inches = parseNumber(values.inches);

      if (
        feet === null ||
        inches === null ||
        feet < 1 ||
        feet > 9 ||
        inches < 0 ||
        inches > 11
      ) {
        errors.height = MACRO_ERRORS.heightFeetInches;
      }
    }
  } else {
    const calories = parseNumber(values.dailyCalories);

    if (calories === null || calories < 800 || calories > 5000) {
      errors.dailyCalories = MACRO_ERRORS.dailyCalories;
    }
  }

  if (!values.fitnessGoal) {
    errors.fitnessGoal = MACRO_ERRORS.fitnessGoal;
  }

  if (values.fitnessGoal === 'custom') {
    const protein = parseNumber(values.customProtein);
    const carbs = parseNumber(values.customCarbs);
    const fats = parseNumber(values.customFats);
    const valid =
      protein !== null &&
      protein >= 5 &&
      protein <= 50 &&
      carbs !== null &&
      carbs >= 5 &&
      carbs <= 70 &&
      fats !== null &&
      fats >= 5 &&
      fats <= 60;

    if (!valid) {
      if (protein === null || protein < 5 || protein > 50) {
        errors.customProtein = MACRO_ERRORS.customRatios;
      }
      if (carbs === null || carbs < 5 || carbs > 70) {
        errors.customCarbs = MACRO_ERRORS.customRatios;
      }
      if (fats === null || fats < 5 || fats > 60) {
        errors.customFats = MACRO_ERRORS.customRatios;
      }
    } else {
      const total = protein + carbs + fats;

      if (total !== 100) {
        errors.customProtein = `${MACRO_ERRORS.customTotal} (currently ${total}%).`;
      }
    }
  }

  return errors;
}

function mealPlanFor(
  proteinGrams: number,
  carbsGrams: number,
  fatsGrams: number,
): MacroMeal[] {
  const breakfast = {
    name: 'Breakfast',
    protein: Math.round(proteinGrams * 0.25),
    carbs: Math.round(carbsGrams * 0.25),
    fats: Math.round(fatsGrams * 0.25),
  };
  const lunch = {
    name: 'Lunch',
    protein: Math.round(proteinGrams * 0.35),
    carbs: Math.round(carbsGrams * 0.35),
    fats: Math.round(fatsGrams * 0.35),
  };
  const dinner = {
    name: 'Dinner',
    protein: Math.round(proteinGrams * 0.3),
    carbs: Math.round(carbsGrams * 0.3),
    fats: Math.round(fatsGrams * 0.3),
  };
  const snacks = {
    name: 'Snacks',
    protein:
      proteinGrams -
      Math.round(proteinGrams * 0.25) -
      Math.round(proteinGrams * 0.35) -
      Math.round(proteinGrams * 0.3),
    carbs:
      carbsGrams -
      Math.round(carbsGrams * 0.25) -
      Math.round(carbsGrams * 0.35) -
      Math.round(carbsGrams * 0.3),
    fats:
      fatsGrams -
      Math.round(fatsGrams * 0.25) -
      Math.round(fatsGrams * 0.35) -
      Math.round(fatsGrams * 0.3),
  };

  return [breakfast, lunch, dinner, snacks].filter(
    (meal) => meal.protein >= 0 && meal.carbs >= 0 && meal.fats >= 0,
  );
}

function macroFoodSources(): MacroFoodSource[] {
  return [
    {
      title: 'Protein Sources',
      items: [
        'Lean meats (chicken, turkey)',
        'Fish (salmon, tuna, cod)',
        'Eggs and dairy',
        'Legumes and beans',
        'Tofu and tempeh',
      ],
    },
    {
      title: 'Carbohydrate Sources',
      items: [
        'Whole grains (oats, quinoa, brown rice)',
        'Vegetables and fruits',
        'Sweet potatoes',
        'Whole grain bread',
        'Pasta and legumes',
      ],
    },
    {
      title: 'Healthy Fat Sources',
      items: [
        'Avocados and nuts',
        'Olive oil and coconut oil',
        'Fatty fish (salmon, mackerel)',
        'Seeds (chia, flax, hemp)',
        'Nut butters',
      ],
    },
  ];
}

function macroRecommendations(
  calories: number,
  ratios: MacroRatios,
  goal: MacroGoal,
): string {
  let recommendations = `Your daily target is ${Math.round(calories)} calories with macro ratios of ${ratios.protein}% protein, ${ratios.carbs}% carbs, and ${ratios.fats}% fats. `;

  switch (goal) {
    case 'lose-weight':
      recommendations +=
        'For weight loss, focus on high-protein foods to maintain muscle mass and increase satiety. Choose complex carbs for sustained energy and healthy fats for hormone function.';
      break;
    case 'gain-muscle':
    case 'gain-strength':
      recommendations +=
        'For muscle gain, prioritize protein intake around workouts. Include sufficient complex carbs for energy and muscle glycogen replenishment, and healthy fats for hormone production.';
      break;
    case 'endurance':
      recommendations +=
        'For endurance performance, emphasize complex carbohydrates for fuel and adequate protein for recovery. Include healthy fats for long-duration energy and overall health.';
      break;
    case 'ketogenic':
      recommendations +=
        'For ketogenic diet, severely restrict carbohydrates. Focus on healthy fats as your primary energy source and moderate protein to preserve muscle mass. Monitor electrolyte intake.';
      break;
    case 'maintain':
      recommendations +=
        'Maintain a balanced approach with whole foods, proper timing around workouts, and adequate hydration to support your current weight and health.';
      break;
    case 'custom':
      recommendations +=
        'You are using custom macro ratios. Ensure these align with your specific dietary needs and goals. Consult a nutritionist if unsure.';
      break;
    default:
      recommendations +=
        'Maintain a balanced approach with whole foods, proper timing around workouts, and adequate hydration.';
  }

  recommendations +=
    ' Track your intake regularly and adjust based on your progress and how you feel. Consistency is key.';

  return recommendations;
}

function resolveRatios(values: MacroValues): MacroRatios {
  if (values.fitnessGoal === 'custom') {
    return {
      protein: parseNumber(values.customProtein) ?? 0,
      carbs: parseNumber(values.customCarbs) ?? 0,
      fats: parseNumber(values.customFats) ?? 0,
    };
  }

  const goal = values.fitnessGoal as Exclude<MacroGoal, 'custom'>;

  return {...GOAL_RATIOS[goal]};
}

export function calculateMacros(values: MacroValues): MacroResult {
  if (!values.calculationMethod || !values.fitnessGoal) {
    throw new Error('Invalid macro inputs.');
  }

  let dailyCalories: number;

  if (values.calculationMethod === 'tdee') {
    const age = parseNumber(values.age);
    const weight = parseNumber(values.weight);
    const height = parseNumber(values.height);
    const inches =
      values.heightUnit === 'ft' ? parseNumber(values.inches) ?? 0 : 0;

    if (
      age === null ||
      age < 15 ||
      age > 100 ||
      !values.gender ||
      weight === null ||
      weight < 30 ||
      height === null ||
      !values.activityLevel
    ) {
      throw new Error('Invalid macro inputs.');
    }

    if (values.heightUnit === 'ft' && (inches < 0 || inches > 11)) {
      throw new Error('Invalid macro inputs.');
    }

    const weightKg = toKilograms(weight, values.weightUnit);
    const heightCm = macroTdeeHeightCm(height, values.heightUnit, inches);
    const bmr = harrisBenedictBmr(
      values.gender,
      weightKg,
      heightCm,
      age,
    );

    dailyCalories = Math.round(
      bmr * NUTRITION_ACTIVITY_FACTORS[values.activityLevel],
    );
  } else {
    const calories = parseNumber(values.dailyCalories);

    if (calories === null || calories < 800 || calories > 5000) {
      throw new Error('Invalid macro inputs.');
    }

    dailyCalories = calories;
  }

  const ratios = adjustRatiosForDiet(
    resolveRatios(values),
    values.dietPreference,
  );
  const proteinCalories = dailyCalories * (ratios.protein / 100);
  const carbsCalories = dailyCalories * (ratios.carbs / 100);
  const fatsCalories = dailyCalories * (ratios.fats / 100);
  const proteinGrams = Math.round(proteinCalories / 4);
  const carbsGrams = Math.round(carbsCalories / 4);
  const fatsGrams = Math.round(fatsCalories / 9);

  return {
    dailyCalories,
    display: `${Math.round(dailyCalories)} cal`,
    ratios,
    macros: {
      protein: {
        grams: proteinGrams,
        calories: Math.round(proteinCalories),
        percentage: ratios.protein,
      },
      carbs: {
        grams: carbsGrams,
        calories: Math.round(carbsCalories),
        percentage: ratios.carbs,
      },
      fats: {
        grams: fatsGrams,
        calories: Math.round(fatsCalories),
        percentage: ratios.fats,
      },
    },
    mealPlan: mealPlanFor(proteinGrams, carbsGrams, fatsGrams),
    foodSources: macroFoodSources(),
    recommendations: macroRecommendations(
      dailyCalories,
      ratios,
      values.fitnessGoal,
    ),
  };
}
