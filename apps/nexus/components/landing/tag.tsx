import clsx from 'clsx';
import { ComponentProps } from 'react';

export const Tag = ({ className, href, ...props }: ComponentProps<`a`> & { href?: string }) => {
  if (href)
    return (
      <a
        className={clsx(
          className,
          `flex items-center justify-center rounded-full px-5 py-0.5 text-center text-xs shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:font-semibold hover:shadow-lg md:text-sm`,
        )}
        href={href}
        rel='noopener noreferrer'
        target='_blank'
        {...props}
      >
        {props.children}
      </a>
    );
  return (
    <span
      className={clsx(
        className,
        `flex items-center justify-center rounded-full px-5 py-0.5 text-center text-xs shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:font-semibold hover:shadow-lg md:text-sm`,
      )}
      {...props}
    >
      {props.children}
    </span>
  );
};
