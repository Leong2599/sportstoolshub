// @vitest-environment jsdom
import {cleanup, render, screen, waitFor} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {afterEach, beforeEach, describe, expect, it, vi} from 'vitest';
import type {ShareContent} from '../../lib/calculators/share';
import {AltitudeAdjustmentCalculator} from './AltitudeAdjustmentCalculator';

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

async function fillAltitude(user: ReturnType<typeof userEvent.setup>) {
  await user.selectOptions(
    screen.getByRole('combobox', {name: 'Activity Type'}),
    'running',
  );
  await user.type(
    screen.getByRole('spinbutton', {name: 'Sea Level Pace Minutes (per km)'}),
    '4',
  );
  await user.type(
    screen.getByRole('spinbutton', {name: 'Sea Level Pace Seconds (per km)'}),
    '30',
  );
  await user.type(
    screen.getByRole('spinbutton', {name: 'Target Altitude'}),
    '2500',
  );
  await user.type(
    screen.getByRole('spinbutton', {name: 'Altitude Acclimation Days'}),
    '5',
  );
  await user.selectOptions(
    screen.getByRole('combobox', {name: 'Fitness Level'}),
    'competitive',
  );
  await user.type(
    screen.getByRole('spinbutton', {name: 'Activity Duration'}),
    '60',
  );
  await user.selectOptions(
    screen.getByRole('combobox', {name: 'Calculation Type'}),
    'training',
  );
}

async function submitAltitude(user: ReturnType<typeof userEvent.setup>) {
  await user.click(screen.getByRole('button', {name: 'Calculate Adjustments'}));
}

describe('AltitudeAdjustmentCalculator', () => {
  it('computes the source altitude analysis end-to-end', async () => {
    const user = userEvent.setup({delay: null});
    render(<AltitudeAdjustmentCalculator />);

    await fillAltitude(user);
    await submitAltitude(user);

    await waitFor(() =>
      expect(
        screen.getByRole('region', {name: 'Altitude Impact Analysis'})
          .textContent,
      ).toContain('4:49'),
    );

    const result = screen.getByRole('region', {
      name: 'Altitude Impact Analysis',
    });
    expect(result.textContent).toContain('4:30');
    expect(result.textContent).toContain('2500m');
    expect(result.textContent).toContain('10.0');
    expect(result.textContent).toContain('7.1');
    expect(result.textContent).toContain('Low');
    expect(result.textContent).toContain('Training Zones at Altitude');
    expect(result.textContent).toContain('Recovery');
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
      <AltitudeAdjustmentCalculator
        shareEnvironment={{share}}
        onPrint={onPrint}
      />,
    );

    await fillAltitude(user);
    await submitAltitude(user);
    await user.click(screen.getByRole('button', {name: 'Share results'}));

    await waitFor(() => expect(share).toHaveBeenCalledOnce());
    const content = share.mock.calls[0]?.[0];

    expect(content?.title).toBe('Altitude Adjustment Calculator Results');
    expect(content?.text).toBe(
      'My altitude pace is 4:49 at 2500m with a 7.1% performance decrease. Plan for altitude at Sports Tools Hub!',
    );
    expect(content?.text).not.toContain('60');
    expect(content?.url).toBe(window.location.href);

    await user.click(screen.getByRole('button', {name: 'Print Results'}));
    expect(onPrint).toHaveBeenCalledOnce();
  });

  it('validates with the source messages before calculating', async () => {
    const user = userEvent.setup({delay: null});
    render(<AltitudeAdjustmentCalculator />);

    await submitAltitude(user);

    expect(
      screen.getByText('Please select an activity type.'),
    ).toBeTruthy();
    expect(
      screen.getByText('Please enter a valid sea level pace.'),
    ).toBeTruthy();
    expect(
      screen.getByText('Please enter a valid target altitude.'),
    ).toBeTruthy();
    expect(
      screen.getByText('Please select a fitness level.'),
    ).toBeTruthy();
    expect(
      screen.getByText('Please select a calculation type.'),
    ).toBeTruthy();
    expect(scrollIntoView).not.toHaveBeenCalled();
  });
});
