import {describe, expect, it} from 'vitest';
import {
  calculateWeightCut,
  validateWeightCutValues,
  type WeightCutValues,
} from './weightCutGain';

const baseValues: WeightCutValues = {
  gender: 'male',
  age: '28',
  currentWeight: '80',
  height: '180',
  bodyFat: '18',
  activityLevel: 'moderate',
  goalType: 'weight-loss',
  targetWeight: '74',
  targetDate: '2027-06-01',
  priority: 'moderate',
  sportType: 'powerlifting',
  competitionSchedule: 'none',
  weightClassRequirement: 'none',
  strengthPriority: 'important',
  medicalConditions: 'none',
  medications: 'none',
  previousWeightChanges: 'experienced',
  supportSystem: 'coach',
};

describe('Weight Cut / Gain Planner', () => {
  it('builds a moderate fat-loss plan with weekly targets and a timeline', () => {
    const result = calculateWeightCut(baseValues);

    expect(result.direction).toBe('loss');
    expect(result.weeklyChangeKg).toBe(-0.6);
    expect(result.weeklyChangeDisplay).toBe('-0.6 kg per week');
    expect(result.dailyCalorieAdjustment).toBe(-660);
    expect(result.dailyCalorieAdjustmentDisplay).toBe('-660 cal per day');
    expect(result.timelineWeeks).toBe(10);
    expect(result.timelineDisplay).toBe('10 weeks');
    expect(result.tdee).toBe(2775);
    expect(result.targetCalories).toBe(2775 - 660);
    expect(result.targetProtein).toBe(176);
  });

  it('keeps the aggressive and conservative rates inside the sustainable band', () => {
    const aggressive = calculateWeightCut({
      ...baseValues,
      priority: 'aggressive',
    });
    const conservative = calculateWeightCut({
      ...baseValues,
      priority: 'conservative',
    });

    expect(aggressive.weeklyChangeKg).toBe(-0.8);
    expect(conservative.weeklyChangeKg).toBe(-0.4);
  });

  it('builds a lean-gain plan with a surplus and a protein target', () => {
    const result = calculateWeightCut({
      ...baseValues,
      goalType: 'weight-gain',
      targetWeight: '86',
      priority: 'conservative',
    });

    expect(result.direction).toBe('gain');
    expect(result.weeklyChangeKg).toBe(0.2);
    expect(result.dailyCalorieAdjustmentDisplay).toBe('+220 cal per day');
    expect(result.targetProtein).toBe(144);
    expect(result.targetCalories).toBe(2775 + 220);
  });

  it('keeps maintenance and recomposition at zero weekly scale change', () => {
    const maintenance = calculateWeightCut({
      ...baseValues,
      goalType: 'weight-maintenance',
    });
    const recomp = calculateWeightCut({
      ...baseValues,
      goalType: 'body-recomp',
    });

    expect(maintenance.direction).toBe('maintain');
    expect(maintenance.weeklyChangeDisplay).toBe('0 kg per week');
    expect(maintenance.dailyCalorieAdjustmentDisplay).toBe(
      'No calorie adjustment',
    );
    expect(recomp.direction).toBe('recomp');
    expect(recomp.weeklyChangeDisplay).toBe('0 kg per week');
  });

  it('scores success from priority, history, support, and medical factors', () => {
    const strong = calculateWeightCut(baseValues);
    const weak = calculateWeightCut({
      ...baseValues,
      priority: 'aggressive',
      previousWeightChanges: 'yoyodieting',
      supportSystem: 'none',
      medicalConditions: 'diabetes',
      medications: 'metabolism',
    });

    expect(strong.successRate).toBeGreaterThan(weak.successRate);
    expect(weak.successRate).toBeLessThanOrEqual(97);
    expect(weak.risk.level).toBe('Very High');
    expect(weak.risk.factors.length).toBeGreaterThan(3);
  });

  it('flags a target date that cannot be reached at the planned rate', () => {
    const result = calculateWeightCut({
      ...baseValues,
      targetWeight: '60',
      targetDate: '2026-12-01',
    });

    expect(
      result.risk.factors.some((factor) => factor.includes('not achievable')),
    ).toBe(true);
  });

  it('builds the phase plan, nutrition, training, and monitoring sections', () => {
    const result = calculateWeightCut(baseValues);

    expect(result.phases.map((phase) => phase.name)).toEqual([
      'Phase 1 - Adaptation',
      'Phase 2 - Steady Progress',
      'Phase 3 - Consolidation',
    ]);
    expect(result.nutrition[0]?.title).toBe('Protein Target');
    expect(result.training.length).toBeGreaterThan(0);
    expect(result.monitoring[0]?.title).toBe('Weigh Daily, Judge Weekly');
    expect(result.approach).toContain('fat-loss plan');
  });

  it('preserves the source validation bounds', () => {
    expect(validateWeightCutValues({...baseValues, age: '15'}).age).toBe(
      'Please enter an age between 16 and 80.',
    );
    expect(
      validateWeightCutValues({...baseValues, currentWeight: '350'})
        .currentWeight,
    ).toBe('Please enter a current weight between 40 and 300 kg.');
    expect(
      validateWeightCutValues({...baseValues, height: '80'}).height,
    ).toBe('Please enter a height between 100 and 250 cm.');
    expect(
      validateWeightCutValues({...baseValues, goalType: ''}).goalType,
    ).toBe('Please select your goal type.');
    expect(
      validateWeightCutValues({...baseValues, targetDate: ''}).targetDate,
    ).toBe('Please enter a target date.');
  });
});
