import {describe, expect, it} from 'vitest';
import {
  calculatePostWorkout,
  validatePostWorkoutValues,
  type PostWorkoutValues,
} from './postWorkoutRecovery';

const baseValues: PostWorkoutValues = {
  currentWeight: '75',
  bodyFat: '',
  fitnessLevel: 'intermediate',
  primaryGoal: 'muscle-gain',
  workoutType: 'strength',
  workoutDuration: '60',
  workoutIntensity: '5',
  timeSinceWorkout: 'immediately',
  nextWorkoutTime: '24hours',
  nextWorkoutType: '',
  dietaryRestrictions: 'none',
  mealType: 'shake',
};

describe('Post-Workout Recovery Meal Builder', () => {
  it('matches the source protein, carb, ratio, and hydration targets', () => {
    const result = calculatePostWorkout(baseValues);

    expect(result.totalProtein).toBe(23);
    expect(result.totalCarbs).toBe(60);
    expect(result.totalCalories).toBe(332);
    expect(result.ratioDisplay).toBe('3:1');
    expect(result.estimatedFluidLoss).toBe(900);
    expect(result.immediateFluidGoal).toBe(1350);
    expect(result.timingTitle).toBe('Immediate Recovery Window');
    expect(result.timingBody).toBe(
      'Perfect timing! This is when muscle protein synthesis is highest.',
    );
    expect(result.suggestions[1]?.items[0]).toBe(
      '23g protein + 60g fast carbs',
    );
    expect(result.supplements).toHaveLength(3);
  });

  it('applies intensity, duration, timing, and vegan branches', () => {
    const result = calculatePostWorkout({
      ...baseValues,
      currentWeight: '70',
      workoutType: 'endurance',
      workoutDuration: '120',
      workoutIntensity: '8',
      timeSinceWorkout: '30min',
      dietaryRestrictions: 'vegan',
    });

    expect(result.totalProtein).toBe(22);
    expect(result.totalCarbs).toBe(101);
    expect(result.totalCalories).toBe(492);
    expect(result.ratioDisplay).toBe('5:1');
    expect(result.estimatedFluidLoss).toBe(2880);
    expect(result.immediateFluidGoal).toBe(4320);
    expect(result.timingTitle).toBe('Optimal Recovery Window');
    expect(result.suggestions).toEqual([
      {
        title: 'Plant-Based Recovery',
        items: [
          'Plant protein shake with banana',
          'Quinoa bowl with beans and vegetables',
          'Smoothie with plant protein and berries',
        ],
      },
    ]);
  });

  it('clamps protein to the source 20-40g range', () => {
    const result = calculatePostWorkout({
      ...baseValues,
      currentWeight: '40',
      workoutIntensity: '1',
    });

    expect(result.totalProtein).toBe(20);
    expect(result.totalCarbs).toBe(32);
    expect(result.ratioDisplay).toBe('2:1');
  });

  it('uses delayed recovery copy for later meals', () => {
    const result = calculatePostWorkout({
      ...baseValues,
      timeSinceWorkout: '2hours',
    });

    expect(result.timingTitle).toBe('Delayed Recovery');
    expect(result.timingBody).toBe(
      'Late, but still beneficial. Focus on quickly digestible nutrients.',
    );
  });

  it('preserves the source validation and required fields', () => {
    expect(
      validatePostWorkoutValues({...baseValues, currentWeight: '0'})
        .currentWeight,
    ).toBe('Please enter a valid body weight.');
    expect(
      validatePostWorkoutValues({...baseValues, workoutDuration: '0'})
        .workoutDuration,
    ).toBe('Please enter a valid workout duration.');
    expect(
      validatePostWorkoutValues({...baseValues, workoutType: ''}).workoutType,
    ).toBe('Please select a workout type.');
    expect(
      validatePostWorkoutValues({...baseValues, nextWorkoutTime: ''})
        .nextWorkoutTime,
    ).toBe('Please select when your next workout is.');
    expect(
      validatePostWorkoutValues({...baseValues, workoutIntensity: '11'})
        .workoutIntensity,
    ).toBe('Please select a workout intensity (1-10).');
  });
});
