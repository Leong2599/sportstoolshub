// @vitest-environment jsdom
import {cleanup, render, screen, within} from '@testing-library/react';
import {afterEach, describe, expect, it} from 'vitest';
import {FEATURED_BADGES} from '../../data/chrome';
import {FeaturedBadges} from './FeaturedBadges';

afterEach(cleanup);

describe('FeaturedBadges', () => {
  it('renders each badge as an external link with an accessible name', () => {
    render(<FeaturedBadges />);

    const region = screen.getByRole('region', {name: 'Featured on'});
    for (const badge of FEATURED_BADGES) {
      const links = within(region).getAllByRole('link', {name: badge.label});

      expect(links).toHaveLength(1);
      for (const link of links) {
        expect(link.getAttribute('href')).toBe(badge.href);
        expect(link.getAttribute('target')).toBe('_blank');
        expect(link.getAttribute('rel')).toBe('noopener noreferrer');
      }
    }
  });

  it('duplicates the strip for the marquee but hides the copy from assistive tech', () => {
    const {container} = render(<FeaturedBadges />);

    expect(container.querySelectorAll('[aria-hidden="true"]')).toHaveLength(1);
    expect(
      container.querySelectorAll('a[tabindex="-1"]'),
    ).toHaveLength(FEATURED_BADGES.length);
  });

  it('keeps text-only badges visible as text and image badges labelled', () => {
    render(<FeaturedBadges />);

    const region = screen.getByRole('region', {name: 'Featured on'});
    for (const label of ['Dentists Marketing', '[SeeWhatNewAI]']) {
      expect(within(region).getAllByText(label)).toHaveLength(2);
    }
    expect(
      within(region).getAllByRole('img', {name: 'Featured on findly.tools'}),
    ).toHaveLength(1);
  });
});
