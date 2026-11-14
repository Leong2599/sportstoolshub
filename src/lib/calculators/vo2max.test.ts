import {describe, expect, it} from 'vitest';
import {
  calculateVo2Max,
  getVo2MaxCategory,
  getVo2MaxRanges,
  VO2_MAX_ERRORS,
  validateVo2MaxValues,
  type Vo2MaxValues,
} from './vo2max';

const baseValues: Vo2MaxValues = {
  method: 'resting-heart-rate',
  age: '30',
  gender: 'male',
  weight: '80',
  weightUnit: 'kg',
  restingHeartRate: '60',
  runMinutes: '',
  runSeconds: '',
  distanceCovered: '',
  distanceUnit: 'km',
  stepDuration: '5',
  postExerciseHr: '',
  recoveryHr: '',
};

describe('VO2 max calculator', () => {
  it('matches the source resting heart rate method', () => {
    const result = calculateVo2Max(baseValues);

    expect(result.vo2Max).toBeCloseTo(48.45, 10);
    expect(result.display).toBe('48.5 ml/kg/min');
    expect(result.category).toBe('Average');
    expect(result.color).toBe('#f59e0b');
    expect(result.recommendation).toContain('Good foundation for improvement.');
  });

  it('matches the source 1.5 mile run method', () => {
    const result = calculateVo2Max({
      ...baseValues,
      method: '1.5-mile-run',
      runMinutes: '11',
      runSeconds: '30',
    });

    expect(result.vo2Max).toBeCloseTo(60.029999999999994, 10);
    expect(result.display).toBe('60.0 ml/kg/min');
    expect(result.category).toBe('Excellent');
  });

  it('matches the source 12 minute run method', () => {
    const result = calculateVo2Max({
      ...baseValues,
      method: '12-minute-run',
      distanceCovered: '3000',
      distanceUnit: 'meters',
    });

    expect(result.vo2Max).toBeCloseTo(52.99228705566734, 10);
    expect(result.display).toBe('53.0 ml/kg/min');
    expect(result.category).toBe('Good');
  });

  it('matches the source step test method', () => {
    const result = calculateVo2Max({
      ...baseValues,
      method: 'step-test',
      postExerciseHr: '180',
      recoveryHr: '120',
      stepDuration: '5',
    });

    expect(result.vo2Max).toBeCloseTo(78.95, 10);
    expect(result.display).toBe('79.0 ml/kg/min');
    expect(result.category).toBe('Excellent');
  });

  it('applies the source age and gender range adjustments', () => {
    const ranges = getVo2MaxRanges(45, 'female');

    expect(ranges.map((range) => range.min)).toEqual([
      43.35, 36.125, 28.9, 21.675, 0,
    ]);
    expect(getVo2MaxCategory(45, 45, 'female')).toBe('Excellent');
    expect(getVo2MaxCategory(30, 30, 'male')).toBe('Fair');
    expect(getVo2MaxCategory(25, 30, 'male')).toBe('Poor');
  });

  it('preserves the source validation messages and bounds', () => {
    expect(validateVo2MaxValues({...baseValues, method: ''}).method).toBe(
      VO2_MAX_ERRORS.method,
    );
    expect(validateVo2MaxValues({...baseValues, age: ''}).age).toBe(
      VO2_MAX_ERRORS.required,
    );
    expect(validateVo2MaxValues({...baseValues, gender: ''}).gender).toBe(
      VO2_MAX_ERRORS.required,
    );
    expect(validateVo2MaxValues({...baseValues, weight: '10'}).weight).toBe(
      VO2_MAX_ERRORS.required,
    );
    expect(
      validateVo2MaxValues({...baseValues, restingHeartRate: '200'})
        .restingHeartRate,
    ).toBe(VO2_MAX_ERRORS.restingHeartRate);
    expect(
      validateVo2MaxValues({
        ...baseValues,
        method: '1.5-mile-run',
        runMinutes: '0',
        runSeconds: '0',
      }).runMinutes,
    ).toBe(VO2_MAX_ERRORS.runTime);
    expect(
      validateVo2MaxValues({
        ...baseValues,
        method: '12-minute-run',
        distanceCovered: '',
      }).distanceCovered,
    ).toBe(VO2_MAX_ERRORS.distance);
    expect(
      validateVo2MaxValues({
        ...baseValues,
        method: 'step-test',
        postExerciseHr: '50',
        recoveryHr: '120',
      }).postExerciseHr,
    ).toBe(VO2_MAX_ERRORS.heartRate);
  });
});
