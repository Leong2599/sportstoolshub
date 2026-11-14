// @vitest-environment jsdom
import {cleanup, render, screen, waitFor, within} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {afterEach, beforeEach, describe, expect, it, vi} from 'vitest';
import type {ShareContent} from '../../lib/calculators/share';
import {InjuryRiskCalculator} from './InjuryRiskCalculator';

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

async function submitInjury(user: ReturnType<typeof userEvent.setup>) {
  await user.click(
    screen.getByRole('button', {name: 'Calculate Injury Risk'}),
  );
}

describe('InjuryRiskCalculator', () => {
  it('computes the source risk assessment end-to-end', async () => {
    const user = userEvent.setup({delay: null});
    render(<InjuryRiskCalculator />);

    await user.type(screen.getByRole('spinbutton', {name: 'Age'}), '30');
    await user.click(
      within(screen.getByRole('group', {name: 'Gender'})).getByRole('radio', {
        name: 'Male',
      }),
    );
    await user.selectOptions(
      screen.getByRole('combobox', {name: 'Primary Sport'}),
      'running',
    );
    await user.selectOptions(
      screen.getByRole('combobox', {name: 'Experience Level'}),
      'intermediate',
    );
    await user.type(
      screen.getByRole('spinbutton', {name: 'Training Sessions per Week'}),
      '3',
    );
    await user.type(
      screen.getByRole('spinbutton', {name: 'Average Session Duration'}),
      '60',
    );
    await user.selectOptions(
      screen.getByRole('combobox', {name: 'Typical Training Intensity'}),
      'moderate',
    );
    await user.selectOptions(
      screen.getByRole('combobox', {name: 'Warm-up Routine'}),
      'moderate',
    );
    await user.selectOptions(
      screen.getByRole('combobox', {name: 'Cool-down Routine'}),
      'moderate',
    );
    await user.selectOptions(
      screen.getByRole('combobox', {name: 'Flexibility Level'}),
      'average',
    );
    await user.selectOptions(
      screen.getByRole('combobox', {name: 'Strength Level'}),
      'average',
    );
    await user.selectOptions(
      screen.getByRole('combobox', {name: 'Balance and Stability'}),
      'average',
    );
    await user.selectOptions(
      screen.getByRole('combobox', {name: 'Body Weight Status'}),
      'normal',
    );
    await user.type(
      screen.getByRole('spinbutton', {name: 'Average Sleep per Night'}),
      '8',
    );
    await user.selectOptions(
      screen.getByRole('combobox', {name: 'Stress Level'}),
      'low',
    );
    await user.selectOptions(
      screen.getByRole('combobox', {name: 'Nutrition Quality'}),
      'good',
    );
    await user.selectOptions(
      screen.getByRole('combobox', {name: 'Hydration Habits'}),
      'good',
    );
    await submitInjury(user);

    await waitFor(() =>
      expect(
        screen.getByRole('region', {
          name: 'Your Injury Risk Assessment',
        }).textContent,
      ).toContain('15%'),
    );

    const result = screen.getByRole('region', {
      name: 'Your Injury Risk Assessment',
    });
    expect(result.textContent).toContain('Very Low Risk');
    expect(result.textContent).toContain('Personal Factors');
    expect(result.textContent).toContain('Training Factors');
    expect(result.textContent).toContain('Physical Condition');
    expect(result.textContent).toContain('Injury History');
    expect(result.textContent).toContain('Lifestyle Factors');
    expect(result.textContent).toContain(
      'your overall injury risk is 15%',
    );
    expect(scrollIntoView).toHaveBeenCalledWith({
      behavior: 'smooth',
      block: 'start',
    });
  }, 20000);

  it('shares only the computed result and prints without exposing inputs', async () => {
    const share = vi.fn(async (_content: ShareContent) => {});
    const onPrint = vi.fn();
    const user = userEvent.setup({delay: null});
    render(
      <InjuryRiskCalculator shareEnvironment={{share}} onPrint={onPrint} />,
    );

    await user.type(screen.getByRole('spinbutton', {name: 'Age'}), '30');
    await user.click(
      within(screen.getByRole('group', {name: 'Gender'})).getByRole('radio', {
        name: 'Male',
      }),
    );
    await user.selectOptions(
      screen.getByRole('combobox', {name: 'Primary Sport'}),
      'running',
    );
    await submitInjury(user);
    await user.click(screen.getByRole('button', {name: 'Share results'}));

    await waitFor(() => expect(share).toHaveBeenCalledOnce());
    const content = share.mock.calls[0]?.[0];

    expect(content?.title).toBe('Sports Injury Risk Calculator Results');
    expect(content?.text).toBe(
      'My injury risk is 44% (Moderate Risk). Assess your sports injury risk at Sports Tools Hub!',
    );
    expect(content?.text).not.toContain('30');
    expect(content?.url).toBe(window.location.href);

    await user.click(screen.getByRole('button', {name: 'Print Results'}));
    expect(onPrint).toHaveBeenCalledOnce();
  }, 20000);

  it('validates with the source messages before calculating', async () => {
    const user = userEvent.setup({delay: null});
    render(<InjuryRiskCalculator />);

    await submitInjury(user);

    expect(
      screen.getAllByText('Please fill in all required fields.').length,
    ).toBeGreaterThan(0);
    expect(
      screen.getByText('Please enter a valid age (13-100).'),
    ).toBeTruthy();
    expect(scrollIntoView).not.toHaveBeenCalled();
  }, 20000);
});
