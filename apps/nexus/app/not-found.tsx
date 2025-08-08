import Link from 'next/link';

export default function NotFound() {
  return (
    <section className='flex h-screen flex-col items-center justify-center gap-6'>
      <div className='flex flex-col items-center justify-center gap-1'>
        <h1 className='text-9xl'>404</h1>
        <p className='text-2xl'>Page not found</p>
      </div>
      <Link
        className='rounded-full border-5 border-tns-blue bg-tns-blue px-9 py-2 text-tns-black'
        href='/'
      >
        Return to safety
      </Link>
    </section>
  );
}
