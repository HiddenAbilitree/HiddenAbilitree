'use client';

import { motion, MotionProps } from 'motion/react';
import { ComponentProps, ReactNode } from 'react';

import { item, list } from '@/utils/animations/in-view';

export const AppearingGroup = ({
  ...props
}: ComponentProps<'div'> & MotionProps & { children: ReactNode[] }) => (
  <motion.div
    className='flex items-center gap-4'
    initial='hidden'
    variants={list}
    whileInView='visible'
    {...props}
  >
    {props.children.map((child, i) => (
      <motion.span
        className='rounded-full sm:px-5 sm:py-2'
        key={i}
        transition={{ type: 'spring', visualDuration: 0.1 }}
        variants={item}
        whileHover={{ background: '#000000', y: -10 }}
      >
        {child}
      </motion.span>
    ))}
  </motion.div>
);
