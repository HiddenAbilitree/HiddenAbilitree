'use client';

import clsx from 'clsx';
import { ComponentProps, FC } from 'react';
import { toast as sonnerToast } from 'sonner';

import { Copy } from '@/components/icons';
import { Check } from '@/components/icons/check';
import { ToastProps } from '@/components/landing/types';
import { _0xProto } from '@/styles/fonts';

export const Code: FC<ComponentProps<`span`> & { children: string }> = ({
  children,
  className,
  ...props
}) => (
  <span
    className={clsx(
      `inline-flex w-fit items-center gap-1.5 rounded-sm bg-[#23263A] p-1 wrap-anywhere md:wrap-normal`,
      className,
    )}
    {...props}
  >
    <code className={`${_0xProto.className}`}>{children}</code>
    <button
      className='rounded-sm border border-tns-blue/50 bg-tns-blue/5 p-1.5 hover:cursor-pointer hover:bg-tns-black'
      onClick={() => {
        toast({ description: `Successfully copied` });
        void navigator.clipboard.writeText(children);
      }}
    >
      <Copy />
    </button>
  </span>
);

const toast = (toast: Omit<ToastProps, `id`>) =>
  sonnerToast.custom((id) => <Toast description={toast.description} id={id} />);

const Toast = (props: ToastProps) => {
  const { description } = props;

  return (
    <div
      className={`flex w-full items-center rounded-xl bg-[#111724] p-4 shadow-lg ring-1 ring-tns-blue md:max-w-[364px] ${_0xProto.className}`}
    >
      <div className='flex flex-1 items-center gap-2'>
        <Check
          className='size-6 fill-tns-blue'
          fill='fill-tns-blue'
          stroke='stroke-tns-blue'
        />
        <p className='text-sm text-tns-white'>{description}</p>
      </div>
    </div>
  );
};
