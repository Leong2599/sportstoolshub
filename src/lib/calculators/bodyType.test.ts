import {describe, expect, it} from 'vitest';
import {
  BODY_TYPE_QUIZ_ERROR,
  INITIAL_BODY_TYPE_VALUES,
  calculateBodyTypeQuiz,
  getBodyTypeResult,
  scoreBodyType,
  validateBodyTypeQuizValues,
  type BodyTypeQuizValues,
} from './bodyType';

const allEctomorph: BodyTypeQuizValues = {
  q1: 'ectomorph',
  q2: 'ectomorph',
  q3: 'ectomorph',
  q4: 'ectomorph',
  q5: 'ectomorph',
};

const allMesomorph: BodyTypeQuizValues = {
  q1: 'mesomorph',
  q2: 'mesomorph',
  q3: 'mesomorph',
  q4: 'mesomorph',
  q5: 'mesomorph',
};

const allEndomorph: BodyTypeQuizValues = {
  q1: 'endomorph',
  q2: 'endomorph',
  q3: 'endomorph',
  q4: 'endomorph',
  q5: 'endomorph',
};

describe('body type quiz', () => {
  it('requires all five source questions', () => {
    const errors = validateBodyTypeQuizValues(INITIAL_BODY_TYPE_VALUES);

    expect(Object.keys(errors)).toEqual(['q1', 'q2', 'q3', 'q4', 'q5']);
    expect(Object.values(errors)).toEqual([
      BODY_TYPE_QUIZ_ERROR,
      BODY_TYPE_QUIZ_ERROR,
      BODY_TYPE_QUIZ_ERROR,
      BODY_TYPE_QUIZ_ERROR,
      BODY_TYPE_QUIZ_ERROR,
    ]);
  });

  it('scores each dominant source archetype', () => {
    expect(scoreBodyType(allEctomorph)).toBe('ectomorph');
    expect(scoreBodyType(allMesomorph)).toBe('mesomorph');
    expect(scoreBodyType(allEndomorph)).toBe('endomorph');
  });

  it('uses the source tie rules, including a later dominant answer', () => {
    expect(
      scoreBodyType({
        q1: 'ectomorph',
        q2: 'mesomorph',
        q3: 'ectomorph',
        q4: 'mesomorph',
        q5: 'endomorph',
      }),
    ).toBe('blend');

    expect(
      scoreBodyType({
        q1: 'ectomorph',
        q2: 'mesomorph',
        q3: 'endomorph',
        q4: 'endomorph',
        q5: 'endomorph',
      }),
    ).toBe('endomorph');
  });

  it('matches the source result copy and recommendations', () => {
    const ectomorph = calculateBodyTypeQuiz(allEctomorph);
    const mesomorph = calculateBodyTypeQuiz(allMesomorph);
    const endomorph = calculateBodyTypeQuiz(allEndomorph);
    const blend = calculateBodyTypeQuiz({
      q1: 'ectomorph',
      q2: 'mesomorph',
      q3: 'ectomorph',
      q4: 'mesomorph',
      q5: 'endomorph',
    });

    expect(ectomorph.title).toBe('Ectomorph');
    expect(ectomorph.description).toBe(
      'Naturally lean and often struggles to gain weight or muscle.',
    );
    expect(ectomorph.recommendations[0].label).toBe('Training');
    expect(ectomorph.recommendations[0].text).toContain(
      'heavy weights and lower reps (6-10)',
    );

    expect(mesomorph.title).toBe('Mesomorph');
    expect(mesomorph.recommendations[0].text).toContain(
      'balanced approach of strength training and moderate cardio',
    );

    expect(endomorph.title).toBe('Endomorph');
    expect(endomorph.recommendations[1].text).toContain(
      'controlled carbohydrate intake',
    );

    expect(blend.title).toBe('Mixed Body Type');
    expect(blend.description).toBe(
      'You exhibit characteristics of multiple body types. Your approach should be a blend.',
    );
    expect(blend.recommendations).toHaveLength(2);
  });

  it('keeps the undetermined source fallback available', () => {
    const result = getBodyTypeResult('undetermined');

    expect(result.title).toBe('Undetermined');
    expect(result.recommendations[0].text).toBe(
      'Please answer all questions to receive a personalized recommendation.',
    );
  });

  it('rejects incomplete quizzes instead of guessing', () => {
    expect(() =>
      calculateBodyTypeQuiz({...INITIAL_BODY_TYPE_VALUES, q3: 'ectomorph'}),
    ).toThrow(BODY_TYPE_QUIZ_ERROR);
  });
});
