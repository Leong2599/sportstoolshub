import {useId, type ReactNode} from 'react';
import clsx from 'clsx';
import {
  COMBAT_HEIGHT_UNITS,
  COMBAT_SPORTS,
  COMBAT_WEIGHT_UNITS,
  COMPETITION_LEVELS,
  FIGHT_STYLES,
  optimizeWeightClass,
  validateCombatValues,
  WEIGHT_CUT_HISTORY_OPTIONS,
  type CombatHeightUnit,
  type CombatResult,
  type CombatSport,
  type CombatValues,
  type CombatWeightUnit,
  type CompetitionLevel,
  type FightStyle,
  type WeightCutHistory,
} from '../../lib/calculators/combatWeightClass';
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

export type CombatWeightClassOptimizerProps = {
  shareEnvironment?: ShareEnvironment;
  onPrint?: () => void;
};

const INITIAL_VALUES: CombatValues = {
  sport: '',
  currentWeight: '',
  weightUnit: 'lbs',
  height: '',
  heightUnit: 'cm',
  bodyFat: '',
  experience: '',
  fightStyle: '',
  competitionLevel: '',
  age: '',
  cutHistory: '',
};

export function CombatWeightClassOptimizer({
  shareEnvironment,
  onPrint,
}: CombatWeightClassOptimizerProps): ReactNode {
  const formTitleId = useId();
  const calculator = useCalculator<CombatValues, CombatResult>({
    initialValues: INITIAL_VALUES,
    validate: validateCombatValues,
    calculate: optimizeWeightClass,
    getSharePayload: (result) => ({
      title: 'Combat Sports Weight Class Optimizer Results',
      text: `My recommended weight class is ${result.optimalClasses[0]?.name ?? result.currentClass} with ${result.healthRisk.toLowerCase()} health risk. Optimize your weight class at Sports Tools Hub!`,
      url: typeof window === 'undefined' ? undefined : window.location.href,
    }),
    shareEnvironment,
    onPrint,
  });
  const {values, errors, result} = calculator;
  const bestClass = result?.optimalClasses[0];

  return (
    <div className={sharedStyles.layout}>
      <section className={sharedStyles.card} aria-labelledby={formTitleId}>
        <div className={sharedStyles.cardHeader}>
          <h2 className={sharedStyles.cardTitle} id={formTitleId}>
            Weight Class Optimization
          </h2>
        </div>
        <form className={kitStyles.form} onSubmit={calculator.submit} noValidate>
          <SelectField
            label="Combat Sport"
            value={values.sport}
            onValueChange={(value) =>
              calculator.setValue('sport', value as CombatSport)
            }
            options={COMBAT_SPORTS}
            placeholder="Select combat sport"
            hint="Your primary combat discipline"
            error={errors.sport}
            required
          />

          <UnitField
            label="Current Body Weight"
            value={values.currentWeight}
            onValueChange={(value) =>
              calculator.setValue('currentWeight', value)
            }
            unit={values.weightUnit}
            onUnitChange={(unit) =>
              calculator.setValue('weightUnit', unit as CombatWeightUnit)
            }
            units={COMBAT_WEIGHT_UNITS}
            hint="Your current natural body weight"
            error={errors.currentWeight}
            placeholder="Enter body weight"
            required
            min={30}
            max={400}
            step={0.1}
          />

          <UnitField
            label="Height"
            value={values.height}
            onValueChange={(value) => calculator.setValue('height', value)}
            unit={values.heightUnit}
            onUnitChange={(unit) =>
              calculator.setValue('heightUnit', unit as CombatHeightUnit)
            }
            units={COMBAT_HEIGHT_UNITS}
            hint="Your height for reach advantage analysis"
            error={errors.height}
            placeholder="Enter height"
            required
            min={60}
            max={250}
            step={0.1}
          />

          <NumberField
            label="Body Fat Percentage"
            value={values.bodyFat}
            onValueChange={(value) => calculator.setValue('bodyFat', value)}
            hint="Current body fat percentage for weight cutting potential"
            error={errors.bodyFat}
            placeholder="Enter body fat percentage"
            required
            min={2}
            max={60}
            step={0.1}
          />

          <NumberField
            label="Years of Experience"
            value={values.experience}
            onValueChange={(value) => calculator.setValue('experience', value)}
            hint="Experience level affects competitive advantages"
            error={errors.experience}
            placeholder="Enter years of experience"
            required
            min={0}
            max={50}
            step={1}
          />

          <SelectField
            label="Fighting Style"
            value={values.fightStyle}
            onValueChange={(value) =>
              calculator.setValue('fightStyle', value as FightStyle)
            }
            options={FIGHT_STYLES}
            placeholder="Select fighting style"
            hint="Primary fighting approach and techniques"
            error={errors.fightStyle}
            required
          />

          <SelectField
            label="Competition Level"
            value={values.competitionLevel}
            onValueChange={(value) =>
              calculator.setValue(
                'competitionLevel',
                value as CompetitionLevel,
              )
            }
            options={COMPETITION_LEVELS}
            placeholder="Select level"
            hint="Current competitive tier"
            error={errors.competitionLevel}
            required
          />

          <NumberField
            label="Age"
            value={values.age}
            onValueChange={(value) => calculator.setValue('age', value)}
            hint="Age affects recovery and weight cutting ability"
            error={errors.age}
            placeholder="Enter your age"
            required
            min={12}
            max={70}
            step={1}
          />

          <SelectField
            label="Previous Weight Cut Experience"
            value={values.cutHistory}
            onValueChange={(value) =>
              calculator.setValue('cutHistory', value as WeightCutHistory)
            }
            options={WEIGHT_CUT_HISTORY_OPTIONS}
            placeholder="Select experience level"
            hint="Previous weight cutting experience"
            error={errors.cutHistory}
            required
          />

          <div className={kitStyles.formActions}>
            <button
              className={clsx(kitStyles.button, kitStyles.buttonPrimary)}
              type="submit"
            >
              Optimize Weight Class
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
        title="Weight Class Optimization Results"
        value={result ? `${result.currentWeight} lbs` : '--'}
        category={result ? `Current class: ${result.currentClass}` : '--'}
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
                <div className={styles.metricLabel}>Current Weight</div>
                <div className={styles.metricValue}>
                  {result.currentWeight} lbs
                </div>
                <div className={styles.metricSublabel}>
                  Current class: {result.currentClass}
                </div>
              </div>
              <div className={styles.metricItem}>
                <div className={styles.metricLabel}>Lean Mass</div>
                <div className={styles.metricValue}>
                  {result.leanMass} lbs
                </div>
                <div className={styles.metricSublabel}>
                  {(
                    (Number(result.leanMass) / Number(result.currentWeight)) *
                    100
                  ).toFixed(1)}
                  % of weight
                </div>
              </div>
              <div className={styles.metricItem}>
                <div className={styles.metricLabel}>Power-to-Weight</div>
                <div className={styles.metricValue}>
                  {result.powerToWeightRatio}
                </div>
                <div className={styles.metricSublabel}>Relative strength</div>
              </div>
              <div className={styles.metricItem}>
                <div className={styles.metricLabel}>Reach Advantage</div>
                <div className={styles.metricValue}>
                  {result.reachAdvantage}%
                </div>
                <div className={styles.metricSublabel}>Height advantage</div>
              </div>
              <div className={styles.metricItem}>
                <div className={styles.metricLabel}>Cutting Difficulty</div>
                <div className={styles.metricValue}>
                  {result.cuttingDifficulty}
                </div>
                <div className={styles.metricSublabel}>Difficulty level</div>
              </div>
              <div className={styles.metricItem}>
                <div className={styles.metricLabel}>Performance Impact</div>
                <div className={styles.metricValue}>
                  {result.performanceImpact}
                </div>
                <div className={styles.metricSublabel}>Expected effect</div>
              </div>
              <div className={styles.metricItem}>
                <div className={styles.metricLabel}>Health Risk</div>
                <div className={styles.metricValue}>{result.healthRisk}</div>
                <div className={styles.metricSublabel}>Risk assessment</div>
              </div>
              <div className={styles.metricItem}>
                <div className={styles.metricLabel}>Ideal Weight</div>
                <div className={styles.metricValue}>
                  {result.idealWeight} lbs
                </div>
                <div className={styles.metricSublabel}>Natural competition</div>
              </div>
            </div>

            <h3 className={sharedStyles.sectionTitle}>
              Recommended Weight Classes
            </h3>
            {result.optimalClasses.length > 0 ? (
              <div className={styles.classList}>
                {result.optimalClasses.map((weightClass, index) => (
                  <div
                    key={`${weightClass.name}-${index}`}
                    className={
                      index === 0
                        ? `${styles.classItem} ${styles.classPrimary}`
                        : styles.classItem
                    }
                  >
                    <div className={styles.className}>{weightClass.name}</div>
                    <div className={styles.classDetails}>
                      <span>{weightClass.weightRequired} lbs</span>
                      <span>-{weightClass.cutPercentage.toFixed(1)}% cut</span>
                      <span>
                        {weightClass.suitability.toFixed(0)}% suitable
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className={sharedStyles.empty}>
                No suitable weight class found for these inputs.
              </p>
            )}

            {bestClass ? (
              <>
                <h3 className={sharedStyles.sectionTitle}>
                  Performance Analysis
                </h3>
                <ResultRow
                  label="Strength Retention"
                  value={`${(100 - bestClass.cutPercentage).toFixed(0)}%`}
                />
                <ResultRow
                  label="Endurance Impact"
                  value={`${Math.min(100, bestClass.cutPercentage * 2).toFixed(0)}%`}
                />
                <ResultRow
                  label="Recovery Time"
                  value={`${Math.min(100, bestClass.cutPercentage * 3).toFixed(0)}%`}
                />
              </>
            ) : null}

            <h3 className={sharedStyles.sectionTitle}>Analysis Insights</h3>
            {result.insights.length > 0 ? (
              <ul className={styles.list}>
                {result.insights.map((insight) => (
                  <li key={insight}>{insight}</li>
                ))}
              </ul>
            ) : (
              <p className={sharedStyles.empty}>
                No additional insights for these inputs.
              </p>
            )}

            <h3 className={sharedStyles.sectionTitle}>
              Strategic Recommendations
            </h3>
            <ul className={styles.list}>
              {result.recommendations.map((recommendation) => (
                <li key={recommendation}>{recommendation}</li>
              ))}
            </ul>
          </>
        ) : (
          <ResultRow label="Current Weight" value="--" />
        )}
      </ResultCard>
    </div>
  );
}
