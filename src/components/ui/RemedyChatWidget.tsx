"use client";

import { useMemo, useState, useRef, useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Send, X } from "lucide-react";

export type ChatRequest = {
  message: string;
  history?: { role: "assistant" | "user"; text: string }[];
  sessionId: string;
  page?: string;
  locale?: "cs" | "en";
  context?: {
    source?: string;
    serviceHint?: string;
  };
};

export type ChatResponse = {
  reply: string;
  actions?: string[];
  intent?:
    | "general"
    | "availability"
    | "service-selection"
    | "contact"
    | "reservation";
  needsHuman?: boolean;
};

type ChatMessage = {
  id: string;
  role: "assistant" | "user";
  text: string;
};

const DEFAULT_QUICK_ACTIONS = [
  "Vybrat terapeuta",
  "Volný termín",
];

const INITIAL_MESSAGES: ChatMessage[] = [
  {
    id: "welcome",
    role: "assistant",
    // Kombinace prvotního konceptu a Vavřincovy persony
    text: "Ahoj, jsem Vavřinec, digitální lenochod Remedy. I přes vrozený talent k pomalosti odpovídám většinou rychleji než Kuba.",
  },
];

// Helper pro bezpečné založení a vrácení Session ID
function useRemedyChatSession() {
  const [sessionId, setSessionId] = useState<string>("");

  useEffect(() => {
    const storedId = localStorage.getItem("remedy_chat_session_id_final");
    if (storedId) {
      setSessionId(storedId);
    } else {
      const newId = crypto.randomUUID();
      localStorage.setItem("remedy_chat_session_id_final", newId);
      setSessionId(newId);
    }
  }, []);

  return sessionId;
}

// Funkce, která pročeše text AI a přemění markdown linky na fyzická klikací tlačítka
function renderMessageText(text: string, isAssistant: boolean) {
  if (!isAssistant) return text;
  
  // Regulární výraz pro hledání [Text Tlačítka](url)
  const parts = text.split(/(\[[^\]]+\]\(https?:\/\/[^\s\)]+\))/g);
  
  return parts.map((part, i) => {
    const match = part.match(/\[([^\]]+)\]\((https?:\/\/[^\s\)]+)\)/);
    if (match) {
      return (
        <a 
          key={i} 
          href={match[2]} 
          target="_blank" 
          rel="noopener noreferrer" 
          className="mt-3 mb-1 flex w-fit items-center justify-center rounded-full bg-[#D9F99D] px-5 py-2.5 text-[13px] font-bold text-black transition-all hover:bg-[#ecfccb] shadow-[0_0_15px_rgba(217,249,157,0.2)]"
        >
          {match[1]}
        </a>
      );
    }
    
    // Pro zachování přirozených mezer u obyčejného textu
    return <span key={i} className="whitespace-pre-wrap">{part}</span>;
  });
}

