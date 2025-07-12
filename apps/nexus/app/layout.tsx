import '@/app/globals.css';
import type { Metadata } from 'next';

import localFont from 'next/font/local';

import { Header } from '@/components/header';

const _0xProto = localFont({
  src: [
    {
      path: '../public/0xProto-Bold.woff2',
      style: 'normal',
      weight: '700',
    },
    {
      path: '../public/0xProto-Italic.woff2',
      style: 'italic',
      weight: '400',
    },
    {
      path: '../public/0xProto-Regular.woff2',
      style: 'normal',
      weight: '400',
    },
  ],
});

export const metadata: Metadata = {
  description: 'The Goat.',
  title: 'ezhang.dev',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='en' suppressHydrationWarning>
      <body className={`${_0xProto.className}`}>
        <Header />
        {children}
      </body>
    </html>
  );
}
