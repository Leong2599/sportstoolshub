import {useId, type ReactNode} from 'react';
import clsx from 'clsx';
import {
  BODY_TYPE_QUESTIONS,
  INITIAL_BODY_TYPE_VALUES,
  calculateBodyTypeQuiz,
  validateBodyTypeQuizValues,
  type BodyTypeAnswer,
  type BodyTypeQuestionKey,
  type BodyTypeQuizValues,
  type BodyTypeResult,
} from '../../lib/calculators/bodyType';
import type {ShareEnvironment} from '../../lib/calculators/share';
import {
  ChoiceField,
  ResultCard,
  useCalculator,
  type ChoiceOption,
} from './kit';
import kitStyles from './kit/CalculatorKit.module.css';
import styles from './ToolCalculator.module.css';

export type BodyTypeQuizProps = {
  shareEnvironment?: ShareEnvironment;
  onPrint?: () => void;
};

function toChoiceOptions(
  options: readonly {value: BodyTypeAnswer; label: string}[],
): readonly ChoiceOption<BodyTypeAnswer>[] {
  return options.map(({value, label}) => ({value, label}));
}

export function BodyTypeQuiz({
  shareEnvironment,
  onPrint,
}: BodyTypeQuizProps): ReactNode {
  const formTitleId = useId();
  const calculator = useCalculator<BodyTypeQuizValues, BodyTypeResult>({
    initialValues: INITIAL_BODY_TYPE_VALUES,
    validate: validateBodyTypeQuizValues,
    calculate: calculateBodyTypeQuiz,
    getSharePayload: () => ({
      text: 'Body type quiz result',
    }),
    shareEnvironment,
    onPrint,
    scrollOnResult: false,
  });
  const {values, errors, result} = calculator;

  function setAnswer(key: BodyTypeQuestionKey, value: BodyTypeAnswer): void {
    calculator.setValue(key, value);
  }

  return (
    <div className={styles.layout}>
      <section className={styles.card} aria-labelledby={formTitleId}>
        <div className={styles.cardHeader}>
          <h2 className={styles.cardTitle} id={formTitleId}>
            Answer the Questions
          </h2>
        </div>
        <form className={kitStyles.form} onSubmit={calculator.submit} noValidate>
          {BODY_TYPE_QUESTIONS.map((question) => (
            <ChoiceField
              key={question.key}
              legend={question.label}
              value={values[question.key]}
              onValueChange={(value) => setAnswer(question.key, value)}
              options={toChoiceOptions(question.options)}
              error={errors[question.key]}
              required
              layout="list"
            />
          ))}

          <div className={kitStyles.formActions}>
            <button
              className={clsx(kitStyles.button, kitStyles.buttonPrimary)}
              type="submit"
            >
              Discover My Body Type
            </button>
            <button
              className={clsx(kitStyles.button, kitStyles.buttonSecondary)}
              type="button"
              onClick={calculator.reset}
            >
              Reset Quiz
            </button>
          </div>
        </form>
      </section>

      <ResultCard
        ref={calculator.resultRef}
        title="Your Body Type Result"
        value={result ? result.title : '?'}
        category={result?.description}
      >
        <h3 className={styles.sectionTitle}>
          Recommendations for Your Body Type
        </h3>
        {result ? (
          <div className={styles.recommendation}>
            {result.recommendations.map((recommendation, index) => (
              <p key={index}>
                {recommendation.label ? (
                  <strong>{recommendation.label}:</strong>
                ) : null}{' '}
                {recommendation.text}
              </p>
            ))}
          </div>
        ) : (
          <p className={styles.empty}>
            Answer all five questions, then discover your body type
            recommendations.
          </p>
        )}
      </ResultCard>
    </div>
  );
}
