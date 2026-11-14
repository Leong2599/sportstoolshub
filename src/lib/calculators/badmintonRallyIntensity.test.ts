import {describe, expect, it} from 'vitest';
import {
  calculateBadmintonRally,
  BADMINTON_ERRORS,
  validateBadmintonRallyValues,
  type BadmintonRallyValues,
} from './badmintonRallyIntensity';

const baseValues: BadmintonRallyValues = {
  matchDuration: '45',
  durationUnit: 'minutes',
  totalRallies: '300',
  avgRallyShots: '9',
  playingFormat: 'singles',
  playStyle: 'attacking',
  opponentLevel: 'intermediate',
  smashCount: '60',
  netShots: '40',
  clears: '50',
};

describe('Badminton rally intensity calculator', () => {
  it('matches the source rally analysis for an attacking singles match', () => {
    const result = calculateBadmintonRally(baseValues);

    expect(result.intensityScoreDisplay).toBe('75.0');
    expect(result.rallyFrequencyDisplay).toBe('6.7');
    expect(result.avgRallyDurationDisplay).toBe('9.0');
    expect(result.shotsPerMinuteDisplay).toBe('60.0');
    expect(result.workRateDisplay).toBe('720');
    expect(result.tacticalDiversityDisplay).toBe('86.2');
    expect(result.fatigueFactorDisplay).toBe('93');
    expect(result.performanceRating).toBe('Excellent');
    expect(result.smashPercentageDisplay).toBe('40.0');
    expect(result.netPlayPercentageDisplay).toBe('26.7');
    expect(result.clearPercentageDisplay).toBe('33.3');
    expect(result.recommendations).toContain(
      'Focus on court coverage and stamina',
    );
  });

  it('matches the source analysis for a long doubles match', () => {
    const result = calculateBadmintonRally({
      ...baseValues,
      matchDuration: '120',
      totalRallies: '600',
      avgRallyShots: '11',
      playingFormat: 'doubles',
      playStyle: 'all-round',
      opponentLevel: 'advanced',
      smashCount: '80',
      netShots: '60',
      clears: '70',
    });

    expect(result.intensityScoreDisplay).toBe('70.0');
    expect(result.rallyFrequencyDisplay).toBe('5.0');
    expect(result.shotsPerMinuteDisplay).toBe('55.0');
    expect(result.tacticalDiversityDisplay).toBe('87.5');
    expect(result.fatigueFactorDisplay).toBe('98');
    expect(result.performanceRating).toBe('Very Good');
    expect(result.recommendations).toContain(
      'Work on partner coordination and positioning',
    );
  });

  it('preserves the source validation messages and bounds', () => {
    expect(
      validateBadmintonRallyValues({...baseValues, matchDuration: ''})
        .matchDuration,
    ).toBe(BADMINTON_ERRORS.matchDuration);
    expect(
      validateBadmintonRallyValues({...baseValues, totalRallies: ''})
        .totalRallies,
    ).toBe(BADMINTON_ERRORS.totalRallies);
    expect(
      validateBadmintonRallyValues({...baseValues, avgRallyShots: ''})
        .avgRallyShots,
    ).toBe(BADMINTON_ERRORS.avgRallyShots);
    expect(
      validateBadmintonRallyValues({...baseValues, playingFormat: ''})
        .playingFormat,
    ).toBe(BADMINTON_ERRORS.playingFormat);
    expect(
      validateBadmintonRallyValues({...baseValues, playStyle: ''}).playStyle,
    ).toBe(BADMINTON_ERRORS.playStyle);
    expect(
      validateBadmintonRallyValues({...baseValues, opponentLevel: ''})
        .opponentLevel,
    ).toBe(BADMINTON_ERRORS.opponentLevel);
    expect(
      validateBadmintonRallyValues({...baseValues, smashCount: ''}).smashCount,
    ).toBe(BADMINTON_ERRORS.smashCount);
    expect(
      validateBadmintonRallyValues({...baseValues, netShots: ''}).netShots,
    ).toBe(BADMINTON_ERRORS.netShots);
    expect(
      validateBadmintonRallyValues({...baseValues, clears: ''}).clears,
    ).toBe(BADMINTON_ERRORS.clears);
  });
});
