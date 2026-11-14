import {describe, expect, it} from 'vitest';
import {
  calculateRefeed,
  validateRefeedValues,
  type RefeedValues,
} from './refeedDay';

const baseValues: RefeedValues = {
  gender: 'male',
  age: '30',
  currentWeight: '80',
  bodyFat: '18',
  maintenanceCalories: '2500',
  cuttingCalories: '2000',
  cuttingProtein: '160',
  cuttingCarbs: '150',
  cuttingFats: '60',
  weeksDieting: '8',
  trainingFrequency: '4',
  trainingIntensity: 'moderate',
  primaryTraining: 'strength',
  cardioAmount: '90',
  refeedFrequency: 'weekly',
  refeedStyle: 'moderate',
  refeedTiming: 'rest-day',
  carbSensitivity: 'normal',
};

describe('Refeed Day Calculator', () => {
  it('builds a moderate refeed above maintenance and splits it into macros', () => {
    const result = calculateRefeed(baseValues);

    expect(result.calorieSurplusPercent).toBe(40);
    expect(result.refeedCalories).toBe(3500);
    expect(result.calorieDifference).toBe(1500);
    expect(result.proteinGrams).toBe(160);
    expect(result.fatGrams).toBe(60);
    expect(result.carbGrams).toBe(655);
    expect(result.macros.map((macro) => macro.label)).toEqual([
      'Calories',
      'Protein',
      'Carbs',
      'Fats',
    ]);
  });

  it('scales the style percentages and applies carb sensitivity', () => {
    const aggressive = calculateRefeed({
      ...baseValues,
      refeedStyle: 'aggressive',
    });
    const conservative = calculateRefeed({
      ...baseValues,
      refeedStyle: 'conservative',
    });
    const sensitive = calculateRefeed({
      ...baseValues,
      carbSensitivity: 'sensitive',
    });

    expect(aggressive.calorieSurplusPercent).toBe(62);
    expect(aggressive.refeedCalories).toBe(4050);
    expect(conservative.calorieSurplusPercent).toBe(25);
    expect(conservative.refeedCalories).toBe(3125);
    expect(sensitive.calorieSurplusPercent).toBe(32);
    expect(sensitive.refeedCalories).toBe(3300);
  });

  it('recommends a weekly first refeed and steps up for long cuts', () => {
    const first = calculateRefeed({
      ...baseValues,
      refeedFrequency: 'never',
      weeksDieting: '4',
    });
    const longCut = calculateRefeed({
      ...baseValues,
      refeedFrequency: 'monthly',
      weeksDieting: '14',
    });

    expect(first.recommendedFrequency).toBe('weekly');
    expect(first.nextRefeedIn).toBe('In 7 days');
    expect(longCut.recommendedFrequency).toBe('3weeks');
    expect(longCut.nextRefeedIn).toBe('In 21 days');
  });

  it('builds the schedule, food list, and guidance sections', () => {
    const result = calculateRefeed(baseValues);

    expect(result.schedule.map((item) => item.label)).toContain(
      'Recommended Frequency',
    );
    expect(result.schedule.map((item) => item.label)).toContain(
      'Refeed Day Calories',
    );
    expect(result.foods.length).toBeGreaterThanOrEqual(6);
    expect(result.foods[0]?.name).toBe('White rice (cooked)');
    expect(result.timing[0]?.title).toBe('Rest Day Refeed');
    expect(result.postRefeed[0]?.title).toBe(
      'Return To Cutting Calories The Next Day',
    );
    expect(result.progression[0]?.title).toBe('Refeed More Often');
  });

  it('swaps the timing guidance for the chosen refeed day', () => {
    const result = calculateRefeed({
      ...baseValues,
      refeedTiming: 'post-leg-day',
    });

    expect(result.timing[0]?.title).toBe('After Leg Day');
  });

  it('preserves the source validation bounds', () => {
    expect(validateRefeedValues({...baseValues, age: '17'}).age).toBe(
      'Please enter an age between 18 and 80.',
    );
    expect(
      validateRefeedValues({...baseValues, maintenanceCalories: '1000'})
        .maintenanceCalories,
    ).toBe('Please enter maintenance calories between 1200 and 5000.');
    expect(
      validateRefeedValues({...baseValues, cuttingProtein: '20'})
        .cuttingProtein,
    ).toBe('Please enter cutting protein between 50 and 400 g.');
    expect(
      validateRefeedValues({...baseValues, refeedFrequency: ''})
        .refeedFrequency,
    ).toBe('Please select your current refeed frequency.');
    expect(
      validateRefeedValues({...baseValues, cardioAmount: '700'}).cardioAmount,
    ).toBe('Please enter weekly cardio between 0 and 600 minutes.');
  });
});
