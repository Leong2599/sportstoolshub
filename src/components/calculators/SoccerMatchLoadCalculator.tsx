import {useId, type ReactNode} from 'react';
import clsx from 'clsx';
import {
  calculateSoccerMatchLoad,
  SOCCER_DISTANCE_UNITS,
  SOCCER_POSITIONS,
  SOCCER_TEMPERATURE_UNITS,
  validateSoccerMatchLoadValues,
  type SoccerDistanceUnit,
  type SoccerMatchLoadValues,
  type SoccerPosition,
  type SoccerTemperatureUnit,
} from '../../lib/calculators/soccerMatchLoad';
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
import styles from './SoccerMatchLoadCalculator.module.css';

export type SoccerMatchLoadCalculatorProps = {
  shareEnvironment?: ShareEnvironment;
  onPrint?: () => void;
};

const INITIAL_VALUES: SoccerMatchLoadValues = {
  position: '',
  matchDuration: '',
  distance: '',
  distanceUnit: 'km',
  highIntensity: '',
  highIntensityUnit: 'km',
  sprints: '',
  rating: '',
  temperature: '',
  temperatureUnit: 'celsius',
};

export function SoccerMatchLoadCalculator({
  shareEnvironment,
  onPrint,
}: SoccerMatchLoadCalculatorProps): ReactNode {
  const formTitleId = useId();
  const calculator = useCalculator<
    SoccerMatchLoadValues,
    ReturnType<typeof calculateSoccerMatchLoad>
  >({
    initialValues: INITIAL_VALUES,
    validate: validateSoccerMatchLoadValues,
    calculate: calculateSoccerMatchLoad,
    getSharePayload: (result) => ({
      title: 'Soccer Match Load Calculator Results',
      text: `My match load was ${result.totalLoadDisplay} with a ${result.recoveryTime} recovery window. Analyze your match load at Sports Tools Hub!`,
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
            Match Analysis
          </h2>
        </div>
        <form className={kitStyles.form} onSubmit={calculator.submit} noValidate>
          <SelectField
            label="Playing Position"
            value={values.position}
            onValueChange={(value) =>
              calculator.setValue('position', value as SoccerPosition)
            }
            options={SOCCER_POSITIONS}
            placeholder="Select position"
            hint="Your primary position in the match"
            error={errors.position}
            required
          />

          <NumberField
            label="Minutes Played"
            value={values.matchDuration}
            onValueChange={(value) =>
              calculator.setValue('matchDuration', value)
            }
            hint="Total minutes played in the match"
            error={errors.matchDuration}
            placeholder="Enter minutes played"
            required
            min={1}
            max={120}
            step={1}
          />

          <UnitField
            label="Total Distance Covered"
            value={values.distance}
            onValueChange={(value) => calculator.setValue('distance', value)}
            unit={values.distanceUnit}
            onUnitChange={(unit) =>
              calculator.setValue('distanceUnit', unit as SoccerDistanceUnit)
            }
            units={SOCCER_DISTANCE_UNITS}
            hint="Total distance covered during the match"
            error={errors.distance}
            placeholder="Enter distance"
            required
            min={0}
            max={20}
            step={0.1}
          />

          <UnitField
            label="High-Intensity Distance"
            value={values.highIntensity}
            onValueChange={(value) =>
              calculator.setValue('highIntensity', value)
            }
            unit={values.highIntensityUnit}
            onUnitChange={(unit) =>
              calculator.setValue(
                'highIntensityUnit',
                unit as SoccerDistanceUnit,
              )
            }
            units={SOCCER_DISTANCE_UNITS}
            hint="Distance covered at high speed/sprinting"
            error={errors.highIntensity}
            placeholder="Enter high-intensity distance"
            required
            min={0}
            max={5}
            step={0.1}
          />

          <NumberField
            label="Number of Sprints"
            value={values.sprints}
            onValueChange={(value) => calculator.setValue('sprints', value)}
            hint="Total number of sprints performed"
            error={errors.sprints}
            placeholder="Enter number of sprints"
            required
            min={0}
            max={100}
            step={1}
          />

          <NumberField
            label="Match Rating (1-10)"
            value={values.rating}
            onValueChange={(value) => calculator.setValue('rating', value)}
            hint="Subjective rating of your performance"
            error={errors.rating}
            placeholder="Rate your performance"
            required
            min={1}
            max={10}
            step={0.5}
          />

          <UnitField
            label="Match Temperature"
            value={values.temperature}
            onValueChange={(value) => calculator.setValue('temperature', value)}
            unit={values.temperatureUnit}
            onUnitChange={(unit) =>
              calculator.setValue(
                'temperatureUnit',
                unit as SoccerTemperatureUnit,
              )
            }
            units={SOCCER_TEMPERATURE_UNITS}
            hint="Environmental conditions affect load"
            error={errors.temperature}
            placeholder="Enter temperature"
            required
            min={-10}
            max={45}
            step={1}
          />

          <div className={kitStyles.formActions}>
            <button
              className={clsx(kitStyles.button, kitStyles.buttonPrimary)}
              type="submit"
            >
              Calculate Match Load
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
        title="Match Load Analysis"
        value={result ? result.totalLoadDisplay : '--'}
        category={result ? 'Arbitrary Units' : '--'}
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
                <div className={styles.metricLabel}>Total Match Load</div>
                <div className={styles.metricValue}>
                  {result.totalLoadDisplay}
                </div>
                <div className={styles.metricSublabel}>Arbitrary Units</div>
              </div>
              <div className={styles.metricItem}>
                <div className={styles.metricLabel}>Performance Score</div>
                <div className={styles.metricValue}>
                  {result.performanceScore.toFixed(0)}%
                </div>
                <div className={styles.metricSublabel}>Position-adjusted</div>
              </div>
              <div className={styles.metricItem}>
                <div className={styles.metricLabel}>Distance per 90min</div>
                <div className={styles.metricValue}>
                  {result.distancePerMinuteDisplay} km
                </div>
                <div className={styles.metricSublabel}>Normalized</div>
              </div>
              <div className={styles.metricItem}>
                <div className={styles.metricLabel}>High-Intensity %</div>
                <div className={styles.metricValue}>
                  {result.highIntensityPercentageDisplay}%
                </div>
                <div className={styles.metricSublabel}>Of total distance</div>
              </div>
              <div className={styles.metricItem}>
                <div className={styles.metricLabel}>Sprint Frequency</div>
                <div className={styles.metricValue}>
                  {result.sprintFrequencyDisplay}
                </div>
                <div className={styles.metricSublabel}>Per 90min</div>
              </div>
              <div className={styles.metricItem}>
                <div className={styles.metricLabel}>Efficiency Rating</div>
                <div className={styles.metricValue}>
                  {result.efficiencyDisplay}%
                </div>
                <div className={styles.metricSublabel}>
                  Performance/Load ratio
                </div>
              </div>
              <div className={styles.metricItem}>
                <div className={styles.metricLabel}>Recovery Time</div>
                <div className={styles.metricValue}>
                  {result.recoveryTime}
                </div>
                <div className={styles.metricSublabel}>Recommended</div>
              </div>
              <div className={styles.metricItem}>
                <div className={styles.metricLabel}>Fatigue Risk</div>
                <div className={styles.metricValue}>
                  {result.fatigueRisk}
                </div>
                <div className={styles.metricSublabel}>Current status</div>
              </div>
            </div>

            <h3 className={sharedStyles.sectionTitle}>Position Comparison</h3>
            <div className={styles.comparisonGrid}>
              <div className={styles.comparisonItem}>
                <div className={styles.comparisonLabel}>
                  Distance vs Average
                </div>
                <div className={styles.comparisonValue}>
                  {result.comparison.distanceVsAverageDisplay}%
                </div>
              </div>
              <div className={styles.comparisonItem}>
                <div className={styles.comparisonLabel}>
                  High-Intensity vs Average
                </div>
                <div className={styles.comparisonValue}>
                  {result.comparison.highIntensityVsAverageDisplay}%
                </div>
              </div>
              <div className={styles.comparisonItem}>
                <div className={styles.comparisonLabel}>Sprints vs Average</div>
                <div className={styles.comparisonValue}>
                  {result.comparison.sprintsVsAverageDisplay}%
                </div>
              </div>
            </div>

            <h3 className={sharedStyles.sectionTitle}>Performance Insights</h3>
            {result.insights.length > 0 ? (
              <ul className={styles.list}>
                {result.insights.map((insight) => (
                  <li key={insight}>{insight}</li>
                ))}
              </ul>
            ) : (
              <p className={sharedStyles.empty}>
                No additional insights for this match.
              </p>
            )}

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
          <ResultRow label="Total Match Load" value="--" />
        )}
      </ResultCard>
    </div>
  );
}
