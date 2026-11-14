// @vitest-environment jsdom
import {cleanup, render, screen, waitFor, within} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {afterEach, beforeEach, describe, expect, it, vi} from 'vitest';
import type {ShareContent} from '../../lib/calculators/share';
import {RunningCalorieCalculator} from './RunningCalorieCalculator';

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

async function fillRunning(
  user: ReturnType<typeof userEvent.setup>,
) {
  await user.type(screen.getByRole('spinbutton', {name: 'Weight'}), '70');
  await user.click(
    within(screen.getByRole('group', {name: 'Gender'})).getByRole('radio', {
      name: 'Male',
    }),
  );
  await user.type(screen.getByRole('spinbutton', {name: 'Age'}), '30');
  await user.type(
    screen.getByRole('spinbutton', {name: 'Distance'}),
    '10',
  );
  await user.type(
    screen.getByRole('spinbutton', {name: 'Pace Minutes'}),
    '5',
  );
}

async function submitRunning(user: ReturnType<typeof userEvent.setup>) {
  await user.click(screen.getByRole('button', {name: 'Calculate Calories'}));
}

describe('RunningCalorieCalculator', () => {
  it('computes the source MET example end-to-end', async () => {
    const user = userEvent.setup({delay: null});
    render(<RunningCalorieCalculator />);

    await user.selectOptions(
      screen.getByRole('combobox', {name: 'Calculation Method'}),
      'distance-pace',
    );
    await fillRunning(user);
    await submitRunning(user);

    await waitFor(() =>
      expect(
        screen.getByRole('region', {
          name: 'Your Running Calorie Results',
        }).textContent,
      ).toContain('700 cal'),
    );

    const result = screen.getByRole('region', {
      name: 'Your Running Calorie Results',
    });
    expect(result.textContent).toContain('10.00 km');
    expect(result.textContent).toContain('50 minutes');
    expect(result.textContent).toContain('5:00/km');
    expect(result.textContent).toContain('12.0 km/h');
    expect(result.textContent).toContain('Calories per km');
    expect(result.textContent).toContain('Base Running Calories');
    expect(result.textContent).toContain('595');
    expect(result.textContent).toContain('Walking (1 hour)');
    expect(result.textContent).toContain('280 cal');
    expect(result.textContent).toContain(
      'You burned 700 calories during your 10.0km run.',
    );
    expect(scrollIntoView).toHaveBeenCalledWith({
      behavior: 'smooth',
      block: 'start',
    });
  });

  it('applies the source terrain adjustment', async () => {
    const user = userEvent.setup({delay: null});
    render(<RunningCalorieCalculator />);

    await user.selectOptions(
      screen.getByRole('combobox', {name: 'Calculation Method'}),
      'distance-pace',
    );
    await fillRunning(user);
    await user.selectOptions(
      screen.getByRole('combobox', {name: 'Terrain'}),
      'hilly-road',
    );
    await submitRunning(user);

    await waitFor(() =>
      expect(
        screen.getByRole('region', {
          name: 'Your Running Calorie Results',
        }).textContent,
      ).toContain('804 cal'),
    );
  });

  it('shares only the computed result and prints without exposing inputs', async () => {
    const share = vi.fn(async (_content: ShareContent) => {});
    const onPrint = vi.fn();
    const user = userEvent.setup({delay: null});
    render(
      <RunningCalorieCalculator
        shareEnvironment={{share}}
        onPrint={onPrint}
      />,
    );

    await user.selectOptions(
      screen.getByRole('combobox', {name: 'Calculation Method'}),
      'distance-pace',
    );
    await fillRunning(user);
    await submitRunning(user);
    await user.click(screen.getByRole('button', {name: 'Share results'}));

    await waitFor(() => expect(share).toHaveBeenCalledOnce());
    const content = share.mock.calls[0]?.[0];

    expect(content?.title).toBe('Running Calorie Calculator Results');
    expect(content?.text).toBe(
      'I burned 700 calories during my run! Calculate your running calories at Sports Tools Hub!',
    );
    expect(content?.text).not.toContain('12.0 km/h');
    expect(content?.url).toBe(window.location.href);

    await user.click(screen.getByRole('button', {name: 'Print Results'}));
    expect(onPrint).toHaveBeenCalledOnce();
  });

  it('validates with the source messages before calculating', async () => {
    const user = userEvent.setup({delay: null});
    render(<RunningCalorieCalculator />);

    await submitRunning(user);

    expect(
      screen.getAllByText('Please fill in all required fields.').length,
    ).toBeGreaterThan(0);
    expect(scrollIntoView).not.toHaveBeenCalled();
  });
});
