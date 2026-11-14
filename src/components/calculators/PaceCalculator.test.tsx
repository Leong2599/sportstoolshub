// @vitest-environment jsdom
import {cleanup, render, screen, waitFor} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {afterEach, beforeEach, describe, expect, it, vi} from 'vitest';
import type {ShareContent} from '../../lib/calculators/share';
import {PaceCalculator} from './PaceCalculator';

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

async function submitPace(user: ReturnType<typeof userEvent.setup>) {
  await user.click(screen.getByRole('button', {name: 'Calculate'}));
}

describe('PaceCalculator', () => {
  it('computes the source 5K pace example end-to-end', async () => {
    const user = userEvent.setup({delay: null});
    render(<PaceCalculator />);

    await user.selectOptions(
      screen.getByRole('combobox', {name: 'Calculation Type'}),
      'time-distance',
    );
    await user.type(
      screen.getByRole('spinbutton', {name: 'Distance'}),
      '5',
    );
    await user.type(screen.getByRole('spinbutton', {name: 'Minutes'}), '45');
    await submitPace(user);

    await waitFor(() =>
      expect(
        screen.getByRole('region', {name: 'Your Pace Results'}).textContent,
      ).toContain('9:00 min/km'),
    );

    const result = screen.getByRole('region', {name: 'Your Pace Results'});
    expect(result.textContent).toContain('14:29 min/mile');
    expect(result.textContent).toContain('6.67 km/h');
    expect(result.textContent).toContain('4.14 mph');
    expect(result.textContent).toContain('Km 1');
    expect(result.textContent).toContain('45:00');
    expect(result.textContent).toContain('For 5K training');
    expect(scrollIntoView).toHaveBeenCalledWith({
      behavior: 'smooth',
      block: 'start',
    });
  });

  it('computes the source race predictions end-to-end', async () => {
    const user = userEvent.setup({delay: null});
    render(<PaceCalculator />);

    await user.selectOptions(
      screen.getByRole('combobox', {name: 'Calculation Type'}),
      'race-prediction',
    );
    await user.selectOptions(
      screen.getByRole('combobox', {name: 'Recent Race Distance'}),
      '10k',
    );
    await user.type(screen.getByRole('spinbutton', {name: 'Minutes'}), '45');
    await submitPace(user);

    await waitFor(() =>
      expect(
        screen.getByRole('region', {name: 'Your Pace Results'}).textContent,
      ).toContain('00:45:00'),
    );

    const result = screen.getByRole('region', {name: 'Your Pace Results'});
    expect(result.textContent).toContain('10K');
    expect(result.textContent).toContain('21:35');
    expect(result.textContent).toContain('01:39:17');
    expect(result.textContent).toContain('03:27:01');
    expect(result.textContent).toContain('Riegel formula');
  });

  it('shares the source text and prints without exposing inputs', async () => {
    const share = vi.fn(async (_content: ShareContent) => {});
    const onPrint = vi.fn();
    const user = userEvent.setup({delay: null});
    render(<PaceCalculator shareEnvironment={{share}} onPrint={onPrint} />);

    await user.selectOptions(
      screen.getByRole('combobox', {name: 'Calculation Type'}),
      'time-distance',
    );
    await user.type(
      screen.getByRole('spinbutton', {name: 'Distance'}),
      '5',
    );
    await user.type(screen.getByRole('spinbutton', {name: 'Minutes'}), '45');
    await submitPace(user);
    await user.click(screen.getByRole('button', {name: 'Share results'}));

    await waitFor(() => expect(share).toHaveBeenCalledOnce());
    const content = share.mock.calls[0]?.[0];

    expect(content?.title).toBe('Pace Calculator Results');
    expect(content?.text).toBe(
      'Check out my running pace calculations at Sports Tools Hub!',
    );
    expect(content?.url).toBe(window.location.href);

    await user.click(screen.getByRole('button', {name: 'Print Results'}));
    expect(onPrint).toHaveBeenCalledOnce();
  });

  it('validates with the source messages before calculating', async () => {
    const user = userEvent.setup({delay: null});
    render(<PaceCalculator />);

    await submitPace(user);

    expect(
      screen.getByText('Please select a calculation type.'),
    ).toBeTruthy();
    expect(scrollIntoView).not.toHaveBeenCalled();

    await user.selectOptions(
      screen.getByRole('combobox', {name: 'Calculation Type'}),
      'time-distance',
    );
    await submitPace(user);

    expect(screen.getByText('Please enter a valid distance.')).toBeTruthy();
    expect(screen.getByText('Please enter a valid time.')).toBeTruthy();
  });
});
