import type { Metadata } from 'next';
import Link from 'next/link';

import { Document } from '@/components/icons';
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
        <section
          className={`w-full max-w-5xl gap-4 sm:gap-8 ${
            unlocked ? 'grid grid-cols-1 self-start sm:grid-cols-[1fr_auto]' : 'flex flex-col'
          }`}
        >
          {unlocked ? (
            <>
              <h1 className='text-tns-white flex items-center text-4xl font-black sm:min-h-14 sm:text-5xl'>
                resume
              </h1>
              <div className='min-w-0 sm:col-span-2 sm:row-start-2'>
                <ResumePdfViewer />
              </div>
              <a
                className='bg-tns-blue text-tns-black hover:bg-tns-green flex h-12 w-full items-center justify-center gap-2 rounded-lg border-2 px-4 font-black transition-colors sm:col-start-2 sm:row-start-1 sm:w-auto sm:self-center'
                download='resume.pdf'
                href='/resume/download?download=1'
              >
                <Document aria-hidden='true' className='size-5 shrink-0' />
                download pdf
              </a>
            </>
          ) : (
            <ResumeForm />
          )}
        </section>
      </main>
    </>
  );
}
