import {parseNumber} from './units';
import type {FieldErrors} from './validation';

export type MicronutrientGender = 'male' | 'female';

export type MicronutrientStatus = 'adequate' | 'insufficient' | 'deficient';

const NUTRIENT_DEFINITIONS = [
  {key: 'vitaminA', label: 'vitamin A'},
  {key: 'vitaminC', label: 'vitamin C'},
  {key: 'vitaminD', label: 'vitamin D'},
  {key: 'vitaminE', label: 'vitamin E'},
  {key: 'vitaminK', label: 'vitamin K'},
  {key: 'thiamine', label: 'thiamine'},
  {key: 'riboflavin', label: 'riboflavin'},
  {key: 'niacin', label: 'niacin'},
  {key: 'vitaminB6', label: 'vitamin B6'},
  {key: 'folate', label: 'folate'},
  {key: 'vitaminB12', label: 'vitamin B12'},
  {key: 'calcium', label: 'calcium'},
  {key: 'iron', label: 'iron'},
  {key: 'magnesium', label: 'magnesium'},
  {key: 'phosphorus', label: 'phosphorus'},
  {key: 'potassium', label: 'potassium'},
  {key: 'sodium', label: 'sodium'},
  {key: 'zinc', label: 'zinc'},
  {key: 'selenium', label: 'selenium'},
] as const;

export type MicronutrientKey = (typeof NUTRIENT_DEFINITIONS)[number]['key'];

export type MicronutrientValues = {
  age: string;
  gender: MicronutrientGender | '';
} & Record<MicronutrientKey, string>;

export type MicronutrientBreakdownItem = {
  key: MicronutrientKey;
  label: string;
  percentage: number;
  display: string;
  status: MicronutrientStatus;
};

export type MicronutrientResult = {
  overallScore: number;
  scoreDescription: string;
  breakdown: readonly MicronutrientBreakdownItem[];
  recommendations: readonly string[];
};

export const MICRONUTRIENT_DEFINITIONS = NUTRIENT_DEFINITIONS;

export type MicronutrientInput = {
  key: MicronutrientKey;
  label: string;
  hint?: string;
  step: number;
  placeholder: string;
};

export const MICRONUTRIENT_INPUTS: readonly MicronutrientInput[] = [
  {
    key: 'vitaminA',
    label: 'Vitamin A (mcg)',
    hint: 'RDA: 900 (men), 700 (women)',
    step: 1,
    placeholder: '900',
  },
  {
    key: 'vitaminC',
    label: 'Vitamin C (mg)',
    hint: 'RDA: 90 (men), 75 (women)',
    step: 1,
    placeholder: '90',
  },
  {
    key: 'vitaminD',
    label: 'Vitamin D (mcg)',
    hint: 'RDA: 15 mcg (600 IU)',
    step: 0.1,
    placeholder: '15',
  },
  {
    key: 'vitaminE',
    label: 'Vitamin E (mg)',
    hint: 'RDA: 15 mg',
    step: 1,
    placeholder: '15',
  },
  {
    key: 'vitaminK',
    label: 'Vitamin K (mcg)',
    hint: 'RDA: 120',
    step: 1,
    placeholder: '120',
  },
  {
    key: 'thiamine',
    label: 'Thiamine B1 (mg)',
    hint: 'RDA: 1.2',
    step: 0.1,
    placeholder: '1.2',
  },
  {
    key: 'riboflavin',
    label: 'Riboflavin B2 (mg)',
    hint: 'RDA: 1.3',
    step: 0.1,
    placeholder: '1.3',
  },
  {
    key: 'niacin',
    label: 'Niacin B3 (mg)',
    hint: 'RDA: 16',
    step: 1,
    placeholder: '16',
  },
  {
    key: 'vitaminB6',
    label: 'Vitamin B6 (mg)',
    hint: 'RDA: 1.3',
    step: 0.1,
    placeholder: '1.3',
  },
  {
    key: 'folate',
    label: 'Folate B9 (mcg)',
    hint: 'RDA: 400',
    step: 1,
    placeholder: '400',
  },
  {
    key: 'vitaminB12',
    label: 'Vitamin B12 (mcg)',
    hint: 'RDA: 2.4',
    step: 0.1,
    placeholder: '2.4',
  },
  {
    key: 'calcium',
    label: 'Calcium (mg)',
    hint: 'RDA: 1000',
    step: 1,
    placeholder: '1000',
  },
  {
    key: 'iron',
    label: 'Iron (mg)',
    hint: 'RDA: 8 (men), 18 (women)',
    step: 1,
    placeholder: '8',
  },
  {
    key: 'magnesium',
    label: 'Magnesium (mg)',
    hint: 'RDA: 400',
    step: 1,
    placeholder: '400',
  },
  {
    key: 'phosphorus',
    label: 'Phosphorus (mg)',
    hint: 'RDA: 700',
    step: 1,
    placeholder: '700',
  },
  {
    key: 'potassium',
    label: 'Potassium (mg)',
    hint: 'RDA: 3500',
    step: 1,
    placeholder: '3500',
  },
  {
    key: 'sodium',
    label: 'Sodium (mg)',
    hint: 'RDA: 2300',
    step: 1,
    placeholder: '2300',
  },
  {
    key: 'zinc',
    label: 'Zinc (mg)',
    hint: 'RDA: 11 (men), 8 (women)',
    step: 0.1,
    placeholder: '11',
  },
  {
    key: 'selenium',
    label: 'Selenium (mcg)',
    hint: 'RDA: 55',
    step: 1,
    placeholder: '55',
  },
] as const;

