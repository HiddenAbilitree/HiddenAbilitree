import '@/app/globals.css';
import type { Metadata } from 'next';

import { ReactNode } from 'react';
import { Toaster } from 'sonner';

import { Header } from '@/components/header';
import { _0xProto } from '@/styles/fonts';

export const metadata: Metadata = {
  description: `crazy`,
  title: `ezhang.dev`,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang='en' suppressHydrationWarning>
      <body className={`${_0xProto.className}`}>
        <Header />
        <Toaster toastOptions={{ duration: 1500 }} />
        {children}
      </body>
    </html>
  );
}
