import type {ReactNode} from 'react';

export type LayoutProps = {
  title?: string;
  description?: string;
  children?: ReactNode;
};

/**
 * Test stand-in for `@theme/Layout`. The real component adds the navbar, the
 * footer and the document head; for unit tests the page body is what matters.
 */
export default function Layout({
  title,
  description,
  children,
}: LayoutProps): ReactNode {
  return (
    <div data-title={title} data-description={description}>
      {children}
    </div>
  );
}
