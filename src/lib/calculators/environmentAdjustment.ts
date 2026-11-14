/**
 * Helpers shared by the environmental-adjustment tools (heat acclimatization,
 * altitude adjustment) and the race strategy planner.
 *
 * The plan for this batch says to "extract shared helpers only if the math
 * truly matches". Only the genuinely identical pieces live here:
 *
 * - Fahrenheit to Celsius conversion (heat, race strategy).
 * - Feet to metres conversion (altitude).
 * - Acclimatisation progress against the 14-day full-adaptation window
 *   (heat, altitude) and the whole-week recovery protection both apply.
 *
 * Everything else (heat index, WBGT, VO2 max decrease, training zones) stays
 * in its own module because the maths genuinely differs.
 */

export const FULL_ACCLIMATIZATION_DAYS = 14;

export const DAYS_PER_ACCLIMATIZATION_WEEK = 7;

export function fahrenheitToCelsius(fahrenheit: number): number {
  return (fahrenheit - 32) * (5 / 9);
}

export function feetToMeters(feet: number): number {
  return feet * 0.3048;
}

export function poundsToKilograms(pounds: number): number {
  return pounds / 2.20462;
}

/**
 * Percentage of the 14-day full-adaptation window completed, matching the
 * progress bars on both the heat and altitude source pages.
 */
export function acclimatizationProgressPercent(days: number): number {
  return Math.min(100, Math.round((days / FULL_ACCLIMATIZATION_DAYS) * 100));
}

/**
 * Whole weeks of acclimatisation, used as recovery protection in both the heat
 * and altitude risk assessments.
 */
export function acclimatizationWeeks(days: number): number {
  return Math.floor(days / DAYS_PER_ACCLIMATIZATION_WEEK);
}
