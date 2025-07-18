'use client';

import { motion } from 'motion/react';
import { ComponentProps, ReactNode } from 'react';

import { cn } from '@/utils';

export const Card = ({ ...props }: ComponentProps<'div'>): ReactNode => (
  <motion.div
    className={cn(
      'rounded-4xl h-86 flex flex-col border bg-[#151925] p-8 shadow-md',
      props.className,
    )}
  >
    {props.children}
  </motion.div>
);
