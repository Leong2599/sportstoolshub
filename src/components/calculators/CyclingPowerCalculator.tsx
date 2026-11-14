import {useId, type ReactNode} from 'react';
import clsx from 'clsx';
import {
  calculateCyclingPower,
  CYCLING_POWER_CALCULATION_TYPES,
  CYCLING_SPEED_UNITS,
  CYCLING_TEST_DURATIONS,
  validateCyclingPowerValues,
  type CyclingPowerCalculationType,
  type CyclingPowerResult,
  type CyclingPowerValues,
  type CyclingSpeedUnit,
} from '../../lib/calculators/cyclingPower';
import {WEIGHT_UNITS, type WeightUnit} from '../../lib/calculators/units';
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
import styles from './CyclingPowerCalculator.module.css';

export type CyclingPowerCalculatorProps = {
  shareEnvironment?: ShareEnvironment;
  onPrint?: () => void;
};

const INITIAL_VALUES: CyclingPowerValues = {
  calculationType: '',
  speed: '',
  speedUnit: 'kmh',
  totalWeight: '',
  weightUnit: 'kg',
  slope: '',
  wind: '',
  windUnit: 'kmh',
  testDuration: '20',
  avgPower: '',
  bodyWeight: '',
  bodyWeightUnit: 'kg',
  powerOutput: '',
  riderWeight: '',
  riderWeightUnit: 'kg',
};

export function CyclingPowerCalculator({
  shareEnvironment,
  onPrint,
}: CyclingPowerCalculatorProps): ReactNode {
  const formTitleId = useId();
  const calculator = useCalculator<CyclingPowerValues, CyclingPowerResult>({
    initialValues: INITIAL_VALUES,
    validate: validateCyclingPowerValues,
    calculate: calculateCyclingPower,
    getSharePayload: () => ({
      title: 'Cycling Power Calculator Results',
      text: 'Check out my cycling power calculations at Sports Tools Hub!',
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
            Calculate Your Cycling Power
          </h2>
        </div>
        <form className={kitStyles.form} onSubmit={calculator.submit} noValidate>
          <SelectField
            label="Calculation Type"
            value={values.calculationType}
            onValueChange={(value) =>
              calculator.setValue(
                'calculationType',
                value as CyclingPowerCalculationType,
              )
            }
            options={CYCLING_POWER_CALCULATION_TYPES}
            placeholder="Select calculation type"
            error={errors.calculationType}
            required
          />

          {values.calculationType === 'power-speed' ? (
            <div className={styles.fieldGroup}>
              <h3 className={styles.groupTitle}>Enter Your Ride Data</h3>

              <UnitField
                label="Speed"
                value={values.speed}
                onValueChange={(value) => calculator.setValue('speed', value)}
                unit={values.speedUnit}
                onUnitChange={(unit) =>
                  calculator.setValue('speedUnit', unit as CyclingSpeedUnit)
                }
                units={CYCLING_SPEED_UNITS}
                error={errors.speed}
                placeholder="Enter your speed"
                required
                min={1}
                step={0.1}
              />

              <UnitField
                label="Total Weight (Rider + Bike)"
                value={values.totalWeight}
                onValueChange={(value) =>
                  calculator.setValue('totalWeight', value)
                }
                unit={values.weightUnit}
                onUnitChange={(unit) =>
                  calculator.setValue('weightUnit', unit as WeightUnit)
                }
                units={WEIGHT_UNITS}
                error={errors.totalWeight}
                placeholder="Enter total weight"
                required
                min={30}
                step={0.1}
              />

              <NumberField
                label="Slope (%)"
                value={values.slope}
                onValueChange={(value) => calculator.setValue('slope', value)}
                hint="Grade of the road, positive is uphill"
                placeholder="Enter slope percentage"
                min={-20}
                max={20}
                step={0.1}
              />

              <UnitField
                label="Wind Speed"
                value={values.wind}
                onValueChange={(value) => calculator.setValue('wind', value)}
                unit={values.windUnit}
                onUnitChange={(unit) =>
                  calculator.setValue('windUnit', unit as CyclingSpeedUnit)
                }
                units={CYCLING_SPEED_UNITS}
                hint="Headwind adds load, tailwind reduces it"
                placeholder="Enter wind speed"
                min={-50}
                max={50}
                step={0.1}
              />
            </div>
          ) : null}

          {values.calculationType === 'ftp' ? (
            <div className={styles.fieldGroup}>
              <h3 className={styles.groupTitle}>Enter Your Test Data</h3>

              <SelectField
                label="Test Duration"
                value={values.testDuration}
                onValueChange={(value) =>
                  calculator.setValue('testDuration', value)
                }
                options={CYCLING_TEST_DURATIONS}
                required
              />

              <NumberField
                label="Average Power (Watts)"
                value={values.avgPower}
                onValueChange={(value) => calculator.setValue('avgPower', value)}
                error={errors.avgPower}
                placeholder="Enter average power"
                required
                min={50}
                max={500}
                step={1}
              />

              <UnitField
                label="Body Weight"
                value={values.bodyWeight}
                onValueChange={(value) =>
                  calculator.setValue('bodyWeight', value)
                }
                unit={values.bodyWeightUnit}
                onUnitChange={(unit) =>
                  calculator.setValue('bodyWeightUnit', unit as WeightUnit)
                }
                units={WEIGHT_UNITS}
                error={errors.bodyWeight}
                placeholder="Enter body weight"
                required
                min={30}
                step={0.1}
              />
            </div>
          ) : null}

          {values.calculationType === 'power-weight' ? (
            <div className={styles.fieldGroup}>
              <h3 className={styles.groupTitle}>Enter Your Power Data</h3>

              <NumberField
                label="Power Output (Watts)"
                value={values.powerOutput}
                onValueChange={(value) =>
                  calculator.setValue('powerOutput', value)
                }
                error={errors.powerOutput}
                placeholder="Enter power output"
                required
                min={50}
                max={500}
                step={1}
              />

              <UnitField
                label="Rider Weight"
                value={values.riderWeight}
                onValueChange={(value) =>
                  calculator.setValue('riderWeight', value)
                }
                unit={values.riderWeightUnit}
                onUnitChange={(unit) =>
                  calculator.setValue('riderWeightUnit', unit as WeightUnit)
                }
                units={WEIGHT_UNITS}
                error={errors.riderWeight}
                placeholder="Enter rider weight"
                required
                min={30}
                step={0.1}
              />
            </div>
          ) : null}

          <div className={kitStyles.formActions}>
            <button
              className={clsx(kitStyles.button, kitStyles.buttonPrimary)}
              type="submit"
            >
              Calculate Power
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
        title="Your Cycling Power Results"
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

            <h3 className={sharedStyles.sectionTitle}>Power Training Zones</h3>
            <div className={styles.zonesGrid}>
              {result.zones.map((zone) => (
                <div key={zone.name} className={styles.zone}>
                  <div className={styles.zoneHeader}>
                    <span className={styles.zoneName}>{zone.name}</span>
                    <span className={styles.zoneDescription}>
                      {zone.description}
                    </span>
                  </div>
                  <div className={styles.zoneRange}>{zone.range}</div>
                </div>
              ))}
            </div>

            <h3 className={sharedStyles.sectionTitle}>Training Recommendations</h3>
            <div className={sharedStyles.recommendation}>
              {result.recommendation}
            </div>
          </>
        ) : (
          <p className={sharedStyles.empty}>
            Choose a calculation type, enter your details, then calculate to see
            your power output.
          </p>
        )}
      </ResultCard>
    </div>
  );
}
