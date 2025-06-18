import { JPQuote, ProjectCard, Section } from '@/components/landing';
import { Separator } from '@/components/ui/separator';

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
        <span className='text-full w-full text-left underline'>wowwww</span>
        <span className='w-full text-center underline'>ezhang</span>
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
      <span className='text-tns-white/50 select-none text-nowrap text-center'>
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
    <h1 className='text-tns-blue text-5xl'>
      <JPQuote>projects</JPQuote>
    </h1>
    <div className='flex w-full max-w-[1600px] flex-col items-center justify-center gap-8 px-4 md:px-8'>
      <ProjectCard
        className='bg-tns-blue/10'
        title='Auth Template'
        href=''
        imgSrc='/nextjs-auth-template.png'
        badges={[
          { text: 'Next.js', href: '' },
          { text: 'Better Auth', href: '' },
        ]}
      />
      <ProjectCard
        className='bg-tns-magenta/10 border-tns-magenta'
        title='Auth Template'
        href=''
        imgSrc='/nextjs-auth-template.png'
        reverse
        badges={[
          { text: 'Next.js', href: '' },
          { text: 'Better Auth', href: '' },
        ]}
      />
      <ProjectCard
        className='bg-tns-green/10 border-tns-green'
        title='Auth Template'
        href=''
        imgSrc='/nextjs-auth-template.png'
        badges={[
          { text: 'Next.js', href: '' },
          { text: 'Better Auth', href: '' },
        ]}
      />
      <ProjectCard
        className='bg-tns-red/10 border-tns-red'
        title='Auth Template'
        href=''
        imgSrc='/nextjs-auth-template.png'
        reverse
        badges={[
          { text: 'Next.js', href: '' },
          { text: 'Better Auth', href: '' },
        ]}
      />
    </div>
  </Section>
);

const About = () => (
  <Section
    id='about'
    className='from-tns-blue/5 to-tns-blue/5 bg-gradient-to-b px-4'
  ></Section>
);
