// @vitest-environment jsdom
import {cleanup, render, screen, waitFor} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {afterEach, beforeEach, describe, expect, it, vi} from 'vitest';
import type {ShareContent} from '../../lib/calculators/share';
import {GolfHandicapCalculator} from './GolfHandicapCalculator';

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

async function submitGolf(user: ReturnType<typeof userEvent.setup>) {
  await user.click(screen.getByRole('button', {name: 'Calculate'}));
}

describe('GolfHandicapCalculator', () => {
  it('computes the source handicap index example end-to-end', async () => {
    const user = userEvent.setup({delay: null});
    render(<GolfHandicapCalculator />);

    await user.selectOptions(
      screen.getByRole('combobox', {name: 'Calculation Type'}),
      'handicap-index',
    );
    await user.type(
      screen.getByRole('spinbutton', {name: 'Score 1'}),
      '90',
    );
    await user.type(
      screen.getByRole('spinbutton', {name: 'Course Rating 1'}),
      '72',
    );
    await user.type(
      screen.getByRole('spinbutton', {name: 'Slope Rating 1'}),
      '120',
    );
    await user.type(
      screen.getByRole('spinbutton', {name: 'Score 2'}),
      '95',
    );
    await user.type(
      screen.getByRole('spinbutton', {name: 'Course Rating 2'}),
      '73',
    );
    await user.type(
      screen.getByRole('spinbutton', {name: 'Slope Rating 2'}),
      '125',
    );
    await user.type(
      screen.getByRole('spinbutton', {name: 'Score 3'}),
      '100',
    );
    await user.type(
      screen.getByRole('spinbutton', {name: 'Course Rating 3'}),
      '74',
    );
    await user.type(
      screen.getByRole('spinbutton', {name: 'Slope Rating 3'}),
      '130',
    );
    await submitGolf(user);

    await waitFor(() =>
      expect(
        screen.getByRole('region', {name: 'Your Handicap Results'}).textContent,
      ).toContain('16.3'),
    );

    const result = screen.getByRole('region', {name: 'Your Handicap Results'});
    expect(result.textContent).toContain('Your Handicap Index');
    expect(result.textContent).toContain('Scores Used');
    expect(result.textContent).toContain('1 of 3');
    expect(result.textContent).toContain('Good solid golf game.');
    expect(scrollIntoView).toHaveBeenCalledWith({
      behavior: 'smooth',
      block: 'start',
    });
  }, 20000);

  it('computes the source course handicap example end-to-end', async () => {
    const user = userEvent.setup({delay: null});
    render(<GolfHandicapCalculator />);

    await user.selectOptions(
      screen.getByRole('combobox', {name: 'Calculation Type'}),
      'course-handicap',
    );
    await user.type(
      screen.getByRole('spinbutton', {name: 'Your Handicap Index'}),
      '12.4',
    );
    await user.type(
      screen.getByRole('spinbutton', {name: 'Course Rating'}),
      '72.5',
    );
    await user.type(
      screen.getByRole('spinbutton', {name: 'Slope Rating'}),
      '125',
    );
    await user.type(
      screen.getByRole('spinbutton', {name: 'Par for Course'}),
      '72',
    );
    await submitGolf(user);

    await waitFor(() =>
      expect(
        screen.getByRole('region', {name: 'Your Handicap Results'}).textContent,
      ).toContain('Your Course Handicap'),
    );

    const result = screen.getByRole('region', {name: 'Your Handicap Results'});
    expect(result.textContent).toContain('12.4 × 125 ÷ 113 = 13.7');
    expect(result.textContent).toContain('Course Handicap = 14');
    expect(result.textContent).toContain('Target Score');
    expect(result.textContent).toContain('86');
  });

  it('shares the source text and prints without exposing inputs', async () => {
    const share = vi.fn(async (_content: ShareContent) => {});
    const onPrint = vi.fn();
    const user = userEvent.setup({delay: null});
    render(
      <GolfHandicapCalculator shareEnvironment={{share}} onPrint={onPrint} />,
    );

    await user.selectOptions(
      screen.getByRole('combobox', {name: 'Calculation Type'}),
      'net-score',
    );
    await user.type(
      screen.getByRole('spinbutton', {name: 'Gross Score'}),
      '90',
    );
    await user.type(
      screen.getByRole('spinbutton', {name: 'Course Handicap'}),
      '12',
    );
    await submitGolf(user);
    await user.click(screen.getByRole('button', {name: 'Share results'}));

    await waitFor(() => expect(share).toHaveBeenCalledOnce());
    const content = share.mock.calls[0]?.[0];

    expect(content?.title).toBe('Golf Handicap Calculator Results');
    expect(content?.text).toBe(
      'Check out my golf handicap calculations at Sports Tools Hub!',
    );
    expect(content?.url).toBe(window.location.href);

    await user.click(screen.getByRole('button', {name: 'Print Results'}));
    expect(onPrint).toHaveBeenCalledOnce();
  });

  it('validates with the source messages before calculating', async () => {
    const user = userEvent.setup({delay: null});
    render(<GolfHandicapCalculator />);

    await submitGolf(user);

    expect(
      screen.getByText('Please select a calculation type.'),
    ).toBeTruthy();
    expect(scrollIntoView).not.toHaveBeenCalled();

    await user.selectOptions(
      screen.getByRole('combobox', {name: 'Calculation Type'}),
      'handicap-index',
    );
    await submitGolf(user);

    expect(
      screen.getByText('Please enter at least 3 complete scores.'),
    ).toBeTruthy();
  });
});
