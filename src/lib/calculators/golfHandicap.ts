import {parseNumber} from './units';
import type {FieldErrors} from './validation';

export type GolfCalculationType =
  | 'handicap-index'
  | 'course-handicap'
  | 'net-score';

export type GolfScore = {
  score: number;
  rating: number;
  slope: number;
};

export type GolfValues = {
  calculationType: GolfCalculationType | '';
  numScores: string;
  scores: string[];
  ratings: string[];
  slopes: string[];
  handicapIndex: string;
  courseRating: string;
  slopeRating: string;
  parScore: string;
  grossScore: string;
  courseHandicapInput: string;
};

export type GolfScoreBreakdownRow = {
  score: number;
  rating: number;
  slope: number;
  differential: number;
  used: boolean;
};

export type GolfResult = {
  calculationType: GolfCalculationType;
  headline: string;
  headlineLabel: string;
  stats: readonly {label: string; value: string}[];
  breakdownRows: readonly GolfScoreBreakdownRow[];
  breakdownSteps: readonly {formula: string; calculation: string}[];
  targetScore: string | null;
  performance: string | null;
  recommendation: string;
};

export const GOLF_CALCULATION_TYPES: readonly {
  value: GolfCalculationType;
  label: string;
}[] = [
  {value: 'handicap-index', label: 'Calculate Handicap Index'},
  {value: 'course-handicap', label: 'Calculate Course Handicap'},
  {value: 'net-score', label: 'Calculate Net Score'},
] as const;

export const GOLF_SCORE_COUNT_OPTIONS: readonly {value: string; label: string}[] = [
  {value: '3', label: '3 Scores (Minimum)'},
  {value: '5', label: '5 Scores'},
  {value: '8', label: '8 Scores'},
  {value: '10', label: '10 Scores'},
  {value: '15', label: '15 Scores'},
  {value: '20', label: '20 Scores (Full)'},
] as const;

export const GOLF_ERRORS = {
  calculationType: 'Please select a calculation type.',
  minScores: 'Please enter at least 3 complete scores.',
  required: 'Please fill in all required fields.',
  netScore: 'Please fill in both gross score and course handicap.',
} as const;

const SCORES_TO_USE: Record<number, number> = {
  3: 1,
  4: 1,
  5: 1,
  6: 1,
  7: 2,
  8: 2,
  9: 3,
  10: 3,
  11: 4,
  12: 4,
  13: 5,
  14: 5,
  15: 6,
  16: 6,
  17: 7,
  18: 7,
  19: 8,
  20: 8,
};

export function getNumberOfScoresToUse(totalScores: number): number {
  return SCORES_TO_USE[totalScores] ?? 8;
}

export function calculateDifferential(
  score: number,
  rating: number,
  slope: number,
): number {
  const differential = ((score - rating) * 113) / slope;

  return Math.round(differential * 10) / 10;
}

export function getPerformanceAssessment(netScore: number): string {
  if (netScore < 70) return 'Exceptional round!';
  if (netScore < 75) return 'Excellent performance';
  if (netScore < 80) return 'Very good round';
  if (netScore < 85) return 'Good scoring';
  if (netScore < 90) return 'Solid round';
  return 'Room for improvement';
}

export function getHandicapRecommendation(handicapIndex: number): string {
  if (handicapIndex <= 5) {
    return 'Excellent golfer! You have a scratch or near-scratch handicap. Consider competing in tournaments and working on advanced shot-making skills.';
  }

  if (handicapIndex <= 10) {
    return 'Very strong player. Focus on consistency, course management, and mental game to reach scratch level.';
  }

  if (handicapIndex <= 20) {
    return 'Good solid golf game. Work on your short game and putting to see the biggest improvements in your handicap.';
  }

  if (handicapIndex <= 30) {
    return 'Developing player. Focus on fundamentals, take lessons, and practice your short game regularly for steady improvement.';
  }

  return 'Beginner or high-handicap player. Take lessons from a PGA professional, focus on basic fundamentals, and enjoy the learning process.';
}

export function validateGolfValues(values: GolfValues): FieldErrors<GolfValues> {
  const errors: FieldErrors<GolfValues> = {};

  if (!values.calculationType) {
    errors.calculationType = GOLF_ERRORS.calculationType;
    return errors;
  }

  if (values.calculationType === 'handicap-index') {
    const completeScores = collectCompleteScores(values);

    if (completeScores.length < 3) {
      errors.scores = GOLF_ERRORS.minScores;
    }
  }

  if (values.calculationType === 'course-handicap') {
    const handicapIndex = parseNumber(values.handicapIndex);
    const courseRating = parseNumber(values.courseRating);
    const slopeRating = parseNumber(values.slopeRating);
    const parScore = parseNumber(values.parScore);

    if (
      handicapIndex === null ||
      courseRating === null ||
      slopeRating === null ||
      parScore === null
    ) {
      errors.handicapIndex = GOLF_ERRORS.required;
    }
  }

  if (values.calculationType === 'net-score') {
    const grossScore = parseNumber(values.grossScore);
    const courseHandicap = parseNumber(values.courseHandicapInput);

    if (grossScore === null || courseHandicap === null) {
      errors.grossScore = GOLF_ERRORS.netScore;
    }
  }

  return errors;
}

