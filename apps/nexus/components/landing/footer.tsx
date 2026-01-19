import clsx from 'clsx';
import Link from 'next/link';

import { AppearingGroup } from '@/components/appearing-group';
import { Discord, Github, Mail } from '@/components/icons/';
import { Separator } from '@/components/ui/separator';

export const Footer = () => (
  <section className='h-screen w-full bg-black bg-linear-to-b from-tns-blue/5 to-tns-blue/40 md:p-4'>
    <footer className='flex size-full flex-col gap-2 overflow-hidden bg-tns-white p-4 pt-16 text-tns-black shadow-xl sm:p-6 sm:pt-22 md:rounded-3xl md:pt-18'>
      <Separator className='bg-border/80' />
      <h1 className='text-7xl leading-[0.8] xs:text-8xl sm:text-8xl md:text-8xl 2xl:text-9xl 3xl:text-11xl'>
        CONTACT ME
      </h1>
      <Separator className='bg-border/80' />
      <p className='mr-auto md:text-xl lg:text-2xl'>
        Colorscheme @{` `}
        <Link
          className='group relative isolate transition-colors hover:text-tns-blue'
          href='https://github.com/tokyo-night/tokyo-night-vscode-theme'
          rel='noopener noreferrer'
          target='_blank'
        >
          <span className='absolute -top-1 -right-3 -bottom-1 -left-2 -z-10 rounded-lg select-none group-hover:bg-tns-black' />
          Tokyo Night Storm
        </Link>
      </p>
      <div
        className={clsx(
          `mt-auto flex flex-col text-center sm:ml-auto sm:text-start`,
          `text-2xl`,
          `2xs:text-3xl`,
          `xs:text-4xl`,
          `sm:text-5xl`,
          `xl:text-7xl`,
          `3xl:text-8xl`,
        )}
      >
        <AppearingGroup className='flex flex-col'>
          <Link
            className='group flex items-center gap-1.5 hover:text-tns-white sm:gap-4'
            href='mailto:me@ericzhang.dev'
            rel='noopener noreferrer'
            target='_blank'
          >
            <Mail className='group-hover:text-white' />
            me@ericzhang.dev
          </Link>
          <Link
            className='group flex items-center gap-1.5 hover:text-tns-white sm:gap-4'
            href='https://discord.com/users/288137037457129483'
            rel='noopener noreferrer'
            target='_blank'
          >
            <Discord className='group-hover:text-[#5865F2]' />
            @hiddenability
          </Link>
          <Link
            className='group flex items-center gap-1.5 hover:text-tns-white sm:gap-4'
            href='https://github.com/HiddenAbilitree'
            rel='noopener noreferrer'
            target='_blank'
          >
            <Github className='group-hover:fill-white' />
            @hiddenabilitree
          </Link>
        </AppearingGroup>
      </div>
    </footer>
  </section>
);
