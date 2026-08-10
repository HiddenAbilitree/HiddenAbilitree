type ResumePdfSkeletonProps = {
  label?: string;
};

export const ResumePdfSkeleton = ({ label = 'Loading resume PDF' }: ResumePdfSkeletonProps) => (
  <output
    aria-busy='true'
    aria-label={label}
    className='relative block aspect-[8.5/11] w-full overflow-hidden rounded-[12px] bg-white p-[3.5%] shadow-md sm:rounded-[18px]'
  >
    <div className='flex h-full animate-pulse flex-col gap-[2.15%] motion-reduce:animate-none'>
      <div className='flex shrink-0 flex-col items-center gap-2'>
        <div className='bg-tns-black/20 h-8 w-1/3 rounded-sm' />
        <div className='bg-tns-black/10 h-3 w-3/5 rounded-sm' />
      </div>

      <div className='flex min-h-0 flex-1 flex-col gap-[2.5%]'>
        <div className='flex min-h-0 flex-[0_0_8.35%] flex-col gap-2 overflow-hidden'>
          <div className='border-tns-black/25 flex h-5 items-end border-b'>
            <div className='bg-tns-blue/35 mb-1 h-2.5 w-1/6 rounded-sm' />
          </div>
          <div className='flex flex-col gap-3 pl-[2%]'>
            <div className='flex justify-between gap-4'>
              <div className='bg-tns-black/20 h-3 w-2/5 rounded-sm' />
              <div className='bg-tns-black/10 h-3 w-1/6 rounded-sm' />
            </div>
            <div className='bg-tns-black/10 h-3 w-2/5 rounded-sm' />
            <div className='flex items-start gap-2'>
              <div className='bg-tns-black/20 mt-1.5 size-1.5 shrink-0 rounded-full' />
              <div className='flex min-w-0 flex-1 flex-col gap-2'>
                <div className='bg-tns-black/10 h-3 w-4/5 rounded-sm' />
                <div className='bg-tns-black/10 h-3 w-3/5 rounded-sm' />
              </div>
            </div>
          </div>
        </div>

        <div className='flex min-h-0 flex-[0_0_19.75%] flex-col gap-2 overflow-hidden'>
          <div className='border-tns-black/25 flex h-5 items-end border-b'>
            <div className='bg-tns-blue/35 mb-1 h-2.5 w-1/6 rounded-sm' />
          </div>
          <div className='flex flex-col gap-3 pl-[2%]'>
            <div className='flex flex-col gap-3'>
              <div className='flex justify-between gap-4'>
                <div className='bg-tns-black/20 h-3 w-3/5 rounded-sm' />
                <div className='bg-tns-black/10 h-3 w-1/6 rounded-sm' />
              </div>
              <div className='flex justify-between gap-4'>
                <div className='bg-tns-black/10 h-3 w-1/4 rounded-sm' />
                <div className='bg-tns-black/10 h-3 w-1/12 rounded-sm' />
              </div>
              <div className='flex items-start gap-2 pl-[3%]'>
                <div className='bg-tns-black/20 mt-1.5 size-1.5 shrink-0 rounded-full' />
                <div className='flex min-w-0 flex-1 flex-col gap-2'>
                  <div className='bg-tns-black/10 h-3 w-11/12 rounded-sm' />
                  <div className='bg-tns-black/10 h-3 w-3/5 rounded-sm' />
                </div>
              </div>
            </div>
            <div className='flex flex-col gap-3'>
              <div className='flex justify-between gap-4'>
                <div className='bg-tns-black/20 h-3 w-2/5 rounded-sm' />
                <div className='bg-tns-black/10 h-3 w-1/6 rounded-sm' />
              </div>
              <div className='flex justify-between gap-4'>
                <div className='bg-tns-black/10 h-3 w-1/6 rounded-sm' />
                <div className='bg-tns-black/10 h-3 w-1/12 rounded-sm' />
              </div>
              <div className='flex items-start gap-2 pl-[3%]'>
                <div className='bg-tns-black/20 mt-1.5 size-1.5 shrink-0 rounded-full' />
                <div className='flex min-w-0 flex-1 flex-col gap-2'>
                  <div className='bg-tns-black/10 h-3 w-4/5 rounded-sm' />
                  <div className='bg-tns-black/10 h-3 w-1/2 rounded-sm' />
                </div>
              </div>
              <div className='flex items-start gap-2 pl-[3%]'>
                <div className='bg-tns-black/20 mt-1.5 size-1.5 shrink-0 rounded-full' />
                <div className='flex min-w-0 flex-1 flex-col gap-2'>
                  <div className='bg-tns-black/10 h-3 w-11/12 rounded-sm' />
                  <div className='bg-tns-black/10 h-3 w-3/5 rounded-sm' />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className='flex min-h-0 flex-[0_0_44%] flex-col gap-2'>
          <div className='border-tns-black/25 flex h-5 shrink-0 items-end border-b'>
            <div className='bg-tns-blue/35 mb-1 h-2.5 w-1/6 rounded-sm' />
          </div>
          <div className='flex min-h-0 flex-1 flex-col justify-between gap-3 pl-[2%]'>
            {Array.from({ length: 4 }, (_, index) => (
              <div className='flex flex-col gap-2' key={index}>
                <div className='flex justify-between gap-4'>
                  <div className='bg-tns-black/20 h-3 w-2/5 rounded-sm' />
                  <div className='bg-tns-black/10 h-3 w-1/6 rounded-sm' />
                </div>
                <div className='flex items-center gap-2 pl-[3%]'>
                  <div className='bg-tns-black/20 size-1.5 shrink-0 rounded-full' />
                  <div className='bg-tns-black/10 h-3 w-11/12 rounded-sm' />
                </div>
                <div className='flex items-center gap-2 pl-[3%]'>
                  <div className='bg-tns-black/20 size-1.5 shrink-0 rounded-full' />
                  <div className='bg-tns-black/10 h-3 w-4/5 rounded-sm' />
                </div>
                {index < 2 && (
                  <div className='flex items-center gap-2 pl-[3%]'>
                    <div className='bg-tns-black/20 size-1.5 shrink-0 rounded-full' />
                    <div className='bg-tns-black/10 h-3 w-2/3 rounded-sm' />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className='flex min-h-0 flex-[0_0_4.6%] flex-col gap-2 overflow-hidden'>
          <div className='border-tns-black/25 flex h-5 items-end border-b'>
            <div className='bg-tns-blue/35 mb-1 h-2.5 w-1/5 rounded-sm' />
          </div>
          <div className='flex flex-col gap-2 pl-[2%]'>
            <div className='flex justify-between gap-4'>
              <div className='bg-tns-black/20 h-3 w-2/5 rounded-sm' />
              <div className='bg-tns-black/10 h-3 w-1/6 rounded-sm' />
            </div>
            <div className='bg-tns-black/10 h-3 w-1/4 rounded-sm' />
          </div>
        </div>

        <div className='flex min-h-0 flex-1 flex-col gap-2'>
          <div className='border-tns-black/25 flex h-5 items-end border-b'>
            <div className='bg-tns-blue/35 mb-1 h-2.5 w-[10%] rounded-sm' />
          </div>
          <div className='flex min-h-0 flex-1 flex-col justify-between gap-2 pl-[2%]'>
            <div className='bg-tns-black/10 h-3 w-full rounded-sm' />
            <div className='bg-tns-black/10 h-3 w-11/12 rounded-sm' />
            <div className='bg-tns-black/10 h-3 w-4/5 rounded-sm' />
            <div className='bg-tns-black/10 h-3 w-3/5 rounded-sm' />
            <div className='bg-tns-black/10 h-3 w-4/5 rounded-sm' />
          </div>
        </div>
      </div>
    </div>
  </output>
);
