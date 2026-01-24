'use client';

import * as languages from 'linguist-languages';
import { memo, ReactNode, useState } from 'react';
import 'react-shiki/css';
import ShikiHighlighter from 'react-shiki';

import { Check, Copy } from '@/components/icons';

type LinguistLanguage = {
  aliases?: string[];
  color?: string;
  name?: string;
};

const getLanguageColor = (lang: string): string | undefined => {
  const normalizedLang = lang.toLowerCase();
  const found = Object.values(languages).find((langData) => {
    const data = langData as LinguistLanguage;
    return (
      data.name?.toLowerCase() === normalizedLang ||
      data.aliases?.some((alias) => alias.toLowerCase() === normalizedLang)
    );
  }) as LinguistLanguage | undefined;
  return found?.color;
};

export const CodeBlock = memo(
  ({
    codeString,
    language,
    url,
  }: {
    codeString: string;
    language: string;
    url?: string;
  }) => {
    const langColor = getLanguageColor(language);
    return (
      <div className='not-prose my-6 overflow-hidden rounded-md border border-tns-blue'>
        <div className='flex items-center gap-2 bg-tns-blue py-1 pr-3 pl-2 text-xs font-semibold text-tns-black selection:bg-tns-black selection:text-tns-blue'>
          {langColor && (
            <span
              className='size-2.5 rounded-full border border-tns-black'
              style={{ backgroundColor: langColor }}
            />
          )}
          <span className='flex-1'>{language}</span>
          {url && (
            <a
              className='flex items-center gap-1 text-tns-black/70 transition-colors hover:text-tns-black'
              href={url}
              rel='noopener noreferrer'
              target='_blank'
            >
              <svg
                className='size-3.5'
                fill='none'
                stroke='currentColor'
                strokeWidth={2}
                viewBox='0 0 24 24'
              >
                <path
                  d='M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101'
                  strokeLinecap='round'
                  strokeLinejoin='round'
                />
                <path
                  d='M10.172 13.828a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1'
                  strokeLinecap='round'
                  strokeLinejoin='round'
                />
              </svg>
              <span>Link</span>
            </a>
          )}
        </div>
        <div className='overflow-x-auto'>
          <ShikiHighlighter
            className='chatbot-code text-sm [&_pre]:min-w-max'
            language={language}
            showLanguage={false}
            showLineNumbers
            theme='tokyo-night'
          >
            {codeString}
          </ShikiHighlighter>
        </div>
      </div>
    );
  },
);

CodeBlock.displayName = `CodeBlock`;

export const PlainCodeBlock = memo(({ codeString }: { codeString: string }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    void navigator.clipboard.writeText(codeString);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className='not-prose my-6 overflow-hidden rounded-md border border-tns-blue/30 bg-tns-blue/5'>
      <div className='flex items-center justify-between p-3'>
        <code className='flex-1 overflow-x-auto text-sm text-tns-blue'>
          {codeString}
        </code>
        <button
          className='ml-3 shrink-0 cursor-pointer text-tns-blue/50 transition-colors hover:text-tns-blue'
          onClick={handleCopy}
          type='button'
        >
          {copied ?
            <Check
              className='size-4'
              fill='fill-tns-green'
              stroke='stroke-tns-green'
            />
          : <Copy className='size-4' />}
        </button>
      </div>
    </div>
  );
});

PlainCodeBlock.displayName = `PlainCodeBlock`;

export const createCodeComponent = () => ({
  code: ({
    children,
    className,
    ...props
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
    return language ?
        <CodeBlock codeString={codeString} language={language} url={url} />
      : <code
          className='rounded-sm bg-tns-blue/15 px-1.5 py-0.5 text-[0.9em] text-tns-blue'
          {...props}
        >
          {children}
        </code>;
  },
});
