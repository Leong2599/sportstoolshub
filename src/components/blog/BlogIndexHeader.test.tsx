// @vitest-environment jsdom
import {cleanup, render, screen} from '@testing-library/react';
import {afterEach, describe, expect, it} from 'vitest';
import {BlogIndexHeader} from './BlogIndexHeader';

afterEach(cleanup);

describe('BlogIndexHeader', () => {
  it('renders the blog title as the page heading', () => {
    render(
      <BlogIndexHeader
        title="Sports Blog"
        description="Guides for every sport."
      />,
    );

    expect(
      screen.getByRole('heading', {level: 1, name: 'Sports Blog'}),
    ).toBeTruthy();
    expect(screen.getByText('Guides for every sport.')).toBeTruthy();
  });

  it('omits the description when there is none', () => {
    const {container} = render(<BlogIndexHeader title="Sports Blog" />);

    expect(container.querySelectorAll('p')).toHaveLength(0);
  });
});
