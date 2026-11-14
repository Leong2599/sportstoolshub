import {useId, type ReactNode} from 'react';
import clsx from 'clsx';
import {
  BOWLING_INTENSITIES,
  BOWLING_TYPES,
  calculateCricketWorkload,
  validateCricketWorkloadValues,
  type BowlingIntensity,
  type BowlingType,
  type CricketWorkloadValues,
} from '../../lib/calculators/cricketBowlingWorkload';
import type {ShareEnvironment} from '../../lib/calculators/share';
import {
  NumberField,
  ResultCard,
  ResultRow,
  SelectField,
  ShareButton,
  PrintButton,
  useCalculator,
} from './kit';
import kitStyles from './kit/CalculatorKit.module.css';
import sharedStyles from './ToolCalculator.module.css';
import styles from './CricketBowlingWorkloadCalculator.module.css';

export type CricketBowlingWorkloadCalculatorProps = {
  shareEnvironment?: ShareEnvironment;
  onPrint?: () => void;
};

const INITIAL_VALUES: CricketWorkloadValues = {
  bowlingType: '',
  ballsBowled: '',
  overs: '',
  sessionDuration: '',
  intensity: '',
  daysSinceLast: '',
  age: '',
  experience: '',
  recentWorkload: '',
};

export function CricketBowlingWorkloadCalculator({
  shareEnvironment,
  onPrint,
}: CricketBowlingWorkloadCalculatorProps): ReactNode {
  const formTitleId = useId();
  const calculator = useCalculator<
    CricketWorkloadValues,
    ReturnType<typeof calculateCricketWorkload>
  >({
    initialValues: INITIAL_VALUES,
    validate: validateCricketWorkloadValues,
    calculate: calculateCricketWorkload,
    getSharePayload: (result) => ({
      title: 'Cricket Bowling Workload Tracker Results',
      text: `My bowling workload score was ${result.workloadScoreDisplay} with ${result.injuryRisk.toLowerCase()} injury risk. Track your workload at Sports Tools Hub!`,
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
            Bowling Workload Tracker
          </h2>
        </div>
        <form className={kitStyles.form} onSubmit={calculator.submit} noValidate>
          <SelectField
            label="Bowling Type"
            value={values.bowlingType}
            onValueChange={(value) =>
              calculator.setValue('bowlingType', value as BowlingType)
            }
            options={BOWLING_TYPES}
            placeholder="Select bowling type"
            hint="Your primary bowling style"
            error={errors.bowlingType}
            required
          />

          <NumberField
            label="Balls Bowled"
            value={values.ballsBowled}
            onValueChange={(value) => calculator.setValue('ballsBowled', value)}
            hint="Total balls delivered in session"
            error={errors.ballsBowled}
            placeholder="Enter balls bowled"
            required
            min={0}
            max={500}
            step={1}
          />

          <NumberField
            label="Overs"
            value={values.overs}
            onValueChange={(value) => calculator.setValue('overs', value)}
            hint="Overs bowled (use decimal for partial overs)"
            error={errors.overs}
            placeholder="Enter overs"
            required
            min={0}
            max={60}
            step={0.1}
          />

          <NumberField
            label="Session Duration (minutes)"
            value={values.sessionDuration}
            onValueChange={(value) =>
              calculator.setValue('sessionDuration', value)
            }
            hint="Total time spent bowling"
            error={errors.sessionDuration}
            placeholder="Enter session duration"
            required
            min={1}
            max={600}
            step={1}
          />

          <SelectField
            label="Session Intensity"
            value={values.intensity}
            onValueChange={(value) =>
              calculator.setValue('intensity', value as BowlingIntensity)
            }
            options={BOWLING_INTENSITIES}
            placeholder="Select intensity level"
            hint="Peak bowling effort during session"
            error={errors.intensity}
            required
          />

          <NumberField
            label="Days Since Last Bowling"
            value={values.daysSinceLast}
            onValueChange={(value) =>
              calculator.setValue('daysSinceLast', value)
            }
            hint="Recovery time since previous session"
            error={errors.daysSinceLast}
            placeholder="Enter days since last session"
            required
            min={0}
            max={365}
            step={1}
          />

          <NumberField
            label="Age"
            value={values.age}
            onValueChange={(value) => calculator.setValue('age', value)}
            hint="Important for injury risk assessment"
            error={errors.age}
            placeholder="Enter your age"
            required
            min={10}
            max={60}
            step={1}
          />

          <NumberField
            label="Years of Experience"
            value={values.experience}
            onValueChange={(value) => calculator.setValue('experience', value)}
            hint="Bowling experience level"
            error={errors.experience}
            placeholder="Enter years of experience"
            required
            min={0}
            max={50}
            step={1}
          />

          <NumberField
            label="Recent 7-Day Workload (balls)"
            value={values.recentWorkload}
            onValueChange={(value) =>
              calculator.setValue('recentWorkload', value)
            }
            hint="Total balls bowled in past 7 days"
            error={errors.recentWorkload}
            placeholder="Enter recent workload"
            required
            min={0}
            max={5000}
            step={1}
          />

          <div className={kitStyles.formActions}>
            <button
              className={clsx(kitStyles.button, kitStyles.buttonPrimary)}
              type="submit"
            >
              Analyze Workload
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
        title="Bowling Workload Analysis"
        value={result ? result.workloadScoreDisplay : '--'}
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
                <div className={styles.metricLabel}>Workload Score</div>
                <div className={styles.metricValue}>
                  {result.workloadScoreDisplay}
                </div>
                <div className={styles.metricSublabel}>Arbitrary Units</div>
              </div>
              <div className={styles.metricItem}>
                <div className={styles.metricLabel}>Injury Risk</div>
                <div className={styles.metricValue}>{result.injuryRisk}</div>
                <div className={styles.metricSublabel}>Current assessment</div>
              </div>
              <div className={styles.metricItem}>
                <div className={styles.metricLabel}>Fatigue Level</div>
                <div className={styles.metricValue}>
                  {result.fatigueLevel}
                </div>
                <div className={styles.metricSublabel}>Physical status</div>
              </div>
              <div className={styles.metricItem}>
                <div className={styles.metricLabel}>Performance Readiness</div>
                <div className={styles.metricValue}>
                  {result.performanceReadinessDisplay}%
                </div>
                <div className={styles.metricSublabel}>Training readiness</div>
              </div>
              <div className={styles.metricItem}>
                <div className={styles.metricLabel}>Acute:Chronic Ratio</div>
                <div className={styles.metricValue}>
                  {result.acuteChronicRatioDisplay}
                </div>
                <div className={styles.metricSublabel}>Workload balance</div>
              </div>
              <div className={styles.metricItem}>
                <div className={styles.metricLabel}>Session Load</div>
                <div className={styles.metricValue}>
                  {result.workloadPercentageDisplay}%
                </div>
                <div className={styles.metricSublabel}>Of recommended max</div>
              </div>
              <div className={styles.metricItem}>
                <div className={styles.metricLabel}>Bowling Rate</div>
                <div className={styles.metricValue}>
                  {result.ballsPerOverDisplay}
                </div>
                <div className={styles.metricSublabel}>Balls per over</div>
              </div>
              <div className={styles.metricItem}>
                <div className={styles.metricLabel}>Recovery Time</div>
                <div className={styles.metricValue}>
                  {result.recoveryRecommendation}
                </div>
                <div className={styles.metricSublabel}>Recommended</div>
              </div>
            </div>

            <h3 className={sharedStyles.sectionTitle}>
              Acute:Chronic Workload Ratio
            </h3>
            <div className={styles.acwrScale}>
              <div className={styles.acwrZones}>
                <div className={styles.acwrZoneSafe}>0.8-1.3</div>
                <div className={styles.acwrZoneCaution}>1.3-1.5</div>
                <div className={styles.acwrZoneDanger}>&gt;1.5</div>
              </div>
              <p className={styles.acwrLabel}>
                Current: {result.acuteChronicRatioDisplay} (Optimal: 0.8-1.3)
              </p>
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
                No additional insights for this session.
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
          <ResultRow label="Workload Score" value="--" />
        )}
      </ResultCard>
    </div>
  );
}
