import {describe, expect, it} from 'vitest';
import {
  CM_PER_FT,
  CM_PER_IN,
  feetInchesToCm,
  feetInchesToM,
  kgToLbs,
  lbsToKg,
  parseNumber,
  round,
  toCentimeters,
  toKilograms,
  toMeters,
  toPounds,
} from './units';

describe('parseNumber', () => {
  it('parses finite decimals and ignores whitespace', () => {
    expect(parseNumber(' 72.5 ')).toBe(72.5);
    expect(parseNumber('0')).toBe(0);
    expect(parseNumber('-4.2')).toBe(-4.2);
  });

  it('returns null for empty or non-numeric values', () => {
    expect(parseNumber('')).toBeNull();
    expect(parseNumber('   ')).toBeNull();
    expect(parseNumber('seventy')).toBeNull();
    expect(parseNumber('Infinity')).toBeNull();
  });
});

describe('round', () => {
  it('rounds to the requested number of decimals', () => {
    expect(round(22.865)).toBe(22.87);
    expect(round(22.865, 1)).toBe(22.9);
    expect(round(22.865, 0)).toBe(23);
  });
});

describe('weight conversions', () => {
  it('converts pounds to kilograms and back', () => {
    expect(lbsToKg(220)).toBeCloseTo(99.79024, 5);
    expect(kgToLbs(99.79024)).toBeCloseTo(220, 3);
  });

  it('uses the requested weight unit', () => {
    expect(toKilograms(220, 'lbs')).toBeCloseTo(99.79024, 5);
    expect(toKilograms(99.79024, 'kg')).toBe(99.79024);
    expect(toPounds(99.79024, 'kg')).toBeCloseTo(220, 3);
    expect(toPounds(220, 'lbs')).toBe(220);
  });
});

describe('height conversions', () => {
  it('converts feet and inches to centimetres and metres', () => {
    expect(CM_PER_FT).toBe(30.48);
    expect(CM_PER_IN).toBe(2.54);
    expect(feetInchesToCm(5, 9)).toBeCloseTo(175.26, 5);
    expect(feetInchesToM(5, 9)).toBeCloseTo(1.7526, 5);
  });

  it('uses the requested height unit', () => {
    expect(toCentimeters(175, 'cm')).toBe(175);
    expect(toCentimeters(5, 'ft', 9)).toBeCloseTo(175.26, 5);
    expect(toMeters(175, 'cm')).toBeCloseTo(1.75, 5);
    expect(toMeters(5, 'ft', 9)).toBeCloseTo(1.7526, 5);
  });
});
