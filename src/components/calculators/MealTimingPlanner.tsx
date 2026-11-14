import {useId, type ReactNode} from 'react';
import clsx from 'clsx';
import {
  calculateMealTiming,
  MEAL_TIMING_CONSIDERATIONS,
  MEAL_TIMING_DURATIONS,
  MEAL_TIMING_FREQUENCIES,
  MEAL_TIMING_GOALS,
  MEAL_TIMING_INTENSITIES,
  MEAL_TIMING_PREFERENCES,
  MEAL_TIMING_SCHEDULES,
  validateMealTimingValues,
  type MealTimingConsideration,
  type MealTimingDuration,
  type MealTimingGoal,
  type MealTimingIntensity,
  type MealTimingPreference,
  type MealTimingResult,
  type MealTimingValues,
  type MealTimingWorkoutSchedule,
} from '../../lib/calculators/mealTiming';
import type {ShareEnvironment} from '../../lib/calculators/share';
import {
  PrintButton,
  ResultCard,
  SelectField,
  ShareButton,
  TimeField,
  useCalculator,
} from './kit';
import kitStyles from './kit/CalculatorKit.module.css';
import sharedStyles from './ToolCalculator.module.css';
import styles from './NutritionBatch.module.css';

export type MealTimingPlannerProps = {
  shareEnvironment?: ShareEnvironment;
  onPrint?: () => void;
};

const INITIAL_VALUES: MealTimingValues = {
  goal: '',
  workoutSchedule: '',
  workoutDuration: '',
  workoutIntensity: '',
  frequency: '',
  wakeTime: '',
  sleepTime: '',
  dietaryPreferences: [],
  specialConsiderations: [],
};

