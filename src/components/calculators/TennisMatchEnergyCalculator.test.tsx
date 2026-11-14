// @vitest-environment jsdom
import {cleanup, render, screen, waitFor} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {afterEach, beforeEach, describe, expect, it, vi} from 'vitest';
import type {ShareContent} from '../../lib/calculators/share';
import {TennisMatchEnergyCalculator} from './TennisMatchEnergyCalculator';

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

async function fillMatch(user: ReturnType<typeof userEvent.setup>) {
  await user.type(
    screen.getByRole('spinbutton', {name: 'Match Duration'}),
    '120',
  );
  await user.type(screen.getByRole('spinbutton', {name: 'Body Weight'}), '75');
  await user.selectOptions(
    screen.getByRole('combobox', {name: 'Playing Style'}),
    'all-court',
  );
  await user.selectOptions(
    screen.getByRole('combobox', {name: 'Court Surface'}),
    'hard-court',
  );
  await user.selectOptions(
    screen.getByRole('combobox', {name: 'Match Intensity'}),
    'moderate',
  );
  await user.type(
    screen.getByRole('spinbutton', {name: 'Average Rallies per Game'}),
    '6',
  );
  await user.type(screen.getByRole('spinbutton', {name: 'Temperature'}), '25');
  await user.type(screen.getByRole('spinbutton', {name: 'Humidity (%)'}), '50');
}

async function submitMatch(user: ReturnType<typeof userEvent.setup>) {
  await user.click(screen.getByRole('button', {name: 'Calculate Energy'}));
}

describe('TennisMatchEnergyCalculator', () => {
  it('computes the source energy expenditure end-to-end', async () => {
    const user = userEvent.setup({delay: null});
    render(<TennisMatchEnergyCalculator />);

    await fillMatch(user);
    await submitMatch(user);

    await waitFor(() =>
      expect(
        screen.getByRole('region', {name: 'Match Energy Results'}).textContent,
      ).toContain('1323 cal'),
    );

    const result = screen.getByRole('region', {name: 'Match Energy Results'});
    expect(result.textContent).toContain('1166');
    expect(result.textContent).toContain('11.0');
    expect(result.textContent).toContain('8.4');
    expect(result.textContent).toContain('7.6 km');
    expect(result.textContent).toContain('83 ml');
    expect(result.textContent).toContain('198 g');
    expect(result.textContent).toContain('72-108 hours');
    expect(result.textContent).toContain('Energy Expenditure Breakdown');
    expect(result.textContent).toContain(
      'High-calorie burn - excellent for fitness and weight management',
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
      <TennisMatchEnergyCalculator
        shareEnvironment={{share}}
        onPrint={onPrint}
      />,
    );

    await fillMatch(user);
    await submitMatch(user);
    await user.click(screen.getByRole('button', {name: 'Share results'}));

    await waitFor(() => expect(share).toHaveBeenCalledOnce());
    const content = share.mock.calls[0]?.[0];

    expect(content?.title).toBe('Tennis Match Energy Calculator Results');
    expect(content?.text).toBe(
      'I burned 1323 calories during my tennis match. Calculate your match energy at Sports Tools Hub!',
    );
    expect(content?.text).not.toContain('120');
    expect(content?.url).toBe(window.location.href);

    await user.click(screen.getByRole('button', {name: 'Print Results'}));
    expect(onPrint).toHaveBeenCalledOnce();
  });

  it('validates with the source messages before calculating', async () => {
    const user = userEvent.setup({delay: null});
    render(<TennisMatchEnergyCalculator />);

    await submitMatch(user);

    expect(
      screen.getByText('Please enter a valid match duration.'),
    ).toBeTruthy();
    expect(
      screen.getByText('Please enter a valid body weight.'),
    ).toBeTruthy();
    expect(screen.getByText('Please select a playing style.')).toBeTruthy();
    expect(screen.getByText('Please select a court surface.')).toBeTruthy();
    expect(
      screen.getByText('Please select a match intensity.'),
    ).toBeTruthy();
    expect(
      screen.getByText('Please enter a valid number of rallies per game.'),
    ).toBeTruthy();
    expect(
      screen.getByText('Please enter a valid temperature.'),
    ).toBeTruthy();
    expect(screen.getByText('Please enter a valid humidity.')).toBeTruthy();
    expect(scrollIntoView).not.toHaveBeenCalled();
  });
});
