// @vitest-environment jsdom
import {cleanup, render, screen, waitFor} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {afterEach, beforeEach, describe, expect, it, vi} from 'vitest';
import type {ShareContent} from '../../lib/calculators/share';
import {SoccerMatchLoadCalculator} from './SoccerMatchLoadCalculator';

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
  await user.selectOptions(
    screen.getByRole('combobox', {name: 'Playing Position'}),
    'midfielder',
  );
  await user.type(
    screen.getByRole('spinbutton', {name: 'Minutes Played'}),
    '90',
  );
  await user.type(
    screen.getByRole('spinbutton', {name: 'Total Distance Covered'}),
    '11',
  );
  await user.type(
    screen.getByRole('spinbutton', {name: 'High-Intensity Distance'}),
    '0.7',
  );
  await user.type(screen.getByRole('spinbutton', {name: 'Number of Sprints'}), '25');
  await user.type(
    screen.getByRole('spinbutton', {name: 'Match Rating (1-10)'}),
    '7.5',
  );
  await user.type(
    screen.getByRole('spinbutton', {name: 'Match Temperature'}),
    '20',
  );
}

async function submitMatch(user: ReturnType<typeof userEvent.setup>) {
  await user.click(
    screen.getByRole('button', {name: 'Calculate Match Load'}),
  );
}

describe('SoccerMatchLoadCalculator', () => {
  it('computes the source match load analysis end-to-end', async () => {
    const user = userEvent.setup({delay: null});
    render(<SoccerMatchLoadCalculator />);

    await fillMatch(user);
    await submitMatch(user);

    await waitFor(() =>
      expect(
        screen.getByRole('region', {name: 'Match Load Analysis'}).textContent,
      ).toContain('143.5'),
    );

    const result = screen.getByRole('region', {name: 'Match Load Analysis'});
    expect(result.textContent).toContain('93%');
    expect(result.textContent).toContain('11.00 km');
    expect(result.textContent).toContain('6.4%');
    expect(result.textContent).toContain('25.0');
    expect(result.textContent).toContain('98.0%');
    expect(result.textContent).toContain('96+ hours');
    expect(result.textContent).toContain('Very High');
    expect(result.textContent).toContain('Distance vs Average');
    expect(result.textContent).toContain('92%');
    expect(result.textContent).toContain(
      'Improve stamina for 90-minute performance',
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
      <SoccerMatchLoadCalculator
        shareEnvironment={{share}}
        onPrint={onPrint}
      />,
    );

    await fillMatch(user);
    await submitMatch(user);
    await user.click(screen.getByRole('button', {name: 'Share results'}));

    await waitFor(() => expect(share).toHaveBeenCalledOnce());
    const content = share.mock.calls[0]?.[0];

    expect(content?.title).toBe('Soccer Match Load Calculator Results');
    expect(content?.text).toBe(
      'My match load was 143.5 with a 96+ hours recovery window. Analyze your match load at Sports Tools Hub!',
    );
    expect(content?.text).not.toContain('90');
    expect(content?.url).toBe(window.location.href);

    await user.click(screen.getByRole('button', {name: 'Print Results'}));
    expect(onPrint).toHaveBeenCalledOnce();
  });

  it('validates with the source messages before calculating', async () => {
    const user = userEvent.setup({delay: null});
    render(<SoccerMatchLoadCalculator />);

    await submitMatch(user);

    expect(
      screen.getByText('Please select a playing position.'),
    ).toBeTruthy();
    expect(
      screen.getByText('Please enter a valid number of minutes played.'),
    ).toBeTruthy();
    expect(
      screen.getByText('Please enter a valid distance covered.'),
    ).toBeTruthy();
    expect(
      screen.getByText('Please enter a valid high-intensity distance.'),
    ).toBeTruthy();
    expect(
      screen.getByText('Please enter a valid number of sprints.'),
    ).toBeTruthy();
    expect(
      screen.getByText('Please enter a valid match rating.'),
    ).toBeTruthy();
    expect(
      screen.getByText('Please enter a valid temperature.'),
    ).toBeTruthy();
    expect(scrollIntoView).not.toHaveBeenCalled();
  });
});
