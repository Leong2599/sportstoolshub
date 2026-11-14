import {useId, type ReactNode} from 'react';
import clsx from 'clsx';
import {
  calculateYogaCalories,
  validateYogaValues,
  YOGA_BODY_COMPOSITIONS,
  YOGA_BREATHING_OPTIONS,
  YOGA_EXPERIENCES,
  YOGA_FLEXIBILITIES,
  YOGA_INTENSITIES,
  YOGA_STYLES,
  YOGA_TEMPERATURE_UNITS,
  type YogaExperience,
  type YogaFlexibility,
  type YogaBodyComposition,
  type YogaBreathing,
  type YogaStyle,
  type YogaIntensity,
  type YogaResult,
  type YogaValues,
} from '../../lib/calculators/yoga';
import {WEIGHT_UNITS} from '../../lib/calculators/units';
import type {ShareEnvironment} from '../../lib/calculators/share';
import {
  ChoiceField,
  NumberField,
  PrintButton,
  ResultCard,
  SelectField,
  ShareButton,
  UnitField,
  useCalculator,
  type ChoiceOption,
} from './kit';
import kitStyles from './kit/CalculatorKit.module.css';
import sharedStyles from './ToolCalculator.module.css';
import styles from './YogaCalorieCalculator.module.css';

export type YogaCalorieCalculatorProps = {
  shareEnvironment?: ShareEnvironment;
  onPrint?: () => void;
};

const INITIAL_VALUES: YogaValues = {
  weight: '',
  weightUnit: 'kg',
  gender: '',
  age: '',
  experience: 'beginner',
  yogaStyle: '',
  duration: '',
  intensity: 'gentle',
  temperature: '',
  temperatureUnit: 'celsius',
  heartRate: '',
  bodyComposition: 'balanced',
  flexibility: 'moderate',
  breathing: 'moderate',
};

const GENDER_OPTIONS: readonly {value: 'male' | 'female'; label: string}[] = [
  {value: 'male', label: 'Male'},
  {value: 'female', label: 'Female'},
] as const;