export function MealTimingPlanner({
  shareEnvironment,
  onPrint,
}: MealTimingPlannerProps): ReactNode {
  const formTitleId = useId();
  const preferencesId = useId();
  const considerationsId = useId();
  const calculator = useCalculator<MealTimingValues, MealTimingResult>({
    initialValues: INITIAL_VALUES,
    validate: validateMealTimingValues,
    calculate: calculateMealTiming,
    getSharePayload: (result) => ({
      title: 'Meal Timing Plan Results',
      text: `My meal timing plan for ${result.goal} with ${result.frequency} meals per day. Create yours at Sports Tools Hub!`,
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
            Plan Your Meal Timing Schedule
          </h2>
        </div>
        <form className={kitStyles.form} onSubmit={calculator.submit} noValidate>
          <SelectField
            label="Primary Fitness Goal"
            value={values.goal}
            onValueChange={(value) =>
              calculator.setValue('goal', value as MealTimingGoal)
            }
            options={MEAL_TIMING_GOALS}
            placeholder="Select your primary goal"
            error={errors.goal}
            required
          />

          <SelectField
            label="Workout Schedule"
            value={values.workoutSchedule}
            onValueChange={(value) =>
              calculator.setValue(
                'workoutSchedule',
                value as MealTimingWorkoutSchedule,
              )
            }
            options={MEAL_TIMING_SCHEDULES}
            placeholder="Select your workout schedule"
            error={errors.workoutSchedule}
            required
          />

          <SelectField
            label="Typical Workout Duration"
            value={values.workoutDuration}
            onValueChange={(value) =>
              calculator.setValue(
                'workoutDuration',
                value as MealTimingDuration,
              )
            }
            options={MEAL_TIMING_DURATIONS}
            placeholder="Select workout duration"
            error={errors.workoutDuration}
            required
          />

          <SelectField
            label="Workout Intensity"
            value={values.workoutIntensity}
            onValueChange={(value) =>
              calculator.setValue(
                'workoutIntensity',
                value as MealTimingIntensity,
              )
            }
            options={MEAL_TIMING_INTENSITIES}
            placeholder="Select workout intensity"
            error={errors.workoutIntensity}
            required
          />

          <SelectField
            label="Daily Meal Frequency"
            value={values.frequency}
            onValueChange={(value) => calculator.setValue('frequency', value)}
            options={MEAL_TIMING_FREQUENCIES}
            placeholder="Select meal frequency"
            error={errors.frequency}
            required
          />

          <TimeField
            label="Typical Wake-Up Time"
            value={values.wakeTime}
            onValueChange={(value) => calculator.setValue('wakeTime', value)}
            error={errors.wakeTime}
            required
          />

          <TimeField
            label="Typical Bedtime"
            value={values.sleepTime}
            onValueChange={(value) => calculator.setValue('sleepTime', value)}
            error={errors.sleepTime}
            required
          />

          <div className={kitStyles.field}>
            <label className={kitStyles.label} htmlFor={preferencesId}>
              Dietary Preferences
            </label>
            <select
              id={preferencesId}
              className={clsx(
                kitStyles.select,
                kitStyles.selectFull,
                styles.conditionSelect,
              )}
              multiple
              value={values.dietaryPreferences as string[]}
              onChange={(event) => {
                const selected = Array.from(
                  event.currentTarget.selectedOptions,
                  (option) => option.value as MealTimingPreference,
                );
                calculator.setValue('dietaryPreferences', selected);
              }}
              aria-describedby={`${preferencesId}-hint`}
            >
              {MEAL_TIMING_PREFERENCES.map((preference) => (
                <option key={preference.value} value={preference.value}>
                  {preference.label}
                </option>
              ))}
            </select>
            <p className={kitStyles.hint} id={`${preferencesId}-hint`}>
              Hold Ctrl/Cmd to select multiple preferences
            </p>
          </div>

          <div className={kitStyles.field}>
            <label className={kitStyles.label} htmlFor={considerationsId}>
              Special Considerations
            </label>
            <select
              id={considerationsId}
              className={clsx(
                kitStyles.select,
                kitStyles.selectFull,
                styles.conditionSelect,
              )}
              multiple
              value={values.specialConsiderations as string[]}
              onChange={(event) => {
                const selected = Array.from(
                  event.currentTarget.selectedOptions,
                  (option) => option.value as MealTimingConsideration,
                );
                calculator.setValue('specialConsiderations', selected);
              }}
              aria-describedby={`${considerationsId}-hint`}
            >
              {MEAL_TIMING_CONSIDERATIONS.map((consideration) => (
                <option key={consideration.value} value={consideration.value}>
                  {consideration.label}
                </option>
              ))}
            </select>
            <p className={kitStyles.hint} id={`${considerationsId}-hint`}>
              Hold Ctrl/Cmd to select multiple considerations
            </p>
          </div>

          <div className={kitStyles.formActions}>
            <button
              className={clsx(kitStyles.button, kitStyles.buttonPrimary)}
              type="submit"
            >
              Create Meal Plan
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
        title="Your Personalized Meal Timing Plan"
        value={result ? `${result.meals.length}` : '--'}
        category={result ? 'meals scheduled' : undefined}
        actions={
          <>
            <ShareButton
              onClick={calculator.share}
              status={calculator.shareStatus}
              disabled={!calculator.hasResult}
              idleLabel="Share Plan"
            />
            <PrintButton
              onClick={calculator.print}
              disabled={!calculator.hasResult}
              label="Print Plan"
            />
          </>
        }
      >
        <h3 className={sharedStyles.sectionTitle}>Optimal Meal Schedule</h3>
        <div className={styles.overviewGrid}>
          <div className={styles.overviewItem}>
            <div className={styles.overviewLabel}>Goal</div>
            <div className={styles.overviewValue}>
              {result ? result.goalLabel : '--'}
            </div>
          </div>
          <div className={styles.overviewItem}>
            <div className={styles.overviewLabel}>Workout</div>
            <div className={styles.overviewValue}>
              {result ? result.workoutLabel : '--'}
            </div>
          </div>
          <div className={styles.overviewItem}>
            <div className={styles.overviewLabel}>Meals</div>
            <div className={styles.overviewValue}>
              {result ? `${result.frequency} per day` : '--'}
            </div>
          </div>
          <div className={styles.overviewItem}>
            <div className={styles.overviewLabel}>Schedule</div>
            <div className={styles.overviewValue}>
              {result ? result.scheduleLabel : '--'}
            </div>
          </div>
        </div>

        <h3 className={sharedStyles.sectionTitle}>
          Workout Nutrition Timing
        </h3>
        <div className={styles.timelineList}>
          {(result?.timeline ?? []).map((item) => (
            <div className={styles.timelineItem} key={item.time}>
              <span className={styles.timelineTime}>{item.time}</span>
              <h4 className={styles.timelineTitle}>{item.title}</h4>
              <p className={styles.timelineBody}>{item.body}</p>
            </div>
          ))}
        </div>

        <h3 className={sharedStyles.sectionTitle}>Detailed Daily Schedule</h3>
        <div className={styles.scheduleList}>
          {(result?.meals ?? []).map((meal) => (
            <div
              className={clsx(
                styles.scheduleRow,
                meal.isPreWorkout && styles.scheduleRowPre,
                meal.isPostWorkout && styles.scheduleRowPost,
              )}
              key={`${meal.time}-${meal.type}`}
            >
              <span className={styles.scheduleRowTime}>{meal.time}</span>
              <span className={styles.scheduleRowBody}>
                <span className={styles.scheduleRowType}>{meal.type}</span>
                <span className={styles.scheduleRowFocus}>
                  Focus: {meal.focus}
                </span>
              </span>
            </div>
          ))}
        </div>

        <h3 className={sharedStyles.sectionTitle}>
          Meal Composition Guidelines
        </h3>
        <div className={styles.recommendationList}>
          {(result?.recommendations ?? []).map((recommendation) => (
            <div className={styles.recommendationItem} key={recommendation.category}>
              <span className={styles.recommendationCategory}>
                {recommendation.category}
              </span>
              <span className={styles.recommendationGuideline}>
                {recommendation.guideline}
              </span>
            </div>
          ))}
        </div>

        <h3 className={sharedStyles.sectionTitle}>
          Timing Tips &amp; Best Practices
        </h3>
        <div className={styles.tipsGrid}>
          {(result?.tips ?? []).map((tip) => (
            <div className={styles.tipCard} key={tip.title}>
              <h4 className={styles.tipTitle}>{tip.title}</h4>
              <p className={styles.tipBody}>{tip.body}</p>
            </div>
          ))}
        </div>
      </ResultCard>
    </div>
  );
}
