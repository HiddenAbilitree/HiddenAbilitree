import { ReactNode } from 'react';

import { BackButton } from '@/components/back-button';
import { BottomControls } from '@/components/bottom-controls';

export default function ProjectsLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <>
      <BackButton />
      {children}
      <BottomControls />
    </>
  );
}
