import {describe, expect, it} from 'vitest';
import {
  calculateMicronutrient,
  validateMicronutrientValues,
  type MicronutrientValues,
} from './micronutrient';

const baseValues: MicronutrientValues = {
  age: '30',
  gender: 'male',
  vitaminA: '900',
  vitaminC: '45',
  vitaminD: '',
  vitaminE: '',
  vitaminK: '',
  thiamine: '',
  riboflavin: '',
  niacin: '',
  vitaminB6: '',
  folate: '',
  vitaminB12: '',
  calcium: '',
  iron: '',
  magnesium: '',
  phosphorus: '',
  potassium: '',
  sodium: '',
  zinc: '',
  selenium: '',
};

describe('Micronutrient Intake Checker', () => {
  it('averages only entered nutrients and preserves the source status copy', () => {
    const result = calculateMicronutrient(baseValues);

    expect(result.overallScore).toBe(75);
    expect(result.scoreDescription).toBe(
      'Adequate, but could be improved',
    );
    expect(result.breakdown).toHaveLength(2);
    expect(result.breakdown[0]).toMatchObject({
      key: 'vitaminA',
      label: 'vitamin A',
      display: '100%',
      status: 'adequate',
    });
    expect(result.breakdown[1]).toMatchObject({
      key: 'vitaminC',
      label: 'vitamin C',
      display: '50%',
      status: 'deficient',
    });
    expect(result.recommendations).toEqual([
      'Consider a multivitamin supplement to fill gaps',
      'Increase Vitamin D intake through sunlight or supplements',
      'Increase iron intake with leafy greens or lean meats',
    ]);
  });

  it('caps each nutrient at 200% and uses female RDA values', () => {
    const result = calculateMicronutrient({
      ...baseValues,
      gender: 'female',
      vitaminA: '1800',
      iron: '36',
    });

    expect(result.breakdown[0]?.display).toBe('200%');
    expect(result.breakdown[1]?.display).toBe('60%');
    expect(result.breakdown).toHaveLength(3);
    expect(result.overallScore).toBe(153);
    expect(result.scoreDescription).toBe(
      'Excellent micronutrient intake!',
    );
    expect(result.recommendations).toContain(
      'Excellent job maintaining micronutrient balance!',
    );
  });

  it('returns zero and the deficiency copy when every nutrient is blank', () => {
    const result = calculateMicronutrient({
      ...baseValues,
      vitaminA: '',
      vitaminC: '',
    });

    expect(result.overallScore).toBe(0);
    expect(result.breakdown).toEqual([]);
    expect(result.scoreDescription).toBe(
      'Multiple deficiencies - consider supplementation',
    );
  });

  it('preserves the source age and gender validation', () => {
    expect(
      validateMicronutrientValues({...baseValues, age: '14'}).age,
    ).toBe('Please enter a valid age between 15 and 80.');
    expect(
      validateMicronutrientValues({...baseValues, age: '81'}).age,
    ).toBe('Please enter a valid age between 15 and 80.');
    expect(
      validateMicronutrientValues({...baseValues, gender: ''}).gender,
    ).toBe('Please select your gender.');
    expect(
      validateMicronutrientValues({...baseValues, age: '15'}).age,
    ).toBeUndefined();
  });
});
