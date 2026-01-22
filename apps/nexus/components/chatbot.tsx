'use client';

import { readStreamableValue } from '@ai-sdk/rsc';
import * as languages from 'linguist-languages';
import { AnimatePresence, motion } from 'motion/react';
import {
  FormEvent,
  memo,
  ReactNode,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
import Markdown from 'react-markdown';
import 'react-shiki/css';
import ShikiHighlighter from 'react-shiki';
import remarkGfm from 'remark-gfm';

import {
  chat,
  ChatResult,
  getDataLastUpdated,
  Message,
  ToolCall,
} from '@/app/actions/chat';
import { Close, Undo } from '@/components/icons';
import { _0xProto } from '@/styles/fonts';

const CodeBlock = memo(
  ({
    codeString,
    langColor,
    language,
    url,
  }: {
    codeString: string;
    langColor?: string;
    language: string;
    url?: string;
  }) => (
    <div className='not-prose overflow-hidden rounded-md border border-tns-blue'>
      <div className='flex items-center gap-2 bg-tns-blue py-1 pr-3 pl-2 text-xs font-semibold text-tns-black'>
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
  ),
);

CodeBlock.displayName = `CodeBlock`;

type LinguistLanguage = {
  aliases?: string[];
  color?: string;
  name?: string;
};

const getLanguageColor = (lang: string): string | undefined => {
  const normalizedLang = lang.toLowerCase();
  for (const key of Object.keys(languages)) {
    const langData = languages[
      key as keyof typeof languages
    ] as LinguistLanguage;
    if (
      langData.name?.toLowerCase() === normalizedLang ||
      langData.aliases?.some((alias) => alias.toLowerCase() === normalizedLang)
    ) {
      return langData.color;
    }
  }
  return undefined;
};

type ChatbotProps = {
  isOpen: boolean;
  onCloseAction: () => void;
};

const parseContent = (raw: string): string =>
  raw.replaceAll(/<think>[\s\S]*?<\/think>/g, ``).trim();

type MessageItemProps = {
  index: number;
  isExpanded: boolean;
  message: Message;
  onToggleReasoning: (_index: number) => void;
};

const markdownComponents = {
  a: ({
    children,
    href,
    ...props
  }: {
    children?: ReactNode;
    href?: string;
  }) => (
    <a href={href} rel='noopener noreferrer' target='_blank' {...props}>
      {children}
    </a>
  ),
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
    const langColor = language ? getLanguageColor(language) : undefined;
    return language ?
        <CodeBlock
          codeString={codeString}
          langColor={langColor}
          language={language}
          url={url}
        />
      : <code className={className} {...props}>
          {children}
        </code>;
  },
  table: ({ children, ...props }: { children?: ReactNode }) => (
    <div className='overflow-x-auto'>
      <table {...props}>{children}</table>
    </div>
  ),
};

const remarkPlugins = [remarkGfm];

