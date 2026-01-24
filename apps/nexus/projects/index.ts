import { readFileSync } from 'node:fs';
import path from 'node:path';

export type ProjectData = {
  badges: { href?: string; text: string }[];
  color: `blue` | `cyan` | `default` | `green` | `magenta` | `red` | `yellow`;
  fullName: string;
  imgAlt: string;
  imgHeight?: number;
  imgHref?: string;
  imgSrc?: string;
  imgWidth?: number;
  repoId: number;
  reverse?: boolean;
  slug: string;
};

const readContent = (slug: string) =>
  readFileSync(path.join(process.cwd(), `projects`, `${slug}.md`), `utf-8`);

export const projects: ProjectData[] = [
  {
    badges: [
      { href: `https://www.langchain.com/`, text: `LangChain` },
      { href: `https://ai.google.dev/gemini-api/docs`, text: `Gemini` },
      { href: `https://openrouter.ai/`, text: `OpenRouter` },
      { href: `https://modelcontextprotocol.io/`, text: `MCP` },
      { href: `https://qdrant.tech/`, text: `Qdrant (Vector Database)` },
      { text: `Agentic AI` },
    ],
    color: `blue`,
    fullName: `HiddenAbilitree/mcp-scheduling`,
    imgAlt: `Diagram of mcp-scheduling system architecture`,
    imgHeight: 1440,
    imgSrc: `/mcp-scheduler.png`,
    imgWidth: 2560,
    repoId: 1_112_832_334,
    slug: `mcp-scheduling`,
  },
  {
    badges: [
      { href: `https://eslint.org/`, text: `ESLint` },
      { href: `https://prettier.io/`, text: `Prettier` },
      { href: `https://www.rust-lang.org/`, text: `Rust` },
    ],
    color: `cyan`,
    fullName: `HiddenAbilitree/opinionated-defaults`,
    imgAlt: `Demo of opinionated-defaults CLI`,
    imgHeight: 1440,
    imgSrc: `/haod-demo.gif`,
    imgWidth: 2560,
    repoId: 1_001_191_632,
    reverse: true,
    slug: `opinionated-defaults`,
  },
  {
    badges: [
      { href: `https://nextjs.org/`, text: `Next.js` },
      { href: `https://www.better-auth.com/`, text: `BetterAuth` },
    ],
    color: `magenta`,
    fullName: `HiddenAbilitree/next-auth-template`,
    imgAlt: `Screenshot of next-auth-template`,
    imgHref: `https://auth.ericzhang.dev`,
    imgSrc: `/next-auth-template.png`,
    repoId: 926_402_589,
    slug: `next-auth-template`,
  },
];

export const getProject = (slug: string) =>
  projects.find((p) => p.slug === slug);

export const getProjectContent = (slug: string) => readContent(slug);

export const getProjectSlugs = () => projects.map((p) => p.slug);
