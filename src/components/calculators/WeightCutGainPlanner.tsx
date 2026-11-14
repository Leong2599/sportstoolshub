import {useId, type ReactNode} from 'react';
import clsx from 'clsx';
import {
  calculateWeightCut,
  validateWeightCutValues,
  WEIGHT_CUT_COMPETITION_SCHEDULES,
  WEIGHT_CUT_GOALS,
  WEIGHT_CUT_HISTORY,
  WEIGHT_CUT_MEDICAL,
  WEIGHT_CUT_MEDICATIONS,
  WEIGHT_CUT_PRIORITIES,
  WEIGHT_CUT_SPORTS,
  WEIGHT_CUT_STRENGTH_PRIORITIES,
  WEIGHT_CUT_SUPPORT,
  WEIGHT_CUT_WEIGHT_CLASSES,
  type WeightCutCompetitionSchedule,
  type WeightCutGender,
  type WeightCutGoal,
  type WeightCutHistory,
  type WeightCutMedical,
  type WeightCutMedication,
  type WeightCutPriority,
  type WeightCutResult,
  type WeightCutSport,
  type WeightCutStrengthPriority,
  type WeightCutSupport,
  type WeightCutValues,
  type WeightCutWeightClass,
} from '../../lib/calculators/weightCutGain';
import type {NutritionActivityLevel} from '../../lib/calculators/nutritionMetrics';
import type {ShareEnvironment} from '../../lib/calculators/share';
import {
  ChoiceField,
  DateField,
  NumberField,
  ResultCard,
  SelectField,
  useCalculator,
  type ChoiceOption,
} from './kit';
import kitStyles from './kit/CalculatorKit.module.css';
import sharedStyles from './ToolCalculator.module.css';
import styles from './NutritionBatch.module.css';

export type WeightCutGainPlannerProps = {
  shareEnvironment?: ShareEnvironment;
  onPrint?: () => void;
};

const INITIAL_VALUES: WeightCutValues = {
  gender: 'male',
  age: '',
  currentWeight: '',
  height: '',
  bodyFat: '',
  activityLevel: '',
  goalType: '',
  targetWeight: '',
  targetDate: '',
  priority: '',
  sportType: '',
  competitionSchedule: 'none',
  weightClassRequirement: 'none',
  strengthPriority: 'critical',
  medicalConditions: 'none',
  medications: 'none',
  previousWeightChanges: 'none',
  supportSystem: 'none',
};

const GENDER_OPTIONS: readonly {value: 'male' | 'female'; label: string}[] = [
  {value: 'male', label: 'Male'},
  {value: 'female', label: 'Female'},
] as const;

const ACTIVITY_OPTIONS: readonly {
  value: NutritionActivityLevel;
  label: string;
}[] = [
  {value: 'sedentary', label: 'Sedentary (Desk job, little exercise)'},
  {value: 'light', label: 'Light (1-3 workouts/week)'},
  {value: 'moderate', label: 'Moderate (3-5 workouts/week)'},
  {value: 'active', label: 'Active (6-7 workouts/week)'},
  {value: 'very-active', label: 'Very Active (Athlete, physical job)'},
] as const;

