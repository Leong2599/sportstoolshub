import {describe, expect, it} from 'vitest';
import {calculateBmr, validateBmrValues, type BmrValues} from './bmr';

const baseValues: BmrValues = {
  age: '30',
  gender: 'male',
  weight: '80',
  weightUnit: 'kg',
  height: '180',
  heightUnit: 'cm',
  inches: '',
};

describe('BMR calculator', () => {
  it('matches the source Mifflin-St Jeor result for men', () => {
    const result = calculateBmr(baseValues);

    expect(result.bmr).toBe(1780);
    expect(result.display).toBe('1780');
  });

  it('matches the source Mifflin-St Jeor result for women', () => {
    const result = calculateBmr({
      ...baseValues,
      gender: 'female',
    });

    expect(result.bmr).toBe(1614);
    expect(result.display).toBe('1614');
  });

  it('converts pounds and feet/inches with the shared unit helpers', () => {
    const result = calculateBmr({
      ...baseValues,
      weight: '176.37',
      weightUnit: 'lbs',
      height: '5',
      heightUnit: 'ft',
      inches: '11',
    });

    expect(result.bmr).toBeCloseTo(1782.1252, 4);
    expect(result.display).toBe('1782');
  });

  it('rounds the displayed BMR to the nearest calorie', () => {
    const result = calculateBmr({
      ...baseValues,
      age: '31',
    });

    expect(result.bmr).toBe(1775);
    expect(result.display).toBe('1775');
  });

  it('preserves the source validation bounds and messages', () => {
    expect(validateBmrValues({...baseValues, age: ''}).age).toBe(
      'Please enter a valid age between 15 and 80.',
    );
    expect(validateBmrValues({...baseValues, age: '14'}).age).toBe(
      'Please enter a valid age between 15 and 80.',
    );
    expect(validateBmrValues({...baseValues, age: '81'}).age).toBe(
      'Please enter a valid age between 15 and 80.',
    );
    expect(validateBmrValues({...baseValues, gender: ''}).gender).toBe(
      'Please select your gender.',
    );
    expect(validateBmrValues({...baseValues, weight: '0'}).weight).toBe(
      'Please enter a valid weight.',
    );
    expect(validateBmrValues({...baseValues, height: '49'}).height).toBe(
      'Please enter a valid height in cm (50-250).',
    );
    expect(validateBmrValues({...baseValues, height: '251'}).height).toBe(
      'Please enter a valid height in cm (50-250).',
    );
    expect(
      validateBmrValues({
        ...baseValues,
        height: '9',
        heightUnit: 'ft',
        inches: '0',
      }).height,
    ).toBe(
      'Please enter a valid height in feet (1-8) and inches (0-11).',
    );
    expect(
      validateBmrValues({
        ...baseValues,
        height: '5',
        heightUnit: 'ft',
        inches: '12',
      }).height,
    ).toBe(
      'Please enter a valid height in feet (1-8) and inches (0-11).',
    );
  });
});
