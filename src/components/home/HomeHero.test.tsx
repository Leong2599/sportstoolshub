// @vitest-environment jsdom
import {cleanup, fireEvent, render, screen, within} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {afterEach, describe, expect, it} from 'vitest';
import {HomeHero} from './HomeHero';

afterEach(cleanup);

describe('HomeHero', () => {
  it('renders the source headline, subtitle, search field and call to action', () => {
    render(<HomeHero />);

    expect(
      screen.getByRole('heading', {
        level: 1,
        name: 'Comprehensive Sports Tools & Resources',
      }),
    ).toBeTruthy();
    expect(
      screen.getByText(
        /Discover comprehensive tools, calculators, and expert insights/,
      ),
    ).toBeTruthy();
    expect(
      screen.getByRole('searchbox', {name: 'Search sports tools'}),
    ).toBeTruthy();
    expect(screen.getByRole('button', {name: 'Search'})).toBeTruthy();
    expect(screen.getByRole('link', {name: 'Explore Tools'})).toBeTruthy();
  });

  it('keeps the results closed until the field is focused', async () => {
    const user = userEvent.setup();
    render(<HomeHero />);

    const input = screen.getByRole('searchbox');
    fireEvent.change(input, {target: {value: 'bmi'}});

    expect(screen.queryByRole('list')).toBeNull();

    await user.click(input);
    expect(screen.getByRole('list')).toBeTruthy();
  });

  it('shows the tools that match the query', async () => {
    const user = userEvent.setup();
    render(<HomeHero />);

    const input = screen.getByRole('searchbox');
    await user.click(input);
    await user.type(input, 'pace');

    const results = screen.getByRole('list');
    const links = within(results).getAllByRole('link');

    expect(links.map((link) => link.textContent)).toEqual([
      'Pace Calculator',
      'Swim Pace Calculator',
      'Heat Acclimatization Calculator',
    ]);
    expect(links[0]?.getAttribute('href')).toBe('/tools/pace-calculator');
    expect(screen.getByText('3 tools')).toBeTruthy();
  });

  it('never returns articles from the home search', async () => {
    const user = userEvent.setup();
    render(<HomeHero />);

    const input = screen.getByRole('searchbox');
    await user.click(input);
    await user.type(input, 'swimming');

    const results = screen.getByRole('list');
    const links = within(results).getAllByRole('link');

    expect(links.length).toBeGreaterThan(0);
    for (const link of links) {
      expect(link.getAttribute('href')).toMatch(/^\/tools\//);
    }
  });

  it('shows an empty state when nothing matches', async () => {
    const user = userEvent.setup();
    render(<HomeHero />);

    const input = screen.getByRole('searchbox');
    await user.click(input);
    await user.type(input, 'unicorn');

    expect(screen.getByText(/No tools match "unicorn"/)).toBeTruthy();
    expect(screen.getByText('No matching tools')).toBeTruthy();
  });

  it('links to the full search from the results panel', async () => {
    const user = userEvent.setup();
    render(<HomeHero />);

    const input = screen.getByRole('searchbox');
    await user.click(input);
    await user.type(input, 'pace');

    const link = screen.getByRole('link', {name: 'Search tools and articles'});
    expect(link.getAttribute('href')).toBe('/search');
  });
});
