// @vitest-environment jsdom
import {cleanup, render, screen, within} from '@testing-library/react';
import type {ComponentProps} from 'react';
import {afterEach, describe, expect, it} from 'vitest';
import type {Props} from '@theme/BlogPostItems';
import BlogPostItemsWithSearch from './index';

const THREE_POSTS = [{}, {}, {}] as unknown as Props['items'];

afterEach(cleanup);

describe('BlogPostItems swizzle', () => {
  it('adds a link to the blog search above the posts', () => {
    render(<BlogPostItemsWithSearch items={[]} />);

    const link = screen.getByRole('link', {name: 'Search the blog'});
    expect(link.getAttribute('href')).toBe('/search?scope=articles');

    const posts = screen.getByTestId('blog-post-items');
    expect(
      link.compareDocumentPosition(posts) &
        Node.DOCUMENT_POSITION_FOLLOWING,
    ).toBeTruthy();
  });

  it('still renders the original post list', () => {
    render(<BlogPostItemsWithSearch items={THREE_POSTS} />);

    expect(
      within(screen.getByTestId('blog-post-items')).getByText('3 posts'),
    ).toBeTruthy();
  });
});
