// @vitest-environment jsdom
import {cleanup, render, screen, waitFor} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {afterEach, beforeEach, describe, expect, it, vi} from 'vitest';
import type {ShareContent} from '../../lib/calculators/share';
import {CyclingPowerCalculator} from './CyclingPowerCalculator';

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

async function submitCycling(user: ReturnType<typeof userEvent.setup>) {
  await user.click(screen.getByRole('button', {name: 'Calculate Power'}));
}

describe('CyclingPowerCalculator', () => {
  it('computes the source physics example end-to-end', async () => {
    const user = userEvent.setup({delay: null});
    render(<CyclingPowerCalculator />);

    await user.selectOptions(
      screen.getByRole('combobox', {name: 'Calculation Type'}),
      'power-speed',
    );
    await user.type(screen.getByRole('spinbutton', {name: 'Speed'}), '30');
    await user.type(
      screen.getByRole('spinbutton', {name: 'Total Weight (Rider + Bike)'}),
      '80',
    );
    await submitCycling(user);

    await waitFor(() =>
      expect(
        screen.getByRole('region', {name: 'Your Cycling Power Results'})
          .textContent,
      ).toContain('174 watts'),
    );

    const result = screen.getByRole('region', {
      name: 'Your Cycling Power Results',
    });
    expect(result.textContent).toContain('Estimated Power Output');
    expect(result.textContent).toContain('30.0 kmh');
    expect(result.textContent).toContain('80.0 kg');
    expect(result.textContent).toContain('Zone 1');
    expect(result.textContent).toContain('Active Recovery');
    expect(result.textContent).toContain('Neuromuscular');
    expect(result.textContent).toContain(
      'Your estimated power output is 174 watts',
    );
    expect(scrollIntoView).toHaveBeenCalledWith({
      behavior: 'smooth',
      block: 'start',
    });
  });

  it('computes the source FTP example end-to-end', async () => {
    const user = userEvent.setup({delay: null});
    render(<CyclingPowerCalculator />);

    await user.selectOptions(
      screen.getByRole('combobox', {name: 'Calculation Type'}),
      'ftp',
    );
    await user.type(
      screen.getByRole('spinbutton', {name: 'Average Power (Watts)'}),
      '250',
    );
    await user.type(
      screen.getByRole('spinbutton', {name: 'Body Weight'}),
      '80',
    );
    await submitCycling(user);

    await waitFor(() =>
      expect(
        screen.getByRole('region', {name: 'Your Cycling Power Results'})
          .textContent,
      ).toContain('238 watts'),
    );

    const result = screen.getByRole('region', {
      name: 'Your Cycling Power Results',
    });
    expect(result.textContent).toContain('Functional Threshold Power (FTP)');
    expect(result.textContent).toContain('2.98 W/kg');
    expect(result.textContent).toContain('20 minutes');
  });

  it('computes the source power-to-weight example end-to-end', async () => {
    const user = userEvent.setup({delay: null});
    render(<CyclingPowerCalculator />);

    await user.selectOptions(
      screen.getByRole('combobox', {name: 'Calculation Type'}),
      'power-weight',
    );
    await user.type(
      screen.getByRole('spinbutton', {name: 'Power Output (Watts)'}),
      '250',
    );
    await user.type(
      screen.getByRole('spinbutton', {name: 'Rider Weight'}),
      '70',
    );
    await submitCycling(user);

    await waitFor(() =>
      expect(
        screen.getByRole('region', {name: 'Your Cycling Power Results'})
          .textContent,
      ).toContain('3.57 W/kg'),
    );

    expect(
      screen.getByRole('region', {name: 'Your Cycling Power Results'})
        .textContent,
    ).toContain('Power-to-Weight Ratio');
  });

  it('shares the source text and prints without exposing inputs', async () => {
    const share = vi.fn(async (_content: ShareContent) => {});
    const onPrint = vi.fn();
    const user = userEvent.setup({delay: null});
    render(
      <CyclingPowerCalculator shareEnvironment={{share}} onPrint={onPrint} />,
    );

    await user.selectOptions(
      screen.getByRole('combobox', {name: 'Calculation Type'}),
      'power-weight',
    );
    await user.type(
      screen.getByRole('spinbutton', {name: 'Power Output (Watts)'}),
      '250',
    );
    await user.type(
      screen.getByRole('spinbutton', {name: 'Rider Weight'}),
      '70',
    );
    await submitCycling(user);
    await user.click(screen.getByRole('button', {name: 'Share results'}));

    await waitFor(() => expect(share).toHaveBeenCalledOnce());
    const content = share.mock.calls[0]?.[0];

    expect(content?.title).toBe('Cycling Power Calculator Results');
    expect(content?.text).toBe(
      'Check out my cycling power calculations at Sports Tools Hub!',
    );
    expect(content?.url).toBe(window.location.href);

    await user.click(screen.getByRole('button', {name: 'Print Results'}));
    expect(onPrint).toHaveBeenCalledOnce();
  });

  it('validates with the source messages before calculating', async () => {
    const user = userEvent.setup({delay: null});
    render(<CyclingPowerCalculator />);

    await submitCycling(user);

    expect(
      screen.getByText('Please select a calculation type.'),
    ).toBeTruthy();
    expect(scrollIntoView).not.toHaveBeenCalled();

    await user.selectOptions(
      screen.getByRole('combobox', {name: 'Calculation Type'}),
      'power-speed',
    );
    await submitCycling(user);

    expect(screen.getByText('Please enter a valid speed.')).toBeTruthy();
    expect(
      screen.getByText('Please enter a valid total weight.'),
    ).toBeTruthy();
  });
});