export function YogaCalorieCalculator({
  shareEnvironment,
  onPrint,
}: YogaCalorieCalculatorProps): ReactNode {
  const formTitleId = useId();
  const calculator = useCalculator<YogaValues, YogaResult>({
    initialValues: INITIAL_VALUES,
    validate: validateYogaValues,
    calculate: calculateYogaCalories,
    getSharePayload: (result) => ({
      title: 'Yoga Calorie Calculator Results',
      text: `I burned ${result.calories} calories during my yoga practice! Calculate your yoga calories at Sports Tools Hub!`,
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
            Calculate Yoga Calories Burned
          </h2>
        </div>
        <form className={kitStyles.form} onSubmit={calculator.submit} noValidate>
          <div className={styles.personalInfoSection}>
            <h4 className={styles.sectionTitle}>Personal Information</h4>

            <UnitField
              label="Weight"
              value={values.weight}
              onValueChange={(value) => calculator.setValue('weight', value)}
              unit={values.weightUnit}
              onUnitChange={(unit) => calculator.setValue('weightUnit', unit)}
              units={WEIGHT_UNITS}
              hint="Enter your body weight"
              error={errors.weight}
              placeholder="Enter your weight"
              required
              min={30}
              step={0.1}
            />

            <ChoiceField
              legend="Gender"
              value={values.gender}
              onValueChange={(value) => calculator.setValue('gender', value)}
              options={GENDER_OPTIONS as readonly ChoiceOption<'male' | 'female'>[]}
              error={errors.gender}
              required
              layout="list"
            />

            <NumberField
              label="Age"
              value={values.age}
              onValueChange={(value) => calculator.setValue('age', value)}
              hint="Enter your age (affects metabolism)"
              error={errors.age}
              placeholder="Enter your age"
              required
              min={13}
              max={100}
              step={1}
            />

            <SelectField
              label="Yoga Experience"
              value={values.experience}
              onValueChange={(value) =>
                calculator.setValue('experience', value as YogaExperience)
              }
              options={YOGA_EXPERIENCES}
              hint="Your experience level affects calorie burn"
              error={errors.experience}
              required
            />
          </div>

          <div className={styles.yogaSessionSection}>
            <h4 className={styles.sectionTitle}>Yoga Session Details</h4>

            <SelectField
              label="Yoga Style"
              value={values.yogaStyle}
              onValueChange={(value) =>
                calculator.setValue('yogaStyle', value as YogaStyle)
              }
              options={YOGA_STYLES}
              placeholder="Select yoga style"
              hint="Different yoga styles have different intensities"
              error={errors.yogaStyle}
              required
            />
            <NumberField
              label="Session Duration"
              value={values.duration}
              onValueChange={(value) => calculator.setValue('duration', value)}
              hint="Length of your yoga session"
              error={errors.duration}
              placeholder="Minutes"
              required
              min={10}
              max={180}
              step={1}
            />

            <SelectField
              label="Intensity Level"
              value={values.intensity}
              onValueChange={(value) =>
                calculator.setValue('intensity', value as YogaIntensity)
              }
              options={YOGA_INTENSITIES}
              hint="Your perceived effort during the session"
              error={errors.intensity}
              required
            />

            <UnitField
              label="Room Temperature"
              value={values.temperature}
              onValueChange={(value) => calculator.setValue('temperature', value)}
              unit={values.temperatureUnit}
              onUnitChange={(unit) =>
                calculator.setValue('temperatureUnit', unit)
              }
              hint="Room temperature affects metabolism"
              error={errors.temperature}
              placeholder="Enter temperature"
              units={YOGA_TEMPERATURE_UNITS}
              min={15}
              max={45}
              step={1}
            />

            <NumberField
              label="Average Heart Rate"
              value={values.heartRate}
              onValueChange={(value) => calculator.setValue('heartRate', value)}
              hint="Optional: Enter average heart rate for more accuracy"
              error={errors.heartRate}
              placeholder="Enter heart rate"
              min={50}
              max={180}
              step={1}
            />
          </div>

          <div className={styles.advancedOptionsSection}>
            <h4 className={styles.sectionTitle}>Advanced Options</h4>

            <SelectField
              label="Body Composition"
              value={values.bodyComposition}
              onValueChange={(value) =>
                calculator.setValue('bodyComposition', value as YogaBodyComposition)
              }
              options={YOGA_BODY_COMPOSITIONS}
            />

            <SelectField
              label="Flexibility Level"
              value={values.flexibility}
              onValueChange={(value) =>
                calculator.setValue('flexibility', value as YogaFlexibility)
              }
              options={YOGA_FLEXIBILITIES}
            />

            <SelectField
              label="Breathing Focus"
              value={values.breathing}
              onValueChange={(value) =>
                calculator.setValue('breathing', value as YogaBreathing)
              }
              options={YOGA_BREATHING_OPTIONS}
            />
          </div>

          <div className={kitStyles.formActions}>
            <button
              className={clsx(kitStyles.button, kitStyles.buttonPrimary)}
              type="submit"
            >
              Calculate Calories
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
        title="Your Yoga Calorie Results"
        value={result ? `${result.calories} cal` : '--'}
        category={result ? 'Calories Burned' : '--'}
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
        <div className={styles.yogaStats}>
          <div className={styles.statItem}>
            <div className={styles.statLabel}>Session Duration</div>
            <div className={styles.statValue}>
              {result ? `${result.duration} minutes` : '-- minutes'}
            </div>
          </div>
          <div className={styles.statItem}>
            <div className={styles.statLabel}>Yoga Style</div>
            <div className={styles.statValue}>
              {result ? result.yogaStyleLabel : '--'}
            </div>
          </div>
          <div className={styles.statItem}>
            <div className={styles.statLabel}>Intensity</div>
            <div className={styles.statValue}>
              {result ? result.intensityLabel : '--'}
            </div>
          </div>
          <div className={styles.statItem}>
            <div className={styles.statLabel}>Calories per Minute</div>
            <div className={styles.statValue}>
              {result ? result.caloriesPerMinute : '--'}
            </div>
          </div>
          <div className={styles.statItem}>
            <div className={styles.statLabel}>Calories per Hour</div>
            <div className={styles.statValue}>
              {result ? result.caloriesPerHour : '--'}
            </div>
          </div>
          <div className={styles.statItem}>
            <div className={styles.statLabel}>Equivalent Walking</div>
            <div className={styles.statValue}>
              {result ? `${result.equivalentWalkingMinutes} minutes` : '-- minutes'}
            </div>
          </div>
        </div>

        <h3 className={sharedStyles.sectionTitle}>Calorie Burn Analysis</h3>
        <div className={styles.breakdownGrid}>
          <div className={styles.breakdownItem}>
            <div className={styles.breakdownLabel}>Base Metabolic Rate</div>
            <div className={styles.breakdownValue}>
              {result ? result.breakdown.baseCalories : '--'}
            </div>
            <div className={styles.breakdownPercent}>
              {result ? `${result.breakdown.basePercent}%` : '--%'}
            </div>
          </div>
          <div className={styles.breakdownItem}>
            <div className={styles.breakdownLabel}>Style Intensity</div>
            <div className={styles.breakdownValue}>
              {result ? result.breakdown.styleCalories : '--'}
            </div>
            <div className={styles.breakdownPercent}>
              {result ? `${result.breakdown.stylePercent}%` : '--%'}
            </div>
          </div>
          <div className={styles.breakdownItem}>
            <div className={styles.breakdownLabel}>Personal Factors</div>
            <div className={styles.breakdownValue}>
              {result ? result.breakdown.individualCalories : '--'}
            </div>
            <div className={styles.breakdownPercent}>
              {result ? `${result.breakdown.individualPercent}%` : '--%'}
            </div>
          </div>
        </div>

        <h3 className={sharedStyles.sectionTitle}>Yoga Style Comparisons</h3>
        <div className={styles.comparisonGrid}>
          {result?.comparisons.map((comparison) => (
            <div key={comparison.style} className={styles.comparisonItem}>
              <div className={styles.comparisonActivity}>
                {comparison.style}
              </div>
              <div className={styles.comparisonCalories}>
                {comparison.calories} cal
              </div>
              <div className={styles.comparisonDifference}>
                {comparison.diffText}
              </div>
            </div>
          ))}
        </div>

        <h3 className={sharedStyles.sectionTitle}>Wellness Benefits</h3>
        <div className={sharedStyles.recommendation}>
          {result ? result.recommendation : ''}
        </div>
      </ResultCard>
    </div>
  );
}
