'use client';

import clsx from 'clsx';
import { motion } from 'motion/react';
import { ComponentProps, ReactNode } from 'react';

import { item } from '@/utils/animations/in-view';

export const AppearingText = ({
  children,
  ...props
}: ComponentProps<'span'> & {
  children: ReactNode | ReactNode[];
}) => (
  <motion.span
    className={clsx(props.className, 'flex items-center gap-4')}
    initial='hidden'
    transition={{ type: 'spring', visualDuration: 0.1 }}
    variants={item}
    whileHover={{ y: -10 }}
    whileInView='visible'
  >
    {children}
  </motion.span>
);
