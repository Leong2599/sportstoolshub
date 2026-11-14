// @vitest-environment jsdom
import {cleanup, render, screen, waitFor, within} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {afterEach, beforeEach, describe, expect, it, vi} from 'vitest';
import type {ShareContent} from '../../lib/calculators/share';
import {HeartRateCalculator} from './HeartRateCalculator';

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

async function fillHeartRate(user: ReturnType<typeof userEvent.setup>) {
  await user.type(screen.getByRole('spinbutton', {name: 'Age'}), '30');
  await user.type(
    screen.getByRole('spinbutton', {name: 'Resting Heart Rate (Optional)'}),
    '60',
  );
  await user.selectOptions(screen.getByRole('combobox', {name: 'Fitness Level'}), 'intermediate');
}

async function submitHeartRate(user: ReturnType<typeof userEvent.setup>) {
  await user.click(screen.getByRole('button', {name: 'Calculate Zones'}));
}

describe('HeartRateCalculator', () => {
  it('computes the source Karvonen zones end-to-end', async () => {
    const user = userEvent.setup();
    render(<HeartRateCalculator />);

    await fillHeartRate(user);
    await submitHeartRate(user);

    await waitFor(() =>
      expect(
        screen.getByRole('region', {name: 'Your Heart Rate Zones'}).textContent,
      ).toContain('190 BPM'),
    );

    const result = screen.getByRole('region', {
      name: 'Your Heart Rate Zones',
    });
    expect(result.textContent).toContain('Maximum Heart Rate');
    expect(result.textContent).toContain('125-138 BPM');
    expect(result.textContent).toContain('138-151 BPM');
    expect(result.textContent).toContain('151-164 BPM');
    expect(result.textContent).toContain('164-177 BPM');
    expect(result.textContent).toContain('177-190 BPM');
    expect(result.textContent).toContain('Zone 2');
    expect(result.textContent).toContain('Karvonen method');
    expect(scrollIntoView).toHaveBeenCalledWith({
      behavior: 'smooth',
      block: 'start',
    });
  });

  it('computes age-predicted zones without resting heart rate', async () => {
    const user = userEvent.setup();
    render(<HeartRateCalculator />);

    await user.type(screen.getByRole('spinbutton', {name: 'Age'}), '30');
    await user.selectOptions(screen.getByRole('combobox', {name: 'Fitness Level'}), 'intermediate');
    await user.click(
      within(screen.getByRole('group', {name: 'Calculation Method'})).getByRole(
        'radio',
        {name: 'Age-Predicted (220-age)'},
      ),
    );
    await submitHeartRate(user);

    await waitFor(() =>
      expect(
        screen.getByRole('region', {name: 'Your Heart Rate Zones'}).textContent,
      ).toContain('95-114 BPM'),
    );

    expect(
      screen.getByRole('region', {name: 'Your Heart Rate Zones'}).textContent,
    ).toContain('171-190 BPM');
    expect(
      screen.getByRole('region', {name: 'Your Heart Rate Zones'}).textContent,
    ).toContain('Consider measuring your resting heart rate');
  });

  it('shares only the computed result and prints without exposing inputs', async () => {
    const share = vi.fn(async (_content: ShareContent) => {});
    const onPrint = vi.fn();
    const user = userEvent.setup();
    render(
      <HeartRateCalculator shareEnvironment={{share}} onPrint={onPrint} />,
    );

    await fillHeartRate(user);
    await submitHeartRate(user);
    await user.click(screen.getByRole('button', {name: 'Share results'}));

    await waitFor(() => expect(share).toHaveBeenCalledOnce());
    const content = share.mock.calls[0]?.[0];

    expect(content?.title).toBe('Heart Rate Calculator Results');
    expect(content?.text).toBe(
      'My maximum heart rate is 190 BPM. Calculate your heart rate zones at Sports Tools Hub!',
    );
    expect(content?.text).not.toContain('30');
    expect(content?.text).not.toContain('60');
    expect(content?.url).toBe(window.location.href);

    await user.click(screen.getByRole('button', {name: 'Print Results'}));
    expect(onPrint).toHaveBeenCalledOnce();
  });

  it('validates with the source messages before calculating', async () => {
    const user = userEvent.setup();
    render(<HeartRateCalculator />);

    await submitHeartRate(user);

    expect(screen.getByText('Please enter a valid age (15-100).')).toBeTruthy();
    expect(
      screen.getByText('Please select your fitness level.'),
    ).toBeTruthy();
    expect(scrollIntoView).not.toHaveBeenCalled();

    await user.type(screen.getByRole('spinbutton', {name: 'Age'}), '30');
    await user.selectOptions(screen.getByRole('combobox', {name: 'Fitness Level'}), 'intermediate');
    await user.type(
      screen.getByRole('spinbutton', {name: 'Resting Heart Rate (Optional)'}),
      '200',
    );
    await submitHeartRate(user);

    expect(
      screen.getByText(
        'Please enter a valid resting heart rate (40-100) or leave blank.',
      ),
    ).toBeTruthy();
  });
});
