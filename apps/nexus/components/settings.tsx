'use client';

import { Motion } from '@/components/icons';
import ReactLenis from 'lenis/react';
import { motion } from 'motion/react';
import { useEffect, useState } from 'react';

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
        onClick={() => {
          setEnabled(!enabled);
        }}
        initial={{ borderColor: 'var(--tns-green)' }}
        whileInView={{
          borderColor: enabled ? 'var(--tns-green)' : 'var(--tns-red)',
        }}
        transition={{ visualDuration: 0.3 }}
        className='bg-tns-black hover:bg-tns-black-hover selection:ring-tns-blue group fixed bottom-2 right-2 z-auto flex size-10 items-center justify-center overflow-clip rounded-full border-2 p-2 shadow-md hover:cursor-pointer'
      >
        <Motion className='group-hover:fill-tns-white z-50 size-16 fill-[#888888]' />
      </motion.button>

      {enabled && <ReactLenis root options={{ lerp: 0.2 }} />}
    </>
  );
};
