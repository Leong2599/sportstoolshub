import type {AnchorHTMLAttributes, ReactNode} from 'react';

export type LinkProps = AnchorHTMLAttributes<HTMLAnchorElement> & {
  to?: string;
  href?: string;
  children?: ReactNode;
};

/**
 * Test stand-in for `@docusaurus/Link`. The real component resolves the site
 * base URL and drives client-side routing; for unit tests the rendered
 * `href` is what matters.
 */
export default function Link({
  to,
  href,
  children,
  ...rest
}: LinkProps): ReactNode {
  return (
    <a href={to ?? href} {...rest}>
      {children}
    </a>
  );
}
