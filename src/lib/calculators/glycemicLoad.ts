import {parseNumber} from './units';
import type {FieldErrors} from './validation';

export type GlycemicFoodGroup =
  | 'Grains & Starches'
  | 'Fruits'
  | 'Legumes & Vegetables'
  | 'Dairy & Alternatives'
  | 'Snacks & Sweets';

export const GLYCEMIC_FOODS = [
  {
    id: 'white-rice',
    name: 'White Rice',
    label: 'White Rice (GI: 73)',
    group: 'Grains & Starches',
    gi: 73,
    carbsPer100g: 28,
  },
  {
    id: 'brown-rice',
    name: 'Brown Rice',
    label: 'Brown Rice (GI: 68)',
    group: 'Grains & Starches',
    gi: 68,
    carbsPer100g: 23,
  },
  {
    id: 'oats',
    name: 'Rolled Oats',
    label: 'Rolled Oats (GI: 55)',
    group: 'Grains & Starches',
    gi: 55,
    carbsPer100g: 66,
  },
  {
    id: 'quinoa',
    name: 'Quinoa',
    label: 'Quinoa (GI: 53)',
    group: 'Grains & Starches',
    gi: 53,
    carbsPer100g: 21,
  },
  {
    id: 'whole-wheat-bread',
    name: 'Whole Wheat Bread',
    label: 'Whole Wheat Bread (GI: 71)',
    group: 'Grains & Starches',
    gi: 71,
    carbsPer100g: 41,
  },
  {
    id: 'white-bread',
    name: 'White Bread',
    label: 'White Bread (GI: 75)',
    group: 'Grains & Starches',
    gi: 75,
    carbsPer100g: 49,
  },
  {
    id: 'potato',
    name: 'White Potato',
    label: 'White Potato (GI: 82)',
    group: 'Grains & Starches',
    gi: 82,
    carbsPer100g: 17,
  },
  {
    id: 'sweet-potato',
    name: 'Sweet Potato',
    label: 'Sweet Potato (GI: 61)',
    group: 'Grains & Starches',
    gi: 61,
    carbsPer100g: 20,
  },
  {
    id: 'pasta',
    name: 'Pasta',
    label: 'Pasta (GI: 49)',
    group: 'Grains & Starches',
    gi: 49,
    carbsPer100g: 25,
  },
  {
    id: 'corn',
    name: 'Corn',
    label: 'Corn (GI: 60)',
    group: 'Grains & Starches',
    gi: 60,
    carbsPer100g: 19,
  },
  {
    id: 'apple',
    name: 'Apple',
    label: 'Apple (GI: 38)',
    group: 'Fruits',
    gi: 38,
    carbsPer100g: 14,
  },
  {
    id: 'banana',
    name: 'Banana',
    label: 'Banana (GI: 51)',
    group: 'Fruits',
    gi: 51,
    carbsPer100g: 23,
  },
  {
    id: 'orange',
    name: 'Orange',
    label: 'Orange (GI: 43)',
    group: 'Fruits',
    gi: 43,
    carbsPer100g: 12,
  },
  {
    id: 'grapes',
    name: 'Grapes',
    label: 'Grapes (GI: 53)',
    group: 'Fruits',
    gi: 53,
    carbsPer100g: 17,
  },
  {
    id: 'watermelon',
    name: 'Watermelon',
    label: 'Watermelon (GI: 76)',
    group: 'Fruits',
    gi: 76,
    carbsPer100g: 8,
  },
  {
    id: 'strawberries',
    name: 'Strawberries',
    label: 'Strawberries (GI: 40)',
    group: 'Fruits',
    gi: 40,
    carbsPer100g: 8,
  },
  {
    id: 'blueberries',
    name: 'Blueberries',
    label: 'Blueberries (GI: 53)',
    group: 'Fruits',
    gi: 53,
    carbsPer100g: 14,
  },
  {
    id: 'mango',
    name: 'Mango',
    label: 'Mango (GI: 56)',
    group: 'Fruits',
    gi: 56,
    carbsPer100g: 15,
  },
  {
    id: 'lentils',
    name: 'Lentils',
    label: 'Lentils (GI: 32)',
    group: 'Legumes & Vegetables',
    gi: 32,
    carbsPer100g: 20,
  },
  {
    id: 'chickpeas',
    name: 'Chickpeas',
    label: 'Chickpeas (GI: 28)',
    group: 'Legumes & Vegetables',
    gi: 28,
    carbsPer100g: 27,
  },
  {
    id: 'black-beans',
    name: 'Black Beans',
    label: 'Black Beans (GI: 30)',
    group: 'Legumes & Vegetables',
    gi: 30,
    carbsPer100g: 16,
  },
  {
    id: 'carrots',
    name: 'Carrots',
    label: 'Carrots (GI: 47)',
    group: 'Legumes & Vegetables',
    gi: 47,
    carbsPer100g: 10,
  },
  {
    id: 'broccoli',
    name: 'Broccoli',
    label: 'Broccoli (GI: 15)',
    group: 'Legumes & Vegetables',
    gi: 15,
    carbsPer100g: 7,
  },
  {
    id: 'spinach',
    name: 'Spinach',
    label: 'Spinach (GI: 15)',
    group: 'Legumes & Vegetables',
    gi: 15,
    carbsPer100g: 4,
  },
  {
    id: 'milk',
    name: "Cow's Milk",
    label: "Cow's Milk (GI: 39)",
    group: 'Dairy & Alternatives',
    gi: 39,
    carbsPer100g: 5,
  },
  {
    id: 'yogurt',
    name: 'Plain Yogurt',
    label: 'Plain Yogurt (GI: 36)',
    group: 'Dairy & Alternatives',
    gi: 36,
    carbsPer100g: 4,
  },
  {
    id: 'soy-milk',
    name: 'Soy Milk',
    label: 'Soy Milk (GI: 34)',
    group: 'Dairy & Alternatives',
    gi: 34,
    carbsPer100g: 6,
  },
  {
    id: 'honey',
    name: 'Honey',
    label: 'Honey (GI: 61)',
    group: 'Snacks & Sweets',
    gi: 61,
    carbsPer100g: 82,
  },
  {
    id: 'dark-chocolate',
    name: 'Dark Chocolate (70%)',
    label: 'Dark Chocolate (70%) (GI: 25)',
    group: 'Snacks & Sweets',
    gi: 25,
    carbsPer100g: 45,
  },
  {
    id: 'chocolate-bar',
    name: 'Chocolate Bar',
    label: 'Chocolate Bar (GI: 70)',
    group: 'Snacks & Sweets',
    gi: 70,
    carbsPer100g: 60,
  },
  {
    id: 'soda',
    name: 'Regular Soda',
    label: 'Regular Soda (GI: 63)',
    group: 'Snacks & Sweets',
    gi: 63,
    carbsPer100g: 11,
  },
] as const;

