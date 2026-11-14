// @vitest-environment jsdom
import {cleanup, render, screen, waitFor} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {afterEach, beforeEach, describe, expect, it, vi} from 'vitest';
import {RefeedDayCalculator} from './RefeedDayCalculator';

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

async function fillRefeed(user: ReturnType<typeof userEvent.setup>) {
  await user.type(screen.getByRole('spinbutton', {name: 'Age'}), '30');
  await user.type(
    screen.getByRole('spinbutton', {name: 'Current Weight (kg)'}),
    '80',
  );
  await user.type(
    screen.getByRole('spinbutton', {name: 'Maintenance Calories'}),
    '2500',
  );
  await user.type(
    screen.getByRole('spinbutton', {name: 'Current Cutting Calories'}),
    '2000',
  );
  await user.type(
    screen.getByRole('spinbutton', {name: 'Cutting Protein (g)'}),
    '160',
  );
  await user.type(
    screen.getByRole('spinbutton', {name: 'Cutting Carbs (g)'}),
    '150',
  );
  await user.type(
    screen.getByRole('spinbutton', {name: 'Cutting Fats (g)'}),
    '60',
  );
  await user.type(
    screen.getByRole('spinbutton', {name: 'Weeks in Current Cut'}),
    '8',
  );
  await user.selectOptions(
    screen.getByRole('combobox', {name: 'Training Days/Week'}),
    '4',
  );
  await user.selectOptions(
    screen.getByRole('combobox', {name: 'Training Intensity'}),
    'moderate',
  );
  await user.selectOptions(
    screen.getByRole('combobox', {name: 'Primary Training Type'}),
    'strength',
  );
  await user.selectOptions(
    screen.getByRole('combobox', {name: 'Current Refeed Frequency'}),
    'weekly',
  );
}

describe('RefeedDayCalculator', () => {
  it('builds the refeed calories, macros, schedule, and guidance', async () => {
    const user = userEvent.setup({delay: null});
    render(<RefeedDayCalculator />);

    await fillRefeed(user);
    await user.click(
      screen.getByRole('button', {name: 'Calculate Refeed Plan'}),
    );

    await waitFor(() =>
      expect(
        screen.getByRole('region', {name: 'Your Strategic Refeed Plan'})
          .textContent,
      ).toContain('3500 cal'),
    );

    const result = screen.getByRole('region', {
      name: 'Your Strategic Refeed Plan',
    });
    expect(result.textContent).toContain('+40% above maintenance');
    expect(result.textContent).toContain('160g');
    expect(result.textContent).toContain('655g');
    expect(result.textContent).toContain('Weekly (Every 7 days)');
    expect(result.textContent).toContain('In 7 days');
    expect(result.textContent).toContain('White rice (cooked)');
    expect(result.textContent).toContain('Rest Day Refeed');
    expect(result.textContent).toContain('Post-Refeed Protocol');
    expect(result.textContent).toContain('Refeed Progression');
  });

  it('applies the aggressive style and the vegan meal guidance', async () => {
    const user = userEvent.setup({delay: null});
    render(<RefeedDayCalculator />);

    await fillRefeed(user);
    await user.selectOptions(
      screen.getByRole('combobox', {name: 'Refeed Style Preference'}),
      'aggressive',
    );
    await user.selectOptions(
      screen.getByRole('combobox', {name: 'Preferred Refeed Day'}),
      'post-leg-day',
    );
    await user.click(
      screen.getByRole('button', {name: 'Calculate Refeed Plan'}),
    );

    await waitFor(() =>
      expect(
        screen.getByRole('region', {name: 'Your Strategic Refeed Plan'})
          .textContent,
      ).toContain('4050 cal'),
    );

    const result = screen.getByRole('region', {
      name: 'Your Strategic Refeed Plan',
    });
    expect(result.textContent).toContain('+62% above maintenance');
    expect(result.textContent).toContain('After Leg Day');
    expect(result.textContent).toContain('White bread with honey');
  });

  it('validates the required diet and training fields', async () => {
    const user = userEvent.setup({delay: null});
    render(<RefeedDayCalculator />);

    await user.click(
      screen.getByRole('button', {name: 'Calculate Refeed Plan'}),
    );

    expect(
      screen.getByText('Please enter an age between 18 and 80.'),
    ).toBeTruthy();
    expect(
      screen.getByText(
        'Please enter maintenance calories between 1200 and 5000.',
      ),
    ).toBeTruthy();
    expect(
      screen.getByText('Please enter cutting protein between 50 and 400 g.'),
    ).toBeTruthy();
    expect(
      screen.getByText('Please select your current refeed frequency.'),
    ).toBeTruthy();
  });
});