export const MICRONUTRIENT_GENDERS: readonly {
  value: MicronutrientGender;
  label: string;
}[] = [
  {value: 'male', label: 'Male'},
  {value: 'female', label: 'Female'},
] as const;

export const MICRONUTRIENT_ERRORS = {
  age: 'Please enter a valid age between 15 and 80.',
  gender: 'Please select your gender.',
} as const;

const RDA: Record<
  MicronutrientGender,
  Record<MicronutrientKey, number>
> = {
  male: {
    vitaminA: 900,
    vitaminC: 90,
    vitaminD: 15,
    vitaminE: 15,
    vitaminK: 120,
    thiamine: 1.2,
    riboflavin: 1.3,
    niacin: 16,
    vitaminB6: 1.3,
    folate: 400,
    vitaminB12: 2.4,
    calcium: 1000,
    iron: 8,
    magnesium: 400,
    phosphorus: 700,
    potassium: 3500,
    sodium: 2300,
    zinc: 11,
    selenium: 55,
  },
  female: {
    vitaminA: 700,
    vitaminC: 75,
    vitaminD: 15,
    vitaminE: 15,
    vitaminK: 90,
    thiamine: 1.1,
    riboflavin: 1.1,
    niacin: 14,
    vitaminB6: 1.3,
    folate: 400,
    vitaminB12: 2.4,
    calcium: 1000,
    iron: 18,
    magnesium: 310,
    phosphorus: 700,
    potassium: 3500,
    sodium: 2300,
    zinc: 8,
    selenium: 55,
  },
};

export function validateMicronutrientValues(
  values: MicronutrientValues,
): FieldErrors<MicronutrientValues> {
  const errors: FieldErrors<MicronutrientValues> = {};
  const age = parseNumber(values.age);

  if (age === null || age < 15 || age > 80) {
    errors.age = MICRONUTRIENT_ERRORS.age;
  }

  if (!values.gender) {
    errors.gender = MICRONUTRIENT_ERRORS.gender;
  }

  return errors;
}

function statusFor(percentage: number): MicronutrientStatus {
  if (percentage >= 80) {
    return 'adequate';
  }

  if (percentage >= 60) {
    return 'insufficient';
  }

  return 'deficient';
}

function scoreDescriptionFor(score: number): string {
  if (score >= 90) {
    return 'Excellent micronutrient intake!';
  }

  if (score >= 80) {
    return 'Good micronutrient intake';
  }

  if (score >= 70) {
    return 'Adequate, but could be improved';
  }

  if (score >= 60) {
    return 'Some deficiencies detected';
  }

  return 'Multiple deficiencies - consider supplementation';
}

export function calculateMicronutrient(
  values: MicronutrientValues,
): MicronutrientResult {
  const errors = validateMicronutrientValues(values);

  if (Object.keys(errors).length > 0) {
    throw new Error('Invalid micronutrient inputs.');
  }

  const gender = values.gender as MicronutrientGender;
  const rda = RDA[gender];
  const breakdown: MicronutrientBreakdownItem[] = [];
  let totalScore = 0;
  let totalNutrients = 0;
  const intakes = {} as Record<MicronutrientKey, number>;

  for (const nutrient of NUTRIENT_DEFINITIONS) {
    const intake = parseNumber(values[nutrient.key]) ?? 0;
    intakes[nutrient.key] = intake;

    if (intake > 0) {
      const percentage = Math.min((intake / rda[nutrient.key]) * 100, 200);
      totalScore += percentage;
      totalNutrients += 1;
      breakdown.push({
        key: nutrient.key,
        label: nutrient.label,
        percentage,
        display: `${Math.round(percentage)}%`,
        status: statusFor(percentage),
      });
    }
  }

  const overallScore =
    totalNutrients > 0 ? Math.round(totalScore / totalNutrients) : 0;
  const recommendations: string[] = [];

  if (overallScore < 80) {
    recommendations.push(
      'Consider a multivitamin supplement to fill gaps',
    );
  }

  if (intakes.vitaminD < rda.vitaminD) {
    recommendations.push(
      'Increase Vitamin D intake through sunlight or supplements',
    );
  }

  if (intakes.iron < rda.iron) {
    recommendations.push(
      'Increase iron intake with leafy greens or lean meats',
    );
  }

  if (overallScore >= 90) {
    recommendations.push(
      'Excellent job maintaining micronutrient balance!',
    );
  }

  return {
    overallScore,
    scoreDescription: scoreDescriptionFor(overallScore),
    breakdown,
    recommendations,
  };
}
