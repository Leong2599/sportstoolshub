import {describe, expect, it} from 'vitest';
import {
  calculateSwimPace,
  SWIM_ERRORS,
  validateSwimValues,
  type SwimValues,
} from './swimPace';

const baseValues: SwimValues = {
  calculationType: 'time-distance',
  distance: '100',
  distanceUnit: 'meters',
  minutes: '1',
  seconds: '30',
  hundredths: '0',
  poolSize: '50',
  targetDistance: '',
  targetDistanceUnit: 'meters',
  paceMinutes: '',
  paceSeconds: '',
  intervalDistance: '100',
  intervalPaceMinutes: '1',
  intervalPaceSeconds: '30',
  restTime: '20',
  numIntervals: '10',
};

describe('Swim pace calculator', () => {
  it('matches the source pace and speed for 100m in 1:30', () => {
    const result = calculateSwimPace(baseValues);

    expect(result.headline).toBe('1:30.00 /100m');
    expect(result.headlineLabel).toBe('Your Swimming Pace');
    expect(result.stats).toContainEqual({
      label: 'Pace per 50m',
      value: '0:45.00 /50m',
    });
    expect(result.stats).toContainEqual({label: 'Speed', value: '4.00 km/h'});
    expect(result.stats).toContainEqual({label: 'Speed', value: '2.49 mph'});
    expect(result.splits).toEqual([
      {label: 'Lap 1 (50m)', time: '00:45.00'},
      {label: 'Lap 2 (50m)', time: '01:30.00'},
    ]);
    expect(result.recommendation).toContain(
      'Outstanding swimming ability! Focus on fine-tuning technique',
    );
  });

  it('matches the source yard conversion', () => {
    const result = calculateSwimPace({
      ...baseValues,
      distance: '100',
      distanceUnit: 'yards',
      minutes: '1',
      seconds: '35',
      poolSize: '25',
    });

    expect(result.headline).toBe('1:43.89 /100m');
    expect(result.splits).toHaveLength(3);
    expect(result.splits[0]).toEqual({
      label: 'Lap 1 (25m)',
      time: '00:25.97',
    });
  });

  it('matches the source predicted finish time', () => {
    const result = calculateSwimPace({
      ...baseValues,
      calculationType: 'pace-distance',
      targetDistance: '1000',
      targetDistanceUnit: 'meters',
      paceMinutes: '1',
      paceSeconds: '40',
    });

    expect(result.headline).toBe('16:40.00');
    expect(result.headlineLabel).toBe('Predicted Finish Time');
    expect(result.stats).toContainEqual({
      label: 'Target Pace',
      value: '1:40 /100m',
    });
    expect(result.splits).toHaveLength(40);
  });

  it('matches the source interval training plan', () => {
    const result = calculateSwimPace({
      ...baseValues,
      calculationType: 'intervals',
      intervalDistance: '100',
      intervalPaceMinutes: '1',
      intervalPaceSeconds: '30',
      restTime: '20',
      numIntervals: '10',
    });

    expect(result.headline).toBe('18:00');
    expect(result.headlineLabel).toBe('Total Workout Time');
    expect(result.stats).toContainEqual({label: 'Swim', value: '15:00'});
    expect(result.stats).toContainEqual({label: 'Rest', value: '3:00'});
    expect(result.intervals).toHaveLength(10);
    expect(result.intervals[0]).toEqual({
      number: 1,
      distance: '100m',
      time: '01:30.00',
      rest: '20s rest',
    });
    expect(result.intervals[9].rest).toBe('Finish');
    expect(result.recommendation).toContain(
      'This interval set covers 1000m total.',
    );
  });

  it('preserves the source validation messages and bounds', () => {
    expect(
      validateSwimValues({...baseValues, calculationType: ''})
        .calculationType,
    ).toBe(SWIM_ERRORS.calculationType);
    expect(
      validateSwimValues({...baseValues, distance: '0'}).distance,
    ).toBe(SWIM_ERRORS.distance);
    expect(
      validateSwimValues({...baseValues, minutes: '0', seconds: '0'}).minutes,
    ).toBe(SWIM_ERRORS.time);
    expect(
      validateSwimValues({
        ...baseValues,
        calculationType: 'pace-distance',
        targetDistance: '0',
      }).targetDistance,
    ).toBe(SWIM_ERRORS.distance);
    expect(
      validateSwimValues({
        ...baseValues,
        calculationType: 'pace-distance',
        paceMinutes: '0',
        paceSeconds: '0',
      }).paceMinutes,
    ).toBe(SWIM_ERRORS.pace);
    expect(
      validateSwimValues({
        ...baseValues,
        calculationType: 'intervals',
        numIntervals: '0',
      }).numIntervals,
    ).toBe(SWIM_ERRORS.intervals);
    expect(
      validateSwimValues({
        ...baseValues,
        calculationType: 'intervals',
        restTime: '5',
      }).restTime,
    ).toBe(SWIM_ERRORS.rest);
  });
});
