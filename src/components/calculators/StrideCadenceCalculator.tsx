import {useId, type ReactNode} from 'react';
import clsx from 'clsx';
import {
  calculateStride,
  STRIDE_DISTANCES,
  STRIDE_EXPERIENCES,
  STRIDE_GOALS,
  STRIDE_INPUT_TYPES,
  validateStrideValues,
  type StrideDistance,
  type StrideExperience,
  type StrideGoal,
  type StrideHeightUnit,
  type StrideInputType,
  type StrideResult,
  type StrideValues,
} from '../../lib/calculators/strideCadence';
import type {ShareEnvironment} from '../../lib/calculators/share';
import {
  NumberField,
  PrintButton,
  ResultCard,
  ResultRow,
  SelectField,
  ShareButton,
  useCalculator,
} from './kit';
import kitStyles from './kit/CalculatorKit.module.css';
import sharedStyles from './ToolCalculator.module.css';
import styles from './StrideCadenceCalculator.module.css';

export type StrideCadenceCalculatorProps = {
  shareEnvironment?: ShareEnvironment;
  onPrint?: () => void;
};

const INITIAL_VALUES: StrideValues = {
  inputType: '',
  paceMinutes: '',
  paceSeconds: '',
  cadence: '',
  pace2Minutes: '',
  pace2Seconds: '',
  strideLength: '',
  cadence2: '',
  strideLength2: '',
  height: '',
  heightUnit: 'cm',
  heightPaceMinutes: '',
  heightPaceSeconds: '',
  experience: '',
  distance: '',
  goal: '',
};

