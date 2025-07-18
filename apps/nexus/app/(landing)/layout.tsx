import { Footer } from '@/components/landing';
import { SmoothScrollToggle } from '@/components/settings';

export default function LandingLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <main className='flex size-full flex-col items-center justify-center'>
        {children}
      </main>
      <Footer />
      <SmoothScrollToggle />
    </>
  );
}
