import { Metadata, Route } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ReactNode, ViewTransition } from 'react';
import Markdown from 'react-markdown';
import rehypeRaw from 'rehype-raw';
import remarkGfm from 'remark-gfm';
import remarkGithubAlerts from 'remark-github-blockquote-alert';

import { CodeBlock, PlainCodeBlock } from '@/components/code-block';
import { Github } from '@/components/icons';
import { Tag } from '@/components/landing';
import { Separator } from '@/components/ui/separator';
import {
  getProject,
  getProjectContent,
  getProjectSlugs,
  ProjectData,
} from '@/projects';

type Props = {
  params: Promise<{ slug: string }>;
};

export const generateStaticParams = () =>
  getProjectSlugs().map((slug) => ({ slug }));

export const generateMetadata = async ({
  params,
}: Props): Promise<Metadata> => {
  const { slug } = await params;
  const project = getProject(slug);
  if (!project) return {};

  const name = project.fullName.split(`/`)[1];
  return {
    description: getProjectContent(slug).slice(0, 160),
    title: name,
  };
};

const colors: Record<
  ProjectData[`color`],
  { border: string; flat: string; gradient: string; tag: string }
> = {
  blue: {
    border: `border-tns-blue`,
    flat: `bg-tns-blue/5`,
    gradient: `from-tns-blue/25 to-tns-blue/5`,
    tag: `bg-tns-blue`,
  },
  cyan: {
    border: `border-tns-cyan`,
    flat: `bg-tns-cyan/5`,
    gradient: `from-tns-cyan/25 to-tns-cyan/5`,
    tag: `bg-tns-cyan`,
  },
  default: {
    border: `border-tns-white`,
    flat: `bg-tns-white/5`,
    gradient: `from-tns-white/25 to-tns-white/5`,
    tag: `bg-tns-white`,
  },
  green: {
    border: `border-tns-green`,
    flat: `bg-tns-green/5`,
    gradient: `from-tns-green/25 to-tns-green/5`,
    tag: `bg-tns-green`,
  },
  magenta: {
    border: `border-tns-magenta`,
    flat: `bg-tns-magenta/5`,
    gradient: `from-tns-magenta/25 to-tns-magenta/5`,
    tag: `bg-tns-magenta`,
  },
  red: {
    border: `border-tns-red`,
    flat: `bg-tns-red/5`,
    gradient: `from-tns-red/25 to-tns-red/5`,
    tag: `bg-tns-red`,
  },
  yellow: {
    border: `border-tns-yellow`,
    flat: `bg-tns-yellow/5`,
    gradient: `from-tns-yellow/25 to-tns-yellow/5`,
    tag: `bg-tns-yellow`,
  },
};

const fetchReadme = async (fullName: string): Promise<string | undefined> => {
  const baseUrl = `https://raw.githubusercontent.com/${fullName}`;

  const res = await fetch(`${baseUrl}/main/README.md`, {
    next: { revalidate: 3600 },
  });

  let content: string;
  let branch = `main`;

  if (res.ok) {
    content = await res.text();
  } else {
    const devRes = await fetch(`${baseUrl}/dev/README.md`, {
      next: { revalidate: 3600 },
    });
    if (!devRes.ok) return undefined;
    content = await devRes.text();
    branch = `dev`;
  }

  return content
    .replaceAll(/\(\/([^)]+)\)/g, `(${baseUrl}/${branch}/$1)`)
    .replaceAll(/src="\/([^"]+)"/g, `src="${baseUrl}/${branch}/$1"`)
    .replaceAll(
      /!\[([^\]]*)\]\((?!http)([^)]+)\)/g,
      `![$1](${baseUrl}/${branch}/$2)`,
    );
};

