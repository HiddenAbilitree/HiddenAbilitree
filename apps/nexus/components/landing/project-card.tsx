import { JPQuote, ProjectData, Tag } from '@/components/landing';
import clsx from 'clsx';
import Image from 'next/image';
import Link from 'next/link';
import { ComponentProps } from 'react';

export const ProjectCard = ({
  title,
  badges,
  imgSrc,
  href,
  className,
  color,
  reverse = false,
  ...props
}: ProjectData &
  ComponentProps<'div'> & {
    color: 'blue' | 'magenta' | 'green' | 'red' | 'yellow' | 'cyan';
    reverse?: boolean;
  }) => {
  const getCardColorClass = () => {
    switch (color) {
      case 'blue': {
        return 'bg-tns-blue/10 border-tns-blue';
      }
      case 'magenta': {
        return 'bg-tns-magenta/10 border-tns-magenta';
      }
      case 'green': {
        return 'bg-tns-green/10 border-tns-green';
      }
      case 'red': {
        return 'bg-tns-red/10 border-tns-red';
      }
      case 'yellow': {
        return 'bg-tns-yellow/10 border-tns-yellow';
      }
      case 'cyan': {
        return 'bg-tns-cyan/10 border-tns-cyan';
      }
    }
  };

  const getTagColorClass = () => {
    switch (color) {
      case 'blue': {
        return 'bg-tns-blue';
      }
      case 'magenta': {
        return 'bg-tns-magenta';
      }
      case 'green': {
        return 'bg-tns-green';
      }
      case 'red': {
        return 'bg-tns-red';
      }
      case 'yellow': {
        return 'bg-tns-yellow';
      }
      case 'cyan': {
        return 'bg-tns-cyan';
      }
    }
  };

  return (
    <div
      className={clsx(
        className,
        getCardColorClass(),
        reverse && 'md:flex-row-reverse',
        'flex size-full max-w-[1600px] flex-col justify-start gap-6 rounded-xl border-2 p-2 sm:rounded-2xl sm:p-4 md:flex-row md:rounded-3xl md:p-6',
      )}
      {...props}
    >
      <div className='flex grow flex-col'>
        <Link href={href} className='text-xl hover:underline md:text-4xl'>
          <JPQuote>{title}</JPQuote>
        </Link>
        <p className='md:text-md text-sm'>Once</p>
        <div className='mt-auto flex flex-wrap gap-2'>
          {badges.map((data) => (
            <Tag
              href={data.href}
              className={getTagColorClass()}
              key={data.text}
            >
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
};
