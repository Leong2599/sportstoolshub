import {describe, expect, it} from 'vitest';
import {
  calculateAtl,
  calculateCtl,
  calculateFutureProjections,
  calculateTrainingLoad,
  calculateTsb,
  getOptimalRanges,
  getTargetTss,
  getTsbStatus,
  TRAINING_LOAD_ERRORS,
  validateTrainingLoadValues,
  type TrainingLoadValues,
} from './trainingLoad';

const baseValues: TrainingLoadValues = {
  sport: 'running',
  currentCtl: '60',
  currentAtl: '45',
  todayTss: '70',
  trainingGoal: 'build-phase',
  experienceLevel: 'intermediate',
  upcomingEvent: 'none',
};

describe('Training load calculator', () => {
  it('matches the source load projection after a session', () => {
    const result = calculateTrainingLoad(baseValues);

    expect(result.currentCtl).toBe('60.0');
    expect(result.currentAtl).toBe('45.0');
    expect(result.currentTsb).toBe('15.0');
    expect(result.newCtl).toBe('60.2');
    expect(result.newAtl).toBe('48.6');
    expect(result.newTsb).toBe('11.7');
    expect(result.fitnessChange).toBe('0.4');
    expect(result.fatigueChange).toBe('7.9');
    expect(result.formChange).toBe('-20.8');
    expect(result.tsbStatus).toBe('Fresh');
  });

  it('matches the source 14-day projection', () => {
    const result = calculateTrainingLoad(baseValues);

    expect(result.projections).toHaveLength(14);
    expect(result.projections[0]).toEqual({
      day: 1,
      ctl: '60.5',
      atl: '51.9',
      tsb: '8.6',
    });
    expect(result.projections[6]).toEqual({
      day: 7,
      ctl: '62.1',
      atl: '64.0',
      tsb: '-2.0',
    });
    expect(result.projections[13]).toEqual({
      day: 14,
      ctl: '63.6',
      atl: '59.8',
      tsb: '3.8',
    });
  });

  it('exposes the source exponential moving averages and helpers', () => {
    expect(calculateCtl(60, 70)).toBeCloseTo(60.23809523809523, 10);
    expect(calculateAtl(45, 70)).toBeCloseTo(48.57142857142857, 10);
    expect(calculateTsb(60.2, 48.6)).toBeCloseTo(11.6, 10);
    expect(getTargetTss('build-phase', 'intermediate')).toBeCloseTo(72, 10);
    expect(getTargetTss('taper', 'beginner')).toBeCloseTo(20, 10);
    expect(getOptimalRanges('elite')).toEqual({
      ctl: [100, 150],
      atl: [80, 120],
      tsb: [-20, 10],
    });
    expect(getTsbStatus(20)).toBe('Peak Form');
    expect(getTsbStatus(10)).toBe('Fresh');
    expect(getTsbStatus(0)).toBe('Balanced');
    expect(getTsbStatus(-10)).toBe('Fatigued');
    expect(getTsbStatus(-20)).toBe('Over-trained');
  });

  it('applies the source week-two reduction in the projection', () => {
    const projections = calculateFutureProjections(60.2, 48.6, 'build-phase', 'intermediate');
    const withoutReduction = calculateFutureProjections(
      60.2,
      48.6,
      'build-phase',
      'intermediate',
    );

    expect(projections).toEqual(withoutReduction);
    expect(
      calculateFutureProjections(0, 0, 'peak-phase', 'elite')[6].atl,
    ).toBe('92.4');
  });

  it('preserves the source validation messages and bounds', () => {
    expect(validateTrainingLoadValues({...baseValues, sport: ''}).sport).toBe(
      TRAINING_LOAD_ERRORS.sport,
    );
    expect(
      validateTrainingLoadValues({...baseValues, currentCtl: ''}).currentCtl,
    ).toBe(TRAINING_LOAD_ERRORS.currentCtl);
    expect(
      validateTrainingLoadValues({...baseValues, currentCtl: '201'}).currentCtl,
    ).toBe('Please enter current CTL between 0 and 200.');
    expect(
      validateTrainingLoadValues({...baseValues, currentAtl: ''}).currentAtl,
    ).toBe(TRAINING_LOAD_ERRORS.currentAtl);
    expect(
      validateTrainingLoadValues({...baseValues, todayTss: ''}).todayTss,
    ).toBe(TRAINING_LOAD_ERRORS.todayTss);
    expect(
      validateTrainingLoadValues({...baseValues, trainingGoal: ''}).trainingGoal,
    ).toBe(TRAINING_LOAD_ERRORS.trainingGoal);
    expect(
      validateTrainingLoadValues({...baseValues, experienceLevel: ''})
        .experienceLevel,
    ).toBe(TRAINING_LOAD_ERRORS.experienceLevel);
    expect(
      validateTrainingLoadValues({...baseValues, upcomingEvent: ''})
        .upcomingEvent,
    ).toBe(TRAINING_LOAD_ERRORS.upcomingEvent);
  });
});
