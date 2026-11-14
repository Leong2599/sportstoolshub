import {describe, expect, it} from 'vitest';
import {
  calculateCalories,
  validateCalorieValues,
  type CalorieValues,
} from './calorie';

const baseValues: CalorieValues = {
  age: '30',
  gender: 'male',
  weight: '80',
  weightUnit: 'kg',
  height: '180',
  heightUnit: 'cm',
  inches: '',
  activityLevel: 'moderate',
  goal: 'maintain',
};

describe('Calorie calculator', () => {
  it('matches the source Mifflin-St Jeor example for maintenance', () => {
    const result = calculateCalories(baseValues);

    expect(result.bmr).toBeCloseTo(1780, 10);
    expect(result.tdee).toBeCloseTo(2759, 10);
    expect(Math.round(result.goalCalories)).toBe(2759);
    expect(result.goalDescription).toBe('Maintain current weight');
    expect(result.proteinGrams).toBe(207);
    expect(result.carbsGrams).toBe(276);
    expect(result.fatsGrams).toBe(92);
  });

  it('converts imperial weight and height correctly', () => {
    const result = calculateCalories({
      ...baseValues,
      weight: '176',
      weightUnit: 'lbs',
      height: '5',
      heightUnit: 'ft',
      inches: '11',
    });

    expect(Math.round(result.bmr)).toBe(1780);
    expect(Math.round(result.tdee)).toBe(2760);
    expect(Math.round(result.goalCalories)).toBe(2760);
  });

  it('adjusts calories for aggressive weight loss', () => {
    const result = calculateCalories({
      ...baseValues,
      goal: 'lose-weight-fast',
    });

    expect(Math.round(result.goalCalories)).toBe(1759);
    expect(result.goalDescription).toBe('Lose 1kg per week');
    expect(result.recommendations).toContain(
      'A 1000 calorie deficit is aggressive.',
    );
  });

  it('preserves the source validation bounds and messages', () => {
    expect(validateCalorieValues({...baseValues, age: ''}).age).toBe(
      'Please enter a valid age (15-100).',
    );
    expect(validateCalorieValues({...baseValues, age: '14'}).age).toBe(
      'Please enter a valid age (15-100).',
    );
    expect(validateCalorieValues({...baseValues, age: '101'}).age).toBe(
      'Please enter a valid age (15-100).',
    );
    expect(validateCalorieValues({...baseValues, gender: ''}).gender).toBe(
      'Please select your gender.',
    );
    expect(validateCalorieValues({...baseValues, weight: ''}).weight).toBe(
      'Please enter a valid weight (min 30).',
    );
    expect(validateCalorieValues({...baseValues, weight: '29'}).weight).toBe(
      'Please enter a valid weight (min 30).',
    );
    expect(
      validateCalorieValues({...baseValues, activityLevel: ''}).activityLevel,
    ).toBe('Please select your activity level.');
    expect(validateCalorieValues({...baseValues, goal: ''}).goal).toBe(
      'Please select your fitness goal.',
    );
    expect(validateCalorieValues({...baseValues, height: '49'}).height).toBe(
      'Please enter a valid height in cm (50-300).',
    );
    expect(
      validateCalorieValues({
        ...baseValues,
        height: '5',
        heightUnit: 'ft',
        inches: '12',
      }).height,
    ).toBe('Please enter a valid height in feet (1-9) and inches (0-11).');
  });
});