export type GlycemicFood = (typeof GLYCEMIC_FOODS)[number];
export type GlycemicFoodId = GlycemicFood['id'];

export type GlycemicFoodEntry = {
  foodId: GlycemicFoodId;
  amount: number;
};

export type GlycemicValues = {
  foodSelect: GlycemicFoodId | '';
  foodAmount: string;
  foods: readonly GlycemicFoodEntry[];
};

export type GlycemicFoodStats = {
  food: GlycemicFood;
  amount: number;
  carbs: number;
  gl: number;
  glDisplay: string;
};

export type GlycemicResult = {
  totalGl: number;
  totalGlDisplay: string;
  totalCarbs: number;
  totalCarbsDisplay: string;
  averageGi: number;
  averageGiDisplay: string;
  category: string;
  recommendations: readonly string[];
  foods: readonly GlycemicFoodStats[];
};

export const GLYCEMIC_FOOD_GROUPS: readonly GlycemicFoodGroup[] = [
  'Grains & Starches',
  'Fruits',
  'Legumes & Vegetables',
  'Dairy & Alternatives',
  'Snacks & Sweets',
] as const;

export const GLYCEMIC_ERRORS = {
  add: 'Please select a food and enter a valid amount.',
  foods: 'Please add at least one food to your meal.',
} as const;

const FOOD_BY_ID = new Map<GlycemicFoodId, GlycemicFood>(
  GLYCEMIC_FOODS.map((food) => [food.id, food]),
);

export function getGlycemicFood(
  foodId: GlycemicFoodId,
): GlycemicFood | undefined {
  return FOOD_BY_ID.get(foodId);
}

export function analyzeGlycemicFood(
  entry: GlycemicFoodEntry,
): GlycemicFoodStats {
  const food = FOOD_BY_ID.get(entry.foodId);

  if (!food) {
    throw new Error('Unknown glycemic food.');
  }

  const carbs = (food.carbsPer100g * entry.amount) / 100;
  const gl = (food.gi * carbs) / 100;

  return {
    food,
    amount: entry.amount,
    carbs,
    gl,
    glDisplay: gl.toFixed(1),
  };
}

export function validateGlycemicValues(
  values: GlycemicValues,
): FieldErrors<GlycemicValues> {
  const errors: FieldErrors<GlycemicValues> = {};

  if (values.foods.length === 0) {
    errors.foods = GLYCEMIC_ERRORS.foods;
  }

  return errors;
}

export function createGlycemicFoodEntry(
  foodId: GlycemicFoodId | '',
  amountInput: string,
): GlycemicFoodEntry | null {
  const amount = parseNumber(amountInput);

  if (!foodId || amount === null || amount <= 0) {
    return null;
  }

  return {foodId, amount};
}

export function calculateGlycemicLoad(
  entries: readonly GlycemicFoodEntry[],
): GlycemicResult {
  if (entries.length === 0) {
    throw new Error('Invalid glycemic load inputs.');
  }

  const foods = entries.map(analyzeGlycemicFood);
  const totalGl = foods.reduce((sum, food) => sum + food.gl, 0);
  const totalCarbs = foods.reduce((sum, food) => sum + food.carbs, 0);
  const averageGi =
    foods.reduce((sum, food) => sum + food.food.gi * food.carbs, 0) /
    totalCarbs;
  const recommendations: string[] = [];

  let category: string;

  if (totalGl < 10) {
    category = 'Low Glycemic Load - Excellent for blood sugar control';
  } else if (totalGl < 20) {
    category = 'Medium Glycemic Load - Moderate blood sugar impact';
  } else {
    category = 'High Glycemic Load - Significant blood sugar impact';
  }

  if (totalGl > 20) {
    recommendations.push(
      'Consider reducing portion sizes or choosing lower GI foods',
    );
  }

  if (averageGi > 70) {
    recommendations.push(
      'Include more low GI foods like vegetables, legumes, and whole grains',
    );
  }

  if (totalGl < 10) {
    recommendations.push('Great choice for blood sugar management!');
  }

  return {
    totalGl,
    totalGlDisplay: totalGl.toFixed(1),
    totalCarbs,
    totalCarbsDisplay: totalCarbs.toFixed(1),
    averageGi,
    averageGiDisplay: averageGi.toFixed(0),
    category,
    recommendations,
    foods,
  };
}
