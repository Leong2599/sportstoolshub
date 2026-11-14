// @vitest-environment jsdom
import {cleanup, render, screen, waitFor, within} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {afterEach, beforeEach, describe, expect, it, vi} from 'vitest';
import type {ShareContent} from '../../lib/calculators/share';
import {CalorieCalculator} from './CalorieCalculator';

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

async function fillCalorie(user: ReturnType<typeof userEvent.setup>) {
  await user.type(screen.getByRole('spinbutton', {name: 'Age'}), '30');
  await user.click(
    within(screen.getByRole('group', {name: 'Gender'})).getByRole('radio', {
      name: 'Male',
    }),
  );
  await user.type(screen.getByRole('spinbutton', {name: 'Weight'}), '80');
  await user.type(screen.getByRole('spinbutton', {name: 'Height'}), '180');
  await user.selectOptions(screen.getByRole('combobox', {name: 'Activity Level'}), 'moderate');
  await user.selectOptions(screen.getByRole('combobox', {name: 'Fitness Goal'}), 'maintain');
}

async function submitCalorie(user: ReturnType<typeof userEvent.setup>) {
  await user.click(screen.getByRole('button', {name: 'Calculate Calories'}));
}

describe('CalorieCalculator', () => {
  it('computes the source metric maintenance example end-to-end', async () => {
    const user = userEvent.setup();
    render(<CalorieCalculator />);

    await fillCalorie(user);
    await submitCalorie(user);

    await waitFor(() =>
      expect(
        screen.getByRole('region', {name: 'Your Calorie Results'}).textContent,
      ).toContain('2759 cal'),
    );

    const result = screen.getByRole('region', {
      name: 'Your Calorie Results',
    });
    expect(result.textContent).toContain('Maintain current weight');
    expect(result.textContent).toContain('1780 cal');
    expect(result.textContent).toContain('2759 cal');
    expect(result.textContent).toContain('Recommended Daily Calories');
    expect(result.textContent).toContain('207g');
    expect(result.textContent).toContain('276g');
    expect(result.textContent).toContain('92g');
    expect(scrollIntoView).toHaveBeenCalledWith({
      behavior: 'smooth',
      block: 'start',
    });
  });

  it('computes the source imperial example end-to-end', async () => {
    const user = userEvent.setup();
    render(<CalorieCalculator />);

    await user.type(screen.getByRole('spinbutton', {name: 'Age'}), '30');
    await user.click(
      within(screen.getByRole('group', {name: 'Gender'})).getByRole('radio', {
        name: 'Male',
      }),
    );
    await user.type(screen.getByRole('spinbutton', {name: 'Weight'}), '176');
    await user.selectOptions(screen.getByRole('combobox', {name: 'Weight unit'}), 'lbs');
    await user.selectOptions(screen.getByRole('combobox', {name: 'Height unit'}), 'ft');
    await user.type(screen.getByRole('spinbutton', {name: 'Feet'}), '5');
    await user.type(screen.getByRole('spinbutton', {name: 'Inches'}), '11');
    await user.selectOptions(screen.getByRole('combobox', {name: 'Activity Level'}), 'moderate');
    await user.selectOptions(screen.getByRole('combobox', {name: 'Fitness Goal'}), 'maintain');
    await submitCalorie(user);

    await waitFor(() =>
      expect(
        screen.getByRole('region', {name: 'Your Calorie Results'}).textContent,
      ).toContain('2760 cal'),
    );
  });

  it('shares only the computed result and prints without exposing inputs', async () => {
    const share = vi.fn(async (_content: ShareContent) => {});
    const onPrint = vi.fn();
    const user = userEvent.setup();
    render(<CalorieCalculator shareEnvironment={{share}} onPrint={onPrint} />);

    await fillCalorie(user);
    await submitCalorie(user);
    await user.click(screen.getByRole('button', {name: 'Share results'}));

    await waitFor(() => expect(share).toHaveBeenCalledOnce());
    const content = share.mock.calls[0]?.[0];

    expect(content?.title).toBe('Calorie Calculator Results');
    expect(content?.text).toBe(
      'My recommended daily calories are 2759 (Maintain current weight). Calculate yours at Sports Tools Hub!',
    );
    expect(content?.text).not.toContain('30');
    expect(content?.text).not.toContain('80');
    expect(content?.text).not.toContain('180');
    expect(content?.url).toBe(window.location.href);

    await user.click(screen.getByRole('button', {name: 'Print Results'}));
    expect(onPrint).toHaveBeenCalledOnce();
  });

  it('validates with the source messages before calculating', async () => {
    const user = userEvent.setup();
    render(<CalorieCalculator />);

    await submitCalorie(user);

    expect(screen.getByText('Please enter a valid age (15-100).')).toBeTruthy();
    expect(screen.getByText('Please select your gender.')).toBeTruthy();
    expect(screen.getByText('Please enter a valid weight (min 30).')).toBeTruthy();
    expect(
      screen.getByText('Please enter a valid height in cm (50-300).'),
    ).toBeTruthy();
    expect(
      screen.getByText('Please select your activity level.'),
    ).toBeTruthy();
    expect(screen.getByText('Please select your fitness goal.')).toBeTruthy();
    expect(scrollIntoView).not.toHaveBeenCalled();
  });
});
