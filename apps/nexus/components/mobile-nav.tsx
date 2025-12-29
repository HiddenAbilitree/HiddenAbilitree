'use client';

import { AnimatePresence, motion } from 'motion/react';
import { MouseEvent, ReactNode, useEffect, useState } from 'react';

export const MobileNav = ({ children }: { children: ReactNode }) => {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onResize = () => window.innerWidth > 640 && setOpen(false);
    globalThis.addEventListener(`resize`, onResize);
    return () => globalThis.removeEventListener(`resize`, onResize);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? `hidden` : ``;
    return () => {
      document.body.style.overflow = ``;
    };
  }, [open]);

  const handleNavClick = (e: MouseEvent) => {
    const link = (e.target as HTMLElement).closest(`a`);
    if (!link) return;

    const href = link.getAttribute(`href`) ?? `/`;

    if (href.startsWith(`#`)) {
      e.preventDefault();
      setOpen(false);
      document.querySelector(href)?.scrollIntoView({ behavior: `smooth` });
    } else {
      setOpen(false);
    }
  };

  return (
    <>
      <button
        className='z-50 flex size-10 items-center justify-center rounded-full border-2 bg-tns-black hover:cursor-pointer focus:ring sm:hidden'
        onClick={() => setOpen(!open)}
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
            className='fixed inset-0 z-40 bg-tns-black/50 bg-clip-content backdrop-blur-sm backdrop-brightness-50'
            exit={{ opacity: 0 }}
            initial={{ opacity: 0 }}
            key='nav'
          >
            <nav
              className='flex flex-col gap-4 px-4 pt-18'
              onClick={handleNavClick}
            >
              <div className='w-full rounded-full border' />
              {children}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
