import { SVGProps } from 'react';

export const Email = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns='http://www.w3.org/2000/svg'
    width='1em'
    height='1em'
    viewBox='0 0 24 24'
    {...props}
  >
    {/* Icon from Simple Icons by Simple Icons Collaborators - https://github.com/simple-icons/simple-icons/blob/develop/LICENSE.md */}
    <path
      fill='currentColor'
      className={props.className}
      d='M15.61 12c0 1.99-1.62 3.61-3.61 3.61S8.39 13.99 8.39 12S10.01 8.39 12 8.39s3.61 1.62 3.61 3.61M12 0C5.383 0 0 5.383 0 12s5.383 12 12 12c2.424 0 4.761-.722 6.76-2.087l.034-.024l-1.617-1.879l-.027.017A9.5 9.5 0 0 1 12 21.54c-5.26 0-9.54-4.28-9.54-9.54S6.74 2.46 12 2.46s9.54 4.28 9.54 9.54a9.6 9.6 0 0 1-.225 2.05c-.301 1.239-1.169 1.618-1.82 1.568c-.654-.053-1.42-.52-1.426-1.661V12A6.076 6.076 0 0 0 12 5.93A6.076 6.076 0 0 0 5.93 12A6.076 6.076 0 0 0 12 18.07a6.02 6.02 0 0 0 4.3-1.792a3.9 3.9 0 0 0 3.32 1.805c.874 0 1.74-.292 2.437-.821c.719-.547 1.256-1.336 1.553-2.285c.047-.154.135-.504.135-.507l.002-.013c.175-.76.253-1.52.253-2.457c0-6.617-5.383-12-12-12'
    />
  </svg>
);
