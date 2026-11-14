import {useId, type ReactNode} from 'react';
import clsx from 'clsx';
import {
  calculateTrainingLoad,
  TRAINING_EXPERIENCE_LEVELS,
  TRAINING_GOALS,
  TRAINING_LOAD_SPORTS,
  UPCOMING_EVENTS,
  validateTrainingLoadValues,
  type TrainingExperience,
  type TrainingGoal,
  type TrainingLoadResult,
  type TrainingLoadSport,
  type TrainingLoadValues,
  type UpcomingEvent,
} from '../../lib/calculators/trainingLoad';
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
import styles from './PerformanceBatch.module.css';

export type TrainingLoadCalculatorProps = {
  shareEnvironment?: ShareEnvironment;
  onPrint?: () => void;
};

const INITIAL_VALUES: TrainingLoadValues = {
  sport: '',
  currentCtl: '',
  currentAtl: '',
  todayTss: '',
  trainingGoal: '',
  experienceLevel: '',
  upcomingEvent: '',
};

export function TrainingLoadCalculator({
  shareEnvironment,
  onPrint,
}: TrainingLoadCalculatorProps): ReactNode {
  const formTitleId = useId();
  const calculator = useCalculator<TrainingLoadValues, TrainingLoadResult>({
    initialValues: INITIAL_VALUES,
    validate: validateTrainingLoadValues,
    calculate: calculateTrainingLoad,
    getSharePayload: (result) => ({
      title: 'Training Load Calculator Results',
      text: `My training stress balance is ${result.newTsb} (${result.tsbStatus.toLowerCase()}). Model your fatigue and form at Sports Tools Hub!`,
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
            Training Load Analysis
          </h2>
        </div>
        <form className={kitStyles.form} onSubmit={calculator.submit} noValidate>
          <SelectField
            label="Sport Type"
            value={values.sport}
            onValueChange={(value) =>
              calculator.setValue('sport', value as TrainingLoadSport)
            }
            options={TRAINING_LOAD_SPORTS}
            placeholder="Select sport"
            hint="Select your primary sport for accurate calculations"
            error={errors.sport}
            required
          />

          <NumberField
            label="Current CTL (Chronic Training Load)"
            value={values.currentCtl}
            onValueChange={(value) =>
              calculator.setValue('currentCtl', value)
            }
            hint="Your current fitness level (42-day average)"
            error={errors.currentCtl}
            placeholder="Enter current CTL"
            required
            min={0}
            max={200}
            step={1}
          />

          <NumberField
            label="Current ATL (Acute Training Load)"
            value={values.currentAtl}
            onValueChange={(value) =>
              calculator.setValue('currentAtl', value)
            }
            hint="Your current fatigue level (7-day average)"
            error={errors.currentAtl}
            placeholder="Enter current ATL"
            required
            min={0}
            max={200}
            step={1}
          />

          <NumberField
            label="Today's Training Stress Score (TSS)"
            value={values.todayTss}
            onValueChange={(value) => calculator.setValue('todayTss', value)}
            hint="Training stress score for today's workout"
            error={errors.todayTss}
            placeholder="Enter today's TSS"
            required
            min={0}
            max={500}
            step={1}
          />

          <SelectField
            label="Training Goal"
            value={values.trainingGoal}
            onValueChange={(value) =>
              calculator.setValue('trainingGoal', value as TrainingGoal)
            }
            options={TRAINING_GOALS}
            placeholder="Select training goal"
            hint="Your current training phase or goal"
            error={errors.trainingGoal}
            required
          />

          <SelectField
            label="Experience Level"
            value={values.experienceLevel}
            onValueChange={(value) =>
              calculator.setValue('experienceLevel', value as TrainingExperience)
            }
            options={TRAINING_EXPERIENCE_LEVELS}
            placeholder="Select experience level"
            hint="Your training experience affects optimal ranges"
            error={errors.experienceLevel}
            required
          />

          <SelectField
            label="Upcoming Event"
            value={values.upcomingEvent}
            onValueChange={(value) =>
              calculator.setValue('upcomingEvent', value as UpcomingEvent)
            }
            options={UPCOMING_EVENTS}
            placeholder="Select event type"
            hint="Important for TSB target recommendations"
            error={errors.upcomingEvent}
            required
          />

          <div className={kitStyles.formActions}>
            <button
              className={clsx(kitStyles.button, kitStyles.buttonPrimary)}
              type="submit"
            >
              Analyze Training Load
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
        title="Training Load Analysis Results"
        value={result ? result.newTsb : '--'}
        category={result ? result.tsbStatus : '--'}
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
                <div className={styles.metricLabel}>Current CTL</div>
                <div className={styles.metricValue}>{result.currentCtl}</div>
                <div className={styles.metricSublabel}>Fitness level</div>
              </div>
              <div className={styles.metricItem}>
                <div className={styles.metricLabel}>Current ATL</div>
                <div className={styles.metricValue}>{result.currentAtl}</div>
                <div className={styles.metricSublabel}>Fatigue level</div>
              </div>
              <div className={styles.metricItem}>
                <div className={styles.metricLabel}>Current TSB</div>
                <div className={styles.metricValue}>{result.currentTsb}</div>
                <div className={styles.metricSublabel}>Current form</div>
              </div>
              <div className={styles.metricItem}>
                <div className={styles.metricLabel}>Today's TSS</div>
                <div className={styles.metricValue}>{result.todayTss}</div>
                <div className={styles.metricSublabel}>Training stress</div>
              </div>
              <div className={styles.metricItem}>
                <div className={styles.metricLabel}>New CTL</div>
                <div className={styles.metricValue}>{result.newCtl}</div>
                <div className={styles.metricSublabel}>
                  +{result.fitnessChange}%
                </div>
              </div>
              <div className={styles.metricItem}>
                <div className={styles.metricLabel}>New ATL</div>
                <div className={styles.metricValue}>{result.newAtl}</div>
                <div className={styles.metricSublabel}>
                  +{result.fatigueChange}%
                </div>
              </div>
              <div className={styles.metricItem}>
                <div className={styles.metricLabel}>New TSB</div>
                <div className={styles.metricValue}>{result.newTsb}</div>
                <div className={styles.metricSublabel}>
                  {result.formChange}% change
                </div>
              </div>
              <div className={styles.metricItem}>
                <div className={styles.metricLabel}>Status</div>
                <div className={styles.metricValue}>{result.tsbStatus}</div>
                <div className={styles.metricSublabel}>Training readiness</div>
              </div>
            </div>

            <h3 className={sharedStyles.sectionTitle}>
              14-Day Training Load Projection
            </h3>
            <div className={styles.tableWrap}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th scope="col">Day</th>
                    <th scope="col">CTL (Fitness)</th>
                    <th scope="col">ATL (Fatigue)</th>
                    <th scope="col">TSB (Form)</th>
                  </tr>
                </thead>
                <tbody>
                  {result.projections.map((projection) => (
                    <tr key={projection.day}>
                      <td>{projection.day}</td>
                      <td>{projection.ctl}</td>
                      <td>{projection.atl}</td>
                      <td>{projection.tsb}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <h3 className={sharedStyles.sectionTitle}>
              Optimal Ranges for Your Experience Level
            </h3>
            <ResultRow
              label="CTL (Fitness)"
              value={`${result.optimalRanges.ctl[0]}-${result.optimalRanges.ctl[1]}`}
            />
            <ResultRow
              label="ATL (Fatigue)"
              value={`${result.optimalRanges.atl[0]}-${result.optimalRanges.atl[1]}`}
            />
            <ResultRow
              label="TSB (Form)"
              value={`${result.optimalRanges.tsb[0]} to ${result.optimalRanges.tsb[1]}`}
            />

            <h3 className={sharedStyles.sectionTitle}>Training Insights</h3>
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
          <ResultRow label="New TSB" value="--" />
        )}
      </ResultCard>
    </div>
  );
}
