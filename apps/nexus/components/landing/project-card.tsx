import clsx from 'clsx';
import { Route } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { ComponentProps, ReactNode, ViewTransition } from 'react';
import Markdown from 'react-markdown';

import { getStars, type StarsResult } from '@/actions';
import { Github, Link as LinkIcon, Star } from '@/components/icons';
import { Code, Tag } from '@/components/landing';
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
  content: string;
  fullName: string;
  imgAlt?: string;
  imgHeight?: number;
  imgHref?: string;
  imgSrc?: string;
  imgWidth?: number;
  repoId: number;
  reverse?: boolean;
  slug?: string;
};

type TagData = {
  href?: string;
  text: string;
};

const markdownComponents = {
  a: ({ children, href }: { children?: ReactNode; href?: string }) => (
    <Link
      className='text-tns-blue underline decoration-tns-blue/40 underline-offset-2 transition-colors visited:text-tns-magenta visited:decoration-tns-magenta/40 hover:decoration-tns-blue'
      href={(href ?? ``) as Route}
      rel='noopener noreferrer'
      target='_blank'
    >
      {children}
    </Link>
  ),
  code: ({ children }: { children?: ReactNode }) => {
    const text = typeof children === `string` ? children : ``;
    return <Code>{text}</Code>;
  },
  h2: ({ children }: { children?: ReactNode }) => (
    <h3 className='mt-3 mb-1.5 font-semibold'>{children}</h3>
  ),
  li: ({ children }: { children?: ReactNode }) => (
    <li className='my-0.5 ml-5 list-disc leading-relaxed'>{children}</li>
  ),
  p: ({ children }: { children?: ReactNode }) => (
    <p className='my-2 leading-relaxed'>{children}</p>
  ),
  strong: ({ children }: { children?: ReactNode }) => (
    <strong className='font-semibold text-tns-white'>{children}</strong>
  ),
  ul: ({ children }: { children?: ReactNode }) => (
    <ul className='my-2 pl-1'>{children}</ul>
  ),
};

export const ProjectCard = async ({
  badges,
  className,
  color = `default`,
  content,
  fullName,
  imgAlt,
  imgHeight,
  imgHref,
  imgSrc,
  imgWidth,
  repoId,
  reverse = false,
  slug,
  ...props
}: Omit<ComponentProps<`div`>, `content`> & ProjectData) => {
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
      id={slug ?? name}
      {...props}
    >
      <div className='flex grow flex-col gap-4'>
        <div className='flex grow flex-col gap-2'>
          <Link
            className='flex items-center gap-2 text-2xl hover:underline xs:text-3xl md:text-4xl'
            href={
              slug ?
                (`/projects/${slug}` as Route)
              : `https://github.com/${fullName}`
            }
            rel={slug ? undefined : `noopener noreferrer`}
            target={slug ? undefined : `_blank`}
          >
            {name}
            <LinkIcon className='size-5 shrink-0 opacity-50 xs:size-6 md:size-7' />
          </Link>
          <Markdown components={markdownComponents}>{content}</Markdown>
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
        (slug ?
          <Link
            className='flex w-full shrink-0 flex-col items-center justify-center lg:w-1/2'
            href={`/projects/${slug}` as Route}
          >
            <ViewTransition name={`project-image-${slug}`}>
              <Image
                alt={imgAlt ?? `Screenshot of ${name}`}
                className='rounded-lg contain-content'
                height={imgHeight ?? 1080}
                src={imgSrc}
                width={imgWidth ?? 1920}
              />
            </ViewTransition>
          </Link>
        : imgHref ?
          <Link
            className='flex w-full shrink-0 flex-col items-center justify-center lg:w-1/2'
            href={imgHref as Route}
            target='_blank'
          >
            <Image
              alt={imgAlt ?? `Screenshot of ${name}`}
              className='rounded-lg contain-content'
              height={imgHeight ?? 1080}
              src={imgSrc}
              width={imgWidth ?? 1920}
            />
          </Link>
        : <div className='flex w-full shrink-0 flex-col items-center justify-center lg:w-1/2'>
            <Image
              alt={imgAlt ?? `Screenshot of ${name}`}
              className='rounded-lg contain-content'
              height={imgHeight ?? 1080}
              src={imgSrc}
              width={imgWidth ?? 1920}
            />
          </div>)}
    </div>
  );
};
