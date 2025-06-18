import clsx from 'clsx';
import Link from 'next/link';
import { ComponentProps } from 'react';

export const Tag = ({
  className,
  href,
  ...props
}: { href: string } & ComponentProps<'a'>) => (
  <Link
    href={href}
    className={clsx(
      className,
      'bg-tns-blue text-tns-black flex items-center justify-center rounded-full px-5 py-0.5 text-center text-xs shadow-sm transition-all duration-200 hover:translate-y-0.5 hover:shadow-lg md:text-sm',
    )}
    {...props}
  >
    {props.children}
  </Link>
);
