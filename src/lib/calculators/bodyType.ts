import type {FieldErrors} from './validation';

export const BODY_TYPE_QUIZ_ERROR =
  'Please answer all questions to get your body type result.';

export const BODY_TYPE_QUESTIONS = [
  {
    key: 'q1',
    label: '1. How would you describe your bone structure?',
    options: [
      {value: 'ectomorph', label: 'Small, delicate'},
      {value: 'mesomorph', label: 'Medium, athletic'},
      {value: 'endomorph', label: 'Large, broad'},
    ],
  },
  {
    key: 'q2',
    label: '2. How easily do you gain muscle mass?',
    options: [
      {value: 'ectomorph', label: 'Very difficult'},
      {value: 'mesomorph', label: 'Quite easily'},
      {value: 'endomorph', label: 'Moderately easy, but also gain fat'},
    ],
  },
  {
    key: 'q3',
    label: '3. How easily do you gain body fat?',
    options: [
      {value: 'ectomorph', label: 'Very difficult'},
      {value: 'mesomorph', label: 'Moderately, with overeating'},
      {value: 'endomorph', label: 'Very easily, tend to hold fat'},
    ],
  },
  {
    key: 'q4',
    label: '4. What is your natural body shape?',
    options: [
      {value: 'ectomorph', label: 'Long, lean, narrow shoulders'},
      {value: 'mesomorph', label: 'Rectangular, athletic, broad shoulders'},
      {value: 'endomorph', label: 'Round, soft, wide hips/shoulders'},
    ],
  },
  {
    key: 'q5',
    label: '5. How is your appetite generally?',
    options: [
      {value: 'ectomorph', label: 'Small, can forget to eat'},
      {value: 'mesomorph', label: 'Good, consistent'},
      {value: 'endomorph', label: 'Large, enjoy eating'},
    ],
  },
] as const;

export type BodyTypeAnswer = 'ectomorph' | 'mesomorph' | 'endomorph';
export type BodyTypeQuestionKey =
  (typeof BODY_TYPE_QUESTIONS)[number]['key'];
export type BodyTypeQuizValues = Record<
  BodyTypeQuestionKey,
  BodyTypeAnswer | ''
>;
export type DominantBodyType = BodyTypeAnswer | 'blend' | 'undetermined';

export type BodyTypeRecommendation = {
  label?: string;
  text: string;
};

export type BodyTypeResult = {
  dominant: DominantBodyType;
  title: string;
  description: string;
  recommendations: readonly BodyTypeRecommendation[];
};

export const INITIAL_BODY_TYPE_VALUES: BodyTypeQuizValues = {
  q1: '',
  q2: '',
  q3: '',
  q4: '',
  q5: '',
};

export function validateBodyTypeQuizValues(
  values: BodyTypeQuizValues,
): FieldErrors<BodyTypeQuizValues> {
  const errors: FieldErrors<BodyTypeQuizValues> = {};

  for (const question of BODY_TYPE_QUESTIONS) {
    if (!values[question.key]) {
      errors[question.key] = BODY_TYPE_QUIZ_ERROR;
    }
  }

  return errors;
}

export function scoreBodyType(
  values: BodyTypeQuizValues,
): DominantBodyType {
  const scores: Record<BodyTypeAnswer, number> = {
    ectomorph: 0,
    mesomorph: 0,
    endomorph: 0,
  };

  for (const question of BODY_TYPE_QUESTIONS) {
    const answer = values[question.key];

    if (answer) {
      scores[answer] += 1;
    }
  }

  let dominant: DominantBodyType = 'undetermined';
  let maxScore = 0;

  for (const type of [
    'ectomorph',
    'mesomorph',
    'endomorph',
  ] as const) {
    if (scores[type] > maxScore) {
      maxScore = scores[type];
      dominant = type;
    } else if (scores[type] === maxScore && maxScore > 0) {
      dominant = 'blend';
    }
  }

  return dominant;
}

export function getBodyTypeResult(
  dominant: DominantBodyType,
): BodyTypeResult {
  switch (dominant) {
    case 'ectomorph':
      return {
        dominant,
        title: 'Ectomorph',
        description:
          'Naturally lean and often struggles to gain weight or muscle.',
        recommendations: [
          {
            label: 'Training',
            text: 'Focus on strength training with heavy weights and lower reps (6-10). Limit cardio to avoid excess calorie burn. Prioritize compound movements.',
          },
          {
            label: 'Nutrition',
            text: "Consume a high-calorie diet with plenty of carbohydrates and protein. Don't be afraid to eat frequently. Healthy fats are also important.",
          },
        ],
      };
    case 'mesomorph':
      return {
        dominant,
        title: 'Mesomorph',
        description:
          'Naturally athletic, muscular, and gains muscle relatively easily.',
        recommendations: [
          {
            label: 'Training',
            text: 'A balanced approach of strength training and moderate cardio works best. Can respond well to varied rep ranges. Enjoy diverse sports and activities.',
          },
          {
            label: 'Nutrition',
            text: 'A balanced diet with an even distribution of macronutrients (protein, carbs, fats) is usually effective. Pay attention to portion control.',
          },
        ],
      };
    case 'endomorph':
      return {
        dominant,
        title: 'Endomorph',
        description:
          'Tends to have a larger build and stores fat easily.',
        recommendations: [
          {
            label: 'Training',
            text: 'Regular cardiovascular exercise is important for fat loss. Incorporate strength training to build muscle and boost metabolism. High-intensity interval training (HIIT) can be very effective.',
          },
          {
            label: 'Nutrition',
            text: 'Focus on a diet rich in protein and healthy fats, with controlled carbohydrate intake (especially simple carbs). Prioritize whole, unprocessed foods.',
          },
        ],
      };
    case 'blend':
      return {
        dominant,
        title: 'Mixed Body Type',
        description:
          'You exhibit characteristics of multiple body types. Your approach should be a blend.',
        recommendations: [
          {
            text: 'You likely have a unique blend of characteristics. Experiment with different training and nutrition strategies to see what works best for your body. Pay attention to how your body responds to specific foods and exercises.',
          },
          {
            text: 'Consider focusing on aspects of both dominant types you scored highly on. For example, if you scored high on both Ectomorph and Mesomorph, you might benefit from strength training like a Mesomorph but with a slightly higher calorie intake like an Ectomorph.',
          },
        ],
      };
    case 'undetermined':
      return {
        dominant,
        title: 'Undetermined',
        description:
          'Please ensure all questions are answered and try again.',
        recommendations: [
          {
            text: 'Please answer all questions to receive a personalized recommendation.',
          },
        ],
      };
  }
}

export function calculateBodyTypeQuiz(
  values: BodyTypeQuizValues,
): BodyTypeResult {
  if (BODY_TYPE_QUESTIONS.some((question) => !values[question.key])) {
    throw new Error(BODY_TYPE_QUIZ_ERROR);
  }

  return getBodyTypeResult(scoreBodyType(values));
}