const markdownComponents = {
  a: ({ children, href }: { children?: ReactNode; href?: string }) => (
    <Link
      className='text-tns-blue underline decoration-tns-blue/40 underline-offset-2 transition-colors visited:text-tns-magenta visited:decoration-tns-magenta/40 hover:decoration-tns-blue visited:hover:decoration-tns-magenta'
      href={(href ?? ``) as Route}
      rel='noopener noreferrer'
      target='_blank'
    >
      {children}
    </Link>
  ),
  blockquote: ({ children }: { children?: ReactNode }) => (
    <blockquote className='my-4 border-l-4 border-tns-blue/30 pl-4 text-tns-white/70 italic'>
      {children}
    </blockquote>
  ),
  code: ({
    children,
    className,
  }: {
    children?: ReactNode;
    className?: string;
  }) => {
    const rawLang = className?.replace(`language-`, ``);
    const [language, url] = rawLang?.split(`|`) ?? [];
    const codeContent = (
      Array.isArray(children) ?
        children[0]
      : children) as ReactNode;
    const codeString =
      typeof codeContent === `string` ? codeContent.replace(/\n$/, ``) : ``;
    const isBlock =
      typeof codeContent === `string` && codeContent.endsWith(`\n`);
    return (
      language ?
        <CodeBlock codeString={codeString} language={language} url={url} />
      : isBlock ? <PlainCodeBlock codeString={codeString} />
      : <code className='not-prose rounded-sm bg-tns-blue/10 px-1.5 py-0.5 text-[0.9em] text-tns-blue'>
          {children}
        </code>
    );
  },
  div: ({
    align,
    children,
    className,
    ...props
  }: {
    align?: string;
    children?: ReactNode;
    className?: string;
  }) => {
    const isAlert = className?.includes(`markdown-alert`);
    const alignClass =
      align === `center` ? `text-center flex flex-col items-center` : ``;
    const classes = [className, isAlert && `not-prose`, alignClass]
      .filter(Boolean)
      .join(` `);
    return (
      <div className={classes || undefined} {...props}>
        {children}
      </div>
    );
  },
  h1: ({ children }: { children?: ReactNode }) => (
    <h2 className='mt-8 mb-4 border-b border-tns-blue/20 pb-2 text-2xl font-semibold'>
      {children}
    </h2>
  ),
  h2: ({ children }: { children?: ReactNode }) => (
    <h3 className='mt-6 mb-3 border-b border-tns-blue/15 pb-1.5 text-xl font-semibold'>
      {children}
    </h3>
  ),
  h3: ({ children }: { children?: ReactNode }) => (
    <h4 className='mt-5 mb-2 text-lg font-semibold'>{children}</h4>
  ),
  h4: ({ children }: { children?: ReactNode }) => (
    <h5 className='mt-4 mb-2 text-base font-semibold'>{children}</h5>
  ),
  hr: () => <hr className='my-6 border-tns-blue/20' />,
  img: ({ alt, src }: { alt?: string; src?: string | Blob }) => {
    const srcUrl = typeof src === `string` ? src : undefined;
    const isBadge =
      srcUrl?.includes(`shields.io`) ?? srcUrl?.includes(`img.shields.io`);
    return isBadge ?
        // eslint-disable-next-line @next/next/no-img-element
        <img alt={alt ?? ``} className='inline-block' src={srcUrl} />
        // eslint-disable-next-line @next/next/no-img-element
      : <img
          alt={alt ?? ``}
          className='my-4 max-w-full rounded-lg'
          src={srcUrl}
        />;
  },
  li: ({ children }: { children?: ReactNode }) => (
    <li className='my-1.5 ml-6 list-disc leading-relaxed'>{children}</li>
  ),
  ol: ({ children }: { children?: ReactNode }) => (
    <ol className='my-4 list-decimal pl-6'>{children}</ol>
  ),
  p: ({
    children,
    className,
    ...props
  }: {
    children?: ReactNode;
    className?: string;
  }) => {
    const isAlertTitle = className?.includes(`markdown-alert-title`);
    return isAlertTitle ?
        <p
          className={`${className} flex flex-row items-center gap-2`}
          {...props}
        >
          {children}
        </p>
      : <p className='my-4 leading-relaxed'>{children}</p>;
  },
  pre: ({ children }: { children?: ReactNode }) => <>{children}</>,
  strong: ({ children }: { children?: ReactNode }) => (
    <strong className='font-semibold text-tns-white'>{children}</strong>
  ),
  table: ({ children }: { children?: ReactNode }) => (
    <div className='my-4 overflow-x-auto'>
      <table className='w-full border-collapse'>{children}</table>
    </div>
  ),
  td: ({ children }: { children?: ReactNode }) => (
    <td className='border border-tns-blue/30 px-3 py-2'>{children}</td>
  ),
  th: ({ children }: { children?: ReactNode }) => (
    <th className='border border-tns-blue/30 bg-tns-blue/10 px-3 py-2 text-left font-semibold'>
      {children}
    </th>
  ),
  ul: ({ children }: { children?: ReactNode }) => (
    <ul className='my-4 list-disc pl-6'>{children}</ul>
  ),
};

