import {describe, expect, it} from 'vitest';
import {
  calculateStrokeEfficiency,
  getOptimalRanges,
  STROKE_ERRORS,
  validateStrokeValues,
  type StrokeValues,
} from './swimStrokeEfficiency';

const baseValues: StrokeValues = {
  strokeType: 'freestyle',
  poolLength: '50',
  distance: '1000',
  distanceUnit: 'meters',
  timeMinutes: '15',
  timeSeconds: '0',
  strokeCount: '700',
  experienceLevel: 'intermediate',
  trainingGoal: 'fitness',
  swimmerType: 'distance',
};

describe('Swimming stroke efficiency calculator', () => {
  it('matches the source metrics for 1000m in 15:00', () => {
    const result = calculateStrokeEfficiency(baseValues);

    expect(result.pace).toBe('1:30');
    expect(result.speed).toBe('4.00');
    expect(result.strokeRate).toBe(47);
    expect(result.distancePerStroke).toBe('1.43');
    expect(result.swolf).toBe(80);
    expect(result.strokesPerLength).toBe(35);
    expect(result.efficiencyIndex).toBe(69);
    expect(result.technicalEfficiency).toBe(0);
    expect(result.performanceLevel).toBe('Novice');
  });

  it('matches the source yard conversion', () => {
    const result = calculateStrokeEfficiency({
      ...baseValues,
      poolLength: '25',
      distance: '100',
      distanceUnit: 'yards',
      timeMinutes: '1',
      timeSeconds: '15',
      strokeCount: '40',
      experienceLevel: 'beginner',
    });

    expect(result.pace).toBe('1:22');
    expect(result.strokeRate).toBe(32);
    expect(result.distancePerStroke).toBe('2.29');
    expect(result.swolf).toBe(31);
    expect(result.performanceLevel).toBe('Elite');
  });

  it('exposes the source optimal ranges by stroke and experience', () => {
    expect(getOptimalRanges('freestyle').swolf.intermediate).toEqual({
      min: 30,
      max: 45,
    });
    expect(getOptimalRanges('backstroke').strokeRate.elite).toEqual({
      min: 50,
      max: 70,
    });
    expect(getOptimalRanges('butterfly').distancePerStroke.beginner).toEqual({
      min: 0.8,
      max: 1.3,
    });
    expect(getOptimalRanges('individual-medley')).toBe(
      getOptimalRanges('freestyle'),
    );
  });

  it('generates the source improvement areas and recommendations', () => {
    const result = calculateStrokeEfficiency({
      ...baseValues,
      trainingGoal: 'triathlon',
    });

    expect(result.improvementAreas).toContain(
      'Reduce stroke count by improving catch and pull technique',
    );
    expect(result.improvementAreas).toContain(
      'Increase distance per stroke through better extension',
    );
    expect(result.trainingRecommendations).toContain(
      'Triathlon focus: Maintain efficiency over long distances',
    );
    expect(result.trainingRecommendations).toContain(
      'Drill: Extension drills - reach full extension before pull',
    );
    expect(result.insights).toContain(
      'SWOLF score indicates room for significant efficiency improvement',
    );
  });

  it('preserves the source validation messages and bounds', () => {
    expect(
      validateStrokeValues({...baseValues, strokeType: ''}).strokeType,
    ).toBe(STROKE_ERRORS.strokeType);
    expect(validateStrokeValues({...baseValues, poolLength: ''}).poolLength).toBe(
      STROKE_ERRORS.poolLength,
    );
    expect(validateStrokeValues({...baseValues, distance: '0'}).distance).toBe(
      STROKE_ERRORS.distance,
    );
    expect(
      validateStrokeValues({...baseValues, timeMinutes: '0', timeSeconds: '0'})
        .timeMinutes,
    ).toBe(STROKE_ERRORS.time);
    expect(
      validateStrokeValues({...baseValues, strokeCount: '0'}).strokeCount,
    ).toBe(STROKE_ERRORS.strokeCount);
    expect(
      validateStrokeValues({...baseValues, experienceLevel: ''})
        .experienceLevel,
    ).toBe(STROKE_ERRORS.experienceLevel);
    expect(
      validateStrokeValues({...baseValues, trainingGoal: ''}).trainingGoal,
    ).toBe(STROKE_ERRORS.trainingGoal);
    expect(
      validateStrokeValues({...baseValues, swimmerType: ''}).swimmerType,
    ).toBe(STROKE_ERRORS.swimmerType);
  });
});
