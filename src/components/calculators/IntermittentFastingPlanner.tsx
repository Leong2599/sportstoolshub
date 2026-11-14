import {useId, type ReactNode} from 'react';
import clsx from 'clsx';
import {
  calculateFasting,
  FASTING_DAYS,
  FASTING_EXPERIENCE_OPTIONS,
  FASTING_FREQUENCIES,
  FASTING_GOALS,
  FASTING_INTENSITIES,
  FASTING_LIFESTYLES,
  FASTING_METHOD_OPTIONS,
  FASTING_TRAINING_TIMES,
  FASTING_TRAINING_TYPES,
  validateFastingValues,
  type FastingDay,
  type FastingExperience,
  type FastingGoal,
  type FastingIntensity,
  type FastingLifestyle,
  type FastingMethod,
  type FastingResult,
  type FastingTrainingType,
  type FastingTrainingTime,
  type FastingValues,
} from '../../lib/calculators/intermittentFasting';
import type {ShareEnvironment} from '../../lib/calculators/share';
import {
  CheckboxGroup,
  ChoiceField,
  NumberField,
  ResultCard,
  SelectField,
  useCalculator,
  type ChoiceOption,
} from './kit';
import kitStyles from './kit/CalculatorKit.module.css';
import sharedStyles from './ToolCalculator.module.css';
import styles from './NutritionBatch.module.css';

export type IntermittentFastingPlannerProps = {
  shareEnvironment?: ShareEnvironment;
  onPrint?: () => void;
};

const INITIAL_VALUES: FastingValues = {
  gender: 'male',
  age: '',
  currentWeight: '',
  targetWeight: '',
  fastingExperience: '',
  fastingMethod: '16:8',
  trainingFrequency: '',
  primaryTrainingType: '',
  trainingTime: '',
  trainingIntensity: '',
  trainingDays: [],
  primaryGoal: '',
  lifestyle: '',
  customFastHours: '',
  customEatHours: '',
};

const GENDER_OPTIONS: readonly {value: 'male' | 'female'; label: string}[] = [
  {value: 'male', label: 'Male'},
  {value: 'female', label: 'Female'},
] as const;

