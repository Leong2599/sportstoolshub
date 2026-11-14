// @vitest-environment jsdom
import {cleanup, render, screen, waitFor} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {afterEach, beforeEach, describe, expect, it, vi} from 'vitest';
import type {ShareContent} from '../../lib/calculators/share';
import {SwimPaceCalculator} from './SwimPaceCalculator';

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

async function submitSwim(user: ReturnType<typeof userEvent.setup>) {
  await user.click(screen.getByRole('button', {name: 'Calculate'}));
}

describe('SwimPaceCalculator', () => {
  it('computes the source pace example end-to-end', async () => {
    const user = userEvent.setup({delay: null});
    render(<SwimPaceCalculator />);

    await user.selectOptions(
      screen.getByRole('combobox', {name: 'Calculation Type'}),
      'time-distance',
    );
    await user.type(
      screen.getByRole('spinbutton', {name: 'Distance'}),
      '100',
    );
    await user.type(screen.getByRole('spinbutton', {name: 'Minutes'}), '1');
    await user.type(screen.getByRole('spinbutton', {name: 'Seconds'}), '30');
    await user.selectOptions(
      screen.getByRole('combobox', {name: 'Pool Size'}),
      '50',
    );
    await submitSwim(user);

    await waitFor(() =>
      expect(
        screen.getByRole('region', {name: 'Your Swim Pace Results'}).textContent,
      ).toContain('1:30.00 /100m'),
    );

    const result = screen.getByRole('region', {name: 'Your Swim Pace Results'});
    expect(result.textContent).toContain('0:45.00 /50m');
    expect(result.textContent).toContain('4.00 km/h');
    expect(result.textContent).toContain('Lap 1 (50m)');
    expect(result.textContent).toContain('01:30.00');
    expect(scrollIntoView).toHaveBeenCalledWith({
      behavior: 'smooth',
      block: 'start',
    });
  });

  it('computes the source predicted finish time end-to-end', async () => {
    const user = userEvent.setup({delay: null});
    render(<SwimPaceCalculator />);

    await user.selectOptions(
      screen.getByRole('combobox', {name: 'Calculation Type'}),
      'pace-distance',
    );
    await user.type(
      screen.getByRole('spinbutton', {name: 'Target Distance'}),
      '1000',
    );
    await user.type(
      screen.getByRole('spinbutton', {name: 'Target Pace Minutes (per 100m)'}),
      '1',
    );
    await user.type(
      screen.getByRole('spinbutton', {name: 'Target Pace Seconds (per 100m)'}),
      '40',
    );
    await submitSwim(user);

    await waitFor(() =>
      expect(
        screen.getByRole('region', {name: 'Your Swim Pace Results'}).textContent,
      ).toContain('16:40.00'),
    );

    const result = screen.getByRole('region', {name: 'Your Swim Pace Results'});
    expect(result.textContent).toContain('Predicted Finish Time');
    expect(result.textContent).toContain('1:40 /100m');
  });

  it('computes the source interval plan end-to-end', async () => {
    const user = userEvent.setup({delay: null});
    render(<SwimPaceCalculator />);

    await user.selectOptions(
      screen.getByRole('combobox', {name: 'Calculation Type'}),
      'intervals',
    );
    await user.selectOptions(
      screen.getByRole('combobox', {name: 'Interval Distance'}),
      '100',
    );
    await user.type(
      screen.getByRole('spinbutton', {
        name: 'Interval Pace Minutes (per 100m)',
      }),
      '1',
    );
    await user.type(
      screen.getByRole('spinbutton', {
        name: 'Interval Pace Seconds (per 100m)',
      }),
      '30',
    );
    await user.type(
      screen.getByRole('spinbutton', {name: 'Rest Time (seconds)'}),
      '20',
    );
    await user.type(
      screen.getByRole('spinbutton', {name: 'Number of Intervals'}),
      '10',
    );
    await submitSwim(user);

    await waitFor(() =>
      expect(
        screen.getByRole('region', {name: 'Your Swim Pace Results'}).textContent,
      ).toContain('18:00'),
    );

    const result = screen.getByRole('region', {name: 'Your Swim Pace Results'});
    expect(result.textContent).toContain('Total Workout Time');
    expect(result.textContent).toContain('15:00');
    expect(result.textContent).toContain('3:00');
    expect(result.textContent).toContain('20s rest');
    expect(result.textContent).toContain('Finish');
    expect(result.textContent).toContain(
      'This interval set covers 1000m total.',
    );
  });

  it('shares the source text and prints without exposing inputs', async () => {
    const share = vi.fn(async (_content: ShareContent) => {});
    const onPrint = vi.fn();
    const user = userEvent.setup({delay: null});
    render(
      <SwimPaceCalculator shareEnvironment={{share}} onPrint={onPrint} />,
    );

    await user.selectOptions(
      screen.getByRole('combobox', {name: 'Calculation Type'}),
      'pace-distance',
    );
    await user.type(
      screen.getByRole('spinbutton', {name: 'Target Distance'}),
      '1000',
    );
    await user.type(
      screen.getByRole('spinbutton', {name: 'Target Pace Minutes (per 100m)'}),
      '1',
    );
    await user.type(
      screen.getByRole('spinbutton', {name: 'Target Pace Seconds (per 100m)'}),
      '40',
    );
    await submitSwim(user);
    await user.click(screen.getByRole('button', {name: 'Share results'}));

    await waitFor(() => expect(share).toHaveBeenCalledOnce());
    const content = share.mock.calls[0]?.[0];

    expect(content?.title).toBe('Swim Pace Calculator Results');
    expect(content?.text).toBe(
      'Check out my swimming pace calculations at Sports Tools Hub!',
    );
    expect(content?.url).toBe(window.location.href);

    await user.click(screen.getByRole('button', {name: 'Print Results'}));
    expect(onPrint).toHaveBeenCalledOnce();
  });

  it('validates with the source messages before calculating', async () => {
    const user = userEvent.setup({delay: null});
    render(<SwimPaceCalculator />);

    await submitSwim(user);

    expect(
      screen.getByText('Please select a calculation type.'),
    ).toBeTruthy();
    expect(scrollIntoView).not.toHaveBeenCalled();

    await user.selectOptions(
      screen.getByRole('combobox', {name: 'Calculation Type'}),
      'time-distance',
    );
    await submitSwim(user);

    expect(screen.getByText('Please enter a valid distance.')).toBeTruthy();
    expect(screen.getByText('Please enter a valid time.')).toBeTruthy();
  });
});
