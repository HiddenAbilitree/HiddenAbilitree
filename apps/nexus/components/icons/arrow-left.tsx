import { SVGProps } from 'react';

export const ArrowLeft = (props: SVGProps<SVGSVGElement>) => (
  <svg
    fill='none'
    height='1em'
    stroke='currentColor'
    strokeWidth={2.5}
    viewBox='0 0 24 24'
    width='1em'
    xmlns='http://www.w3.org/2000/svg'
    {...props}
  >
    <path
      d='M10.5 19.5 3 12m0 0 7.5-7.5M3 12h16'
      strokeLinecap='round'
      strokeLinejoin='round'
    />
  </svg>
);
