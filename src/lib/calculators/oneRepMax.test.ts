import {describe, expect, it} from 'vitest';
import {
  calculateOneRepMaxResult,
  ONE_REP_MAX_FORMULAS,
  validateOneRepMaxValues,
  type OneRepMaxFormula,
  type OneRepMaxValues,
} from './oneRepMax';

const baseValues: OneRepMaxValues = {
  weight: '100',
  weightUnit: 'kg',
  reps: '10',
  formula: 'epley',
};

const EXPECTED_FORMULAS: Record<OneRepMaxFormula, string> = {
  epley: '133.3',
  brzycki: '133.4',
  lander: '134.1',
  lombardi: '125.9',
  mcglothin: '134.1',
  okane: '125.0',
  wathan: '134.7',
};

describe('One rep max calculator', () => {
  it('matches the source Epley example and rep max table', () => {
    const result = calculateOneRepMaxResult(baseValues);

    expect(result.oneRepMax).toBeCloseTo(133.33333333333334, 10);
    expect(result.display).toBe('133.3');
    expect(result.unit).toBe('kg');
    expect(result.formula).toBe('epley');
    expect(result.repMaxTable).toHaveLength(12);
    expect(result.repMaxTable[0]).toEqual({
      reps: 1,
      percentage: 100,
      estimatedWeight: '133.3',
    });
    expect(result.repMaxTable[1].estimatedWeight).toBe('124.4');
    expect(result.repMaxTable[1].percentage).toBeCloseTo(93.3033, 4);
  });

  it('matches all source formula outputs for 100 kg and 10 reps', () => {
    for (const formula of Object.keys(
      EXPECTED_FORMULAS,
    ) as OneRepMaxFormula[]) {
      const result = calculateOneRepMaxResult({...baseValues, formula});

      expect(result.display).toBe(EXPECTED_FORMULAS[formula]);
    }
  });

  it('preserves the entered weight unit without conversion', () => {
    const result = calculateOneRepMaxResult({
      ...baseValues,
      weightUnit: 'lbs',
      formula: 'epley',
    });

    expect(result.display).toBe('133.3');
    expect(result.unit).toBe('lbs');
  });

  it('preserves the source validation message and bounds', () => {
    expect(ONE_REP_MAX_FORMULAS.map((option) => option.value)).toEqual([
      'epley',
      'brzycki',
      'lander',
      'lombardi',
      'mcglothin',
      'okane',
      'wathan',
    ]);

    expect(
      validateOneRepMaxValues({...baseValues, weight: ''}).weight,
    ).toBe('Please enter valid weight (greater than 0) and repetitions (1-15).');
    expect(
      validateOneRepMaxValues({...baseValues, weight: '0'}).weight,
    ).toBe('Please enter valid weight (greater than 0) and repetitions (1-15).');
    expect(
      validateOneRepMaxValues({...baseValues, reps: ''}).reps,
    ).toBe('Please enter valid weight (greater than 0) and repetitions (1-15).');
    expect(
      validateOneRepMaxValues({...baseValues, reps: '16'}).reps,
    ).toBe('Please enter valid weight (greater than 0) and repetitions (1-15).');
    expect(
      validateOneRepMaxValues({...baseValues, reps: '0'}).reps,
    ).toBe('Please enter valid weight (greater than 0) and repetitions (1-15).');
    expect(
      validateOneRepMaxValues({...baseValues, reps: '2.5'}).reps,
    ).toBe('Please enter valid weight (greater than 0) and repetitions (1-15).');
    expect(validateOneRepMaxValues(baseValues).formula).toBeUndefined();
  });
});
