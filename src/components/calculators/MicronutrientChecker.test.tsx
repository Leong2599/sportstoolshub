// @vitest-environment jsdom
import {cleanup, render, screen, waitFor} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {afterEach, beforeEach, describe, expect, it, vi} from 'vitest';
import {MicronutrientChecker} from './MicronutrientChecker';

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

describe('MicronutrientChecker', () => {
  it('scores only the entered nutrients and lists the source recommendations', async () => {
    const user = userEvent.setup({delay: null});
    render(<MicronutrientChecker />);

    await user.type(screen.getByRole('spinbutton', {name: 'Age'}), '30');
    await user.click(screen.getByRole('radio', {name: 'Male'}));
    await user.type(
      screen.getByRole('spinbutton', {name: 'Vitamin A (mcg)'}),
      '900',
    );
    await user.type(
      screen.getByRole('spinbutton', {name: 'Vitamin C (mg)'}),
      '45',
    );
    await user.click(
      screen.getByRole('button', {name: 'Calculate Micronutrient Score'}),
    );

    await waitFor(() =>
      expect(
        screen.getByRole('region', {name: 'Your Micronutrient Analysis'})
          .textContent,
      ).toContain('75%'),
    );

    const result = screen.getByRole('region', {
      name: 'Your Micronutrient Analysis',
    });
    expect(result.textContent).toContain('Adequate, but could be improved');
    expect(result.textContent).toContain('vitamin A');
    expect(result.textContent).toContain('100%');
    expect(result.textContent).toContain('vitamin C');
    expect(result.textContent).toContain('50%');
    expect(
      result.textContent,
    ).toContain('Consider a multivitamin supplement to fill gaps');
    expect(
      result.textContent,
    ).toContain('Increase Vitamin D intake through sunlight or supplements');
    expect(
      result.textContent,
    ).toContain('Increase iron intake with leafy greens or lean meats');
  });

  it('reports zero when no nutrients are entered', async () => {
    const user = userEvent.setup({delay: null});
    render(<MicronutrientChecker />);

    await user.type(screen.getByRole('spinbutton', {name: 'Age'}), '30');
    await user.click(screen.getByRole('radio', {name: 'Male'}));
    await user.click(
      screen.getByRole('button', {name: 'Calculate Micronutrient Score'}),
    );

    await waitFor(() =>
      expect(
        screen.getByRole('region', {name: 'Your Micronutrient Analysis'})
          .textContent,
      ).toContain('0%'),
    );

    expect(
      screen.getByRole('region', {name: 'Your Micronutrient Analysis'})
        .textContent,
    ).toContain('Multiple deficiencies - consider supplementation');
  });

  it('validates the age range and gender', async () => {
    const user = userEvent.setup({delay: null});
    render(<MicronutrientChecker />);

    await user.click(
      screen.getByRole('button', {name: 'Calculate Micronutrient Score'}),
    );

    expect(
      screen.getByText('Please enter a valid age between 15 and 80.'),
    ).toBeTruthy();
    expect(screen.getByText('Please select your gender.')).toBeTruthy();
  });
});
