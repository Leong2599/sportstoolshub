import type {ElementType, HTMLAttributes, ReactNode} from 'react';

export type HeadingProps = HTMLAttributes<HTMLHeadingElement> & {
  as?: ElementType;
  id?: string;
  children?: ReactNode;
};

/**
 * Test stand-in for `@theme/Heading`. The real component registers the
 * heading id with the broken-link collector; for unit tests the rendered
 * element and its id are what matter.
 */
export default function Heading({
  as: As = 'h2',
  id,
  children,
  ...rest
}: HeadingProps): ReactNode {
  return (
    <As id={id} {...rest}>
      {children}
    </As>
  );
}
