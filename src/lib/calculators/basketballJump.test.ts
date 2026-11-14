import {describe, expect, it} from 'vitest';
import {
  calculateBasketballJump,
  calculateForceGeneration,
  calculatePowerOutput,
  getJumpRating,
  JUMP_ERRORS,
  validateBasketballJumpValues,
  type BasketballJumpValues,
} from './basketballJump';

const baseValues: BasketballJumpValues = {
  jumpHeight: '24',
  jumpUnit: 'inches',
  bodyWeight: '180',
  weightUnit: 'lbs',
  approachDistance: '10',
  distanceUnit: 'feet',
  age: '25',
  gender: 'male',
};

describe('Basketball vertical jump analyzer', () => {
  it('matches the source metrics for a 24 inch jump', () => {
    const result = calculateBasketballJump(baseValues);

    expect(result.jumpHeightInches).toBeCloseTo(24, 10);
    expect(result.jumpHeightDisplay).toBe('24.0');
    expect(result.powerOutputDisplay).toBe('1385');
    expect(result.forceGenerationDisplay).toBe('2683');
    expect(result.percentile).toBe(56);
    expect(result.approachBonus).toBeCloseTo(15, 10);
    expect(result.rating).toBe('Average');
    expect(result.recommendations).toEqual([
      'Focus on plyometric training 2-3 times per week',
      'Include squats and deadlifts in strength training',
      'Increase lower body strength training',
    ]);
  });

  it('matches the source metrics for a 30 inch jump by a female athlete', () => {
    const result = calculateBasketballJump({
      ...baseValues,
      jumpHeight: '30',
      bodyWeight: '200',
      age: '30',
      gender: 'female',
    });

    expect(result.powerOutputDisplay).toBe('1721');
    expect(result.forceGenerationDisplay).toBe('3228');
    expect(result.percentile).toBe(99);
    expect(result.rating).toBe('Very Good');
  });

  it('converts centimeters and kilograms the source way', () => {
    const result = calculateBasketballJump({
      ...baseValues,
      jumpHeight: '60',
      jumpUnit: 'cm',
      bodyWeight: '80',
      weightUnit: 'kg',
    });

    expect(result.jumpHeightInches).toBeCloseTo(23.62204724409449, 10);
    expect(result.jumpHeightDisplay).toBe('23.6');
  });

  it('exposes the source power and force formulas', () => {
    expect(calculatePowerOutput(24, 180 / 2.20462)).toBeCloseTo(
      1384.999939895766,
      6,
    );
    expect(calculateForceGeneration(24, 180 / 2.20462)).toBeCloseTo(
      2683.3871693975457,
      6,
    );
    expect(getJumpRating(40)).toBe('Elite');
    expect(getJumpRating(35)).toBe('Excellent');
    expect(getJumpRating(30)).toBe('Very Good');
    expect(getJumpRating(25)).toBe('Good');
    expect(getJumpRating(20)).toBe('Average');
    expect(getJumpRating(19.9)).toBe('Below Average');
  });

  it('preserves the source validation messages and bounds', () => {
    expect(
      validateBasketballJumpValues({...baseValues, jumpHeight: ''}).jumpHeight,
    ).toBe(JUMP_ERRORS.jumpHeight);
    expect(
      validateBasketballJumpValues({...baseValues, jumpHeight: '61'}).jumpHeight,
    ).toBe('Please enter vertical jump height between 0 and 60.');
    expect(
      validateBasketballJumpValues({...baseValues, bodyWeight: ''}).bodyWeight,
    ).toBe(JUMP_ERRORS.bodyWeight);
    expect(
      validateBasketballJumpValues({...baseValues, bodyWeight: '401'}).bodyWeight,
    ).toBe('Please enter body weight between 50 and 400.');
    expect(
      validateBasketballJumpValues({
        ...baseValues,
        approachDistance: '',
      }).approachDistance,
    ).toBe(JUMP_ERRORS.approachDistance);
    expect(
      validateBasketballJumpValues({...baseValues, age: ''}).age,
    ).toBe(JUMP_ERRORS.age);
    expect(
      validateBasketballJumpValues({...baseValues, age: '51'}).age,
    ).toBe('Please enter age between 10 and 50.');
    expect(
      validateBasketballJumpValues({...baseValues, gender: ''}).gender,
    ).toBe(JUMP_ERRORS.gender);
  });
});
