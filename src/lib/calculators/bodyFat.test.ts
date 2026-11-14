import {describe, expect, it} from 'vitest';
import {
  BODY_FAT_GENERAL_ERROR,
  calculateBodyFat,
  getBodyFatCategory,
  getBodyFatRanges,
  validateBodyFatValues,
  type BodyFatValues,
} from './bodyFat';

const baseValues: BodyFatValues = {
  method: 'us-navy',
  gender: 'male',
  age: '30',
  weight: '80',
  weightUnit: 'kg',
  height: '180',
  heightUnit: 'cm',
  inches: '',
  neck: '38',
  neckUnit: 'cm',
  waist: '90',
  waistUnit: 'cm',
  hip: '',
  hipUnit: 'cm',
  chest: '20',
  abdominal: '25',
  thigh: '15',
  triceps: '20',
  suprailiac: '15',
};

describe('body fat calculator', () => {
  it('matches the source US Navy male formula', () => {
    const result = calculateBodyFat(baseValues);

    expect(result.percentage).toBeCloseTo(19.927116435384626, 12);
    expect(result.display).toBe('19.9%');
    expect(result.category).toBe('Acceptable');
    expect(result.fatMassDisplay).toBe('15.9 kg');
    expect(result.leanMassDisplay).toBe('64.1 kg');
  });

  it('matches the source US Navy female formula and hip requirement', () => {
    const result = calculateBodyFat({
      ...baseValues,
      gender: 'female',
      height: '165',
      weight: '60',
      neck: '33',
      waist: '75',
      hip: '95',
    });

    expect(result.percentage).toBeCloseTo(27.19866860951518, 12);
    expect(result.display).toBe('27.2%');
    expect(result.fatMassDisplay).toBe('16.3 kg');
    expect(result.leanMassDisplay).toBe('43.7 kg');
  });

  it('matches the source BMI-based formulas', () => {
    const male = calculateBodyFat({...baseValues, method: 'bmi'});
    const female = calculateBodyFat({
      ...baseValues,
      method: 'bmi',
      gender: 'female',
      height: '165',
      weight: '60',
      age: '28',
    });

    expect(male.percentage).toBeCloseTo(20.329629629629625, 12);
    expect(male.display).toBe('20.3%');
    expect(female.percentage).toBeCloseTo(27.48628099173554, 12);
    expect(female.display).toBe('27.5%');
  });

  it('matches the source Jackson-Pollock 3-site skinfold formulas', () => {
    const male = calculateBodyFat({
      ...baseValues,
      method: 'skinfold',
      age: '30',
      chest: '20',
      abdominal: '25',
      thigh: '15',
    });
    const female = calculateBodyFat({
      ...baseValues,
      method: 'skinfold',
      gender: 'female',
      age: '30',
      triceps: '20',
      suprailiac: '15',
      thigh: '25',
    });

    expect(male.percentage).toBeCloseTo(17.94527592700428, 12);
    expect(male.display).toBe('17.9%');
    expect(female.percentage).toBeCloseTo(24.1278944190932, 12);
    expect(female.display).toBe('24.1%');
  });

  it('uses the source category boundaries and recommendations', () => {
    expect(getBodyFatCategory('male', 5.9)).toBe('Essential Fat');
    expect(getBodyFatCategory('male', 6)).toBe('Athletes');
    expect(getBodyFatCategory('male', 14)).toBe('Fitness');
    expect(getBodyFatCategory('male', 18)).toBe('Acceptable');
    expect(getBodyFatCategory('male', 25)).toBe('Obese');
    expect(getBodyFatCategory('female', 13.9)).toBe('Essential Fat');
    expect(getBodyFatCategory('female', 14)).toBe('Athletes');
    expect(getBodyFatCategory('female', 21)).toBe('Fitness');
    expect(getBodyFatCategory('female', 25)).toBe('Acceptable');
    expect(getBodyFatCategory('female', 32)).toBe('Obese');
  });

  it('exposes the source category ranges for each gender', () => {
    expect(
      getBodyFatRanges('male').map((range) => [
        range.name,
        range.min,
        range.max,
      ]),
    ).toEqual([
      ['Essential Fat', 0, 6],
      ['Athletes', 6, 14],
      ['Fitness', 14, 18],
      ['Acceptable', 18, 25],
      ['Obese', 25, 100],
    ]);
    expect(
      getBodyFatRanges('female').map((range) => [
        range.name,
        range.min,
        range.max,
      ]),
    ).toEqual([
      ['Essential Fat', 0, 14],
      ['Athletes', 14, 21],
      ['Fitness', 21, 25],
      ['Acceptable', 25, 32],
      ['Obese', 32, 100],
    ]);
  });

  it('preserves the source validation messages and bounds', () => {
    expect(validateBodyFatValues({...baseValues, method: ''}).method).toBe(
      'Please select a calculation method.',
    );
    expect(validateBodyFatValues({...baseValues, gender: ''}).gender).toBe(
      'Please select your gender.',
    );
    expect(validateBodyFatValues({...baseValues, age: '17'}).age).toBe(
      'Please enter a valid age (18-100).',
    );
    expect(validateBodyFatValues({...baseValues, age: '101'}).age).toBe(
      'Please enter a valid age (18-100).',
    );
    expect(validateBodyFatValues({...baseValues, weight: '29'}).weight).toBe(
      'Please enter a valid weight (min 30).',
    );
    expect(validateBodyFatValues({...baseValues, height: '49'}).height).toBe(
      'Please enter a valid height in cm (50-300).',
    );
    expect(
      validateBodyFatValues({
        ...baseValues,
        height: '10',
        heightUnit: 'ft',
        inches: '11',
      }).height,
    ).toBe(
      'Please enter a valid height in feet (1-9) and inches (0-11).',
    );
  });

  it('validates the fields used by the selected method', () => {
    expect(validateBodyFatValues({...baseValues, neck: '19'}).neck).toBe(
      'Please enter a valid neck circumference.',
    );
    expect(validateBodyFatValues({...baseValues, waist: '49'}).waist).toBe(
      'Please enter a valid waist circumference.',
    );
    expect(
      validateBodyFatValues({...baseValues, gender: 'female', hip: '69'}).hip,
    ).toBe('Please enter a valid hip circumference.');
    expect(
      validateBodyFatValues({
        ...baseValues,
        method: 'skinfold',
        thigh: '51',
      }).thigh,
    ).toBe('Please enter a valid thigh skinfold measurement.');
    expect(
      validateBodyFatValues({
        ...baseValues,
        method: 'skinfold',
        chest: '0',
      }).chest,
    ).toBe('Please enter a valid chest skinfold measurement.');
    expect(
      validateBodyFatValues({
        ...baseValues,
        method: 'skinfold',
        gender: 'female',
        triceps: '0',
      }).triceps,
    ).toBe('Please enter a valid triceps skinfold measurement.');
  });

  it('reports the source general error for impossible measurements', () => {
    expect(
      validateBodyFatValues({
        ...baseValues,
        neck: '50',
        waist: '50',
      }).method,
    ).toBe(BODY_FAT_GENERAL_ERROR);
    expect(() =>
      calculateBodyFat({
        ...baseValues,
        neck: '50',
        waist: '50',
      }),
    ).toThrow(BODY_FAT_GENERAL_ERROR);
  });
});
