// @vitest-environment jsdom
import {cleanup, render, screen, waitFor} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {afterEach, beforeEach, describe, expect, it, vi} from 'vitest';
import type {ShareContent} from '../../lib/calculators/share';
import {TrainingLoadCalculator} from './TrainingLoadCalculator';

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

async function fillLoad(user: ReturnType<typeof userEvent.setup>) {
  await user.selectOptions(
    screen.getByRole('combobox', {name: 'Sport Type'}),
    'running',
  );
  await user.type(
    screen.getByRole('spinbutton', {name: 'Current CTL (Chronic Training Load)'}),
    '60',
  );
  await user.type(
    screen.getByRole('spinbutton', {name: 'Current ATL (Acute Training Load)'}),
    '45',
  );
  await user.type(
    screen.getByRole('spinbutton', {
      name: "Today's Training Stress Score (TSS)",
    }),
    '70',
  );
  await user.selectOptions(
    screen.getByRole('combobox', {name: 'Training Goal'}),
    'build-phase',
  );
  await user.selectOptions(
    screen.getByRole('combobox', {name: 'Experience Level'}),
    'intermediate',
  );
  await user.selectOptions(
    screen.getByRole('combobox', {name: 'Upcoming Event'}),
    'none',
  );
}

async function submitLoad(user: ReturnType<typeof userEvent.setup>) {
  await user.click(
    screen.getByRole('button', {name: 'Analyze Training Load'}),
  );
}

describe('TrainingLoadCalculator', () => {
  it('computes the source load projection end-to-end', async () => {
    const user = userEvent.setup({delay: null});
    render(<TrainingLoadCalculator />);

    await fillLoad(user);
    await submitLoad(user);

    await waitFor(() =>
      expect(
        screen.getByRole('region', {name: 'Training Load Analysis Results'})
          .textContent,
      ).toContain('11.7'),
    );

    const result = screen.getByRole('region', {
      name: 'Training Load Analysis Results',
    });
    expect(result.textContent).toContain('60.0');
    expect(result.textContent).toContain('48.6');
    expect(result.textContent).toContain('15.0');
    expect(result.textContent).toContain('Fresh');
    expect(result.textContent).toContain('14-Day Training Load Projection');
    expect(result.textContent).toContain('40-70');
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
      <TrainingLoadCalculator
        shareEnvironment={{share}}
        onPrint={onPrint}
      />,
    );

    await fillLoad(user);
    await submitLoad(user);
    await user.click(screen.getByRole('button', {name: 'Share results'}));

    await waitFor(() => expect(share).toHaveBeenCalledOnce());
    const content = share.mock.calls[0]?.[0];

    expect(content?.title).toBe('Training Load Calculator Results');
    expect(content?.text).toBe(
      'My training stress balance is 11.7 (fresh). Model your fatigue and form at Sports Tools Hub!',
    );
    expect(content?.text).not.toContain('60');
    expect(content?.text).not.toContain('70');
    expect(content?.url).toBe(window.location.href);

    await user.click(screen.getByRole('button', {name: 'Print Results'}));
    expect(onPrint).toHaveBeenCalledOnce();
  });

  it('validates with the source messages before calculating', async () => {
    const user = userEvent.setup({delay: null});
    render(<TrainingLoadCalculator />);

    await submitLoad(user);

    expect(screen.getByText('Please select a sport.')).toBeTruthy();
    expect(
      screen.getByText('Please enter a valid current CTL.'),
    ).toBeTruthy();
    expect(
      screen.getByText('Please enter a valid current ATL.'),
    ).toBeTruthy();
    expect(
      screen.getByText('Please enter a valid training stress score.'),
    ).toBeTruthy();
    expect(screen.getByText('Please select a training goal.')).toBeTruthy();
    expect(
      screen.getByText('Please select an experience level.'),
    ).toBeTruthy();
    expect(
      screen.getByText('Please select an upcoming event.'),
    ).toBeTruthy();
    expect(scrollIntoView).not.toHaveBeenCalled();
  });
});
