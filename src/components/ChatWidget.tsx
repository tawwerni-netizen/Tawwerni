"use client";

import { useState, useRef, useEffect } from "react";
import { usePathname } from "next/navigation";
import { brand } from "@/content/brand";
import { useI18n } from "./LanguageContext";

type Message = { role: "user" | "assistant"; content: string };

const QUICK_REPLIES_AR = [
  "وإيه أركّز عليه النهاردة؟",
  "حاسس بتشتت ومحتاج خطة 5 دقايق",
  "مش قادر أركز وحاسس بإحباط",
  "راجع تقدمي ونقاط قوتي",
];

const QUICK_REPLIES_EN = [
  "What should I focus on today?",
  "Feeling overwhelmed, need a 5-min plan",
  "Having trouble focusing today",
  "Review my progress & strengths",
];

export default function ChatWidget() {
  const { lang } = useI18n();
  const isEn = lang === "en";

  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  const quickReplies = isEn ? QUICK_REPLIES_EN : QUICK_REPLIES_AR;

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, open]);

  async function send(text: string) {
    if (!text.trim() || loading) return;
    setMessages((prev) => [...prev, { role: "user", content: text }]);
    setInput("");
    setLoading(true);
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text, lang: isEn ? "en" : "ar" }),
      });
      const data = await res.json();
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content:
            data.reply ??
            data.error ??
            (isEn ? "An unexpected error occurred" : "حصل خطأ"),
        },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: isEn
            ? "Connection error, please try again"
            : "حصل خطأ في الاتصال، جرب تاني",
        },
      ]);
    } finally {
      setLoading(false);
    }
  }

  if (/^\/app\/learn\/[^/]+\/\d+$/.test(pathname)) return null;

  return (
    <>
      {open && (
        <div className="fixed bottom-24 left-4 z-50 w-[calc(100%-2rem)] max-w-sm h-[28rem] bg-white dark:bg-neutral-900 rounded-2xl shadow-2xl border border-black/10 dark:border-white/10 flex flex-col overflow-hidden">
          <div className="bg-brand-800 text-white px-4 py-3 flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-brand-200 text-brand-900 flex items-center justify-center text-lg">
              🤖
            </div>
            <div>
              <div className="font-bold text-sm">{brand.coachName}</div>
              <div className="text-xs text-brand-100">
                {isEn ? "AI Learning Coach" : "مدرّبك الذكي"}
              </div>
            </div>
            <button
              onClick={() => setOpen(false)}
              className="mr-auto text-white/80 hover:text-white text-lg px-2"
              aria-label={isEn ? "Close chat" : "إغلاق المحادثة"}
            >
              ✕
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-3 space-y-2">
            {messages.length === 0 && (
              <div className="text-center py-6">
                <p className="text-sm text-neutral-500 dark:text-neutral-400 mb-4 px-2">
                  {isEn
                    ? `Hello! I'm ${brand.coachName}, your AI learning coach. Ask me anything about your journey.`
                    : `أهلًا! أنا ${brand.coachName}، مدرّبك الذكي. اسألني أي حاجة عن رحلتك.`}
                </p>
                <div className="flex flex-wrap gap-2 justify-center">
                  {quickReplies.map((q) => (
                    <button
                      key={q}
                      onClick={() => send(q)}
                      className="text-xs bg-brand-50 dark:bg-brand-950 text-brand-800 dark:text-brand-300 rounded-full px-3 py-1.5 hover:bg-brand-100 dark:hover:bg-brand-900 transition-colors"
                    >
                      {q}
                    </button>
                  ))}
                </div>
              </div>
            )}
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.role === "user" ? "justify-start" : "justify-end"}`}>
                <div
                  className={`max-w-[80%] rounded-2xl px-3 py-2 text-sm ${
                    m.role === "user"
                      ? "bg-neutral-100 dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100"
                      : "bg-brand-50 dark:bg-brand-950 text-brand-900 dark:text-brand-200"
                  }`}
                >
                  {m.content}
                </div>
              </div>
            ))}
            {loading && (
              <div className="text-xs text-neutral-400 animate-pulse">
                {isEn ? `${brand.coachName} is typing...` : `${brand.coachName} بيكتب...`}
              </div>
            )}
            <div ref={bottomRef} />
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              send(input);
            }}
            className="border-t border-black/5 dark:border-white/10 p-2 flex gap-2"
          >
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={
                isEn
                  ? `Ask ${brand.coachName} anything...`
                  : `اسأل ${brand.coachName} أي حاجة...`
              }
              className="flex-1 text-sm px-3 py-2 rounded-full bg-neutral-100 dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 outline-none focus:ring-1 focus:ring-brand-500"
            />
            <button
              type="submit"
              disabled={loading}
              className="bg-brand-600 text-white rounded-full w-9 h-9 flex items-center justify-center disabled:opacity-50 hover:bg-brand-700 transition-colors"
            >
              ➤
            </button>
          </form>
        </div>
      )}

      <button
        onClick={() => setOpen((v) => !v)}
        className="fixed bottom-24 left-4 z-40 w-14 h-14 rounded-full bg-brand-600 text-white text-2xl shadow-lg flex items-center justify-center hover:bg-brand-700 transition-transform active:scale-95"
        aria-label={isEn ? `Chat with ${brand.coachName}` : `تحدث مع ${brand.coachName}`}
      >
        {open ? "✕" : "🤖"}
      </button>
    </>
  );
}