export function StrideCadenceCalculator({
  shareEnvironment,
  onPrint,
}: StrideCadenceCalculatorProps): ReactNode {
  const formTitleId = useId();
  const calculator = useCalculator<StrideValues, StrideResult>({
    initialValues: INITIAL_VALUES,
    validate: validateStrideValues,
    calculate: calculateStride,
    getSharePayload: () => ({
      title: 'Stride Length & Cadence Calculator Results',
      text: 'Check out my running stride and cadence analysis at Sports Tools Hub!',
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
            Running Gait Analysis
          </h2>
        </div>
        <form className={kitStyles.form} onSubmit={calculator.submit} noValidate>
          <SelectField
            label="Input Type"
            value={values.inputType}
            onValueChange={(value) =>
              calculator.setValue('inputType', value as StrideInputType)
            }
            options={STRIDE_INPUT_TYPES}
            placeholder="Select input type"
            hint="Choose what measurements you have available"
            error={errors.inputType}
            required
          />

          {values.inputType === 'pace-cadence' ? (
            <div className={styles.fieldGroup}>
              <NumberField
                label="Running Pace Minutes (per km)"
                value={values.paceMinutes}
                onValueChange={(value) =>
                  calculator.setValue('paceMinutes', value)
                }
                hint="Your running pace (MM:SS per km)"
                error={errors.paceMinutes}
                placeholder="MM"
                min={0}
                max={20}
                step={1}
              />

              <NumberField
                label="Running Pace Seconds (per km)"
                value={values.paceSeconds}
                onValueChange={(value) =>
                  calculator.setValue('paceSeconds', value)
                }
                hint="Your running pace (MM:SS per km)"
                placeholder="SS"
                min={0}
                max={59}
                step={1}
              />

              <NumberField
                label="Cadence (steps per minute)"
                value={values.cadence}
                onValueChange={(value) => calculator.setValue('cadence', value)}
                hint="Steps per minute (count right foot steps x 2)"
                error={errors.cadence}
                placeholder="Enter cadence"
                min={120}
                max={220}
                step={1}
              />
            </div>
          ) : null}

          {values.inputType === 'pace-stride' ? (
            <div className={styles.fieldGroup}>
              <NumberField
                label="Running Pace Minutes (per km)"
                value={values.pace2Minutes}
                onValueChange={(value) =>
                  calculator.setValue('pace2Minutes', value)
                }
                hint="Your running pace (MM:SS per km)"
                error={errors.pace2Minutes}
                placeholder="MM"
                min={0}
                max={20}
                step={1}
              />

              <NumberField
                label="Running Pace Seconds (per km)"
                value={values.pace2Seconds}
                onValueChange={(value) =>
                  calculator.setValue('pace2Seconds', value)
                }
                hint="Your running pace (MM:SS per km)"
                placeholder="SS"
                min={0}
                max={59}
                step={1}
              />

              <NumberField
                label="Stride Length (cm)"
                value={values.strideLength}
                onValueChange={(value) =>
                  calculator.setValue('strideLength', value)
                }
                hint="Distance between consecutive foot contacts (cm)"
                error={errors.strideLength}
                placeholder="Enter stride length"
                min={50}
                max={300}
                step={1}
              />
            </div>
          ) : null}

          {values.inputType === 'cadence-stride' ? (
            <div className={styles.fieldGroup}>
              <NumberField
                label="Cadence (steps per minute)"
                value={values.cadence2}
                onValueChange={(value) => calculator.setValue('cadence2', value)}
                hint="Steps per minute (count right foot steps x 2)"
                error={errors.cadence2}
                placeholder="Enter cadence"
                min={120}
                max={220}
                step={1}
              />

              <NumberField
                label="Stride Length (cm)"
                value={values.strideLength2}
                onValueChange={(value) =>
                  calculator.setValue('strideLength2', value)
                }
                hint="Distance between consecutive foot contacts (cm)"
                error={errors.strideLength2}
                placeholder="Enter stride length"
                min={50}
                max={300}
                step={1}
              />
            </div>
          ) : null}

          {values.inputType === 'height-based' ? (
            <div className={styles.fieldGroup}>
              <NumberField
                label="Height"
                value={values.height}
                onValueChange={(value) => calculator.setValue('height', value)}
                hint="Your height for optimal calculations"
                error={errors.height}
                placeholder="Enter height"
                min={120}
                max={250}
                step={1}
              />

              <SelectField
                label="Height Unit"
                value={values.heightUnit}
                onValueChange={(value) =>
                  calculator.setValue('heightUnit', value as StrideHeightUnit)
                }
                options={[
                  {value: 'cm', label: 'cm'},
                  {value: 'feet', label: 'feet/inches'},
                ]}
                required
              />

              <NumberField
                label="Running Pace Minutes (per km)"
                value={values.heightPaceMinutes}
                onValueChange={(value) =>
                  calculator.setValue('heightPaceMinutes', value)
                }
                hint="Your running pace (MM:SS per km)"
                error={errors.heightPaceMinutes}
                placeholder="MM"
                min={0}
                max={20}
                step={1}
              />

              <NumberField
                label="Running Pace Seconds (per km)"
                value={values.heightPaceSeconds}
                onValueChange={(value) =>
                  calculator.setValue('heightPaceSeconds', value)
                }
                hint="Your running pace (MM:SS per km)"
                placeholder="SS"
                min={0}
                max={59}
                step={1}
              />
            </div>
          ) : null}

          <div className={styles.fieldGroup}>
            <SelectField
              label="Running Experience"
              value={values.experience}
              onValueChange={(value) =>
                calculator.setValue('experience', value as StrideExperience)
              }
              options={STRIDE_EXPERIENCES}
              placeholder="Select experience level"
              hint="Experience affects optimal cadence recommendations"
              error={errors.experience}
              required
            />

            <SelectField
              label="Typical Running Distance"
              value={values.distance}
              onValueChange={(value) =>
                calculator.setValue('distance', value as StrideDistance)
              }
              options={STRIDE_DISTANCES}
              placeholder="Select typical distance"
              hint="Primary distance affects optimal stride parameters"
              error={errors.distance}
              required
            />

            <SelectField
              label="Primary Running Goal"
              value={values.goal}
              onValueChange={(value) =>
                calculator.setValue('goal', value as StrideGoal)
              }
              options={STRIDE_GOALS}
              placeholder="Select goal"
              hint="Your main running objective"
              error={errors.goal}
              required
            />
          </div>

          <div className={kitStyles.formActions}>
            <button
              className={clsx(kitStyles.button, kitStyles.buttonPrimary)}
              type="submit"
            >
              Calculate Running Efficiency
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
        title="Running Efficiency Analysis"
        value={result ? `${result.efficiency.toFixed(0)}%` : '--'}
        category={result ? 'Running form efficiency' : '--'}
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
                <div className={styles.metricLabel}>Pace</div>
                <div className={styles.metricValue}>{result.pace}/km</div>
                <div className={styles.metricSublabel}>
                  {result.speed} km/h
                </div>
              </div>
              <div className={styles.metricItem}>
                <div className={styles.metricLabel}>Cadence</div>
                <div className={styles.metricValue}>
                  {result.cadence} spm
                </div>
                <div className={styles.metricSublabel}>
                  {result.cadenceStatus}
                </div>
              </div>
              <div className={styles.metricItem}>
                <div className={styles.metricLabel}>Stride Length</div>
                <div className={styles.metricValue}>
                  {result.strideLength.toFixed(1)} cm
                </div>
                <div className={styles.metricSublabel}>
                  {result.stepLength.toFixed(1)} cm step
                </div>
              </div>
              <div className={styles.metricItem}>
                <div className={styles.metricLabel}>Efficiency Score</div>
                <div className={styles.metricValue}>
                  {result.efficiency.toFixed(0)}%
                </div>
                <div className={styles.metricSublabel}>Running form efficiency</div>
              </div>
              <div className={styles.metricItem}>
                <div className={styles.metricLabel}>Ground Contact</div>
                <div className={styles.metricValue}>
                  {result.groundContactTime} ms
                </div>
                <div className={styles.metricSublabel}>Foot strike time</div>
              </div>
              <div className={styles.metricItem}>
                <div className={styles.metricLabel}>Vertical Oscillation</div>
                <div className={styles.metricValue}>
                  {result.verticalOscillation} cm
                </div>
                <div className={styles.metricSublabel}>Bounce height</div>
              </div>
              <div className={styles.metricItem}>
                <div className={styles.metricLabel}>Stride Angle</div>
                <div className={styles.metricValue}>
                  {result.strideAngle}&deg;
                </div>
                <div className={styles.metricSublabel}>Forward lean</div>
              </div>
              <div className={styles.metricItem}>
                <div className={styles.metricLabel}>Optimal Cadence</div>
                <div className={styles.metricValue}>
                  {result.optimalCadence} spm
                </div>
                <div className={styles.metricSublabel}>
                  {result.optimalCadenceRange[0]}-{result.optimalCadenceRange[1]}{' '}
                  range
                </div>
              </div>
            </div>

            <h3 className={sharedStyles.sectionTitle}>
              Running Efficiency Analysis
            </h3>
            <ResultRow
              label="Cadence Efficiency"
              value={`${result.cadenceEfficiency.toFixed(0)}%`}
            />
            <ResultRow
              label="Form Balance"
              value={result.overallBalance ? 'Excellent' : 'Needs Work'}
            />
            <ResultRow
              label="Overall Efficiency"
              value={`${result.efficiency.toFixed(0)}%`}
            />
            <ResultRow label="Stride Status" value={result.strideStatus} />

            <h3 className={sharedStyles.sectionTitle}>Biomechanical Metrics</h3>
            <ResultRow
              label="Ground Contact Time"
              value={`${result.groundContactTime}ms`}
            />
            <ResultRow
              label="Vertical Oscillation"
              value={`${result.verticalOscillation}cm`}
            />
            <ResultRow label="Stride Angle" value={`${result.strideAngle}°`} />
            <ResultRow
              label="Cadence Range"
              value={`${result.cadence} spm`}
            />

            <h3 className={sharedStyles.sectionTitle}>Running Insights</h3>
            {result.insights.length > 0 ? (
              <ul className={styles.list}>
                {result.insights.map((insight) => (
                  <li key={insight}>{insight}</li>
                ))}
              </ul>
            ) : (
              <p className={sharedStyles.empty}>
                No additional insights for this combination.
              </p>
            )}

            <h3 className={sharedStyles.sectionTitle}>
              Training Recommendations
            </h3>
            {result.recommendations.length > 0 ? (
              <ul className={styles.list}>
                {result.recommendations.map((recommendation) => (
                  <li key={recommendation}>{recommendation}</li>
                ))}
              </ul>
            ) : (
              <p className={sharedStyles.empty}>
                No specific recommendations for this combination.
              </p>
            )}
          </>
        ) : (
          <p className={sharedStyles.empty}>
            Choose an input type, enter your running data, then calculate to see
            your efficiency analysis.
          </p>
        )}
      </ResultCard>
    </div>
  );
}
