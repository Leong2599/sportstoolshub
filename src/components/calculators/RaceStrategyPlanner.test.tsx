// @vitest-environment jsdom
import {cleanup, render, screen, waitFor} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {afterEach, beforeEach, describe, expect, it, vi} from 'vitest';
import type {ShareContent} from '../../lib/calculators/share';
import {RaceStrategyPlanner} from './RaceStrategyPlanner';

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

async function fillStrategy(user: ReturnType<typeof userEvent.setup>) {
  await user.selectOptions(
    screen.getByRole('combobox', {name: 'Race Type'}),
    '10k',
  );
  await user.type(
    screen.getByRole('spinbutton', {name: 'Target Finish Time Minutes'}),
    '45',
  );
  await user.selectOptions(
    screen.getByRole('combobox', {name: 'Experience Level'}),
    'intermediate',
  );
  await user.selectOptions(
    screen.getByRole('combobox', {name: 'Race Goal'}),
    'pr',
  );
  await user.selectOptions(
    screen.getByRole('combobox', {name: 'Pacing Strategy'}),
    'negative-split',
  );
  await user.type(
    screen.getByRole('spinbutton', {name: 'Body Weight'}),
    '75',
  );
  await user.type(
    screen.getByRole('spinbutton', {name: 'Expected Temperature'}),
    '25',
  );
  await user.type(
    screen.getByRole('spinbutton', {name: 'Expected Humidity (%)'}),
    '50',
  );
}

async function submitStrategy(user: ReturnType<typeof userEvent.setup>) {
  await user.click(screen.getByRole('button', {name: 'Generate Strategy'}));
}

describe('RaceStrategyPlanner', () => {
  it('computes the source strategy end-to-end', async () => {
    const user = userEvent.setup({delay: null});
    render(<RaceStrategyPlanner />);

    await fillStrategy(user);
    await submitStrategy(user);

    await waitFor(() =>
      expect(
        screen.getByRole('region', {name: 'Race Strategy Overview'}).textContent,
      ).toContain('45:00'),
    );

    const result = screen.getByRole('region', {
      name: 'Race Strategy Overview',
    });
    expect(result.textContent).toContain('10K Run');
    expect(result.textContent).toContain('4:30/km');
    expect(result.textContent).toContain('First Half');
    expect(result.textContent).toContain('Second Half');
    expect(result.textContent).toContain('48% of race');
    expect(result.textContent).toContain('425ml fluid');
    expect(result.textContent).toContain('Medium');
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
      <RaceStrategyPlanner shareEnvironment={{share}} onPrint={onPrint} />,
    );

    await fillStrategy(user);
    await submitStrategy(user);
    await user.click(screen.getByRole('button', {name: 'Share results'}));

    await waitFor(() => expect(share).toHaveBeenCalledOnce());
    const content = share.mock.calls[0]?.[0];

    expect(content?.title).toBe('Race Strategy Planner Results');
    expect(content?.text).toBe(
      'My 10K Run target time is 45:00. Plan your race at Sports Tools Hub!',
    );
    expect(content?.text).not.toContain('75');
    expect(content?.url).toBe(window.location.href);

    await user.click(screen.getByRole('button', {name: 'Print Results'}));
    expect(onPrint).toHaveBeenCalledOnce();
  });

  it('validates with the source messages before calculating', async () => {
    const user = userEvent.setup({delay: null});
    render(<RaceStrategyPlanner />);

    await submitStrategy(user);

    expect(screen.getByText('Please select a race type.')).toBeTruthy();
    expect(
      screen.getByText('Please enter a valid target finish time.'),
    ).toBeTruthy();
    expect(
      screen.getByText('Please select an experience level.'),
    ).toBeTruthy();
    expect(screen.getByText('Please select a race goal.')).toBeTruthy();
    expect(
      screen.getByText('Please select a pacing strategy.'),
    ).toBeTruthy();
    expect(
      screen.getByText('Please enter a valid body weight.'),
    ).toBeTruthy();
    expect(
      screen.getByText('Please enter a valid temperature.'),
    ).toBeTruthy();
    expect(
      screen.getByText('Please enter a valid humidity.'),
    ).toBeTruthy();
    expect(scrollIntoView).not.toHaveBeenCalled();
  });
});
