'use client';

import { useIsReady } from '@/lib/hooks/use-ready-state';
import { AnimatePresence, motion } from 'motion/react';

export const LoadingScreen = () => {
  const isReady = useIsReady();
  return (
    <AnimatePresence>
      {!isReady && (
        <motion.div
          key='loading'
          initial={{ display: isReady ? 'none' : 'fixed' }}
          exit={{ y: '100vh' }}
          transition={{ delay: 0.5, duration: 0.5, ease: 'easeIn' }}
          className='backdrop-blur-xs fixed bottom-0 left-0 right-0 top-0 flex items-center justify-center text-9xl font-bold backdrop-brightness-[60%]'
        >
          Uh
        </motion.div>
      )}
    </AnimatePresence>
  );
};
