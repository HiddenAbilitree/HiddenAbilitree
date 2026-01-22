'use client';

import { motion } from 'motion/react';
import { useEffect, useRef } from 'react';

import { useChatContext } from '@/components/chat-context';
import { MessageItem } from '@/components/chatbot';
import { Undo } from '@/components/icons';
import { _0xProto } from '@/styles/fonts';

export const HeroChat = () => {
  const {
    activeToolCall,
    expandedReasoning,
    handleSubmit,
    heroInputRef,
    input,
    isRateLimited,
    isStreaming,
    lastUpdated,
    messages,
    openPopupChat,
    reasoningContent,
    requestFocusToPopup,
    resetMessages,
    setInput,
    toggleReasoning,
  } = useChatContext();

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const userScrolledUp = useRef(false);
  const lastScrollHeight = useRef(0);
  const wasInputFocused = useRef(false);
  const wasScrolledPastHero = useRef(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrolledPast = globalThis.scrollY > globalThis.innerHeight * 0.8;

      if (scrolledPast && !wasScrolledPastHero.current && wasInputFocused.current) {
        openPopupChat();
        requestFocusToPopup();
        wasInputFocused.current = false;
      }

      wasScrolledPastHero.current = scrolledPast;
    };

    globalThis.addEventListener(`scroll`, handleScroll, { passive: true });
    return () => globalThis.removeEventListener(`scroll`, handleScroll);
  }, [openPopupChat, requestFocusToPopup]);

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
    <div
      className={`flex h-full w-lg flex-col overflow-hidden rounded-2xl border-2 border-tns-blue bg-tns-black/80 shadow-2xl backdrop-blur-sm 2xl:w-176 3xl:w-208 ${_0xProto.className}`}
    >
      <div className='flex items-center justify-between gap-2 border-b-2 border-tns-blue px-5 py-4'>
        <div className='flex min-w-0 flex-1 items-center gap-3 text-base'>
          <span className='shrink-0 text-lg font-semibold text-tns-white'>
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
        <button
          className='text-tns-white/60 hover:text-tns-white'
          onClick={resetMessages}
          title='Reset Chat'
          type='button'
        >
          <Undo className='size-5' />
        </button>
      </div>

      <div
        className='flex min-w-0 flex-1 flex-col gap-3 overflow-x-hidden overflow-y-auto overscroll-contain p-5'
        data-chat-history
        onScroll={handleScroll}
        onWheel={(e) => e.stopPropagation()}
        ref={messagesContainerRef}
      >
        {messages.length === 0 && (
          <div className='flex flex-1 flex-col items-center justify-center gap-4 text-center text-base text-tns-white/40'>
            <p className='text-lg'>Start a conversation...</p>
            <div className='flex flex-col gap-2'>
              {[
                `What projects has he worked on?`,
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
            </div>
            <p className='text-sm text-tns-white/25'>
              Uses RAG to search and retrieve code from all my public projects.
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
        {isStreaming && messages.at(-1)?.content === `` && !activeToolCall && (
          <div className='flex items-start'>
            <div className='max-w-[85%] rounded-lg bg-tns-black-hover px-3 py-2 text-sm wrap-break-word text-tns-white/60 italic'>
              {reasoningContent || `Thinking...`}
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {isRateLimited ?
        <div className='border-t-2 border-tns-blue p-5 text-center'>
          <p className='text-sm text-tns-white/40'>Daily Limit Reached.</p>
          <p className='text-sm text-tns-white/40'>
            Sorry, I&apos;m on free tier.
          </p>
        </div>
      : <form
          className='border-t-2 border-tns-blue p-5'
          onSubmit={(e) => void handleSubmit(e)}
        >
          <input
            className='w-full rounded-lg border border-tns-blue/50 bg-tns-black-hover px-4 py-3 text-base text-tns-white placeholder:text-tns-white/40 focus:border-tns-blue focus:outline-none disabled:opacity-50'
            disabled={isStreaming}
            onBlur={() => (wasInputFocused.current = false)}
            onChange={(e) => setInput(e.target.value)}
            onFocus={() => (wasInputFocused.current = true)}
            placeholder={
              isStreaming ? `Waiting for response...` : `Type a message...`
            }
            ref={heroInputRef}
            value={input}
          />
        </form>
      }
    </div>
  );
};
