// @vitest-environment jsdom
import {cleanup, render, screen, waitFor} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {afterEach, beforeEach, describe, expect, it, vi} from 'vitest';
import {GlycemicLoadCalculator} from './GlycemicLoadCalculator';

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

async function addFood(
  user: ReturnType<typeof userEvent.setup>,
  food: string,
  amount: string,
) {
  await user.selectOptions(
    screen.getByRole('combobox', {name: 'Select Food'}),
    food,
  );
  await user.type(
    screen.getByRole('spinbutton', {name: 'Amount (grams)'}),
    amount,
  );
  await user.click(screen.getByRole('button', {name: 'Add Food'}));
}

describe('GlycemicLoadCalculator', () => {
  it('builds a meal and reports the source glycemic load details', async () => {
    const user = userEvent.setup({delay: null});
    render(<GlycemicLoadCalculator />);

    await addFood(user, 'white-rice', '100');
    await user.click(
      screen.getByRole('button', {name: 'Calculate Glycemic Load'}),
    );

    await waitFor(() =>
      expect(
        screen.getByRole('region', {name: 'Glycemic Load Analysis'})
          .textContent,
      ).toContain('20.4'),
    );

    const result = screen.getByRole('region', {
      name: 'Glycemic Load Analysis',
    });
    expect(result.textContent).toContain(
      'High Glycemic Load - Significant blood sugar impact',
    );
    expect(result.textContent).toContain('28.0g');
    expect(result.textContent).toContain('73');
    expect(
      result.textContent,
    ).toContain('Consider reducing portion sizes or choosing lower GI foods');
  });

  it('sums multiple foods and clears the meal', async () => {
    const user = userEvent.setup({delay: null});
    render(<GlycemicLoadCalculator />);

    await addFood(user, 'white-rice', '100');
    await addFood(user, 'banana', '120');
    await user.click(
      screen.getByRole('button', {name: 'Calculate Glycemic Load'}),
    );

    await waitFor(() =>
      expect(
        screen.getByRole('region', {name: 'Glycemic Load Analysis'})
          .textContent,
      ).toContain('34.5'),
    );

    expect(
      screen.getByRole('region', {name: 'Glycemic Load Analysis'}).textContent,
    ).toContain('55.6g');

    await user.click(screen.getByRole('button', {name: 'Clear All'}));
    await user.click(
      screen.getByRole('button', {name: 'Calculate Glycemic Load'}),
    );

    expect(
      screen.getByText('Please add at least one food to your meal.'),
    ).toBeTruthy();
  });

  it('rejects an invalid food selection or amount', async () => {
    const user = userEvent.setup({delay: null});
    render(<GlycemicLoadCalculator />);

    await user.click(screen.getByRole('button', {name: 'Add Food'}));

    expect(
      screen.getByText('Please select a food and enter a valid amount.'),
    ).toBeTruthy();
  });
});