const MessageItem = memo(
  ({ index, isExpanded, message: m, onToggleReasoning }: MessageItemProps) => (
    <div
      className={`flex min-w-0 flex-col gap-1 ${m.role === `user` ? `items-end` : `items-start`}`}
    >
      {m.role === `assistant` && m.reasoning && (
        <button
          className='flex items-center gap-1 text-xs text-tns-white/40 hover:text-tns-white/60'
          onClick={() => onToggleReasoning(index)}
        >
          <span
            className={`transition-transform ${isExpanded ? `rotate-90` : ``}`}
          >
            ▶
          </span>
          <span>Thought process</span>
        </button>
      )}
      {m.role === `assistant` && m.reasoning && isExpanded && (
        <div className='max-w-[85%] rounded-lg border border-tns-white/10 bg-tns-black-hover px-3 py-2 text-xs wrap-break-word text-tns-white/50 italic'>
          {m.reasoning}
        </div>
      )}
      {m.role === `assistant` && m.toolCalls && m.toolCalls.length > 0 && (
        <div className='flex flex-col gap-1'>
          {m.toolCalls.map((tool, j) => {
            const snippetMatch = tool.result?.match(
              /Retrieved (\d+) code snippets?/,
            );
            const snippetCount =
              snippetMatch ? Number.parseInt(snippetMatch[1], 10) : undefined;
            return (
              <div
                className='flex items-center gap-2 rounded-lg border border-tns-blue/30 bg-tns-blue/10 px-2 py-1 text-xs text-tns-blue'
                key={j}
              >
                <span className='text-green-400'>✓</span>
                <span className='font-semibold'>{tool.name}</span>
                {snippetCount !== undefined && (
                  <>
                    <div className='h-3 w-px bg-tns-blue/30' />
                    <div
                      className='flex items-center gap-1 rounded bg-tns-blue/20 px-1.5 py-0.5'
                      title='Code Snippets'
                    >
                      <svg
                        className='size-3'
                        fill='none'
                        stroke='currentColor'
                        strokeWidth={2}
                        viewBox='0 0 24 24'
                      >
                        <path
                          d='M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z'
                          strokeLinecap='round'
                          strokeLinejoin='round'
                        />
                      </svg>
                      <span>{snippetCount}</span>
                    </div>
                  </>
                )}
                {tool.result && !snippetCount && (
                  <span className='text-tns-white/60'>→ {tool.result}</span>
                )}
              </div>
            );
          })}
        </div>
      )}
      {(m.role === `user` || m.content) && (
        <div
          className={`max-w-[85%] rounded-lg px-3 py-2 text-sm wrap-break-word ${
            m.role === `user` ?
              `bg-tns-blue text-tns-black selection:bg-tns-black selection:text-tns-blue`
            : `bg-tns-black-hover text-tns-white`
          }`}
        >
          {m.role === `user` ?
            <span>{m.content}</span>
          : <div className='prose prose-sm max-w-none min-w-0 prose-code-size-inherit wrap-break-word prose-invert prose-headings:my-2 prose-p:my-1 prose-a:text-tns-blue prose-code:break-all prose-code:text-tns-blue prose-code:before:content-none prose-code:after:content-none prose-pre:my-2 prose-pre:bg-transparent prose-pre:p-0 prose-ol:my-1 prose-ul:my-1 prose-li:my-0 prose-table:my-2 prose-th:border prose-th:border-tns-blue/30 prose-th:bg-tns-blue/10 prose-th:px-2 prose-th:py-1 prose-td:border prose-td:border-tns-blue/30 prose-td:px-2 prose-td:py-1'>
              <Markdown
                components={markdownComponents}
                remarkPlugins={remarkPlugins}
              >
                {m.content}
              </Markdown>
            </div>
          }
        </div>
      )}
    </div>
  ),
);

MessageItem.displayName = `MessageItem`;

