import {useId, type ReactNode} from 'react';
import clsx from 'clsx';
import {
  calculateRefeed,
  REFEED_CARB_SENSITIVITY,
  REFEED_FREQUENCIES,
  REFEED_INTENSITIES,
  REFEED_STYLES,
  REFEED_TIMINGS,
  REFEED_TRAINING_TYPES,
  validateRefeedValues,
  type RefeedCarbSensitivity,
  type RefeedFrequency,
  type RefeedIntensity,
  type RefeedResult,
  type RefeedStyle,
  type RefeedTiming,
  type RefeedTrainingType,
  type RefeedValues,
} from '../../lib/calculators/refeedDay';
import type {ShareEnvironment} from '../../lib/calculators/share';
import {
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

export type RefeedDayCalculatorProps = {
  shareEnvironment?: ShareEnvironment;
  onPrint?: () => void;
};

const INITIAL_VALUES: RefeedValues = {
  gender: 'male',
  age: '',
  currentWeight: '',
  bodyFat: '',
  maintenanceCalories: '',
  cuttingCalories: '',
  cuttingProtein: '',
  cuttingCarbs: '',
  cuttingFats: '',
  weeksDieting: '',
  trainingFrequency: '',
  trainingIntensity: '',
  primaryTraining: '',
  cardioAmount: '',
  refeedFrequency: '',
  refeedStyle: 'moderate',
  refeedTiming: 'rest-day',
  carbSensitivity: 'normal',
};

const GENDER_OPTIONS: readonly {value: 'male' | 'female'; label: string}[] = [
  {value: 'male', label: 'Male'},
  {value: 'female', label: 'Female'},
] as const;

export function RefeedDayCalculator({
  shareEnvironment,
  onPrint,
}: RefeedDayCalculatorProps): ReactNode {
  const formTitleId = useId();
  const calculator = useCalculator<RefeedValues, RefeedResult>({
    initialValues: INITIAL_VALUES,
    validate: validateRefeedValues,
    calculate: calculateRefeed,
    getSharePayload: (result) => ({
      title: 'Refeed Day Calculator Results',
      text: `My refeed plan is ${result.refeedCalories} calories every ${result.frequencyIntervalDays} days. Create yours at Sports Tools Hub!`,
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
            Your Current Diet &amp; Training
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
              label="Body Fat (%)"
              value={values.bodyFat}
              onValueChange={(value) => calculator.setValue('bodyFat', value)}
              error={errors.bodyFat}
              placeholder="Optional but recommended"
              min={5}
              max={50}
              step={0.5}
            />
          </div>

          <div className={styles.fieldGroup}>
            <h3 className={styles.groupTitle}>Current Diet Details</h3>
            <NumberField
              label="Maintenance Calories"
              value={values.maintenanceCalories}
              onValueChange={(value) =>
                calculator.setValue('maintenanceCalories', value)
              }
              error={errors.maintenanceCalories}
              placeholder="2500"
              required
              min={1200}
              max={5000}
              step={1}
            />

            <NumberField
              label="Current Cutting Calories"
              value={values.cuttingCalories}
              onValueChange={(value) =>
                calculator.setValue('cuttingCalories', value)
              }
              error={errors.cuttingCalories}
              placeholder="2000"
              required
              min={1200}
              max={5000}
              step={1}
            />

            <NumberField
              label="Cutting Protein (g)"
              value={values.cuttingProtein}
              onValueChange={(value) =>
                calculator.setValue('cuttingProtein', value)
              }
              error={errors.cuttingProtein}
              placeholder="160"
              required
              min={50}
              max={400}
              step={1}
            />

            <NumberField
              label="Cutting Carbs (g)"
              value={values.cuttingCarbs}
              onValueChange={(value) =>
                calculator.setValue('cuttingCarbs', value)
              }
              error={errors.cuttingCarbs}
              placeholder="150"
              required
              min={20}
              max={500}
              step={1}
            />

            <NumberField
              label="Cutting Fats (g)"
              value={values.cuttingFats}
              onValueChange={(value) =>
                calculator.setValue('cuttingFats', value)
              }
              error={errors.cuttingFats}
              placeholder="60"
              required
              min={20}
              max={200}
              step={1}
            />

            <NumberField
              label="Weeks in Current Cut"
              value={values.weeksDieting}
              onValueChange={(value) =>
                calculator.setValue('weeksDieting', value)
              }
              error={errors.weeksDieting}
              placeholder="8"
              required
              min={0}
              max={52}
              step={1}
            />
          </div>

          <div className={styles.fieldGroup}>
            <h3 className={styles.groupTitle}>Training &amp; Activity</h3>
            <SelectField
              label="Training Days/Week"
              value={values.trainingFrequency}
              onValueChange={(value) =>
                calculator.setValue('trainingFrequency', value)
              }
              options={[
                {value: '3', label: '3 days/week'},
                {value: '4', label: '4 days/week'},
                {value: '5', label: '5 days/week'},
                {value: '6', label: '6 days/week'},
                {value: '7', label: '7 days/week'},
              ]}
              placeholder="Select frequency..."
              error={errors.trainingFrequency}
              required
            />

            <SelectField
              label="Training Intensity"
              value={values.trainingIntensity}
              onValueChange={(value) =>
                calculator.setValue(
                  'trainingIntensity',
                  value as RefeedIntensity,
                )
              }
              options={REFEED_INTENSITIES}
              placeholder="Select intensity..."
              error={errors.trainingIntensity}
              required
            />

            <SelectField
              label="Primary Training Type"
              value={values.primaryTraining}
              onValueChange={(value) =>
                calculator.setValue(
                  'primaryTraining',
                  value as RefeedTrainingType,
                )
              }
              options={REFEED_TRAINING_TYPES}
              placeholder="Select type..."
              error={errors.primaryTraining}
              required
            />

            <NumberField
              label="Weekly Cardio (minutes)"
              value={values.cardioAmount}
              onValueChange={(value) =>
                calculator.setValue('cardioAmount', value)
              }
              hint="0 if no separate cardio"
              error={errors.cardioAmount}
              placeholder="0"
              min={0}
              max={600}
              step={15}
            />
          </div>

          <div className={styles.fieldGroup}>
            <h3 className={styles.groupTitle}>Refeed Strategy</h3>
            <SelectField
              label="Current Refeed Frequency"
              value={values.refeedFrequency}
              onValueChange={(value) =>
                calculator.setValue(
                  'refeedFrequency',
                  value as RefeedFrequency,
                )
              }
              options={REFEED_FREQUENCIES}
              placeholder="Select frequency..."
              error={errors.refeedFrequency}
              required
            />

            <SelectField
              label="Refeed Style Preference"
              value={values.refeedStyle}
              onValueChange={(value) =>
                calculator.setValue('refeedStyle', value as RefeedStyle)
              }
              options={REFEED_STYLES}
            />

            <SelectField
              label="Preferred Refeed Day"
              value={values.refeedTiming}
              onValueChange={(value) =>
                calculator.setValue('refeedTiming', value as RefeedTiming)
              }
              options={REFEED_TIMINGS}
            />

            <SelectField
              label="Carbohydrate Sensitivity"
              value={values.carbSensitivity}
              onValueChange={(value) =>
                calculator.setValue(
                  'carbSensitivity',
                  value as RefeedCarbSensitivity,
                )
              }
              options={REFEED_CARB_SENSITIVITY}
            />
          </div>

          <div className={kitStyles.formActions}>
            <button
              className={clsx(kitStyles.button, kitStyles.buttonPrimary)}
              type="submit"
            >
              Calculate Refeed Plan
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
        title="Your Strategic Refeed Plan"
        value={result ? `${result.refeedCalories} cal` : '--'}
        category={
          result ? `${result.frequencyLabel} - ${result.styleLabel}` : undefined
        }
        description={
          result
            ? `+${result.calorieSurplusPercent}% above maintenance, ${result.calorieDifference} cal above your cutting intake.`
            : undefined
        }
      >
        <h3 className={sharedStyles.sectionTitle}>
          Recommended Refeed Schedule
        </h3>
        <div className={styles.overviewGrid}>
          {result?.schedule.map((item) => (
            <div className={styles.overviewItem} key={item.label}>
              <div className={styles.overviewLabel}>{item.label}</div>
              <div className={styles.overviewValue}>{item.value}</div>
            </div>
          ))}
        </div>

        <h3 className={sharedStyles.sectionTitle}>Refeed Day Macros</h3>
        <div className={styles.macroGrid}>
          {(result?.macros ?? []).map((macro) => (
            <div className={styles.macroCard} key={macro.label}>
              <div className={styles.macroLabel}>{macro.label}</div>
              <div className={styles.macroGrams}>{macro.display}</div>
            </div>
          ))}
        </div>

        <h3 className={sharedStyles.sectionTitle}>Best Refeed Foods</h3>
        <div className={styles.foodList}>
          {(result?.foods ?? []).map((food) => (
            <div className={styles.foodItem} key={food.name}>
              <span className={styles.foodName}>
                {food.name} - {food.portion}
              </span>
              <span className={styles.foodGl}>{food.carbs}</span>
            </div>
          ))}
        </div>

        <h3 className={sharedStyles.sectionTitle}>Refeed Timing Strategy</h3>
        <div className={styles.tipsGrid}>
          {(result?.timing ?? []).map((item) => (
            <div className={styles.tipCard} key={item.title}>
              <h4 className={styles.tipTitle}>{item.title}</h4>
              <p className={styles.tipBody}>{item.body}</p>
            </div>
          ))}
        </div>

        <h3 className={sharedStyles.sectionTitle}>Post-Refeed Protocol</h3>
        <div className={styles.tipsGrid}>
          {(result?.postRefeed ?? []).map((item) => (
            <div className={styles.tipCard} key={item.title}>
              <h4 className={styles.tipTitle}>{item.title}</h4>
              <p className={styles.tipBody}>{item.body}</p>
            </div>
          ))}
        </div>

        <h3 className={sharedStyles.sectionTitle}>Refeed Progression</h3>
        <div className={styles.tipsGrid}>
          {(result?.progression ?? []).map((item) => (
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
