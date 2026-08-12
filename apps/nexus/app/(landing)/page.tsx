import { JPQuote, ProjectCard, Section } from '@/components/landing';
import { Separator } from '@/components/ui/separator';
import { getProjectContent, projects } from '@/projects';

export default function LandingPage() {
  return (
    <>
      <Hero />
      <Projects />
    </>
  );
}

const Hero = () => (
  <Section className='from-tns-blue/25 to-tns-blue/5 h-screen gap-4 bg-black bg-linear-to-b to-80%'>
    <div className='2xs:text-8xl lg:text-10xl xl:text-10xl 3xl:text-11xl absolute right-4 bottom-24 left-4 flex flex-col text-7xl sm:text-8xl md:right-8 md:left-8 md:text-9xl'>
      <h1 className='flex flex-col'>
        <span className='text-tns-white/70 text-edge-cap text-trim-both uppercase'>Eric</span>
        {` `}
        <span className='text-tns-white/70 uppercase'>Zhang</span>
      </h1>
      <div className='xs:ml-1.5 ml-1 text-base md:ml-2.5'>
        <span className='text-tns-magenta'>Masters Computer Science Student at GMU</span>
        <span className='text-tns-green relative'>
          *<div className='bg-tns-green/30 absolute inset-0 animate-ping'></div>
        </span>
      </div>
    </div>
    <div className='absolute right-0 bottom-6 left-0 flex w-full items-center gap-8 px-8'>
      <Separator className='bg-tns-blue/10' />
      <span className='text-tns-white/50 text-center text-nowrap select-none'>Scroll Down</span>
      <Separator className='bg-tns-blue/10' />
    </div>
  </Section>
);

const Projects = () => (
  <Section className='from-tns-blue/5 to-tns-blue/5 bg-linear-to-b' id='projects'>
    <h2 className='text-tns-blue text-5xl'>
      <JPQuote>projects</JPQuote>
    </h2>
    <div className='flex w-full flex-col items-center justify-center gap-4 px-4 md:gap-12 md:px-8'>
      {projects.map((project) => (
        <ProjectCard
          badges={project.badges}
          color={project.color}
          content={getProjectContent(project.slug)}
          fullName={project.fullName}
          imgAlt={project.imgAlt}
          imgHeight={project.imgHeight}
          imgHref={project.imgHref}
          imgSrc={project.imgSrc}
          imgWidth={project.imgWidth}
          key={project.slug}
          repoId={project.repoId}
          reverse={project.reverse}
          slug={project.slug}
        />
      ))}
    </div>
  </Section>
);
