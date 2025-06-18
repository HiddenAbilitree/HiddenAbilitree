import '@/app/globals.css';
import { Header } from '@/components/header';
import { ReactLenis } from 'lenis/react';
import type { Metadata } from 'next';
import localFont from 'next/font/local';

const _0xProto = localFont({
  src: [
    {
      path: '../public/0xProto-Bold.woff2',
      weight: '700',
      style: 'normal',
    },
    {
      path: '../public/0xProto-Italic.woff2',
      weight: '400',
      style: 'italic',
    },
    {
      path: '../public/0xProto-Regular.woff2',
      weight: '400',
      style: 'normal',
    },
  ],
});

export const metadata: Metadata = {
  title: 'ezhang.dev',
  description: 'The Goat.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='en' suppressHydrationWarning className='w-full'>
      <body className={`${_0xProto.className} w-full`}>
        <Header />
        {children}
        <ReactLenis root options={{ lerp: 0.2 }} />
      </body>
    </html>
  );
}
