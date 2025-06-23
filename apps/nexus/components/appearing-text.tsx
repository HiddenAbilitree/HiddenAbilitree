'use client';

import { item } from '@/utils/animations/in-view';
import clsx from 'clsx';
import { motion } from 'motion/react';
import { ComponentProps, ReactNode } from 'react';

export const AppearingText = ({
  children,
  ...props
}: {
  children: ReactNode | ReactNode[];
} & ComponentProps<'span'>) => (
  <motion.span
    initial='hidden'
    whileInView='visible'
    variants={item}
    whileHover={{ y: -10 }}
    transition={{ type: 'spring', visualDuration: 0.1 }}
    className={clsx(props.className, 'flex items-center gap-4')}
  >
    {children}
  </motion.span>
);
