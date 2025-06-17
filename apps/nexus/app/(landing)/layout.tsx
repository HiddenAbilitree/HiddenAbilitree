import { Footer } from '@/components/landing/footer';

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
    </>
  );
}
