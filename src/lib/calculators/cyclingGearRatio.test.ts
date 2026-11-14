import {describe, expect, it} from 'vitest';
import {
  calculateGearRatios,
  GEAR_ERRORS,
  parseCassette,
  parseChainrings,
  validateGearValues,
  type GearValues,
} from './cyclingGearRatio';

const baseValues: GearValues = {
  bikeType: 'road',
  chainrings: '53-39',
  cassette: '11-28',
  wheelSize: '700c',
  tireSize: '25',
  targetCadence: '90',
  riderType: 'balanced',
  terrainType: 'flat',
  fitnessLevel: 'recreational',
};

describe('Cycling gear ratio calculator', () => {
  it('parses chainrings and cassettes the source way', () => {
    expect(parseChainrings('53-39')).toEqual([53, 39]);
    expect(parseChainrings('single-32')).toEqual([32]);
    expect(parseCassette('11-28')).toEqual([
      11, 12, 13, 14, 15, 16, 18, 20, 22, 24, 26, 28,
    ]);
    expect(parseCassette('11-32')).toHaveLength(14);
  });

  it('matches the source gear analysis for a road setup', () => {
    const result = calculateGearRatios(baseValues);

    expect(result.gears).toHaveLength(24);
    expect(result.highestGear).toEqual({
      chainring: 53,
      cog: 11,
      gearRatio: '4.82',
      metersPerCrank: '10.17',
      speedAtTargetCadence: '54.9',
      gearInches: '130.1',
      development: '10.17',
    });
    expect(result.lowestGear).toEqual({
      chainring: 39,
      cog: 28,
      gearRatio: '1.39',
      metersPerCrank: '2.94',
      speedAtTargetCadence: '15.9',
      gearInches: '37.6',
      development: '2.94',
    });
    expect(result.gearRange).toBeCloseTo(3.467625899280576, 10);
    expect(result.recommendedCadence).toBe(85);
  });

  it('matches the source optimal gear selection', () => {
    const result = calculateGearRatios(baseValues);

    expect(result.cruisingGear?.chainring).toBe(53);
    expect(result.cruisingGear?.cog).toBe(24);
    expect(result.cruisingGear?.speedAtTargetCadence).toBe('25.2');
    expect(result.climbingGear?.chainring).toBe(39);
    expect(result.climbingGear?.cog).toBe(22);
    expect(result.highCadenceGear?.chainring).toBe(39);
    expect(result.highCadenceGear?.cog).toBe(11);
  });

  it('matches the source single-ring mountain setup', () => {
    const result = calculateGearRatios({
      ...baseValues,
      bikeType: 'mountain',
      chainrings: 'single-32',
      cassette: '11-46',
      wheelSize: '29er',
      tireSize: '2.3',
      targetCadence: '85',
    });

    expect(result.gears).toHaveLength(21);
    expect(result.highestGear.gearRatio).toBe('2.91');
    expect(result.highestGear.speedAtTargetCadence).toBe('29.2');
    expect(result.highestGear.development).toBe('5.73');
  });

  it('applies the source cadence and terrain adjustments', () => {
    expect(
      calculateGearRatios({
        ...baseValues,
        riderType: 'spinner',
        terrainType: 'climbing',
      }).recommendedCadence,
    ).toBe(85);
    expect(
      calculateGearRatios({
        ...baseValues,
        riderType: 'masher',
        terrainType: 'time-trial',
      }).recommendedCadence,
    ).toBe(85);
    expect(
      calculateGearRatios({
        ...baseValues,
        riderType: 'balanced',
        terrainType: 'rolling',
      }).recommendedCadence,
    ).toBe(90);
  });

  it('generates the source recommendations and insights', () => {
    const climbing = calculateGearRatios({
      ...baseValues,
      terrainType: 'climbing',
      riderType: 'spinner',
      fitnessLevel: 'elite',
    });

    expect(climbing.recommendations).toContain(
      'Your lowest gear should allow climbing at 60-70 RPM',
    );
    expect(climbing.recommendations).toContain(
      'Ensure you have gears to maintain 90-100+ RPM',
    );
    expect(climbing.recommendations).toContain(
      'Consider tight gear spacing for optimal power output',
    );

    const mixed = calculateGearRatios({
      ...baseValues,
      bikeType: 'time-trial',
      chainrings: 'single-55',
      cassette: '11-23',
      terrainType: 'mixed',
    });

    expect(mixed.gears).toHaveLength(10);
    expect(mixed.insights).toContain(
      'Mixed terrain benefits from wider gear range - consider 2x setup',
    );
  });

  it('preserves the source validation messages and bounds', () => {
    expect(validateGearValues({...baseValues, bikeType: ''}).bikeType).toBe(
      GEAR_ERRORS.bikeType,
    );
    expect(
      validateGearValues({...baseValues, chainrings: ''}).chainrings,
    ).toBe(GEAR_ERRORS.chainrings);
    expect(validateGearValues({...baseValues, cassette: ''}).cassette).toBe(
      GEAR_ERRORS.cassette,
    );
    expect(validateGearValues({...baseValues, wheelSize: ''}).wheelSize).toBe(
      GEAR_ERRORS.wheelSize,
    );
    expect(validateGearValues({...baseValues, tireSize: ''}).tireSize).toBe(
      GEAR_ERRORS.tireSize,
    );
    expect(
      validateGearValues({...baseValues, targetCadence: '0'}).targetCadence,
    ).toBe(GEAR_ERRORS.targetCadence);
    expect(validateGearValues({...baseValues, riderType: ''}).riderType).toBe(
      GEAR_ERRORS.riderType,
    );
    expect(validateGearValues({...baseValues, terrainType: ''}).terrainType).toBe(
      GEAR_ERRORS.terrainType,
    );
    expect(
      validateGearValues({...baseValues, fitnessLevel: ''}).fitnessLevel,
    ).toBe(GEAR_ERRORS.fitnessLevel);
  });
});
