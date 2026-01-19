'use client';

import ReactLenis from 'lenis/react';
import { motion } from 'motion/react';
import { useEffect, useState } from 'react';
// import { toast as sonnerToast } from 'sonner';

import { Motion } from '@/components/icons';
// import { Check } from '@/components/icons/check';
// import { ToastProps } from '@/components/landing/types';
import { _0xProto } from '@/styles/fonts';
export const SmoothScrollToggle = () => {
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setEnabled(localStorage.getItem(`smooth-scroll`) === `true`);
  }, [setEnabled]);

  useEffect(() => {
    localStorage.setItem(`smooth-scroll`, enabled.toString());
  }, [enabled]);

  return (
    <>
      <motion.button
        aria-label='Smooth Scroll'
        className='group fixed bottom-8 left-8 z-auto hidden size-10 items-center justify-center overflow-clip rounded-full border-2 bg-tns-black p-2 shadow-md selection:ring-tns-blue hover:cursor-pointer hover:bg-tns-black-hover md:flex'
        initial={{ borderColor: `var(--tns-green)` }}
        onClick={() => {
          // toast({
          //   description: `${enabled ? `Disabled` : `Enabled`} smooth scrolling`,
          // });
          setEnabled((cur) => !cur);
        }}
        transition={{ visualDuration: 0.3 }}
        whileInView={{
          borderColor: enabled ? `var(--tns-green)` : `var(--tns-red)`,
        }}
      >
        <Motion className='z-50 size-16 fill-[#888888] group-hover:fill-tns-white' />
      </motion.button>

      {enabled && <ReactLenis options={{ lerp: 0.2 }} root />}
    </>
  );
};

// const toast = (toast: Omit<ToastProps, `id`>) =>
//   sonnerToast.custom((id) => <Toast description={toast.description} id={id} />);
//
// const Toast = (props: ToastProps) => {
//   const { description } = props;
//
//   return (
//     <div
//       className={`flex w-full items-center rounded-xl bg-[#111724] p-4 shadow-lg ring-1 ring-tns-blue md:max-w-[364px] ${_0xProto.className}`}
//     >
//       <div className='flex flex-1 items-center gap-2'>
//         <Check
//           className='size-6 fill-tns-blue'
//           fill='fill-tns-blue'
//           stroke='stroke-tns-blue'
//         />
//         <p className='text-sm text-tns-white'>{description}</p>
//       </div>
//     </div>
//   );
// };
