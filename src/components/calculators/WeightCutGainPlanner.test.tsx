// @vitest-environment jsdom
import {cleanup, fireEvent, render, screen, waitFor} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {afterEach, beforeEach, describe, expect, it, vi} from 'vitest';
import {WeightCutGainPlanner} from './WeightCutGainPlanner';

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

async function fillWeightPlan(user: ReturnType<typeof userEvent.setup>) {
  await user.type(screen.getByRole('spinbutton', {name: 'Age'}), '28');
  await user.type(
    screen.getByRole('spinbutton', {name: 'Current Weight (kg)'}),
    '80',
  );
  await user.type(
    screen.getByRole('spinbutton', {name: 'Height (cm)'}),
    '180',
  );
  await user.selectOptions(
    screen.getByRole('combobox', {name: 'Activity Level'}),
    'moderate',
  );
  await user.selectOptions(
    screen.getByRole('combobox', {name: 'Goal Type'}),
    'weight-loss',
  );
  await user.type(
    screen.getByRole('spinbutton', {name: 'Target Weight (kg)'}),
    '74',
  );
  fireEvent.change(screen.getByLabelText(/Target Date/), {
    target: {value: '2027-06-01'},
  });
  await user.selectOptions(
    screen.getByRole('combobox', {name: 'Priority Level'}),
    'moderate',
  );
  await user.selectOptions(
    screen.getByRole('combobox', {name: 'Sport/Training Type'}),
    'powerlifting',
  );
}

describe('WeightCutGainPlanner', () => {
  it('builds the weekly targets, phases, and risk assessment', async () => {
    const user = userEvent.setup({delay: null});
    render(<WeightCutGainPlanner />);

    await fillWeightPlan(user);
    await user.click(
      screen.getByRole('button', {name: 'Generate Weight Plan'}),
    );

    await waitFor(() =>
      expect(
        screen.getByRole('region', {
          name: 'Your Personalized Weight Change Plan',
        }).textContent,
      ).toContain('-0.6 kg per week'),
    );

    const result = screen.getByRole('region', {
      name: 'Your Personalized Weight Change Plan',
    });
    expect(result.textContent).toContain('-660 cal per day');
    expect(result.textContent).toContain('10 weeks');
    expect(result.textContent).toContain('Phase 1 - Adaptation');
    expect(result.textContent).toContain('Phase 3 - Consolidation');
    expect(result.textContent).toContain('Protein Target');
    expect(result.textContent).toContain('Weigh Daily, Judge Weekly');
    expect(result.textContent).toContain('Risk Assessment');
  });

  it('switches to a lean-gain plan with a calorie surplus', async () => {
    const user = userEvent.setup({delay: null});
    render(<WeightCutGainPlanner />);

    await fillWeightPlan(user);
    await user.selectOptions(
      screen.getByRole('combobox', {name: 'Goal Type'}),
      'weight-gain',
    );
    await user.selectOptions(
      screen.getByRole('combobox', {name: 'Priority Level'}),
      'conservative',
    );
    await user.click(
      screen.getByRole('button', {name: 'Generate Weight Plan'}),
    );

    await waitFor(() =>
      expect(
        screen.getByRole('region', {
          name: 'Your Personalized Weight Change Plan',
        }).textContent,
      ).toContain('+0.2 kg per week'),
    );

    const result = screen.getByRole('region', {
      name: 'Your Personalized Weight Change Plan',
    });
    expect(result.textContent).toContain('+220 cal per day');
    expect(result.textContent).toContain('Phase 1 - Surplus Ramp');
    expect(result.textContent).toContain('Progressive Overload First');
  });

  it('raises the risk level for medical conditions and no support', async () => {
    const user = userEvent.setup({delay: null});
    render(<WeightCutGainPlanner />);

    await fillWeightPlan(user);
    await user.selectOptions(
      screen.getByRole('combobox', {name: 'Medical Conditions'}),
      'diabetes',
    );
    await user.selectOptions(
      screen.getByRole('combobox', {name: 'Current Medications'}),
      'metabolism',
    );
    await user.click(
      screen.getByRole('button', {name: 'Generate Weight Plan'}),
    );

    await waitFor(() =>
      expect(
        screen.getByRole('region', {
          name: 'Your Personalized Weight Change Plan',
        }).textContent,
      ).toContain('High'),
    );

    const result = screen.getByRole('region', {
      name: 'Your Personalized Weight Change Plan',
    });
    expect(result.textContent).toContain(
      'A medical condition is present',
    );
    expect(result.textContent).toContain(
      'Current medications affect metabolism or hormones',
    );
  });

  it('validates the required weight change fields', async () => {
    const user = userEvent.setup({delay: null});
    render(<WeightCutGainPlanner />);

    await user.click(
      screen.getByRole('button', {name: 'Generate Weight Plan'}),
    );

    expect(
      screen.getByText('Please enter an age between 16 and 80.'),
    ).toBeTruthy();
    expect(
      screen.getByText(
        'Please enter a current weight between 40 and 300 kg.',
      ),
    ).toBeTruthy();
    expect(
      screen.getByText('Please select your goal type.'),
    ).toBeTruthy();
    expect(
      screen.getByText('Please enter a target date.'),
    ).toBeTruthy();
  });
});
