import {useId, useMemo, type ReactNode} from 'react';
import clsx from 'clsx';
import {
  calculateGolf,
  GOLF_CALCULATION_TYPES,
  GOLF_SCORE_COUNT_OPTIONS,
  validateGolfValues,
  type GolfCalculationType,
  type GolfResult,
  type GolfValues,
} from '../../lib/calculators/golfHandicap';
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
import styles from './GolfHandicapCalculator.module.css';

export type GolfHandicapCalculatorProps = {
  shareEnvironment?: ShareEnvironment;
  onPrint?: () => void;
};

const INITIAL_VALUES: GolfValues = {
  calculationType: '',
  numScores: '3',
  scores: [],
  ratings: [],
  slopes: [],
  handicapIndex: '',
  courseRating: '',
  slopeRating: '',
  parScore: '',
  grossScore: '',
  courseHandicapInput: '',
};

export function GolfHandicapCalculator({
  shareEnvironment,
  onPrint,
}: GolfHandicapCalculatorProps): ReactNode {
  const formTitleId = useId();
  const calculator = useCalculator<GolfValues, GolfResult>({
    initialValues: INITIAL_VALUES,
    validate: validateGolfValues,
    calculate: calculateGolf,
    getSharePayload: () => ({
      title: 'Golf Handicap Calculator Results',
      text: `Check out my golf handicap calculations at Sports Tools Hub!`,
      url: typeof window === 'undefined' ? undefined : window.location.href,
    }),
    shareEnvironment,
    onPrint,
  });
  const {values, errors, result} = calculator;
  const numScores = Number.parseInt(values.numScores, 10) || 3;
  const scoreSlots = useMemo(
    () => Array.from({length: numScores}, (_, index) => index),
    [numScores],
  );

  function updateScore(
    index: number,
    key: 'scores' | 'ratings' | 'slopes',
    value: string,
  ): void {
    const next = [...values[key]];

    while (next.length <= index) {
      next.push('');
    }

    next[index] = value;
    calculator.setValue(key, next);
  }

  return (
    <div className={sharedStyles.layout}>
      <section className={sharedStyles.card} aria-labelledby={formTitleId}>
        <div className={sharedStyles.cardHeader}>
          <h2 className={sharedStyles.cardTitle} id={formTitleId}>
            Calculate Your Golf Handicap
          </h2>
        </div>
        <form className={kitStyles.form} onSubmit={calculator.submit} noValidate>
          <SelectField
            label="Calculation Type"
            value={values.calculationType}
            onValueChange={(value) =>
              calculator.setValue(
                'calculationType',
                value as GolfCalculationType,
              )
            }
            options={GOLF_CALCULATION_TYPES}
            placeholder="Select calculation type"
            hint="Choose what you want to calculate"
            error={errors.calculationType}
            required
          />

          {values.calculationType === 'handicap-index' ? (
            <div className={styles.fieldGroup}>
              <h3 className={styles.groupTitle}>Enter Your Recent Scores</h3>

              <SelectField
                label="Number of Scores"
                value={values.numScores}
                onValueChange={(value) =>
                  calculator.setValue('numScores', value)
                }
                options={GOLF_SCORE_COUNT_OPTIONS}
                required
              />

              {errors.scores ? (
                <p className={styles.error} role="alert">
                  {errors.scores}
                </p>
              ) : null}

              {scoreSlots.map((index) => (
                <div key={index} className={styles.scoreRow}>
                  <NumberField
                    label={`Score ${index + 1}`}
                    value={values.scores[index] ?? ''}
                    onValueChange={(value) =>
                      updateScore(index, 'scores', value)
                    }
                    placeholder="Score"
                    min={60}
                    max={150}
                    step={1}
                  />
                  <NumberField
                    label={`Course Rating ${index + 1}`}
                    value={values.ratings[index] ?? ''}
                    onValueChange={(value) =>
                      updateScore(index, 'ratings', value)
                    }
                    placeholder="Rating"
                    min={60}
                    max={80}
                    step={0.1}
                  />
                  <NumberField
                    label={`Slope Rating ${index + 1}`}
                    value={values.slopes[index] ?? ''}
                    onValueChange={(value) =>
                      updateScore(index, 'slopes', value)
                    }
                    placeholder="Slope"
                    min={55}
                    max={155}
                    step={1}
                  />
                </div>
              ))}
            </div>
          ) : null}

          {values.calculationType === 'course-handicap' ? (
            <div className={styles.fieldGroup}>
              <h3 className={styles.groupTitle}>Calculate Course Handicap</h3>

              <NumberField
                label="Your Handicap Index"
                value={values.handicapIndex}
                onValueChange={(value) =>
                  calculator.setValue('handicapIndex', value)
                }
                hint="Your current handicap index (e.g., 12.4)"
                error={errors.handicapIndex}
                placeholder="Enter handicap index"
                required
                min={-10}
                max={54}
                step={0.1}
              />

              <NumberField
                label="Course Rating"
                value={values.courseRating}
                onValueChange={(value) =>
                  calculator.setValue('courseRating', value)
                }
                hint="Course rating from the scorecard (e.g., 72.5)"
                placeholder="Enter course rating"
                required
                min={60}
                max={80}
                step={0.1}
              />

              <NumberField
                label="Slope Rating"
                value={values.slopeRating}
                onValueChange={(value) =>
                  calculator.setValue('slopeRating', value)
                }
                hint="Slope rating from the scorecard (e.g., 125)"
                placeholder="Enter slope rating"
                required
                min={55}
                max={155}
                step={1}
              />

              <NumberField
                label="Par for Course"
                value={values.parScore}
                onValueChange={(value) =>
                  calculator.setValue('parScore', value)
                }
                hint="Par score for the course (e.g., 72)"
                placeholder="Enter par"
                required
                min={60}
                max={80}
                step={1}
              />
            </div>
          ) : null}

          {values.calculationType === 'net-score' ? (
            <div className={styles.fieldGroup}>
              <h3 className={styles.groupTitle}>Calculate Net Score</h3>

              <NumberField
                label="Gross Score"
                value={values.grossScore}
                onValueChange={(value) =>
                  calculator.setValue('grossScore', value)
                }
                hint="Your actual score for the round"
                error={errors.grossScore}
                placeholder="Enter gross score"
                required
                min={60}
                max={150}
                step={1}
              />

              <NumberField
                label="Course Handicap"
                value={values.courseHandicapInput}
                onValueChange={(value) =>
                  calculator.setValue('courseHandicapInput', value)
                }
                hint="Your course handicap for this round"
                placeholder="Enter course handicap"
                required
                min={-10}
                max={54}
                step={1}
              />
            </div>
          ) : null}

          <div className={kitStyles.formActions}>
            <button
              className={clsx(kitStyles.button, kitStyles.buttonPrimary)}
              type="submit"
            >
              Calculate
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
        title="Your Handicap Results"
        value={result ? result.headline : '--'}
        category={result ? result.headlineLabel : '--'}
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
            {result.stats.map((stat) => (
              <ResultRow key={stat.label} label={stat.label} value={stat.value} />
            ))}

            {result.targetScore ? (
              <ResultRow label="Target Score" value={result.targetScore} />
            ) : null}

            {result.performance ? (
              <ResultRow label="Performance" value={result.performance} />
            ) : null}

            {result.breakdownRows.length > 0 ? (
              <>
                <h3 className={sharedStyles.sectionTitle}>Detailed Breakdown</h3>
                <div className={styles.tableWrap}>
                  <table className={styles.table}>
                    <thead>
                      <tr>
                        <th scope="col">Score</th>
                        <th scope="col">Rating</th>
                        <th scope="col">Slope</th>
                        <th scope="col">Differential</th>
                        <th scope="col">Used?</th>
                      </tr>
                    </thead>
                    <tbody>
                      {result.breakdownRows.map((row, index) => (
                        <tr key={`${row.score}-${index}`}>
                          <td>{row.score}</td>
                          <td>{row.rating}</td>
                          <td>{row.slope}</td>
                          <td>{row.differential.toFixed(1)}</td>
                          <td>{row.used ? '✓' : '-'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </>
            ) : null}

            {result.breakdownSteps.length > 0 ? (
              <>
                <h3 className={sharedStyles.sectionTitle}>Detailed Breakdown</h3>
                <div className={styles.steps}>
                  {result.breakdownSteps.map((step) => (
                    <div key={step.formula} className={styles.step}>
                      <div className={styles.stepFormula}>{step.formula}</div>
                      <div className={styles.stepCalculation}>
                        {step.calculation}
                      </div>
                    </div>
                  ))}
                </div>
              </>
            ) : null}

            <h3 className={sharedStyles.sectionTitle}>What Your Handicap Means</h3>
            <div className={sharedStyles.recommendation}>
              {result.recommendation}
            </div>
          </>
        ) : (
          <p className={sharedStyles.empty}>
            Choose a calculation type, enter your details, then calculate to
            see your handicap.
          </p>
        )}
      </ResultCard>
    </div>
  );
}
