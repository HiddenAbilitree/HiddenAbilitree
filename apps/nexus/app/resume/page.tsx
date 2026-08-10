import type { Metadata } from 'next';
import Link from 'next/link';

import { ResumeForm } from '@/components/resume-form';
import { ResumePdfViewer } from '@/components/resume-pdf-viewer';
import { hasResumeAccess } from '@/lib/resume';

export const metadata: Metadata = {
  title: `Resume`,
  robots: { index: false, follow: false },
};

export default async function ResumePage() {
  let unlocked = false;
  try {
    unlocked = await hasResumeAccess();
  } catch {
    unlocked = false;
  }

  return (
    <>
      <Link
        className='bg-tns-black hover:bg-tns-black-hover hover:text-tns-white fixed top-4 left-4 z-50 flex h-10 items-center rounded-full border-2 px-4 text-xl font-black shadow-sm transition-all duration-200 hover:translate-y-0.5 hover:shadow-lg sm:top-8 sm:left-8'
        href='/'
      >
        back
      </Link>
      <main className='from-tns-blue/20 to-tns-blue/5 flex min-h-screen items-center justify-center bg-linear-to-b px-4 py-24'>
        <section className={`flex w-full max-w-5xl flex-col gap-8 ${unlocked ? 'self-start' : ''}`}>
          {unlocked ? (
            <>
              <div className='flex min-h-14 flex-wrap items-center justify-between gap-2 sm:gap-4'>
                <h1 className='text-tns-white text-4xl font-black sm:text-5xl'>resume</h1>
                <a
                  className='bg-tns-blue text-tns-black hover:bg-tns-green flex h-12 shrink-0 items-center rounded-lg border-2 px-4 font-black transition-colors'
                  download='resume.pdf'
                  href='/resume/download?download=1'
                >
                  download pdf
                </a>
              </div>
              <ResumePdfViewer />
            </>
          ) : (
            <ResumeForm />
          )}
        </section>
      </main>
    </>
  );
}
