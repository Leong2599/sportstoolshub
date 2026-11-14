// @vitest-environment jsdom
import {cleanup, render, screen, waitFor, within} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {afterEach, beforeEach, describe, expect, it, vi} from 'vitest';
import type {ShareContent} from '../../lib/calculators/share';
import {Vo2MaxCalculator} from './Vo2MaxCalculator';

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

async function fillVo2Max(user: ReturnType<typeof userEvent.setup>) {
  await user.type(screen.getByRole('spinbutton', {name: 'Age'}), '30');
  await user.click(
    within(screen.getByRole('group', {name: 'Gender'})).getByRole('radio', {
      name: 'Male',
    }),
  );
  await user.type(screen.getByRole('spinbutton', {name: 'Weight'}), '80');
}

async function submitVo2Max(user: ReturnType<typeof userEvent.setup>) {
  await user.click(screen.getByRole('button', {name: 'Calculate VO2 Max'}));
}

describe('Vo2MaxCalculator', () => {
  it('computes the source resting heart rate example end-to-end', async () => {
    const user = userEvent.setup({delay: null});
    render(<Vo2MaxCalculator />);

    await user.selectOptions(
      screen.getByRole('combobox', {name: 'Calculation Method'}),
      'resting-heart-rate',
    );
    await fillVo2Max(user);
    await user.type(
      screen.getByRole('spinbutton', {name: 'Resting Heart Rate'}),
      '60',
    );
    await submitVo2Max(user);

    await waitFor(() =>
      expect(
        screen.getByRole('region', {name: 'Your VO2 Max Results'}).textContent,
      ).toContain('48.5 ml/kg/min'),
    );

    const result = screen.getByRole('region', {name: 'Your VO2 Max Results'});
    expect(result.textContent).toContain('Average');
    expect(result.textContent).toContain('Excellent');
    expect(result.textContent).toContain('Good foundation for improvement.');
    expect(scrollIntoView).toHaveBeenCalledWith({
      behavior: 'smooth',
      block: 'start',
    });
  });

  it('computes the source 12 minute run example end-to-end', async () => {
    const user = userEvent.setup({delay: null});
    render(<Vo2MaxCalculator />);

    await user.selectOptions(
      screen.getByRole('combobox', {name: 'Calculation Method'}),
      '12-minute-run',
    );
    await fillVo2Max(user);
    await user.type(
      screen.getByRole('spinbutton', {name: 'Distance Covered'}),
      '3000',
    );
    await user.selectOptions(
      screen.getByRole('combobox', {name: 'Distance Unit'}),
      'meters',
    );
    await submitVo2Max(user);

    await waitFor(() =>
      expect(
        screen.getByRole('region', {name: 'Your VO2 Max Results'}).textContent,
      ).toContain('53.0 ml/kg/min'),
    );

    expect(
      screen.getByRole('region', {name: 'Your VO2 Max Results'}).textContent,
    ).toContain('Good');
  });

  it('shares only the computed result and prints without exposing inputs', async () => {
    const share = vi.fn(async (_content: ShareContent) => {});
    const onPrint = vi.fn();
    const user = userEvent.setup({delay: null});
    render(
      <Vo2MaxCalculator shareEnvironment={{share}} onPrint={onPrint} />,
    );

    await user.selectOptions(
      screen.getByRole('combobox', {name: 'Calculation Method'}),
      'resting-heart-rate',
    );
    await fillVo2Max(user);
    await user.type(
      screen.getByRole('spinbutton', {name: 'Resting Heart Rate'}),
      '60',
    );
    await submitVo2Max(user);
    await user.click(screen.getByRole('button', {name: 'Share results'}));

    await waitFor(() => expect(share).toHaveBeenCalledOnce());
    const content = share.mock.calls[0]?.[0];

    expect(content?.title).toBe('VO2 Max Calculator Results');
    expect(content?.text).toBe(
      'My VO2 Max is 48.5 ml/kg/min (Average). Calculate yours at Sports Tools Hub!',
    );
    expect(content?.text).not.toContain('30');
    expect(content?.text).not.toContain('80');
    expect(content?.url).toBe(window.location.href);

    await user.click(screen.getByRole('button', {name: 'Print Results'}));
    expect(onPrint).toHaveBeenCalledOnce();
  });

  it('validates with the source messages before calculating', async () => {
    const user = userEvent.setup({delay: null});
    render(<Vo2MaxCalculator />);

    await submitVo2Max(user);

    expect(
      screen.getByText('Please select a calculation method.'),
    ).toBeTruthy();
    expect(
      screen.getAllByText('Please fill in all required fields.').length,
    ).toBeGreaterThan(0);
    expect(scrollIntoView).not.toHaveBeenCalled();
  });
});
