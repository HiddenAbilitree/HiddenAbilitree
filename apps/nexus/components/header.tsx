import { Route } from 'next';
import Link from 'next/link';
import { ComponentProps, ReactNode } from 'react';

import { MobileNav } from '@/components/mobile-nav';

export const Header = () => (
  <header className='fixed top-0 right-0 left-0 z-40 flex items-center justify-between gap-8 p-4 sm:p-8 md:invisible'>
    <Bubble href='/'>
      ericzhang<span className='text-tns-blue'>.</span>dev
    </Bubble>
    <nav className='hidden items-center gap-2 rounded-full text-center text-xl font-black sm:flex'>
      <Bubble href='#projects'>projects</Bubble>
      {/* <Bubble href='#resume'>resume</Bubble> */}
      {/* <Bubble href='/'>blog</Bubble> */}
    </nav>
    <MobileNav>
      <Bubble href='#projects'>projects</Bubble>
      {/* <Bubble href='/'>blog</Bubble> */}
    </MobileNav>
  </header>
);

const Bubble = ({
  href,
  ...props
}: ComponentProps<`a`> & { href: string }): ReactNode => (
  <Link
    href={href as Route}
    {...props}
    className='visible isolate z-50 flex h-10 items-center justify-center rounded-full border-2 bg-tns-black px-4 text-center text-xl font-black shadow-sm transition-all duration-200 hover:translate-y-0.5 hover:bg-tns-black-hover hover:text-tns-white hover:shadow-lg'
  >
    {props.children}
  </Link>
);
