// @vitest-environment jsdom
import {cleanup, render, screen, waitFor} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {afterEach, beforeEach, describe, expect, it, vi} from 'vitest';
import type {ShareContent} from '../../lib/calculators/share';
import {StrideCadenceCalculator} from './StrideCadenceCalculator';

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

async function selectCommon(
  user: ReturnType<typeof userEvent.setup>,
) {
  await user.selectOptions(
    screen.getByRole('combobox', {name: 'Running Experience'}),
    'intermediate',
  );
  await user.selectOptions(
    screen.getByRole('combobox', {name: 'Typical Running Distance'}),
    '10k',
  );
  await user.selectOptions(
    screen.getByRole('combobox', {name: 'Primary Running Goal'}),
    'general',
  );
}

async function submitStride(user: ReturnType<typeof userEvent.setup>) {
  await user.click(
    screen.getByRole('button', {name: 'Calculate Running Efficiency'}),
  );
}

describe('StrideCadenceCalculator', () => {
  it('computes the source pace and cadence example end-to-end', async () => {
    const user = userEvent.setup({delay: null});
    render(<StrideCadenceCalculator />);

    await user.selectOptions(
      screen.getByRole('combobox', {name: 'Input Type'}),
      'pace-cadence',
    );
    await user.type(
      screen.getByRole('spinbutton', {name: 'Running Pace Minutes (per km)'}),
      '5',
    );
    await user.type(
      screen.getByRole('spinbutton', {name: 'Cadence (steps per minute)'}),
      '180',
    );
    await selectCommon(user);
    await submitStride(user);

    await waitFor(() =>
      expect(
        screen.getByRole('region', {name: 'Running Efficiency Analysis'})
          .textContent,
      ).toContain('5:00'),
    );

    const result = screen.getByRole('region', {
      name: 'Running Efficiency Analysis',
    });
    expect(result.textContent).toContain('12.00 km/h');
    expect(result.textContent).toContain('180 spm');
    expect(result.textContent).toContain('111.1 cm');
    expect(result.textContent).toContain('55.6 cm step');
    expect(result.textContent).toContain('191 ms');
    expect(result.textContent).toContain('9 cm');
    expect(result.textContent).toContain('32.4');
    expect(result.textContent).toContain('Optimal');
    expect(result.textContent).toContain('170-180 range');
    expect(scrollIntoView).toHaveBeenCalledWith({
      behavior: 'smooth',
      block: 'start',
    });
  });

  it('computes the source height based estimate end-to-end', async () => {
    const user = userEvent.setup({delay: null});
    render(<StrideCadenceCalculator />);

    await user.selectOptions(
      screen.getByRole('combobox', {name: 'Input Type'}),
      'height-based',
    );
    await user.type(screen.getByRole('spinbutton', {name: 'Height'}), '180');
    await user.type(
      screen.getByRole('spinbutton', {name: 'Running Pace Minutes (per km)'}),
      '5',
    );
    await selectCommon(user);
    await submitStride(user);

    await waitFor(() =>
      expect(
        screen.getByRole('region', {name: 'Running Efficiency Analysis'})
          .textContent,
      ).toContain('81.0 cm'),
    );

    expect(
      screen.getByRole('region', {name: 'Running Efficiency Analysis'})
        .textContent,
    ).toContain('246.91358024691357 spm');
  });

  it('shares the source text and prints without exposing inputs', async () => {
    const share = vi.fn(async (_content: ShareContent) => {});
    const onPrint = vi.fn();
    const user = userEvent.setup({delay: null});
    render(
      <StrideCadenceCalculator shareEnvironment={{share}} onPrint={onPrint} />,
    );

    await user.selectOptions(
      screen.getByRole('combobox', {name: 'Input Type'}),
      'pace-cadence',
    );
    await user.type(
      screen.getByRole('spinbutton', {name: 'Running Pace Minutes (per km)'}),
      '5',
    );
    await user.type(
      screen.getByRole('spinbutton', {name: 'Cadence (steps per minute)'}),
      '180',
    );
    await selectCommon(user);
    await submitStride(user);
    await user.click(screen.getByRole('button', {name: 'Share results'}));

    await waitFor(() => expect(share).toHaveBeenCalledOnce());
    const content = share.mock.calls[0]?.[0];

    expect(content?.title).toBe('Stride Length & Cadence Calculator Results');
    expect(content?.text).toBe(
      'Check out my running stride and cadence analysis at Sports Tools Hub!',
    );
    expect(content?.url).toBe(window.location.href);

    await user.click(screen.getByRole('button', {name: 'Print Results'}));
    expect(onPrint).toHaveBeenCalledOnce();
  });

  it('validates with the source messages before calculating', async () => {
    const user = userEvent.setup({delay: null});
    render(<StrideCadenceCalculator />);

    await submitStride(user);

    expect(screen.getByText('Please select an input type.')).toBeTruthy();
    expect(scrollIntoView).not.toHaveBeenCalled();

    await user.selectOptions(
      screen.getByRole('combobox', {name: 'Input Type'}),
      'pace-cadence',
    );
    await submitStride(user);

    expect(screen.getByText('Please enter a valid pace.')).toBeTruthy();
    expect(screen.getByText('Please enter a valid cadence.')).toBeTruthy();
    expect(
      screen.getByText('Please select your experience level.'),
    ).toBeTruthy();
  });
});
