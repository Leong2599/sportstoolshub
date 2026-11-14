// @vitest-environment jsdom
import {cleanup, render, screen, waitFor} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {afterEach, beforeEach, describe, expect, it, vi} from 'vitest';
import {TDEECalculator} from './TDEECalculator';

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

async function fillTdee(user: ReturnType<typeof userEvent.setup>) {
  await user.type(screen.getByRole('spinbutton', {name: 'Age'}), '30');
  await user.type(screen.getByRole('spinbutton', {name: 'Height'}), '180');
  await user.type(screen.getByRole('spinbutton', {name: 'Weight'}), '80');
  await user.selectOptions(
    screen.getByRole('combobox', {name: 'Activity Level'}),
    'moderate',
  );
}

describe('TDEECalculator', () => {
  it('computes the TDEE and source weight goals end-to-end', async () => {
    const user = userEvent.setup({delay: null});
    render(<TDEECalculator />);

    await fillTdee(user);
    await user.click(screen.getByRole('button', {name: 'Calculate TDEE'}));

    await waitFor(() =>
      expect(
        screen.getByRole('region', {name: 'Your Estimated TDEE'}).textContent,
      ).toContain('2759'),
    );

    const result = screen.getByRole('region', {
      name: 'Your Estimated TDEE',
    });
    expect(result.textContent).toContain('Maintain Weight');
    expect(result.textContent).toContain('2509 Calories');
    expect(result.textContent).toContain('2259 Calories');
    expect(result.textContent).toContain('1759 Calories');
    expect(result.textContent).toContain('3009 Calories');
    expect(result.textContent).toContain('3259 Calories');
    expect(
      screen.queryByRole('button', {name: 'Share results'}),
    ).toBeNull();
    expect(
      screen.queryByRole('button', {name: 'Print Results'}),
    ).toBeNull();
  });

  it('validates a missing activity level', async () => {
    const user = userEvent.setup({delay: null});
    render(<TDEECalculator />);

    await user.type(screen.getByRole('spinbutton', {name: 'Age'}), '30');
    await user.type(screen.getByRole('spinbutton', {name: 'Height'}), '180');
    await user.type(screen.getByRole('spinbutton', {name: 'Weight'}), '80');
    await user.click(screen.getByRole('button', {name: 'Calculate TDEE'}));

    expect(
      screen.getByText('Please select your activity level.'),
    ).toBeTruthy();
    expect(scrollIntoView).not.toHaveBeenCalled();
  });
});
