import { ReactNode } from 'react';

import { BottomControls } from '@/components/bottom-controls';
import { HashScrollCenter } from '@/components/hash-scroll-center';
import { Header } from '@/components/header';
import { Footer } from '@/components/landing';

export default function LandingLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <>
      <Header />
      <HashScrollCenter />
      <main className='flex size-full flex-col items-center justify-center'>
        {children}
      </main>
      <Footer />
      <BottomControls />
    </>
  );
}
