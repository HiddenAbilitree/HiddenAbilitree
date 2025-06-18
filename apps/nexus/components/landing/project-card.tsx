import Link from 'next/link';
import { JPQuote, ProjectData, Tag } from '@/components/landing';
import Image from 'next/image';
import { ComponentProps } from 'react';
import clsx from 'clsx';

export const ProjectCard = ({
  title,
  badges,
  imgSrc,
  href,
  className,
  reverse = false,
  ...props
}: ProjectData & ComponentProps<'div'> & { reverse?: boolean }) => (
  <div
    className={clsx(
      className,
      reverse && 'md:flex-row-reverse',
      'flex size-full max-w-[1600px] flex-col justify-start gap-6 rounded-xl border-2 p-2 sm:rounded-2xl sm:p-4 md:flex-row md:rounded-3xl md:p-6',
    )}
    {...props}
  >
    <div className='flex grow flex-col'>
      <Link href={href} className='text-xl md:text-4xl'>
        <JPQuote>{title}</JPQuote>
      </Link>
      <p className='md:text-md text-sm'>Once</p>
      <div className='mt-auto flex flex-wrap gap-2'>
        {badges.map((data) => (
          <Tag href={data.href} key={data.text}>
            {data.text}
          </Tag>
        ))}
      </div>
    </div>
    <Link href={href} className='aspect-video h-full md:max-w-[66%]'>
      <Image
        alt=''
        src={imgSrc}
        quality={100}
        width={1920}
        height={1080}
        className='aspect-video rounded-xl'
      />
    </Link>
  </div>
);
