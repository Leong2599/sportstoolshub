import {useId, type ReactNode} from 'react';
import clsx from 'clsx';
import {
  calculateBasketballJump,
  JUMP_DISTANCE_UNITS,
  JUMP_GENDERS,
  JUMP_HEIGHT_UNITS,
  JUMP_WEIGHT_UNITS,
  validateBasketballJumpValues,
  type BasketballJumpValues,
  type JumpDistanceUnit,
  type JumpGender,
  type JumpHeightUnit,
  type JumpWeightUnit,
} from '../../lib/calculators/basketballJump';
import type {ShareEnvironment} from '../../lib/calculators/share';
import {
  NumberField,
  ResultCard,
  ResultRow,
  SelectField,
  ShareButton,
  PrintButton,
  UnitField,
  useCalculator,
} from './kit';
import kitStyles from './kit/CalculatorKit.module.css';
import sharedStyles from './ToolCalculator.module.css';
import styles from './BasketballJumpCalculator.module.css';

export type BasketballJumpCalculatorProps = {
  shareEnvironment?: ShareEnvironment;
  onPrint?: () => void;
};

const INITIAL_VALUES: BasketballJumpValues = {
  jumpHeight: '',
  jumpUnit: 'inches',
  bodyWeight: '',
  weightUnit: 'lbs',
  approachDistance: '',
  distanceUnit: 'feet',
  age: '',
  gender: '',
};

export function BasketballJumpCalculator({
  shareEnvironment,
  onPrint,
}: BasketballJumpCalculatorProps): ReactNode {
  const formTitleId = useId();
  const calculator = useCalculator<
    BasketballJumpValues,
    ReturnType<typeof calculateBasketballJump>
  >({
    initialValues: INITIAL_VALUES,
    validate: validateBasketballJumpValues,
    calculate: calculateBasketballJump,
    getSharePayload: (result) => ({
      title: 'Basketball Vertical Jump Analyzer Results',
      text: `My vertical jump is ${result.jumpHeightDisplay} inches (${result.rating}). Analyze your jump at Sports Tools Hub!`,
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
            Jump Analysis
          </h2>
        </div>
        <form className={kitStyles.form} onSubmit={calculator.submit} noValidate>
          <UnitField
            label="Vertical Jump Height"
            value={values.jumpHeight}
            onValueChange={(value) => calculator.setValue('jumpHeight', value)}
            unit={values.jumpUnit}
            onUnitChange={(unit) =>
              calculator.setValue('jumpUnit', unit as JumpHeightUnit)
            }
            units={JUMP_HEIGHT_UNITS}
            hint="Measure your maximum vertical jump reach"
            error={errors.jumpHeight}
            placeholder="Enter jump height"
            required
            min={0}
            max={60}
            step={0.1}
          />

          <UnitField
            label="Body Weight"
            value={values.bodyWeight}
            onValueChange={(value) => calculator.setValue('bodyWeight', value)}
            unit={values.weightUnit}
            onUnitChange={(unit) =>
              calculator.setValue('weightUnit', unit as JumpWeightUnit)
            }
            units={JUMP_WEIGHT_UNITS}
            hint="Your current body weight"
            error={errors.bodyWeight}
            placeholder="Enter body weight"
            required
            min={50}
            max={400}
            step={0.1}
          />

          <UnitField
            label="Approach Distance"
            value={values.approachDistance}
            onValueChange={(value) =>
              calculator.setValue('approachDistance', value)
            }
            unit={values.distanceUnit}
            onUnitChange={(unit) =>
              calculator.setValue('distanceUnit', unit as JumpDistanceUnit)
            }
            units={JUMP_DISTANCE_UNITS}
            hint="Distance of your run-up before jumping"
            error={errors.approachDistance}
            placeholder="Enter approach distance"
            required
            min={0}
            max={20}
            step={0.5}
          />

          <NumberField
            label="Age"
            value={values.age}
            onValueChange={(value) => calculator.setValue('age', value)}
            hint="Your age for performance comparison"
            error={errors.age}
            placeholder="Enter your age"
            required
            min={10}
            max={50}
            step={1}
          />

          <SelectField
            label="Gender"
            value={values.gender}
            onValueChange={(value) =>
              calculator.setValue('gender', value as JumpGender)
            }
            options={JUMP_GENDERS}
            placeholder="Select gender"
            hint="For percentile comparisons"
            error={errors.gender}
            required
          />

          <div className={kitStyles.formActions}>
            <button
              className={clsx(kitStyles.button, kitStyles.buttonPrimary)}
              type="submit"
            >
              Analyze Jump
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
        title="Jump Analysis Results"
        value={result ? `${result.jumpHeightDisplay} inches` : '--'}
        category={result ? result.rating : '--'}
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
            <div className={styles.metricsGrid}>
              <div className={styles.metricItem}>
                <div className={styles.metricLabel}>Jump Height</div>
                <div className={styles.metricValue}>
                  {result.jumpHeightDisplay} inches
                </div>
                <div className={styles.metricSublabel}>{result.rating}</div>
              </div>
              <div className={styles.metricItem}>
                <div className={styles.metricLabel}>Power Output</div>
                <div className={styles.metricValue}>
                  {result.powerOutputDisplay} watts
                </div>
                <div className={styles.metricSublabel}>Peak power</div>
              </div>
              <div className={styles.metricItem}>
                <div className={styles.metricLabel}>Force Generation</div>
                <div className={styles.metricValue}>
                  {result.forceGenerationDisplay} N
                </div>
                <div className={styles.metricSublabel}>Peak force</div>
              </div>
              <div className={styles.metricItem}>
                <div className={styles.metricLabel}>Performance</div>
                <div className={styles.metricValue}>
                  {result.percentile}th percentile
                </div>
                <div className={styles.metricSublabel}>Age/gender group</div>
              </div>
              <div className={styles.metricItem}>
                <div className={styles.metricLabel}>Approach Bonus</div>
                <div className={styles.metricValue}>
                  +{result.approachBonus.toFixed(1)}%
                </div>
                <div className={styles.metricSublabel}>Run-up advantage</div>
              </div>
            </div>

            <h3 className={sharedStyles.sectionTitle}>
              Training Recommendations
            </h3>
            <ul className={styles.list}>
              {result.recommendations.map((recommendation) => (
                <li key={recommendation}>{recommendation}</li>
              ))}
            </ul>
          </>
        ) : (
          <ResultRow label="Jump Height" value="--" />
        )}
      </ResultCard>
    </div>
  );
}
