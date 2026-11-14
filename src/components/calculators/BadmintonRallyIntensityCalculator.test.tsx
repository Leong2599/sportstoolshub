// @vitest-environment jsdom
import {cleanup, render, screen, waitFor} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {afterEach, beforeEach, describe, expect, it, vi} from 'vitest';
import type {ShareContent} from '../../lib/calculators/share';
import {BadmintonRallyIntensityCalculator} from './BadmintonRallyIntensityCalculator';

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
    screen.getByRole('spinbutton', {name: 'Match/Game Duration'}),
    '45',
  );
  await user.type(
    screen.getByRole('spinbutton', {name: 'Total Rallies'}),
    '300',
  );
  await user.type(
    screen.getByRole('spinbutton', {name: 'Average Shots per Rally'}),
    '9',
  );
  await user.selectOptions(
    screen.getByRole('combobox', {name: 'Playing Format'}),
    'singles',
  );
  await user.selectOptions(
    screen.getByRole('combobox', {name: 'Playing Style'}),
    'attacking',
  );
  await user.selectOptions(
    screen.getByRole('combobox', {name: 'Opponent Level'}),
    'intermediate',
  );
  await user.type(screen.getByRole('spinbutton', {name: 'Number of Smashes'}), '60');
  await user.type(screen.getByRole('spinbutton', {name: 'Net Shot Count'}), '40');
  await user.type(screen.getByRole('spinbutton', {name: 'Clear Count'}), '50');
}

async function submitMatch(user: ReturnType<typeof userEvent.setup>) {
  await user.click(
    screen.getByRole('button', {name: 'Analyze Rally Intensity'}),
  );
}

describe('BadmintonRallyIntensityCalculator', () => {
  it('computes the source rally analysis end-to-end', async () => {
    const user = userEvent.setup({delay: null});
    render(<BadmintonRallyIntensityCalculator />);

    await fillMatch(user);
    await submitMatch(user);

    await waitFor(() =>
      expect(
        screen.getByRole('region', {name: 'Rally Intensity Results'}).textContent,
      ).toContain('75.0'),
    );

    const result = screen.getByRole('region', {
      name: 'Rally Intensity Results',
    });
    expect(result.textContent).toContain('Excellent');
    expect(result.textContent).toContain('6.7');
    expect(result.textContent).toContain('9.0s');
    expect(result.textContent).toContain('60.0');
    expect(result.textContent).toContain('720');
    expect(result.textContent).toContain('86.2');
    expect(result.textContent).toContain('40.0%');
    expect(result.textContent).toContain('26.7%');
    expect(result.textContent).toContain('33.3%');
    expect(result.textContent).toContain('Focus on court coverage and stamina');
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
      <BadmintonRallyIntensityCalculator
        shareEnvironment={{share}}
        onPrint={onPrint}
      />,
    );

    await fillMatch(user);
    await submitMatch(user);
    await user.click(screen.getByRole('button', {name: 'Share results'}));

    await waitFor(() => expect(share).toHaveBeenCalledOnce());
    const content = share.mock.calls[0]?.[0];

    expect(content?.title).toBe(
      'Badminton Rally Intensity Calculator Results',
    );
    expect(content?.text).toBe(
      'My rally intensity score was 75.0 (Excellent). Analyze your rally intensity at Sports Tools Hub!',
    );
    expect(content?.text).not.toContain('300');
    expect(content?.url).toBe(window.location.href);

    await user.click(screen.getByRole('button', {name: 'Print Results'}));
    expect(onPrint).toHaveBeenCalledOnce();
  });

  it('validates with the source messages before calculating', async () => {
    const user = userEvent.setup({delay: null});
    render(<BadmintonRallyIntensityCalculator />);

    await submitMatch(user);

    expect(
      screen.getByText('Please enter a valid match duration.'),
    ).toBeTruthy();
    expect(
      screen.getByText('Please enter a valid number of rallies.'),
    ).toBeTruthy();
    expect(
      screen.getByText('Please enter a valid average shots per rally.'),
    ).toBeTruthy();
    expect(
      screen.getByText('Please select a playing format.'),
    ).toBeTruthy();
    expect(screen.getByText('Please select a playing style.')).toBeTruthy();
    expect(
      screen.getByText('Please select an opponent level.'),
    ).toBeTruthy();
    expect(
      screen.getByText('Please enter a valid number of smashes.'),
    ).toBeTruthy();
    expect(
      screen.getByText('Please enter a valid number of net shots.'),
    ).toBeTruthy();
    expect(
      screen.getByText('Please enter a valid number of clears.'),
    ).toBeTruthy();
    expect(scrollIntoView).not.toHaveBeenCalled();
  });
});
