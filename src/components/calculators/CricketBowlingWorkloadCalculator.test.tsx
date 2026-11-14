// @vitest-environment jsdom
import {cleanup, render, screen, waitFor} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {afterEach, beforeEach, describe, expect, it, vi} from 'vitest';
import type {ShareContent} from '../../lib/calculators/share';
import {CricketBowlingWorkloadCalculator} from './CricketBowlingWorkloadCalculator';

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

async function fillSession(user: ReturnType<typeof userEvent.setup>) {
  await user.selectOptions(
    screen.getByRole('combobox', {name: 'Bowling Type'}),
    'fast',
  );
  await user.type(screen.getByRole('spinbutton', {name: 'Balls Bowled'}), '36');
  await user.type(screen.getByRole('spinbutton', {name: 'Overs'}), '4');
  await user.type(
    screen.getByRole('spinbutton', {name: 'Session Duration (minutes)'}),
    '45',
  );
  await user.selectOptions(
    screen.getByRole('combobox', {name: 'Session Intensity'}),
    'high',
  );
  await user.type(
    screen.getByRole('spinbutton', {name: 'Days Since Last Bowling'}),
    '3',
  );
  await user.type(screen.getByRole('spinbutton', {name: 'Age'}), '24');
  await user.type(
    screen.getByRole('spinbutton', {name: 'Years of Experience'}),
    '6',
  );
  await user.type(
    screen.getByRole('spinbutton', {name: 'Recent 7-Day Workload (balls)'}),
    '400',
  );
}

async function submitSession(user: ReturnType<typeof userEvent.setup>) {
  await user.click(screen.getByRole('button', {name: 'Analyze Workload'}));
}

describe('CricketBowlingWorkloadCalculator', () => {
  it('computes the source workload analysis end-to-end', async () => {
    const user = userEvent.setup({delay: null});
    render(<CricketBowlingWorkloadCalculator />);

    await fillSession(user);
    await submitSession(user);

    await waitFor(() =>
      expect(
        screen.getByRole('region', {name: 'Bowling Workload Analysis'})
          .textContent,
      ).toContain('81.1'),
    );

    const result = screen.getByRole('region', {
      name: 'Bowling Workload Analysis',
    });
    expect(result.textContent).toContain('Low');
    expect(result.textContent).toContain('90%');
    expect(result.textContent).toContain('0.09');
    expect(result.textContent).toContain('19%');
    expect(result.textContent).toContain('9.0');
    expect(result.textContent).toContain('72-96 hours');
    expect(result.textContent).toContain('Acute:Chronic Workload Ratio');
    expect(result.textContent).toContain(
      'Focus on strengthening shoulder and core',
    );
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
      <CricketBowlingWorkloadCalculator
        shareEnvironment={{share}}
        onPrint={onPrint}
      />,
    );

    await fillSession(user);
    await submitSession(user);
    await user.click(screen.getByRole('button', {name: 'Share results'}));

    await waitFor(() => expect(share).toHaveBeenCalledOnce());
    const content = share.mock.calls[0]?.[0];

    expect(content?.title).toBe('Cricket Bowling Workload Tracker Results');
    expect(content?.text).toBe(
      'My bowling workload score was 81.1 with low injury risk. Track your workload at Sports Tools Hub!',
    );
    expect(content?.text).not.toContain('400');
    expect(content?.url).toBe(window.location.href);

    await user.click(screen.getByRole('button', {name: 'Print Results'}));
    expect(onPrint).toHaveBeenCalledOnce();
  });

  it('validates with the source messages before calculating', async () => {
    const user = userEvent.setup({delay: null});
    render(<CricketBowlingWorkloadCalculator />);

    await submitSession(user);

    expect(screen.getByText('Please select a bowling type.')).toBeTruthy();
    expect(
      screen.getByText('Please enter a valid number of balls bowled.'),
    ).toBeTruthy();
    expect(
      screen.getByText('Please enter a valid number of overs.'),
    ).toBeTruthy();
    expect(
      screen.getByText('Please enter a valid session duration.'),
    ).toBeTruthy();
    expect(
      screen.getByText('Please select an intensity level.'),
    ).toBeTruthy();
    expect(
      screen.getByText(
        'Please enter a valid number of days since your last session.',
      ),
    ).toBeTruthy();
    expect(screen.getByText('Please enter a valid age.')).toBeTruthy();
    expect(
      screen.getByText('Please enter a valid number of years of experience.'),
    ).toBeTruthy();
    expect(
      screen.getByText('Please enter a valid recent workload.'),
    ).toBeTruthy();
    expect(scrollIntoView).not.toHaveBeenCalled();
  });
});
