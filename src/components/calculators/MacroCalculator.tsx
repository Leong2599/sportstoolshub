import {useId, type ReactNode} from 'react';
import clsx from 'clsx';
import {
  calculateMacros,
  MACRO_ACTIVITIES,
  MACRO_DIETS,
  MACRO_GOALS,
  MACRO_METHODS,
  validateMacroValues,
  type MacroCalculationMethod,
  type MacroDiet,
  type MacroGoal,
  type MacroResult,
  type MacroValues,
} from '../../lib/calculators/macro';
import {HEIGHT_UNITS, WEIGHT_UNITS} from '../../lib/calculators/units';
import type {ShareEnvironment} from '../../lib/calculators/share';
import {
  ChoiceField,
  NumberField,
  PrintButton,
  ResultCard,
  SelectField,
  ShareButton,
  UnitField,
  useCalculator,
  type ChoiceOption,
} from './kit';
import kitStyles from './kit/CalculatorKit.module.css';
import sharedStyles from './ToolCalculator.module.css';
import styles from './NutritionBatch.module.css';

export type MacroCalculatorProps = {
  shareEnvironment?: ShareEnvironment;
  onPrint?: () => void;
};

const INITIAL_VALUES: MacroValues = {
  calculationMethod: '',
  weight: '',
  weightUnit: 'kg',
  height: '',
  heightUnit: 'cm',
  inches: '',
  age: '',
  gender: '',
  activityLevel: '',
  dailyCalories: '',
  fitnessGoal: '',
  customProtein: '',
  customCarbs: '',
  customFats: '',
  dietPreference: 'standard',
};

const GENDER_OPTIONS: readonly {value: 'male' | 'female'; label: string}[] = [
  {value: 'male', label: 'Male'},
  {value: 'female', label: 'Female'},
] as const;

