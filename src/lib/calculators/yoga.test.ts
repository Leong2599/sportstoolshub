import {describe, expect, it} from 'vitest';
import {
  calculateYogaCalories,
  validateYogaValues,
  YOGA_STYLES,
  type YogaValues,
} from './yoga';

const baseValues: YogaValues = {
  weight: '70',
  weightUnit: 'kg',
  gender: 'male',
  age: '30',
  experience: 'intermediate',
  yogaStyle: 'vinyasa',
  duration: '60',
  intensity: 'moderate',
  temperature: '20',
  temperatureUnit: 'celsius',
  heartRate: '0',
  bodyComposition: 'balanced',
  flexibility: 'moderate',
  breathing: 'moderate',
};

describe('Yoga calorie calculator', () => {
  it('matches the source MET calculation for a 60-minute moderate Vinyasa session', () => {
    const result = calculateYogaCalories(baseValues);

    expect(result.calories).toBe(276);
    expect(result.caloriesPerMinute).toBe(4.6);
    expect(result.caloriesPerHour).toBe(276);
    expect(result.equivalentWalkingMinutes).toBe(69);
    expect(result.duration).toBe(60);
    expect(result.yogaStyle).toBe('vinyasa');
    expect(result.intensity).toBe('moderate');
    expect(result.recommendation).toContain(
      'Outstanding calorie burn for yoga',
    );
    expect(result.recommendation).toContain(
      'Consider adding more vigorous sessions or longer durations for increased calorie burn.',
    );
    expect(result.breakdown).toEqual({
      baseCalories: 193,
      styleCalories: 55,
      individualCalories: 28,
      basePercent: 69.9,
      stylePercent: 19.9,
      individualPercent: 10.1,
    });
  });

  it('exposes source style comparisons for other moderate styles', () => {
    const result = calculateYogaCalories(baseValues);
    const byStyle = Object.fromEntries(
      result.comparisons.map((comparison) => [comparison.style, comparison]),
    );

    expect(byStyle['Hatha Yoga'].calories).toBe(175);
    expect(byStyle['Hatha Yoga'].diffText).toBe('-101');
    expect(byStyle['Ashtanga Yoga'].calories).toBe(315);
    expect(byStyle['Ashtanga Yoga'].diffText).toBe('+39');
    expect(byStyle['Power Yoga'].calories).toBe(350);
    expect(byStyle['Power Yoga'].diffText).toBe('+74');
    expect(byStyle['Yin Yoga'].calories).toBe(140);
    expect(byStyle['Yin Yoga'].diffText).toBe('-136');
  });

  it('lists all source yoga styles', () => {
    expect(YOGA_STYLES.map((style) => style.value)).toEqual([
      'hatha',
      'vinyasa',
      'ashtanga',
      'power-yoga',
      'bikram',
      'yin',
      'restorative',
      'iyengar',
      'kundalini',
      'aerial',
      'acroyoga',
    ]);
  });

  it('preserves the source required-field message and optional bounds', () => {
    expect(validateYogaValues({...baseValues, weight: ''}).weight).toBe(
      'Please fill in all required fields.',
    );
    expect(validateYogaValues({...baseValues, weight: '29'}).weight).toBe(
      'Please fill in all required fields.',
    );
    expect(validateYogaValues({...baseValues, gender: ''}).gender).toBe(
      'Please fill in all required fields.',
    );
    expect(validateYogaValues({...baseValues, age: ''}).age).toBe(
      'Please fill in all required fields.',
    );
    expect(validateYogaValues({...baseValues, age: '12'}).age).toBe(
      'Please fill in all required fields.',
    );
    expect(validateYogaValues({...baseValues, age: '101'}).age).toBe(
      'Please fill in all required fields.',
    );
    expect(validateYogaValues({...baseValues, yogaStyle: ''}).yogaStyle).toBe(
      'Please fill in all required fields.',
    );
    expect(validateYogaValues({...baseValues, duration: ''}).duration).toBe(
      'Please fill in all required fields.',
    );
    expect(validateYogaValues({...baseValues, duration: '9'}).duration).toBe(
      'Please fill in all required fields.',
    );
    expect(validateYogaValues({...baseValues, duration: '181'}).duration).toBe(
      'Please fill in all required fields.',
    );
    expect(
      validateYogaValues({...baseValues, temperature: '100'}).temperature,
    ).toBe('Please enter a valid room temperature (15-45).');
    expect(
      validateYogaValues({...baseValues, heartRate: '200'}).heartRate,
    ).toBe('Please enter a valid average heart rate (50-180).');
    expect(validateYogaValues({...baseValues, heartRate: ''}).heartRate)
      .toBeUndefined();
  });
});
