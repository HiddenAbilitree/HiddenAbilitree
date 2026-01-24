import clsx from 'clsx';
import { ComponentProps } from 'react';

export const Section = ({ className, ...props }: ComponentProps<`section`>) => (
  <section
    className={clsx(
      className,
      `
        flex w-full flex-col items-center justify-center gap-8 bg-black py-4
        md:py-8
      `,
    )}
    {...props}
  >
    {props.children}
  </section>
);
