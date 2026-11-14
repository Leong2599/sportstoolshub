import {describe, expect, it} from 'vitest';
import {
  BMI_RANGES,
  calculateBmi,
  getBmiCategory,
  validateBmiValues,
  type BmiValues,
} from './bmi';

const baseValues: BmiValues = {
  weight: '70',
  weightUnit: 'kg',
  height: '175',
  heightUnit: 'cm',
  inches: '',
  age: '30',
  gender: 'male',
};

describe('BMI calculator', () => {
  it('matches the source metric example and one-decimal rounding', () => {
    const result = calculateBmi(baseValues);

    expect(result.bmi).toBeCloseTo(22.857142857142858, 12);
    expect(result.display).toBe('22.9');
    expect(result.category).toBe('Normal weight');
    expect(result.color).toBe('#10b981');
    expect(result.recommendation).toContain('healthy weight range');
  });

  it('matches the source pounds and feet/inches conversion', () => {
    const result = calculateBmi({
      ...baseValues,
      weight: '154.3',
      weightUnit: 'lbs',
      height: '5',
      heightUnit: 'ft',
      inches: '9',
    });

    expect(result.bmi).toBeCloseTo(22.785874322011196, 12);
    expect(result.display).toBe('22.8');
  });

  it('uses the source category boundaries', () => {
    expect(getBmiCategory(18.4).category).toBe('Underweight');
    expect(getBmiCategory(18.5).category).toBe('Normal weight');
    expect(getBmiCategory(24.999).category).toBe('Normal weight');
    expect(getBmiCategory(25).category).toBe('Overweight');
    expect(getBmiCategory(29.999).category).toBe('Overweight');
    expect(getBmiCategory(30).category).toBe('Obese');
  });

  it('exposes the source chart ranges', () => {
    expect(BMI_RANGES.map((range) => range.display)).toEqual([
      '< 18.5',
      '18.5 - 24.9',
      '25.0 - 29.9',
      '≥ 30.0',
    ]);
  });

  it('preserves the source validation bounds and messages', () => {
    expect(validateBmiValues({...baseValues, weight: ''}).weight).toBe(
      'Please enter a valid weight.',
    );
    expect(validateBmiValues({...baseValues, weight: '0'}).weight).toBe(
      'Please enter a valid weight.',
    );
    expect(validateBmiValues({...baseValues, weight: '1001'}).weight).toBe(
      'Please enter a valid weight between 1 and 1000',
    );
    expect(validateBmiValues({...baseValues, height: '49'}).height).toBe(
      'Please enter a valid height between 50 and 300 cm',
    );
    expect(validateBmiValues({...baseValues, height: '301'}).height).toBe(
      'Please enter a valid height between 50 and 300 cm',
    );
    expect(validateBmiValues({...baseValues, age: '0'}).age).toBe(
      'Please enter a valid age.',
    );
    expect(validateBmiValues({...baseValues, age: '121'}).age).toBe(
      'Please enter a valid age.',
    );
    expect(validateBmiValues({...baseValues, gender: ''}).gender).toBe(
      'Please select your gender.',
    );
  });

  it('validates feet, inches, and blank feet independently', () => {
    expect(
      validateBmiValues({
        ...baseValues,
        height: '5',
        heightUnit: 'ft',
        inches: '',
      }).height,
    ).toBe('Please enter a valid height in feet and inches.');
    expect(
      validateBmiValues({
        ...baseValues,
        height: '1',
        heightUnit: 'ft',
        inches: '0',
      }).height,
    ).toBe('Please enter a valid height between 2 and 8 feet');
    expect(
      validateBmiValues({
        ...baseValues,
        height: '5',
        heightUnit: 'ft',
        inches: '12',
      }).inches,
    ).toBe('Please enter valid inches between 0 and 11');
  });
});
