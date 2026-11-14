// @vitest-environment jsdom
import {cleanup, render, screen, waitFor} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {afterEach, beforeEach, describe, expect, it, vi} from 'vitest';
import {BMRCalculator} from './BMRCalculator';

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

async function fillBmr(user: ReturnType<typeof userEvent.setup>) {
  await user.type(screen.getByRole('spinbutton', {name: 'Age'}), '30');
  await user.type(screen.getByRole('spinbutton', {name: 'Height'}), '180');
  await user.type(screen.getByRole('spinbutton', {name: 'Weight'}), '80');
}

describe('BMRCalculator', () => {
  it('computes the Mifflin-St Jeor BMR end-to-end', async () => {
    const user = userEvent.setup({delay: null});
    render(<BMRCalculator />);

    await fillBmr(user);
    await user.click(screen.getByRole('button', {name: 'Calculate BMR'}));

    await waitFor(() =>
      expect(
        screen.getByRole('region', {name: 'Your Estimated BMR'}).textContent,
      ).toContain('1780'),
    );

    const result = screen.getByRole('region', {
      name: 'Your Estimated BMR',
    });
    expect(result.textContent).toContain('Calories/Day');
    expect(result.textContent).toContain('Understanding Your BMR');
    expect(
      screen.queryByRole('button', {name: 'Share results'}),
    ).toBeNull();
    expect(
      screen.queryByRole('button', {name: 'Print Results'}),
    ).toBeNull();
    expect(scrollIntoView).toHaveBeenCalledWith({
      behavior: 'smooth',
      block: 'start',
    });
  });

  it('validates the source age and weight bounds', async () => {
    const user = userEvent.setup({delay: null});
    render(<BMRCalculator />);

    await user.type(screen.getByRole('spinbutton', {name: 'Age'}), '14');
    await user.click(screen.getByRole('button', {name: 'Calculate BMR'}));

    expect(
      screen.getByText('Please enter a valid age between 15 and 80.'),
    ).toBeTruthy();
    expect(screen.getByText('Please enter a valid weight.')).toBeTruthy();
    expect(
      screen.getByText('Please enter a valid height in cm (50-250).'),
    ).toBeTruthy();
    expect(scrollIntoView).not.toHaveBeenCalled();
  });
});
