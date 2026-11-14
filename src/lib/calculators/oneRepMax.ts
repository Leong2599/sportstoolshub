import {parseNumber, type WeightUnit} from './units';
import type {FieldErrors} from './validation';

export type OneRepMaxFormula =
  | 'epley'
  | 'brzycki'
  | 'lander'
  | 'lombardi'
  | 'mcglothin'
  | 'okane'
  | 'wathan';

export type OneRepMaxValues = {
  weight: string;
  weightUnit: WeightUnit;
  reps: string;
  formula: OneRepMaxFormula;
};

export type RepMaxRow = {
  reps: number;
  percentage: number;
  estimatedWeight: string;
};

export type OneRepMaxResult = {
  oneRepMax: number;
  display: string;
  unit: WeightUnit;
  formula: OneRepMaxFormula;
  repMaxTable: readonly RepMaxRow[];
};

export const ONE_REP_MAX_FORMULAS: readonly {value: OneRepMaxFormula; label: string}[] = [
  {value: 'epley', label: 'Epley (Most Popular)'},
  {value: 'brzycki', label: 'Brzycki'},
  {value: 'lander', label: 'Lander'},
  {value: 'lombardi', label: 'Lombardi'},
  {value: 'mcglothin', label: 'McGlothin'},
  {value: 'okane', label: "O'Conner/O'Kane"},
  {value: 'wathan', label: 'Wathan'},
] as const;

const ONE_REP_MAX_ERROR =
  'Please enter valid weight (greater than 0) and repetitions (1-15).';

export function validateOneRepMaxValues(
  values: OneRepMaxValues,
): FieldErrors<OneRepMaxValues> {
  const errors: FieldErrors<OneRepMaxValues> = {};
  const weight = parseNumber(values.weight);
  const reps = parseNumber(values.reps);

  if (weight === null || weight <= 0) {
    errors.weight = ONE_REP_MAX_ERROR;
  }

  if (
    reps === null ||
    !Number.isInteger(reps) ||
    reps < 1 ||
    reps > 15
  ) {
    errors.reps = ONE_REP_MAX_ERROR;
  }

  return errors;
}

function calculateOneRepMax(
  weight: number,
  reps: number,
  formula: OneRepMaxFormula,
): number {
  switch (formula) {
    case 'epley':
      return weight * (1 + reps / 30);
    case 'brzycki':
      return weight / (1.0278 - 0.0278 * reps);
    case 'lander':
      return (100 * weight) / (101.3 - 2.671 * reps);
    case 'lombardi':
      return weight * Math.pow(reps, 0.10);
    case 'mcglothin':
      return (100 * weight) / (101.3 - 2.671 * reps);
    case 'okane':
      return weight * (1 + 0.025 * reps);
    case 'wathan':
      return (100 * weight) / (48.8 + 53.8 * Math.exp(-0.075 * reps));
    default:
      return 0;
  }
}

export function calculateOneRepMaxResult(
  values: OneRepMaxValues,
): OneRepMaxResult {
  const weight = parseNumber(values.weight);
  const reps = parseNumber(values.reps);

  if (
    weight === null ||
    reps === null ||
    weight <= 0 ||
    reps < 1 ||
    reps > 15
  ) {
    throw new Error(ONE_REP_MAX_ERROR);
  }

  const oneRepMax = calculateOneRepMax(weight, reps, values.formula);
  const repMaxTable: RepMaxRow[] = [];

  for (let i = 1; i <= 12; i++) {
    const percentage = 100 * Math.pow(i, -0.10);
    const estimatedWeight = (oneRepMax * (percentage / 100)).toFixed(1);

    repMaxTable.push({
      reps: i,
      percentage,
      estimatedWeight,
    });
  }

  return {
    oneRepMax,
    display: oneRepMax.toFixed(1),
    unit: values.weightUnit,
    formula: values.formula,
    repMaxTable,
  };
}
