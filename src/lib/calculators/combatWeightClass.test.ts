import {describe, expect, it} from 'vitest';
import {
  calculateCuttingDifficulty,
  calculateIdealWeight,
  COMBAT_ERRORS,
  findOptimalWeightClasses,
  findWeightClass,
  getWeightClassesForSport,
  optimizeWeightClass,
  validateCombatValues,
  type CombatValues,
} from './combatWeightClass';

const baseValues: CombatValues = {
  sport: 'mma',
  currentWeight: '170',
  weightUnit: 'lbs',
  height: '177.8',
  heightUnit: 'cm',
  bodyFat: '15',
  experience: '3',
  fightStyle: 'well-rounded',
  competitionLevel: 'amateur',
  age: '25',
  cutHistory: 'none',
};

describe('Combat sports weight class optimizer', () => {
  it('matches the source optimization for an MMA welterweight', () => {
    const result = optimizeWeightClass(baseValues);

    expect(result.currentWeight).toBe('170.0');
    expect(result.leanMass).toBe('144.5');
    expect(result.currentClass).toBe('Welterweight');
    expect(result.idealWeight).toBe('155.0');
    expect(result.optimalClasses).toHaveLength(1);
    expect(result.optimalClasses[0]).toEqual({
      name: 'Welterweight',
      min: 170,
      max: 170,
      weightRequired: 170,
      cutRequired: 0,
      cutPercentage: 0,
      suitability: 50,
    });
    expect(result.powerToWeightRatio).toBe('85.0');
    expect(result.reachAdvantage).toBe('-3');
    expect(result.cuttingDifficulty).toBe('Medium');
    expect(result.performanceImpact).toBe('Minimal impact');
    expect(result.healthRisk).toBe('Low');
    expect(result.recommendations).toContain(
      'Primary recommendation: Welterweight (170 lbs)',
    );
  });

  it('matches the source optimization for a BJJ heavyweight', () => {
    const result = optimizeWeightClass({
      ...baseValues,
      sport: 'bjj',
      currentWeight: '160',
      height: '172.72',
      bodyFat: '10',
      experience: '8',
      fightStyle: 'grappler',
      competitionLevel: 'professional',
      age: '30',
      cutHistory: 'intermediate',
    });

    expect(result.currentClass).toBe('Lightweight');
    expect(result.leanMass).toBe('144.0');
    expect(result.idealWeight).toBe('165.0');
    expect(result.optimalClasses[0].name).toBe('Lightweight');
    expect(result.powerToWeightRatio).toBe('99.0');
    expect(result.reachAdvantage).toBe('-6');
    expect(result.cuttingDifficulty).toBe('Medium');
    expect(result.healthRisk).toBe('Medium');
  });

  it('matches the source weight class lookup and sport mapping', () => {
    expect(getWeightClassesForSport('mma')).toHaveLength(9);
    expect(getWeightClassesForSport('boxing')).toHaveLength(16);
    expect(getWeightClassesForSport('wrestling')).toHaveLength(10);
    expect(getWeightClassesForSport('bjj')).toHaveLength(8);
    expect(getWeightClassesForSport('muay-thai')).toHaveLength(16);
    expect(getWeightClassesForSport('judo')).toHaveLength(10);
    expect(getWeightClassesForSport('karate')).toHaveLength(16);

    expect(findWeightClass(120, getWeightClassesForSport('mma'))).toBe(
      'Flyweight',
    );
    expect(findWeightClass(450, getWeightClassesForSport('mma'))).toBe(
      'Above Heavyweight',
    );
    expect(calculateIdealWeight(70, 15, 'striker', 'mma')).toBe(145);
    expect(calculateIdealWeight(70, 15, 'grappler', 'wrestling')).toBe(170);
  });

  it('matches the source cutting difficulty bands', () => {
    expect(calculateCuttingDifficulty(20, 20, 'advanced', 10)).toBe('Low');
    expect(calculateCuttingDifficulty(15, 25, 'none', 3)).toBe('Medium');
    expect(calculateCuttingDifficulty(8, 40, 'none', 1)).toBe('Very High');
    expect(
      findOptimalWeightClasses(170, 144.5, getWeightClassesForSport('mma'), 15, 'none'),
    ).toHaveLength(1);
  });

  it('preserves the source validation messages and bounds', () => {
    expect(validateCombatValues({...baseValues, sport: ''}).sport).toBe(
      COMBAT_ERRORS.sport,
    );
    expect(
      validateCombatValues({...baseValues, currentWeight: ''}).currentWeight,
    ).toBe(COMBAT_ERRORS.currentWeight);
    expect(validateCombatValues({...baseValues, height: ''}).height).toBe(
      COMBAT_ERRORS.height,
    );
    expect(validateCombatValues({...baseValues, bodyFat: ''}).bodyFat).toBe(
      COMBAT_ERRORS.bodyFat,
    );
    expect(validateCombatValues({...baseValues, experience: ''}).experience).toBe(
      COMBAT_ERRORS.experience,
    );
    expect(
      validateCombatValues({...baseValues, fightStyle: ''}).fightStyle,
    ).toBe(COMBAT_ERRORS.fightStyle);
    expect(
      validateCombatValues({...baseValues, competitionLevel: ''})
        .competitionLevel,
    ).toBe(COMBAT_ERRORS.competitionLevel);
    expect(validateCombatValues({...baseValues, age: ''}).age).toBe(
      COMBAT_ERRORS.age,
    );
    expect(
      validateCombatValues({...baseValues, cutHistory: ''}).cutHistory,
    ).toBe(COMBAT_ERRORS.cutHistory);
  });
});
