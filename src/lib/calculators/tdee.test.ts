import {describe, expect, it} from 'vitest';
import {calculateTdee, validateTdeeValues, type TdeeValues} from './tdee';

const baseValues: TdeeValues = {
  age: '30',
  gender: 'male',
  weight: '80',
  weightUnit: 'kg',
  height: '180',
  heightUnit: 'cm',
  inches: '',
  activityLevel: 'moderate',
};

describe('TDEE calculator', () => {
  it('matches the source Mifflin-St Jeor and activity factor result', () => {
    const result = calculateTdee(baseValues);

    expect(result.bmr).toBe(1780);
    expect(result.tdee).toBeCloseTo(2759, 10);
    expect(result.display).toBe('2759');
    expect(result.goals.map((goal) => goal.calories)).toEqual([
      2759, 2509, 2259, 1759, 3009, 3259,
    ]);
    expect(result.goals[0]?.display).toBe('2759 Calories');
  });

  it('converts imperial weight and height correctly', () => {
    const result = calculateTdee({
      ...baseValues,
      weight: '176.37',
      weightUnit: 'lbs',
      height: '5',
      heightUnit: 'ft',
      inches: '11',
    });

    expect(result.display).toBe('2762');
  });

  it('uses the source sedentary and extremely active factors', () => {
    expect(
      Math.round(calculateTdee({...baseValues, activityLevel: 'sedentary'}).tdee),
    ).toBe(2136);
    expect(
      Math.round(
        calculateTdee({...baseValues, activityLevel: 'very-active'}).tdee,
      ),
    ).toBe(3382);
  });

  it('preserves the source validation bounds and messages', () => {
    expect(validateTdeeValues({...baseValues, age: '14'}).age).toBe(
      'Please enter a valid age between 15 and 80.',
    );
    expect(validateTdeeValues({...baseValues, age: '81'}).age).toBe(
      'Please enter a valid age between 15 and 80.',
    );
    expect(validateTdeeValues({...baseValues, gender: ''}).gender).toBe(
      'Please select your gender.',
    );
    expect(validateTdeeValues({...baseValues, weight: '0'}).weight).toBe(
      'Please enter a valid weight.',
    );
    expect(validateTdeeValues({...baseValues, height: '49'}).height).toBe(
      'Please enter a valid height in cm (50-300).',
    );
    expect(
      validateTdeeValues({...baseValues, activityLevel: ''}).activityLevel,
    ).toBe('Please select your activity level.');
  });
});
