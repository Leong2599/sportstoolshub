import {describe, expect, it} from 'vitest';
import {
  calculateHeatAdjustments,
  calculateHeatIndex,
  calculateHydrationStrategy,
  calculatePaceAdjustment,
  calculatePerformanceImpact,
  calculateWbgt,
  determineHeatStressLevel,
  HEAT_ERRORS,
  validateHeatValues,
  type HeatValues,
} from './heatAcclimatization';

const baseValues: HeatValues = {
  activityType: 'running',
  paceMinutes: '5',
  paceSeconds: '0',
  temperature: '32',
  temperatureUnit: 'celsius',
  humidity: '70',
  acclimationDays: '7',
  bodyWeight: '75',
  weightUnit: 'kg',
  duration: '90',
  durationUnit: 'minutes',
  intensity: 'hard',
};

describe('Heat acclimatization calculator', () => {
  it('matches the source heat analysis for a hot humid run', () => {
    const result = calculateHeatAdjustments(baseValues);

    expect(result.heatIndex).toBe('166.0');
    expect(result.wetBulbGlobeTemp).toBe('28.8');
    expect(result.heatStressLevel).toBe('Very High');
    expect(result.normalPace).toBe('5:00');
    expect(result.adjustedPace).toBe('5:53');
    expect(result.paceAdjustment).toBe(53);
    expect(result.paceAdjustmentPercent).toBe('17.7');
    expect(result.performanceImpact).toBe('Significant');
    expect(result.riskAssessment).toBe('Medium');
    expect(result.acclimatizationPercent).toBe(50);
    expect(result.hydrationStrategy).toEqual({
      totalFluid: 3240,
      fluidPerHour: 2160,
      electrolytes: 810,
      electrolytesPerHour: 540,
    });
  });

  it('matches the source heat index and WBGT helpers', () => {
    expect(calculateHeatIndex(20, 50)).toBe(20);
    expect(calculateHeatIndex(32, 70)).toBeCloseTo(165.97772214, 8);
    expect(calculateWbgt(32, 70)).toBeCloseTo(28.8, 10);
    expect(determineHeatStressLevel(0, 15)).toBe('Low');
    expect(determineHeatStressLevel(0, 20)).toBe('Moderate');
    expect(determineHeatStressLevel(0, 25)).toBe('High');
    expect(determineHeatStressLevel(0, 29)).toBe('Very High');
    expect(determineHeatStressLevel(0, 35)).toBe('Extreme');
  });

  it('matches the source pace adjustment with acclimatisation benefit', () => {
    expect(calculatePaceAdjustment(32, 70, 'running', 0, 'hard')).toBe(66);
    expect(calculatePaceAdjustment(32, 70, 'running', 7, 'hard')).toBe(53);
    expect(calculatePaceAdjustment(32, 70, 'swimming', 0, 'hard')).toBe(40);
    expect(calculatePerformanceImpact(53, 'Very High', 7)).toBe('Significant');
    expect(calculatePerformanceImpact(53, 'Very High', 14)).toBe('Moderate');
    expect(calculateHydrationStrategy(90, 32, 70, 75, 'running', 'hard')).toEqual(
      {
        totalFluid: 3240,
        fluidPerHour: 2160,
        electrolytes: 810,
        electrolytesPerHour: 540,
      },
    );
  });

  it('preserves the source validation messages and bounds', () => {
    expect(
      validateHeatValues({...baseValues, activityType: ''}).activityType,
    ).toBe(HEAT_ERRORS.activityType);
    expect(
      validateHeatValues({...baseValues, paceMinutes: '0', paceSeconds: '0'})
        .paceMinutes,
    ).toBe(HEAT_ERRORS.pace);
    expect(
      validateHeatValues({...baseValues, temperature: ''}).temperature,
    ).toBe(HEAT_ERRORS.temperature);
    expect(validateHeatValues({...baseValues, humidity: ''}).humidity).toBe(
      HEAT_ERRORS.humidity,
    );
    expect(
      validateHeatValues({...baseValues, acclimationDays: ''}).acclimationDays,
    ).toBe(HEAT_ERRORS.acclimationDays);
    expect(
      validateHeatValues({...baseValues, bodyWeight: ''}).bodyWeight,
    ).toBe(HEAT_ERRORS.bodyWeight);
    expect(
      validateHeatValues({...baseValues, duration: ''}).duration,
    ).toBe(HEAT_ERRORS.duration);
    expect(
      validateHeatValues({...baseValues, intensity: ''}).intensity,
    ).toBe(HEAT_ERRORS.intensity);
  });
});
