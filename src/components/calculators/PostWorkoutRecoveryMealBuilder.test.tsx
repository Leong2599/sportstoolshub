// @vitest-environment jsdom
import {cleanup, render, screen, waitFor} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {afterEach, beforeEach, describe, expect, it, vi} from 'vitest';
import {PostWorkoutRecoveryMealBuilder} from './PostWorkoutRecoveryMealBuilder';

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

async function fillPostWorkout(user: ReturnType<typeof userEvent.setup>) {
  await user.type(
    screen.getByRole('spinbutton', {name: 'Current Weight (kg)'}),
    '75',
  );
  await user.selectOptions(
    screen.getByRole('combobox', {name: 'Fitness Level'}),
    'intermediate',
  );
  await user.selectOptions(
    screen.getByRole('combobox', {name: 'Primary Training Goal'}),
    'muscle-gain',
  );
  await user.selectOptions(
    screen.getByRole('combobox', {name: 'Workout Type'}),
    'strength',
  );
  await user.type(
    screen.getByRole('spinbutton', {name: 'Duration (minutes)'}),
    '60',
  );
  await user.clear(
    screen.getByRole('spinbutton', {name: 'Workout Intensity (1-10)'}),
  );
  await user.type(
    screen.getByRole('spinbutton', {name: 'Workout Intensity (1-10)'}),
    '5',
  );
  await user.selectOptions(
    screen.getByRole('combobox', {name: 'Next Workout In'}),
    '24hours',
  );
}

describe('PostWorkoutRecoveryMealBuilder', () => {
  it('produces the source recovery macros, timing, and rehydration targets', async () => {
    const user = userEvent.setup({delay: null});
    render(<PostWorkoutRecoveryMealBuilder />);

    await fillPostWorkout(user);
    await user.click(
      screen.getByRole('button', {name: 'Build Recovery Meal'}),
    );

    await waitFor(() =>
      expect(
        screen.getByRole('region', {name: 'Your Recovery Nutrition Plan'})
          .textContent,
      ).toContain('23g'),
    );

    const result = screen.getByRole('region', {
      name: 'Your Recovery Nutrition Plan',
    });
    expect(result.textContent).toContain('60g');
    expect(result.textContent).toContain('3:1');
    expect(result.textContent).toContain('332 cal');
    expect(result.textContent).toContain('Immediate Recovery Window');
    expect(result.textContent).toContain(
      'Perfect timing! This is when muscle protein synthesis is highest.',
    );
    expect(result.textContent).toContain('900ml');
    expect(result.textContent).toContain('1350ml');
    expect(result.textContent).toContain('Quick Recovery Options');
    expect(result.textContent).toContain('Optional - Creatine');
  });

  it('uses the plant-based recovery meals for a vegan athlete', async () => {
    const user = userEvent.setup({delay: null});
    render(<PostWorkoutRecoveryMealBuilder />);

    await fillPostWorkout(user);
    await user.selectOptions(
      screen.getByRole('combobox', {name: 'Dietary Restrictions'}),
      'vegan',
    );
    await user.click(
      screen.getByRole('button', {name: 'Build Recovery Meal'}),
    );

    await waitFor(() =>
      expect(
        screen.getByRole('region', {name: 'Your Recovery Nutrition Plan'})
          .textContent,
      ).toContain('Plant-Based Recovery'),
    );

    const result = screen.getByRole('region', {
      name: 'Your Recovery Nutrition Plan',
    });
    expect(result.textContent).toContain(
      'Plant protein shake with banana',
    );
    expect(result.textContent).not.toContain('Quick Recovery Options');
  });

  it('validates the required recovery details', async () => {
    const user = userEvent.setup({delay: null});
    render(<PostWorkoutRecoveryMealBuilder />);

    await user.click(
      screen.getByRole('button', {name: 'Build Recovery Meal'}),
    );

    expect(screen.getByText('Please enter a valid body weight.')).toBeTruthy();
    expect(
      screen.getByText('Please select your fitness level.'),
    ).toBeTruthy();
    expect(
      screen.getByText('Please select your primary training goal.'),
    ).toBeTruthy();
    expect(
      screen.getByText('Please select a workout type.'),
    ).toBeTruthy();
    expect(
      screen.getByText('Please enter a valid workout duration.'),
    ).toBeTruthy();
    expect(
      screen.getByText('Please select when your next workout is.'),
    ).toBeTruthy();
  });
});
