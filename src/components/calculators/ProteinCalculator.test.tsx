// @vitest-environment jsdom
import {cleanup, render, screen, waitFor} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {afterEach, beforeEach, describe, expect, it, vi} from 'vitest';
import type {ShareContent} from '../../lib/calculators/share';
import {ProteinCalculator} from './ProteinCalculator';

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

async function fillProtein(user: ReturnType<typeof userEvent.setup>) {
  await user.type(screen.getByRole('spinbutton', {name: 'Body Weight'}), '80');
  await user.click(screen.getByRole('radio', {name: 'Male'}));
  await user.type(screen.getByRole('spinbutton', {name: 'Age'}), '30');
  await user.selectOptions(
    screen.getByRole('combobox', {name: 'Activity Level'}),
    'moderate',
  );
  await user.selectOptions(
    screen.getByRole('combobox', {name: 'Primary Fitness Goal'}),
    'build-muscle',
  );
  await user.selectOptions(
    screen.getByRole('combobox', {name: 'Diet Type'}),
    'omnivore',
  );
}

describe('ProteinCalculator', () => {
  it('computes protein targets and meal distribution end-to-end', async () => {
    const user = userEvent.setup({delay: null});
    render(<ProteinCalculator />);

    await fillProtein(user);
    await user.click(screen.getByRole('button', {name: 'Calculate Protein'}));

    await waitFor(() =>
      expect(
        screen.getByRole('region', {name: 'Your Protein Requirements'})
          .textContent,
      ).toContain('144g'),
    );

    const result = screen.getByRole('region', {
      name: 'Your Protein Requirements',
    });
    expect(result.textContent).toContain('1.8g/kg');
    expect(result.textContent).toContain('Breakfast');
    expect(result.textContent).toContain('36g');
    expect(result.textContent).toContain('43g');
    expect(result.textContent).toContain('22g');
    expect(result.textContent).toContain('Complete Protein Sources');
    expect(result.textContent).toContain('Nutrition Recommendations');
  });

  it('shares only the computed result and prints', async () => {
    const share = vi.fn(async (_content: ShareContent) => {});
    const onPrint = vi.fn();
    const user = userEvent.setup({delay: null});
    render(
      <ProteinCalculator shareEnvironment={{share}} onPrint={onPrint} />,
    );

    await fillProtein(user);
    await user.click(screen.getByRole('button', {name: 'Calculate Protein'}));
    await user.click(screen.getByRole('button', {name: 'Share results'}));

    await waitFor(() => expect(share).toHaveBeenCalledOnce());
    const content = share.mock.calls[0]?.[0];

    expect(content?.title).toBe('Protein Calculator Results');
    expect(content?.text).toBe(
      'My daily protein requirement is 144g. Calculate yours at Sports Tools Hub!',
    );
    expect(content?.url).toBe(window.location.href);

    await user.click(screen.getByRole('button', {name: 'Print Results'}));
    expect(onPrint).toHaveBeenCalledOnce();
  });

  it('validates all required selections', async () => {
    const user = userEvent.setup({delay: null});
    render(<ProteinCalculator />);

    await user.click(screen.getByRole('button', {name: 'Calculate Protein'}));

    expect(
      screen.getByText('Please enter a valid weight (min 30).'),
    ).toBeTruthy();
    expect(screen.getByText('Please select your gender.')).toBeTruthy();
    expect(screen.getByText('Please enter a valid age (15-100).')).toBeTruthy();
    expect(
      screen.getByText('Please select your activity level.'),
    ).toBeTruthy();
    expect(
      screen.getByText('Please select your fitness goal.'),
    ).toBeTruthy();
    expect(screen.getByText('Please select your diet type.')).toBeTruthy();
  });
});