export function MacroCalculator({
  shareEnvironment,
  onPrint,
}: MacroCalculatorProps): ReactNode {
  const formTitleId = useId();
  const calculator = useCalculator<MacroValues, MacroResult>({
    initialValues: INITIAL_VALUES,
    validate: validateMacroValues,
    calculate: calculateMacros,
    getSharePayload: (result) => ({
      title: 'Macro Calculator Results',
      text: `My daily macros are ${result.display}: P:${result.macros.protein.grams}g, C:${result.macros.carbs.grams}g, F:${result.macros.fats.grams}g. Calculate yours at Sports Tools Hub!`,
      url: typeof window === 'undefined' ? undefined : window.location.href,
    }),
    shareEnvironment,
    onPrint,
  });
  const {values, errors, result} = calculator;
  const usingFeet = values.heightUnit === 'ft';
  const usingTdee = values.calculationMethod === 'tdee';
  const usingCustomRatios = values.fitnessGoal === 'custom';

  return (
    <div className={sharedStyles.layout}>
      <section className={sharedStyles.card} aria-labelledby={formTitleId}>
        <div className={sharedStyles.cardHeader}>
          <h2 className={sharedStyles.cardTitle} id={formTitleId}>
            Calculate Your Daily Macronutrients
          </h2>
        </div>
        <form className={kitStyles.form} onSubmit={calculator.submit} noValidate>
          <SelectField
            label="Calculation Method"
            value={values.calculationMethod}
            onValueChange={(value) =>
              calculator.setValue(
                'calculationMethod',
                value as MacroCalculationMethod,
              )
            }
            options={MACRO_METHODS}
            placeholder="Select calculation method"
            error={errors.calculationMethod}
            required
          />

          {usingTdee ? (
            <div className={styles.fieldGroup}>
              <h3 className={styles.groupTitle}>Enter Your Details</h3>

              <UnitField
                label="Body Weight"
                value={values.weight}
                onValueChange={(value) => calculator.setValue('weight', value)}
                unit={values.weightUnit}
                onUnitChange={(unit) => calculator.setValue('weightUnit', unit)}
                units={WEIGHT_UNITS}
                error={errors.weight}
                placeholder="Enter your weight"
                required
                min={30}
                step={0.1}
              />

              <UnitField
                label="Height"
                value={values.height}
                onValueChange={(value) => calculator.setValue('height', value)}
                unit={values.heightUnit}
                onUnitChange={(unit) => calculator.setValue('heightUnit', unit)}
                units={HEIGHT_UNITS}
                hint="Enter your height"
                error={errors.height}
                primaryLabel={usingFeet ? 'Feet' : 'Height'}
                placeholder={usingFeet ? 'ft' : 'cm'}
                required
                min={usingFeet ? 1 : 50}
                max={usingFeet ? 9 : 300}
                step={0.1}
                secondary={
                  usingFeet
                    ? {
                        label: 'Inches',
                        value: values.inches,
                        onValueChange: (value) =>
                          calculator.setValue('inches', value),
                        placeholder: 'in',
                        min: 0,
                        max: 11,
                        step: 1,
                        required: true,
                      }
                    : undefined
                }
              />

              <NumberField
                label="Age"
                value={values.age}
                onValueChange={(value) => calculator.setValue('age', value)}
                hint="Enter your age in years"
                error={errors.age}
                placeholder="Enter your age"
                required
                min={15}
                max={100}
                step={1}
              />

              <ChoiceField
                legend="Gender"
                value={values.gender}
                onValueChange={(value) => calculator.setValue('gender', value)}
                options={
                  GENDER_OPTIONS as readonly ChoiceOption<'male' | 'female'>[]
                }
                error={errors.gender}
                required
              />

              <SelectField
                label="Activity Level"
                value={values.activityLevel}
                onValueChange={(value) =>
                  calculator.setValue('activityLevel', value as MacroValues['activityLevel'])
                }
                options={MACRO_ACTIVITIES}
                placeholder="Select activity level"
                error={errors.activityLevel}
                required
              />
            </div>
          ) : null}

          {values.calculationMethod === 'manual' ? (
            <div className={styles.fieldGroup}>
              <h3 className={styles.groupTitle}>Enter Your Calorie Target</h3>
              <NumberField
                label="Daily Calorie Target"
                value={values.dailyCalories}
                onValueChange={(value) =>
                  calculator.setValue('dailyCalories', value)
                }
                error={errors.dailyCalories}
                placeholder="Enter your daily calorie target"
                required
                min={800}
                max={5000}
                step={1}
              />
            </div>
          ) : null}

          <SelectField
            label="Fitness Goal"
            value={values.fitnessGoal}
            onValueChange={(value) =>
              calculator.setValue('fitnessGoal', value as MacroGoal)
            }
            options={MACRO_GOALS}
            placeholder="Select your fitness goal"
            error={errors.fitnessGoal}
            required
          />

          {usingCustomRatios ? (
            <div className={styles.fieldGroup}>
              <h3 className={styles.groupTitle}>Custom Macro Ratios</h3>
              <NumberField
                label="Protein Percentage (%)"
                value={values.customProtein}
                onValueChange={(value) =>
                  calculator.setValue('customProtein', value)
                }
                error={errors.customProtein}
                placeholder="Enter protein percentage"
                required
                min={5}
                max={50}
                step={1}
              />
              <NumberField
                label="Carbohydrates Percentage (%)"
                value={values.customCarbs}
                onValueChange={(value) =>
                  calculator.setValue('customCarbs', value)
                }
                error={errors.customCarbs}
                placeholder="Enter carbs percentage"
                required
                min={5}
                max={70}
                step={1}
              />
              <NumberField
                label="Fat Percentage (%)"
                value={values.customFats}
                onValueChange={(value) =>
                  calculator.setValue('customFats', value)
                }
                error={errors.customFats}
                placeholder="Enter fat percentage"
                required
                min={5}
                max={60}
                step={1}
              />
            </div>
          ) : null}

          <SelectField
            label="Diet Preference"
            value={values.dietPreference}
            onValueChange={(value) =>
              calculator.setValue('dietPreference', value as MacroDiet)
            }
            options={MACRO_DIETS}
            error={errors.dietPreference}
          />

          <div className={kitStyles.formActions}>
            <button
              className={clsx(kitStyles.button, kitStyles.buttonPrimary)}
              type="submit"
            >
              Calculate Macros
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
        title="Your Macronutrient Results"
        value={result ? result.display : '--'}
        category="calories per day"
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
        <h3 className={sharedStyles.sectionTitle}>
          Macronutrient Breakdown
        </h3>
        <div className={styles.macroGrid}>
          {(
            [
              ['Protein', result?.macros.protein],
              ['Carbs', result?.macros.carbs],
              ['Fats', result?.macros.fats],
            ] as const
          ).map(([label, macro]) => (
            <div className={styles.macroCard} key={label}>
              <div className={styles.macroLabel}>{label}</div>
              <div className={styles.macroGrams}>
                {macro ? `${macro.grams}g` : '--g'}
              </div>
              <div className={styles.macroCalories}>
                {macro ? `${macro.calories} cal` : '-- cal'}
              </div>
              <div className={styles.macroPercent}>
                {macro ? `${macro.percentage}%` : '--%'}
              </div>
              <div className={styles.macroBar}>
                <div
                  className={styles.macroBarFill}
                  style={{width: `${macro?.percentage ?? 0}%`}}
                />
              </div>
            </div>
          ))}
        </div>

        <h3 className={sharedStyles.sectionTitle}>
          Suggested Meal Distribution
        </h3>
        <div className={styles.mealGrid}>
          {(result?.mealPlan ?? []).map((meal) => (
            <div className={styles.mealCard} key={meal.name}>
              <div className={styles.mealName}>{meal.name}</div>
              <div className={styles.mealMacros}>
                <span>P: {meal.protein}g</span>
                <span>C: {meal.carbs}g</span>
                <span>F: {meal.fats}g</span>
              </div>
            </div>
          ))}
        </div>

        <h3 className={sharedStyles.sectionTitle}>
          Food Sources Recommendations
        </h3>
        <div className={styles.sourceGrid}>
          {(result?.foodSources ?? []).map((source) => (
            <div className={styles.sourceCard} key={source.title}>
              <h4 className={styles.sourceTitle}>{source.title}</h4>
              <ul className={styles.list}>
                {source.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <h3 className={sharedStyles.sectionTitle}>Nutrition Recommendations</h3>
        <p className={sharedStyles.recommendation}>
          {result ? result.recommendations : ''}
        </p>
      </ResultCard>
    </div>
  );
}
