import {describe, expect, it} from 'vitest';
import {
  ALTITUDE_ERRORS,
  assessAltitudeHealthRisks,
  calculateAltitudeAdjustments,
  calculateAltitudeBenefits,
  calculatePerformanceDecrease,
  calculateTrainingZones,
  calculateVo2MaxDecrease,
  validateAltitudeValues,
  type AltitudeValues,
} from './altitudeAdjustment';

const baseValues: AltitudeValues = {
  activityType: 'running',
  paceMinutes: '4',
  paceSeconds: '30',
  targetAltitude: '2500',
  altitudeUnit: 'meters',
  homeAltitude: '0',
  homeUnit: 'meters',
  acclimationDays: '5',
  fitnessLevel: 'competitive',
  duration: '60',
  durationUnit: 'minutes',
  calculationType: 'training',
};

describe('Altitude adjustment calculator', () => {
  it('matches the source altitude analysis for a 2500m target', () => {
    const result = calculateAltitudeAdjustments(baseValues);

    expect(result.seaLevelPace).toBe('4:30');
    expect(result.adjustedPace).toBe('4:49');
    expect(result.paceAdjustment).toBe(19);
    expect(result.paceAdjustmentPercent).toBe('7.0');
    expect(result.targetAltitude).toBe('2500');
    expect(result.homeAltitude).toBe('0');
    expect(result.altitudeDifference).toBe('2500');
    expect(result.vo2MaxDecrease).toBe('10.0');
    expect(result.performanceDecrease).toBe('7.1');
    expect(result.healthRisks).toBe('Low');
    expect(result.acclimatizationPercent).toBe(36);
    expect(result.trainingZones[0]).toEqual({
      name: 'Recovery',
      seaLevelPace: '5:51',
      altitudePace: '6:16',
      adjustmentPercent: 7.037037037037042,
    });  });

  it('matches the source VO2 max and performance decrease helpers', () => {
    expect(calculateVo2MaxDecrease(2500, 0)).toBeCloseTo(10, 10);
    expect(calculateVo2MaxDecrease(1000, 0)).toBe(0);
    expect(calculateVo2MaxDecrease(2500, 2500)).toBe(0);
    expect(
      calculatePerformanceDecrease(2500, 0, 5, 'competitive'),
    ).toBeCloseTo(7.142857142857142, 10);
    expect(
      calculatePerformanceDecrease(2500, 0, 0, 'beginner'),
    ).toBeCloseTo(12, 10);
  });

  it('matches the source training zones and acclimatisation benefits', () => {
    const zones = calculateTrainingZones(270, 289, 'running');

    expect(zones).toHaveLength(6);
    expect(zones.map((zone) => zone.name)).toEqual([
      'Recovery',
      'Easy',
      'Moderate',
      'Threshold',
      'VO2 Max',
      'Speed',
    ]);
    expect(calculateTrainingZones(270, 289, 'cycling')[0].name).toBe('Recovery');
    expect(calculateTrainingZones(270, 289, 'swimming')[1].name).toBe('Easy');

    expect(calculateAltitudeBenefits(2500, 5, 60)).toEqual({
      redBloodCellIncrease: 0,
      hemoglobinIncrease: 0,
      vo2MaxPotentialIncrease: 0,
      performanceTimeframe: '',
    });
    expect(calculateAltitudeBenefits(2500, 28, 60)).toEqual({
      redBloodCellIncrease: 10,
      hemoglobinIncrease: 8,
      vo2MaxPotentialIncrease: 5,
      performanceTimeframe: '2-3 weeks after return to sea level',
    });
    expect(assessAltitudeHealthRisks(2500, 60, 5, 'competitive')).toBe('Low');
    expect(assessAltitudeHealthRisks(6000, 300, 0, 'beginner')).toBe(
      'Very High',
    );
  });

  it('preserves the source validation messages and bounds', () => {
    expect(
      validateAltitudeValues({...baseValues, activityType: ''}).activityType,
    ).toBe(ALTITUDE_ERRORS.activityType);
    expect(
      validateAltitudeValues({
        ...baseValues,
        paceMinutes: '0',
        paceSeconds: '0',
      }).paceMinutes,
    ).toBe(ALTITUDE_ERRORS.pace);
    expect(
      validateAltitudeValues({...baseValues, targetAltitude: ''}).targetAltitude,
    ).toBe(ALTITUDE_ERRORS.targetAltitude);
    expect(
      validateAltitudeValues({...baseValues, homeAltitude: ''}).homeAltitude,
    ).toBe(ALTITUDE_ERRORS.homeAltitude);
    expect(
      validateAltitudeValues({...baseValues, acclimationDays: ''})
        .acclimationDays,
    ).toBe(ALTITUDE_ERRORS.acclimationDays);
    expect(
      validateAltitudeValues({...baseValues, fitnessLevel: ''}).fitnessLevel,
    ).toBe(ALTITUDE_ERRORS.fitnessLevel);
    expect(
      validateAltitudeValues({...baseValues, duration: ''}).duration,
    ).toBe(ALTITUDE_ERRORS.duration);
    expect(
      validateAltitudeValues({...baseValues, calculationType: ''})
        .calculationType,
    ).toBe(ALTITUDE_ERRORS.calculationType);
  });
});
