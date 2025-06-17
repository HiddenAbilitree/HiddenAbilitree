export default function NotFound() {
  return (
    <section className='flex flex-col items-center h-screen justify-center gap-6'>
      <div className='flex flex-col items-center justify-center gap-1'>
        <h1 className='text-9xl'>404</h1>
        <p className='text-2xl'>Page not found</p>
      </div>
      <button className='px-9 rounded-full py-2 bg-tns-blue text-tns-black border-5 border-tns-blue'>
        Return to safety
      </button>
    </section>
  );
}
