// @vitest-environment jsdom
import {cleanup, render, screen, within} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import {afterEach, beforeEach, describe, expect, it} from 'vitest';
import SearchPage from './search';

function setUrl(search: string): void {
  window.history.replaceState(null, '', `/search${search}`);
}

beforeEach(() => setUrl(''));

afterEach(() => {
  cleanup();
  setUrl('');
});

describe('SearchPage', () => {
  it('asks for a query before showing results', () => {
    render(<SearchPage />);

    expect(
      screen.getByRole('heading', {level: 1, name: 'Search Sports Tools Hub'}),
    ).toBeTruthy();
    expect(screen.getByRole('status').textContent).toBe(
      'Type to search the catalog and the blog.',
    );
    expect(screen.queryByRole('list')).toBeNull();
  });

  it('searches tools and articles together by default', async () => {
    const user = userEvent.setup();
    render(<SearchPage />);

    await user.type(screen.getByRole('searchbox'), 'swimming');

    const results = screen.getByRole('list');
    const links = within(results).getAllByRole('link');
    const hrefs = links.map((link) => link.getAttribute('href') ?? '');

    expect(hrefs.some((href) => href.startsWith('/tools/'))).toBe(true);
    expect(hrefs.some((href) => href.startsWith('/blog/'))).toBe(true);
  });

  it('narrows the results to the chosen scope', async () => {
    setUrl('?q=swimming');
    const user = userEvent.setup();
    render(<SearchPage />);

    const allLinks = within(screen.getByRole('list')).getAllByRole('link');
    expect(
      allLinks.some((link) => link.getAttribute('href')?.startsWith('/blog/')),
    ).toBe(true);

    await user.click(screen.getByRole('button', {name: 'Tools'}));

    const toolLinks = within(screen.getByRole('list')).getAllByRole('link');
    expect(toolLinks.length).toBeGreaterThan(0);
    for (const link of toolLinks) {
      expect(link.getAttribute('href')).toMatch(/^\/tools\//);
    }
    expect(
      screen.getByRole('button', {name: 'Tools'}).getAttribute('aria-pressed'),
    ).toBe('true');
  });

  it('reads the query and the scope from the URL', () => {
    setUrl('?q=basketball&scope=articles');
    render(<SearchPage />);

    expect(
      (screen.getByRole('searchbox') as HTMLInputElement).value,
    ).toBe('basketball');
    expect(
      screen
        .getByRole('button', {name: 'Articles'})
        .getAttribute('aria-pressed'),
    ).toBe('true');

    const links = within(screen.getByRole('list')).getAllByRole('link');
    expect(links.length).toBeGreaterThan(0);
    for (const link of links) {
      expect(link.getAttribute('href')).toMatch(/^\/blog\//);
    }
  });

  it('shows a usable empty state', async () => {
    const user = userEvent.setup();
    render(<SearchPage />);

    await user.type(screen.getByRole('searchbox'), 'unicorn');

    expect(screen.getByText(/Nothing matches "unicorn"/)).toBeTruthy();
    expect(
      screen.getByRole('link', {name: 'Browse all tools by category'}),
    ).toBeTruthy();
  });
});
