// @vitest-environment jsdom
import {cleanup, render, screen, waitFor} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {afterEach, beforeEach, describe, expect, it, vi} from 'vitest';
import type {ShareContent} from '../../lib/calculators/share';
import {CyclingGearRatioCalculator} from './CyclingGearRatioCalculator';

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

async function fillGearSetup(user: ReturnType<typeof userEvent.setup>) {
  await user.selectOptions(
    screen.getByRole('combobox', {name: 'Bike Type'}),
    'road',
  );
  await user.selectOptions(
    screen.getByRole('combobox', {name: 'Chainrings (teeth)'}),
    '53-39',
  );
  await user.selectOptions(
    screen.getByRole('combobox', {name: 'Cassette (teeth)'}),
    '11-28',
  );
  await user.selectOptions(
    screen.getByRole('combobox', {name: 'Wheel Size'}),
    '700c',
  );
  await user.selectOptions(
    screen.getByRole('combobox', {name: 'Tire Size'}),
    '25',
  );
  await user.type(
    screen.getByRole('spinbutton', {name: 'Target Cadence (RPM)'}),
    '90',
  );
  await user.selectOptions(
    screen.getByRole('combobox', {name: 'Rider Type'}),
    'balanced',
  );
  await user.selectOptions(
    screen.getByRole('combobox', {name: 'Primary Terrain'}),
    'flat',
  );
  await user.selectOptions(
    screen.getByRole('combobox', {name: 'Fitness Level'}),
    'recreational',
  );
}

async function submitGear(user: ReturnType<typeof userEvent.setup>) {
  await user.click(screen.getByRole('button', {name: 'Calculate Gear Ratios'}));
}

describe('CyclingGearRatioCalculator', () => {
  it('computes the source gear analysis end-to-end', async () => {
    const user = userEvent.setup({delay: null});
    render(<CyclingGearRatioCalculator />);

    await fillGearSetup(user);
    await submitGear(user);

    await waitFor(() =>
      expect(
        screen.getByRole('region', {name: 'Gear Ratio Analysis Results'})
          .textContent,
      ).toContain('Range 3.5:1'),
    );

    const result = screen.getByRole('region', {
      name: 'Gear Ratio Analysis Results',
    });
    expect(result.textContent).toContain('Road');
    expect(result.textContent).toContain('53-39T');
    expect(result.textContent).toContain('11-28T');
    expect(result.textContent).toContain('90 RPM');
    expect(result.textContent).toContain('85 RPM');
    expect(result.textContent).toContain('4.82');
    expect(result.textContent).toContain('54.9 km/h');
    expect(result.textContent).toContain('10.17 m');
    expect(result.textContent).toContain('20 km/h');
    expect(result.textContent).toContain('30 km/h');
    expect(result.textContent).toContain('40 km/h');
    expect(scrollIntoView).toHaveBeenCalledWith({
      behavior: 'smooth',
      block: 'start',
    });
  });

  it('shares the source text and prints without exposing inputs', async () => {
    const share = vi.fn(async (_content: ShareContent) => {});
    const onPrint = vi.fn();
    const user = userEvent.setup({delay: null});
    render(
      <CyclingGearRatioCalculator
        shareEnvironment={{share}}
        onPrint={onPrint}
      />,
    );

    await fillGearSetup(user);
    await submitGear(user);
    await user.click(screen.getByRole('button', {name: 'Share results'}));

    await waitFor(() => expect(share).toHaveBeenCalledOnce());
    const content = share.mock.calls[0]?.[0];

    expect(content?.title).toBe('Cycling Gear Ratio Calculator Results');
    expect(content?.text).toBe(
      'Check out my cycling gear ratio analysis at Sports Tools Hub!',
    );
    expect(content?.url).toBe(window.location.href);

    await user.click(screen.getByRole('button', {name: 'Print Results'}));
    expect(onPrint).toHaveBeenCalledOnce();
  });

  it('validates with the source messages before calculating', async () => {
    const user = userEvent.setup({delay: null});
    render(<CyclingGearRatioCalculator />);

    await submitGear(user);

    expect(screen.getByText('Please select a bike type.')).toBeTruthy();
    expect(
      screen.getByText('Please select a rider type.'),
    ).toBeTruthy();
    expect(
      screen.getByText('Please select a terrain type.'),
    ).toBeTruthy();
    expect(
      screen.getByText('Please select a fitness level.'),
    ).toBeTruthy();
    expect(scrollIntoView).not.toHaveBeenCalled();
  });
});
