// @vitest-environment jsdom
import {cleanup, render, screen, waitFor, within} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {afterEach, beforeEach, describe, expect, it, vi} from 'vitest';
import {LeanBodyMassCalculator} from './LeanBodyMassCalculator';

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

async function fillLbm(
  user: ReturnType<typeof userEvent.setup>,
  weight = '80',
  height = '180',
) {
  await user.type(screen.getByRole('spinbutton', {name: 'Weight'}), weight);
  await user.type(screen.getByRole('spinbutton', {name: 'Height'}), height);
}

async function submitLbm(user: ReturnType<typeof userEvent.setup>) {
  await user.click(screen.getByRole('button', {name: 'Calculate LBM'}));
}

describe('LeanBodyMassCalculator', () => {
  it('computes the source Boer formula for men end-to-end', async () => {
    const user = userEvent.setup();
    render(<LeanBodyMassCalculator />);

    await fillLbm(user);
    await submitLbm(user);

    await waitFor(() =>
      expect(
        screen.getByRole('region', {name: 'Your Estimated Results'})
          .textContent,
      ).toContain('61.4 kg'),
    );

    const result = screen.getByRole('region', {
      name: 'Your Estimated Results',
    });
    expect(result.textContent).toContain('Lean Body Mass (kg)');
    expect(result.textContent).toContain('23.2%');
    expect(scrollIntoView).toHaveBeenCalledWith({
      behavior: 'smooth',
      block: 'start',
    });
  });

  it('computes the source Boer formula for women end-to-end', async () => {
    const user = userEvent.setup();
    render(<LeanBodyMassCalculator />);

    await user.click(
      within(screen.getByRole('group', {name: 'Gender'})).getByRole('radio', {
        name: 'Female',
      }),
    );
    await fillLbm(user);
    await submitLbm(user);

    await waitFor(() =>
      expect(
        screen.getByRole('region', {name: 'Your Estimated Results'})
          .textContent,
      ).toContain('57.0 kg'),
    );

    expect(
      screen.getByRole('region', {name: 'Your Estimated Results'}).textContent,
    ).toContain('28.7%');
  });

  it('converts imperial height and weight end-to-end', async () => {
    const user = userEvent.setup();
    render(<LeanBodyMassCalculator />);

    await user.type(screen.getByRole('spinbutton', {name: 'Weight'}), '176');
    await user.selectOptions(screen.getByRole('combobox', {name: 'Weight unit'}), 'lbs');
    await user.selectOptions(screen.getByRole('combobox', {name: 'Height unit'}), 'ft');
    await user.type(screen.getByRole('spinbutton', {name: 'Feet'}), '5');
    await user.type(screen.getByRole('spinbutton', {name: 'Inches'}), '11');
    await submitLbm(user);

    await waitFor(() =>
      expect(
        screen.getByRole('region', {name: 'Your Estimated Results'})
          .textContent,
      ).toContain('61.4 kg'),
    );
  });

  it('validates with the source messages before calculating', async () => {
    const user = userEvent.setup();
    render(<LeanBodyMassCalculator />);

    await submitLbm(user);

    expect(screen.getByText('Please enter a valid weight.')).toBeTruthy();
    expect(
      screen.getByText('Please enter a valid height in cm (50-250).'),
    ).toBeTruthy();
    expect(scrollIntoView).not.toHaveBeenCalled();
  });
});
