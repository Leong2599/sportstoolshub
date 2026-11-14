import {describe, expect, it} from 'vitest';
import {
  calculatePreWorkout,
  validatePreWorkoutValues,
  type PreWorkoutValues,
} from './preWorkoutNutrition';

const baseValues: PreWorkoutValues = {
  bodyWeight: '75',
  gender: 'male',
  workoutType: 'strength',
  workoutDuration: '60',
  workoutIntensity: 'moderate',
  workoutTime: '17:00',
  primaryGoal: 'performance',
  digestionComfort: 'moderate',
  dietaryRestrictions: 'none',
};

describe('Pre-Workout Nutrition Planner', () => {
  it('matches the source strength macro targets', () => {
    const result = calculatePreWorkout(baseValues);

    expect(result.totalCarbs).toBe(75);
    expect(result.totalProtein).toBe(30);
    expect(result.totalCalories).toBe(420);
    expect(result.caloriesPerKg).toBe('5.6');
    expect(result.timeline).toHaveLength(4);
    expect(result.timeline[2]?.meal).toBe('Optional light snack');
    expect(result.hydration).toHaveLength(4);
  });

  it('applies endurance, intensity, and plant-based branches', () => {
    const result = calculatePreWorkout({
      ...baseValues,
      bodyWeight: '70',
      workoutType: 'endurance',
      workoutIntensity: 'high',
      dietaryRestrictions: 'vegan',
    });

    expect(result.totalCarbs).toBe(252);
    expect(result.totalProtein).toBe(17);
    expect(result.totalCalories).toBe(1076);
    expect(result.caloriesPerKg).toBe('15.4');
    expect(result.timeline[2]?.meal).toBe(
      'Quick fuel: 10-20% of total carbs',
    );
    expect(result.suggestions).toEqual([
      {
        title: 'Plant-Based Options',
        items: [
          'Oatmeal with banana and nut butter',
          'Quinoa bowl with sweet potato',
          'Smoothie with plant protein',
        ],
      },
    ]);
  });

  it('uses the source default macros for other workout types', () => {
    const result = calculatePreWorkout({
      ...baseValues,
      workoutType: 'sports',
      workoutIntensity: 'low',
    });

    expect(result.totalCarbs).toBe(90);
    expect(result.totalProtein).toBe(15);
    expect(result.totalCalories).toBe(420);
  });

  it('preserves the source validation and required fields', () => {
    expect(
      validatePreWorkoutValues({...baseValues, bodyWeight: '0'}).bodyWeight,
    ).toBe('Please enter a valid body weight.');
    expect(
      validatePreWorkoutValues({...baseValues, workoutDuration: '0'})
        .workoutDuration,
    ).toBe('Please enter a valid workout duration.');
    expect(
      validatePreWorkoutValues({...baseValues, workoutType: ''}).workoutType,
    ).toBe('Please select a workout type.');
    expect(
      validatePreWorkoutValues({...baseValues, workoutIntensity: ''})
        .workoutIntensity,
    ).toBe('Please select an intensity level.');
    expect(
      validatePreWorkoutValues({...baseValues, workoutTime: ''}).workoutTime,
    ).toBe('Please enter your workout start time.');
  });
});
