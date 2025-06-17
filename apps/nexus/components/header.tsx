import { MobileNav } from '@/components/mobile-nav';
import Link from 'next/link';
import { ComponentProps, ReactNode } from 'react';

export const Header = () => (
  <header className='fixed left-0 right-0 top-0 z-50 flex items-center justify-between gap-8 p-4 sm:p-8'>
    <Bubble href='/'>
      ericzhang<span className='text-tns-blue'>.</span>dev
    </Bubble>
    <nav className='hidden items-center gap-2 rounded-full text-center text-xl font-black sm:flex'>
      <Bubble href='#projects'>projects</Bubble>
      <Bubble href='#resume'>resume</Bubble>
      <Bubble href='/'>blog</Bubble>
    </nav>
    <MobileNav>
      <Bubble href='#resume'>projects</Bubble>
      <Bubble href='/'>blog</Bubble>
    </MobileNav>
  </header>
);

const Bubble = ({
  href,
  ...props
}: { href: string } & ComponentProps<'a'>): ReactNode => (
  <Link
    href={href}
    {...props}
    className='bg-tns-black hover:bg-tns-black/75 hover:text-tns-white z-50 flex h-10 items-center justify-center rounded-full border px-4 text-center text-xl font-black shadow-md transition-all duration-200 hover:translate-x-0 hover:translate-y-0.5 hover:shadow-lg'
  >
    {props.children}
  </Link>
);
