import { ReactNode } from 'react';

import { BottomControls } from '@/components/bottom-controls';
import { Footer } from '@/components/landing';

export default function LandingLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <>
      <main className='flex size-full flex-col items-center justify-center'>
        {children}
      </main>
      <Footer />
      <BottomControls />
    </>
  );
}
