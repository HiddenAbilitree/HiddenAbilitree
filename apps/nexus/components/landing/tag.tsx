import clsx from 'clsx';
import { Route } from 'next';
import Link from 'next/link';
import { ComponentProps } from 'react';

export const Tag = ({
  className,
  href,
  ...props
}: ComponentProps<`a`> & { href: string }) => (
  <Link
    className={clsx(
      className,
      `flex items-center justify-center rounded-full px-5 py-0.5 text-center text-xs shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:font-semibold hover:shadow-lg md:text-sm`,
    )}
    href={href as Route}
    rel='noopener noreferrer'
    target='_blank'
    {...props}
  >
    {props.children}
  </Link>
);
