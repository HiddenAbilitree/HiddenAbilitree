'use client';

import { Cog } from '@/components/icons/cog';
import ReactLenis from 'lenis/react';
import { useEffect, useState } from 'react';

export const Settings = () => {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setOpen(localStorage.getItem('smooth-scroll') === 'true');
  }, [setOpen]);

  useEffect(() => {
    localStorage.setItem('smooth-scroll', open.toString());
  }, [open]);

  return (
    <>
      <button
        onClick={() => {
          setOpen(!open);
        }}
        className='bg-tns-black hover:bg-tns-black-hover border-tns-blue group fixed bottom-2 right-2 z-auto flex size-10 items-center justify-center rounded-xl border-2 p-2 hover:cursor-pointer'
      >
        <Cog className='group-hover:text-tns-white z-50' />
      </button>

      {open && <ReactLenis root options={{ lerp: 0.2 }} />}
    </>
  );
};