const ProjectPage = async ({ params }: Props) => {
  const { slug } = await params;
  const project = getProject(slug);

  if (!project) notFound();

  const content = getProjectContent(slug);
  const readme = await fetchReadme(project.fullName);
  const name = project.fullName.split(`/`)[1];
  const colorScheme = colors[project.color];

  return (
    <main className='flex min-h-screen flex-col bg-black'>
      <section
        className={`flex-1 bg-linear-to-b to-80% pt-24 pb-12 ${colorScheme.gradient}`}
      >
        <div className='mx-auto max-w-7xl px-4 sm:px-6 lg:px-8'>
          <div className='flex flex-col gap-8'>
            {project.imgSrc && (
              <ViewTransition name={`project-image-${slug}`}>
                <Image
                  alt={project.imgAlt}
                  className='w-full rounded-xl'
                  height={project.imgHeight ?? 1080}
                  src={project.imgSrc}
                  width={project.imgWidth ?? 1920}
                />
              </ViewTransition>
            )}
            <div className='flex flex-col gap-4'>
              <h1 className='text-4xl font-bold md:text-5xl'>{name}</h1>
              <div className='flex flex-wrap gap-2'>
                {project.badges.map((badge) => (
                  <Tag
                    className={`${colorScheme.tag} rounded-full text-tns-black`}
                    href={badge.href}
                    key={badge.text}
                  >
                    {badge.text}
                  </Tag>
                ))}
              </div>
              <div className='flex items-center gap-4'>
                <Link
                  className={`flex items-center gap-1.5 rounded-full border-2 ${colorScheme.border} p-2 pr-3 hover:underline`}
                  href={`https://github.com/${project.fullName}`}
                  rel='noopener noreferrer'
                  target='_blank'
                >
                  <Github className='size-5' fill='fill-white' />
                  View on GitHub
                </Link>
              </div>
              <div className='mt-2 text-tns-white/80'>
                <Markdown
                  components={markdownComponents}
                  remarkPlugins={[remarkGfm]}
                >
                  {content}
                </Markdown>
              </div>
            </div>
          </div>
        </div>
      </section>

      {readme && (
        <section className={`pb-16 ${colorScheme.flat}`}>
          <div className='mx-auto max-w-7xl px-4 sm:px-6 lg:px-8'>
            <Separator className={`mb-12 ${colorScheme.tag}`} />
            <div className='prose max-w-none prose-invert prose-p:my-1 prose-pre:my-6 prose-img:mt-2 prose-img:mb-6'>
              <h2 className='mb-6 text-2xl font-bold text-tns-white/60'>
                README
              </h2>
              <div className='text-tns-white/80'>
                <Markdown
                  components={markdownComponents}
                  rehypePlugins={[rehypeRaw]}
                  remarkPlugins={[remarkGfm, remarkGithubAlerts]}
                >
                  {readme}
                </Markdown>
              </div>
            </div>
          </div>
        </section>
      )}
    </main>
  );
};

export default ProjectPage;
