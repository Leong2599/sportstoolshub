import {useId, type ReactNode} from 'react';
import clsx from 'clsx';
import {
  calculateTennisMatchEnergy,
  TENNIS_DURATION_UNITS,
  TENNIS_INTENSITIES,
  TENNIS_PLAYING_STYLES,
  TENNIS_SURFACES,
  TENNIS_TEMPERATURE_UNITS,
  TENNIS_WEIGHT_UNITS,
  validateTennisMatchEnergyValues,
  type TennisDurationUnit,
  type TennisIntensity,
  type TennisMatchEnergyValues,
  type TennisPlayingStyle,
  type TennisSurface,
  type TennisTemperatureUnit,
  type TennisWeightUnit,
} from '../../lib/calculators/tennisMatchEnergy';
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
import styles from './TennisMatchEnergyCalculator.module.css';

export type TennisMatchEnergyCalculatorProps = {
  shareEnvironment?: ShareEnvironment;
  onPrint?: () => void;
};

const INITIAL_VALUES: TennisMatchEnergyValues = {
  matchDuration: '',
  durationUnit: 'minutes',
  bodyWeight: '',
  weightUnit: 'kg',
  playingStyle: '',
  surface: '',
  intensity: '',
  ralliesPerGame: '',
  temperature: '',
  temperatureUnit: 'celsius',
  humidity: '',
};

