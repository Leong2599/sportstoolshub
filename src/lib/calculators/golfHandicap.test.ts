import {describe, expect, it} from 'vitest';
import {
  calculateGolf,
  getNumberOfScoresToUse,
  getPerformanceAssessment,
  GOLF_ERRORS,
  validateGolfValues,
  type GolfValues,
} from './golfHandicap';

const baseValues: GolfValues = {
  calculationType: 'handicap-index',
  numScores: '3',
  scores: ['90', '95', '100'],
  ratings: ['72', '73', '74'],
  slopes: ['120', '125', '130'],
  handicapIndex: '',
  courseRating: '',
  slopeRating: '',
  parScore: '',
  grossScore: '',
  courseHandicapInput: '',
};

describe('Golf handicap calculator', () => {
  it('matches the source handicap index calculation', () => {
    const result = calculateGolf(baseValues);

    expect(result.headline).toBe('16.3');
    expect(result.headlineLabel).toBe('Your Handicap Index');
    expect(result.stats).toEqual([
      {label: 'Scores Used', value: '1 of 3'},
      {label: 'Average Differential', value: '17.0'},
      {label: 'Best Differential', value: '17.0'},
    ]);
    expect(result.breakdownRows).toEqual([
      {score: 90, rating: 72, slope: 120, differential: 17, used: true},
      {score: 95, rating: 73, slope: 125, differential: 19.9, used: false},
      {score: 100, rating: 74, slope: 130, differential: 22.6, used: false},
    ]);
    expect(result.recommendation).toContain('Good solid golf game.');
  });

  it('matches the source score count lookup', () => {
    expect(getNumberOfScoresToUse(3)).toBe(1);
    expect(getNumberOfScoresToUse(5)).toBe(1);
    expect(getNumberOfScoresToUse(8)).toBe(2);
    expect(getNumberOfScoresToUse(10)).toBe(3);
    expect(getNumberOfScoresToUse(15)).toBe(6);
    expect(getNumberOfScoresToUse(20)).toBe(8);
  });

  it('matches the source course handicap calculation', () => {
    const result = calculateGolf({
      ...baseValues,
      calculationType: 'course-handicap',
      handicapIndex: '12.4',
      courseRating: '72.5',
      slopeRating: '125',
      parScore: '72',
    });

    expect(result.headline).toBe('14');
    expect(result.headlineLabel).toBe('Your Course Handicap');
    expect(result.stats).toEqual([
      {label: 'Course Rating', value: '72.5'},
      {label: 'Slope Rating', value: '125'},
      {label: 'Par', value: '72'},
    ]);
    expect(result.targetScore).toBe('86');
    expect(result.breakdownSteps[0].calculation).toBe(
      '12.4 × 125 ÷ 113 = 13.7',
    );
    expect(result.breakdownSteps[1].calculation).toBe('+ (72.5 - 72) = +0.5');
    expect(result.breakdownSteps[2].calculation).toBe('Course Handicap = 14');
    expect(result.recommendation).toContain(
      'your target score for this course is 86',
    );
  });

  it('matches the source net score calculation', () => {
    const result = calculateGolf({
      ...baseValues,
      calculationType: 'net-score',
      grossScore: '90',
      courseHandicapInput: '12',
    });

    expect(result.headline).toBe('78');
    expect(result.headlineLabel).toBe('Your Net Score');
    expect(result.performance).toBe('Very good round');
    expect(result.stats).toEqual([
      {label: 'Gross Score', value: '90'},
      {label: 'Course Handicap', value: '-12'},
      {label: 'Net Score', value: '78'},
    ]);
    expect(result.recommendation).toContain('Your net score of 78');
  });

  it('exposes the source performance assessment bands', () => {
    expect(getPerformanceAssessment(69)).toBe('Exceptional round!');
    expect(getPerformanceAssessment(74)).toBe('Excellent performance');
    expect(getPerformanceAssessment(79)).toBe('Very good round');
    expect(getPerformanceAssessment(84)).toBe('Good scoring');
    expect(getPerformanceAssessment(89)).toBe('Solid round');
    expect(getPerformanceAssessment(95)).toBe('Room for improvement');
  });

  it('preserves the source validation messages and bounds', () => {
    expect(
      validateGolfValues({...baseValues, calculationType: ''}).calculationType,
    ).toBe(GOLF_ERRORS.calculationType);
    expect(
      validateGolfValues({...baseValues, scores: ['90', '', '']}).scores,
    ).toBe(GOLF_ERRORS.minScores);
    expect(
      validateGolfValues({
        ...baseValues,
        calculationType: 'course-handicap',
        handicapIndex: '',
      }).handicapIndex,
    ).toBe(GOLF_ERRORS.required);
    expect(
      validateGolfValues({
        ...baseValues,
        calculationType: 'net-score',
        grossScore: '',
      }).grossScore,
    ).toBe(GOLF_ERRORS.netScore);
  });
});
