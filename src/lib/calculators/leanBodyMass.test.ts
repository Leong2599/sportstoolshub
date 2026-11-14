import {describe, expect, it} from 'vitest';
import {
  calculateLbm,
  validateLbmValues,
  type LbmValues,
} from './leanBodyMass';

const baseValues: LbmValues = {
  gender: 'male',
  weight: '80',
  weightUnit: 'kg',
  height: '180',
  heightUnit: 'cm',
  inches: '',
};

describe('Lean Body Mass calculator', () => {
  it('matches the source Boer formula for men', () => {
    const result = calculateLbm(baseValues);

    expect(result.lbmKg).toBeCloseTo(61.42, 10);
    expect(result.lbmDisplay).toBe('61.4');
    expect(result.bodyFatPercentage).toBeCloseTo(23.225, 10);
    expect(result.bodyFatDisplay).toBe('23.2');
    expect(result.weightKg).toBe(80);
    expect(result.heightCm).toBe(180);
  });

  it('matches the source Boer formula for women', () => {
    const result = calculateLbm({...baseValues, gender: 'female'});

    expect(result.lbmKg).toBeCloseTo(57.0, 10);
    expect(result.lbmDisplay).toBe('57.0');
    expect(result.bodyFatPercentage).toBeCloseTo(28.75, 10);
    expect(result.bodyFatDisplay).toBe('28.7');
  });

  it('converts imperial height and weight correctly', () => {
    const result = calculateLbm({
      ...baseValues,
      gender: 'male',
      weight: '176',
      weightUnit: 'lbs',
      height: '5',
      heightUnit: 'ft',
      inches: '11',
    });

    expect(result.weightKg).toBeCloseTo(79.832192, 10);
    expect(result.heightCm).toBeCloseTo(180.34, 10);
    expect(result.lbmDisplay).toBe('61.4');
    expect(result.bodyFatDisplay).toBe('23.0');
  });

  it('preserves the source validation bounds and messages', () => {
    expect(validateLbmValues({...baseValues, gender: ''}).gender).toBe(
      'Please select your gender.',
    );
    expect(validateLbmValues({...baseValues, weight: ''}).weight).toBe(
      'Please enter a valid weight.',
    );
    expect(validateLbmValues({...baseValues, weight: '0'}).weight).toBe(
      'Please enter a valid weight.',
    );
    expect(validateLbmValues({...baseValues, height: '49'}).height).toBe(
      'Please enter a valid height in cm (50-250).',
    );
    expect(validateLbmValues({...baseValues, height: '251'}).height).toBe(
      'Please enter a valid height in cm (50-250).',
    );
    expect(
      validateLbmValues({
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
