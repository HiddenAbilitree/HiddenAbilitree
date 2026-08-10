'use client';

import { useActionState } from 'react';

import { unlockResume, type ResumeActionState } from '@/actions/resume';

const initialState: ResumeActionState = {};

export const ResumeForm = () => {
  const [state, formAction, pending] = useActionState(unlockResume, initialState);
  return (
    <div className='flex w-full flex-col items-center justify-center gap-4'>
      <div className='bg-tns-black mx-auto flex w-full max-w-md flex-col gap-6 rounded-2xl border-2 p-6 sm:p-8'>
        {/* <div className='flex flex-col gap-2'> */}
        <h1 className='text-tns-white text-2xl font-black sm:text-4xl'>resume</h1>
        {/*   <p className='text-tns-white/70 text-lg'>Enter the password to access my resume.</p> */}
        {/* </div> */}
        <form action={formAction} className='flex w-full flex-col gap-4'>
          <div className='flex flex-col gap-2'>
            <label className='text-tns-white/80 text-lg' htmlFor='resume-password'>
              password
            </label>
            <input
              aria-describedby={state.error ? `resume-error` : undefined}
              aria-invalid={Boolean(state.error)}
              autoComplete='current-password'
              className='bg-tns-black/70 focus:border-tns-green rounded-xl border-2 px-4 py-3 text-lg transition-colors outline-none focus:ring-2 focus:ring-(--tns-green)/30'
              id='resume-password'
              name='password'
              required
              type='password'
            />
          </div>
          {state.error && (
            <p className='text-tns-red text-sm' id='resume-error' role='alert'>
              {state.error}
            </p>
          )}
          <button
            className='bg-tns-blue text-tns-black hover:bg-tns-green disabled:bg-tns-blue/50 rounded-xl border-2 px-4 py-3 text-lg font-black transition-colors disabled:cursor-wait'
            disabled={pending}
            type='submit'
          >
            {pending ? `checking...` : `unlock resume`}
          </button>
        </form>
      </div>
    </div>
  );
};
