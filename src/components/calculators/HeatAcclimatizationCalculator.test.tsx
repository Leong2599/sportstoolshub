// @vitest-environment jsdom
import {cleanup, render, screen, waitFor} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {afterEach, beforeEach, describe, expect, it, vi} from 'vitest';
import type {ShareContent} from '../../lib/calculators/share';
import {HeatAcclimatizationCalculator} from './HeatAcclimatizationCalculator';

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

async function fillHeat(user: ReturnType<typeof userEvent.setup>) {
  await user.selectOptions(
    screen.getByRole('combobox', {name: 'Activity Type'}),
    'running',
  );
  await user.type(
    screen.getByRole('spinbutton', {name: 'Normal Pace Minutes (per km)'}),
    '5',
  );
  await user.type(
    screen.getByRole('spinbutton', {name: 'Normal Pace Seconds (per km)'}),
    '0',
  );
  await user.type(
    screen.getByRole('spinbutton', {name: 'Current Temperature'}),
    '32',
  );
  await user.type(
    screen.getByRole('spinbutton', {name: 'Humidity (%)'}),
    '70',
  );
  await user.type(
    screen.getByRole('spinbutton', {name: 'Heat Acclimation Days'}),
    '7',
  );
  await user.type(
    screen.getByRole('spinbutton', {name: 'Body Weight'}),
    '75',
  );
  await user.type(
    screen.getByRole('spinbutton', {name: 'Activity Duration'}),
    '90',
  );
  await user.selectOptions(
    screen.getByRole('combobox', {name: 'Intensity Level'}),
    'hard',
  );
}

async function submitHeat(user: ReturnType<typeof userEvent.setup>) {
  await user.click(screen.getByRole('button', {name: 'Calculate Adjustments'}));
}

describe('HeatAcclimatizationCalculator', () => {
  it('computes the source heat analysis end-to-end', async () => {
    const user = userEvent.setup({delay: null});
    render(<HeatAcclimatizationCalculator />);

    await fillHeat(user);
    await submitHeat(user);

    await waitFor(() =>
      expect(
        screen.getByRole('region', {name: 'Heat Acclimatization Results'})
          .textContent,
      ).toContain('5:53'),
    );

    const result = screen.getByRole('region', {
      name: 'Heat Acclimatization Results',
    });
    expect(result.textContent).toContain('5:00');
    expect(result.textContent).toContain('Very High');
    expect(result.textContent).toContain('Significant');
    expect(result.textContent).toContain('Medium');
    expect(result.textContent).toContain('3240 ml');
    expect(result.textContent).toContain('2160 ml/hour');
    expect(result.textContent).toContain('810 mg sodium');
    expect(result.textContent).toContain('50% complete');
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
      <HeatAcclimatizationCalculator
        shareEnvironment={{share}}
        onPrint={onPrint}
      />,
    );

    await fillHeat(user);
    await submitHeat(user);
    await user.click(screen.getByRole('button', {name: 'Share results'}));

    await waitFor(() => expect(share).toHaveBeenCalledOnce());
    const content = share.mock.calls[0]?.[0];

    expect(content?.title).toBe('Heat Acclimatization Calculator Results');
    expect(content?.text).toBe(
      'My adjusted pace in the heat is 5:53 with very high heat stress. Plan your heat training at Sports Tools Hub!',
    );
    expect(content?.text).not.toContain('75');
    expect(content?.url).toBe(window.location.href);

    await user.click(screen.getByRole('button', {name: 'Print Results'}));
    expect(onPrint).toHaveBeenCalledOnce();
  });

  it('validates with the source messages before calculating', async () => {
    const user = userEvent.setup({delay: null});
    render(<HeatAcclimatizationCalculator />);

    await submitHeat(user);

    expect(
      screen.getByText('Please select an activity type.'),
    ).toBeTruthy();
    expect(
      screen.getByText('Please enter a valid normal pace.'),
    ).toBeTruthy();
    expect(
      screen.getByText('Please enter a valid temperature.'),
    ).toBeTruthy();
    expect(screen.getByText('Please enter a valid humidity.')).toBeTruthy();
    expect(
      screen.getByText('Please enter a valid body weight.'),
    ).toBeTruthy();
    expect(
      screen.getByText('Please enter a valid activity duration.'),
    ).toBeTruthy();
    expect(
      screen.getByText('Please select an intensity level.'),
    ).toBeTruthy();
    expect(scrollIntoView).not.toHaveBeenCalled();
  });
});
