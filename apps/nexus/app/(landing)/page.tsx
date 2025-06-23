import { JPQuote, ProjectCard, Section } from '@/components/landing';
import { Separator } from '@/components/ui/separator';

export default function LandingPage() {
  return (
    <>
      <Hero />
      <Projects />
    </>
  );
}

const Hero = () => (
  <Section className='from-tns-blue/25 to-tns-blue/5 h-screen gap-4 bg-black bg-gradient-to-b to-80%'>
    <div className='2xs:text-8xl 3xl:text-11xl xl:text-10xl lg:text-10xl relative isolate z-0 flex flex-col border-2 text-7xl sm:text-8xl md:text-9xl'>
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
    <div className='flex w-full flex-col items-center justify-center gap-8 px-4 md:px-8'>
      <ProjectCard
        color='red'
        title='Next.js Auth Template'
        repo='HiddenAbilitree/nextjs-auth-template'
        imgSrc='/nextjs-auth-template.png'
        badges={[
          { text: 'Next.js', href: 'https://nextjs.org/' },
          { text: 'BetterAuth', href: 'https://www.better-auth.com/' },
        ]}
      >
        <div>
          <h2>Supported Authentication Methods:</h2>
          <ul>
            <li>- Email+Password</li>
            <li>- Passkeys</li>
            <li>- OAuth</li>
            <li>- Magic Link</li>
          </ul>
        </div>
        <div>
          <h2>Features</h2>
          <ul>
            <li>- Email/Password Change</li>
            <li>- Account Deletion</li>
            <li>- TOTP 2fa</li>
          </ul>
        </div>
        <p>Emails sent with SMTP or SES API</p>
      </ProjectCard>
    </div>
  </Section>
);
