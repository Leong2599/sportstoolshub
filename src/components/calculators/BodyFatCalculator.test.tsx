// @vitest-environment jsdom
import {cleanup, render, screen, waitFor} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {afterEach, beforeEach, describe, expect, it, vi} from 'vitest';
import type {ShareContent} from '../../lib/calculators/share';
import {BodyFatCalculator} from './BodyFatCalculator';

const scrollIntoView = vi.fn();

beforeEach(() => {
  Object.defineProperty(Element.prototype, 'scrollIntoView', {
    configurable: true,
    value: scrollIntoView,
  });
});

afterEach(() => {
  cleanup();
  scrollIntoView.mockReset();
  vi.restoreAllMocks();
});

async function selectUsNavy(user: ReturnType<typeof userEvent.setup>) {
  await user.selectOptions(
    screen.getByRole('combobox', {name: 'Calculation Method'}),
    'us-navy',
  );
  await user.click(screen.getByRole('radio', {name: 'Male'}));
}

async function fillUsNavy(user: ReturnType<typeof userEvent.setup>) {
  await selectUsNavy(user);
  await user.type(screen.getByRole('spinbutton', {name: 'Age'}), '30');
  await user.type(screen.getByRole('spinbutton', {name: 'Weight'}), '80');
  await user.type(screen.getByRole('spinbutton', {name: 'Height'}), '180');
  await user.type(
    screen.getByRole('spinbutton', {name: 'Neck Circumference'}),
    '38',
  );
  await user.type(
    screen.getByRole('spinbutton', {name: 'Waist Circumference'}),
    '90',
  );
}

async function submitBodyFat(user: ReturnType<typeof userEvent.setup>) {
  await user.click(
    screen.getByRole('button', {name: 'Calculate Body Fat'}),
  );
}

describe('BodyFatCalculator', () => {
  it('computes the source US Navy example end-to-end', async () => {
    const user = userEvent.setup();
    render(<BodyFatCalculator />);

    await fillUsNavy(user);
    await submitBodyFat(user);

    await waitFor(() =>
      expect(scrollIntoView).toHaveBeenCalledWith({
        behavior: 'smooth',
        block: 'start',
      }),
    );

    const result = screen.getByRole('region', {
      name: 'Your Body Fat Results',
    });
    expect(result.textContent).toContain('19.9%');
    expect(result.textContent).toContain('Acceptable');
    expect(result.textContent).toContain('15.9 kg');
    expect(result.textContent).toContain('64.1 kg');
    expect(result.textContent).toContain('0-6%');
    expect(result.textContent).toContain('25+%');
  });

  it('shows method-specific fields and the female hip field', async () => {
    const user = userEvent.setup();
    render(<BodyFatCalculator />);

    await user.selectOptions(
      screen.getByRole('combobox', {name: 'Calculation Method'}),
      'us-navy',
    );

    expect(
      screen.getByRole('spinbutton', {name: 'Neck Circumference'}),
    ).toBeTruthy();
    expect(
      screen.getByRole('spinbutton', {name: 'Waist Circumference'}),
    ).toBeTruthy();
    expect(
      screen.queryByRole('spinbutton', {name: 'Hip Circumference'}),
    ).toBeNull();

    await user.click(screen.getByRole('radio', {name: 'Female'}));

    expect(
      screen.getByRole('spinbutton', {name: 'Hip Circumference'}),
    ).toBeTruthy();

    await user.selectOptions(
      screen.getByRole('combobox', {name: 'Calculation Method'}),
      'skinfold',
    );

    expect(
      screen.getByRole('spinbutton', {name: 'Triceps Skinfold'}),
    ).toBeTruthy();
    expect(
      screen.getByRole('spinbutton', {name: 'Suprailiac Skinfold'}),
    ).toBeTruthy();
    expect(
      screen.queryByRole('spinbutton', {name: 'Chest Skinfold'}),
    ).toBeNull();
  });

  it('preserves the source validation messages', async () => {
    const user = userEvent.setup();
    render(<BodyFatCalculator />);

    await submitBodyFat(user);

    expect(
      screen.getByText('Please select a calculation method.'),
    ).toBeTruthy();
    expect(screen.getByText('Please select your gender.')).toBeTruthy();
    expect(screen.getByText('Please enter a valid age (18-100).')).toBeTruthy();
    expect(
      screen.getByText('Please enter a valid weight (min 30).'),
    ).toBeTruthy();
    expect(
      screen.getByText('Please enter a valid height in cm (50-300).'),
    ).toBeTruthy();
    expect(scrollIntoView).not.toHaveBeenCalled();
  });

  it('shares only the result and prints without exposing the inputs', async () => {
    const share = vi.fn(async (_content: ShareContent) => {});
    const onPrint = vi.fn();
    const user = userEvent.setup();
    render(
      <BodyFatCalculator
        shareEnvironment={{share}}
        onPrint={onPrint}
      />,
    );

    await fillUsNavy(user);
    await submitBodyFat(user);
    await user.click(screen.getByRole('button', {name: 'Share results'}));

    await waitFor(() => expect(share).toHaveBeenCalledOnce());
    const content = share.mock.calls[0]?.[0];

    expect(content?.title).toBe('Body Fat Calculator Results');
    expect(content?.text).toBe(
      'My body fat percentage is 19.9% (Acceptable). Calculate yours at Sports Tools Hub!',
    );
    expect(content?.text).not.toContain('80');
    expect(content?.text).not.toContain('180');
    expect(content?.text).not.toContain('38');
    expect(content?.text).not.toContain('90');

    await user.click(screen.getByRole('button', {name: 'Print Results'}));
    expect(onPrint).toHaveBeenCalledOnce();
  });
});
