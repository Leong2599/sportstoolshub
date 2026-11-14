// @vitest-environment jsdom
import {cleanup, render, screen, within} from '@testing-library/react';
import {afterEach, describe, expect, it} from 'vitest';
import {CATEGORY_ANCHORS} from '../data/chrome';
import NotFound from './404';

afterEach(cleanup);

describe('404 page', () => {
  it('renders the branded not found content', () => {
    const {container} = render(<NotFound />);

    expect(screen.getByText('404')).toBeTruthy();
    expect(
      screen.getByRole('heading', {level: 1, name: 'This page took a wrong turn'}),
    ).toBeTruthy();
    expect(screen.getByText(/The page you were looking for is not here/)).toBeTruthy();

    const logo = container.querySelector('img');
    expect(logo?.getAttribute('src')).toBe('/img/logo.png');
    expect(logo?.getAttribute('alt')).toBe('Sports Tools Hub');
  });

  it('offers a way back to the home page and to the tools', () => {
    render(<NotFound />);

    expect(screen.getByRole('link', {name: 'Back to home'}).getAttribute('href')).toBe('/');
    expect(
      screen.getByRole('link', {name: 'Browse the tools'}).getAttribute('href'),
    ).toBe('/#tools');
  });

  it('links every catalog category to its home page anchor', () => {
    render(<NotFound />);

    const nav = screen.getByRole('navigation', {name: 'Tool categories'});
    const links = within(nav).getAllByRole('link');

    expect(links.map((link) => link.textContent)).toEqual([
      'Fitness Calculators',
      'Performance Trackers',
      'Nutrition Tools',
    ]);
    expect(links.map((link) => link.getAttribute('href'))).toEqual([
      `/#${CATEGORY_ANCHORS.fitness}`,
      `/#${CATEGORY_ANCHORS.performance}`,
      `/#${CATEGORY_ANCHORS.nutrition}`,
    ]);
  });
});
