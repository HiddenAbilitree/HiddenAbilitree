'use client';

import { AnimatePresence, motion } from 'motion/react';
import { ReactNode, useEffect, useState } from 'react';

export const MobileNav = ({
  children,
}: {
  children: ReactNode | ReactNode[];
}) => {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const checkSize = () => {
      if (window.innerWidth > 640) {
        setOpen(false);
      }
    };
    globalThis.addEventListener(`resize`, checkSize);
    return () => globalThis.removeEventListener(`resize`, checkSize);
  });

  return (
    <>
      <button
        className='z-50 flex size-10 items-center justify-center rounded-full border-2 bg-tns-black hover:cursor-pointer focus:ring sm:hidden'
        onClick={() => {
          setOpen(!open);
        }}
      >
        <motion.span
          animate={{
            borderColor: open ? `var(--tns-red)` : `var(--tns-green)`,
            borderRadius: open ? `100%` : `25%`,
          }}
          className='size-4 border-2'
          initial={{
            borderColor: open ? `var(--tns-red)` : `var(--tns-green)`,
            borderRadius: open ? `100%` : `25%`,
          }}
        />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            animate={{ opacity: 1 }}
            // transition={{ ease: 'easeInOut' }}
            className='fixed top-0 right-0 bottom-0 left-0 z-40 bg-tns-black/50 bg-clip-content backdrop-blur-sm backdrop-brightness-50'
            exit={{ opacity: 0 }}
            initial={{ opacity: 0 }}
            key='nav'
          >
            <nav className='flex flex-col gap-4 px-4 pt-18'>
              <div className='w-full rounded-full border' />
              {children}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