export const Chatbot = ({ isOpen, onCloseAction }: ChatbotProps) => {
  const [input, setInput] = useState(``);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isStreaming, setIsStreaming] = useState(false);
  const [isRateLimited, setIsRateLimited] = useState(false);
  const [activeToolCall, setActiveToolCall] = useState<ToolCall | undefined>();
  const [reasoningContent, setReasoningContent] = useState(``);
  const [expandedReasoning, setExpandedReasoning] = useState<Set<number>>(
    new Set(),
  );
  const [lastUpdated, setLastUpdated] = useState<string | undefined>();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const userScrolledUp = useRef(false);
  const lastScrollHeight = useRef(0);

  const toggleReasoning = useCallback((index: number) => {
    setExpandedReasoning((prev) => {
      const next = new Set(prev);
      if (next.has(index)) {
        next.delete(index);
      } else {
        next.add(index);
      }
      return next;
    });
  }, []);

  useEffect(() => {
    void getDataLastUpdated().then(setLastUpdated);
  }, []);

  useEffect(() => {
    const container = messagesContainerRef.current;
    if (!container || userScrolledUp.current) return;

    container.scrollTop = container.scrollHeight;
    lastScrollHeight.current = container.scrollHeight;
  }, [messages, isStreaming, activeToolCall, reasoningContent]);

  const handleScroll = () => {
    const container = messagesContainerRef.current;
    if (!container) return;

    const distanceFromBottom =
      container.scrollHeight - container.scrollTop - container.clientHeight;
    const contentGrew = container.scrollHeight > lastScrollHeight.current;

    if (contentGrew) {
      lastScrollHeight.current = container.scrollHeight;
      return;
    }

    userScrolledUp.current = distanceFromBottom > 50;
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (input.trim() === `` || isStreaming || isRateLimited) return;

    userScrolledUp.current = false;
    setReasoningContent(``);
    const userMessage: Message = { content: input, role: `user` };
    setMessages((prev) => [...prev, userMessage]);
    setInput(``);
    setIsStreaming(true);

    const result: ChatResult = await chat([...messages, userMessage]);

    if (!result.stream) {
      setIsStreaming(false);
      return;
    }

    let rawContent = ``;
    let assistantReasoning = ``;
    let isInsideThinkTag = false;
    const completedToolCalls: ToolCall[] = [];
    setMessages((prev) => [
      ...prev,
      { content: ``, role: `assistant`, toolCalls: [] },
    ]);

    try {
      for await (const event of readStreamableValue(result.stream)) {
        if (!event) continue;

        switch (event.type) {
          case `error`: {
            const isRateLimitError = event.error === `rate_limit`;
            if (isRateLimitError) {
              setIsRateLimited(true);
            }
            setMessages((prev) => [
              ...prev.slice(0, -1),
              {
                content:
                  isRateLimitError ?
                    `I've hit my daily API limit. Please try again tomorrow.`
                  : `Sorry, something went wrong. Please try again.`,
                role: `assistant`,
              },
            ]);
            setActiveToolCall(undefined);
            setReasoningContent(``);
            setIsStreaming(false);
            return;
          }
          case `reasoning`: {
            assistantReasoning += event.content;
            setReasoningContent((prev) => prev + event.content);

            break;
          }
          case `text`: {
            rawContent += event.content;

            if (
              rawContent.includes(`<think>`) &&
              !rawContent.includes(`</think>`)
            ) {
              isInsideThinkTag = true;
              const thinkStart = rawContent.lastIndexOf(`<think>`);
              const thinkContent = rawContent.slice(thinkStart + 7);
              assistantReasoning = thinkContent;
              setReasoningContent(thinkContent);
            } else if (isInsideThinkTag && rawContent.includes(`</think>`)) {
              isInsideThinkTag = false;
              const thinkMatch = rawContent.match(/<think>([\s\S]*?)<\/think>/);
              assistantReasoning = thinkMatch ? thinkMatch[1].trim() : ``;
              setReasoningContent(``);
            } else if (isInsideThinkTag) {
              const thinkStart = rawContent.lastIndexOf(`<think>`);
              const thinkContent = rawContent.slice(thinkStart + 7);
              assistantReasoning = thinkContent;
              setReasoningContent(thinkContent);
            }

            const parsedContent = parseContent(rawContent);
            setMessages((prev) => [
              ...prev.slice(0, -1),
              {
                content: parsedContent,
                reasoning:
                  parsedContent ? assistantReasoning || undefined : undefined,
                role: `assistant`,
                toolCalls: [...completedToolCalls],
              },
            ]);

            break;
          }
          case `tool_call`: {
            if (event.tool.status === `running`) {
              setActiveToolCall(event.tool);
            } else if (event.tool.status === `completed`) {
              setActiveToolCall(undefined);
              completedToolCalls.push(event.tool);
              const parsedContent = parseContent(rawContent);
              setMessages((prev) => [
                ...prev.slice(0, -1),
                {
                  content: parsedContent,
                  reasoning:
                    parsedContent ? assistantReasoning || undefined : undefined,
                  role: `assistant`,
                  toolCalls: [...completedToolCalls],
                },
              ]);
            }

            break;
          }
        }
      }

      const finalContent = parseContent(rawContent);
      const hasToolCalls = completedToolCalls.length > 0;
      const hasReasoning = assistantReasoning.trim().length > 0;

      const displayContent =
        finalContent ||
        (hasToolCalls || hasReasoning ? `` : (
          `I couldn't generate a response. Please try again.`
        ));

      setMessages((prev) => [
        ...prev.slice(0, -1),
        {
          content: displayContent,
          reasoning: hasReasoning ? assistantReasoning : undefined,
          role: `assistant`,
          toolCalls: hasToolCalls ? [...completedToolCalls] : undefined,
        },
      ]);
    } catch (error) {
      const errorString = String(error);
      const isRateLimitError =
        error === `rate_limit` || errorString.includes(`rate_limit`);
      if (isRateLimitError) {
        setIsRateLimited(true);
      }
      setMessages((prev) => [
        ...prev.slice(0, -1),
        {
          content:
            isRateLimitError ?
              `I've hit my daily API limit. Please try again tomorrow.`
            : `Sorry, something went wrong. Please try again.`,
          role: `assistant`,
        },
      ]);
    }

    setActiveToolCall(undefined);
    setReasoningContent(``);
    setIsStreaming(false);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          animate={{ opacity: 1, scale: 1, y: 0 }}
          className={`mb-2 flex w-[calc(100vw-2rem)] max-w-96 flex-col overflow-hidden rounded-xl border-2 border-tns-blue bg-tns-black shadow-xl ${_0xProto.className}`}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          transition={{ duration: 0.2 }}
        >
          <div className='flex items-center justify-between gap-2 border-b-2 border-tns-blue px-4 py-3'>
            <div className='flex min-w-0 flex-1 items-center gap-2 text-sm'>
              <span className='shrink-0 font-semibold text-tns-white'>
                Chat
              </span>
              {lastUpdated && (
                <>
                  <div className='h-4 w-px shrink-0 bg-tns-white/20' />
                  <span
                    className='truncate text-tns-white/40'
                    title={new Date(lastUpdated).toLocaleString(`en-US`, {
                      day: `numeric`,
                      hour: `numeric`,
                      hour12: true,
                      minute: `2-digit`,
                      month: `short`,
                      year: `numeric`,
                    })}
                  >
                    Data Updated{` `}
                    {new Date(lastUpdated).toLocaleDateString(`en-US`, {
                      day: `numeric`,
                      month: `short`,
                      year: `numeric`,
                    })}
                  </span>
                </>
              )}
            </div>
            <div className='flex shrink-0 items-center gap-2'>
              <button
                className='text-tns-white/60 hover:text-tns-white'
                onClick={() => setMessages([])}
                title='Reset Chat'
                type='button'
              >
                <Undo className='size-4' />
              </button>
              <button
                className='text-tns-white/60 hover:text-tns-white'
                onClick={onCloseAction}
                title='Close'
                type='button'
              >
                <Close className='size-4' />
              </button>
            </div>
          </div>

          <div
            className='flex h-96 min-w-0 flex-col gap-2 overflow-x-hidden overflow-y-auto overscroll-contain p-4'
            data-chat-history
            onScroll={handleScroll}
            onWheel={(e) => e.stopPropagation()}
            ref={messagesContainerRef}
          >
            {messages.length === 0 && (
              <div className='flex flex-col items-center justify-evenly gap-3 text-center text-sm text-tns-white/40'>
                <p>Start a conversation...</p>
                {/* <hr className='w-full border-t-tns-blue' /> */}
                <p>
                  Try{` `}
                  {[
                    `What projects have you worked on?`,
                    `What do you know?`,
                    `Explain how the tool router works in mcp-scheduling`,
                    `What tech stack does this site use?`,
                  ].map((prompt, i) => (
                    <button
                      className='text-tns-blue/60 hover:text-tns-blue hover:underline'
                      key={i}
                      onClick={() => setInput(prompt)}
                    >
                      {prompt}
                    </button>
                  ))}
                </p>
                {/* <hr className='w-full border-t-tns-blue' /> */}
                <p className='text-xs text-tns-white/25'>
                  Uses RAG to search and retrieve code from all my public
                  projects.
                </p>
              </div>
            )}
            {messages.map((m, i) => (
              <MessageItem
                index={i}
                isExpanded={expandedReasoning.has(i)}
                key={i}
                message={m}
                onToggleReasoning={toggleReasoning}
              />
            ))}
            {activeToolCall && (
              <motion.div
                animate={{ opacity: 1, y: 0 }}
                className='flex items-center gap-2 rounded-lg border border-tns-blue/30 bg-tns-blue/10 px-2 py-1 text-xs text-tns-blue'
                initial={{ opacity: 0, y: 5 }}
              >
                <span className='inline-block size-2 animate-pulse rounded-full bg-tns-blue' />
                <span className='font-semibold'>{activeToolCall.name}</span>
              </motion.div>
            )}
            {isStreaming &&
              messages.at(-1)?.content === `` &&
              !activeToolCall && (
                <div className='flex items-start'>
                  <div className='max-w-[85%] rounded-lg bg-tns-black-hover px-3 py-2 text-sm wrap-break-word text-tns-white/60 italic'>
                    {reasoningContent || `Thinking...`}
                  </div>
                </div>
              )}
            <div ref={messagesEndRef} />
          </div>

          {isRateLimited ?
            <div className='border-t-2 border-tns-blue p-3 text-center'>
              <p className='text-xs text-tns-white/40'>Daily Limit Reached.</p>
              <p className='text-xs text-tns-white/40'>
                Sorry, I&apos;m on free tier.
              </p>
            </div>
          : <form
              className='border-t-2 border-tns-blue p-3'
              onSubmit={(e) => void handleSubmit(e)}
            >
              <input
                className='w-full rounded-lg border border-tns-blue/50 bg-tns-black-hover px-3 py-2 text-sm text-tns-white placeholder:text-tns-white/40 focus:border-tns-blue focus:outline-none disabled:opacity-50'
                disabled={isStreaming}
                onChange={(e) => setInput(e.target.value)}
                placeholder={
                  isStreaming ? `Waiting for response...` : `Type a message...`
                }
                value={input}
              />
            </form>
          }
        </motion.div>
      )}
    </AnimatePresence>
  );
};
