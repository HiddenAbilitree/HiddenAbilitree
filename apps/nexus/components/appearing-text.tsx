'use client';

import { cn } from '@/utils';
import { motion, useInView } from 'motion/react';
import { ReactNode, useRef } from 'react';

export const AnimateText = ({
  children,
}: {
  children: ReactNode | ReactNode[];
}) => {
  const textRef = useRef(null);
  const isInView = useInView(textRef);

  return (
    <span
      className={cn(
        'leading-7',
        '2xs:leading-10',
        'sm:leading-17',
        'xl:leading-21',
        '3xl:leading-26',
      )}
    >
      <motion.span
        ref={textRef}
        animate={{
          y: isInView ? 0 : '100%',
          filter: isInView ? 'blur(0px)' : 'blur(8px)',
          rotateZ: isInView ? 0 : 10,
        }}
        initial={{ y: 100 }}
        whileHover={{ y: -10 }}
        transition={{ type: 'spring', visualDuration: 0.1 }}
        className='flex items-center gap-4'
      >
        {children}
      </motion.span>
    </span>
  );
};
