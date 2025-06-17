import { Card } from '@/components/card';
import { Separator } from '@/components/ui/separator';
import clsx from 'clsx';
import { ComponentProps } from 'react';

export default function LandingPage() {
  return (
    <>
      <Hero />
      <About />
      <Projects />
    </>
  );
}

const Hero = () => (
  <Section className='from-tns-blue/25 to-tns-blue/5 h-screen gap-4 bg-black bg-gradient-to-b to-80%'>
    <div className='2xs:text-8xl 3xl:text-11xl xl:text-10xl lg:text-10xl relative isolate z-0 flex flex-col border text-7xl sm:text-8xl md:text-9xl'>
      <h1 className='flex flex-col'>
        <span className='text-full w-full text-left underline'>ezhang</span>
        <span className='w-full text-center underline'>design</span>
        <span className='w-full text-right underline'>.</span>
      </h1>
      <div className='absolute bottom-0 left-0 text-base leading-[1]'>
        <span className='text-tns-magenta'>Senior @ GMU CS</span>
        <span className='text-tns-green relative'>
          *
          <div className='bg-tns-green/30 absolute bottom-0 left-0 right-0 top-0 animate-ping'></div>
        </span>
      </div>
    </div>
    <div className='absolute bottom-6 left-0 right-0 flex w-full items-center gap-8 px-8'>
      <Separator className='bg-tns-blue/10' />
      <span className='text-tns-white/50 text-nowrap text-center select-none'>
        Scroll Down
      </span>
      <Separator className='bg-tns-blue/10' />
    </div>
  </Section>
);

const Projects = () => (
  <Section
    id='projects'
    className='from-tns-blue/5 to-tns-blue/5 bg-gradient-to-b'
  >
    <h1 className='text-tns-blue text-5xl underline'>projects</h1>
    <div className='flex w-full max-w-[1600px] grid-cols-2 flex-col items-center justify-center gap-8 px-4 md:grid md:px-8 xl:flex xl:flex-row'>
      <Card className='border-tns-yellow w-full'>
        <h1 className='text-2xl font-bold underline'>*.ericzhang.dev</h1>
        <p>
          This page and the others located on this domain. Theres some pretty
          cool stuff here maybe.
        </p>
      </Card>
      <Card className='border-tns-green w-full'>Hi</Card>
      <Card className='border-tns-magenta w-full'>Hi</Card>
    </div>
  </Section>
);

const About = () => (
  <Section
    id='about'
    className='from-tns-blue/5 to-tns-blue/5 bg-gradient-to-b px-4'
  >
    <div className='flex  justify-start gap-2 size-full rounded-3xl p-6 bg-tns-blue/10 h-[500px] border'>
      <h1 className=''>Hi</h1>
      <Separator />
    </div>
  </Section>
);

const Section = ({ className, ...props }: ComponentProps<'section'>) => (
  <section
    className={clsx(
      className,
      'flex w-full flex-col items-center justify-center gap-8 bg-black py-8',
    )}
    {...props}
  >
    {props.children}
  </section>
);
