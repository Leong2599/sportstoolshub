// @vitest-environment jsdom
import {cleanup, render, screen, waitFor} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {afterEach, beforeEach, describe, expect, it, vi} from 'vitest';
import type {ShareContent} from '../../../lib/calculators/share';
import {CalculatorKitDemo} from './CalculatorKitDemo';

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

async function submitDemo(user: ReturnType<typeof userEvent.setup>) {
  await user.click(
    screen.getByRole('button', {name: 'Calculate demo score'}),
  );
}

describe('CalculatorKitDemo', () => {
  it('renders every primitive with accessible labels', () => {
    const {container} = render(<CalculatorKitDemo />);

    expect(screen.getByRole('group', {name: 'Weight'})).toBeTruthy();
    expect(screen.getByRole('group', {name: 'Height'})).toBeTruthy();
    expect(
      screen.getByRole('group', {name: 'Training experience'}),
    ).toBeTruthy();
    expect(screen.getByRole('spinbutton', {name: 'Weight'})).toBeTruthy();
    expect(screen.getByRole('spinbutton', {name: 'Height'})).toBeTruthy();
    expect(screen.getByRole('spinbutton', {name: 'Age (optional)'})).toBeTruthy();
    expect(screen.getByRole('combobox', {name: 'Weight unit'})).toBeTruthy();
    expect(screen.getByRole('combobox', {name: 'Height unit'})).toBeTruthy();
    expect(screen.getByRole('radio', {name: /^Regular/})).toBeTruthy();
    expect(
      screen.getByRole('region', {name: 'Your demo result'}),
    ).toBeTruthy();
    expect(
      screen.getByRole('button', {name: 'Calculate demo score'}),
    ).toBeTruthy();
    expect(screen.getByRole('button', {name: 'Reset'})).toBeTruthy();
    expect(screen.getByRole('button', {name: 'Share results'})).toBeTruthy();
    expect(screen.getByRole('button', {name: 'Print results'})).toBeTruthy();
    expect(container.querySelector('.card')).toBeNull();
    expect(container.querySelector('.form-group')).toBeNull();
  });

  it('computes end-to-end, scrolls to the result, and resets', async () => {
    const user = userEvent.setup();
    render(<CalculatorKitDemo />);

    await submitDemo(user);

    await waitFor(() =>
      expect(scrollIntoView).toHaveBeenCalledWith({
        behavior: 'smooth',
        block: 'start',
      }),
    );

    const resultCard = screen.getByRole('region', {
      name: 'Your demo result',
    });
    expect(resultCard.textContent).toContain('22.9');
    expect(resultCard.textContent).toContain('Balanced');
    expect(resultCard.textContent).toContain('Shared data');
    expect(document.activeElement).toBe(resultCard);

    await user.click(screen.getByRole('button', {name: 'Reset'}));

    expect(resultCard.textContent).toContain('--');
    expect(
      (screen.getByRole('spinbutton', {name: 'Weight'}) as HTMLInputElement)
        .value,
    ).toBe('70');
  });

  it('reports validation errors and marks the field invalid', async () => {
    const user = userEvent.setup();
    render(<CalculatorKitDemo />);

    const weight = screen.getByRole('spinbutton', {
      name: 'Weight',
    }) as HTMLInputElement;
    await user.clear(weight);
    await submitDemo(user);

    expect(screen.getByRole('alert').textContent).toBe('Weight is required.');
    expect(weight.getAttribute('aria-invalid')).toBe('true');
    expect(weight.getAttribute('aria-describedby')).toContain('-error');
    expect(scrollIntoView).not.toHaveBeenCalled();
  });

  it('round-trips pounds and feet/inches through normalized units', async () => {
    const user = userEvent.setup();
    render(<CalculatorKitDemo />);

    await user.selectOptions(
      screen.getByRole('combobox', {name: 'Weight unit'}),
      'lbs',
    );
    const weight = screen.getByRole('spinbutton', {
      name: 'Weight',
    }) as HTMLInputElement;
    await user.clear(weight);
    await user.type(weight, '154.3');

    await user.selectOptions(
      screen.getByRole('combobox', {name: 'Height unit'}),
      'ft',
    );
    const feet = screen.getByRole('spinbutton', {
      name: 'Feet',
    }) as HTMLInputElement;
    const inches = screen.getByRole('spinbutton', {
      name: 'Inches',
    }) as HTMLInputElement;
    await user.clear(feet);
    await user.type(feet, '5');
    await user.type(inches, '9');

    await submitDemo(user);

    const resultCard = screen.getByRole('region', {
      name: 'Your demo result',
    });
    expect(resultCard.textContent).toContain('22.8');
    expect(resultCard.textContent).toContain('Balanced');
  });

  it('shares only the computed result, never the health inputs', async () => {
    const share = vi.fn(async (_content: ShareContent) => {});
    const user = userEvent.setup();
    render(<CalculatorKitDemo shareEnvironment={{share}} />);

    await submitDemo(user);
    await user.click(screen.getByRole('button', {name: 'Share results'}));

    await waitFor(() => expect(share).toHaveBeenCalledOnce());
    const content = share.mock.calls[0]?.[0];

    expect(content).toEqual({
      title: 'Calculator kit demo result',
      text: 'Demo score: 22.9 (Balanced).',
    });
    expect(content?.text).not.toContain('70');
    expect(content?.text).not.toContain('175');
    expect(content?.text).not.toContain('30');
    expect(screen.getByRole('status').textContent).toBe('Results shared');
  });

  it('falls back to the clipboard and prints the result', async () => {
    const copyText = vi.fn(async (_text: string) => {});
    const print = vi.spyOn(window, 'print').mockImplementation(() => {});
    const user = userEvent.setup();
    render(<CalculatorKitDemo shareEnvironment={{copyText}} />);

    await submitDemo(user);
    await user.click(screen.getByRole('button', {name: 'Share results'}));

    await waitFor(() => expect(copyText).toHaveBeenCalledOnce());
    const copied = copyText.mock.calls[0]?.[0];

    expect(copied).toBe('Demo score: 22.9 (Balanced).');
    expect(screen.getByRole('status').textContent).toBe('Copied to clipboard');

    await user.click(screen.getByRole('button', {name: 'Print results'}));
    expect(print).toHaveBeenCalledOnce();
  });
});
