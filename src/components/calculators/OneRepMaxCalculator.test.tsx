// @vitest-environment jsdom
import {cleanup, render, screen, waitFor} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {afterEach, beforeEach, describe, expect, it, vi} from 'vitest';
import {OneRepMaxCalculator} from './OneRepMaxCalculator';

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

async function fillOneRepMax(
  user: ReturnType<typeof userEvent.setup>,
  weight = '100',
) {
  await user.type(
    screen.getByRole('spinbutton', {name: 'Weight Lifted'}),
    weight,
  );
  await user.type(
    screen.getByRole('spinbutton', {name: 'Repetitions'}),
    '10',
  );
  await user.selectOptions(screen.getByRole('combobox', {name: 'Formula'}), 'epley');
}

async function submitOneRepMax(user: ReturnType<typeof userEvent.setup>) {
  await user.click(screen.getByRole('button', {name: 'Calculate 1RM'}));
}

describe('OneRepMaxCalculator', () => {
  it('computes the source Epley example end-to-end', async () => {
    const user = userEvent.setup();
    render(<OneRepMaxCalculator />);

    await fillOneRepMax(user);
    await submitOneRepMax(user);

    await waitFor(() =>
      expect(
        screen.getByRole('region', {name: 'Your Estimated One Rep Max'})
          .textContent,
      ).toContain('133.3'),
    );

    const result = screen.getByRole('region', {
      name: 'Your Estimated One Rep Max',
    });
    expect(result.textContent).toContain('133.3');
    expect(result.textContent).toContain('1 Reps:');
    expect(result.textContent).toContain('124.4 kg');
  });

  it('preserves the entered weight unit end-to-end', async () => {
    const user = userEvent.setup();
    render(<OneRepMaxCalculator />);

    await user.type(
      screen.getByRole('spinbutton', {name: 'Weight Lifted'}),
      '220',
    );
    await user.selectOptions(screen.getByRole('combobox', {name: 'Weight Lifted unit'}), 'lbs');
    await user.type(
      screen.getByRole('spinbutton', {name: 'Repetitions'}),
      '10',
    );
    await user.selectOptions(screen.getByRole('combobox', {name: 'Formula'}), 'epley');
    await submitOneRepMax(user);

    await waitFor(() =>
      expect(
        screen.getByRole('region', {name: 'Your Estimated One Rep Max'})
          .textContent,
      ).toContain('293.3'),
    );

    expect(
      screen.getByRole('region', {name: 'Your Estimated One Rep Max'})
        .textContent,
    ).toContain('293.3');
    expect(
      screen.getByRole('region', {name: 'Your Estimated One Rep Max'})
        .textContent,
    ).toContain('293.3 lbs');
  });

  it('validates with the source message before calculating', async () => {
    const user = userEvent.setup();
    render(<OneRepMaxCalculator />);

    await submitOneRepMax(user);

    const alerts = screen.getAllByRole('alert');
    expect(alerts).toHaveLength(2);
    expect(
      alerts.every(
        (alert) =>
          alert.textContent ===
          'Please enter valid weight (greater than 0) and repetitions (1-15).',
      ),
    ).toBe(true);
    expect(scrollIntoView).not.toHaveBeenCalled();
  });

  it('does not render share or print actions, matching the source', async () => {
    const user = userEvent.setup();
    render(<OneRepMaxCalculator />);

    await fillOneRepMax(user);
    await submitOneRepMax(user);

    await waitFor(() =>
      expect(
        screen.getByRole('region', {name: 'Your Estimated One Rep Max'})
          .textContent,
      ).toContain('133.3'),
    );

    expect(
      screen.queryByRole('button', {name: 'Share results'}),
    ).toBeNull();
    expect(
      screen.queryByRole('button', {name: 'Print results'}),
    ).toBeNull();
    expect(scrollIntoView).not.toHaveBeenCalled();
  });
});
