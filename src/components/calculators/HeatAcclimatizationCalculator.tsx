import {useId, type ReactNode} from 'react';
import clsx from 'clsx';
import {
  calculateHeatAdjustments,
  HEAT_ACTIVITY_TYPES,
  HEAT_DURATION_UNITS,
  HEAT_INTENSITIES,
  HEAT_TEMPERATURE_UNITS,
  HEAT_WEIGHT_UNITS,
  validateHeatValues,
  type HeatActivityType,
  type HeatDurationUnit,
  type HeatIntensity,
  type HeatResult,
  type HeatTemperatureUnit,
  type HeatValues,
  type HeatWeightUnit,
} from '../../lib/calculators/heatAcclimatization';
import type {ShareEnvironment} from '../../lib/calculators/share';
import {
  NumberField,
  PrintButton,
  ResultCard,
  ResultRow,
  SelectField,
  ShareButton,
  UnitField,
  useCalculator,
} from './kit';
import kitStyles from './kit/CalculatorKit.module.css';
import sharedStyles from './ToolCalculator.module.css';
import styles from './PerformanceBatch.module.css';

export type HeatAcclimatizationCalculatorProps = {
  shareEnvironment?: ShareEnvironment;
  onPrint?: () => void;
};

const INITIAL_VALUES: HeatValues = {
  activityType: '',
  paceMinutes: '',
  paceSeconds: '',
  temperature: '',
  temperatureUnit: 'celsius',
  humidity: '',
  acclimationDays: '0',
  bodyWeight: '',
  weightUnit: 'kg',
  duration: '',
  durationUnit: 'minutes',
  intensity: '',
};

