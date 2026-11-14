import {useId, type ReactNode} from 'react';
import clsx from 'clsx';
import {
  calculatePostWorkout,
  POST_WORKOUT_DIETS,
  POST_WORKOUT_FITNESS_LEVELS,
  POST_WORKOUT_GOALS,
  POST_WORKOUT_MEAL_TYPES,
  POST_WORKOUT_NEXT_TIMES,
  POST_WORKOUT_NEXT_TYPES,
  POST_WORKOUT_TIME_SINCE,
  POST_WORKOUT_TYPES,
  validatePostWorkoutValues,
  type PostWorkoutDiet,
  type PostWorkoutFitness,
  type PostWorkoutGoal,
  type PostWorkoutMealType,
  type PostWorkoutNextTime,
  type PostWorkoutNextType,
  type PostWorkoutResult,
  type PostWorkoutTimeSince,
  type PostWorkoutType,
  type PostWorkoutValues,
} from '../../lib/calculators/postWorkoutRecovery';
import {
  NumberField,
  ResultCard,
  SelectField,
  useCalculator,
} from './kit';
import kitStyles from './kit/CalculatorKit.module.css';
import sharedStyles from './ToolCalculator.module.css';
import styles from './NutritionBatch.module.css';

export type PostWorkoutRecoveryMealBuilderProps = {
  onPrint?: () => void;
};

const INITIAL_VALUES: PostWorkoutValues = {
  currentWeight: '',
  bodyFat: '',
  fitnessLevel: '',
  primaryGoal: '',
  workoutType: '',
  workoutDuration: '',
  workoutIntensity: '5',
  timeSinceWorkout: 'immediately',
  nextWorkoutTime: '',
  nextWorkoutType: '',
  dietaryRestrictions: 'none',
  mealType: 'shake',
};

