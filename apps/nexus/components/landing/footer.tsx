import { AppearingGroup } from '@/components/appearing-group';
import { Bluesky, Discord, Instagram, Mail } from '@/components/icons/';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/utils';
import Link from 'next/link';

export const Footer = () => (
  <section className='from-tns-blue/5 to-tns-blue/40 h-screen w-full bg-black bg-gradient-to-b md:p-4'>
    <footer className='bg-tns-white text-tns-black sm:pt-22 md:pt-18 flex size-full flex-col gap-2 overflow-hidden p-4 pt-16 shadow-xl sm:p-6 md:rounded-3xl'>
      <Separator className='bg-border/80' />
      <h1 className='3xl:text-11xl xs:text-8xl text-7xl leading-[0.8] sm:text-8xl md:text-8xl 2xl:text-9xl'>
        CONTACT ME
      </h1>
      <Separator className='bg-border/80' />
      <p className='mr-auto md:text-xl lg:text-2xl'>
        Colorscheme @{' '}
        <Link
          href='https://github.com/tokyo-night/tokyo-night-vscode-theme'
          className='hover:text-tns-blue hover:font-bold'
          rel='noopener noreferrer'
          target='_blank'
        >
          Tokyo Night Storm
        </Link>
      </p>
      <div
        className={cn(
          'mt-auto flex flex-col text-center sm:ml-auto sm:text-start',
          'text-2xl',
          '2xs:text-4xl',
          'xs:text-5xl',
          'sm:text-6xl',
          'xl:text-7xl',
          '3xl:text-8xl',
        )}
      >
        <AppearingGroup className='flex flex-col'>
          <Link
            href='mailto:me@ericzhang.dev'
            className='flex items-center gap-4 hover:text-white'
            rel='noopener noreferrer'
            target='_blank'
          >
            <Mail />
            me@ericzhang.dev
          </Link>
          <Link
            href='https://discord.com/users/288137037457129483'
            className='hover:text-tns-blue flex items-center gap-4'
            rel='noopener noreferrer'
            target='_blank'
          >
            <Discord />
            @hiddenability
          </Link>
          <Link
            href='https://www.instagram.com/hiddenabiltree'
            className='hover:text-tns-red flex items-center gap-4'
            rel='noopener noreferrer'
            target='_blank'
          >
            <Instagram />
            @hiddenabiltree
          </Link>
          <Link
            href='https://bsky.app/profile/ericzhang.dev'
            className='flex items-center gap-4 hover:text-blue-500'
            rel='noopener noreferrer'
            target='_blank'
          >
            <Bluesky />
            @ericzhang.dev
          </Link>
        </AppearingGroup>
      </div>
    </footer>
  </section>
);