export function RemedyChatWidget() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>(INITIAL_MESSAGES);
  const [quickActions, setQuickActions] = useState<string[]>(DEFAULT_QUICK_ACTIONS);
  const [isTyping, setIsTyping] = useState(false);
  
  const sessionId = useRemedyChatSession();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const canSend = useMemo(() => input.trim().length > 0 && !isTyping, [input, isTyping]);

  useEffect(() => {
    if (open) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, open, isTyping]);

  async function sendMessage(text?: string) {
    const value = (text ?? input).trim();
    if (!value || isTyping) return;

    // 1. Zobrazení uživatelské zprávy okamžitě
    setMessages((prev) => [
      ...prev,
      { id: crypto.randomUUID(), role: "user", text: value },
    ]);
    setInput("");
    setIsTyping(true);

    // 2. Odeslání dotazu na API
    try {
      const payload: ChatRequest = {
        message: value,
        history: messages.map(m => ({ role: m.role, text: m.text })),
        sessionId: sessionId || crypto.randomUUID(),
        page: typeof window !== "undefined" ? window.location.pathname : "/",
        locale: "cs",
        context: {
          source: "remedy-widget",
        },
      };

      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        throw new Error("Chyba při komunikaci se serverem.");
      }

      const data: ChatResponse = await res.json();

      // 3. Zobrazení odpovědi od serveru
      setMessages((prev) => [
        ...prev,
        { id: crypto.randomUUID(), role: "assistant", text: data.reply },
      ]);

      // 4. Přepis Quick Actions z backendu
      if (data.actions && data.actions.length > 0) {
        setQuickActions(data.actions);
      } else {
        setQuickActions([]);
      }
    } catch (error) {
      console.error("[RemedyChat Error]:", error);
      setMessages((prev) => [
        ...prev,
        {
          id: crypto.randomUUID(),
          role: "assistant",
          text: "Teď se mi nepodařilo odpovědět. Zkuste to prosím znovu.",
        },
      ]);
    } finally {
      setIsTyping(false);
    }
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  }

  return (
    <div className="fixed bottom-6 right-6 z-[90] flex flex-col items-end justify-end md:bottom-8 md:right-8">
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.3, ease: [0.23, 1, 0.32, 1] }} 
            className="mb-4 w-[calc(100vw-3rem)] sm:w-[380px] md:w-[420px] origin-bottom-right overflow-hidden rounded-[28px] border border-white/5 bg-[#0A0A0A] text-white shadow-[0_24px_80px_rgba(0,0,0,0.6)] ring-1 ring-white/10"
          >
            {/* Header */}
            <div className="border-b border-white/10 bg-gradient-to-br from-white/[0.04] to-transparent p-5">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#D9F99D] drop-shadow-[0_0_8px_rgba(217,249,157,0.3)]">
                    REMEDY ASISTENT - LENOCHOD VAVŘINEC
                  </div>
                  <h3 className="mt-2 text-xl font-medium tracking-tight text-white [font-family:var(--font-sora)]">
                    Jak vám můžeme pomoci?
                  </h3>
                  <p className="mt-1.5 max-w-[28ch] text-sm leading-relaxed text-neutral-400">
                    Pomůžeme vám vybrat vhodnou péči, termín nebo správný další krok.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-white/5 text-neutral-400 transition-colors hover:bg-white/10 hover:text-white"
                  aria-label="Zavřít chat"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Chat Area */}
            <div className="flex flex-col h-[340px] md:h-[380px] bg-gradient-to-b from-transparent to-black/40">
              
              {/* Messages List */}
              <div className="flex-1 space-y-4 overflow-y-auto p-5 scrollbar-thin scrollbar-track-transparent scrollbar-thumb-white/10">
                 
                {messages.map((message) => {
                  const isAssistant = message.role === "assistant";

                  return (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      key={message.id}
                      className={`flex ${isAssistant ? "justify-start" : "justify-end"}`}
                    >
                      <div
                        className={[
                          "max-w-[85%] rounded-[20px] px-4 py-3 text-[14px] leading-relaxed shadow-sm",
                          isAssistant
                            ? "rounded-tl-none border border-white/5 bg-white/[0.04] text-neutral-200"
                            : "rounded-tr-none bg-[#D9F99D] text-black font-medium",
                        ].join(" ")}
                      >
                        {renderMessageText(message.text, isAssistant)}
                      </div>
                    </motion.div>
                  );
                })}

                {isTyping && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex justify-start"
                  >
                    <div className="rounded-[20px] rounded-tl-none border border-white/5 bg-white/[0.04] px-4 py-4">
                      <div className="flex items-center gap-1.5">
                        <span className="h-1.5 w-1.5 rounded-full bg-neutral-400 animate-bounce" style={{ animationDelay: '0ms' }} />
                        <span className="h-1.5 w-1.5 rounded-full bg-neutral-400 animate-bounce" style={{ animationDelay: '150ms' }} />
                        <span className="h-1.5 w-1.5 rounded-full bg-neutral-400 animate-bounce" style={{ animationDelay: '300ms' }} />
                      </div>
                    </div>
                  </motion.div>
                )}
                <div ref={messagesEndRef} />
              </div>

               {/* Quick Actions plovoucí nad inputem */}
               {quickActions.length > 0 && (
                 <div className="px-4 pb-3">
                   <div className="flex flex-wrap gap-2 justify-end">
                     {quickActions.map((action) => (
                       <button
                         key={action}
                         type="button"
                         onClick={() => sendMessage(action)}
                         disabled={isTyping}
                         className="rounded-full border border-white/10 bg-white/[0.03] px-3 py-1.5 text-[13px] text-neutral-300 transition-all hover:border-[#D9F99D]/30 hover:bg-[#D9F99D]/10 hover:text-white disabled:pointer-events-none disabled:opacity-50"
                       >
                         {action}
                       </button>
                     ))}
                   </div>
                 </div>
               )}
            </div>

            {/* Input Area */}
            <div className="border-t border-white/10 bg-[#0A0A0A] p-4">
              <div className="flex items-end gap-3">
                <label htmlFor="remedy-chat-input" className="sr-only">
                  Napište zprávu
                </label>
                <textarea
                  id="remedy-chat-input"
                  rows={1}
                  value={input}
                  onChange={(event) => setInput(event.target.value)}
                  onKeyDown={handleKeyDown}
                  disabled={isTyping}
                  placeholder="Napište nám svůj dotaz..."
                  className="min-h-[48px] max-h-[120px] flex-1 resize-none rounded-2xl border border-white/10 bg-white/5 px-4 py-3.5 text-[14px] text-white outline-none placeholder:text-neutral-500 focus:border-[#D9F99D]/50 focus:bg-white/10 transition-colors normal-case-important disabled:opacity-50"
                />
                <button
                  type="button"
                  onClick={() => sendMessage()}
                  disabled={!canSend}
                  className="inline-flex h-[48px] w-[48px] flex-shrink-0 items-center justify-center rounded-2xl bg-[#D9F99D] text-black transition-all hover:bg-white hover:scale-105 active:scale-95 disabled:pointer-events-none disabled:bg-white/10 disabled:text-white/30"
                  aria-label="Odeslat zprávu"
                >
                  <Send className="h-5 w-5 ml-0.5" />
                </button>
              </div>

              <p className="mt-3 text-center text-[11px] leading-tight text-neutral-500">
                Pokud nebude možné odpovědět hned, navážeme přes rezervaci.
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Launcher Button */}
      <motion.button
        type="button"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setOpen((prev) => !prev)}
        className="group relative flex h-14 w-14 sm:h-16 sm:w-16 items-center justify-center rounded-full border border-[#D9F99D]/20 bg-[#0A0A0A] text-[#D9F99D] shadow-[0_8px_32px_rgba(217,249,157,0.15)] transition-colors hover:border-[#D9F99D]/50 hover:bg-neutral-900"
        aria-expanded={open}
        aria-label="Otevřít Remedy chat"
      >
        <div className="absolute inset-0 rounded-full bg-[#D9F99D]/5 blur-md transition-all group-hover:bg-[#D9F99D]/10 group-hover:blur-lg" />
        
        <span className="relative z-10 flex text-white group-hover:text-[#D9F99D] transition-colors">
          {open ? (
             <X className="h-6 w-6 sm:h-7 sm:w-7" />
          ) : (
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="sm:h-[28px] sm:w-[28px]"
            >
              <path
                d="M7 17.5L3.5 20V6.5C3.5 5.39543 4.39543 4.5 5.5 4.5H18.5C19.6046 4.5 20.5 5.39543 20.5 6.5V15.5C20.5 16.6046 19.6046 17.5 18.5 17.5H7Z"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinejoin="round"
              />
              <path d="M8 9H16" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              <path d="M8 12.5H13.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          )}
        </span>
      </motion.button>
    </div>
  );
}
