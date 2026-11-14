// @vitest-environment jsdom
import {cleanup, render, screen, waitFor} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {afterEach, beforeEach, describe, expect, it, vi} from 'vitest';
import type {ShareContent} from '../../lib/calculators/share';
import {HydrationCalculator} from './HydrationCalculator';

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

async function fillHydration(user: ReturnType<typeof userEvent.setup>) {
  await user.type(screen.getByRole('spinbutton', {name: 'Body Weight'}), '80');
  await user.type(screen.getByRole('spinbutton', {name: 'Age'}), '30');
  await user.click(screen.getByRole('radio', {name: 'Male'}));
  await user.selectOptions(
    screen.getByRole('combobox', {name: 'Activity Level'}),
    'moderate',
  );
  await user.selectOptions(
    screen.getByRole('combobox', {name: 'Climate/Environment'}),
    'temperate',
  );
  await user.type(
    screen.getByRole('spinbutton', {name: 'Daily Exercise Duration'}),
    '60',
  );
}

describe('HydrationCalculator', () => {
  it('computes the source water target, breakdown, and schedule', async () => {
    const user = userEvent.setup({delay: null});
    render(<HydrationCalculator />);

    await fillHydration(user);
    await user.click(
      screen.getByRole('button', {name: 'Calculate Hydration'}),
    );

    await waitFor(() =>
      expect(
        screen.getByRole('region', {name: 'Your Hydration Results'}).textContent,
      ).toContain('126 oz'),
    );

    const result = screen.getByRole('region', {
      name: 'Your Hydration Results',
    });
    expect(result.textContent).toContain('3.7 liters');
    expect(result.textContent).toContain('16 glasses');
    expect(result.textContent).toContain('88 oz');
    expect(result.textContent).toContain('+38 oz');
    expect(result.textContent).toContain('21 oz');
    expect(result.textContent).toContain('Exercise Hydration');
    expect(result.textContent).toContain('Personalized Recommendations');
  });

  it('applies multiple selected health conditions', async () => {
    const user = userEvent.setup({delay: null});
    render(<HydrationCalculator />);

    await fillHydration(user);
    await user.selectOptions(
      screen.getByLabelText('Special Health Conditions'),
      ['pregnancy', 'breastfeeding'],
    );
    await user.click(
      screen.getByRole('button', {name: 'Calculate Hydration'}),
    );

    await waitFor(() =>
      expect(
        screen.getByRole('region', {name: 'Your Hydration Results'}).textContent,
      ).toContain('182 oz'),
    );

    const result = screen.getByRole('region', {
      name: 'Your Hydration Results',
    });
    expect(result.textContent).toContain('5.4 liters');
    expect(result.textContent).toContain('56 oz');
  });

  it('shares only the computed result and prints', async () => {
    const share = vi.fn(async (_content: ShareContent) => {});
    const onPrint = vi.fn();
    const user = userEvent.setup({delay: null});
    render(
      <HydrationCalculator shareEnvironment={{share}} onPrint={onPrint} />,
    );

    await fillHydration(user);
    await user.click(
      screen.getByRole('button', {name: 'Calculate Hydration'}),
    );
    await user.click(screen.getByRole('button', {name: 'Share results'}));

    await waitFor(() => expect(share).toHaveBeenCalledOnce());
    const content = share.mock.calls[0]?.[0];

    expect(content?.title).toBe('Hydration Calculator Results');
    expect(content?.text).toBe(
      'My daily water intake recommendation is 126 oz. Calculate yours at Sports Tools Hub!',
    );
    expect(content?.url).toBe(window.location.href);

    await user.click(screen.getByRole('button', {name: 'Print Results'}));
    expect(onPrint).toHaveBeenCalledOnce();
  });

  it('validates the required hydration fields', async () => {
    const user = userEvent.setup({delay: null});
    render(<HydrationCalculator />);

    await user.click(
      screen.getByRole('button', {name: 'Calculate Hydration'}),
    );

    expect(
      screen.getByText('Please enter a valid body weight (min 30).'),
    ).toBeTruthy();
    expect(screen.getByText('Please enter a valid age (15-100).')).toBeTruthy();
    expect(screen.getByText('Please select your gender.')).toBeTruthy();
    expect(
      screen.getByText('Please select your activity level.'),
    ).toBeTruthy();
    expect(
      screen.getByText('Please select your climate/environment.'),
    ).toBeTruthy();
  });
});
