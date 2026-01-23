'use client';

import ReactLenis from 'lenis/react';
import { motion } from 'motion/react';
import { useEffect, useState } from 'react';

import { Chatbot } from '@/components/chatbot';
import { Motion, Robot } from '@/components/icons';

const getInitialDesktop = () =>
  typeof globalThis.window !== `undefined` &&
  globalThis.matchMedia(`(min-width: 768px)`).matches;

const getInitialSmoothScroll = () =>
  typeof globalThis.window !== `undefined` &&
  getInitialDesktop() &&
  localStorage.getItem(`smooth-scroll`) === `true`;

export const BottomControls = () => {
  const [smoothScrollEnabled, setSmoothScrollEnabled] = useState(
    getInitialSmoothScroll,
  );
  const [isDesktop, setIsDesktop] = useState(getInitialDesktop);
  const [chatOpen, setChatOpen] = useState(false);

  useEffect(() => {
    const mediaQuery = globalThis.matchMedia(`(min-width: 768px)`);

    const handleChange = (e: MediaQueryList | MediaQueryListEvent) => {
      const isNowDesktop = e.matches;
      setIsDesktop(isNowDesktop);
      setSmoothScrollEnabled(
        isNowDesktop ? localStorage.getItem(`smooth-scroll`) === `true` : false,
      );
    };

    mediaQuery.addEventListener(`change`, handleChange);

    return () => {
      mediaQuery.removeEventListener(`change`, handleChange);
    };
  }, []);

  useEffect(() => {
    if (isDesktop) {
      localStorage.setItem(
        `smooth-scroll`,
        smoothScrollEnabled ? `true` : `false`,
      );
    }
  }, [smoothScrollEnabled, isDesktop]);

  return (
    <>
      {chatOpen && (
        <div
          className='fixed inset-0 z-30 sm:hidden'
          onClick={() => setChatOpen(false)}
        />
      )}
      <div className='fixed right-4 bottom-4 z-30 flex flex-col items-end sm:right-auto sm:left-4 sm:z-50 sm:items-start md:bottom-8 md:left-8'>
        <Chatbot isOpen={chatOpen} onCloseAction={() => setChatOpen(false)} />
        <div className='flex items-center gap-2'>
          <motion.button
            aria-label='Smooth Scroll'
            className='group z-10 hidden size-16 items-center justify-center overflow-clip rounded-full border-2 bg-tns-black p-3.5 shadow-md hover:cursor-pointer hover:bg-tns-black-hover md:flex'
            initial={{ borderColor: `var(--tns-green)` }}
            onClick={() => setSmoothScrollEnabled((cur) => !cur)}
            transition={{ visualDuration: 0.3 }}
            whileHover={{ scale: 1.03 }}
            whileInView={{
              borderColor:
                smoothScrollEnabled ? `var(--tns-green)` : `var(--tns-red)`,
            }}
            whileTap={{ scale: 0.97 }}
          >
            <Motion className='size-16 fill-[#888888] group-hover:fill-tns-white' />
          </motion.button>

          <motion.button
            aria-label='Chatbot'
            className='group flex size-16 items-center justify-center overflow-clip rounded-full border-2 border-tns-blue bg-tns-black p-3.5 shadow-md hover:cursor-pointer hover:bg-tns-black-hover'
            onClick={() => setChatOpen((cur) => !cur)}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
          >
            <Robot className='size-16 fill-[#888888] group-hover:fill-tns-white' />
          </motion.button>
        </div>
      </div>

      {smoothScrollEnabled && <ReactLenis options={{ lerp: 0.2 }} root />}
    </>
  );
};
