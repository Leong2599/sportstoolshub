// @vitest-environment jsdom
import {cleanup, render, screen, within} from '@testing-library/react';
import {afterEach, describe, expect, it} from 'vitest';
import {buildCategories, CATEGORY_ANCHORS, TOOLS_ANCHOR} from '../../data/chrome';
import {tools} from '../../data/tools';
import {ToolGrid} from './ToolGrid';

afterEach(cleanup);

describe('ToolGrid', () => {
  it('links every catalog tool exactly once', () => {
    render(<ToolGrid sections={buildCategories()} />);

    const links = screen.getAllByRole('link');
    const targets = links.map((link) => link.getAttribute('href'));

    expect(targets).toHaveLength(41);
    expect(new Set(targets).size).toBe(41);
    expect(new Set(targets)).toEqual(
      new Set(tools.map((tool) => `/tools/${tool.slug}`)),
    );
  });

  it('groups the tools under the catalog category headings', () => {
    render(<ToolGrid sections={buildCategories()} />);

    const expected: [string, number][] = [
      ['Fitness Calculators', 6],
      ['Performance Trackers', 22],
      ['Nutrition Tools', 13],
    ];

    for (const [label, count] of expected) {
      const heading = screen.getByRole('heading', {name: label, level: 3});
      const section = heading.closest('section');

      expect(section).not.toBeNull();
      expect(within(section as HTMLElement).getAllByRole('link')).toHaveLength(
        count,
      );
    }
  });

  it('keeps the anchor ids that the navbar dropdown links to', () => {
    const {container} = render(<ToolGrid sections={buildCategories()} />);

    expect(container.querySelector(`#${TOOLS_ANCHOR}`)).not.toBeNull();
    for (const category of Object.keys(CATEGORY_ANCHORS) as (keyof typeof
      CATEGORY_ANCHORS)[]) {
      expect(
        container.querySelector(`#${CATEGORY_ANCHORS[category]}`),
      ).not.toBeNull();
    }
  });

  it('renders the tools section heading', () => {
    render(<ToolGrid sections={buildCategories()} />);

    expect(
      screen.getByRole('heading', {
        name: 'Sports Tools by Category',
        level: 2,
      }),
    ).toBeTruthy();
  });

  it('shows an empty state when the catalog is empty', () => {
    render(<ToolGrid sections={[]} />);

    expect(screen.getByText(/No tools are available yet/)).toBeTruthy();
  });
});
