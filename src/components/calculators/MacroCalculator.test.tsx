// @vitest-environment jsdom
import {cleanup, render, screen, waitFor} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {afterEach, beforeEach, describe, expect, it, vi} from 'vitest';
import type {ShareContent} from '../../lib/calculators/share';
import {MacroCalculator} from './MacroCalculator';

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

async function chooseManual(user: ReturnType<typeof userEvent.setup>) {
  await user.selectOptions(
    screen.getByRole('combobox', {name: 'Calculation Method'}),
    'manual',
  );
  await user.type(
    screen.getByRole('spinbutton', {name: 'Daily Calorie Target'}),
    '2500',
  );
}

describe('MacroCalculator', () => {
  it('computes the manual calorie macro breakdown end-to-end', async () => {
    const user = userEvent.setup({delay: null});
    render(<MacroCalculator />);

    await chooseManual(user);
    await user.selectOptions(
      screen.getByRole('combobox', {name: 'Fitness Goal'}),
      'maintain',
    );
    await user.click(screen.getByRole('button', {name: 'Calculate Macros'}));

    await waitFor(() =>
      expect(
        screen.getByRole('region', {name: 'Your Macronutrient Results'})
          .textContent,
      ).toContain('2500 cal'),
    );

    const result = screen.getByRole('region', {
      name: 'Your Macronutrient Results',
    });
    expect(result.textContent).toContain('188g');
    expect(result.textContent).toContain('250g');
    expect(result.textContent).toContain('83g');
    expect(result.textContent).toContain('30%');
    expect(result.textContent).toContain('40%');
    expect(result.textContent).toContain('Breakfast');
    expect(result.textContent).toContain('P: 47g');
    expect(result.textContent).toContain('C: 63g');
    expect(result.textContent).toContain('F: 21g');
    expect(result.textContent).toContain('Protein Sources');
    expect(result.textContent).toContain('Nutrition Recommendations');
  });

  it('uses the source TDEE method for the calorie target', async () => {
    const user = userEvent.setup({delay: null});
    render(<MacroCalculator />);

    await user.selectOptions(
      screen.getByRole('combobox', {name: 'Calculation Method'}),
      'tdee',
    );
    await user.type(
      screen.getByRole('spinbutton', {name: 'Body Weight'}),
      '80',
    );
    await user.type(screen.getByRole('spinbutton', {name: 'Height'}), '180');
    await user.type(screen.getByRole('spinbutton', {name: 'Age'}), '30');
    await user.click(screen.getByRole('radio', {name: 'Male'}));
    await user.selectOptions(
      screen.getByRole('combobox', {name: 'Activity Level'}),
      'moderate',
    );
    await user.selectOptions(
      screen.getByRole('combobox', {name: 'Fitness Goal'}),
      'lose-weight',
    );
    await user.click(screen.getByRole('button', {name: 'Calculate Macros'}));

    await waitFor(() =>
      expect(
        screen.getByRole('region', {name: 'Your Macronutrient Results'})
          .textContent,
      ).toContain('2873 cal'),
    );

    const result = screen.getByRole('region', {
      name: 'Your Macronutrient Results',
    });
    expect(result.textContent).toContain('287g');
    expect(result.textContent).toContain('215g');
    expect(result.textContent).toContain('96g');
  });

  it('shares only the computed result and prints', async () => {
    const share = vi.fn(async (_content: ShareContent) => {});
    const onPrint = vi.fn();
    const user = userEvent.setup({delay: null});
    render(<MacroCalculator shareEnvironment={{share}} onPrint={onPrint} />);

    await chooseManual(user);
    await user.selectOptions(
      screen.getByRole('combobox', {name: 'Fitness Goal'}),
      'maintain',
    );
    await user.click(screen.getByRole('button', {name: 'Calculate Macros'}));
    await user.click(screen.getByRole('button', {name: 'Share results'}));

    await waitFor(() => expect(share).toHaveBeenCalledOnce());
    const content = share.mock.calls[0]?.[0];

    expect(content?.title).toBe('Macro Calculator Results');
    expect(content?.text).toBe(
      'My daily macros are 2500 cal: P:188g, C:250g, F:83g. Calculate yours at Sports Tools Hub!',
    );
    expect(content?.url).toBe(window.location.href);

    await user.click(screen.getByRole('button', {name: 'Print Results'}));
    expect(onPrint).toHaveBeenCalledOnce();
  });

  it('validates custom ratios that do not total 100%', async () => {
    const user = userEvent.setup({delay: null});
    render(<MacroCalculator />);

    await chooseManual(user);
    await user.selectOptions(
      screen.getByRole('combobox', {name: 'Fitness Goal'}),
      'custom',
    );
    await user.type(
      screen.getByRole('spinbutton', {name: 'Protein Percentage (%)'}),
      '30',
    );
    await user.type(
      screen.getByRole('spinbutton', {name: 'Carbohydrates Percentage (%)'}),
      '40',
    );
    await user.type(
      screen.getByRole('spinbutton', {name: 'Fat Percentage (%)'}),
      '20',
    );
    await user.click(screen.getByRole('button', {name: 'Calculate Macros'}));

    expect(
      screen.getByText(
        'Custom macro percentages must total 100% (currently 90%).',
      ),
    ).toBeTruthy();
    expect(scrollIntoView).not.toHaveBeenCalled();
  });
});
