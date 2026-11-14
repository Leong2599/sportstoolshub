import {useId, type ReactNode} from 'react';
import clsx from 'clsx';
import {
  calculateRaceStrategy,
  PACE_STRATEGIES,
  RACE_EXPERIENCE_LEVELS,
  RACE_GOALS,
  RACE_TEMPERATURE_UNITS,
  RACE_TYPES,
  RACE_WEIGHT_UNITS,
  validateRaceStrategyValues,
  type PaceStrategy,
  type RaceExperience,
  type RaceGoal,
  type RaceStrategyResult,
  type RaceStrategyValues,
  type RaceTemperatureUnit,
  type RaceType,
  type RaceWeightUnit,
} from '../../lib/calculators/raceStrategy';
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

export type RaceStrategyPlannerProps = {
  shareEnvironment?: ShareEnvironment;
  onPrint?: () => void;
};

const INITIAL_VALUES: RaceStrategyValues = {
  raceType: '',
  hours: '',
  minutes: '',
  seconds: '',
  experienceLevel: '',
  goalType: '',
  paceStrategy: '',
  bodyWeight: '',
  weightUnit: 'kg',
  temperature: '',
  temperatureUnit: 'celsius',
  humidity: '',
};

export function RaceStrategyPlanner({
  shareEnvironment,
  onPrint,
}: RaceStrategyPlannerProps): ReactNode {
  const formTitleId = useId();
  const calculator = useCalculator<RaceStrategyValues, RaceStrategyResult>({
    initialValues: INITIAL_VALUES,
    validate: validateRaceStrategyValues,
    calculate: calculateRaceStrategy,
    getSharePayload: (result) => ({
      title: 'Race Strategy Planner Results',
      text: `My ${result.raceType} target time is ${result.targetTime}. Plan your race at Sports Tools Hub!`,
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
            Race Strategy Planner
          </h2>
        </div>
        <form className={kitStyles.form} onSubmit={calculator.submit} noValidate>
          <SelectField
            label="Race Type"
            value={values.raceType}
            onValueChange={(value) =>
              calculator.setValue('raceType', value as RaceType)
            }
            options={RACE_TYPES}
            placeholder="Select race type"
            hint="Select your event distance and discipline"
            error={errors.raceType}
            required
          />

          <NumberField
            label="Target Finish Time Hours"
            value={values.hours}
            onValueChange={(value) => calculator.setValue('hours', value)}
            hint="Your target finish time (HH:MM:SS)"
            error={errors.hours}
            placeholder="HH"
            min={0}
            max={24}
            step={1}
          />

          <NumberField
            label="Target Finish Time Minutes"
            value={values.minutes}
            onValueChange={(value) => calculator.setValue('minutes', value)}
            hint="Your target finish time (HH:MM:SS)"
            placeholder="MM"
            min={0}
            max={59}
            step={1}
          />

          <NumberField
            label="Target Finish Time Seconds"
            value={values.seconds}
            onValueChange={(value) => calculator.setValue('seconds', value)}
            hint="Your target finish time (HH:MM:SS)"
            placeholder="SS"
            min={0}
            max={59}
            step={1}
          />

          <SelectField
            label="Experience Level"
            value={values.experienceLevel}
            onValueChange={(value) =>
              calculator.setValue('experienceLevel', value as RaceExperience)
            }
            options={RACE_EXPERIENCE_LEVELS}
            placeholder="Select experience level"
            hint="Your racing experience affects strategy recommendations"
            error={errors.experienceLevel}
            required
          />

          <SelectField
            label="Race Goal"
            value={values.goalType}
            onValueChange={(value) =>
              calculator.setValue('goalType', value as RaceGoal)
            }
            options={RACE_GOALS}
            placeholder="Select race goal"
            hint="Your primary goal for this race"
            error={errors.goalType}
            required
          />

          <SelectField
            label="Pacing Strategy"
            value={values.paceStrategy}
            onValueChange={(value) =>
              calculator.setValue('paceStrategy', value as PaceStrategy)
            }
            options={PACE_STRATEGIES}
            placeholder="Select pacing strategy"
            hint="How you want to distribute your effort"
            error={errors.paceStrategy}
            required
          />

          <UnitField
            label="Body Weight"
            value={values.bodyWeight}
            onValueChange={(value) => calculator.setValue('bodyWeight', value)}
            unit={values.weightUnit}
            onUnitChange={(unit) =>
              calculator.setValue('weightUnit', unit as RaceWeightUnit)
            }
            units={RACE_WEIGHT_UNITS}
            hint="For fueling calculations"
            error={errors.bodyWeight}
            placeholder="Enter body weight"
            required
            min={30}
            max={200}
            step={0.1}
          />

          <UnitField
            label="Expected Temperature"
            value={values.temperature}
            onValueChange={(value) => calculator.setValue('temperature', value)}
            unit={values.temperatureUnit}
            onUnitChange={(unit) =>
              calculator.setValue('temperatureUnit', unit as RaceTemperatureUnit)
            }
            units={RACE_TEMPERATURE_UNITS}
            hint="Expected race day temperature"
            error={errors.temperature}
            placeholder="Enter temperature"
            required
            min={-10}
            max={45}
            step={1}
          />

          <NumberField
            label="Expected Humidity (%)"
            value={values.humidity}
            onValueChange={(value) => calculator.setValue('humidity', value)}
            hint="Relative humidity affects fueling needs"
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
              Generate Strategy
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
        title="Race Strategy Overview"
        value={result ? result.targetTime : '--'}
        category={result ? result.raceType : '--'}
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
            <ResultRow label="Event" value={result.raceType} />
            <ResultRow label="Target Time" value={result.targetTime} />
            <ResultRow label="Target Pace" value={result.targetPaceDisplay} />
            <ResultRow
              label="Risk Level"
              value={result.environmentalAdjustments.riskLevel}
            />

            <h3 className={sharedStyles.sectionTitle}>Pacing Strategy</h3>
            <div className={styles.splitGrid}>
              {result.splitStrategy.map((split, index) => (
                <div key={`${split.name}-${index}`} className={styles.splitItem}>
                  <div className={styles.splitName}>{split.name}</div>
                  <div className={styles.splitTime}>
                    {formatSplitClock(split.time)}
                  </div>
                  <div className={styles.splitPercent}>
                    {split.percentage}% of race
                  </div>
                </div>
              ))}
            </div>

            {result.fuelingStrategy.fluids.length > 0 ? (
              <>
                <h3 className={sharedStyles.sectionTitle}>Fueling Timeline</h3>
                <div className={styles.splitGrid}>
                  <div className={styles.splitItem}>
                    <div className={styles.splitName}>Hydration</div>
                    {result.fuelingStrategy.fluids.map((item, index) => (
                      <div key={item.time} className={styles.splitPercent}>
                        {formatSplitClock(item.time * 60)} &middot; {item.description}
                      </div>
                    ))}
                  </div>
                  {result.fuelingStrategy.calories.length > 0 ? (
                    <div className={styles.splitItem}>
                      <div className={styles.splitName}>Calories</div>
                      {result.fuelingStrategy.calories.map((item) => (
                        <div key={item.time} className={styles.splitPercent}>
                          {formatSplitClock(item.time * 60)} &middot;{' '}
                          {item.description}
                        </div>
                      ))}
                    </div>
                  ) : null}
                  {result.fuelingStrategy.electrolytes.length > 0 ? (
                    <div className={styles.splitItem}>
                      <div className={styles.splitName}>Electrolytes</div>
                      {result.fuelingStrategy.electrolytes.map((item) => (
                        <div key={item.time} className={styles.splitPercent}>
                          {formatSplitClock(item.time * 60)} &middot;{' '}
                          {item.description}
                        </div>
                      ))}
                    </div>
                  ) : null}
                </div>
              </>
            ) : null}

            <h3 className={sharedStyles.sectionTitle}>
              Environmental Considerations
            </h3>
            <ResultRow
              label="Temperature"
              value={`${result.environmentalAdjustments.temperature}°C`}
            />
            <ResultRow
              label="Humidity"
              value={`${result.environmentalAdjustments.humidity}%`}
            />
            <ResultRow
              label="Pace Adjustment"
              value={`${result.environmentalAdjustments.paceAdjustment}s/km slower`}
            />
            <ResultRow
              label="Fluid Adjustment"
              value={`+${result.environmentalAdjustments.fluidAdjustment}% hydration`}
            />

            <h3 className={sharedStyles.sectionTitle}>Strategic Insights</h3>
            {result.insights.length > 0 ? (
              <ul className={styles.list}>
                {result.insights.map((insight) => (
                  <li key={insight}>{insight}</li>
                ))}
              </ul>
            ) : (
              <p className={sharedStyles.empty}>
                No additional insights for this race.
              </p>
            )}

            <h3 className={sharedStyles.sectionTitle}>
              Race Day Recommendations
            </h3>
            <ul className={styles.list}>
              {result.recommendations.map((recommendation) => (
                <li key={recommendation}>{recommendation}</li>
              ))}
            </ul>
          </>
        ) : (
          <ResultRow label="Target Time" value="--" />
        )}
      </ResultCard>
    </div>
  );
}

function formatSplitClock(seconds: number): string {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = Math.round(seconds % 60);

  if (hours > 0) {
    return `${hours}:${minutes.toString().padStart(2, '0')}:${secs
      .toString()
      .padStart(2, '0')}`;
  }

  return `${minutes}:${secs.toString().padStart(2, '0')}`;
}
