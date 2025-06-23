import { Github, Star } from '@/components/icons';
import { JPQuote, ProjectData, Tag } from '@/components/landing';
import { Separator } from '@/components/ui/separator';
import { getStars } from '@/actions';
import clsx from 'clsx';
import Image from 'next/image';
import Link from 'next/link';
import { ComponentProps } from 'react';

const colors = {
  card: {
    default: 'bg-tns-white/10 border-tns-white selection:bg-tns-white',
    blue: 'bg-tns-blue/10 border-tns-blue selection:bg-tns-blue',
    magenta: 'bg-tns-magenta/10 border-tns-magenta selection:bg-tns-magenta',
    green: 'bg-tns-green/10 border-tns-green selection:bg-tns-green',
    red: 'bg-tns-red/10 border-tns-red selection:bg-tns-red',
    yellow: 'bg-tns-yellow/10 border-tns-yellow selection:bg-tns-yellow',
    cyan: 'bg-tns-cyan/10 border-tns-cyan selection:bg-tns-cyan',
  },
  tag: {
    default: 'bg-tns-white',
    blue: 'bg-tns-blue',
    magenta: 'bg-tns-magenta',
    green: 'bg-tns-green',
    red: 'bg-tns-red',
    yellow: 'bg-tns-yellow',
    cyan: 'bg-tns-cyan',
  },
  icon: {
    default: { stroke: 'stroke-tns-white', fill: 'fill-tns-white' },
    blue: { stroke: 'stroke-tns-blue', fill: 'fill-tns-blue' },
    magenta: { stroke: 'stroke-tns-magenta', fill: 'fill-tns-magenta' },
    green: { stroke: 'stroke-tns-green', fill: 'fill-tns-green' },
    red: { stroke: 'stroke-tns-red', fill: 'fill-tns-red' },
    yellow: { stroke: 'stroke-tns-yellow', fill: 'fill-tns-yellow' },
    cyan: { stroke: 'stroke-tns-cyan', fill: 'fill-tns-cyan' },
  },
};

export const ProjectCard = ({
  title,
  badges,
  imgSrc,
  className,
  color = 'default',
  reverse = false,
  repo,
  ...props
}: ProjectData & ComponentProps<'div'>) => (
  <div
    className={clsx(
      className,
      colors.card[color],
      reverse && 'lg:flex-row-reverse',
      'flex size-full max-w-[1600px] flex-col justify-start gap-2 rounded-2xl border-2 p-4 sm:rounded-2xl sm:p-4 lg:flex-row lg:gap-6 lg:rounded-3xl lg:p-6',
    )}
    {...props}
  >
    <div className='flex grow flex-col gap-2'>
      <div className='flex grow flex-col gap-2'>
        <JPQuote className='text-tns-white xs:text-3xl text-2xl md:text-4xl'>
          <span className='xs:text-3xl text-2xl md:text-4xl'>{title}</span>
        </JPQuote>
        {props.children}
      </div>
      <div className='flex flex-wrap gap-2'>
        {badges.map((data) => (
          <Tag
            href={data.href}
            className={clsx(
              colors.tag[color],
              'selection:text-tns-white text-tns-black selection:!bg-black',
            )}
            key={data.text}
          >
            {data.text}
          </Tag>
        ))}
      </div>
      <Separator
        className={clsx('rounded-full border-t-2', colors.card[color])}
      />
      <div className='flex items-center justify-between'>
        <Link
          href={`https://github.com/${repo}`}
          target='_blank'
          rel='noopener noreferrer'
          className={clsx(
            'flex items-center gap-1.5 rounded-full border-2 p-2 pr-2.5 hover:underline',
            colors.card[color],
          )}
        >
          <Github fill='fill-white' className='size-6' />
          Link
        </Link>
        <span className='flex items-center justify-center gap-1 rounded-full text-center'>
          {getStars(repo)}
          <Star
            fill={colors.icon[color].fill}
            stroke={colors.icon[color].stroke}
            className={'mb-0.5 size-6'}
          />
        </span>
      </div>
    </div>
    <div className='flex w-full flex-col items-center justify-center lg:max-w-[66%]'>
      <Image
        alt=''
        src={imgSrc}
        quality={100}
        width={1920}
        height={1080}
        className='aspect-video rounded-xl contain-content'
      />
    </div>
  </div>
);
