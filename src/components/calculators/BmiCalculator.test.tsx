// @vitest-environment jsdom
import {cleanup, render, screen, waitFor} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {afterEach, beforeEach, describe, expect, it, vi} from 'vitest';
import type {ShareContent} from '../../lib/calculators/share';
import {BmiCalculator} from './BmiCalculator';

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

async function fillBmi(user: ReturnType<typeof userEvent.setup>) {
  await user.type(screen.getByRole('spinbutton', {name: 'Weight'}), '70');
  await user.type(screen.getByRole('spinbutton', {name: 'Height'}), '175');
  await user.type(screen.getByRole('spinbutton', {name: 'Age'}), '30');
  await user.click(screen.getByRole('radio', {name: 'Male'}));
}

async function submitBmi(user: ReturnType<typeof userEvent.setup>) {
  await user.click(screen.getByRole('button', {name: 'Calculate BMI'}));
}

describe('BmiCalculator', () => {
  it('computes the source metric example end-to-end', async () => {
    const user = userEvent.setup();
    render(<BmiCalculator />);

    await fillBmi(user);
    await submitBmi(user);

    await waitFor(() =>
      expect(scrollIntoView).toHaveBeenCalledWith({
        behavior: 'smooth',
        block: 'start',
      }),
    );

    const result = screen.getByRole('region', {name: 'Your BMI Results'});
    expect(result.textContent).toContain('22.9');
    expect(result.textContent).toContain('Normal weight');
    expect(result.textContent).toContain('18.5 - 24.9');
    expect(result.textContent).toContain('healthy weight range');
  });

  it('validates with the source messages before calculating', async () => {
    const user = userEvent.setup();
    render(<BmiCalculator />);

    await submitBmi(user);

    expect(screen.getByText('Please enter a valid weight.')).toBeTruthy();
    expect(screen.getByText('Please enter a valid height in cm.')).toBeTruthy();
    expect(screen.getByText('Please enter a valid age.')).toBeTruthy();
    expect(screen.getByText('Please select your gender.')).toBeTruthy();
    expect(scrollIntoView).not.toHaveBeenCalled();
  });

  it('shares only the computed result and prints without exposing inputs', async () => {
    const share = vi.fn(async (_content: ShareContent) => {});
    const onPrint = vi.fn();
    const user = userEvent.setup();
    render(<BmiCalculator shareEnvironment={{share}} onPrint={onPrint} />);

    await fillBmi(user);
    await submitBmi(user);
    await user.click(screen.getByRole('button', {name: 'Share results'}));

    await waitFor(() => expect(share).toHaveBeenCalledOnce());
    const content = share.mock.calls[0]?.[0];

    expect(content?.title).toBe('BMI Calculator Results');
    expect(content?.text).toBe(
      'My BMI is 22.9 (Normal weight). Calculate yours at Sports Tools Hub!',
    );
    expect(content?.text).not.toContain('70');
    expect(content?.text).not.toContain('175');
    expect(content?.text).not.toContain('30');
    expect(content?.url).toBe(window.location.href);

    await user.click(screen.getByRole('button', {name: 'Print Results'}));
    expect(onPrint).toHaveBeenCalledOnce();
  });
});