export function IntermittentFastingPlanner({
  shareEnvironment,
  onPrint,
}: IntermittentFastingPlannerProps): ReactNode {
  const formTitleId = useId();
  const calculator = useCalculator<FastingValues, FastingResult>({
    initialValues: INITIAL_VALUES,
    validate: validateFastingValues,
    calculate: calculateFasting,
    getSharePayload: (result) => ({
      title: 'Intermittent Fasting Planner Results',
      text: `My recommended fasting method is ${result.recommendedMethod.label} with a ${result.plannedMethod.fastHours}h fast and ${result.plannedMethod.eatHours}h eating window. Create yours at Sports Tools Hub!`,
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
            Your IF &amp; Training Profile
          </h2>
        </div>
        <form className={kitStyles.form} onSubmit={calculator.submit} noValidate>
          <div className={styles.fieldGroup}>
            <h3 className={styles.groupTitle}>Personal Details</h3>
            <ChoiceField
              legend="Gender"
              value={values.gender}
              onValueChange={(value) =>
                calculator.setValue('gender', value as 'male' | 'female')
              }
              options={GENDER_OPTIONS as readonly ChoiceOption<'male' | 'female'>[]}
            />

            <NumberField
              label="Age"
              value={values.age}
              onValueChange={(value) => calculator.setValue('age', value)}
              error={errors.age}
              placeholder="30"
              required
              min={18}
              max={80}
              step={1}
            />

            <NumberField
              label="Current Weight (kg)"
              value={values.currentWeight}
              onValueChange={(value) =>
                calculator.setValue('currentWeight', value)
              }
              error={errors.currentWeight}
              placeholder="80"
              required
              min={40}
              max={200}
              step={0.1}
            />

            <NumberField
              label="Target Weight (kg)"
              value={values.targetWeight}
              onValueChange={(value) =>
                calculator.setValue('targetWeight', value)
              }
              error={errors.targetWeight}
              placeholder="75"
              required
              min={40}
              max={200}
              step={0.1}
            />
          </div>

          <div className={styles.fieldGroup}>
            <h3 className={styles.groupTitle}>Fasting Experience</h3>
            <SelectField
              label="Fasting Experience"
              value={values.fastingExperience}
              onValueChange={(value) =>
                calculator.setValue(
                  'fastingExperience',
                  value as FastingExperience,
                )
              }
              options={FASTING_EXPERIENCE_OPTIONS}
              placeholder="Select experience level..."
              error={errors.fastingExperience}
              required
            />

            <SelectField
              label="Preferred IF Method"
              value={values.fastingMethod}
              onValueChange={(value) =>
                calculator.setValue('fastingMethod', value as FastingMethod)
              }
              options={FASTING_METHOD_OPTIONS}
            />

            {values.fastingMethod === 'custom' ? (
              <div className={styles.inputGrid}>
                <NumberField
                  label="Fast Length (hours)"
                  value={values.customFastHours}
                  onValueChange={(value) =>
                    calculator.setValue('customFastHours', value)
                  }
                  error={errors.customFastHours}
                  placeholder="16"
                  required
                  min={12}
                  max={20}
                  step={1}
                />
                <NumberField
                  label="Eating Window (hours)"
                  value={values.customEatHours}
                  onValueChange={(value) =>
                    calculator.setValue('customEatHours', value)
                  }
                  error={errors.customEatHours}
                  placeholder="8"
                  required
                  min={4}
                  max={8}
                  step={1}
                />
              </div>
            ) : null}
          </div>

          <div className={styles.fieldGroup}>
            <h3 className={styles.groupTitle}>Training Schedule</h3>
            <SelectField
              label="Training Days per Week"
              value={values.trainingFrequency}
              onValueChange={(value) =>
                calculator.setValue('trainingFrequency', value as never)
              }
              options={FASTING_FREQUENCIES}
              placeholder="Select frequency..."
              error={errors.trainingFrequency}
              required
            />

            <SelectField
              label="Primary Training Type"
              value={values.primaryTrainingType}
              onValueChange={(value) =>
                calculator.setValue(
                  'primaryTrainingType',
                  value as FastingTrainingType,
                )
              }
              options={FASTING_TRAINING_TYPES}
              placeholder="Select training type..."
              error={errors.primaryTrainingType}
              required
            />

            <SelectField
              label="Preferred Training Time"
              value={values.trainingTime}
              onValueChange={(value) =>
                calculator.setValue(
                  'trainingTime',
                  value as FastingTrainingTime,
                )
              }
              options={FASTING_TRAINING_TIMES}
              placeholder="Select preferred time..."
              error={errors.trainingTime}
              required
            />

            <SelectField
              label="Training Intensity"
              value={values.trainingIntensity}
              onValueChange={(value) =>
                calculator.setValue(
                  'trainingIntensity',
                  value as FastingIntensity,
                )
              }
              options={FASTING_INTENSITIES}
              placeholder="Select intensity..."
              error={errors.trainingIntensity}
              required
            />

            <CheckboxGroup
              legend="Which days do you train?"
              value={values.trainingDays}
              onValueChange={(value) =>
                calculator.setValue(
                  'trainingDays',
                  value as FastingDay[],
                )
              }
              options={FASTING_DAYS}
              error={errors.trainingDays}
              required
            />
          </div>

          <div className={styles.fieldGroup}>
            <h3 className={styles.groupTitle}>Goals &amp; Preferences</h3>
            <SelectField
              label="Primary Goal"
              value={values.primaryGoal}
              onValueChange={(value) =>
                calculator.setValue('primaryGoal', value as FastingGoal)
              }
              options={FASTING_GOALS}
              placeholder="Select primary goal..."
              error={errors.primaryGoal}
              required
            />

            <SelectField
              label="Lifestyle Considerations"
              value={values.lifestyle}
              onValueChange={(value) =>
                calculator.setValue(
                  'lifestyle',
                  value as FastingLifestyle,
                )
              }
              options={FASTING_LIFESTYLES}
              placeholder="Select lifestyle..."
            />
          </div>

          <div className={kitStyles.formActions}>
            <button
              className={clsx(kitStyles.button, kitStyles.buttonPrimary)}
              type="submit"
            >
              Generate IF Schedule
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
        title="Your Personalized IF Schedule"
        value={
          result ? `${result.plannedMethod.fastHours}:${result.plannedMethod.eatHours}` : '--'
        }
        category={
          result ? `${result.plannedMethod.label} recommended` : undefined
        }
        description={result ? result.rationale : undefined}
      >
        <h3 className={sharedStyles.sectionTitle}>
          Recommended Fasting Method
        </h3>
        <div className={styles.overviewGrid}>
          <div className={styles.overviewItem}>
            <div className={styles.overviewLabel}>Method</div>
            <div className={styles.overviewValue}>
              {result ? result.plannedMethod.label : '--'}
            </div>
          </div>
          <div className={styles.overviewItem}>
            <div className={styles.overviewLabel}>Fast</div>
            <div className={styles.overviewValue}>
              {result ? `${result.plannedMethod.fastHours}h` : '--'}
            </div>
          </div>
          <div className={styles.overviewItem}>
            <div className={styles.overviewLabel}>Eating Window</div>
            <div className={styles.overviewValue}>
              {result ? `${result.plannedMethod.eatHours}h` : '--'}
            </div>
          </div>
          <div className={styles.overviewItem}>
            <div className={styles.overviewLabel}>Daily Protein</div>
            <div className={styles.overviewValue}>
              {result ? `${result.dailyProtein}g` : '--'}
            </div>
          </div>
        </div>

        {result && !result.matchesPreference ? (
          <p className={styles.small}>
            You preferred {values.fastingMethod}. This plan follows{' '}
            {result.plannedMethod.label} because it fits your experience,
            goal, and training load.
          </p>
        ) : null}

        <h3 className={sharedStyles.sectionTitle}>Weekly Schedule</h3>
        <div className={styles.scheduleList}>
          {(result?.weeklyPlan ?? []).map((day) => (
            <div
              className={clsx(
                styles.scheduleRow,
                day.isTrainingDay && styles.scheduleRowPre,
              )}
              key={day.day}
            >
              <span className={styles.scheduleRowTime}>{day.dayLabel}</span>
              <span className={styles.scheduleRowBody}>
                <span className={styles.scheduleRowType}>
                  {day.trainingTimeLabel}
                </span>
                <span className={styles.scheduleRowFocus}>
                  Eat {day.eatWindow} | Fast {day.fastWindow}
                </span>
                <span className={styles.scheduleRowFocus}>{day.note}</span>
              </span>
            </div>
          ))}
        </div>

        <h3 className={sharedStyles.sectionTitle}>
          Training &amp; Fasting Alignment
        </h3>
        <div className={styles.tipsGrid}>
          {(result?.alignment ?? []).map((item) => (
            <div className={styles.tipCard} key={item.title}>
              <h4 className={styles.tipTitle}>{item.title}</h4>
              <p className={styles.tipBody}>{item.body}</p>
            </div>
          ))}
        </div>

        <h3 className={sharedStyles.sectionTitle}>
          Nutrition Timing Guidelines
        </h3>
        <div className={styles.tipsGrid}>
          {(result?.nutrition ?? []).map((item) => (
            <div className={styles.tipCard} key={item.title}>
              <h4 className={styles.tipTitle}>{item.title}</h4>
              <p className={styles.tipBody}>{item.body}</p>
            </div>
          ))}
        </div>

        <h3 className={sharedStyles.sectionTitle}>Adaptation &amp; Success Tips</h3>
        <div className={styles.tipsGrid}>
          {(result?.tips ?? []).map((item) => (
            <div className={styles.tipCard} key={item.title}>
              <h4 className={styles.tipTitle}>{item.title}</h4>
              <p className={styles.tipBody}>{item.body}</p>
            </div>
          ))}
        </div>
      </ResultCard>
    </div>
  );
}
