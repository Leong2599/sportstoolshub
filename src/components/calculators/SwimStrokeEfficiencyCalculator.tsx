import {useId, type ReactNode} from 'react';
import clsx from 'clsx';
import {
  calculateStrokeEfficiency,
  STROKE_DISTANCE_UNITS,
  STROKE_EXPERIENCES,
  STROKE_POOL_LENGTHS,
  STROKE_SWIMMER_TYPES,
  STROKE_TRAINING_GOALS,
  STROKE_TYPES,
  validateStrokeValues,
  type StrokeDistanceUnit,
  type StrokeExperience,
  type StrokePoolLength,
  type StrokeResult,
  type StrokeSwimmerType,
  type StrokeTrainingGoal,
  type StrokeType,
  type StrokeValues,
} from '../../lib/calculators/swimStrokeEfficiency';
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
import styles from './SwimStrokeEfficiencyCalculator.module.css';

export type SwimStrokeEfficiencyCalculatorProps = {
  shareEnvironment?: ShareEnvironment;
  onPrint?: () => void;
};

const INITIAL_VALUES: StrokeValues = {
  strokeType: '',
  poolLength: '',
  distance: '',
  distanceUnit: 'meters',
  timeMinutes: '',
  timeSeconds: '',
  strokeCount: '',
  experienceLevel: '',
  trainingGoal: '',
  swimmerType: '',
};

