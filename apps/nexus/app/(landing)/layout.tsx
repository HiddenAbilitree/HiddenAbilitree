import { Footer } from '@/components/landing';
import { Settings } from '@/components/settings';

export default function LandingLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <main className='flex w-full flex-col items-center justify-center'>
        {children}
      </main>
      <Footer />
      <Settings />
    </>
  );
}
