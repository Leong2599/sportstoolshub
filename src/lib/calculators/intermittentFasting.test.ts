import {describe, expect, it} from 'vitest';
import {
  calculateFasting,
  formatClock,
  validateFastingValues,
  type FastingValues,
} from './intermittentFasting';

const baseValues: FastingValues = {
  gender: 'male',
  age: '32',
  currentWeight: '80',
  targetWeight: '72',
  fastingExperience: 'beginner',
  fastingMethod: '16:8',
  trainingFrequency: '4',
  primaryTrainingType: 'strength',
  trainingTime: 'morning',
  trainingIntensity: 'moderate',
  trainingDays: ['monday', 'wednesday', 'friday', 'saturday'],
  primaryGoal: 'fat-loss',
  lifestyle: 'active',
  customFastHours: '',
  customEatHours: '',
};

describe('Intermittent Fasting Planner', () => {
  it('recommends 16:8 for a beginner with fat loss and moderate training', () => {
    const result = calculateFasting(baseValues);

    expect(result.recommendedMethod.method).toBe('16:8');
    expect(result.recommendedMethod.fastHours).toBe(16);
    expect(result.recommendedMethod.eatHours).toBe(8);
    expect(result.matchesPreference).toBe(true);
    expect(result.dailyProtein).toBe(160);
    expect(result.proteinPerMeal).toBe(53);
    expect(result.mealCount).toBe(3);
  });

  it('steps the recommendation up for experienced fasters and down for high intensity', () => {
    const experienced = calculateFasting({
      ...baseValues,
      fastingExperience: 'experienced',
      primaryGoal: 'maintenance',
    });
    const highIntensity = calculateFasting({
      ...baseValues,
      fastingExperience: 'experienced',
      primaryGoal: 'maintenance',
      trainingIntensity: 'high',
    });

    expect(experienced.recommendedMethod.method).toBe('20:4');
    expect(highIntensity.recommendedMethod.method).toBe('18:6');
  });

  it('builds a seven-day plan with training days and rest days', () => {
    const result = calculateFasting(baseValues);

    expect(result.weeklyPlan).toHaveLength(7);
    expect(result.weeklyPlan[0]).toMatchObject({
      dayLabel: 'Monday',
      isTrainingDay: true,
      eatWindow: '10:00 - 18:00',
      fastWindow: '18:00 - 10:00',
    });
    expect(result.weeklyPlan[1]).toMatchObject({
      dayLabel: 'Tuesday',
      isTrainingDay: false,
      eatWindow: '12:00 - 20:00',
    });
    expect(result.weeklyPlan[0]?.note).toContain('break the fast');
  });

  it('opens the window one hour after a high-intensity session', () => {
    const result = calculateFasting({
      ...baseValues,
      trainingIntensity: 'high',
      trainingTime: 'early-morning',
    });

    expect(result.weeklyPlan[0]?.eatWindow).toBe('07:00 - 15:00');
    expect(result.alignment[0]?.title).toBe(
      'Break The Fast Around High-Intensity Work',
    );
  });

  it('marks a rest day for eat-stop-eat and a 500-calorie day for 5:2', () => {
    const eatStopEat = calculateFasting({
      ...baseValues,
      fastingMethod: 'eat-stop-eat',
      fastingExperience: 'advanced',
      primaryGoal: 'fat-loss',
      trainingIntensity: 'low',
    });
    const fiveTwo = calculateFasting({
      ...baseValues,
      fastingMethod: '5:2',
      fastingExperience: 'advanced',
      primaryGoal: 'fat-loss',
      trainingIntensity: 'low',
    });

    expect(eatStopEat.plannedMethod.method).toBe('eat-stop-eat');
    expect(
      eatStopEat.weeklyPlan.find((day) => !day.isTrainingDay)?.eatWindow,
    ).toBe('No eating window');
    expect(
      eatStopEat.weeklyPlan.find((day) => !day.isTrainingDay)?.note,
    ).toContain('rest day preferred');
    expect(fiveTwo.plannedMethod.method).toBe('5:2');
    expect(
      fiveTwo.weeklyPlan.find((day) => !day.isTrainingDay)?.eatWindow,
    ).toBe('500 calories');
  });

  it('follows an explicit custom schedule and still names the recommendation', () => {
    const result = calculateFasting({
      ...baseValues,
      fastingMethod: 'custom',
      customFastHours: '18',
      customEatHours: '6',
    });

    expect(result.plannedMethod.method).toBe('custom');
    expect(result.plannedMethod.label).toBe('Custom 18:6');
    expect(result.plannedMethod.fastHours).toBe(18);
    expect(result.plannedMethod.eatHours).toBe(6);
    expect(result.matchesPreference).toBe(true);
    expect(result.recommendedMethod.method).toBe('16:8');
  });

  it('formats clock times across the midnight boundary', () => {
    expect(formatClock(0)).toBe('00:00');
    expect(formatClock(600)).toBe('10:00');
    expect(formatClock(1440)).toBe('00:00');
    expect(formatClock(1380)).toBe('23:00');
  });

  it('preserves the source validation bounds', () => {
    expect(validateFastingValues({...baseValues, age: '17'}).age).toBe(
      'Please enter an age between 18 and 80.',
    );
    expect(
      validateFastingValues({...baseValues, currentWeight: '39'})
        .currentWeight,
    ).toBe('Please enter a current weight between 40 and 200 kg.');
    expect(
      validateFastingValues({...baseValues, trainingDays: []}).trainingDays,
    ).toBe('Please select at least one training day.');
    expect(
      validateFastingValues({...baseValues, primaryGoal: ''}).primaryGoal,
    ).toBe('Please select your primary goal.');
    expect(
      validateFastingValues({
        ...baseValues,
        fastingMethod: 'custom',
        customFastHours: '24',
      }).customFastHours,
    ).toBe('Please enter a fast length between 12 and 20 hours.');
  });
});
