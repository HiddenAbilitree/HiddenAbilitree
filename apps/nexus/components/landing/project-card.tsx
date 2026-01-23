import clsx from 'clsx';
import { Route } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { ComponentProps } from 'react';

import { getStars, type StarsResult } from '@/actions';
import { Github, Star } from '@/components/icons';
import { Tag } from '@/components/landing';
import { Separator } from '@/components/ui/separator';

const colors = {
  card: {
    blue: `bg-tns-blue/10 border-tns-blue selection:bg-tns-blue`,
    cyan: `bg-tns-cyan/10 border-tns-cyan selection:bg-tns-cyan`,
    default: `bg-tns-white/10 border-tns-white selection:bg-tns-white`,
    green: `bg-tns-green/10 border-tns-green selection:bg-tns-green`,
    magenta: `bg-tns-magenta/10 border-tns-magenta selection:bg-tns-magenta`,
    red: `bg-tns-red/10 border-tns-red selection:bg-tns-red`,
    yellow: `bg-tns-yellow/10 border-tns-yellow selection:bg-tns-yellow`,
  },
  icon: {
    blue: { fill: `fill-tns-blue`, stroke: `stroke-tns-blue` },
    cyan: { fill: `fill-tns-cyan`, stroke: `stroke-tns-cyan` },
    default: { fill: `fill-tns-white`, stroke: `stroke-tns-white` },
    green: { fill: `fill-tns-green`, stroke: `stroke-tns-green` },
    magenta: { fill: `fill-tns-magenta`, stroke: `stroke-tns-magenta` },
    red: { fill: `fill-tns-red`, stroke: `stroke-tns-red` },
    yellow: { fill: `fill-tns-yellow`, stroke: `stroke-tns-yellow` },
  },
  tag: {
    blue: `bg-tns-blue`,
    cyan: `bg-tns-cyan`,
    default: `bg-tns-white`,
    green: `bg-tns-green`,
    magenta: `bg-tns-magenta`,
    red: `bg-tns-red`,
    yellow: `bg-tns-yellow`,
  },
};

type ProjectData = {
  badges: TagData[];
  color: `blue` | `cyan` | `default` | `green` | `magenta` | `red` | `yellow`;
  fullName: string;
  imgHeight?: number;
  imgHref?: string;
  imgSrc?: string;
  imgWidth?: number;
  repoId: number;
  reverse?: boolean;
};

type TagData = {
  href?: string;
  text: string;
};
export const ProjectCard = async ({
  badges,
  className,
  color = `default`,
  fullName,
  imgHeight,
  imgHref,
  imgSrc,
  imgWidth,
  repoId,
  reverse = false,
  ...props
}: ComponentProps<`div`> & ProjectData) => {
  const starsResult: StarsResult = await getStars(repoId);
  const stars = starsResult.error ? undefined : starsResult.stars;
  const name = fullName.slice(Math.max(0, fullName.indexOf(`/`) + 1));

  return (
    <div
      className={clsx(
        className,
        colors.card[color],
        reverse && `lg:flex-row-reverse`,
        `flex size-full max-w-[1600px] flex-col justify-start gap-2 rounded-2xl border-2 p-4 sm:p-4 lg:flex-row lg:gap-6 lg:rounded-3xl lg:p-6`,
      )}
      {...props}
    >
      <div className='flex grow flex-col gap-4'>
        <div className='flex grow flex-col gap-2'>
          <Link
            className='text-2xl hover:underline xs:text-3xl md:text-4xl'
            href={`https://github.com/${fullName}`}
            rel='noopener noreferrer'
            target='_blank'
          >
            {name}
          </Link>
          {props.children}
        </div>
        <div className='flex flex-wrap gap-2'>
          {badges.map((data) => (
            <Tag
              className={clsx(
                colors.tag[color],
                `rounded-full text-tns-black selection:bg-black! selection:text-tns-white`,
              )}
              href={data.href}
              key={data.text}
            >
              {data.text}
            </Tag>
          ))}
        </div>
        <Separator
          className={clsx(`rounded-full border-t-2`, colors.card[color])}
        />
        <div className='flex items-center gap-4'>
          <Link
            className={clsx(
              `flex items-center gap-1.5 rounded-full border-2 p-2 pr-2.5 text-white hover:underline`,
              colors.card[color],
            )}
            href={`https://github.com/${fullName}`}
            rel='noopener noreferrer'
            target='_blank'
          >
            <Github className='size-6' fill='fill-white' />
            Link
          </Link>
          <Separator
            className={clsx(`opacity-35`, colors.tag[color])}
            orientation='vertical'
          />
          <span className='flex items-center justify-center gap-1 rounded-full text-center'>
            <Star
              className={`mb-0.5 size-6`}
              fill={colors.icon[color].fill}
              stroke={colors.icon[color].stroke}
            />
            <span>{stars ?? `-`}</span>
          </span>
        </div>
      </div>
      {imgSrc &&
        (imgHref ?
          <Link
            className='flex w-full shrink-0 flex-col items-center justify-center lg:w-1/2'
            href={imgHref as Route}
            target='_blank'
          >
            <Image
              alt=''
              className='rounded-lg contain-content'
              height={imgHeight ?? 1080}
              src={imgSrc}
              width={imgWidth ?? 1920}
            />
          </Link>
        : <div className='flex w-full shrink-0 flex-col items-center justify-center lg:w-1/2'>
            <Image
              alt=''
              className='rounded-lg contain-content'
              height={imgHeight ?? 1080}
              src={imgSrc}
              width={imgWidth ?? 1920}
            />
          </div>)}
    </div>
  );
};
