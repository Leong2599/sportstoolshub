import {describe, expect, it} from 'vitest';
import {
  adjustRatiosForDiet,
  calculateMacros,
  validateMacroValues,
  type MacroValues,
} from './macro';

const baseValues: MacroValues = {
  calculationMethod: 'manual',
  weight: '80',
  weightUnit: 'kg',
  height: '180',
  heightUnit: 'cm',
  inches: '',
  age: '30',
  gender: 'male',
  activityLevel: 'moderate',
  dailyCalories: '2500',
  fitnessGoal: 'maintain',
  customProtein: '',
  customCarbs: '',
  customFats: '',
  dietPreference: 'standard',
};

describe('Macro calculator', () => {
  it('matches the source manual-calorie breakdown', () => {
    const result = calculateMacros(baseValues);

    expect(result.dailyCalories).toBe(2500);
    expect(result.display).toBe('2500 cal');
    expect(result.macros.protein.grams).toBe(188);
    expect(result.macros.carbs.grams).toBe(250);
    expect(result.macros.fats.grams).toBe(83);
    expect(result.macros.protein.percentage).toBe(30);
    expect(result.macros.carbs.percentage).toBe(40);
    expect(result.macros.fats.percentage).toBe(30);
  });

  it('uses the source Harris-Benedict TDEE path', () => {
    const result = calculateMacros({
      ...baseValues,
      calculationMethod: 'tdee',
      fitnessGoal: 'lose-weight',
    });

    expect(result.dailyCalories).toBe(2873);
    expect(result.macros.protein.grams).toBe(287);
    expect(result.macros.carbs.grams).toBe(215);
    expect(result.macros.fats.grams).toBe(96);
  });

  it('preserves the source feet/inches TDEE quirk', () => {
    const result = calculateMacros({
      ...baseValues,
      calculationMethod: 'tdee',
      height: '5',
      heightUnit: 'ft',
      inches: '11',
    });

    expect(result.dailyCalories).toBe(2838);
  });

  it('applies the source custom ratios and diet adjustments', () => {
    const custom = calculateMacros({
      ...baseValues,
      fitnessGoal: 'custom',
      customProtein: '30',
      customCarbs: '40',
      customFats: '30',
    });

    expect(custom.macros.protein.grams).toBe(188);
    expect(custom.macros.carbs.grams).toBe(250);
    expect(custom.macros.fats.grams).toBe(83);

    const veganKeto = calculateMacros({
      ...baseValues,
      fitnessGoal: 'ketogenic',
      dietPreference: 'vegan',
    });

    expect(veganKeto.ratios).toEqual({protein: 30, carbs: 5, fats: 65});
    expect(veganKeto.macros.protein.grams).toBe(188);
    expect(veganKeto.macros.carbs.grams).toBe(31);
    expect(veganKeto.macros.fats.grams).toBe(181);
  });

  it('exposes the source diet adjustment table', () => {
    expect(
      adjustRatiosForDiet({protein: 30, carbs: 40, fats: 30}, 'low-carb'),
    ).toEqual({protein: 35, carbs: 20, fats: 45});
    expect(
      adjustRatiosForDiet({protein: 30, carbs: 40, fats: 30}, 'high-carb'),
    ).toEqual({protein: 25, carbs: 50, fats: 25});
    expect(
      adjustRatiosForDiet({protein: 30, carbs: 40, fats: 30}, 'low-fat'),
    ).toEqual({protein: 35, carbs: 45, fats: 20});
    expect(
      adjustRatiosForDiet({protein: 30, carbs: 40, fats: 30}, 'high-fat'),
    ).toEqual({protein: 30, carbs: 30, fats: 40});
    expect(
      adjustRatiosForDiet({protein: 30, carbs: 40, fats: 30}, 'vegetarian'),
    ).toEqual({protein: 35, carbs: 38, fats: 27});
  });

  it('builds the source meal plan and food source lists', () => {
    const result = calculateMacros(baseValues);

    expect(result.mealPlan.map((meal) => meal.name)).toEqual([
      'Breakfast',
      'Lunch',
      'Dinner',
      'Snacks',
    ]);
    expect(result.mealPlan[0]).toEqual({
      name: 'Breakfast',
      protein: 47,
      carbs: 63,
      fats: 21,
    });
    expect(result.foodSources.map((source) => source.title)).toEqual([
      'Protein Sources',
      'Carbohydrate Sources',
      'Healthy Fat Sources',
    ]);
  });

  it('preserves the source validation messages and custom-ratio total rule', () => {
    expect(
      validateMacroValues({...baseValues, calculationMethod: ''})
        .calculationMethod,
    ).toBe('Please select a calculation method.');
    expect(
      validateMacroValues({...baseValues, dailyCalories: '799'}).dailyCalories,
    ).toBe('Please enter a valid daily calorie target (800-5000).');
    expect(
      validateMacroValues({...baseValues, fitnessGoal: ''}).fitnessGoal,
    ).toBe('Please select a fitness goal.');
    expect(
      validateMacroValues({
        ...baseValues,
        fitnessGoal: 'custom',
        customProtein: '30',
        customCarbs: '40',
        customFats: '20',
      }).customProtein,
    ).toBe('Custom macro percentages must total 100% (currently 90%).');
    expect(
      validateMacroValues({
        ...baseValues,
        fitnessGoal: 'custom',
        customProtein: '4',
        customCarbs: '40',
        customFats: '56',
      }).customProtein,
    ).toBe('Please enter valid custom macro percentages.');
  });

  it('validates the TDEE fields only for the TDEE method', () => {
    const tdeeErrors = validateMacroValues({
      ...baseValues,
      calculationMethod: 'tdee',
      weight: '29',
    });

    expect(tdeeErrors.weight).toBe('Please enter a valid weight (min 30).');

    const manualErrors = validateMacroValues({
      ...baseValues,
      calculationMethod: 'manual',
      weight: '29',
    });

    expect(manualErrors.weight).toBeUndefined();
  });
});
