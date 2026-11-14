export const KG_PER_LB = 0.453592;
export const LB_PER_KG = 2.20462;
export const CM_PER_IN = 2.54;
export const CM_PER_FT = 30.48;
export const M_PER_IN = 0.0254;
export const M_PER_FT = 0.3048;
export const M_PER_KM = 1000;
export const M_PER_MILE = 1609.34;
export const M_PER_YARD = 0.9144;
export const KM_PER_MILE = 1.60934;
export const FT_PER_MILE = 5280;
export const YARDS_PER_MILE = 1760;
export const SECONDS_PER_HOUR = 3600;
export const SECONDS_PER_MINUTE = 60;
export const MINUTES_PER_HOUR = 60;

export const WEIGHT_UNITS = [
  {value: 'kg', label: 'kg'},
  {value: 'lbs', label: 'lbs'},
] as const;

export const HEIGHT_UNITS = [
  {value: 'cm', label: 'cm'},
  {value: 'ft', label: 'ft'},
] as const;

export type WeightUnit = (typeof WEIGHT_UNITS)[number]['value'];
export type HeightUnit = (typeof HEIGHT_UNITS)[number]['value'];

export function parseNumber(value: string): number | null {
  const trimmed = value.trim();
  if (!trimmed) {
    return null;
  }
  const parsed = Number(trimmed);
  return Number.isFinite(parsed) ? parsed : null;
}

export function round(value: number, decimals = 2): number {
  const factor = 10 ** decimals;
  return Math.round((value + Number.EPSILON) * factor) / factor;
}

export function lbsToKg(lbs: number): number {
  return lbs * KG_PER_LB;
}

export function kgToLbs(kg: number): number {
  return kg * LB_PER_KG;
}

export function cmToM(cm: number): number {
  return cm / 100;
}

export function mToCm(m: number): number {
  return m * 100;
}

export function feetInchesToCm(feet: number, inches = 0): number {
  return feet * CM_PER_FT + inches * CM_PER_IN;
}

export function feetInchesToM(feet: number, inches = 0): number {
  return (feet * 12 + inches) * M_PER_IN;
}

export function cmToFeetInches(cm: number): {feet: number; inches: number} {
  const totalInches = cm / CM_PER_IN;
  const feet = Math.floor(totalInches / 12);
  return {feet, inches: totalInches - feet * 12};
}

export function toKilograms(value: number, unit: WeightUnit): number {
  return unit === 'lbs' ? lbsToKg(value) : value;
}

export function toPounds(value: number, unit: WeightUnit): number {
  return unit === 'kg' ? kgToLbs(value) : value;
}

export function toCentimeters(
  value: number,
  unit: HeightUnit,
  inches = 0,
): number {
  return unit === 'ft' ? feetInchesToCm(value, inches) : value;
}

export function toMeters(
  value: number,
  unit: HeightUnit,
  inches = 0,
): number {
  return unit === 'ft' ? feetInchesToM(value, inches) : cmToM(value);
}

/**
 * Distance conversions shared by the pace, running calorie, and race
 * prediction tools. The legacy source pages convert to meters for pace work
 * and to kilometers for calorie work, so both targets are provided.
 */
export type DistanceUnit = 'km' | 'miles' | 'meters' | 'yards';

export const DISTANCE_UNITS: readonly {value: DistanceUnit; label: string}[] = [
  {value: 'km', label: 'kilometers'},
  {value: 'miles', label: 'miles'},
  {value: 'meters', label: 'meters'},
  {value: 'yards', label: 'yards'},
] as const;

export function distanceToMeters(
  value: number,
  unit: DistanceUnit,
): number {
  switch (unit) {
    case 'km':
      return value * M_PER_KM;
    case 'miles':
      return value * M_PER_MILE;
    case 'yards':
      return value * M_PER_YARD;
    default:
      return value;
  }
}

export function distanceToKm(
  value: number,
  unit: DistanceUnit,
): number {
  switch (unit) {
    case 'km':
      return value;
    case 'miles':
      return value * KM_PER_MILE;
    case 'meters':
      return value / M_PER_KM;
    case 'yards':
      return value * (M_PER_YARD / M_PER_KM);
    default:
      return value;
  }
}

export function metersToKm(meters: number): number {
  return meters / M_PER_KM;
}

export function metersToMiles(meters: number): number {
  return meters / M_PER_MILE;
}

export function kmToMiles(km: number): number {
  return km / KM_PER_MILE;
}

/**
 * The legacy sources convert a min/mile pace to a min/km pace with the fixed
 * factor 0.621371 rather than the exact 1 / 1.60934. The factor is preserved
 * so ported results stay bit-for-bit identical to the source pages.
 */
export const PACE_MILE_TO_KM_FACTOR = 0.621371;

export function paceSecondsPerKm(
  paceSeconds: number,
  unit: 'min-per-km' | 'min-per-mile',
): number {
  return unit === 'min-per-km'
    ? paceSeconds
    : paceSeconds * PACE_MILE_TO_KM_FACTOR;
}