export function HeatAcclimatizationCalculator({
  shareEnvironment,
  onPrint,
}: HeatAcclimatizationCalculatorProps): ReactNode {
  const formTitleId = useId();
  const calculator = useCalculator<HeatValues, HeatResult>({
    initialValues: INITIAL_VALUES,
    validate: validateHeatValues,
    calculate: calculateHeatAdjustments,
    getSharePayload: (result) => ({
      title: 'Heat Acclimatization Calculator Results',
      text: `My adjusted pace in the heat is ${result.adjustedPace} with ${result.heatStressLevel.toLowerCase()} heat stress. Plan your heat training at Sports Tools Hub!`,
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
            Heat Acclimatization Calculator
          </h2>
        </div>
        <form className={kitStyles.form} onSubmit={calculator.submit} noValidate>
          <SelectField
            label="Activity Type"
            value={values.activityType}
            onValueChange={(value) =>
              calculator.setValue('activityType', value as HeatActivityType)
            }
            options={HEAT_ACTIVITY_TYPES}
            placeholder="Select activity"
            hint="Select your primary activity type"
            error={errors.activityType}
            required
          />

          <NumberField
            label="Normal Pace Minutes (per km)"
            value={values.paceMinutes}
            onValueChange={(value) =>
              calculator.setValue('paceMinutes', value)
            }
            hint="Your normal pace in cool conditions (MM:SS per km)"
            error={errors.paceMinutes}
            placeholder="MM"
            min={0}
            max={59}
            step={1}
          />

          <NumberField
            label="Normal Pace Seconds (per km)"
            value={values.paceSeconds}
            onValueChange={(value) =>
              calculator.setValue('paceSeconds', value)
            }
            hint="Your normal pace in cool conditions (MM:SS per km)"
            placeholder="SS"
            min={0}
            max={59}
            step={1}
          />

          <UnitField
            label="Current Temperature"
            value={values.temperature}
            onValueChange={(value) => calculator.setValue('temperature', value)}
            unit={values.temperatureUnit}
            onUnitChange={(unit) =>
              calculator.setValue('temperatureUnit', unit as HeatTemperatureUnit)
            }
            units={HEAT_TEMPERATURE_UNITS}
            hint="Expected temperature during activity"
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
            hint="Relative humidity (very important for heat stress)"
            error={errors.humidity}
            placeholder="Enter humidity"
            required
            min={0}
            max={100}
            step={1}
          />

          <NumberField
            label="Heat Acclimation Days"
            value={values.acclimationDays}
            onValueChange={(value) =>
              calculator.setValue('acclimationDays', value)
            }
            hint="Days you've been training in similar heat (0 if none)"
            error={errors.acclimationDays}
            placeholder="Enter days"
            required
            min={0}
            max={30}
            step={1}
          />

          <UnitField
            label="Body Weight"
            value={values.bodyWeight}
            onValueChange={(value) => calculator.setValue('bodyWeight', value)}
            unit={values.weightUnit}
            onUnitChange={(unit) =>
              calculator.setValue('weightUnit', unit as HeatWeightUnit)
            }
            units={HEAT_WEIGHT_UNITS}
            hint="For hydration calculations"
            error={errors.bodyWeight}
            placeholder="Enter body weight"
            required
            min={30}
            max={200}
            step={0.1}
          />

          <UnitField
            label="Activity Duration"
            value={values.duration}
            onValueChange={(value) => calculator.setValue('duration', value)}
            unit={values.durationUnit}
            onUnitChange={(unit) =>
              calculator.setValue('durationUnit', unit as HeatDurationUnit)
            }
            units={HEAT_DURATION_UNITS}
            hint="Expected duration of activity"
            error={errors.duration}
            placeholder="Enter duration"
            required
            min={15}
            max={480}
            step={5}
          />

          <SelectField
            label="Intensity Level"
            value={values.intensity}
            onValueChange={(value) =>
              calculator.setValue('intensity', value as HeatIntensity)
            }
            options={HEAT_INTENSITIES}
            placeholder="Select intensity"
            hint="Your planned intensity level"
            error={errors.intensity}
            required
          />

          <div className={kitStyles.formActions}>
            <button
              className={clsx(kitStyles.button, kitStyles.buttonPrimary)}
              type="submit"
            >
              Calculate Adjustments
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
        title="Heat Acclimatization Results"
        value={result ? result.adjustedPace : '--'}
        category={result ? result.heatStressLevel : '--'}
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
                <div className={styles.metricLabel}>Normal Pace</div>
                <div className={styles.metricValue}>{result.normalPace}</div>
                <div className={styles.metricSublabel}>Cool conditions</div>
              </div>
              <div className={styles.metricItem}>
                <div className={styles.metricLabel}>Adjusted Pace</div>
                <div className={styles.metricValue}>{result.adjustedPace}</div>
                <div className={styles.metricSublabel}>
                  +{result.paceAdjustment}s/km ({result.paceAdjustmentPercent}%)
                </div>
              </div>
              <div className={styles.metricItem}>
                <div className={styles.metricLabel}>Temperature</div>
                <div className={styles.metricValue}>{result.temperature}°C</div>
                <div className={styles.metricSublabel}>
                  Heat Index: {result.heatIndex}°C
                </div>
              </div>
              <div className={styles.metricItem}>
                <div className={styles.metricLabel}>Humidity</div>
                <div className={styles.metricValue}>{result.humidity}%</div>
                <div className={styles.metricSublabel}>
                  WBGT: {result.wetBulbGlobeTemp}°C
                </div>
              </div>
              <div className={styles.metricItem}>
                <div className={styles.metricLabel}>Heat Stress Level</div>
                <div className={styles.metricValue}>
                  {result.heatStressLevel}
                </div>
                <div className={styles.metricSublabel}>Overall risk assessment</div>
              </div>
              <div className={styles.metricItem}>
                <div className={styles.metricLabel}>Performance Impact</div>
                <div className={styles.metricValue}>
                  {result.performanceImpact}
                </div>
                <div className={styles.metricSublabel}>Effect on performance</div>
              </div>
              <div className={styles.metricItem}>
                <div className={styles.metricLabel}>Health Risk</div>
                <div className={styles.metricValue}>{result.riskAssessment}</div>
                <div className={styles.metricSublabel}>Medical concern level</div>
              </div>
              <div className={styles.metricItem}>
                <div className={styles.metricLabel}>Acclimation</div>
                <div className={styles.metricValue}>
                  {result.acclimationDays} days
                </div>
                <div className={styles.metricSublabel}>Heat adaptation level</div>
              </div>
            </div>

            <h3 className={sharedStyles.sectionTitle}>Hydration Strategy</h3>
            <ResultRow
              label="Total Fluid Needed"
              value={`${result.hydrationStrategy.totalFluid} ml`}
            />
            <ResultRow
              label="Fluid Rate"
              value={`${result.hydrationStrategy.fluidPerHour} ml/hour`}
            />
            <ResultRow
              label="Electrolytes Needed"
              value={`${result.hydrationStrategy.electrolytes} mg sodium`}
            />
            <ResultRow
              label="Electrolyte Rate"
              value={`${result.hydrationStrategy.electrolytesPerHour} mg/hour`}
            />

            <h3 className={sharedStyles.sectionTitle}>Acclimation Status</h3>
            <ResultRow
              label="Adaptation Progress"
              value={`Day ${result.acclimationDays} of 14 for full acclimation (${result.acclimatizationPercent}% complete)`}
            />
            <ResultRow
              label="Benefits Achieved"
              value={`${result.acclimatizationPercent}%`}
            />

            <h3 className={sharedStyles.sectionTitle}>Performance Insights</h3>
            {result.insights.length > 0 ? (
              <ul className={styles.list}>
                {result.insights.map((insight) => (
                  <li key={insight}>{insight}</li>
                ))}
              </ul>
            ) : (
              <p className={sharedStyles.empty}>
                No additional insights for these conditions.
              </p>
            )}

            <h3 className={sharedStyles.sectionTitle}>Safety Recommendations</h3>
            <ul className={styles.list}>
              {result.recommendations.map((recommendation) => (
                <li key={recommendation}>{recommendation}</li>
              ))}
            </ul>
          </>
        ) : (
          <ResultRow label="Adjusted Pace" value="--" />
        )}
      </ResultCard>
    </div>
  );
}
