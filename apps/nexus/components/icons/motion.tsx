import { SVGProps } from 'react';

export const Motion = (props: SVGProps<SVGSVGElement>) => (
  <svg
    height='1em'
    viewBox='0 0 24 24'
    width='1em'
    xmlns='http://www.w3.org/2000/svg'
    {...props}
  >
    {/* Icon from Material Symbols by Google - https://github.com/google/material-design-icons/blob/master/LICENSE */}
    <path
      className={props.className}
      d='M8 17q-.425 0-.712-.288T7 16t.288-.712T8 15h5q-.35-.425-.562-.925T12.1 13H10q-.425 0-.712-.288T9 12t.288-.712T10 11h2.1q.125-.575.338-1.075T13 9H4q-.425 0-.712-.288T3 8t.288-.712T4 7h13q2.075 0 3.538 1.463T22 12t-1.463 3.538T17 17zm9-2q1.25 0 2.125-.875T20 12t-.875-2.125T17 9t-2.125.875T14 12t.875 2.125T17 15M3 13q-.425 0-.712-.288T2 12t.288-.712T3 11h4q.425 0 .713.288T8 12t-.288.713T7 13zm1 4q-.425 0-.712-.288T3 16t.288-.712T4 15h1q.425 0 .713.288T6 16t-.288.713T5 17z'
    />
  </svg>
);
