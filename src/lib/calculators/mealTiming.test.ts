import {describe, expect, it} from 'vitest';
import {
  calculateMealTiming,
  formatMinutesToTime,
  parseTimeIntoMinutes,
  validateMealTimingValues,
  type MealTimingValues,
} from './mealTiming';

const baseValues: MealTimingValues = {
  goal: 'muscle-gain',
  workoutSchedule: 'evening',
  workoutDuration: 'medium',
  workoutIntensity: 'high',
  frequency: '5',
  wakeTime: '07:00',
  sleepTime: '23:00',
  dietaryPreferences: [],
  specialConsiderations: [],
};

describe('Meal Timing Planner', () => {
  it('builds the source meal schedule and adds a missing post-workout meal', () => {
    const result = calculateMealTiming(baseValues);

    expect(result.goalLabel).toBe('MUSCLE GAIN');
    expect(result.workoutLabel).toBe('EVENING');
    expect(result.meals.map((meal) => meal.time)).toEqual([
      '07:00',
      '10:12',
      '13:24',
      '16:36',
      '19:48',
      '20:30',
    ]);
    expect(result.meals[3]?.isPreWorkout).toBe(true);
    expect(result.meals[5]?.type).toBe('Post-Workout Shake/Meal');
    expect(result.meals[5]?.focus).toBe('Fast Carbs & High Protein');
  });

  it('does not add meals outside the awake window', () => {
    const result = calculateMealTiming({
      ...baseValues,
      workoutSchedule: 'early-morning',
      workoutDuration: 'short',
      frequency: '3',
    });

    expect(result.meals).toHaveLength(3);
    expect(result.meals.some((meal) => meal.isPreWorkout)).toBe(false);
    expect(result.meals[0]?.isPostWorkout).toBe(true);
  });

  it('uses the source timeline, recommendations, and tips', () => {
    const result = calculateMealTiming(baseValues);

    expect(result.timeline.map((item) => item.title)).toEqual([
      'Pre-Workout Meal',
      'Workout Fuel',
      'Recovery Meal',
    ]);
    expect(result.recommendations.map((item) => item.category)).toEqual([
      'Protein',
      'Carbs',
      'Fats',
      'Timing',
    ]);
    expect(result.recommendations[0]?.guideline).toBe('25-35g per meal');
    expect(result.tips).toHaveLength(5);
    expect(result.tips[0]?.title).toBe('Consistency is Key');
  });

  it('falls back instead of throwing for strength and general-health goals', () => {
    const strength = calculateMealTiming({...baseValues, goal: 'strength'});
    const general = calculateMealTiming({
      ...baseValues,
      goal: 'general-health',
    });

    expect(strength.recommendations[0]?.guideline).toBe(
      '20-30g per meal',
    );
    expect(general.goalLabel).toBe('GENERAL HEALTH');
    expect(general.recommendations).toHaveLength(4);
  });

  it('preserves the source time parsing and rounding quirk', () => {
    expect(parseTimeIntoMinutes('07:30')).toBe(450);
    expect(formatMinutesToTime(450)).toBe('07:30');
    expect(formatMinutesToTime(479.5)).toBe('07:00');
  });

  it('preserves the source validation messages and bounds', () => {
    const errors = validateMealTimingValues({
      ...baseValues,
      goal: '',
      workoutSchedule: '',
      workoutDuration: '',
      workoutIntensity: '',
      frequency: '7',
      wakeTime: '',
      sleepTime: '',
    });

    expect(errors.goal).toBe('Please select your primary fitness goal.');
    expect(errors.workoutSchedule).toBe(
      'Please select your workout schedule.',
    );
    expect(errors.workoutDuration).toBe(
      'Please select your typical workout duration.',
    );
    expect(errors.workoutIntensity).toBe(
      'Please select your workout intensity.',
    );
    expect(errors.frequency).toBe(
      'Please select a valid daily meal frequency (3-6).',
    );
    expect(errors.wakeTime).toBe(
      'Please enter your typical wake-up time.',
    );
    expect(errors.sleepTime).toBe('Please enter your typical bedtime.');
    expect(
      validateMealTimingValues({...baseValues, wakeTime: 'nope'}).wakeTime,
    ).toBe('Invalid wake-up or bedtime format. Please use HH:MM.');
  });
});
