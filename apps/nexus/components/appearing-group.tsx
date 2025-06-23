'use client';

import { item, list } from '@/utils/animations/in-view';
import { MotionProps, motion } from 'motion/react';
import { ComponentProps, ReactNode } from 'react';

export const AppearingGroup = ({
  ...props
}: { children: ReactNode[] } & MotionProps & ComponentProps<'div'>) => (
  <motion.div
    initial='hidden'
    whileInView='visible'
    variants={list}
    className='flex items-center gap-4'
    {...props}
  >
    {props.children.map((child, i) => (
      <motion.span
        className='rounded-full px-5 py-2'
        key={i}
        variants={item}
        whileHover={{ y: -10, background: '#000000' }}
        transition={{ type: 'spring', visualDuration: 0.1 }}
      >
        {child}
      </motion.span>
    ))}
  </motion.div>
);
