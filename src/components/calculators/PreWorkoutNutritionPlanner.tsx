import {useId, type ReactNode} from 'react';
import clsx from 'clsx';
import {
  calculatePreWorkout,
  PRE_WORKOUT_DIETS,
  PRE_WORKOUT_DIGESTION,
  PRE_WORKOUT_GENDERS,
  PRE_WORKOUT_GOALS,
  PRE_WORKOUT_INTENSITIES,
  PRE_WORKOUT_TYPES,
  validatePreWorkoutValues,
  type PreWorkoutDigestion,
  type PreWorkoutDiet,
  type PreWorkoutGender,
  type PreWorkoutGoal,
  type PreWorkoutIntensity,
  type PreWorkoutResult,
  type PreWorkoutType,
  type PreWorkoutValues,
} from '../../lib/calculators/preWorkoutNutrition';
import {
  ChoiceField,
  NumberField,
  ResultCard,
  SelectField,
  TimeField,
  useCalculator,
  type ChoiceOption,
} from './kit';
import kitStyles from './kit/CalculatorKit.module.css';
import sharedStyles from './ToolCalculator.module.css';
import styles from './NutritionBatch.module.css';

export type PreWorkoutNutritionPlannerProps = {
  onPrint?: () => void;
};

const INITIAL_VALUES: PreWorkoutValues = {
  bodyWeight: '',
  gender: 'male',
  workoutType: '',
  workoutDuration: '',
  workoutIntensity: '',
  workoutTime: '',
  primaryGoal: '',
  digestionComfort: '',
  dietaryRestrictions: 'none',
};

export function PreWorkoutNutritionPlanner({
  onPrint,
}: PreWorkoutNutritionPlannerProps): ReactNode {
  const formTitleId = useId();
  const calculator = useCalculator<PreWorkoutValues, PreWorkoutResult>({
    initialValues: INITIAL_VALUES,
    validate: validatePreWorkoutValues,
    calculate: calculatePreWorkout,
    getSharePayload: (result) => ({
      title: 'Pre-Workout Nutrition Planner Results',
      text: `My pre-workout plan targets ${result.totalCarbs}g carbs and ${result.totalProtein}g protein. Create yours at Sports Tools Hub!`,
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
            Your Training Details
          </h2>
        </div>
        <form className={kitStyles.form} onSubmit={calculator.submit} noValidate>
          <div className={styles.fieldGroup}>
            <h3 className={styles.groupTitle}>Athlete Information</h3>
            <NumberField
              label="Body Weight (kg)"
              value={values.bodyWeight}
              onValueChange={(value) =>
                calculator.setValue('bodyWeight', value)
              }
              hint="Guide: 30-300 kg"
              error={errors.bodyWeight}
              placeholder="75"
              required
              min={30}
              max={300}
              step={0.1}
            />

            <ChoiceField
              legend="Gender"
              value={values.gender}
              onValueChange={(value) =>
                calculator.setValue('gender', value as PreWorkoutGender)
              }
              options={
                PRE_WORKOUT_GENDERS as readonly ChoiceOption<'male' | 'female'>[]
              }
              required
            />
          </div>

          <div className={styles.fieldGroup}>
            <h3 className={styles.groupTitle}>Workout Information</h3>
            <SelectField
              label="Workout Type"
              value={values.workoutType}
              onValueChange={(value) =>
                calculator.setValue('workoutType', value as PreWorkoutType)
              }
              options={PRE_WORKOUT_TYPES}
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

            <SelectField
              label="Intensity Level"
              value={values.workoutIntensity}
              onValueChange={(value) =>
                calculator.setValue(
                  'workoutIntensity',
                  value as PreWorkoutIntensity,
                )
              }
              options={PRE_WORKOUT_INTENSITIES}
              placeholder="Select intensity..."
              error={errors.workoutIntensity}
              required
            />

            <TimeField
              label="Workout Start Time"
              value={values.workoutTime}
              onValueChange={(value) =>
                calculator.setValue('workoutTime', value)
              }
              error={errors.workoutTime}
              required
            />
          </div>

          <div className={styles.fieldGroup}>
            <h3 className={styles.groupTitle}>Nutrition Goals</h3>
            <SelectField
              label="Primary Goal"
              value={values.primaryGoal}
              onValueChange={(value) =>
                calculator.setValue('primaryGoal', value as PreWorkoutGoal)
              }
              options={PRE_WORKOUT_GOALS}
              placeholder="Select primary goal..."
              error={errors.primaryGoal}
              required
            />

            <SelectField
              label="Digestive Comfort Priority"
              value={values.digestionComfort}
              onValueChange={(value) =>
                calculator.setValue(
                  'digestionComfort',
                  value as PreWorkoutDigestion,
                )
              }
              options={PRE_WORKOUT_DIGESTION}
              placeholder="Select priority..."
              error={errors.digestionComfort}
              required
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
                  value as PreWorkoutDiet,
                )
              }
              options={PRE_WORKOUT_DIETS}
            />
          </div>

          <div className={kitStyles.formActions}>
            <button
              className={clsx(kitStyles.button, kitStyles.buttonPrimary)}
              type="submit"
            >
              Generate Nutrition Plan
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
        title="Your Pre-Workout Nutrition Plan"
        value={result ? `${result.totalCarbs}g` : '--'}
        category="carbohydrate target"
        description={
          result
            ? `${result.totalProtein}g protein - ${result.totalCalories} cal`
            : undefined
        }
      >
        <h3 className={sharedStyles.sectionTitle}>Macronutrient Targets</h3>
        <div className={styles.macroGrid}>
          <div className={styles.macroCard}>
            <div className={styles.macroLabel}>Carbohydrates</div>
            <div className={styles.macroGrams}>
              {result ? `${result.totalCarbs}g` : '--g'}
            </div>
            <div className={styles.macroCalories}>
              {result ? `${result.totalCarbs * 4} cal` : '-- cal'}
            </div>
          </div>
          <div className={styles.macroCard}>
            <div className={styles.macroLabel}>Protein</div>
            <div className={styles.macroGrams}>
              {result ? `${result.totalProtein}g` : '--g'}
            </div>
            <div className={styles.macroCalories}>
              {result ? `${result.totalProtein * 4} cal` : '-- cal'}
            </div>
          </div>
          <div className={styles.macroCard}>
            <div className={styles.macroLabel}>Total Calories</div>
            <div className={styles.macroGrams}>
              {result ? `${result.totalCalories} cal` : '-- cal'}
            </div>
            <div className={styles.macroCalories}>
              {result ? `~${result.caloriesPerKg} cal/kg` : '-- cal/kg'}
            </div>
          </div>
        </div>

        <h3 className={sharedStyles.sectionTitle}>Nutrition Timeline</h3>
        <div className={styles.timelineList}>
          {(result?.timeline ?? []).map((item) => (
            <div className={styles.timelineItem} key={item.time}>
              <span className={styles.timelineTime}>{item.time}</span>
              <p className={styles.timelineBody}>{item.meal}</p>
            </div>
          ))}
        </div>

        <h3 className={sharedStyles.sectionTitle}>Meal &amp; Snack Suggestions</h3>
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

        <h3 className={sharedStyles.sectionTitle}>Hydration Strategy</h3>
        <div className={styles.scheduleGrid}>
          {(result?.hydration ?? []).map((item) => (
            <div className={styles.scheduleItem} key={item.time}>
              <div className={styles.scheduleTime}>{item.time}</div>
              <div className={styles.scheduleAmount}>{item.amount}</div>
            </div>
          ))}
        </div>
      </ResultCard>
    </div>
  );
}
