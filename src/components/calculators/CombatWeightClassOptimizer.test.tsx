// @vitest-environment jsdom
import {cleanup, render, screen, waitFor} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {afterEach, beforeEach, describe, expect, it, vi} from 'vitest';
import type {ShareContent} from '../../lib/calculators/share';
import {CombatWeightClassOptimizer} from './CombatWeightClassOptimizer';

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

async function fillCombat(user: ReturnType<typeof userEvent.setup>) {
  await user.selectOptions(
    screen.getByRole('combobox', {name: 'Combat Sport'}),
    'mma',
  );
  await user.type(
    screen.getByRole('spinbutton', {name: 'Current Body Weight'}),
    '170',
  );
  await user.type(screen.getByRole('spinbutton', {name: 'Height'}), '177.8');
  await user.type(
    screen.getByRole('spinbutton', {name: 'Body Fat Percentage'}),
    '15',
  );
  await user.type(
    screen.getByRole('spinbutton', {name: 'Years of Experience'}),
    '3',
  );
  await user.selectOptions(
    screen.getByRole('combobox', {name: 'Fighting Style'}),
    'well-rounded',
  );
  await user.selectOptions(
    screen.getByRole('combobox', {name: 'Competition Level'}),
    'amateur',
  );
  await user.type(screen.getByRole('spinbutton', {name: 'Age'}), '25');
  await user.selectOptions(
    screen.getByRole('combobox', {name: 'Previous Weight Cut Experience'}),
    'none',
  );
}

async function submitCombat(user: ReturnType<typeof userEvent.setup>) {
  await user.click(
    screen.getByRole('button', {name: 'Optimize Weight Class'}),
  );
}

describe('CombatWeightClassOptimizer', () => {
  it('computes the source weight class optimization end-to-end', async () => {
    const user = userEvent.setup({delay: null});
    render(<CombatWeightClassOptimizer />);

    await fillCombat(user);
    await submitCombat(user);

    await waitFor(() =>
      expect(
        screen.getByRole('region', {
          name: 'Weight Class Optimization Results',
        }).textContent,
      ).toContain('Welterweight'),
    );

    const result = screen.getByRole('region', {
      name: 'Weight Class Optimization Results',
    });
    expect(result.textContent).toContain('170.0 lbs');
    expect(result.textContent).toContain('144.5 lbs');
    expect(result.textContent).toContain('155.0 lbs');
    expect(result.textContent).toContain('85.0');
    expect(result.textContent).toContain('-3%');
    expect(result.textContent).toContain('Medium');
    expect(result.textContent).toContain('Minimal impact');
    expect(result.textContent).toContain('Low');
    expect(result.textContent).toContain('170 lbs');
    expect(result.textContent).toContain('50% suitable');
    expect(scrollIntoView).toHaveBeenCalledWith({
      behavior: 'smooth',
      block: 'start',
    });
  });

  it('shares only the computed result and prints without exposing inputs', async () => {
    const share = vi.fn(async (_content: ShareContent) => {});
    const onPrint = vi.fn();
    const user = userEvent.setup({delay: null});
    render(
      <CombatWeightClassOptimizer
        shareEnvironment={{share}}
        onPrint={onPrint}
      />,
    );

    await fillCombat(user);
    await submitCombat(user);
    await user.click(screen.getByRole('button', {name: 'Share results'}));

    await waitFor(() => expect(share).toHaveBeenCalledOnce());
    const content = share.mock.calls[0]?.[0];

    expect(content?.title).toBe(
      'Combat Sports Weight Class Optimizer Results',
    );
    expect(content?.text).toBe(
      'My recommended weight class is Welterweight with low health risk. Optimize your weight class at Sports Tools Hub!',
    );
    expect(content?.text).not.toContain('177.8');
    expect(content?.url).toBe(window.location.href);

    await user.click(screen.getByRole('button', {name: 'Print Results'}));
    expect(onPrint).toHaveBeenCalledOnce();
  });

  it('validates with the source messages before calculating', async () => {
    const user = userEvent.setup({delay: null});
    render(<CombatWeightClassOptimizer />);

    await submitCombat(user);

    expect(screen.getByText('Please select a combat sport.')).toBeTruthy();
    expect(
      screen.getByText('Please enter a valid current body weight.'),
    ).toBeTruthy();
    expect(screen.getByText('Please enter a valid height.')).toBeTruthy();
    expect(
      screen.getByText('Please enter a valid body fat percentage.'),
    ).toBeTruthy();
    expect(
      screen.getByText('Please enter a valid number of years of experience.'),
    ).toBeTruthy();
    expect(
      screen.getByText('Please select a fighting style.'),
    ).toBeTruthy();
    expect(
      screen.getByText('Please select a competition level.'),
    ).toBeTruthy();
    expect(screen.getByText('Please enter a valid age.')).toBeTruthy();
    expect(
      screen.getByText('Please select your weight cut experience.'),
    ).toBeTruthy();
    expect(scrollIntoView).not.toHaveBeenCalled();
  });
});
