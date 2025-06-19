'use client';

import { Cog } from '@/components/icons/cog';
import { AnimatePresence, motion } from 'motion/react';
import { useState } from 'react';

export const Settings = () => {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button
        onClick={() => {
          setOpen(!open);
        }}
        className='bg-tns-black hover:bg-tns-black-hover border-tns-blue group fixed bottom-2 right-2 z-auto flex size-10 items-center justify-center rounded-xl border-2 p-2 hover:cursor-pointer'
      >
        <Cog className='group-hover:text-tns-white z-50' />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ y: 100, height: 0, paddingBlock: 0 }}
            animate={{ y: 0, height: 100, paddingBlock: '0.5rem' }}
            exit={{ y: 100, height: 0, paddingBlock: 0 }}
            transition={{ y: { ease: 'circOut' } }}
            className='bg-tns-black border-tns-blue overflow-hidden right-13 fixed bottom-2 flex h-8 w-10 flex-col justify-start gap-2 rounded-sm border-2 p-2'
          >
            yo
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

{
  /* <button className='border-tns-blue bg-tns-black hover:bg-tns-black-hover rounded-sm border-2 px-4 py-0.5'> */
}
{
  /*   Hi */
}
{
  /* </button> */
}
{
  /* <button className='border-tns-blue bg-tns-black hover:bg-tns-black-hover rounded-sm border-2 px-4 py-0.5'> */
}
{
  /*   Hi */
}
{
  /* </button> */
}
{
  /* <button className='border-tns-blue bg-tns-black hover:bg-tns-black-hover rounded-sm border-2 px-4 py-0.5'> */
}
{
  /*   Hi */
}
{
  /* </button> */
}