export function WeightCutGainPlanner({
  shareEnvironment,
  onPrint,
}: WeightCutGainPlannerProps): ReactNode {
  const formTitleId = useId();
  const calculator = useCalculator<WeightCutValues, WeightCutResult>({
    initialValues: INITIAL_VALUES,
    validate: validateWeightCutValues,
    calculate: calculateWeightCut,
    getSharePayload: (result) => ({
      title: 'Weight-Cut / Weight-Gain Planner Results',
      text: `My plan targets ${result.weeklyChangeDisplay} over ${result.timelineDisplay}. Create yours at Sports Tools Hub!`,
      url: typeof window === 'undefined' ? undefined : window.location.href,
    }),
    shareEnvironment,
    onPrint,
  });
  const {values, errors, result} = calculator;

  return (
    <div className={sharedStyles.layout}>
      <section className={sharedStyles.card} aria-labelledby={formTitleId}>
        <div className={sharedStyles.cardHeader}>
          <h2 className={sharedStyles.cardTitle} id={formTitleId}>
            Your Weight Change Goals
          </h2>
        </div>
        <form className={kitStyles.form} onSubmit={calculator.submit} noValidate>
          <div className={styles.fieldGroup}>
            <h3 className={styles.groupTitle}>Current Stats</h3>
            <ChoiceField
              legend="Gender"
              value={values.gender}
              onValueChange={(value) =>
                calculator.setValue('gender', value as WeightCutGender)
              }
              options={GENDER_OPTIONS as readonly ChoiceOption<'male' | 'female'>[]}
            />

            <NumberField
              label="Age"
              value={values.age}
              onValueChange={(value) => calculator.setValue('age', value)}
              error={errors.age}
              placeholder="28"
              required
              min={16}
              max={80}
              step={1}
            />

            <NumberField
              label="Current Weight (kg)"
              value={values.currentWeight}
              onValueChange={(value) =>
                calculator.setValue('currentWeight', value)
              }
              hint="Guide: 40-300 kg"
              error={errors.currentWeight}
              placeholder="75"
              required
              min={40}
              max={300}
              step={0.1}
            />

            <NumberField
              label="Height (cm)"
              value={values.height}
              onValueChange={(value) => calculator.setValue('height', value)}
              hint="Guide: 100-250 cm"
              error={errors.height}
              placeholder="175"
              required
              min={100}
              max={250}
              step={1}
            />

            <NumberField
              label="Body Fat (%)"
              value={values.bodyFat}
              onValueChange={(value) => calculator.setValue('bodyFat', value)}
              error={errors.bodyFat}
              placeholder="Optional but recommended"
              min={3}
              max={60}
              step={0.5}
            />

            <SelectField
              label="Activity Level"
              value={values.activityLevel}
              onValueChange={(value) =>
                calculator.setValue(
                  'activityLevel',
                  value as NutritionActivityLevel,
                )
              }
              options={ACTIVITY_OPTIONS}
              placeholder="Select activity level..."
              error={errors.activityLevel}
              required
            />
          </div>

          <div className={styles.fieldGroup}>
            <h3 className={styles.groupTitle}>Weight Change Goals</h3>
            <SelectField
              label="Goal Type"
              value={values.goalType}
              onValueChange={(value) =>
                calculator.setValue('goalType', value as WeightCutGoal)
              }
              options={WEIGHT_CUT_GOALS}
              placeholder="Select your goal..."
              error={errors.goalType}
              required
            />

            <NumberField
              label="Target Weight (kg)"
              value={values.targetWeight}
              onValueChange={(value) =>
                calculator.setValue('targetWeight', value)
              }
              error={errors.targetWeight}
              placeholder="70"
              required
              min={40}
              max={300}
              step={0.1}
            />

            <DateField
              label="Target Date"
              value={values.targetDate}
              onValueChange={(value) =>
                calculator.setValue('targetDate', value)
              }
              error={errors.targetDate}
              required
            />

            <SelectField
              label="Priority Level"
              value={values.priority}
              onValueChange={(value) =>
                calculator.setValue('priority', value as WeightCutPriority)
              }
              options={WEIGHT_CUT_PRIORITIES}
              placeholder="Select priority..."
              error={errors.priority}
              required
            />
          </div>

          <div className={styles.fieldGroup}>
            <h3 className={styles.groupTitle}>Training Context</h3>
            <SelectField
              label="Sport/Training Type"
              value={values.sportType}
              onValueChange={(value) =>
                calculator.setValue('sportType', value as WeightCutSport)
              }
              options={WEIGHT_CUT_SPORTS}
              placeholder="Select your sport..."
              error={errors.sportType}
              required
            />

            <SelectField
              label="Competition Schedule"
              value={values.competitionSchedule}
              onValueChange={(value) =>
                calculator.setValue(
                  'competitionSchedule',
                  value as WeightCutCompetitionSchedule,
                )
              }
              options={WEIGHT_CUT_COMPETITION_SCHEDULES}
            />

            <SelectField
              label="Weight Class Requirement"
              value={values.weightClassRequirement}
              onValueChange={(value) =>
                calculator.setValue(
                  'weightClassRequirement',
                  value as WeightCutWeightClass,
                )
              }
              options={WEIGHT_CUT_WEIGHT_CLASSES}
            />

            <SelectField
              label="Strength Performance Priority"
              value={values.strengthPriority}
              onValueChange={(value) =>
                calculator.setValue(
                  'strengthPriority',
                  value as WeightCutStrengthPriority,
                )
              }
              options={WEIGHT_CUT_STRENGTH_PRIORITIES}
            />
          </div>

          <div className={styles.fieldGroup}>
            <h3 className={styles.groupTitle}>Health Considerations</h3>
            <SelectField
              label="Medical Conditions"
              value={values.medicalConditions}
              onValueChange={(value) =>
                calculator.setValue(
                  'medicalConditions',
                  value as WeightCutMedical,
                )
              }
              options={WEIGHT_CUT_MEDICAL}
            />

            <SelectField
              label="Current Medications"
              value={values.medications}
              onValueChange={(value) =>
                calculator.setValue('medications', value as WeightCutMedication)
              }
              options={WEIGHT_CUT_MEDICATIONS}
            />

            <SelectField
              label="Previous Weight Change Experience"
              value={values.previousWeightChanges}
              onValueChange={(value) =>
                calculator.setValue(
                  'previousWeightChanges',
                  value as WeightCutHistory,
                )
              }
              options={WEIGHT_CUT_HISTORY}
            />

            <SelectField
              label="Support System"
              value={values.supportSystem}
              onValueChange={(value) =>
                calculator.setValue('supportSystem', value as WeightCutSupport)
              }
              options={WEIGHT_CUT_SUPPORT}
            />
          </div>

          <div className={kitStyles.formActions}>
            <button
              className={clsx(kitStyles.button, kitStyles.buttonPrimary)}
              type="submit"
            >
              Generate Weight Plan
            </button>
            <button
              className={clsx(kitStyles.button, kitStyles.buttonSecondary)}
              type="button"
              onClick={calculator.reset}
            >
              Reset
            </button>
          </div>
        </form>
      </section>

      <ResultCard
        ref={calculator.resultRef}
        title="Your Personalized Weight Change Plan"
        value={result ? result.weeklyChangeDisplay : '--'}
        category={result ? `over ${result.timelineDisplay}` : undefined}
        description={result ? result.approach : undefined}
      >
        <h3 className={sharedStyles.sectionTitle}>Weekly Targets</h3>
        <div className={styles.overviewGrid}>
          <div className={styles.overviewItem}>
            <div className={styles.overviewLabel}>Weight Change</div>
            <div className={styles.overviewValue}>
              {result ? result.weeklyChangeDisplay : '--'}
            </div>
          </div>
          <div className={styles.overviewItem}>
            <div className={styles.overviewLabel}>
              Calorie Deficit/Surplus
            </div>
            <div className={styles.overviewValue}>
              {result ? result.dailyCalorieAdjustmentDisplay : '--'}
            </div>
          </div>
          <div className={styles.overviewItem}>
            <div className={styles.overviewLabel}>Timeline</div>
            <div className={styles.overviewValue}>
              {result ? result.timelineDisplay : '--'}
            </div>
          </div>
          <div className={styles.overviewItem}>
            <div className={styles.overviewLabel}>Success Rate</div>
            <div className={styles.overviewValue}>
              {result ? result.successRateDisplay : '--'}
            </div>
          </div>
        </div>

        <h3 className={sharedStyles.sectionTitle}>Phase-Based Plan</h3>
        <div className={styles.scheduleList}>
          {(result?.phases ?? []).map((phase) => (
            <div className={styles.scheduleRow} key={phase.name}>
              <span className={styles.scheduleRowBody}>
                <span className={styles.scheduleRowType}>{phase.name}</span>
                <span className={styles.scheduleRowFocus}>
                  {phase.duration} - {phase.weeklyTarget}
                </span>
                <span className={styles.scheduleRowFocus}>{phase.focus}</span>
              </span>
            </div>
          ))}
        </div>

        <h3 className={sharedStyles.sectionTitle}>Nutrition Strategy</h3>
        <div className={styles.tipsGrid}>
          {(result?.nutrition ?? []).map((item) => (
            <div className={styles.tipCard} key={item.title}>
              <h4 className={styles.tipTitle}>{item.title}</h4>
              <p className={styles.tipBody}>{item.body}</p>
            </div>
          ))}
        </div>

        <h3 className={sharedStyles.sectionTitle}>Training Modifications</h3>
        <div className={styles.tipsGrid}>
          {(result?.training ?? []).map((item) => (
            <div className={styles.tipCard} key={item.title}>
              <h4 className={styles.tipTitle}>{item.title}</h4>
              <p className={styles.tipBody}>{item.body}</p>
            </div>
          ))}
        </div>

        <h3 className={sharedStyles.sectionTitle}>Monitoring &amp; Adjustments</h3>
        <div className={styles.tipsGrid}>
          {(result?.monitoring ?? []).map((item) => (
            <div className={styles.tipCard} key={item.title}>
              <h4 className={styles.tipTitle}>{item.title}</h4>
              <p className={styles.tipBody}>{item.body}</p>
            </div>
          ))}
        </div>

        <h3 className={sharedStyles.sectionTitle}>Risk Assessment</h3>
        <div className={styles.riskCard}>
          <span className={styles.riskLevel}>{result ? result.risk.level : '--'}</span>
          <p className={styles.tipBody}>
            {result ? result.risk.summary : ''}
          </p>
        </div>
        <ul className={styles.list}>
          {(result?.risk.factors ?? []).map((factor) => (
            <li key={factor}>{factor}</li>
          ))}
        </ul>
      </ResultCard>
    </div>
  );
}
