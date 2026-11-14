import {useEffect, useMemo, useRef, useState} from 'react';
import type {RefObject} from 'react';
import {
  createBrowserShareEnvironment,
  shareOrCopy,
  type ShareContent,
  type ShareEnvironment,
  type ShareStatus,
} from '../../../lib/calculators/share';
import {
  hasErrors,
  type FieldErrors,
} from '../../../lib/calculators/validation';

export type CalculatorValidator<TValues extends object> = (
  values: TValues,
) => FieldErrors<TValues>;

export type CalculatorSharePayload<TResult> = (
  result: TResult,
) => ShareContent;

export type CalculatorSubmitEvent = {
  preventDefault: () => void;
};

export type UseCalculatorOptions<TValues extends object, TResult> = {
  initialValues: TValues;
  calculate: (values: TValues) => TResult;
  getSharePayload: CalculatorSharePayload<TResult>;
  validate?: CalculatorValidator<TValues>;
  shareEnvironment?: ShareEnvironment;
  onPrint?: () => void;
  scrollOnResult?: boolean;
};

export type CalculatorController<TValues extends object, TResult> = {
  values: TValues;
  errors: FieldErrors<TValues>;
  result: TResult | null;
  hasResult: boolean;
  shareStatus: ShareStatus;
  resultRef: RefObject<HTMLDivElement | null>;
  setValue: <K extends keyof TValues>(key: K, value: TValues[K]) => void;
  setValues: (values: TValues) => void;
  submit: (event?: CalculatorSubmitEvent) => void;
  reset: () => void;
  share: () => Promise<void>;
  print: () => void;
};

export function useCalculator<TValues extends object, TResult>(
  options: UseCalculatorOptions<TValues, TResult>,
): CalculatorController<TValues, TResult> {
  const [values, setValuesState] = useState<TValues>(options.initialValues);
  const [errors, setErrors] = useState<FieldErrors<TValues>>({});
  const [result, setResult] = useState<TResult | null>(null);
  const [shareStatus, setShareStatus] = useState<ShareStatus>('idle');
  const [scrollRequest, setScrollRequest] = useState(0);
  const resultRef = useRef<HTMLDivElement | null>(null);
  const environment = useMemo(
    () => options.shareEnvironment ?? createBrowserShareEnvironment(),
    [options.shareEnvironment],
  );

  useEffect(() => {
    if (
      options.scrollOnResult === false ||
      scrollRequest === 0 ||
      result === null
    ) {
      return;
    }

    const node = resultRef.current;

    if (!node) {
      return;
    }

    node.scrollIntoView?.({behavior: 'smooth', block: 'start'});
    node.focus?.({preventScroll: true});
  }, [options.scrollOnResult, result, scrollRequest]);

  function setValue<K extends keyof TValues>(key: K, value: TValues[K]): void {
    setValuesState((current) => ({...current, [key]: value}));
    setErrors((current) => {
      if (!(key in current)) {
        return current;
      }

      const next = {...current};
      delete next[key];
      return next;
    });
    setShareStatus('idle');
  }

  function setValues(nextValues: TValues): void {
    setValuesState(nextValues);
    setErrors({});
    setShareStatus('idle');
  }

  function submit(event?: CalculatorSubmitEvent): void {
    event?.preventDefault();
    const nextErrors = options.validate ? options.validate(values) : {};

    if (hasErrors(nextErrors)) {
      setErrors(nextErrors);
      setResult(null);
      setShareStatus('idle');
      return;
    }

    setErrors({});
    setResult(options.calculate(values));
    setShareStatus('idle');
    setScrollRequest((request) => request + 1);
  }

  function reset(): void {
    setValuesState(options.initialValues);
    setErrors({});
    setResult(null);
    setShareStatus('idle');
  }

  async function share(): Promise<void> {
    if (result === null) {
      return;
    }

    setShareStatus('sharing');

    try {
      const content = options.getSharePayload(result);
      setShareStatus(await shareOrCopy(content, environment));
    } catch {
      setShareStatus('failed');
    }
  }

  function print(): void {
    if (options.onPrint) {
      options.onPrint();
      return;
    }

    if (typeof window !== 'undefined' && typeof window.print === 'function') {
      window.print();
    }
  }

  return {
    values,
    errors,
    result,
    hasResult: result !== null,
    shareStatus,
    resultRef,
    setValue,
    setValues,
    submit,
    reset,
    share,
    print,
  };
}
