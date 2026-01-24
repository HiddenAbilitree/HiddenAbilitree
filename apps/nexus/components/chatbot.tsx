'use client';

import type { PluggableList } from 'unified';

import { readStreamableValue } from '@ai-sdk/rsc';
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
import 'katex/dist/katex.min.css';
import Markdown from 'react-markdown';
import rehypeExternalLinks from 'rehype-external-links';
import rehypeKatex from 'rehype-katex';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';

import {
  chat,
  ChatResult,
  getDataLastUpdated,
  Message,
  ToolCall,
} from '@/actions';
import { CodeBlock } from '@/components/code-block';
import { Close, Document, Undo } from '@/components/icons';
import { _0xProto } from '@/styles/fonts';

const parseContent = (raw: string): string =>
  raw.replaceAll(/<think>[\s\S]*?<\/think>/g, ``).trim();

const generateId = (): string => crypto.randomUUID();

type ChatbotProps = {
  isOpen: boolean;
  onCloseAction: () => void;
};

type MessageItemProps = {
  isExpanded: boolean;
  message: Message;
  onToggleReasoning: (_id: string) => void;
};

const markdownComponents = {
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

const remarkPlugins = [remarkGfm, remarkMath];
const rehypePlugins: PluggableList = [
  rehypeKatex,
  [rehypeExternalLinks, { rel: [`noopener`, `noreferrer`], target: `_blank` }],
];

const MessageItem = memo(
  ({ isExpanded, message: m, onToggleReasoning }: MessageItemProps) => (
    <div
      className={`flex min-w-0 flex-col gap-1 ${m.role === `user` ? `items-end` : `items-start`}`}
    >
      {m.role === `assistant` && m.reasoning && (
        <button
          className='flex items-center gap-1 text-xs text-tns-white/40 hover:text-tns-white/60'
          onClick={() => onToggleReasoning(m.id)}
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
                      className='flex items-center gap-1 rounded-sm bg-tns-blue/20 px-1.5 py-0.5'
                      title='Code Snippets'
                    >
                      <Document className='size-3' />
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
          className={`max-w-[85%] rounded-lg px-3 py-2 text-sm wrap-break-word ${m.role === `user` ? `bg-tns-blue text-tns-black selection:bg-tns-black selection:text-tns-blue` : `bg-tns-black-hover text-tns-white`}`}
        >
          {m.role === `user` ?
            <span>{m.content}</span>
          : <div className='prose-compact prose prose-sm max-w-none min-w-0 wrap-break-word prose-invert prose-headings:my-2 prose-headings:border-0 prose-p:my-1.5 prose-p:leading-relaxed prose-a:text-tns-blue prose-a:decoration-tns-blue/40 prose-a:underline-offset-2 hover:prose-a:decoration-tns-blue prose-strong:text-tns-white prose-code:rounded-sm prose-code:bg-tns-blue/15 prose-code:px-1 prose-code:py-0.5 prose-code:break-all prose-code:text-tns-cyan prose-code:before:content-none prose-code:after:content-none prose-pre:my-2 prose-pre:bg-transparent prose-pre:p-0 prose-ol:my-1.5 prose-ul:my-1.5 prose-li:my-0.5 prose-table:my-2 prose-th:border prose-th:border-tns-blue/30 prose-th:bg-tns-blue/10 prose-th:px-2 prose-th:py-1 prose-td:border prose-td:border-tns-blue/30 prose-td:px-2 prose-td:py-1'>
              <Markdown
                components={markdownComponents}
                rehypePlugins={rehypePlugins}
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
  const [expandedReasoning, setExpandedReasoning] = useState<Set<string>>(
    new Set(),
  );
  const [lastUpdated, setLastUpdated] = useState<string | undefined>();

  const inputRef = useRef<HTMLInputElement>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const userScrolledUp = useRef(false);
  const lastScrollHeight = useRef(0);

  useEffect(() => {
    void getDataLastUpdated().then(setLastUpdated);
  }, []);

  const toggleReasoning = useCallback((id: string) => {
    setExpandedReasoning((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  }, []);

  const resetMessages = useCallback(() => {
    setMessages([]);
    setExpandedReasoning(new Set());
  }, []);

  const submitMessage = useCallback(
    async (content: string, existingMessages: Message[]) => {
      if (content.trim() === `` || isStreaming || isRateLimited) return;

      setReasoningContent(``);
      const userMessage: Message = {
        content,
        id: generateId(),
        role: `user`,
      };
      setMessages([...existingMessages, userMessage]);
      setInput(``);
      setIsStreaming(true);

      const result: ChatResult = await chat([...existingMessages, userMessage]);

      if (!result.stream) {
        setIsStreaming(false);
        return;
      }

      let rawContent = ``;
      let assistantReasoning = ``;
      let isInsideThinkTag = false;
      const completedToolCalls: ToolCall[] = [];
      const assistantId = generateId();
      setMessages((prev) => [
        ...prev,
        { content: ``, id: assistantId, role: `assistant`, toolCalls: [] },
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
                  id: assistantId,
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
                const thinkMatch = rawContent.match(
                  /<think>([\s\S]*?)<\/think>/,
                );
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
                  id: assistantId,
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
                    id: assistantId,
                    reasoning:
                      parsedContent ?
                        assistantReasoning || undefined
                      : undefined,
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
            id: assistantId,
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
            id: assistantId,
            role: `assistant`,
          },
        ]);
      }

      setActiveToolCall(undefined);
      setReasoningContent(``);
      setIsStreaming(false);
    },
    [isStreaming, isRateLimited],
  );

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    void submitMessage(input, messages);
  };

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

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          animate={{ opacity: 1, x: 0 }}
          className={`mb-2 flex w-[calc(100vw-2rem)] max-w-lg flex-col overflow-hidden rounded-xl border-2 border-tns-blue bg-tns-black shadow-xl ${_0xProto.className}`}
          exit={{ opacity: 0, x: -20 }}
          initial={{ opacity: 0, x: -20 }}
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
                className='cursor-pointer text-tns-white/60 hover:text-tns-white'
                onClick={resetMessages}
                title='Reset Chat'
                type='button'
              >
                <Undo className='size-4' />
              </button>
              <button
                className='cursor-pointer text-tns-white/60 hover:text-tns-white'
                onClick={onCloseAction}
                title='Close'
                type='button'
              >
                <Close className='size-4' />
              </button>
            </div>
          </div>

          <div
            className='flex h-128 min-w-0 flex-col gap-2 overflow-x-hidden overflow-y-auto overscroll-contain p-4'
            data-chat-history
            onScroll={handleScroll}
            onWheel={(e) => e.stopPropagation()}
            ref={messagesContainerRef}
          >
            {messages.length === 0 && (
              <div className='flex flex-col items-center justify-center gap-4 text-center text-sm'>
                <p className='text-tns-white/40'>Start a conversation...</p>
                <div className='flex flex-col gap-2'>
                  <p className='text-left text-tns-white/40'>Try asking:</p>
                  {[
                    `What information do you have?`,
                    `What projects has he worked on?`,
                    `Explain how the tool router works in mcp-scheduling`,
                    `What tech stack does this site use?`,
                  ].map((prompt, i) => (
                    <button
                      className='cursor-pointer rounded-lg border border-tns-blue/40 bg-tns-blue/10 px-3 py-2 text-left text-tns-blue transition-colors hover:border-tns-blue hover:bg-tns-blue/20'
                      key={i}
                      onClick={() => void submitMessage(prompt, [])}
                    >
                      {prompt}
                    </button>
                  ))}
                </div>
              </div>
            )}
            {messages.map((m) => (
              <MessageItem
                isExpanded={expandedReasoning.has(m.id)}
                key={m.id}
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
            <p className='mt-auto pt-4 text-center text-xs text-tns-white/25'>
              Uses RAG to search and retrieve code from all my public projects.
            </p>
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
                ref={inputRef}
                value={input}
              />
            </form>
          }
        </motion.div>
      )}
    </AnimatePresence>
  );
};
