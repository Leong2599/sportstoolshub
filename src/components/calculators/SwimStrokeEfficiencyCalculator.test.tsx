// @vitest-environment jsdom
import {cleanup, render, screen, waitFor} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {afterEach, beforeEach, describe, expect, it, vi} from 'vitest';
import type {ShareContent} from '../../lib/calculators/share';
import {SwimStrokeEfficiencyCalculator} from './SwimStrokeEfficiencyCalculator';

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

async function fillStroke(user: ReturnType<typeof userEvent.setup>) {
  await user.selectOptions(
    screen.getByRole('combobox', {name: 'Stroke Type'}),
    'freestyle',
  );
  await user.selectOptions(
    screen.getByRole('combobox', {name: 'Pool Length'}),
    '50',
  );
  await user.type(
    screen.getByRole('spinbutton', {name: 'Distance Swum'}),
    '1000',
  );
  await user.type(
    screen.getByRole('spinbutton', {name: 'Total Time Minutes'}),
    '15',
  );
  await user.type(
    screen.getByRole('spinbutton', {name: 'Total Time Seconds'}),
    '0',
  );
  await user.type(
    screen.getByRole('spinbutton', {name: 'Total Stroke Count'}),
    '700',
  );
  await user.selectOptions(
    screen.getByRole('combobox', {name: 'Swimming Experience'}),
    'intermediate',
  );
  await user.selectOptions(
    screen.getByRole('combobox', {name: 'Training Goal'}),
    'fitness',
  );
  await user.selectOptions(
    screen.getByRole('combobox', {name: 'Swimmer Type'}),
    'distance',
  );
}

async function submitStroke(user: ReturnType<typeof userEvent.setup>) {
  await user.click(
    screen.getByRole('button', {name: 'Calculate Stroke Efficiency'}),
  );
}

describe('SwimStrokeEfficiencyCalculator', () => {
  it('computes the source SWOLF example end-to-end', async () => {
    const user = userEvent.setup({delay: null});
    render(<SwimStrokeEfficiencyCalculator />);

    await fillStroke(user);
    await submitStroke(user);

    await waitFor(() =>
      expect(
        screen.getByRole('region', {name: 'Stroke Efficiency Results'})
          .textContent,
      ).toContain('80'),
    );

    const result = screen.getByRole('region', {
      name: 'Stroke Efficiency Results',
    });
    expect(result.textContent).toContain('SWOLF score');
    expect(result.textContent).toContain('1:30/100m');
    expect(result.textContent).toContain('4.00 km/h');
    expect(result.textContent).toContain('47 spm');
    expect(result.textContent).toContain('1.43m');
    expect(result.textContent).toContain('35 per length');
    expect(result.textContent).toContain('69%');
    expect(result.textContent).toContain('Novice');
    expect(result.textContent).toContain(
      'Reduce stroke count by improving catch and pull technique',
    );
    expect(scrollIntoView).toHaveBeenCalledWith({
      behavior: 'smooth',
      block: 'start',
    });
  });

  it('shares the source text and prints without exposing inputs', async () => {
    const share = vi.fn(async (_content: ShareContent) => {});
    const onPrint = vi.fn();
    const user = userEvent.setup({delay: null});
    render(
      <SwimStrokeEfficiencyCalculator
        shareEnvironment={{share}}
        onPrint={onPrint}
      />,
    );

    await fillStroke(user);
    await submitStroke(user);
    await user.click(screen.getByRole('button', {name: 'Share results'}));

    await waitFor(() => expect(share).toHaveBeenCalledOnce());
    const content = share.mock.calls[0]?.[0];

    expect(content?.title).toBe(
      'Swimming Stroke Efficiency Calculator Results',
    );
    expect(content?.text).toBe(
      'Check out my swimming stroke efficiency analysis at Sports Tools Hub!',
    );
    expect(content?.url).toBe(window.location.href);

    await user.click(screen.getByRole('button', {name: 'Print Results'}));
    expect(onPrint).toHaveBeenCalledOnce();
  });

  it('validates with the source messages before calculating', async () => {
    const user = userEvent.setup({delay: null});
    render(<SwimStrokeEfficiencyCalculator />);

    await submitStroke(user);

    expect(screen.getByText('Please select a stroke type.')).toBeTruthy();
    expect(screen.getByText('Please select a pool length.')).toBeTruthy();
    expect(screen.getByText('Please enter a valid distance.')).toBeTruthy();
    expect(screen.getByText('Please enter a valid time.')).toBeTruthy();
    expect(screen.getByText('Please enter a valid stroke count.')).toBeTruthy();
    expect(
      screen.getByText('Please select your experience level.'),
    ).toBeTruthy();
    expect(
      screen.getByText('Please select a training goal.'),
    ).toBeTruthy();
    expect(screen.getByText('Please select a swimmer type.')).toBeTruthy();
    expect(scrollIntoView).not.toHaveBeenCalled();
  });
});
