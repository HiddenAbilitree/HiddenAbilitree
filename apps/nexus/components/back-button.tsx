'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { ArrowLeft } from '@/components/icons';

export const BackButton = () => {
  const pathname = usePathname();
  const slug = pathname.split(`/`).pop();

  return (
    <Link
      className='fixed top-4 left-4 z-50 flex h-10 items-center gap-2 rounded-full border-2 bg-tns-black pr-4 pl-3.5 text-xl font-black shadow-sm transition-all duration-200 hover:translate-y-0.5 hover:bg-tns-black-hover hover:text-tns-white hover:shadow-lg sm:top-8 sm:left-8'
      href={`/#${slug}`}
    >
      <ArrowLeft className='size-5' />
      back
    </Link>
  );
};
