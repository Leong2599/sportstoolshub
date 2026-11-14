import {describe, expect, it} from 'vitest';
import {
  calculateHeartRateZones,
  validateHeartRateValues,
  type HeartRateValues,
} from './heartRate';

const baseValues: HeartRateValues = {
  age: '30',
  restingHeartRate: '60',
  fitnessLevel: 'intermediate',
  method: 'karvonen',
};

describe('Heart rate calculator', () => {
  it('matches the source Karvonen zones for age 30 and resting HR 60', () => {
    const result = calculateHeartRateZones(baseValues);

    expect(result.maxHR).toBe(190);
    expect(result.method).toBe('karvonen');
    expect(result.restingHeartRate).toBe(60);
    expect(result.zones).toHaveLength(5);
    expect(result.zones[0]).toEqual({
      zone: 1,
      label: 'Zone 1',
      intensity: 'Warm-up/Recovery',
      min: 125,
      max: 138,
      percentage: '50-60% Max HR',
      description:
        'Very light intensity. Good for warm-ups, cool-downs, and active recovery.',
    });
    expect(result.zones[4]).toEqual({
      zone: 5,
      label: 'Zone 5',
      intensity: 'Maximum',
      min: 177,
      max: 190,
      percentage: '90-100% Max HR',
      description:
        'Maximum intensity. For short bursts and high-intensity interval training.',
    });
    expect(result.recommendation).toContain('Zone 2');
    expect(result.recommendation).toContain('Karvonen method');
  });

  it('matches the source age-predicted zones when resting HR is absent', () => {
    const result = calculateHeartRateZones({
      ...baseValues,
      restingHeartRate: '',
      method: 'age-predicted',
    });

    expect(result.maxHR).toBe(190);
    expect(result.method).toBe('age-predicted');
    expect(result.restingHeartRate).toBe(0);
    expect(result.zones[0]).toMatchObject({min: 95, max: 114});
    expect(result.zones[4]).toMatchObject({min: 171, max: 190});
    expect(result.recommendation).toContain(
      'Consider measuring your resting heart rate',
    );
  });

  it('preserves the source validation messages and bounds', () => {
    expect(validateHeartRateValues({...baseValues, age: ''}).age).toBe(
      'Please enter a valid age (15-100).',
    );
    expect(validateHeartRateValues({...baseValues, age: '14'}).age).toBe(
      'Please enter a valid age (15-100).',
    );
    expect(validateHeartRateValues({...baseValues, age: '101'}).age).toBe(
      'Please enter a valid age (15-100).',
    );
    expect(
      validateHeartRateValues({
        ...baseValues,
        restingHeartRate: '200',
      }).restingHeartRate,
    ).toBe('Please enter a valid resting heart rate (40-100) or leave blank.');
    expect(
      validateHeartRateValues({...baseValues, fitnessLevel: ''}).fitnessLevel,
    ).toBe('Please select your fitness level.');
    expect(
      validateHeartRateValues({...baseValues, method: ''}).method,
    ).toBe('Please select a calculation method.');
  });
});
