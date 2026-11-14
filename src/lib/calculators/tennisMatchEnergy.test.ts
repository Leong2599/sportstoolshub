import {describe, expect, it} from 'vitest';
import {
  calculateTennisMatchEnergy,
  TENNIS_ERRORS,
  validateTennisMatchEnergyValues,
  type TennisMatchEnergyValues,
} from './tennisMatchEnergy';

const baseValues: TennisMatchEnergyValues = {
  matchDuration: '120',
  durationUnit: 'minutes',
  bodyWeight: '75',
  weightUnit: 'kg',
  playingStyle: 'all-court',
  surface: 'hard-court',
  intensity: 'moderate',
  ralliesPerGame: '6',
  temperature: '25',
  temperatureUnit: 'celsius',
  humidity: '50',
};

describe('Tennis match energy calculator', () => {
  it('matches the source energy expenditure for a two hour match', () => {
    const result = calculateTennisMatchEnergy(baseValues);

    expect(result.metValueDisplay).toBe('8.4');
    expect(result.caloriesPerMinuteDisplay).toBe('11.0');
    expect(result.totalCaloriesDisplay).toBe('1323');
    expect(result.netCaloriesDisplay).toBe('1166');
    expect(result.activePlayingTimeDisplay).toBe('84');
    expect(result.distanceCoveredDisplay).toBe('7.6');
    expect(result.hydrationNeedsDisplay).toBe('83');
    expect(result.glycogenDepletionDisplay).toBe('198');
    expect(result.electrolyteLossDisplay).toBe('60');
    expect(result.energyDensityDisplay).toBe('11.0');
    expect(result.recoveryTime).toBe('72-108 hours');
    expect(result.insights).toEqual([
      'High-calorie burn - excellent for fitness and weight management',
    ]);
  });

  it('matches the source analysis for a hot aggressive clay match', () => {
    const result = calculateTennisMatchEnergy({
      ...baseValues,
      matchDuration: '90',
      bodyWeight: '68',
      playingStyle: 'aggressive-baseline',
      surface: 'clay',
      intensity: 'high',
      ralliesPerGame: '10',
      temperature: '32',
      humidity: '65',
    });

    expect(result.metValueDisplay).toBe('16.7');
    expect(result.totalCaloriesDisplay).toBe('1788');
    expect(result.hydrationNeedsDisplay).toBe('84');
    expect(result.insights).toContain(
      'Aggressive baseline style maximizes calorie expenditure',
    );
    expect(result.insights).toContain(
      'Hot conditions increase energy demand and hydration needs',
    );
  });

  it('converts hours and pounds the source way', () => {
    const result = calculateTennisMatchEnergy({
      ...baseValues,
      matchDuration: '1.5',
      durationUnit: 'hours',
      bodyWeight: '165',
      weightUnit: 'lbs',
    });

    expect(result.totalCaloriesDisplay).toBe('990');
    expect(result.netCaloriesDisplay).toBe('872');
    expect(result.distanceCoveredDisplay).toBe('5.7');
  });

  it('preserves the source validation messages and bounds', () => {
    expect(
      validateTennisMatchEnergyValues({...baseValues, matchDuration: ''})
        .matchDuration,
    ).toBe(TENNIS_ERRORS.matchDuration);
    expect(
      validateTennisMatchEnergyValues({...baseValues, bodyWeight: ''})
        .bodyWeight,
    ).toBe(TENNIS_ERRORS.bodyWeight);
    expect(
      validateTennisMatchEnergyValues({...baseValues, playingStyle: ''})
        .playingStyle,
    ).toBe(TENNIS_ERRORS.playingStyle);
    expect(
      validateTennisMatchEnergyValues({...baseValues, surface: ''}).surface,
    ).toBe(TENNIS_ERRORS.surface);
    expect(
      validateTennisMatchEnergyValues({...baseValues, intensity: ''}).intensity,
    ).toBe(TENNIS_ERRORS.intensity);
    expect(
      validateTennisMatchEnergyValues({...baseValues, ralliesPerGame: ''})
        .ralliesPerGame,
    ).toBe(TENNIS_ERRORS.ralliesPerGame);
    expect(
      validateTennisMatchEnergyValues({...baseValues, temperature: ''})
        .temperature,
    ).toBe(TENNIS_ERRORS.temperature);
    expect(
      validateTennisMatchEnergyValues({...baseValues, humidity: ''}).humidity,
    ).toBe(TENNIS_ERRORS.humidity);
  });
});
