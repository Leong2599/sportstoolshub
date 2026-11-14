import {describe, expect, it} from 'vitest';
import {
  calculateCyclingPower,
  CYCLING_POWER_ERRORS,
  getPowerZones,
  validateCyclingPowerValues,
  type CyclingPowerValues,
} from './cyclingPower';

const baseValues: CyclingPowerValues = {
  calculationType: 'power-speed',
  speed: '30',
  speedUnit: 'kmh',
  totalWeight: '80',
  weightUnit: 'kg',
  slope: '0',
  wind: '0',
  windUnit: 'kmh',
  testDuration: '20',
  avgPower: '250',
  bodyWeight: '80',
  bodyWeightUnit: 'kg',
  powerOutput: '250',
  riderWeight: '70',
  riderWeightUnit: 'kg',
};

describe('Cycling power calculator', () => {
  it('matches the source physics calculation for 30 km/h on the flat', () => {
    const result = calculateCyclingPower(baseValues);

    expect(result.headline).toBe('174 watts');
    expect(result.headlineLabel).toBe('Estimated Power Output');
    expect(result.stats).toEqual([
      {label: 'Speed', value: '30.0 kmh'},
      {label: 'Slope', value: '0%'},
      {label: 'Total Weight', value: '80.0 kg'},
      {label: 'Wind', value: '0.0 kmh'},
    ]);
    expect(result.recommendation).toContain(
      'Your estimated power output is 174 watts',
    );
    expect(result.recommendation).toContain(
      'Good power output! Focus on threshold training (Zone 4)',
    );
  });

  it('matches the source imperial and gradient calculation', () => {
    const result = calculateCyclingPower({
      ...baseValues,
      speed: '25',
      speedUnit: 'mph',
      totalWeight: '180',
      weightUnit: 'lbs',
      slope: '2',
      wind: '10',
    });

    expect(result.headline).toBe('757 watts');
    expect(result.stats).toContainEqual({
      label: 'Total Weight',
      value: '81.6 kg',
    });
    expect(result.recommendation).toContain(
      'Outstanding power output! You\'re at an elite level.',
    );
  });

  it('matches the source FTP test durations and power-to-weight ratio', () => {
    const twenty = calculateCyclingPower({
      ...baseValues,
      calculationType: 'ftp',
    });

    expect(twenty.headline).toBe('238 watts');
    expect(twenty.headlineLabel).toBe('Functional Threshold Power (FTP)');
    expect(twenty.stats).toContainEqual({
      label: 'Power-to-Weight Ratio',
      value: '2.98 W/kg',
    });
    expect(twenty.stats).toContainEqual({
      label: 'Test Duration',
      value: '20 minutes',
    });

    expect(
      calculateCyclingPower({
        ...baseValues,
        calculationType: 'ftp',
        testDuration: '60',
      }).headline,
    ).toBe('250 watts');
    expect(
      calculateCyclingPower({
        ...baseValues,
        calculationType: 'ftp',
        testDuration: '30',
      }).headline,
    ).toBe('233 watts');
    expect(
      calculateCyclingPower({
        ...baseValues,
        calculationType: 'ftp',
        testDuration: '8',
      }).headline,
    ).toBe('225 watts');
  });

  it('matches the source power-to-weight calculation', () => {
    const result = calculateCyclingPower({
      ...baseValues,
      calculationType: 'power-weight',
      powerOutput: '250',
      riderWeight: '70',
    });

    expect(result.headline).toBe('3.57 W/kg');
    expect(result.headlineLabel).toBe('Power-to-Weight Ratio');
    expect(result.stats).toEqual([
      {label: 'Power Output', value: '250 watts'},
      {label: 'Rider Weight', value: '70.0 kg'},
    ]);
    expect(result.recommendation).toContain(
      'Excellent power-to-weight ratio!',
    );
  });

  it('exposes the source seven power training zones', () => {
    const zones = getPowerZones(250);

    expect(zones).toHaveLength(7);
    expect(zones[0].range).toBe('0-138W');
    expect(zones[1].range).toBe('138-188W');
    expect(zones[3].range).toBe('225-263W');
    expect(zones[6].range).toBe('375-500W');
    expect(zones[0].description).toBe('Active Recovery');
    expect(zones[6].description).toBe('Neuromuscular');
  });

  it('preserves the source validation messages and bounds', () => {
    expect(
      validateCyclingPowerValues({...baseValues, calculationType: ''})
        .calculationType,
    ).toBe(CYCLING_POWER_ERRORS.calculationType);
    expect(validateCyclingPowerValues({...baseValues, speed: '0'}).speed).toBe(
      CYCLING_POWER_ERRORS.speed,
    );
    expect(
      validateCyclingPowerValues({...baseValues, totalWeight: '0'})
        .totalWeight,
    ).toBe(CYCLING_POWER_ERRORS.totalWeight);
    expect(
      validateCyclingPowerValues({
        ...baseValues,
        calculationType: 'ftp',
        avgPower: '0',
      }).avgPower,
    ).toBe(CYCLING_POWER_ERRORS.avgPower);
    expect(
      validateCyclingPowerValues({
        ...baseValues,
        calculationType: 'ftp',
        bodyWeight: '0',
      }).bodyWeight,
    ).toBe(CYCLING_POWER_ERRORS.bodyWeight);
    expect(
      validateCyclingPowerValues({
        ...baseValues,
        calculationType: 'power-weight',
        powerOutput: '0',
      }).powerOutput,
    ).toBe(CYCLING_POWER_ERRORS.powerOutput);
    expect(
      validateCyclingPowerValues({
        ...baseValues,
        calculationType: 'power-weight',
        riderWeight: '0',
      }).riderWeight,
    ).toBe(CYCLING_POWER_ERRORS.riderWeight);
  });
});
