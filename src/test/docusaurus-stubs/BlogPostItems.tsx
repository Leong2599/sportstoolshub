import type {ReactNode} from 'react';

export type BlogPostItemsProps = {
  items?: unknown[];
  component?: unknown;
};

/**
 * Test stand-in for `@theme-original/BlogPostItems`. The swizzle under test
 * only wraps it, so the stand-in just marks that the original rendered.
 */
export default function BlogPostItems({
  items = [],
}: BlogPostItemsProps): ReactNode {
  return <div data-testid="blog-post-items">{items.length} posts</div>;
}
