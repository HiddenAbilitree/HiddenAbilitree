'use client';

import ReactLenis from 'lenis/react';
import { AnimatePresence, motion } from 'motion/react';
import { useCallback, useEffect, useState } from 'react';

import { useChatContext } from '@/components/chat-context';
import { Chatbot } from '@/components/chatbot';
import { Motion, Robot } from '@/components/icons';

const getInitialDesktop = () =>
  typeof globalThis.window !== `undefined` &&
  globalThis.matchMedia(`(min-width: 768px)`).matches;

const getInitialLargeScreen = () =>
  typeof globalThis.window !== `undefined` &&
  globalThis.matchMedia(`(min-width: 1440px)`).matches;

const getInitialSmoothScroll = () =>
  typeof globalThis.window !== `undefined` &&
  getInitialDesktop() &&
  localStorage.getItem(`smooth-scroll`) === `true`;

export const BottomControls = () => {
  const { setOpenPopupChat } = useChatContext();

  const [smoothScrollEnabled, setSmoothScrollEnabled] = useState(
    getInitialSmoothScroll,
  );
  const [isDesktop, setIsDesktop] = useState(getInitialDesktop);
  const [isLargeScreen, setIsLargeScreen] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);
  const [scrolledPastHero, setScrolledPastHero] = useState(false);
  const [hasMounted, setHasMounted] = useState(false);

  const openChat = useCallback(() => {
    setChatOpen(true);
  }, []);

  useEffect(() => {
    setOpenPopupChat(openChat);
  }, [setOpenPopupChat, openChat]);

  useEffect(() => {
    setHasMounted(true);
    setIsLargeScreen(getInitialLargeScreen());
  }, []);

  useEffect(() => {
    const mediaQuery = globalThis.matchMedia(`(min-width: 768px)`);
    const largeScreenQuery = globalThis.matchMedia(`(min-width: 1440px)`);

    const handleChange = (e: MediaQueryList | MediaQueryListEvent) => {
      const isNowDesktop = e.matches;
      setIsDesktop(isNowDesktop);
      setSmoothScrollEnabled(
        isNowDesktop ? localStorage.getItem(`smooth-scroll`) === `true` : false,
      );
    };

    const handleLargeScreenChange = (
      e: MediaQueryList | MediaQueryListEvent,
    ) => {
      setIsLargeScreen(e.matches);
    };

    mediaQuery.addEventListener(`change`, handleChange);
    largeScreenQuery.addEventListener(`change`, handleLargeScreenChange);

    return () => {
      mediaQuery.removeEventListener(`change`, handleChange);
      largeScreenQuery.removeEventListener(`change`, handleLargeScreenChange);
    };
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setScrolledPastHero(globalThis.scrollY > globalThis.innerHeight * 0.8);
    };

    globalThis.addEventListener(`scroll`, handleScroll, { passive: true });
    handleScroll();

    return () => globalThis.removeEventListener(`scroll`, handleScroll);
  }, []);

  useEffect(() => {
    if (isDesktop) {
      localStorage.setItem(
        `smooth-scroll`,
        smoothScrollEnabled ? `true` : `false`,
      );
    }
  }, [smoothScrollEnabled, isDesktop]);

  const showChatButton = !hasMounted || !isLargeScreen || scrolledPastHero;

  return (
    <>
      {chatOpen && (
        <div
          className='fixed inset-0 z-30 sm:hidden'
          onClick={() => setChatOpen(false)}
        />
      )}
      <div className='fixed right-4 bottom-4 z-30 flex flex-col items-end sm:right-auto sm:left-4 sm:z-50 sm:items-start md:bottom-8 md:left-8'>
        <Chatbot
          hideOnScroll={hasMounted && isLargeScreen && !scrolledPastHero}
          isOpen={chatOpen}
          onCloseAction={() => setChatOpen(false)}
        />
        <div className='flex items-center gap-2'>
          <motion.button
            aria-label='Smooth Scroll'
            className='group z-10 hidden size-10 items-center justify-center overflow-clip rounded-full border-2 bg-tns-black p-2 shadow-md hover:cursor-pointer hover:bg-tns-black-hover md:flex'
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

          <AnimatePresence>
            {showChatButton && (
              <motion.button
                animate={{ opacity: 1, x: 0 }}
                aria-label='Chatbot'
                className='group flex size-10 items-center justify-center overflow-clip rounded-full border-2 border-tns-blue bg-tns-black p-2 shadow-md hover:cursor-pointer hover:bg-tns-black-hover'
                exit={{ opacity: 0, x: -10 }}
                initial={{ opacity: 0, x: -10 }}
                onClick={() => setChatOpen((cur) => !cur)}
                transition={{ duration: 0.2 }}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
              >
                <Robot className='size-16 fill-[#888888] group-hover:fill-tns-white' />
              </motion.button>
            )}
          </AnimatePresence>
        </div>
      </div>

      {smoothScrollEnabled && <ReactLenis options={{ lerp: 0.2 }} root />}
    </>
  );
};
