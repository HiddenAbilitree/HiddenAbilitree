'use client';

import { readStreamableValue } from '@ai-sdk/rsc';
import {
  createContext,
  FormEvent,
  ReactNode,
  RefObject,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';

import {
  chat,
  ChatResult,
  getDataLastUpdated,
  Message,
  ToolCall,
} from '@/app/actions/chat';

const parseContent = (raw: string): string =>
  raw.replaceAll(/<think>[\s\S]*?<\/think>/g, ``).trim();

type ChatContextType = {
  activeToolCall: ToolCall | undefined;
  expandedReasoning: Set<number>;
  handleSubmit: (e: FormEvent) => Promise<void>;
  heroInputRef: RefObject<HTMLInputElement | null>;
  input: string;
  isRateLimited: boolean;
  isStreaming: boolean;
  lastUpdated: string | undefined;
  messages: Message[];
  openPopupChat: () => void;
  popupInputRef: RefObject<HTMLInputElement | null>;
  reasoningContent: string;
  requestFocusToHero: () => void;
  requestFocusToPopup: () => void;
  resetMessages: () => void;
  setInput: (value: string) => void;
  setOpenPopupChat: (fn: () => void) => void;
  toggleReasoning: (index: number) => void;
};

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export const useChatContext = () => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error(`useChatContext must be used within a ChatProvider`);
  }
  return context;
};

export const ChatProvider = ({ children }: { children: ReactNode }) => {
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

  const heroInputRef = useRef<HTMLInputElement>(null);
  const popupInputRef = useRef<HTMLInputElement>(null);
  const openPopupChatRef = useRef<() => void>(() => {});

  const openPopupChat = useCallback(() => {
    openPopupChatRef.current();
  }, []);

  const setOpenPopupChat = useCallback((fn: () => void) => {
    openPopupChatRef.current = fn;
  }, []);

  const requestFocusToHero = useCallback(() => {
    setTimeout(() => {
      heroInputRef.current?.focus();
    }, 50);
  }, []);

  const requestFocusToPopup = useCallback(() => {
    setTimeout(() => {
      popupInputRef.current?.focus();
    }, 250);
  }, []);

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

  const resetMessages = useCallback(() => {
    setMessages([]);
    setExpandedReasoning(new Set());
  }, []);

  useEffect(() => {
    void getDataLastUpdated().then(setLastUpdated);
  }, []);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (input.trim() === `` || isStreaming || isRateLimited) return;

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
    <ChatContext.Provider
      value={{
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
        popupInputRef,
        reasoningContent,
        requestFocusToHero,
        requestFocusToPopup,
        resetMessages,
        setInput,
        setOpenPopupChat,
        toggleReasoning,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};
