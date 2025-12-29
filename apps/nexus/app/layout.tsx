import '@/app/globals.css';
import type { Metadata } from 'next';

import { ReactNode } from 'react';
import { Toaster } from 'sonner';

import { Header } from '@/components/header';
import { _0xProto } from '@/styles/fonts';

const siteUrl = `https://www.ericzhang.dev`;
const siteName = `Eric Zhang`;
const siteDescription = `Building the future.`;

export const metadata: Metadata = {
  authors: [{ name: siteName, url: siteUrl }],
  creator: siteName,
  description: siteDescription,
  keywords: [
    `Eric Zhang`,
    `software engineer`,
    `web developer`,
    `full-stack developer`,
    `React`,
    `Next.js`,
    `TypeScript`,
    `frontend`,
    `backend`,
  ],
  metadataBase: new URL(siteUrl),
  openGraph: {
    description: siteDescription,
    locale: `en_US`,
    siteName,
    title: siteName,
    type: `website`,
    url: siteUrl,
  },
  title: {
    default: siteName,
    template: `%s | ${siteName}`,
  },
  twitter: {
    card: `summary`,
    description: siteDescription,
    title: siteName,
  },
};

const jsonLd = {
  '@context': `https://schema.org`,
  '@type': `Person`,
  jobTitle: `Software Engineer`,
  name: siteName,
  url: siteUrl,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang='en' suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
          type='application/ld+json'
        />
      </head>
      <body className={`${_0xProto.className}`}>
        <Header />
        <Toaster toastOptions={{ duration: 1500 }} />
        {children}
      </body>
    </html>
  );
}