export function PostWorkoutRecoveryMealBuilder({
  onPrint,
}: PostWorkoutRecoveryMealBuilderProps): ReactNode {
  const formTitleId = useId();
  const calculator = useCalculator<PostWorkoutValues, PostWorkoutResult>({
    initialValues: INITIAL_VALUES,
    validate: validatePostWorkoutValues,
    calculate: calculatePostWorkout,
    getSharePayload: (result) => ({
      title: 'Post-Workout Recovery Meal Builder Results',
      text: `My recovery target is ${result.totalProtein}g protein with ${result.totalCarbs}g carbs (${result.ratioDisplay}). Create yours at Sports Tools Hub!`,
      url: typeof window === 'undefined' ? undefined : window.location.href,
    }),
    onPrint,
  });
  const {values, errors, result} = calculator;

  return (
    <div className={sharedStyles.layout}>
      <section className={sharedStyles.card} aria-labelledby={formTitleId}>
        <div className={sharedStyles.cardHeader}>
          <h2 className={sharedStyles.cardTitle} id={formTitleId}>
            Workout Recovery Details
          </h2>
        </div>
        <form className={kitStyles.form} onSubmit={calculator.submit} noValidate>
          <div className={styles.fieldGroup}>
            <h3 className={styles.groupTitle}>Athlete Profile</h3>
            <NumberField
              label="Current Weight (kg)"
              value={values.currentWeight}
              onValueChange={(value) =>
                calculator.setValue('currentWeight', value)
              }
              hint="Guide: 40-200 kg"
              error={errors.currentWeight}
              placeholder="75"
              required
              min={40}
              max={200}
              step={0.1}
            />

            <NumberField
              label="Body Fat (%)"
              value={values.bodyFat}
              onValueChange={(value) =>
                calculator.setValue('bodyFat', value)
              }
              placeholder="Optional"
              min={5}
              max={50}
              step={0.5}
            />

            <SelectField
              label="Fitness Level"
              value={values.fitnessLevel}
              onValueChange={(value) =>
                calculator.setValue(
                  'fitnessLevel',
                  value as PostWorkoutFitness,
                )
              }
              options={POST_WORKOUT_FITNESS_LEVELS}
              placeholder="Select fitness level..."
              error={errors.fitnessLevel}
              required
            />

            <SelectField
              label="Primary Training Goal"
              value={values.primaryGoal}
              onValueChange={(value) =>
                calculator.setValue('primaryGoal', value as PostWorkoutGoal)
              }
              options={POST_WORKOUT_GOALS}
              placeholder="Select primary goal..."
              error={errors.primaryGoal}
              required
            />
          </div>

          <div className={styles.fieldGroup}>
            <h3 className={styles.groupTitle}>Just Completed Workout</h3>
            <SelectField
              label="Workout Type"
              value={values.workoutType}
              onValueChange={(value) =>
                calculator.setValue('workoutType', value as PostWorkoutType)
              }
              options={POST_WORKOUT_TYPES}
              placeholder="Select workout type..."
              error={errors.workoutType}
              required
            />

            <NumberField
              label="Duration (minutes)"
              value={values.workoutDuration}
              onValueChange={(value) =>
                calculator.setValue('workoutDuration', value)
              }
              hint="Guide: 15-240 minutes"
              error={errors.workoutDuration}
              placeholder="60"
              required
              min={15}
              max={240}
              step={1}
            />

            <NumberField
              label="Workout Intensity (1-10)"
              value={values.workoutIntensity}
              onValueChange={(value) =>
                calculator.setValue('workoutIntensity', value)
              }
              hint="1 = Light, 5 = Moderate, 10 = Very Hard"
              error={errors.workoutIntensity}
              placeholder="5"
              required
              min={1}
              max={10}
              step={1}
            />

            <SelectField
              label="Time Since Workout End"
              value={values.timeSinceWorkout}
              onValueChange={(value) =>
                calculator.setValue(
                  'timeSinceWorkout',
                  value as PostWorkoutTimeSince,
                )
              }
              options={POST_WORKOUT_TIME_SINCE}
              required
            />
          </div>

          <div className={styles.fieldGroup}>
            <h3 className={styles.groupTitle}>Next Training Session</h3>
            <SelectField
              label="Next Workout In"
              value={values.nextWorkoutTime}
              onValueChange={(value) =>
                calculator.setValue(
                  'nextWorkoutTime',
                  value as PostWorkoutNextTime,
                )
              }
              options={POST_WORKOUT_NEXT_TIMES}
              placeholder="Select time frame..."
              error={errors.nextWorkoutTime}
              required
            />

            <SelectField
              label="Next Workout Type"
              value={values.nextWorkoutType}
              onValueChange={(value) =>
                calculator.setValue(
                  'nextWorkoutType',
                  value as PostWorkoutNextType,
                )
              }
              options={POST_WORKOUT_NEXT_TYPES}
            />
          </div>

          <div className={styles.fieldGroup}>
            <h3 className={styles.groupTitle}>Dietary Preferences</h3>
            <SelectField
              label="Dietary Restrictions"
              value={values.dietaryRestrictions}
              onValueChange={(value) =>
                calculator.setValue(
                  'dietaryRestrictions',
                  value as PostWorkoutDiet,
                )
              }
              options={POST_WORKOUT_DIETS}
            />

            <SelectField
              label="Preferred Meal Type"
              value={values.mealType}
              onValueChange={(value) =>
                calculator.setValue(
                  'mealType',
                  value as PostWorkoutMealType,
                )
              }
              options={POST_WORKOUT_MEAL_TYPES}
            />
          </div>

          <div className={kitStyles.formActions}>
            <button
              className={clsx(kitStyles.button, kitStyles.buttonPrimary)}
              type="submit"
            >
              Build Recovery Meal
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
        title="Your Recovery Nutrition Plan"
        value={result ? `${result.totalProtein}g` : '--'}
        category="protein target"
        description={
          result
            ? `${result.totalCarbs}g carbs - ${result.ratioDisplay} ratio - ${result.totalCalories} cal`
            : undefined
        }
      >
        <h3 className={sharedStyles.sectionTitle}>Optimal Recovery Macros</h3>
        <div className={styles.macroGrid}>
          <div className={styles.macroCard}>
            <div className={styles.macroLabel}>Protein</div>
            <div className={styles.macroGrams}>
              {result ? `${result.totalProtein}g` : '--g'}
            </div>
          </div>
          <div className={styles.macroCard}>
            <div className={styles.macroLabel}>Carbs</div>
            <div className={styles.macroGrams}>
              {result ? `${result.totalCarbs}g` : '--g'}
            </div>
          </div>
          <div className={styles.macroCard}>
            <div className={styles.macroLabel}>Ratio</div>
            <div className={styles.macroGrams}>
              {result ? result.ratioDisplay : '--:--'}
            </div>
          </div>
          <div className={styles.macroCard}>
            <div className={styles.macroLabel}>Calories</div>
            <div className={styles.macroGrams}>
              {result ? `${result.totalCalories} cal` : '--'}
            </div>
          </div>
        </div>

        <h3 className={sharedStyles.sectionTitle}>Recovery Timing</h3>
        <div className={styles.timelineList}>
          <div className={styles.timelineItem}>
            <h4 className={styles.timelineTitle}>
              {result ? result.timingTitle : 'Recovery Window'}
            </h4>
            <p className={styles.timelineBody}>
              {result ? result.timingBody : ''}
            </p>
            <p className={styles.timelineBody}>
              <strong>Target consumption:</strong>{' '}
              {result ? result.targetConsumption : ''}
            </p>
          </div>
        </div>

        <h3 className={sharedStyles.sectionTitle}>Meal Suggestions</h3>
        <div className={styles.mealGrid}>
          {(result?.suggestions ?? []).map((suggestion) => (
            <div className={styles.mealCard} key={suggestion.title}>
              <h4 className={styles.mealName}>{suggestion.title}</h4>
              <ul className={styles.list}>
                {suggestion.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <h3 className={sharedStyles.sectionTitle}>Rehydration Strategy</h3>
        <div className={styles.overviewGrid}>
          <div className={styles.overviewItem}>
            <div className={styles.overviewLabel}>Estimated fluid loss</div>
            <div className={styles.overviewValue}>
              {result ? `${result.estimatedFluidLoss}ml` : '--'}
            </div>
          </div>
          <div className={styles.overviewItem}>
            <div className={styles.overviewLabel}>Immediate goal</div>
            <div className={styles.overviewValue}>
              {result ? `${result.immediateFluidGoal}ml` : '--'}
            </div>
          </div>
        </div>
        <p className={styles.small}>
          Next 2-3 hours: Continue sipping water. Electrolytes: Include sodium if
          sweat loss was high.
        </p>

        <h3 className={sharedStyles.sectionTitle}>Optional Recovery Boosters</h3>
        <div className={styles.tipsGrid}>
          {(result?.supplements ?? []).map((supplement) => (
            <div className={styles.tipCard} key={supplement.title}>
              <h4 className={styles.tipTitle}>{supplement.title}</h4>
              <p className={styles.tipBody}>{supplement.body}</p>
            </div>
          ))}
        </div>
      </ResultCard>
    </div>
  );
}
