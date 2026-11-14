import {describe, expect, it} from 'vitest';
import {
  calculateHistoryRisk,
  calculateInjuryRisk,
  calculateLifestyleRisk,
  calculatePersonalRisk,
  calculatePhysicalRisk,
  calculateTrainingRisk,
  getRiskCategory,
  getRiskColor,
  INJURY_ERRORS,
  validateInjuryValues,
  type InjuryValues,
} from './injuryRisk';

const baseValues: InjuryValues = {
  age: '30',
  gender: 'male',
  sport: 'running',
  experience: 'intermediate',
  weeklySessions: '3',
  sessionDuration: '60',
  intensity: 'moderate',
  warmUp: 'moderate',
  coolDown: 'moderate',
  flexibility: 'average',
  strength: 'average',
  balance: 'average',
  bodyWeight: 'normal',
  previousInjuries: 'none',
  injuryType: 'none',
  recoveryTime: 'none',
  currentPain: 'none',
  sleep: '8',
  stress: 'low',
  nutrition: 'good',
  hydration: 'good',
};

describe('Injury risk calculator', () => {
  it('matches the source category risk scores for a healthy runner', () => {
    expect(calculatePersonalRisk(baseValues)).toBe(10);
    expect(calculateTrainingRisk(baseValues)).toBe(20);
    expect(calculatePhysicalRisk(baseValues)).toBe(25);
    expect(calculateHistoryRisk(baseValues)).toBe(0);
    expect(calculateLifestyleRisk(baseValues)).toBe(20);

    const result = calculateInjuryRisk(baseValues);

    expect(result.scores).toEqual({
      personal: 10,
      training: 20,
      physical: 25,
      history: 0,
      lifestyle: 20,
    });
    expect(result.overallRisk).toBe(15);
    expect(result.category).toBe('Very Low Risk');
    expect(result.color).toBe('#10b981');
    expect(result.recommendations).toContain(
      'your overall injury risk is 15%',
    );
    expect(result.recommendations).toContain(
      'Continue with good injury prevention practices',
    );
  });

  it('matches the source weighted overall risk for a high-risk profile', () => {
    const result = calculateInjuryRisk({
      ...baseValues,
      age: '15',
      gender: 'female',
      experience: 'beginner',
      weeklySessions: '6',
      sessionDuration: '90',
      intensity: 'very-high',
      warmUp: 'none',
      coolDown: 'none',
      flexibility: 'poor',
      strength: 'poor',
      balance: 'poor',
      bodyWeight: 'obese',
      previousInjuries: '4+',
      recoveryTime: '3+months',
      currentPain: 'severe',
      sleep: '5',
      stress: 'very-high',
      nutrition: 'poor',
      hydration: 'poor',
    });

    expect(result.scores).toEqual({
      personal: 40,
      training: 75,
      physical: 90,
      history: 100,
      lifestyle: 95,
    });
    expect(result.overallRisk).toBe(82);
    expect(result.category).toBe('Very High Risk');
    expect(result.color).toBe('#991b1b');
    expect(result.recommendations).toContain(
      'Your highest risk areas are: training, physical, history, lifestyle.',
    );
    expect(result.recommendations).toContain(
      'Strongly recommend immediate consultation with a sports medicine professional.',
    );
  });

  it('exposes the source risk category and color bands', () => {
    expect(getRiskCategory(0)).toBe('Very Low Risk');
    expect(getRiskCategory(19)).toBe('Very Low Risk');
    expect(getRiskCategory(20)).toBe('Low Risk');
    expect(getRiskCategory(34)).toBe('Low Risk');
    expect(getRiskCategory(35)).toBe('Moderate Risk');
    expect(getRiskCategory(49)).toBe('Moderate Risk');
    expect(getRiskCategory(50)).toBe('High Risk');
    expect(getRiskCategory(69)).toBe('High Risk');
    expect(getRiskCategory(70)).toBe('Very High Risk');

    expect(getRiskColor(10)).toBe('#10b981');
    expect(getRiskColor(25)).toBe('#3b82f6');
    expect(getRiskColor(40)).toBe('#f59e0b');
    expect(getRiskColor(60)).toBe('#ef4444');
    expect(getRiskColor(80)).toBe('#991b1b');
  });

  it('preserves the source validation messages and bounds', () => {
    expect(validateInjuryValues({...baseValues, gender: ''}).gender).toBe(
      INJURY_ERRORS.required,
    );
    expect(validateInjuryValues({...baseValues, sport: ''}).sport).toBe(
      INJURY_ERRORS.required,
    );
    expect(validateInjuryValues({...baseValues, age: '12'}).age).toBe(
      INJURY_ERRORS.age,
    );
    expect(
      validateInjuryValues({...baseValues, weeklySessions: '25'})
        .weeklySessions,
    ).toBe(INJURY_ERRORS.sessions);
    expect(
      validateInjuryValues({...baseValues, sessionDuration: '5'})
        .sessionDuration,
    ).toBe(INJURY_ERRORS.duration);
    expect(validateInjuryValues({...baseValues, sleep: '2'}).sleep).toBe(
      INJURY_ERRORS.sleep,
    );
  });
});
