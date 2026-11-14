import {describe, expect, it} from 'vitest';
import {
  calculateStride,
  STRIDE_ERRORS,
  validateStrideValues,
  type StrideValues,
} from './strideCadence';

const baseValues: StrideValues = {
  inputType: 'pace-cadence',
  paceMinutes: '5',
  paceSeconds: '0',
  cadence: '180',
  pace2Minutes: '',
  pace2Seconds: '',
  strideLength: '',
  cadence2: '',
  strideLength2: '',
  height: '',
  heightUnit: 'cm',
  heightPaceMinutes: '',
  heightPaceSeconds: '',
  experience: 'intermediate',
  distance: '10k',
  goal: 'general',
};

describe('Stride length and cadence calculator', () => {
  it('matches the source pace and cadence calculation', () => {
    const result = calculateStride(baseValues);

    expect(result.pace).toBe('5:00');
    expect(result.speed).toBe('12.00');
    expect(result.cadence).toBe(180);
    expect(result.strideLength).toBeCloseTo(111.11111111111111, 10);
    expect(result.stepLength).toBeCloseTo(55.55555555555556, 10);
    expect(result.optimalCadence).toBe(175);
    expect(result.optimalCadenceRange).toEqual([170, 180]);
    expect(result.cadenceStatus).toBe('Optimal');
    expect(result.strideStatus).toBe('Optimal');
    expect(result.groundContactTime).toBe(191);
    expect(result.verticalOscillation).toBe(9);
    expect(result.strideAngle).toBe('32.4');
    expect(result.efficiency).toBe(0);
  });

  it('matches the source pace and stride length calculation', () => {
    const result = calculateStride({
      ...baseValues,
      inputType: 'pace-stride',
      pace2Minutes: '5',
      pace2Seconds: '0',
      strideLength: '120',
    });

    expect(result.cadence).toBeCloseTo(166.66666666666669, 10);
    expect(result.pace).toBe('5:00');
    expect(result.speed).toBe('12.00');
    expect(result.strideLength).toBe(120);
  });

  it('matches the source cadence and stride length calculation', () => {
    const result = calculateStride({
      ...baseValues,
      inputType: 'cadence-stride',
      cadence2: '180',
      strideLength2: '120',
    });

    expect(result.pace).toBe('4:38');
    expect(result.speed).toBe('12.96');
    expect(result.cadence).toBe(180);
  });

  it('matches the source height based estimate', () => {
    const result = calculateStride({
      ...baseValues,
      inputType: 'height-based',
      height: '180',
      heightUnit: 'cm',
      heightPaceMinutes: '5',
      heightPaceSeconds: '0',
    });

    expect(result.strideLength).toBeCloseTo(81, 10);
    expect(result.cadence).toBeCloseTo(246.91358024691357, 10);
  });

  it('applies the source distance adjustment to optimal cadence', () => {
    expect(
      calculateStride({...baseValues, distance: 'marathon'}).optimalCadence,
    ).toBe(180);
    expect(
      calculateStride({...baseValues, distance: 'ultra'}).optimalCadence,
    ).toBe(180);
    expect(calculateStride({...baseValues, distance: '5k'}).optimalCadence).toBe(
      178,
    );
    expect(calculateStride(baseValues).optimalCadence).toBe(175);
  });

  it('generates the source recommendations and insights', () => {
    const low = calculateStride({
      ...baseValues,
      cadence: '160',
      goal: 'injury-prevention',
      distance: 'marathon',
    });

    expect(low.recommendations).toContain(
      'Increase cadence by 5-10 steps per minute for better efficiency',
    );
    expect(low.recommendations).toContain(
      'Focus on cadence of 175-180 spm to minimize impact forces',
    );
    expect(low.recommendations).toContain(
      'For marathon distance, prioritize consistent cadence over stride length',
    );

    const high = calculateStride({
      ...baseValues,
      cadence: '195',
      goal: 'speed',
    });

    expect(high.recommendations).toContain(
      'Consider slightly reducing cadence - may indicate overstriding',
    );
    expect(high.recommendations).toContain(
      'Increase both cadence and stride length for maximum speed',
    );
    expect(high.cadenceStatus).toBe('Too High');
  });

  it('preserves the source validation messages and bounds', () => {
    expect(
      validateStrideValues({...baseValues, inputType: ''}).inputType,
    ).toBe(STRIDE_ERRORS.inputType);
    expect(
      validateStrideValues({...baseValues, paceMinutes: '0', paceSeconds: '0'})
        .paceMinutes,
    ).toBe(STRIDE_ERRORS.pace);
    expect(validateStrideValues({...baseValues, cadence: '0'}).cadence).toBe(
      STRIDE_ERRORS.cadence,
    );
    expect(
      validateStrideValues({
        ...baseValues,
        inputType: 'pace-stride',
        strideLength: '0',
      }).strideLength,
    ).toBe(STRIDE_ERRORS.strideLength);
    expect(
      validateStrideValues({...baseValues, experience: ''}).experience,
    ).toBe(STRIDE_ERRORS.experience);
    expect(validateStrideValues({...baseValues, distance: ''}).distance).toBe(
      STRIDE_ERRORS.distance,
    );
    expect(validateStrideValues({...baseValues, goal: ''}).goal).toBe(
      STRIDE_ERRORS.goal,
    );
  });
});