export function SwimStrokeEfficiencyCalculator({
  shareEnvironment,
  onPrint,
}: SwimStrokeEfficiencyCalculatorProps): ReactNode {
  const formTitleId = useId();
  const calculator = useCalculator<StrokeValues, StrokeResult>({
    initialValues: INITIAL_VALUES,
    validate: validateStrokeValues,
    calculate: calculateStrokeEfficiency,
    getSharePayload: () => ({
      title: 'Swimming Stroke Efficiency Calculator Results',
      text: 'Check out my swimming stroke efficiency analysis at Sports Tools Hub!',
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
            Stroke Analysis
          </h2>
        </div>
        <form className={kitStyles.form} onSubmit={calculator.submit} noValidate>
          <SelectField
            label="Stroke Type"
            value={values.strokeType}
            onValueChange={(value) =>
              calculator.setValue('strokeType', value as StrokeType)
            }
            options={STROKE_TYPES}
            placeholder="Select stroke type"
            hint="Your primary swimming stroke"
            error={errors.strokeType}
            required
          />

          <SelectField
            label="Pool Length"
            value={values.poolLength}
            onValueChange={(value) =>
              calculator.setValue('poolLength', value as StrokePoolLength)
            }
            options={STROKE_POOL_LENGTHS}
            placeholder="Select pool length"
            hint="Length of the pool you're swimming in"
            error={errors.poolLength}
            required
          />

          <NumberField
            label="Distance Swum"
            value={values.distance}
            onValueChange={(value) => calculator.setValue('distance', value)}
            hint="Total distance you swam"
            error={errors.distance}
            placeholder="Enter distance"
            required
            min={25}
            max={3000}
            step={25}
          />

          <SelectField
            label="Distance Unit"
            value={values.distanceUnit}
            onValueChange={(value) =>
              calculator.setValue('distanceUnit', value as StrokeDistanceUnit)
            }
            options={STROKE_DISTANCE_UNITS}
            required
          />

          <NumberField
            label="Total Time Minutes"
            value={values.timeMinutes}
            onValueChange={(value) => calculator.setValue('timeMinutes', value)}
            hint="Total time to complete the distance (MM:SS)"
            error={errors.timeMinutes}
            placeholder="MM"
            required
            min={0}
            max={60}
            step={1}
          />

          <NumberField
            label="Total Time Seconds"
            value={values.timeSeconds}
            onValueChange={(value) => calculator.setValue('timeSeconds', value)}
            hint="Total time to complete the distance (MM:SS)"
            placeholder="SS"
            required
            min={0}
            max={59}
            step={1}
          />

          <NumberField
            label="Total Stroke Count"
            value={values.strokeCount}
            onValueChange={(value) => calculator.setValue('strokeCount', value)}
            hint="Total number of strokes taken (count one arm for freestyle/backstroke, each stroke for breaststroke/butterfly)"
            error={errors.strokeCount}
            placeholder="Enter stroke count"
            required
            min={10}
            max={2000}
            step={1}
          />

          <SelectField
            label="Swimming Experience"
            value={values.experienceLevel}
            onValueChange={(value) =>
              calculator.setValue('experienceLevel', value as StrokeExperience)
            }
            options={STROKE_EXPERIENCES}
            placeholder="Select experience level"
            hint="Your swimming experience affects optimal metrics"
            error={errors.experienceLevel}
            required
          />

          <SelectField
            label="Training Goal"
            value={values.trainingGoal}
            onValueChange={(value) =>
              calculator.setValue('trainingGoal', value as StrokeTrainingGoal)
            }
            options={STROKE_TRAINING_GOALS}
            placeholder="Select training goal"
            hint="Your primary training objective"
            error={errors.trainingGoal}
            required
          />

          <SelectField
            label="Swimmer Type"
            value={values.swimmerType}
            onValueChange={(value) =>
              calculator.setValue('swimmerType', value as StrokeSwimmerType)
            }
            options={STROKE_SWIMMER_TYPES}
            placeholder="Select swimmer type"
            hint="Your swimming specialty affects optimal stroke parameters"
            error={errors.swimmerType}
            required
          />

          <div className={kitStyles.formActions}>
            <button
              className={clsx(kitStyles.button, kitStyles.buttonPrimary)}
              type="submit"
            >
              Calculate Stroke Efficiency
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
        title="Stroke Efficiency Results"
        value={result ? `${result.swolf}` : '--'}
        category={result ? 'SWOLF score' : '--'}
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
                <div className={styles.metricLabel}>SWOLF Score</div>
                <div className={styles.metricValue}>{result.swolf}</div>
                <div className={styles.metricSublabel}>
                  Time + Strokes per length
                </div>
              </div>
              <div className={styles.metricItem}>
                <div className={styles.metricLabel}>Pace</div>
                <div className={styles.metricValue}>
                  {result.pace}/100m
                </div>
                <div className={styles.metricSublabel}>
                  {result.speed} km/h
                </div>
              </div>
              <div className={styles.metricItem}>
                <div className={styles.metricLabel}>Stroke Rate</div>
                <div className={styles.metricValue}>
                  {result.strokeRate} spm
                </div>
                <div className={styles.metricSublabel}>Strokes per minute</div>
              </div>
              <div className={styles.metricItem}>
                <div className={styles.metricLabel}>Distance/Stroke</div>
                <div className={styles.metricValue}>
                  {result.distancePerStroke}m
                </div>
                <div className={styles.metricSublabel}>
                  {result.strokesPerLength} per length
                </div>
              </div>
              <div className={styles.metricItem}>
                <div className={styles.metricLabel}>Efficiency Index</div>
                <div className={styles.metricValue}>
                  {result.efficiencyIndex}%
                </div>
                <div className={styles.metricSublabel}>Technical efficiency</div>
              </div>
              <div className={styles.metricItem}>
                <div className={styles.metricLabel}>Performance Level</div>
                <div className={styles.metricValue}>
                  {result.performanceLevel}
                </div>
                <div className={styles.metricSublabel}>Overall assessment</div>
              </div>
              <div className={styles.metricItem}>
                <div className={styles.metricLabel}>Stroke Type</div>
                <div className={styles.metricValue}>
                  {result.strokeType.charAt(0).toUpperCase() +
                    result.strokeType.slice(1)}
                </div>
                <div className={styles.metricSublabel}>
                  {result.distance}m swum
                </div>
              </div>
              <div className={styles.metricItem}>
                <div className={styles.metricLabel}>Pool Length</div>
                <div className={styles.metricValue}>
                  {result.poolLength}m
                </div>
                <div className={styles.metricSublabel}>
                  {Math.round(result.distance / result.poolLength)} lengths
                </div>
              </div>
            </div>

            <h3 className={sharedStyles.sectionTitle}>Efficiency Analysis</h3>
            <ResultRow
              label="SWOLF Efficiency"
              value={`${Math.max(0, 100 - (result.swolf - 20) * 2).toFixed(0)}%`}
            />
            <ResultRow
              label="Stroke Rate Efficiency"
              value={`${Math.max(
                0,
                100 - Math.abs(result.strokeRate - 55) * 2,
              ).toFixed(0)}%`}
            />
            <ResultRow
              label="Distance Efficiency"
              value={`${Math.min(
                100,
                (Number(result.distancePerStroke) / 2.5) * 100,
              ).toFixed(0)}%`}
            />
            <ResultRow
              label="Overall Efficiency"
              value={`${result.efficiencyIndex}%`}
            />

            <h3 className={sharedStyles.sectionTitle}>
              Detailed Stroke Metrics
            </h3>
            <ResultRow label="Pace per 100m" value={result.pace} />
            <ResultRow
              label="Strokes per Length"
              value={`${result.strokesPerLength}`}
            />
            <ResultRow label="SWOLF Rating" value={`${result.swolf}`} />
            <ResultRow
              label="Efficiency"
              value={`${result.efficiencyIndex}%`}
            />
            <ResultRow
              label="Technical Efficiency"
              value={`${result.technicalEfficiency}%`}
            />

            <h3 className={sharedStyles.sectionTitle}>Improvement Areas</h3>
            {result.improvementAreas.length > 0 ? (
              <ul className={styles.list}>
                {result.improvementAreas.map((area) => (
                  <li key={area}>{area}</li>
                ))}
              </ul>
            ) : (
              <p className={sharedStyles.empty}>
                No specific improvement areas for this set.
              </p>
            )}

            <h3 className={sharedStyles.sectionTitle}>Swimming Insights</h3>
            {result.insights.length > 0 ? (
              <ul className={styles.list}>
                {result.insights.map((insight) => (
                  <li key={insight}>{insight}</li>
                ))}
              </ul>
            ) : (
              <p className={sharedStyles.empty}>
                No additional insights for this set.
              </p>
            )}

            <h3 className={sharedStyles.sectionTitle}>
              Training Recommendations
            </h3>
            {result.trainingRecommendations.length > 0 ? (
              <ul className={styles.list}>
                {result.trainingRecommendations.map((recommendation) => (
                  <li key={recommendation}>{recommendation}</li>
                ))}
              </ul>
            ) : (
              <p className={sharedStyles.empty}>
                No specific recommendations for this set.
              </p>
            )}
          </>
        ) : (
          <p className={sharedStyles.empty}>
            Enter your swimming data, then calculate to see detailed stroke
            efficiency analysis.
          </p>
        )}
      </ResultCard>
    </div>
  );
}
