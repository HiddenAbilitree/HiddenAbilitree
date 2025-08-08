'use client';

import { motion } from 'motion/react';
import { ComponentProps, ReactNode } from 'react';

import { cn } from '@/utils';

export const Card = ({ ...props }: ComponentProps<`div`>): ReactNode => (
  <motion.div
    className={cn(
      `flex h-86 flex-col rounded-4xl border bg-[#151925] p-8 shadow-md`,
      props.className,
    )}
  >
    {props.children}
  </motion.div>
);
