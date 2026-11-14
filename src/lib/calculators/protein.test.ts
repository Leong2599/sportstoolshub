import {describe, expect, it} from 'vitest';
import {
  calculateProtein,
  validateProteinValues,
  type ProteinValues,
} from './protein';

const baseValues: ProteinValues = {
  weight: '80',
  weightUnit: 'kg',
  gender: 'male',
  age: '30',
  activityLevel: 'moderate',
  fitnessGoal: 'build-muscle',
  dietType: 'omnivore',
};

describe('Protein calculator', () => {
  it('matches the source multiplier stack and meal distribution', () => {
    const result = calculateProtein(baseValues);

    expect(result.dailyProtein).toBe(144);
    expect(result.display).toBe('144g');
    expect(result.proteinPerKg).toBe('1.8');
    expect(result.perKgDisplay).toBe('1.8g/kg');
    expect(result.meals.map((meal) => meal.grams)).toEqual([36, 43, 43, 22]);
  });

  it('applies the age and plant-based adjustments', () => {
    const result = calculateProtein({
      ...baseValues,
      age: '70',
      activityLevel: 'sedentary',
      fitnessGoal: 'maintain',
      dietType: 'vegan',
    });

    expect(result.dailyProtein).toBe(77);
    expect(result.proteinPerKg).toBe('1.0');
  });

  it('converts pounds before calculating', () => {
    const result = calculateProtein({
      ...baseValues,
      weight: '176.37',
      weightUnit: 'lbs',
    });

    expect(result.dailyProtein).toBe(144);
  });

  it('returns the source protein source groups by diet type', () => {
    expect(
      calculateProtein({...baseValues, dietType: 'omnivore'}).sources.map(
        (group) => group.title,
      ),
    ).toEqual(['Complete Protein Sources', 'Protein Timing Tips']);
    expect(
      calculateProtein({...baseValues, dietType: 'vegan'}).sources.map(
        (group) => group.title,
      ),
    ).toEqual(['Plant-Based Proteins', 'Protein Timing Tips']);
  });

  it('matches the source fitness-goal recommendation copy', () => {
    expect(calculateProtein(baseValues).recommendations).toContain(
      'For muscle building, consume protein within 2 hours post-workout',
    );
    expect(
      calculateProtein({...baseValues, fitnessGoal: 'endurance'})
        .recommendations,
    ).toContain('For endurance, protein helps repair muscle damage');
  });

  it('preserves the source validation bounds and messages', () => {
    expect(validateProteinValues({...baseValues, weight: '29'}).weight).toBe(
      'Please enter a valid weight (min 30).',
    );
    expect(validateProteinValues({...baseValues, gender: ''}).gender).toBe(
      'Please select your gender.',
    );
    expect(validateProteinValues({...baseValues, age: '14'}).age).toBe(
      'Please enter a valid age (15-100).',
    );
    expect(
      validateProteinValues({...baseValues, activityLevel: ''}).activityLevel,
    ).toBe('Please select your activity level.');
    expect(
      validateProteinValues({...baseValues, fitnessGoal: ''}).fitnessGoal,
    ).toBe('Please select your fitness goal.');
    expect(validateProteinValues({...baseValues, dietType: ''}).dietType).toBe(
      'Please select your diet type.',
    );
  });
});
