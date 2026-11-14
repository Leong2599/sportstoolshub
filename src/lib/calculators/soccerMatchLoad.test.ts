import {describe, expect, it} from 'vitest';
import {
  calculateFatigueRisk,
  calculateSoccerMatchLoad,
  calculateTotalLoad,
  SOCCER_ERRORS,
  validateSoccerMatchLoadValues,
  type SoccerMatchLoadValues,
} from './soccerMatchLoad';

const baseValues: SoccerMatchLoadValues = {
  position: 'midfielder',
  matchDuration: '90',
  distance: '11',
  distanceUnit: 'km',
  highIntensity: '0.7',
  highIntensityUnit: 'km',
  sprints: '25',
  rating: '7.5',
  temperature: '20',
  temperatureUnit: 'celsius',
};

describe('Soccer match load calculator', () => {
  it('matches the source load analysis for a midfielder', () => {
    const result = calculateSoccerMatchLoad(baseValues);

    expect(result.totalLoad).toBeCloseTo(143.5, 10);
    expect(result.totalLoadDisplay).toBe('143.5');
    expect(result.efficiency).toBeCloseTo(98.0392156862745, 10);
    expect(result.efficiencyDisplay).toBe('98.0');
    expect(result.performanceScore).toBeCloseTo(92.5, 10);
    expect(result.distancePerMinuteDisplay).toBe('11.00');
    expect(result.highIntensityPercentageDisplay).toBe('6.4');
    expect(result.sprintFrequencyDisplay).toBe('25.0');
    expect(result.recoveryTime).toBe('96+ hours');
    expect(result.fatigueRisk).toBe('Very High');
    expect(result.comparison.distanceVsAverageDisplay).toBe('92');
    expect(result.comparison.highIntensityVsAverageDisplay).toBe('100');
    expect(result.comparison.sprintsVsAverageDisplay).toBe('100');
    expect(result.recommendations).toContain(
      'Improve stamina for 90-minute performance',
    );
  });

  it('converts miles and applies the source heat adjustment', () => {
    const result = calculateSoccerMatchLoad({
      ...baseValues,
      position: 'winger',
      matchDuration: '75',
      distance: '10',
      distanceUnit: 'miles',
      highIntensity: '0.8',
      sprints: '35',
      rating: '8',
      temperature: '30',
    });

    expect(result.totalLoadDisplay).toBe('310.9');
    expect(result.performanceScore).toBeCloseTo(96, 10);
    expect(result.fatigueRisk).toBe('Very High');
  });

  it('exposes the source load and fatigue helpers', () => {
    expect(calculateTotalLoad(11, 0.7, 25, 90, 7.5, 20)).toBeCloseTo(
      143.5,
      10,
    );
    expect(calculateFatigueRisk(5, 90, 20)).toBe('Low');
    expect(calculateFatigueRisk(13, 90, 20)).toBe('Medium');
    expect(calculateFatigueRisk(17, 90, 20)).toBe('High');
    expect(calculateFatigueRisk(21, 90, 20)).toBe('Very High');
  });

  it('preserves the source validation messages and bounds', () => {
    expect(
      validateSoccerMatchLoadValues({...baseValues, position: ''}).position,
    ).toBe(SOCCER_ERRORS.position);
    expect(
      validateSoccerMatchLoadValues({...baseValues, matchDuration: ''})
        .matchDuration,
    ).toBe(SOCCER_ERRORS.matchDuration);
    expect(
      validateSoccerMatchLoadValues({...baseValues, matchDuration: '121' })
        .matchDuration,
    ).toBe('Please enter minutes played between 1 and 120.');
    expect(
      validateSoccerMatchLoadValues({...baseValues, distance: ''}).distance,
    ).toBe(SOCCER_ERRORS.distance);
    expect(
      validateSoccerMatchLoadValues({...baseValues, highIntensity: ''})
        .highIntensity,
    ).toBe(SOCCER_ERRORS.highIntensity);
    expect(
      validateSoccerMatchLoadValues({...baseValues, sprints: ''}).sprints,
    ).toBe(SOCCER_ERRORS.sprints);
    expect(
      validateSoccerMatchLoadValues({...baseValues, rating: ''}).rating,
    ).toBe(SOCCER_ERRORS.rating);
    expect(
      validateSoccerMatchLoadValues({...baseValues, temperature: ''}).temperature,
    ).toBe(SOCCER_ERRORS.temperature);
  });
});
