import type {HeightUnit} from './units';

/**
 * Shared body-metric helpers for the nutrition tools. The activity factor
 * table matches the TDEE and macro calculator sources, and the two BMR
 * equations are kept separate because the macro calculator uses
 * Harris-Benedict while the BMR and TDEE pages use Mifflin-St Jeor.
 */
export type NutritionGender = 'male' | 'female';

export type NutritionActivityLevel =
  | 'sedentary'
  | 'light'
  | 'moderate'
  | 'active'
  | 'very-active';

export const NUTRITION_ACTIVITY_FACTORS: Record<
  NutritionActivityLevel,
  number
> = {
  sedentary: 1.2,
  light: 1.375,
  moderate: 1.55,
  active: 1.725,
  'very-active': 1.9,
};

export function mifflinStJeorBmr(
  gender: NutritionGender,
  weightKg: number,
  heightCm: number,
  age: number,
): number {
  const base = 10 * weightKg + 6.25 * heightCm - 5 * age;

  return gender === 'male' ? base + 5 : base - 161;
}

export function harrisBenedictBmr(
  gender: NutritionGender,
  weightKg: number,
  heightCm: number,
  age: number,
): number {
  return gender === 'male'
    ? 88.362 + 13.397 * weightKg + 4.799 * heightCm - 5.677 * age
    : 447.593 + 9.247 * weightKg + 3.098 * heightCm - 4.33 * age;
}

/**
 * The macro calculator passes feet plus inches as a decimal value into the
 * legacy shared TDEE helper. That helper floors the feet and rounds the
 * fractional feet to a single "inch" digit before converting, so 5'11" is
 * treated as 5'9". The source behavior is preserved for parity.
 */
export function macroTdeeHeightCm(
  height: number,
  unit: HeightUnit,
  inches = 0,
): number {
  if (unit === 'cm') {
    return height;
  }

  const decimalFeet = height + inches / 12;
  const wholeFeet = Math.floor(decimalFeet);
  const roundedInches = Math.round((decimalFeet - wholeFeet) * 10);

  return (wholeFeet * 12 + roundedInches) * 2.54;
}
