import {useId, type ReactNode} from 'react';
import clsx from 'clsx';
import {
  BADMINTON_DURATION_UNITS,
  BADMINTON_FORMATS,
  BADMINTON_OPPONENT_LEVELS,
  BADMINTON_PLAY_STYLES,
  calculateBadmintonRally,
  validateBadmintonRallyValues,
  type BadmintonDurationUnit,
  type BadmintonFormat,
  type BadmintonOpponentLevel,
  type BadmintonPlayStyle,
  type BadmintonRallyValues,
} from '../../lib/calculators/badmintonRallyIntensity';
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
import styles from './BadmintonRallyIntensityCalculator.module.css';

export type BadmintonRallyIntensityCalculatorProps = {
  shareEnvironment?: ShareEnvironment;
  onPrint?: () => void;
};

const INITIAL_VALUES: BadmintonRallyValues = {
  matchDuration: '',
  durationUnit: 'minutes',
  totalRallies: '',
  avgRallyShots: '',
  playingFormat: '',
  playStyle: '',
  opponentLevel: '',
  smashCount: '',
  netShots: '',
  clears: '',
};

export function BadmintonRallyIntensityCalculator({
  shareEnvironment,
  onPrint,
}: BadmintonRallyIntensityCalculatorProps): ReactNode {
  const formTitleId = useId();
  const calculator = useCalculator<
    BadmintonRallyValues,
    ReturnType<typeof calculateBadmintonRally>
  >({
    initialValues: INITIAL_VALUES,
    validate: validateBadmintonRallyValues,
    calculate: calculateBadmintonRally,
    getSharePayload: (result) => ({
      title: 'Badminton Rally Intensity Calculator Results',
      text: `My rally intensity score was ${result.intensityScoreDisplay} (${result.performanceRating}). Analyze your rally intensity at Sports Tools Hub!`,
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
            Rally Intensity Analysis
          </h2>
        </div>
        <form className={kitStyles.form} onSubmit={calculator.submit} noValidate>
          <UnitField
            label="Match/Game Duration"
            value={values.matchDuration}
            onValueChange={(value) =>
              calculator.setValue('matchDuration', value)
            }
            unit={values.durationUnit}
            onUnitChange={(unit) =>
              calculator.setValue('durationUnit', unit as BadmintonDurationUnit)
            }
            units={BADMINTON_DURATION_UNITS}
            hint="Total time played"
            error={errors.matchDuration}
            placeholder="Enter duration"
            required
            min={1}
            max={600}
            step={1}
          />

          <NumberField
            label="Total Rallies"
            value={values.totalRallies}
            onValueChange={(value) => calculator.setValue('totalRallies', value)}
            hint="Number of rallies played"
            error={errors.totalRallies}
            placeholder="Enter total rallies"
            required
            min={1}
            max={10000}
            step={1}
          />

          <NumberField
            label="Average Shots per Rally"
            value={values.avgRallyShots}
            onValueChange={(value) =>
              calculator.setValue('avgRallyShots', value)
            }
            hint="Average number of shots in each rally"
            error={errors.avgRallyShots}
            placeholder="Enter average shots per rally"
            required
            min={1}
            max={100}
            step={0.5}
          />

          <SelectField
            label="Playing Format"
            value={values.playingFormat}
            onValueChange={(value) =>
              calculator.setValue('playingFormat', value as BadmintonFormat)
            }
            options={BADMINTON_FORMATS}
            placeholder="Select format"
            hint="Format affects intensity and court coverage"
            error={errors.playingFormat}
            required
          />

          <SelectField
            label="Playing Style"
            value={values.playStyle}
            onValueChange={(value) =>
              calculator.setValue('playStyle', value as BadmintonPlayStyle)
            }
            options={BADMINTON_PLAY_STYLES}
            placeholder="Select playing style"
            hint="Your primary playing style"
            error={errors.playStyle}
            required
          />

          <SelectField
            label="Opponent Level"
            value={values.opponentLevel}
            onValueChange={(value) =>
              calculator.setValue(
                'opponentLevel',
                value as BadmintonOpponentLevel,
              )
            }
            options={BADMINTON_OPPONENT_LEVELS}
            placeholder="Select opponent level"
            hint="Level affects rally duration and intensity"
            error={errors.opponentLevel}
            required
          />

          <NumberField
            label="Number of Smashes"
            value={values.smashCount}
            onValueChange={(value) => calculator.setValue('smashCount', value)}
            hint="Total smash attempts in the match"
            error={errors.smashCount}
            placeholder="Enter smash count"
            required
            min={0}
            max={10000}
            step={1}
          />

          <NumberField
            label="Net Shot Count"
            value={values.netShots}
            onValueChange={(value) => calculator.setValue('netShots', value)}
            hint="Total net shots and drops attempted"
            error={errors.netShots}
            placeholder="Enter net shot count"
            required
            min={0}
            max={10000}
            step={1}
          />

          <NumberField
            label="Clear Count"
            value={values.clears}
            onValueChange={(value) => calculator.setValue('clears', value)}
            hint="Total clear shots played"
            error={errors.clears}
            placeholder="Enter clear count"
            required
            min={0}
            max={10000}
            step={1}
          />

          <div className={kitStyles.formActions}>
            <button
              className={clsx(kitStyles.button, kitStyles.buttonPrimary)}
              type="submit"
            >
              Analyze Rally Intensity
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
        title="Rally Intensity Results"
        value={result ? result.intensityScoreDisplay : '--'}
        category={result ? result.performanceRating : '--'}
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
                <div className={styles.metricLabel}>Intensity Score</div>
                <div className={styles.metricValue}>
                  {result.intensityScoreDisplay}
                </div>
                <div className={styles.metricSublabel}>
                  {result.performanceRating}
                </div>
              </div>
              <div className={styles.metricItem}>
                <div className={styles.metricLabel}>Rally Frequency</div>
                <div className={styles.metricValue}>
                  {result.rallyFrequencyDisplay}
                </div>
                <div className={styles.metricSublabel}>Per minute</div>
              </div>
              <div className={styles.metricItem}>
                <div className={styles.metricLabel}>Avg Rally Duration</div>
                <div className={styles.metricValue}>
                  {result.avgRallyDurationDisplay}s
                </div>
                <div className={styles.metricSublabel}>Seconds per rally</div>
              </div>
              <div className={styles.metricItem}>
                <div className={styles.metricLabel}>Shots per Minute</div>
                <div className={styles.metricValue}>
                  {result.shotsPerMinuteDisplay}
                </div>
                <div className={styles.metricSublabel}>Shot rate</div>
              </div>
              <div className={styles.metricItem}>
                <div className={styles.metricLabel}>Work Rate</div>
                <div className={styles.metricValue}>{result.workRateDisplay}</div>
                <div className={styles.metricSublabel}>Format adjusted</div>
              </div>
              <div className={styles.metricItem}>
                <div className={styles.metricLabel}>Tactical Diversity</div>
                <div className={styles.metricValue}>
                  {result.tacticalDiversityDisplay}
                </div>
                <div className={styles.metricSublabel}>Shot variety</div>
              </div>
              <div className={styles.metricItem}>
                <div className={styles.metricLabel}>Fatigue Factor</div>
                <div className={styles.metricValue}>
                  {result.fatigueFactorDisplay}
                </div>
                <div className={styles.metricSublabel}>Accumulated load</div>
              </div>
              <div className={styles.metricItem}>
                <div className={styles.metricLabel}>Performance Rating</div>
                <div className={styles.metricValue}>
                  {result.performanceRating}
                </div>
                <div className={styles.metricSublabel}>Overall assessment</div>
              </div>
            </div>

            <h3 className={sharedStyles.sectionTitle}>Shot Distribution</h3>
            <div className={styles.breakdownGrid}>
              <div className={styles.breakdownItem}>
                <div className={styles.breakdownLabel}>Smash</div>
                <div className={styles.breakdownValue}>
                  {result.smashPercentageDisplay}%
                </div>
              </div>
              <div className={styles.breakdownItem}>
                <div className={styles.breakdownLabel}>Net Play</div>
                <div className={styles.breakdownValue}>
                  {result.netPlayPercentageDisplay}%
                </div>
              </div>
              <div className={styles.breakdownItem}>
                <div className={styles.breakdownLabel}>Clear</div>
                <div className={styles.breakdownValue}>
                  {result.clearPercentageDisplay}%
                </div>
              </div>
            </div>

            <h3 className={sharedStyles.sectionTitle}>Rally Insights</h3>
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
          <ResultRow label="Intensity Score" value="--" />
        )}
      </ResultCard>
    </div>
  );
}
