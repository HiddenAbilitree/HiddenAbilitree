import { ComponentProps } from 'react';

export const JPQuoteLeft = () => <>&#65378;</>;
export const JPQuoteRight = () => <>&#65379;</>;
export const JPQuote = ({ className, ...props }: ComponentProps<'span'>) => (
  <span className={className} {...props}>
    <JPQuoteLeft />
    {props.children}
    <JPQuoteRight />
  </span>
);
