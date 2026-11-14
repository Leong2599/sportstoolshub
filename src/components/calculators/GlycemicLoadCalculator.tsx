import {useId, useState, type ReactNode} from 'react';
import clsx from 'clsx';
import {
  analyzeGlycemicFood,
  calculateGlycemicLoad,
  createGlycemicFoodEntry,
  GLYCEMIC_ERRORS,
  GLYCEMIC_FOODS,
  GLYCEMIC_FOOD_GROUPS,
  validateGlycemicValues,
  type GlycemicFoodId,
  type GlycemicResult,
  type GlycemicValues,
} from '../../lib/calculators/glycemicLoad';
import {
  NumberField,
  ResultCard,
  useCalculator,
} from './kit';
import kitStyles from './kit/CalculatorKit.module.css';
import sharedStyles from './ToolCalculator.module.css';
import styles from './NutritionBatch.module.css';

export type GlycemicLoadCalculatorProps = {
  onPrint?: () => void;
};

const INITIAL_VALUES: GlycemicValues = {
  foodSelect: '',
  foodAmount: '',
  foods: [],
};

export function GlycemicLoadCalculator({
  onPrint,
}: GlycemicLoadCalculatorProps): ReactNode {
  const formTitleId = useId();
  const [addError, setAddError] = useState<string | null>(null);
  const calculator = useCalculator<GlycemicValues, GlycemicResult>({
    initialValues: INITIAL_VALUES,
    validate: validateGlycemicValues,
    calculate: (values) => calculateGlycemicLoad(values.foods),
    getSharePayload: (result) => ({
      title: 'Glycemic Load Calculator Results',
      text: `My meal has a glycemic load of ${result.totalGlDisplay}. Check yours at Sports Tools Hub!`,
      url: typeof window === 'undefined' ? undefined : window.location.href,
    }),
    onPrint,
  });
  const {values, errors, result} = calculator;

  function addFood(): void {
    const entry = createGlycemicFoodEntry(
      values.foodSelect,
      values.foodAmount,
    );

    if (!entry) {
      setAddError(GLYCEMIC_ERRORS.add);
      return;
    }

    setAddError(null);
    calculator.setValues({
      ...values,
      foods: [...values.foods, entry],
      foodAmount: '',
    });
  }

  function clearFoods(): void {
    setAddError(null);
    calculator.setValues({...values, foods: []});
  }

  return (
    <div className={sharedStyles.layout}>
      <section className={sharedStyles.card} aria-labelledby={formTitleId}>
        <div className={sharedStyles.cardHeader}>
          <h2 className={sharedStyles.cardTitle} id={formTitleId}>
            Build Your Meal
          </h2>
        </div>
        <form className={kitStyles.form} onSubmit={calculator.submit} noValidate>
          <div className={styles.fieldGroup}>
            <h3 className={styles.groupTitle}>Add Foods to Your Meal</h3>

            <div className={kitStyles.field}>
              <label className={kitStyles.label} htmlFor="glycemic-food-select">
                Select Food
              </label>
              <select
                id="glycemic-food-select"
                className={clsx(kitStyles.select, kitStyles.selectFull)}
                value={values.foodSelect}
                onChange={(event) => {
                  setAddError(null);
                  calculator.setValue(
                    'foodSelect',
                    event.target.value as GlycemicFoodId,
                  );
                }}
              >
                <option value="">Choose a food...</option>
                {GLYCEMIC_FOOD_GROUPS.map((group) => (
                  <optgroup key={group} label={group}>
                    {GLYCEMIC_FOODS.filter((food) => food.group === group).map(
                      (food) => (
                        <option key={food.id} value={food.id}>
                          {food.label}
                        </option>
                      ),
                    )}
                  </optgroup>
                ))}
              </select>
            </div>

            <NumberField
              label="Amount (grams)"
              value={values.foodAmount}
              onValueChange={(value) => {
                setAddError(null);
                calculator.setValue('foodAmount', value);
              }}
              placeholder="100"
              min={1}
              max={1000}
              step={1}
            />

            <div className={kitStyles.formActions}>
              <button
                className={clsx(kitStyles.button, kitStyles.buttonPrimary)}
                type="button"
                onClick={addFood}
              >
                Add Food
              </button>
              <button
                className={clsx(kitStyles.button, kitStyles.buttonSecondary)}
                type="button"
                onClick={clearFoods}
              >
                Clear All
              </button>
            </div>

            {addError ? (
              <p className={kitStyles.error} role="alert">
                {addError}
              </p>
            ) : null}

            {values.foods.length > 0 ? (
              <div>
                <h4 className={styles.foodGroup}>Current Meal</h4>
                <div className={styles.foodList}>
                  {values.foods.map((food, index) => {
                    const stats = analyzeGlycemicFood(food);

                    return (
                      <div className={styles.foodItem} key={`${food.foodId}-${index}`}>
                        <span className={styles.foodName}>
                          {stats.amount}g {stats.food.name}
                        </span>
                        <span className={styles.foodGl}>
                          GL: {stats.glDisplay}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            ) : null}
          </div>

          <div className={kitStyles.formActions}>
            <button
              className={clsx(kitStyles.button, kitStyles.buttonPrimary)}
              type="submit"
            >
              Calculate Glycemic Load
            </button>
            <button
              className={clsx(kitStyles.button, kitStyles.buttonSecondary)}
              type="button"
              onClick={calculator.reset}
            >
              Reset All
            </button>
          </div>

          {errors.foods ? (
            <p className={kitStyles.error} role="alert">
              {errors.foods}
            </p>
          ) : null}
        </form>
      </section>

      <ResultCard
        ref={calculator.resultRef}
        title="Glycemic Load Analysis"
        value={result ? result.totalGlDisplay : '0'}
        category="Total Glycemic Load"
        description={result ? result.category : undefined}
      >
        <h3 className={sharedStyles.sectionTitle}>Glycemic Load Details</h3>
        <div className={styles.overviewGrid}>
          <div className={styles.overviewItem}>
            <div className={styles.overviewLabel}>Total Glycemic Load</div>
            <div className={styles.overviewValue}>
              {result ? result.totalGlDisplay : '--'}
            </div>
          </div>
          <div className={styles.overviewItem}>
            <div className={styles.overviewLabel}>Total Carbohydrates</div>
            <div className={styles.overviewValue}>
              {result ? `${result.totalCarbsDisplay}g` : '--'}
            </div>
          </div>
          <div className={styles.overviewItem}>
            <div className={styles.overviewLabel}>Average GI</div>
            <div className={styles.overviewValue}>
              {result ? result.averageGiDisplay : '--'}
            </div>
          </div>
        </div>

        <h3 className={sharedStyles.sectionTitle}>Recommendations</h3>
        <ul className={styles.list}>
          {(result?.recommendations ?? []).map((recommendation) => (
            <li key={recommendation}>{recommendation}</li>
          ))}
        </ul>
      </ResultCard>
    </div>
  );
}
