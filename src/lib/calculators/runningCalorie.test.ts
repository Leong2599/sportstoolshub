import {describe, expect, it} from 'vitest';
import {
  calculateRunningCalories,
  getIntensityMultiplier,
  getRunningMET,
  getTerrainMultiplier,
  RUNNING_ERRORS,
  validateRunningValues,
  type RunningValues,
} from './runningCalorie';

const baseValues: RunningValues = {
  method: 'distance-pace',
  weight: '70',
  weightUnit: 'kg',
  gender: 'male',
  age: '30',
  terrain: 'flat-road',
  intensity: 'moderate',
  elevation: '',
  elevationUnit: 'meters',
  distance: '10',
  distanceUnit: 'km',
  paceMinutes: '5',
  paceSeconds: '0',
  paceUnit: 'min-per-km',
  dtDistance: '',
  dtDistanceUnit: 'km',
  timeHours: '',
  timeMinutes: '',
  timeSeconds: '',
  tpTimeHours: '',
  tpTimeMinutes: '',
  tpTimeSeconds: '',
  tpPaceMinutes: '',
  tpPaceSeconds: '',
  tpPaceUnit: 'min-per-km',
};

describe('Running calorie calculator', () => {
  it('matches the source MET calculation for a 10K at 5:00 min/km', () => {
    const result = calculateRunningCalories(baseValues);

    expect(result.calories).toBe(700);
    expect(result.distanceKm).toBeCloseTo(10, 10);
    expect(result.timeHours).toBeCloseTo(0.8333333333333334, 10);
    expect(result.pacePerKm).toBe('5:00');
    expect(result.speedKmh).toBe('12.0');
    expect(result.caloriesPerKm).toBe(70);
    expect(result.caloriesPerMinute).toBe(14);
    expect(result.time).toBe('50 minutes');
    expect(result.breakdown).toEqual({
      baseCalories: 595,
      basePercent: 85,
      elevationBonus: 105,
      elevationPercent: 15,
    });
    expect(result.comparisons).toEqual([
      {activity: 'Walking (1 hour)', calories: 280},
      {activity: 'Cycling (moderate, 1 hour)', calories: 560},
      {activity: 'Swimming (moderate, 1 hour)', calories: 630},
      {activity: 'Weight Training (1 hour)', calories: 420},
      {activity: 'Yoga (1 hour)', calories: 210},
    ]);
    expect(result.recommendation).toContain(
      'You burned 700 calories during your 10.0km run.',
    );
    expect(result.recommendation).toContain('Outstanding calorie burn!');
  });

  it('applies the source terrain, elevation, and gender adjustments', () => {
    const hilly = calculateRunningCalories({
      ...baseValues,
      terrain: 'hilly-road',
    });
    const elevated = calculateRunningCalories({
      ...baseValues,
      elevation: '300',
    });
    const female = calculateRunningCalories({
      ...baseValues,
      weight: '60',
      gender: 'female',
      age: '40',
    });

    expect(hilly.calories).toBe(804);
    expect(elevated.calories).toBe(1750);
    expect(female.calories).toBe(512);
  });

  it('matches the source distance and time method', () => {
    const result = calculateRunningCalories({
      ...baseValues,
      method: 'distance-time',
      dtDistance: '5',
      dtDistanceUnit: 'km',
      timeHours: '0',
      timeMinutes: '30',
      timeSeconds: '0',
    });

    expect(result.distanceKm).toBeCloseTo(5, 10);
    expect(result.timeHours).toBeCloseTo(0.5, 10);
    expect(result.time).toBe('30 minutes');
    expect(result.pacePerKm).toBe('6:00');
  });

  it('matches the source time and pace method', () => {
    const result = calculateRunningCalories({
      ...baseValues,
      method: 'time-pace',
      tpTimeHours: '0',
      tpTimeMinutes: '50',
      tpTimeSeconds: '0',
      tpPaceMinutes: '5',
      tpPaceSeconds: '0',
      tpPaceUnit: 'min-per-km',
    });

    expect(result.distanceKm).toBeCloseTo(10, 10);
    expect(result.calories).toBe(700);
  });

  it('exposes the source MET, terrain, and intensity tables', () => {
    expect(getRunningMET(5)).toBe(6.0);
    expect(getRunningMET(7)).toBe(8.3);
    expect(getRunningMET(9)).toBe(9.8);
    expect(getRunningMET(11)).toBe(11.0);
    expect(getRunningMET(13)).toBe(12.3);
    expect(getRunningMET(15)).toBe(14.0);
    expect(getRunningMET(17)).toBe(16.0);
    expect(getRunningMET(20)).toBe(18.0);

    expect(getTerrainMultiplier('flat-road')).toBe(1.0);
    expect(getTerrainMultiplier('hilly-road')).toBe(1.15);
    expect(getTerrainMultiplier('trail-flat')).toBe(1.1);
    expect(getTerrainMultiplier('trail-hilly')).toBe(1.25);
    expect(getTerrainMultiplier('sand')).toBe(1.4);
    expect(getTerrainMultiplier('treadmill')).toBe(0.95);

    expect(getIntensityMultiplier('easy')).toBe(0.9);
    expect(getIntensityMultiplier('moderate')).toBe(1.0);
    expect(getIntensityMultiplier('hard')).toBe(1.15);
    expect(getIntensityMultiplier('very-hard')).toBe(1.25);
    expect(getIntensityMultiplier('race')).toBe(1.3);
  });

  it('preserves the source validation messages and bounds', () => {
    expect(validateRunningValues({...baseValues, method: ''}).method).toBe(
      RUNNING_ERRORS.required,
    );
    expect(validateRunningValues({...baseValues, weight: ''}).weight).toBe(
      RUNNING_ERRORS.required,
    );
    expect(validateRunningValues({...baseValues, gender: ''}).gender).toBe(
      RUNNING_ERRORS.required,
    );
    expect(validateRunningValues({...baseValues, age: ''}).age).toBe(
      RUNNING_ERRORS.required,
    );
    expect(validateRunningValues({...baseValues, distance: '0'}).distance).toBe(
      RUNNING_ERRORS.distance,
    );
    expect(
      validateRunningValues({...baseValues, paceMinutes: '0', paceSeconds: '0'})
        .paceMinutes,
    ).toBe(RUNNING_ERRORS.pace);
    expect(validateRunningValues({...baseValues, elevation: '-5'}).elevation).toBe(
      RUNNING_ERRORS.elevation,
    );
  });
});
