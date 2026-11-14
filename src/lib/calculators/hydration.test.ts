import {describe, expect, it} from 'vitest';
import {
  calculateHydration,
  validateHydrationValues,
  type HydrationValues,
} from './hydration';

const baseValues: HydrationValues = {
  weight: '80',
  weightUnit: 'kg',
  age: '30',
  gender: 'male',
  activityLevel: 'moderate',
  climate: 'temperate',
  exerciseDuration: '60',
  exerciseIntensity: 'moderate',
  healthConditions: [],
};

describe('Hydration calculator', () => {
  it('matches the source base, activity, and unit output', () => {
    const result = calculateHydration(baseValues);

    expect(result.breakdown.base).toBeCloseTo(88.1848, 4);
    expect(result.breakdown.activity).toBeCloseTo(37.63696, 5);
    expect(result.breakdown.climate).toBe(0);
    expect(result.totalOunces).toBeCloseTo(125.82176, 5);
    expect(result.ouncesDisplay).toBe('126 oz');
    expect(result.liters).toBe('3.7');
    expect(result.glasses).toBe(16);
  });

  it('applies climate and health condition adjustments', () => {
    const result = calculateHydration({
      ...baseValues,
      weight: '70',
      activityLevel: 'active',
      climate: 'hot',
      exerciseDuration: '45',
      exerciseIntensity: 'vigorous',
      healthConditions: ['pregnancy'],
    });

    expect(result.breakdown.climate).toBeCloseTo(15.43234, 5);
    expect(result.breakdown.health).toBe(24);
    expect(result.totalOunces).toBeCloseTo(162.24255, 5);
    expect(result.ouncesDisplay).toBe('162 oz');
  });

  it('treats a blank exercise duration as zero, matching the source coercion', () => {
    const result = calculateHydration({
      ...baseValues,
      exerciseDuration: '',
      exerciseIntensity: 'light',
    });

    expect(result.breakdown.activity).toBeCloseTo(17.63696, 5);
  });

  it('builds the source schedule and tips', () => {
    const result = calculateHydration(baseValues);

    expect(result.schedule).toHaveLength(6);
    expect(result.schedule[0]?.display).toBe('21 oz');
    expect(result.schedule[5]?.time).toBe('Evening');
    expect(result.tips.map((tip) => tip.title)).toEqual([
      'Exercise Hydration',
      'General Best Practices',
      'Water-Rich Foods',
    ]);
  });

  it('matches the source recommendation copy', () => {
    const result = calculateHydration({
      ...baseValues,
      climate: 'hot',
      healthConditions: ['breastfeeding'],
    });

    expect(result.recommendations).toContain(
      'Your daily hydration need is 175 ounces (5.2 liters).',
    );
    expect(result.recommendations).toContain(
      'In hot climates, increase fluid intake',
    );
    expect(result.recommendations).toContain(
      'While breastfeeding, drink extra fluids',
    );
  });

  it('preserves the source validation bounds and messages', () => {
    expect(validateHydrationValues({...baseValues, weight: '29'}).weight).toBe(
      'Please enter a valid body weight (min 30).',
    );
    expect(validateHydrationValues({...baseValues, age: '14'}).age).toBe(
      'Please enter a valid age (15-100).',
    );
    expect(validateHydrationValues({...baseValues, gender: ''}).gender).toBe(
      'Please select your gender.',
    );
    expect(
      validateHydrationValues({...baseValues, activityLevel: ''})
        .activityLevel,
    ).toBe('Please select your activity level.');
    expect(validateHydrationValues({...baseValues, climate: ''}).climate).toBe(
      'Please select your climate/environment.',
    );
    expect(
      validateHydrationValues({...baseValues, exerciseDuration: '301'})
        .exerciseDuration,
    ).toBe('Please enter a valid daily exercise duration (0-300 minutes).');
  });
});
