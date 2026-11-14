import {describe, expect, it} from 'vitest';
import {
  calculateAcuteChronicRatio,
  calculateCricketWorkload,
  CRICKET_ERRORS,
  validateCricketWorkloadValues,
  type CricketWorkloadValues,
} from './cricketBowlingWorkload';

const baseValues: CricketWorkloadValues = {
  bowlingType: 'fast',
  ballsBowled: '36',
  overs: '4',
  sessionDuration: '45',
  intensity: 'high',
  daysSinceLast: '3',
  age: '24',
  experience: '6',
  recentWorkload: '400',
};

describe('Cricket bowling workload tracker', () => {
  it('matches the source workload analysis for a fast bowler', () => {
    const result = calculateCricketWorkload(baseValues);

    expect(result.workloadScore).toBeCloseTo(81.12, 10);
    expect(result.workloadScoreDisplay).toBe('81.1');
    expect(result.acuteChronicRatioDisplay).toBe('0.09');
    expect(result.injuryRisk).toBe('Low');
    expect(result.fatigueLevel).toBe('Low');
    expect(result.performanceReadinessDisplay).toBe('90');
    expect(result.recoveryRecommendation).toBe('72-96 hours');
    expect(result.workloadPercentageDisplay).toBe('19');
    expect(result.ballsPerOverDisplay).toBe('9.0');
    expect(result.ballsPerMinuteDisplay).toBe('48.0');    expect(result.recommendations).toContain(
      'Focus on strengthening shoulder and core',
    );
  });

  it('matches the source analysis for a spinner with a short recovery gap', () => {
    const result = calculateCricketWorkload({
      ...baseValues,
      bowlingType: 'spin-finger',
      ballsBowled: '20',
      overs: '2',
      sessionDuration: '30',
      intensity: 'light',
      daysSinceLast: '1',
      age: '17',
      experience: '1',
      recentWorkload: '300',
    });

    expect(result.workloadScoreDisplay).toBe('25.6');
    expect(result.acuteChronicRatioDisplay).toBe('0.07');
    expect(result.injuryRisk).toBe('High');
    expect(result.fatigueLevel).toBe('Very Low');
    expect(result.performanceReadinessDisplay).toBe('60');
    expect(result.recoveryRecommendation).toBe('48+ hours');
    expect(result.workloadPercentageDisplay).toBe('15');
    expect(result.recommendations).toContain(
      'Gradual workload progression',
    );
    expect(result.recommendations).toContain(
      'Monitor growth-related injury risks',
    );
  });

  it('falls back to the source chronic estimate when there is no history', () => {
    expect(calculateAcuteChronicRatio(100, 0)).toBeCloseTo(0.4, 10);
    expect(calculateAcuteChronicRatio(0, 0)).toBe(1.0);
  });

  it('preserves the source validation messages and bounds', () => {
    expect(
      validateCricketWorkloadValues({...baseValues, bowlingType: ''})
        .bowlingType,
    ).toBe(CRICKET_ERRORS.bowlingType);
    expect(
      validateCricketWorkloadValues({...baseValues, ballsBowled: ''})
        .ballsBowled,
    ).toBe(CRICKET_ERRORS.ballsBowled);
    expect(
      validateCricketWorkloadValues({...baseValues, overs: ''}).overs,
    ).toBe(CRICKET_ERRORS.overs);
    expect(
      validateCricketWorkloadValues({...baseValues, sessionDuration: ''})
        .sessionDuration,
    ).toBe(CRICKET_ERRORS.sessionDuration);
    expect(
      validateCricketWorkloadValues({...baseValues, intensity: ''}).intensity,
    ).toBe(CRICKET_ERRORS.intensity);
    expect(
      validateCricketWorkloadValues({...baseValues, daysSinceLast: ''})
        .daysSinceLast,
    ).toBe(CRICKET_ERRORS.daysSinceLast);
    expect(
      validateCricketWorkloadValues({...baseValues, age: ''}).age,
    ).toBe(CRICKET_ERRORS.age);
    expect(
      validateCricketWorkloadValues({...baseValues, experience: ''})
        .experience,
    ).toBe(CRICKET_ERRORS.experience);
    expect(
      validateCricketWorkloadValues({...baseValues, recentWorkload: ''})
        .recentWorkload,
    ).toBe(CRICKET_ERRORS.recentWorkload);
  });
});
