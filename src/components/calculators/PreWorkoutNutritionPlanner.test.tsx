// @vitest-environment jsdom
import {cleanup, fireEvent, render, screen, waitFor} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {afterEach, beforeEach, describe, expect, it, vi} from 'vitest';
import {PreWorkoutNutritionPlanner} from './PreWorkoutNutritionPlanner';

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

async function fillPreWorkout(user: ReturnType<typeof userEvent.setup>) {
  await user.type(
    screen.getByRole('spinbutton', {name: 'Body Weight (kg)'}),
    '75',
  );
  await user.selectOptions(
    screen.getByRole('combobox', {name: 'Workout Type'}),
    'strength',
  );
  await user.type(
    screen.getByRole('spinbutton', {name: 'Duration (minutes)'}),
    '60',
  );
  await user.selectOptions(
    screen.getByRole('combobox', {name: 'Intensity Level'}),
    'moderate',
  );
  fireEvent.change(screen.getByLabelText(/Workout Start Time/), {
    target: {value: '17:00'},
  });
  await user.selectOptions(
    screen.getByRole('combobox', {name: 'Primary Goal'}),
    'performance',
  );
  await user.selectOptions(
    screen.getByRole('combobox', {name: 'Digestive Comfort Priority'}),
    'moderate',
  );
}

describe('PreWorkoutNutritionPlanner', () => {
  it('produces the source macro targets, timeline, and meal suggestions', async () => {
    const user = userEvent.setup({delay: null});
    render(<PreWorkoutNutritionPlanner />);

    await fillPreWorkout(user);
    await user.click(
      screen.getByRole('button', {name: 'Generate Nutrition Plan'}),
    );

    await waitFor(() =>
      expect(
        screen.getByRole('region', {name: 'Your Pre-Workout Nutrition Plan'})
          .textContent,
      ).toContain('75g'),
    );

    const result = screen.getByRole('region', {
      name: 'Your Pre-Workout Nutrition Plan',
    });
    expect(result.textContent).toContain('30g');
    expect(result.textContent).toContain('420 cal');
    expect(result.textContent).toContain('5.6 cal/kg');
    expect(result.textContent).toContain('3-4 hours before');
    expect(result.textContent).toContain('Optional light snack');
    expect(result.textContent).toContain('Quick Energy Sources');
    expect(result.textContent).toContain('Greek yogurt');
    expect(result.textContent).toContain('500-600ml water');
  });

  it('swaps in the plant-based suggestions for a vegan athlete', async () => {
    const user = userEvent.setup({delay: null});
    render(<PreWorkoutNutritionPlanner />);

    await fillPreWorkout(user);
    await user.selectOptions(
      screen.getByRole('combobox', {name: 'Dietary Restrictions'}),
      'vegan',
    );
    await user.click(
      screen.getByRole('button', {name: 'Generate Nutrition Plan'}),
    );

    await waitFor(() =>
      expect(
        screen.getByRole('region', {name: 'Your Pre-Workout Nutrition Plan'})
          .textContent,
      ).toContain('Plant-Based Options'),
    );

    const result = screen.getByRole('region', {
      name: 'Your Pre-Workout Nutrition Plan',
    });
    expect(result.textContent).toContain('Oatmeal with banana and nut butter');
    expect(result.textContent).not.toContain('Quick Energy Sources');
  });

  it('validates the required training details', async () => {
    const user = userEvent.setup({delay: null});
    render(<PreWorkoutNutritionPlanner />);

    await user.click(
      screen.getByRole('button', {name: 'Generate Nutrition Plan'}),
    );

    expect(screen.getByText('Please enter a valid body weight.')).toBeTruthy();
    expect(
      screen.getByText('Please select a workout type.'),
    ).toBeTruthy();
    expect(
      screen.getByText('Please enter a valid workout duration.'),
    ).toBeTruthy();
    expect(
      screen.getByText('Please select an intensity level.'),
    ).toBeTruthy();
    expect(
      screen.getByText('Please enter your workout start time.'),
    ).toBeTruthy();
  });
});