function collectCompleteScores(values: GolfValues): GolfScore[] {
  const scores: GolfScore[] = [];

  for (let i = 0; i < values.scores.length; i++) {
    const score = Number.parseInt(values.scores[i] ?? '', 10);
    const rating = parseNumber(values.ratings[i] ?? '');
    const slope = Number.parseInt(values.slopes[i] ?? '', 10);

    if (
      !Number.isNaN(score) &&
      rating !== null &&
      !Number.isNaN(slope)
    ) {
      scores.push({score, rating, slope});
    }
  }

  return scores;
}

export function calculateGolf(values: GolfValues): GolfResult {
  if (!values.calculationType) {
    throw new Error(GOLF_ERRORS.calculationType);
  }

  if (values.calculationType === 'handicap-index') {
    const scores = collectCompleteScores(values);

    if (scores.length < 3) {
      throw new Error(GOLF_ERRORS.minScores);
    }

    const differentials = scores.map((round) =>
      calculateDifferential(round.score, round.rating, round.slope),
    );
    differentials.sort((a, b) => a - b);
    const numToUse = getNumberOfScoresToUse(scores.length);
    const bestDifferentials = differentials.slice(0, numToUse);
    const average =
      bestDifferentials.reduce((sum, differential) => sum + differential, 0) /
      bestDifferentials.length;
    const handicapIndex = Math.round(average * 0.96 * 10) / 10;
    const clampedIndex = Math.min(54.0, Math.max(-10.0, handicapIndex));

    return {
      calculationType: values.calculationType,
      headline: clampedIndex.toFixed(1),
      headlineLabel: 'Your Handicap Index',
      stats: [
        {label: 'Scores Used', value: `${numToUse} of ${scores.length}`},
        {label: 'Average Differential', value: average.toFixed(1)},
        {label: 'Best Differential', value: differentials[0].toFixed(1)},
      ],
      breakdownRows: scores.map((round, index) => ({
        score: round.score,
        rating: round.rating,
        slope: round.slope,
        differential: differentials[index],
        used: bestDifferentials.includes(differentials[index]),
      })),
      breakdownSteps: [],
      targetScore: null,
      performance: null,
      recommendation: getHandicapRecommendation(clampedIndex),
    };
  }

  if (values.calculationType === 'course-handicap') {
    const handicapIndex = parseNumber(values.handicapIndex);
    const courseRating = parseNumber(values.courseRating);
    const slopeRating = parseNumber(values.slopeRating);
    const parScore = parseNumber(values.parScore);

    if (
      handicapIndex === null ||
      courseRating === null ||
      slopeRating === null ||
      parScore === null
    ) {
      throw new Error(GOLF_ERRORS.required);
    }

    const courseHandicap = Math.round(
      (handicapIndex * slopeRating) / 113 + (courseRating - parScore),
    );
    const targetScore = parScore + courseHandicap;

    return {
      calculationType: values.calculationType,
      headline: `${courseHandicap}`,
      headlineLabel: 'Your Course Handicap',
      stats: [
        {label: 'Course Rating', value: `${courseRating}`},
        {label: 'Slope Rating', value: `${slopeRating}`},
        {label: 'Par', value: `${parScore}`},
      ],
      breakdownRows: [],
      breakdownSteps: [
        {
          formula: 'Step 1: (Handicap Index × Slope Rating) ÷ 113',
          calculation: `${handicapIndex} × ${slopeRating} ÷ 113 = ${(
            (handicapIndex * slopeRating) /
            113
          ).toFixed(1)}`,
        },
        {
          formula: 'Step 2: + (Course Rating - Par Score)',
          calculation: `+ (${courseRating} - ${parScore}) = +${(
            courseRating - parScore
          ).toFixed(1)}`,
        },
        {
          formula: 'Final: Round to nearest whole number',
          calculation: `Course Handicap = ${courseHandicap}`,
        },
      ],
      targetScore: `${targetScore}`,
      performance: null,
      recommendation: `With a course handicap of ${courseHandicap}, your target score for this course is ${targetScore} (${parScore} par + ${courseHandicap} strokes). Use this as your goal for a "net par" round.`,
    };
  }

  const grossScore = parseNumber(values.grossScore);
  const courseHandicap = parseNumber(values.courseHandicapInput);

  if (grossScore === null || courseHandicap === null) {
    throw new Error(GOLF_ERRORS.netScore);
  }

  const netScore = grossScore - courseHandicap;
  const performance = getPerformanceAssessment(netScore);

  return {
    calculationType: values.calculationType,
    headline: `${netScore}`,
    headlineLabel: 'Your Net Score',
    stats: [
      {label: 'Gross Score', value: `${grossScore}`},
      {label: 'Course Handicap', value: `-${courseHandicap}`},
      {label: 'Net Score', value: `${netScore}`},
    ],
    breakdownRows: [],
    breakdownSteps: [
      {
        formula: 'Net Score = Gross Score - Course Handicap',
        calculation: `${netScore} = ${grossScore} - ${courseHandicap}`,
      },
      {
        formula: 'Performance Assessment',
        calculation: performance,
      },
    ],
    targetScore: null,
    performance,
    recommendation: `Your net score of ${netScore} ${performance.toLowerCase()}. Track your net scores over time to monitor improvement, as they account for course difficulty and handicap differences.`,
  };
}
