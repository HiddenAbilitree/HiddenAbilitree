'use client';

import ReactLenis from 'lenis/react';
import { motion } from 'motion/react';
import { useEffect, useState } from 'react';

import { Motion } from '@/components/icons';

export const SmoothScrollToggle = () => {
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    setEnabled(localStorage.getItem('smooth-scroll') === 'true');
  }, [setEnabled]);

  useEffect(() => {
    localStorage.setItem('smooth-scroll', enabled.toString());
  }, [enabled]);

  return (
    <>
      <motion.button
        className='bg-tns-black hover:bg-tns-black-hover selection:ring-tns-blue group fixed bottom-2 right-2 z-auto flex size-10 items-center justify-center overflow-clip rounded-full border-2 p-2 shadow-md hover:cursor-pointer'
        initial={{ borderColor: 'var(--tns-green)' }}
        onClick={() => {
          setEnabled(!enabled);
        }}
        transition={{ visualDuration: 0.3 }}
        whileInView={{
          borderColor: enabled ? 'var(--tns-green)' : 'var(--tns-red)',
        }}
      >
        <Motion className='group-hover:fill-tns-white z-50 size-16 fill-[#888888]' />
      </motion.button>

      {enabled && <ReactLenis options={{ lerp: 0.2 }} root />}
    </>
  );
};
