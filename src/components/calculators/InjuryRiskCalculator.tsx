import {useId, type ReactNode} from 'react';
import clsx from 'clsx';
import {
  calculateInjuryRisk,
  INJURY_BODY_WEIGHT_OPTIONS,
  INJURY_COOL_DOWN_OPTIONS,
  INJURY_CONDITION_OPTIONS,
  INJURY_EXPERIENCE_OPTIONS,
  INJURY_HYDRATION_OPTIONS,
  INJURY_INTENSITY_OPTIONS,
  INJURY_NUTRITION_OPTIONS,
  INJURY_PAIN_OPTIONS,
  INJURY_PREVIOUS_INJURY_OPTIONS,
  INJURY_RECOVERY_OPTIONS,
  INJURY_SPORTS,
  INJURY_STRESS_OPTIONS,
  INJURY_TYPE_OPTIONS,
  INJURY_WARM_UP_OPTIONS,
  INJURY_CATEGORY_LABELS,
  validateInjuryValues,
  type InjuryBodyWeight,
  type InjuryCondition,
  type InjuryCurrentPain,
  type InjuryExperience,
  type InjuryGender,
  type InjuryHydration,
  type InjuryIntensity,
  type InjuryNutrition,
  type InjuryPreviousInjuries,
  type InjuryRecoveryTime,
  type InjuryResult,
  type InjurySport,
  type InjuryStress,
  type InjuryType,
  type InjuryValues,
  type InjuryWarmUp,
} from '../../lib/calculators/injuryRisk';
import type {ShareEnvironment} from '../../lib/calculators/share';
import {
  ChoiceField,
  NumberField,
  PrintButton,
  ResultCard,
  SelectField,
  ShareButton,
  useCalculator,
  type ChoiceOption,
} from './kit';
import kitStyles from './kit/CalculatorKit.module.css';
import sharedStyles from './ToolCalculator.module.css';
import styles from './InjuryRiskCalculator.module.css';

export type InjuryRiskCalculatorProps = {
  shareEnvironment?: ShareEnvironment;
  onPrint?: () => void;
};

const INITIAL_VALUES: InjuryValues = {
  age: '',
  gender: '',
  sport: '',
  experience: 'beginner',
  weeklySessions: '',
  sessionDuration: '',
  intensity: 'low',
  warmUp: 'none',
  coolDown: 'none',
  flexibility: 'poor',
  strength: 'poor',
  balance: 'poor',
  bodyWeight: 'underweight',
  previousInjuries: 'none',
  injuryType: 'none',
  recoveryTime: 'none',
  currentPain: 'none',
  sleep: '',
  stress: 'low',
  nutrition: 'poor',
  hydration: 'poor',
};

const GENDER_OPTIONS: readonly {value: InjuryGender; label: string}[] = [
  {value: 'male', label: 'Male'},
  {value: 'female', label: 'Female'},
] as const;

