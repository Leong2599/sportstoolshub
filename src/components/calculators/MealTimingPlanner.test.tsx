// @vitest-environment jsdom
import {cleanup, fireEvent, render, screen, waitFor} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {afterEach, beforeEach, describe, expect, it, vi} from 'vitest';
import type {ShareContent} from '../../lib/calculators/share';
import {MealTimingPlanner} from './MealTimingPlanner';

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

async function fillMealTiming(user: ReturnType<typeof userEvent.setup>) {
  await user.selectOptions(
    screen.getByRole('combobox', {name: 'Primary Fitness Goal'}),
    'muscle-gain',
  );
  await user.selectOptions(
    screen.getByRole('combobox', {name: 'Workout Schedule'}),
    'evening',
  );
  await user.selectOptions(
    screen.getByRole('combobox', {name: 'Typical Workout Duration'}),
    'medium',
  );
  await user.selectOptions(
    screen.getByRole('combobox', {name: 'Workout Intensity'}),
    'high',
  );
  await user.selectOptions(
    screen.getByRole('combobox', {name: 'Daily Meal Frequency'}),
    '5',
  );
  fireEvent.change(screen.getByLabelText(/Typical Wake-Up Time/), {
    target: {value: '07:00'},
  });
  fireEvent.change(screen.getByLabelText(/Typical Bedtime/), {
    target: {value: '23:00'},
  });
}

describe('MealTimingPlanner', () => {
  it('builds the source schedule, timeline, and guidelines', async () => {
    const user = userEvent.setup({delay: null});
    render(<MealTimingPlanner />);

    await fillMealTiming(user);
    await user.click(
      screen.getByRole('button', {name: 'Create Meal Plan'}),
    );

    await waitFor(() =>
      expect(
        screen.getByRole('region', {name: 'Your Personalized Meal Timing Plan'})
          .textContent,
      ).toContain('MUSCLE GAIN'),
    );

    const result = screen.getByRole('region', {
      name: 'Your Personalized Meal Timing Plan',
    });
    expect(result.textContent).toContain('EVENING');
    expect(result.textContent).toContain('5 per day');
    expect(result.textContent).toContain('07:00 - 23:00');
    expect(result.textContent).toContain('16:36');
    expect(result.textContent).toContain('Post-Workout Shake/Meal');
    expect(result.textContent).toContain('25-35g per meal');
    expect(result.textContent).toContain('Consistency is Key');
    expect(result.textContent).toContain('Workout Fuel');
  });

  it('shares the plan summary and prints', async () => {
    const share = vi.fn(async (_content: ShareContent) => {});
    const onPrint = vi.fn();
    const user = userEvent.setup({delay: null});
    render(
      <MealTimingPlanner shareEnvironment={{share}} onPrint={onPrint} />,
    );

    await fillMealTiming(user);
    await user.click(
      screen.getByRole('button', {name: 'Create Meal Plan'}),
    );
    await user.click(screen.getByRole('button', {name: 'Share Plan'}));

    await waitFor(() => expect(share).toHaveBeenCalledOnce());
    const content = share.mock.calls[0]?.[0];

    expect(content?.title).toBe('Meal Timing Plan Results');
    expect(content?.text).toBe(
      'My meal timing plan for muscle-gain with 5 meals per day. Create yours at Sports Tools Hub!',
    );
    expect(content?.url).toBe(window.location.href);

    await user.click(screen.getByRole('button', {name: 'Print Plan'}));
    expect(onPrint).toHaveBeenCalledOnce();
  });

  it('validates the required meal timing fields', async () => {
    const user = userEvent.setup({delay: null});
    render(<MealTimingPlanner />);

    await user.click(
      screen.getByRole('button', {name: 'Create Meal Plan'}),
    );

    expect(
      screen.getByText('Please select your primary fitness goal.'),
    ).toBeTruthy();
    expect(
      screen.getByText('Please select your workout schedule.'),
    ).toBeTruthy();
    expect(
      screen.getByText('Please select your typical workout duration.'),
    ).toBeTruthy();
    expect(
      screen.getByText('Please select your workout intensity.'),
    ).toBeTruthy();
    expect(
      screen.getByText(
        'Please select a valid daily meal frequency (3-6).',
      ),
    ).toBeTruthy();
    expect(
      screen.getByText('Please enter your typical wake-up time.'),
    ).toBeTruthy();
    expect(
      screen.getByText('Please enter your typical bedtime.'),
    ).toBeTruthy();
  });
});
