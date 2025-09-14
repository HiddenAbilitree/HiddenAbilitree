import { JPQuote, ProjectCard, Section } from '@/components/landing';
import { Code } from '@/components/landing/code';
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
  <Section className='h-screen gap-4 bg-black bg-gradient-to-b from-tns-blue/25 to-tns-blue/5 to-80%'>
    <div className='relative isolate z-0 flex flex-col border-2 text-7xl 2xs:text-8xl sm:text-8xl md:text-9xl lg:text-10xl xl:text-10xl 3xl:text-11xl'>
      <h1 className='flex flex-col'>
        <span className='w-full text-left text-full underline'>wowwww</span>
        <span className='w-full text-center underline'>ezhang</span>
        <span className='w-full text-right underline'>.</span>
      </h1>
      <div className='absolute bottom-0 left-0 text-base leading-[1]'>
        <span className='text-tns-magenta'>Senior @ GMU CS</span>
        <span className='relative text-tns-green'>
          *
          <div className='absolute top-0 right-0 bottom-0 left-0 animate-ping bg-tns-green/30'></div>
        </span>
      </div>
    </div>
    <div className='absolute right-0 bottom-6 left-0 flex w-full items-center gap-8 px-8'>
      <Separator className='bg-tns-blue/10' />
      <span className='text-center text-nowrap text-tns-white/50 select-none'>
        Scroll Down
      </span>
      <Separator className='bg-tns-blue/10' />
    </div>
  </Section>
);

const Projects = () => (
  <Section
    className='bg-gradient-to-b from-tns-blue/5 to-tns-blue/5'
    id='projects'
  >
    <h1 className='text-5xl text-tns-blue'>
      <JPQuote>projects</JPQuote>
    </h1>
    <div className='flex w-full flex-col items-center justify-center gap-4 px-4 md:gap-12 md:px-8'>
      <ProjectCard
        badges={[
          { href: `https://nextjs.org/`, text: `Next.js` },
          { href: `https://www.better-auth.com/`, text: `BetterAuth` },
        ]}
        color='magenta'
        imgHref='https://auth.ericzhang.dev'
        imgSrc='/next-auth-template.png'
        repoId={926_402_589}
      >
        <div>
          A Next.js based template that provides authentication via Better Auth.
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
            <li>- Session Invalidation</li>
          </ul>
        </div>
        <p>Emails sent with SMTP or SES API</p>
      </ProjectCard>
      <ProjectCard
        badges={[
          { href: `https://eslint.org/`, text: `ESLint` },
          { href: `https://prettier.io/`, text: `Prettier` },
          { href: `https://www.rust-lang.org/`, text: `Rust` },
        ]}
        color='blue'
        imgHeight={1440}
        imgSrc='/haod-demo.gif'
        imgWidth={2560}
        repoId={1_001_191_632}
        reverse
      >
        <div>
          <p>A collection of opinionated web-dev tooling configurations.</p>
          <br />
          <p>
            There&apos;s a CLI provided that analyzes your project and generates
            the appropriate configuration files.
          </p>
          <br />
          <p>
            Quickstart: <Code>bunx @hiddenability/opinionated-defaults</Code>
          </p>
        </div>
      </ProjectCard>
    </div>
  </Section>
);