export function InjuryRiskCalculator({
  shareEnvironment,
  onPrint,
}: InjuryRiskCalculatorProps): ReactNode {
  const formTitleId = useId();
  const calculator = useCalculator<InjuryValues, InjuryResult>({
    initialValues: INITIAL_VALUES,
    validate: validateInjuryValues,
    calculate: calculateInjuryRisk,
    getSharePayload: (result) => ({
      title: 'Sports Injury Risk Calculator Results',
      text: `My injury risk is ${result.overallRisk}% (${result.category}). Assess your sports injury risk at Sports Tools Hub!`,
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
            Injury Risk Assessment
          </h2>
        </div>
        <form className={kitStyles.form} onSubmit={calculator.submit} noValidate>
          <div className={styles.fieldGroup}>
            <h3 className={styles.groupTitle}>Personal Information</h3>

            <NumberField
              label="Age"
              value={values.age}
              onValueChange={(value) => calculator.setValue('age', value)}
              hint="Age affects injury risk factors"
              error={errors.age}
              placeholder="Enter your age"
              required
              min={13}
              max={100}
              step={1}
            />

            <ChoiceField
              legend="Gender"
              value={values.gender}
              onValueChange={(value) => calculator.setValue('gender', value)}
              options={GENDER_OPTIONS as readonly ChoiceOption<InjuryGender>[]}
              error={errors.gender}
              required
            />

            <SelectField
              label="Primary Sport"
              value={values.sport}
              onValueChange={(value) =>
                calculator.setValue('sport', value as InjurySport)
              }
              options={INJURY_SPORTS}
              placeholder="Select your primary sport"
              error={errors.sport}
              required
            />

            <SelectField
              label="Experience Level"
              value={values.experience}
              onValueChange={(value) =>
                calculator.setValue('experience', value as InjuryExperience)
              }
              options={INJURY_EXPERIENCE_OPTIONS}
              required
            />
          </div>

          <div className={styles.fieldGroup}>
            <h3 className={styles.groupTitle}>Training Habits</h3>

            <NumberField
              label="Training Sessions per Week"
              value={values.weeklySessions}
              onValueChange={(value) =>
                calculator.setValue('weeklySessions', value)
              }
              hint="How many sessions you train each week"
              error={errors.weeklySessions}
              placeholder="Number of sessions"
              min={1}
              max={20}
              step={1}
            />

            <NumberField
              label="Average Session Duration"
              value={values.sessionDuration}
              onValueChange={(value) =>
                calculator.setValue('sessionDuration', value)
              }
              hint="In minutes"
              error={errors.sessionDuration}
              placeholder="Duration"
              min={15}
              max={300}
              step={1}
            />

            <SelectField
              label="Typical Training Intensity"
              value={values.intensity}
              onValueChange={(value) =>
                calculator.setValue('intensity', value as InjuryIntensity)
              }
              options={INJURY_INTENSITY_OPTIONS}
              required
            />

            <SelectField
              label="Warm-up Routine"
              value={values.warmUp}
              onValueChange={(value) =>
                calculator.setValue('warmUp', value as InjuryWarmUp)
              }
              options={INJURY_WARM_UP_OPTIONS}
              required
            />

            <SelectField
              label="Cool-down Routine"
              value={values.coolDown}
              onValueChange={(value) =>
                calculator.setValue('coolDown', value as InjuryWarmUp)
              }
              options={INJURY_COOL_DOWN_OPTIONS}
              required
            />
          </div>

          <div className={styles.fieldGroup}>
            <h3 className={styles.groupTitle}>Physical Condition</h3>

            <SelectField
              label="Flexibility Level"
              value={values.flexibility}
              onValueChange={(value) =>
                calculator.setValue('flexibility', value as InjuryCondition)
              }
              options={INJURY_CONDITION_OPTIONS}
              required
            />

            <SelectField
              label="Strength Level"
              value={values.strength}
              onValueChange={(value) =>
                calculator.setValue('strength', value as InjuryCondition)
              }
              options={INJURY_CONDITION_OPTIONS}
              required
            />

            <SelectField
              label="Balance and Stability"
              value={values.balance}
              onValueChange={(value) =>
                calculator.setValue('balance', value as InjuryCondition)
              }
              options={INJURY_CONDITION_OPTIONS}
              required
            />

            <SelectField
              label="Body Weight Status"
              value={values.bodyWeight}
              onValueChange={(value) =>
                calculator.setValue('bodyWeight', value as InjuryBodyWeight)
              }
              options={INJURY_BODY_WEIGHT_OPTIONS}
              required
            />
          </div>

          <div className={styles.fieldGroup}>
            <h3 className={styles.groupTitle}>Injury History</h3>

            <SelectField
              label="Previous Injuries (Last 2 Years)"
              value={values.previousInjuries}
              onValueChange={(value) =>
                calculator.setValue(
                  'previousInjuries',
                  value as InjuryPreviousInjuries,
                )
              }
              options={INJURY_PREVIOUS_INJURY_OPTIONS}
              required
            />

            <SelectField
              label="Most Recent Injury Type"
              value={values.injuryType}
              onValueChange={(value) =>
                calculator.setValue('injuryType', value as InjuryType)
              }
              options={INJURY_TYPE_OPTIONS}
              required
            />

            <SelectField
              label="Most Recent Recovery Time"
              value={values.recoveryTime}
              onValueChange={(value) =>
                calculator.setValue('recoveryTime', value as InjuryRecoveryTime)
              }
              options={INJURY_RECOVERY_OPTIONS}
              required
            />

            <SelectField
              label="Current Pain or Discomfort"
              value={values.currentPain}
              onValueChange={(value) =>
                calculator.setValue('currentPain', value as InjuryCurrentPain)
              }
              options={INJURY_PAIN_OPTIONS}
              required
            />
          </div>

          <div className={styles.fieldGroup}>
            <h3 className={styles.groupTitle}>Lifestyle Factors</h3>

            <NumberField
              label="Average Sleep per Night"
              value={values.sleep}
              onValueChange={(value) => calculator.setValue('sleep', value)}
              hint="In hours (defaults to 7 when left blank)"
              error={errors.sleep}
              placeholder="Hours of sleep"
              min={3}
              max={12}
              step={0.5}
            />

            <SelectField
              label="Stress Level"
              value={values.stress}
              onValueChange={(value) =>
                calculator.setValue('stress', value as InjuryStress)
              }
              options={INJURY_STRESS_OPTIONS}
              required
            />

            <SelectField
              label="Nutrition Quality"
              value={values.nutrition}
              onValueChange={(value) =>
                calculator.setValue('nutrition', value as InjuryNutrition)
              }
              options={INJURY_NUTRITION_OPTIONS}
              required
            />

            <SelectField
              label="Hydration Habits"
              value={values.hydration}
              onValueChange={(value) =>
                calculator.setValue('hydration', value as InjuryHydration)
              }
              options={INJURY_HYDRATION_OPTIONS}
              required
            />
          </div>

          <div className={kitStyles.formActions}>
            <button
              className={clsx(kitStyles.button, kitStyles.buttonPrimary)}
              type="submit"
            >
              Calculate Injury Risk
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
        title="Your Injury Risk Assessment"
        value={result ? `${result.overallRisk}%` : '--'}
        category={
          result ? (
            <span style={{color: result.color}}>{result.category}</span>
          ) : (
            '--'
          )
        }
        actions={
          <>
            <ShareButton
              onClick={calculator.share}
              status={calculator.shareStatus}
              disabled={!calculator.hasResult}
            />
            <PrintButton
              onClick={calculator.print}
              disabled={!calculator.hasResult}
              label="Print Results"
            />
          </>
        }
      >
        {result ? (
          <>
            <h3 className={sharedStyles.sectionTitle}>Risk Factor Breakdown</h3>
            <div className={styles.breakdownGrid}>
              {(
                Object.entries(result.scores) as Array<
                  [keyof typeof result.scores, number]
                >
              ).map(([key, score]) => (
                <div key={key} className={styles.breakdownItem}>
                  <div className={styles.breakdownLabel}>
                    {INJURY_CATEGORY_LABELS[key]}
                  </div>
                  <div className={styles.breakdownBar}>
                    <div
                      className={styles.breakdownProgress}
                      style={{width: `${score}%`}}
                    />
                  </div>
                  <div className={styles.breakdownValue}>{score}%</div>
                </div>
              ))}
            </div>

            <h3 className={sharedStyles.sectionTitle}>Prevention Strategies</h3>
            <div className={sharedStyles.recommendation}>
              {result.recommendations}
            </div>
          </>
        ) : (
          <p className={sharedStyles.empty}>
            Complete the assessment, then calculate to see your injury risk
            level and prevention strategies.
          </p>
        )}
      </ResultCard>
    </div>
  );
}
