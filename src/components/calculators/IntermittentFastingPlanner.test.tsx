// @vitest-environment jsdom
import {cleanup, render, screen, waitFor} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {afterEach, beforeEach, describe, expect, it, vi} from 'vitest';
import {IntermittentFastingPlanner} from './IntermittentFastingPlanner';

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

async function fillFasting(user: ReturnType<typeof userEvent.setup>) {
  await user.type(screen.getByRole('spinbutton', {name: 'Age'}), '32');
  await user.type(
    screen.getByRole('spinbutton', {name: 'Current Weight (kg)'}),
    '80',
  );
  await user.type(
    screen.getByRole('spinbutton', {name: 'Target Weight (kg)'}),
    '72',
  );
  await user.selectOptions(
    screen.getByRole('combobox', {name: 'Fasting Experience'}),
    'beginner',
  );
  await user.selectOptions(
    screen.getByRole('combobox', {name: 'Training Days per Week'}),
    '4',
  );
  await user.selectOptions(
    screen.getByRole('combobox', {name: 'Primary Training Type'}),
    'strength',
  );
  await user.selectOptions(
    screen.getByRole('combobox', {name: 'Preferred Training Time'}),
    'morning',
  );
  await user.selectOptions(
    screen.getByRole('combobox', {name: 'Training Intensity'}),
    'moderate',
  );
  await user.click(screen.getByRole('checkbox', {name: 'Monday'}));
  await user.click(screen.getByRole('checkbox', {name: 'Wednesday'}));
  await user.selectOptions(
    screen.getByRole('combobox', {name: 'Primary Goal'}),
    'fat-loss',
  );
}

describe('IntermittentFastingPlanner', () => {
  it('builds the recommended method, weekly schedule, and guidance', async () => {
    const user = userEvent.setup({delay: null});
    render(<IntermittentFastingPlanner />);

    await fillFasting(user);
    await user.click(
      screen.getByRole('button', {name: 'Generate IF Schedule'}),
    );

    await waitFor(() =>
      expect(
        screen.getByRole('region', {name: 'Your Personalized IF Schedule'})
          .textContent,
      ).toContain('16:8'),
    );

    const result = screen.getByRole('region', {
      name: 'Your Personalized IF Schedule',
    });
    expect(result.textContent).toContain('16:8 Method');
    expect(result.textContent).toContain('160g');
    expect(result.textContent).toContain('10:00 - 18:00');
    expect(result.textContent).toContain('12:00 - 20:00');
    expect(result.textContent).toContain('Train Fasted');
    expect(result.textContent).toContain('Protein Per Meal');
    expect(result.textContent).toContain('Start With The Easiest Window');
  });

  it('reveals the custom fast inputs for a custom schedule', async () => {
    const user = userEvent.setup({delay: null});
    render(<IntermittentFastingPlanner />);

    expect(
      screen.queryByRole('spinbutton', {name: 'Fast Length (hours)'}),
    ).toBeNull();

    await user.selectOptions(
      screen.getByRole('combobox', {name: 'Preferred IF Method'}),
      'custom',
    );

    expect(
      screen.getByRole('spinbutton', {name: 'Fast Length (hours)'}),
    ).toBeTruthy();
    expect(
      screen.getByRole('spinbutton', {name: 'Eating Window (hours)'}),
    ).toBeTruthy();
  });

  it('validates the required fasting profile fields', async () => {
    const user = userEvent.setup({delay: null});
    render(<IntermittentFastingPlanner />);

    await user.click(
      screen.getByRole('button', {name: 'Generate IF Schedule'}),
    );

    expect(
      screen.getByText('Please enter an age between 18 and 80.'),
    ).toBeTruthy();
    expect(
      screen.getByText('Please enter a current weight between 40 and 200 kg.'),
    ).toBeTruthy();
    expect(
      screen.getByText('Please select your fasting experience level.'),
    ).toBeTruthy();
    expect(
      screen.getByText('Please select at least one training day.'),
    ).toBeTruthy();
    expect(
      screen.getByText('Please select your primary goal.'),
    ).toBeTruthy();
  });
});
