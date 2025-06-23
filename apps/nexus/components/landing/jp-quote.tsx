import { ComponentProps } from 'react';

export const JPQuoteLeft = ({ className }: ComponentProps<'span'>) => (
  <span className={className}>&#65378;</span>
);
export const JPQuoteRight = ({ className }: ComponentProps<'span'>) => (
  <span className={className}>&#65379;</span>
);
export const JPQuote = ({ className, ...props }: ComponentProps<'span'>) => (
  <span {...props}>
    <JPQuoteLeft className={className} />
    {props.children}
    <JPQuoteRight className={className} />
  </span>
);
