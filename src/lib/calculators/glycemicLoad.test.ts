import {describe, expect, it} from 'vitest';
import {
  analyzeGlycemicFood,
  calculateGlycemicLoad,
  createGlycemicFoodEntry,
  validateGlycemicValues,
  type GlycemicValues,
} from './glycemicLoad';

const baseValues: GlycemicValues = {
  foodSelect: '',
  foodAmount: '',
  foods: [],
};

describe('Glycemic Load Calculator', () => {
  it('matches the source food math and high-GL copy', () => {
    const result = calculateGlycemicLoad([
      {foodId: 'white-rice', amount: 100},
    ]);

    expect(result.totalGl).toBeCloseTo(20.44, 2);
    expect(result.totalGlDisplay).toBe('20.4');
    expect(result.totalCarbsDisplay).toBe('28.0');
    expect(result.averageGiDisplay).toBe('73');
    expect(result.category).toBe(
      'High Glycemic Load - Significant blood sugar impact',
    );
    expect(result.recommendations).toEqual([
      'Consider reducing portion sizes or choosing lower GI foods',
      'Include more low GI foods like vegetables, legumes, and whole grains',
    ]);
  });

  it('sums multiple foods and calculates the carb-weighted average GI', () => {
    const result = calculateGlycemicLoad([
      {foodId: 'white-rice', amount: 100},
      {foodId: 'banana', amount: 120},
    ]);

    expect(result.totalGlDisplay).toBe('34.5');
    expect(result.totalCarbsDisplay).toBe('55.6');
    expect(result.averageGiDisplay).toBe('62');
    expect(result.foods[1]?.glDisplay).toBe('14.1');
  });

  it('uses the source low and medium boundaries', () => {
    expect(
      calculateGlycemicLoad([{foodId: 'apple', amount: 100}]),
    ).toMatchObject({
      totalGlDisplay: '5.3',
      category: 'Low Glycemic Load - Excellent for blood sugar control',
      recommendations: ['Great choice for blood sugar management!'],
    });

    expect(
      calculateGlycemicLoad([{foodId: 'pasta', amount: 100}]),
    ).toMatchObject({
      totalGlDisplay: '12.3',
      category: 'Medium Glycemic Load - Moderate blood sugar impact',
    });
  });

  it('analyzes individual foods and rejects invalid additions', () => {
    expect(analyzeGlycemicFood({foodId: 'oats', amount: 50})).toMatchObject({
      carbs: 33,
      gl: 18.15,
      glDisplay: '18.1',
    });
    expect(createGlycemicFoodEntry('', '100')).toBeNull();
    expect(createGlycemicFoodEntry('oats', '0')).toBeNull();
    expect(createGlycemicFoodEntry('oats', 'abc')).toBeNull();
    expect(createGlycemicFoodEntry('oats', '50')).toEqual({
      foodId: 'oats',
      amount: 50,
    });
  });

  it('requires at least one food to calculate', () => {
    expect(validateGlycemicValues(baseValues).foods).toBe(
      'Please add at least one food to your meal.',
    );
    expect(() => calculateGlycemicLoad([])).toThrow(
      'Invalid glycemic load inputs.',
    );
  });
});
