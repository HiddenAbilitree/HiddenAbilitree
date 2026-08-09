"use client";

import * as languages from "linguist-languages";
import type { Language } from "linguist-languages";
import { memo, ReactNode, useState } from "react";
import "react-shiki/css";
import { ShikiHighlighter } from "react-shiki";

import { Check, Copy } from "@/components/icons";

const languageList = Object.values(languages) as Language[];

const getLanguageColor = (lang: string) => {
  const normalized = lang.toLowerCase();

  return languageList.find(
    ({ name, aliases }) =>
      name.toLowerCase() === normalized ||
      aliases?.some((alias) => alias.toLowerCase() === normalized),
  )?.color;
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
      <div className="not-prose border-tns-blue my-6 overflow-hidden rounded-md border">
        <div className="bg-tns-blue text-tns-black selection:bg-tns-black selection:text-tns-blue flex items-center gap-2 py-1 pr-3 pl-2 text-xs font-semibold">
          {langColor && (
            <span
              className="border-tns-black size-2.5 rounded-full border"
              style={{ backgroundColor: langColor }}
            />
          )}
          <span className="flex-1">{language}</span>
          {url && (
            <a
              className="text-tns-black/70 hover:text-tns-black flex items-center gap-1 transition-colors"
              href={url}
              rel="noopener noreferrer"
              target="_blank"
            >
              <svg
                className="size-3.5"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                viewBox="0 0 24 24"
              >
                <path
                  d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M10.172 13.828a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <span>Link</span>
            </a>
          )}
        </div>
        <div className="overflow-x-auto">
          <ShikiHighlighter
            className="chatbot-code text-sm [&_pre]:min-w-max"
            language={language}
            showLanguage={false}
            showLineNumbers
            theme="tokyo-night"
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
    <div className="not-prose border-tns-blue/30 bg-tns-blue/5 my-6 overflow-hidden rounded-md border">
      <div className="flex items-center justify-between p-3">
        <code className="text-tns-blue flex-1 overflow-x-auto text-sm">
          {codeString}
        </code>
        <button
          className="text-tns-blue/50 hover:text-tns-blue ml-3 shrink-0 cursor-pointer transition-colors"
          onClick={handleCopy}
          type="button"
        >
          {copied ? (
            <Check
              className="size-4"
              fill="fill-tns-green"
              stroke="stroke-tns-green"
            />
          ) : (
            <Copy className="size-4" />
          )}
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
    const codeContent = Array.isArray(children) ? children[0] : children;
    const codeString =
      typeof codeContent === `string` ? codeContent.replace(/\n$/, ``) : ``;
    return language ? (
      <CodeBlock codeString={codeString} language={language} url={url} />
    ) : (
      <code
        className="bg-tns-blue/15 text-tns-blue rounded-sm px-1.5 py-0.5 text-[0.9em]"
        {...props}
      >
        {children}
      </code>
    );
  },
});
