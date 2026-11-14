import {describe, expect, it} from 'vitest';
import {
  NUTRITION_ACTIVITY_FACTORS,
  harrisBenedictBmr,
  macroTdeeHeightCm,
  mifflinStJeorBmr,
} from './nutritionMetrics';

describe('nutrition metrics', () => {
  it('matches the source Mifflin-St Jeor equations', () => {
    expect(mifflinStJeorBmr('male', 80, 180, 30)).toBe(1780);
    expect(mifflinStJeorBmr('female', 80, 180, 30)).toBe(1614);
  });

  it('matches the source Harris-Benedict equation used by the macro tool', () => {
    expect(harrisBenedictBmr('male', 80, 180, 30)).toBeCloseTo(1853.632, 10);
    expect(harrisBenedictBmr('female', 80, 180, 30)).toBeCloseTo(1615.093, 10);
  });

  it('exposes the shared activity factors', () => {
    expect(NUTRITION_ACTIVITY_FACTORS).toEqual({
      sedentary: 1.2,
      light: 1.375,
      moderate: 1.55,
      active: 1.725,
      'very-active': 1.9,
    });
  });

  it('preserves the macro calculator feet/inches conversion quirk', () => {
    expect(macroTdeeHeightCm(180, 'cm')).toBe(180);
    expect(macroTdeeHeightCm(5, 'ft', 11)).toBeCloseTo(175.26, 10);
    expect(macroTdeeHeightCm(5, 'ft', 0)).toBeCloseTo(152.4, 10);
  });
});
