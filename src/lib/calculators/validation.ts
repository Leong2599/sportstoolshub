export type FieldErrors<TValues extends object> = Partial<
  Record<keyof TValues, string>
>;

export type FieldValidators<TValues extends object> = {
  [K in keyof TValues]?: (value: TValues[K]) => string | undefined;
};

export type NumberMessages = Partial<
  Record<'required' | 'invalid' | 'min' | 'max' | 'integer', string>
>;

export type NumberValidationOptions = {
  label?: string;
  required?: boolean;
  min?: number;
  max?: number;
  integer?: boolean;
  messages?: NumberMessages;
};

export type SelectionValidationOptions = {
  label?: string;
  required?: boolean;
  message?: string;
};

export function validateNumber(
  value: string,
  options: NumberValidationOptions = {},
): string | undefined {
  const {
    label = 'This field',
    required = true,
    min,
    max,
    integer = false,
    messages = {},
  } = options;
  const trimmed = value.trim();

  if (!trimmed) {
    return required ? messages.required ?? `${label} is required.` : undefined;
  }

  const parsed = Number(trimmed);

  if (!Number.isFinite(parsed)) {
    return messages.invalid ?? `${label} must be a number.`;
  }

  if (integer && !Number.isInteger(parsed)) {
    return messages.integer ?? `${label} must be a whole number.`;
  }

  if (min !== undefined && parsed < min) {
    return messages.min ?? `${label} must be at least ${min}.`;
  }

  if (max !== undefined && parsed > max) {
    return messages.max ?? `${label} must be at most ${max}.`;
  }

  return undefined;
}

export function validateSelection(
  value: string,
  options: SelectionValidationOptions = {},
): string | undefined {
  const {label = 'This field', required = true, message} = options;

  if (value.trim() || !required) {
    return undefined;
  }

  return message ?? `${label} is required.`;
}

export function validateFields<TValues extends object>(
  values: TValues,
  validators: FieldValidators<TValues>,
): FieldErrors<TValues> {
  const errors: FieldErrors<TValues> = {};

  for (const key of Object.keys(validators) as Array<keyof TValues>) {
    const validator = validators[key];

    if (!validator) {
      continue;
    }

    const message = validator(values[key]);

    if (message) {
      errors[key] = message;
    }
  }

  return errors;
}

export function hasErrors<TValues extends object>(
  errors: FieldErrors<TValues>,
): boolean {
  return Object.values(errors).some((message) => Boolean(message));
}