export function TennisMatchEnergyCalculator({
  shareEnvironment,
  onPrint,
}: TennisMatchEnergyCalculatorProps): ReactNode {
  const formTitleId = useId();
  const calculator = useCalculator<
    TennisMatchEnergyValues,
    ReturnType<typeof calculateTennisMatchEnergy>
  >({
    initialValues: INITIAL_VALUES,
    validate: validateTennisMatchEnergyValues,
    calculate: calculateTennisMatchEnergy,
    getSharePayload: (result) => ({
      title: 'Tennis Match Energy Calculator Results',
      text: `I burned ${result.totalCaloriesDisplay} calories during my tennis match. Calculate your match energy at Sports Tools Hub!`,
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
            Match Energy Analysis
          </h2>
        </div>
        <form className={kitStyles.form} onSubmit={calculator.submit} noValidate>
          <UnitField
            label="Match Duration"
            value={values.matchDuration}
            onValueChange={(value) =>
              calculator.setValue('matchDuration', value)
            }
            unit={values.durationUnit}
            onUnitChange={(unit) =>
              calculator.setValue('durationUnit', unit as TennisDurationUnit)
            }
            units={TENNIS_DURATION_UNITS}
            hint="Total time spent playing"
            error={errors.matchDuration}
            placeholder="Enter match duration"
            required
            min={1}
            max={600}
            step={1}
          />

          <UnitField
            label="Body Weight"
            value={values.bodyWeight}
            onValueChange={(value) => calculator.setValue('bodyWeight', value)}
            unit={values.weightUnit}
            onUnitChange={(unit) =>
              calculator.setValue('weightUnit', unit as TennisWeightUnit)
            }
            units={TENNIS_WEIGHT_UNITS}
            hint="Your current body weight"
            error={errors.bodyWeight}
            placeholder="Enter body weight"
            required
            min={30}
            max={200}
            step={0.1}
          />

          <SelectField
            label="Playing Style"
            value={values.playingStyle}
            onValueChange={(value) =>
              calculator.setValue('playingStyle', value as TennisPlayingStyle)
            }
            options={TENNIS_PLAYING_STYLES}
            placeholder="Select playing style"
            hint="Your primary playing style affects energy use"
            error={errors.playingStyle}
            required
          />

          <SelectField
            label="Court Surface"
            value={values.surface}
            onValueChange={(value) =>
              calculator.setValue('surface', value as TennisSurface)
            }
            options={TENNIS_SURFACES}
            placeholder="Select court surface"
            hint="Different surfaces require different energy levels"
            error={errors.surface}
            required
          />

          <SelectField
            label="Match Intensity"
            value={values.intensity}
            onValueChange={(value) =>
              calculator.setValue('intensity', value as TennisIntensity)
            }
            options={TENNIS_INTENSITIES}
            placeholder="Select intensity level"
            hint="Competitive intensity of the match"
            error={errors.intensity}
            required
          />

          <NumberField
            label="Average Rallies per Game"
            value={values.ralliesPerGame}
            onValueChange={(value) =>
              calculator.setValue('ralliesPerGame', value)
            }
            hint="Average number of shots in each rally"
            error={errors.ralliesPerGame}
            placeholder="Enter rallies per game"
            required
            min={1}
            max={100}
            step={0.5}
          />

          <UnitField
            label="Temperature"
            value={values.temperature}
            onValueChange={(value) => calculator.setValue('temperature', value)}
            unit={values.temperatureUnit}
            onUnitChange={(unit) =>
              calculator.setValue(
                'temperatureUnit',
                unit as TennisTemperatureUnit,
              )
            }
            units={TENNIS_TEMPERATURE_UNITS}
            hint="Environmental conditions affect energy expenditure"
            error={errors.temperature}
            placeholder="Enter temperature"
            required
            min={-10}
            max={50}
            step={1}
          />

          <NumberField
            label="Humidity (%)"
            value={values.humidity}
            onValueChange={(value) => calculator.setValue('humidity', value)}
            hint="Relative humidity during play"
            error={errors.humidity}
            placeholder="Enter humidity"
            required
            min={0}
            max={100}
            step={1}
          />

          <div className={kitStyles.formActions}>
            <button
              className={clsx(kitStyles.button, kitStyles.buttonPrimary)}
              type="submit"
            >
              Calculate Energy
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
        title="Match Energy Results"
        value={result ? `${result.totalCaloriesDisplay} cal` : '--'}
        category={result ? 'Kilocalories' : '--'}
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
                <div className={styles.metricLabel}>Total Calories Burned</div>
                <div className={styles.metricValue}>
                  {result.totalCaloriesDisplay}
                </div>
                <div className={styles.metricSublabel}>Kilocalories</div>
              </div>
              <div className={styles.metricItem}>
                <div className={styles.metricLabel}>Net Calories Burned</div>
                <div className={styles.metricValue}>
                  {result.netCaloriesDisplay}
                </div>
                <div className={styles.metricSublabel}>Above resting rate</div>
              </div>
              <div className={styles.metricItem}>
                <div className={styles.metricLabel}>Calories Per Minute</div>
                <div className={styles.metricValue}>
                  {result.caloriesPerMinuteDisplay}
                </div>
                <div className={styles.metricSublabel}>Energy density</div>
              </div>
              <div className={styles.metricItem}>
                <div className={styles.metricLabel}>MET Value</div>
                <div className={styles.metricValue}>
                  {result.metValueDisplay}
                </div>
                <div className={styles.metricSublabel}>Metabolic equivalent</div>
              </div>
              <div className={styles.metricItem}>
                <div className={styles.metricLabel}>Distance Covered</div>
                <div className={styles.metricValue}>
                  {result.distanceCoveredDisplay} km
                </div>
                <div className={styles.metricSublabel}>Court movement</div>
              </div>
              <div className={styles.metricItem}>
                <div className={styles.metricLabel}>Hydration Needs</div>
                <div className={styles.metricValue}>
                  {result.hydrationNeedsDisplay} ml
                </div>
                <div className={styles.metricSublabel}>Recommended intake</div>
              </div>
              <div className={styles.metricItem}>
                <div className={styles.metricLabel}>Recovery Time</div>
                <div className={styles.metricValue}>
                  {result.recoveryTime}
                </div>
                <div className={styles.metricSublabel}>Optimal recovery</div>
              </div>
              <div className={styles.metricItem}>
                <div className={styles.metricLabel}>Glycogen Used</div>
                <div className={styles.metricValue}>
                  {result.glycogenDepletionDisplay} g
                </div>
                <div className={styles.metricSublabel}>Carbohydrates burned</div>
              </div>
            </div>

            <h3 className={sharedStyles.sectionTitle}>
              Energy Expenditure Breakdown
            </h3>
            <div className={styles.breakdownGrid}>
              <div className={styles.breakdownItem}>
                <div className={styles.breakdownLabel}>
                  Active Play ({result.activePlayingTimeDisplay} min)
                </div>
                <div className={styles.breakdownValue}>
                  {Math.round(result.totalCalories * 0.7)} cal
                </div>
              </div>
              <div className={styles.breakdownItem}>
                <div className={styles.breakdownLabel}>Rest Periods</div>
                <div className={styles.breakdownValue}>
                  {Math.round(result.totalCalories * 0.3)} cal
                </div>
              </div>
            </div>

            <h3 className={sharedStyles.sectionTitle}>Recovery Needs Summary</h3>
            <ResultRow
              label="Electrolyte Loss"
              value={`${result.electrolyteLossDisplay} g`}
            />
            <ResultRow
              label="Energy Density"
              value={`${result.energyDensityDisplay} cal/min`}
            />

            <h3 className={sharedStyles.sectionTitle}>Match Insights</h3>
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
          <ResultRow label="Total Calories Burned" value="--" />
        )}
      </ResultCard>
    </div>
  );
}
