// @vitest-environment jsdom
import {cleanup, render, screen, waitFor, within} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {afterEach, beforeEach, describe, expect, it, vi} from 'vitest';
import type {ShareContent} from '../../lib/calculators/share';
import {YogaCalorieCalculator} from './YogaCalorieCalculator';

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

async function fillYoga(user: ReturnType<typeof userEvent.setup>) {
  await user.type(screen.getByRole('spinbutton', {name: 'Weight'}), '70');
  await user.click(
    within(screen.getByRole('group', {name: 'Gender'})).getByRole('radio', {
      name: 'Male',
    }),
  );
  await user.type(screen.getByRole('spinbutton', {name: 'Age'}), '30');
  await user.selectOptions(screen.getByRole('combobox', {name: 'Yoga Experience'}), 'intermediate');
  await user.selectOptions(screen.getByRole('combobox', {name: 'Yoga Style'}), 'vinyasa');
  await user.type(screen.getByRole('spinbutton', {name: 'Session Duration'}), '60');
  await user.selectOptions(screen.getByRole('combobox', {name: 'Intensity Level'}), 'moderate');
}

async function submitYoga(user: ReturnType<typeof userEvent.setup>) {
  await user.click(screen.getByRole('button', {name: 'Calculate Calories'}));
}

describe('YogaCalorieCalculator', () => {
  it('computes the source Vinyasa example end-to-end', async () => {
    const user = userEvent.setup();
    render(<YogaCalorieCalculator />);

    await fillYoga(user);
    await submitYoga(user);

    await waitFor(() =>
      expect(
        screen.getByRole('region', {name: 'Your Yoga Calorie Results'})
          .textContent,
      ).toContain('276 cal'),
    );

    const result = screen.getByRole('region', {
      name: 'Your Yoga Calorie Results',
    });
    expect(result.textContent).toContain('Calories Burned');
    expect(result.textContent).toContain('60 minutes');
    expect(result.textContent).toContain('Vinyasa Flow');
    expect(result.textContent).toContain('Moderate');
    expect(result.textContent).toContain('4.6');
    expect(result.textContent).toContain('276');
    expect(result.textContent).toContain('69 minutes');
    expect(result.textContent).toContain('193');
    expect(result.textContent).toContain('55');
    expect(result.textContent).toContain('28');
    expect(result.textContent).toContain('Hatha Yoga');
    expect(result.textContent).toContain('175 cal');
    expect(result.textContent).toContain('-101');
    expect(result.textContent).toContain('Outstanding calorie burn for yoga');
    expect(result.textContent).toContain(
      'Consider adding more vigorous sessions or longer durations for increased calorie burn.',
    );
    expect(scrollIntoView).toHaveBeenCalledWith({
      behavior: 'smooth',
      block: 'start',
    });
  });

  it('shares only the computed result and prints without exposing inputs', async () => {
    const share = vi.fn(async (_content: ShareContent) => {});
    const onPrint = vi.fn();
    const user = userEvent.setup();
    render(
      <YogaCalorieCalculator shareEnvironment={{share}} onPrint={onPrint} />,
    );

    await fillYoga(user);
    await submitYoga(user);
    await user.click(screen.getByRole('button', {name: 'Share results'}));

    await waitFor(() => expect(share).toHaveBeenCalledOnce());
    const content = share.mock.calls[0]?.[0];

    expect(content?.title).toBe('Yoga Calorie Calculator Results');
    expect(content?.text).toBe(
      'I burned 276 calories during my yoga practice! Calculate your yoga calories at Sports Tools Hub!',
    );
    expect(content?.text).not.toContain('70');
    expect(content?.text).not.toContain('30');
    expect(content?.text).not.toContain('60');
    expect(content?.url).toBe(window.location.href);

    await user.click(screen.getByRole('button', {name: 'Print Results'}));
    expect(onPrint).toHaveBeenCalledOnce();
  });

  it('validates with the source message before calculating', async () => {
    const user = userEvent.setup();
    render(<YogaCalorieCalculator />);

    await submitYoga(user);

    const alerts = screen.getAllByRole('alert');
    expect(alerts).toHaveLength(5);
    expect(
      alerts.every(
        (alert) => alert.textContent === 'Please fill in all required fields.',
      ),
    ).toBe(true);
    expect(scrollIntoView).not.toHaveBeenCalled();

    await fillYoga(user);
    await user.type(
      screen.getByRole('spinbutton', {name: 'Room Temperature'}),
      '100',
    );
    await submitYoga(user);

    expect(
      screen.getByText('Please enter a valid room temperature (15-45).'),
    ).toBeTruthy();
  });
});
