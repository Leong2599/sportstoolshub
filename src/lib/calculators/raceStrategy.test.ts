import {describe, expect, it} from 'vitest';
import {
  calculateEnvironmentalAdjustments,
  calculateFuelingStrategy,
  calculateRaceStrategy,
  calculateSplitStrategy,
  calculateTargetPace,
  formatRacePace,
  formatRaceTime,
  getRaceDetails,
  RACE_STRATEGY_ERRORS,
  validateRaceStrategyValues,
  type RaceStrategyValues,
} from './raceStrategy';

const baseValues: RaceStrategyValues = {
  raceType: '10k',
  hours: '0',
  minutes: '45',
  seconds: '0',
  experienceLevel: 'intermediate',
  goalType: 'pr',
  paceStrategy: 'negative-split',
  bodyWeight: '75',
  weightUnit: 'kg',
  temperature: '25',
  temperatureUnit: 'celsius',
  humidity: '50',
};

describe('Race strategy planner', () => {
  it('matches the source strategy for a 10K target time', () => {
    const result = calculateRaceStrategy(baseValues);

    expect(result.raceType).toBe('10K Run');
    expect(result.targetTime).toBe('45:00');
    expect(result.targetPace).toBe('4:30/km');
    expect(result.targetPaceDisplay).toBe('4:30/km');
    expect(result.splitStrategy).toEqual([
      {name: 'First Half', time: 648, percentage: 48},
      {name: 'Second Half', time: 702, percentage: 52},
    ]);
    expect(result.environmentalAdjustments.riskLevel).toBe('Medium');
    expect(result.environmentalAdjustments.paceAdjustment).toBe(-8);
    expect(result.environmentalAdjustments.fluidAdjustment).toBe(15);
  });

  it('matches the source fueling timeline for a short event', () => {
    const result = calculateRaceStrategy(baseValues);

    expect(result.fuelingStrategy.fluids).toHaveLength(2);
    expect(result.fuelingStrategy.calories).toHaveLength(0);
    expect(result.fuelingStrategy.electrolytes).toHaveLength(0);
    expect(result.fuelingStrategy.fluids[0].description).toBe('425ml fluid');
  });

  it('matches the source triathlon pace split', () => {
    const result = calculateRaceStrategy({
      ...baseValues,
      raceType: 'sprint-triathlon',
      hours: '1',
      minutes: '30',
      seconds: '0',
    });

    expect(result.targetPace).toEqual({
      swim: '0:01/100m',
      bike: '1000.0 km/h',
      run: '0:02/km',
      overall: '0:07/km',
    });
  });

  it('matches the source split strategies', () => {
    expect(calculateSplitStrategy(2700, 'even-pace')).toEqual([
      {name: 'First Half', time: 1350, percentage: 50},
      {name: 'Second Half', time: 1350, percentage: 50},
    ]);
    expect(calculateSplitStrategy(2700, 'positive-split')).toEqual([
      {name: 'First Half', time: 702, percentage: 52},
      {name: 'Second Half', time: 648, percentage: 48},
    ]);
    expect(calculateSplitStrategy(2700, 'conservative-start')).toEqual([
      {name: 'First 25%', time: 702, percentage: 26},
      {name: 'Middle 50%', time: 1296, percentage: 48},
      {name: 'Final 25%', time: 702, percentage: 26},
    ]);
    expect(calculateSplitStrategy(2700, 'aggressive-start')).toEqual([
      {name: 'First 25%', time: 648, percentage: 24},
      {name: 'Middle 50%', time: 1350, percentage: 50},
      {name: 'Final 25%', time: 702, percentage: 26},
    ]);
  });

  it('exposes the source race details and formatters', () => {
    expect(getRaceDetails('marathon')).toEqual({
      name: 'Marathon',
      distance: 42.2,
      unit: 'km',
      duration: 240,
      discipline: 'running',
    });
    expect(formatRaceTime(3661)).toBe('1:01:01');
    expect(formatRaceTime(2700)).toBe('45:00');
    expect(formatRacePace(90, 'swim')).toBe('1:30/100m');
    expect(formatRacePace(120, 'bike')).toBe('30.0 km/h');
    expect(formatRacePace(270, '10k')).toBe('4:30/km');
    expect(calculateTargetPace(10, 2700, '10k')).toBe('4:30/km');
    expect(
      calculateEnvironmentalAdjustments(32, 60, 'cycling-40k'),
    ).toEqual({
      temperature: 32,
      humidity: 60,
      paceAdjustment: -18,
      fluidAdjustment: 25,
      riskLevel: 'High',
    });
    expect(
      calculateFuelingStrategy(
        {name: 'Marathon', distance: 42.2, unit: 'km', duration: 240, discipline: 'running'},
        240,
        70,
        30,
        60,
      ).electrolytes,
    ).toHaveLength(8);
  });

  it('preserves the source validation messages and bounds', () => {
    expect(
      validateRaceStrategyValues({...baseValues, raceType: ''}).raceType,
    ).toBe(RACE_STRATEGY_ERRORS.raceType);
    expect(
      validateRaceStrategyValues({...baseValues, minutes: '0', seconds: '0'})
        .hours,
    ).toBe(RACE_STRATEGY_ERRORS.targetTime);
    expect(
      validateRaceStrategyValues({...baseValues, experienceLevel: ''})
        .experienceLevel,
    ).toBe(RACE_STRATEGY_ERRORS.experienceLevel);
    expect(
      validateRaceStrategyValues({...baseValues, goalType: ''}).goalType,
    ).toBe(RACE_STRATEGY_ERRORS.goalType);
    expect(
      validateRaceStrategyValues({...baseValues, paceStrategy: ''})
        .paceStrategy,
    ).toBe(RACE_STRATEGY_ERRORS.paceStrategy);
    expect(
      validateRaceStrategyValues({...baseValues, bodyWeight: ''}).bodyWeight,
    ).toBe(RACE_STRATEGY_ERRORS.bodyWeight);
    expect(
      validateRaceStrategyValues({...baseValues, temperature: ''}).temperature,
    ).toBe(RACE_STRATEGY_ERRORS.temperature);
    expect(
      validateRaceStrategyValues({...baseValues, humidity: ''}).humidity,
    ).toBe(RACE_STRATEGY_ERRORS.humidity);
  });
});
