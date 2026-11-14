import {describe, expect, it} from 'vitest';
import {
  calculatePace,
  PACE_ERRORS,
  PACE_RACE_DISTANCE_METERS,
  validatePaceValues,
  type PaceValues,
} from './pace';

const baseValues: PaceValues = {
  calculationType: 'time-distance',
  distance: '5',
  distanceUnit: 'km',
  hours: '0',
  minutes: '45',
  seconds: '0',
  targetDistance: '',
  targetDistanceUnit: 'km',
  paceMinutes: '',
  paceSeconds: '',
  paceUnit: 'min-per-km',
  recentDistance: '',
  recentHours: '',
  recentMinutes: '',
  recentSeconds: '',
};

describe('Pace calculator', () => {
  it('matches the source pace and speed for a 5K in 45 minutes', () => {
    const result = calculatePace(baseValues);

    expect(result.headline).toBe('9:00 min/km');
    expect(result.secondary).toBe('14:29 min/mile');
    expect(result.speed).toBe('6.67 km/h');
    expect(result.speedAlt).toBe('4.14 mph');
    expect(result.splits).toHaveLength(5);
    expect(result.splits[0]).toEqual({label: 'Km 1', time: '09:00'});
    expect(result.splits[4]).toEqual({label: 'Km 5', time: '45:00'});
    expect(result.recommendation).toContain('For 5K training');
  });

  it('matches the source imperial conversion for a 3.1 mile run', () => {
    const result = calculatePace({
      ...baseValues,
      distance: '3.1',
      distanceUnit: 'miles',
      minutes: '30',
    });

    expect(result.headline).toBe('6:01 min/km');
    expect(result.secondary).toBe('9:41 min/mile');
    expect(result.speed).toBe('9.98 km/h');
    expect(result.speedAlt).toBe('6.20 mph');
  });

  it('matches the source finish time for pace and distance', () => {
    const result = calculatePace({
      ...baseValues,
      calculationType: 'pace-distance',
      targetDistance: '10',
      targetDistanceUnit: 'km',
      paceMinutes: '5',
      paceSeconds: '0',
      paceUnit: 'min-per-km',
    });

    expect(result.headline).toBe('00:50:00');
    expect(result.headlineLabel).toBe('Predicted Finish Time');
    expect(result.secondary).toBe('5:00 min-per-km');
    expect(result.splits).toHaveLength(10);
    expect(result.recommendation).toContain('For 10K training');
  });

  it('matches the source Riegel race predictions', () => {
    const result = calculatePace({
      ...baseValues,
      calculationType: 'race-prediction',
      recentDistance: '10k',
      recentHours: '0',
      recentMinutes: '45',
      recentSeconds: '0',
    });

    expect(result.headline).toBe('00:45:00');
    expect(result.secondary).toBe('10K');
    expect(result.predictions.map((item) => item.distance)).toEqual([
      '5K',
      'Half Marathon',
      'Marathon',
    ]);
    expect(result.predictions[0].time).toBe('21:35');
    expect(result.predictions[1].time).toBe('01:39:17');
    expect(result.predictions[2].time).toBe('03:27:01');
    expect(result.recommendation).toContain('Riegel formula');
  });

  it('exposes the source race distance table', () => {
    expect(PACE_RACE_DISTANCE_METERS).toEqual({
      '5k': 5000,
      '10k': 10000,
      'half-marathon': 21097.5,
      marathon: 42195,
    });
  });

  it('preserves the source validation messages and bounds', () => {
    expect(
      validatePaceValues({...baseValues, calculationType: ''})
        .calculationType,
    ).toBe(PACE_ERRORS.calculationType);
    expect(validatePaceValues({...baseValues, distance: '0'}).distance).toBe(
      PACE_ERRORS.distance,
    );
    expect(
      validatePaceValues({...baseValues, minutes: '0', seconds: '0'}).hours,
    ).toBe(PACE_ERRORS.time);
    expect(
      validatePaceValues({
        ...baseValues,
        calculationType: 'pace-distance',
        targetDistance: '0',
      }).targetDistance,
    ).toBe(PACE_ERRORS.distance);
    expect(
      validatePaceValues({
        ...baseValues,
        calculationType: 'race-prediction',
        recentDistance: '',
      }).recentDistance,
    ).toBe(PACE_ERRORS.raceDistance);
  });
});
