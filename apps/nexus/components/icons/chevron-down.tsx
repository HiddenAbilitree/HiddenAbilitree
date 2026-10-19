import { SVGProps } from 'react';

export const ChevronDown = (props: SVGProps<SVGSVGElement>) => (
  <svg height='1em' viewBox='0 0 24 24' width='1em' xmlns='http://www.w3.org/2000/svg' {...props}>
    <path
      d='m6 9l6 6l6-6'
      fill='none'
      stroke='currentColor'
      strokeLinecap='round'
      strokeLinejoin='round'
      strokeWidth='2'
    />
  </svg>
);
