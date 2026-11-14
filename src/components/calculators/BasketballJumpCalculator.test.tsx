// @vitest-environment jsdom
import {cleanup, render, screen, waitFor} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {afterEach, beforeEach, describe, expect, it, vi} from 'vitest';
import type {ShareContent} from '../../lib/calculators/share';
import {BasketballJumpCalculator} from './BasketballJumpCalculator';

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

async function fillJump(user: ReturnType<typeof userEvent.setup>) {
  await user.type(
    screen.getByRole('spinbutton', {name: 'Vertical Jump Height'}),
    '24',
  );
  await user.type(screen.getByRole('spinbutton', {name: 'Body Weight'}), '180');
  await user.type(
    screen.getByRole('spinbutton', {name: 'Approach Distance'}),
    '10',
  );
  await user.type(screen.getByRole('spinbutton', {name: 'Age'}), '25');
  await user.selectOptions(
    screen.getByRole('combobox', {name: 'Gender'}),
    'male',
  );
}

async function submitJump(user: ReturnType<typeof userEvent.setup>) {
  await user.click(screen.getByRole('button', {name: 'Analyze Jump'}));
}

describe('BasketballJumpCalculator', () => {
  it('computes the source jump analysis end-to-end', async () => {
    const user = userEvent.setup({delay: null});
    render(<BasketballJumpCalculator />);

    await fillJump(user);
    await submitJump(user);

    await waitFor(() =>
      expect(
        screen.getByRole('region', {name: 'Jump Analysis Results'}).textContent,
      ).toContain('24.0 inches'),
    );

    const result = screen.getByRole('region', {name: 'Jump Analysis Results'});
    expect(result.textContent).toContain('1385 watts');
    expect(result.textContent).toContain('2683 N');
    expect(result.textContent).toContain('56th percentile');
    expect(result.textContent).toContain('+15.0%');
    expect(result.textContent).toContain('Average');
    expect(result.textContent).toContain(
      'Focus on plyometric training 2-3 times per week',
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
      <BasketballJumpCalculator
        shareEnvironment={{share}}
        onPrint={onPrint}
      />,
    );

    await fillJump(user);
    await submitJump(user);
    await user.click(screen.getByRole('button', {name: 'Share results'}));

    await waitFor(() => expect(share).toHaveBeenCalledOnce());
    const content = share.mock.calls[0]?.[0];

    expect(content?.title).toBe('Basketball Vertical Jump Analyzer Results');
    expect(content?.text).toBe(
      'My vertical jump is 24.0 inches (Average). Analyze your jump at Sports Tools Hub!',
    );
    expect(content?.text).not.toContain('180');
    expect(content?.text).not.toContain('25');
    expect(content?.url).toBe(window.location.href);

    await user.click(screen.getByRole('button', {name: 'Print Results'}));
    expect(onPrint).toHaveBeenCalledOnce();
  });

  it('validates with the source messages before calculating', async () => {
    const user = userEvent.setup({delay: null});
    render(<BasketballJumpCalculator />);

    await submitJump(user);

    expect(
      screen.getByText('Please enter a valid vertical jump height.'),
    ).toBeTruthy();
    expect(
      screen.getByText('Please enter a valid body weight.'),
    ).toBeTruthy();
    expect(
      screen.getByText('Please enter a valid approach distance.'),
    ).toBeTruthy();
    expect(screen.getByText('Please enter a valid age.')).toBeTruthy();
    expect(screen.getByText('Please select a gender.')).toBeTruthy();
    expect(scrollIntoView).not.toHaveBeenCalled();
  });
});
