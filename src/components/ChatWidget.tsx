"use client";

import { useState, useRef, useEffect } from "react";
import { usePathname } from "next/navigation";
import { brand } from "@/content/brand";

type Message = { role: "user" | "assistant"; content: string };

const QUICK_REPLIES = ["وإيه أركّز عليه النهاردة؟", "ساعدني أحدد هدف", "راجع تقدمي", "محتاج تحفيز"];

export default function ChatWidget() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

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
        body: JSON.stringify({ message: text }),
      });
      const data = await res.json();
      setMessages((prev) => [...prev, { role: "assistant", content: data.reply ?? data.error ?? "حصل خطأ" }]);
    } catch {
      setMessages((prev) => [...prev, { role: "assistant", content: "حصل خطأ في الاتصال، جرب تاني" }]);
    } finally {
      setLoading(false);
    }
  }

  if (/^\/app\/learn\/[^/]+\/\d+$/.test(pathname)) return null;

  return (
    <>
      {open && (
        <div className="fixed bottom-24 left-4 z-50 w-[calc(100%-2rem)] max-w-sm h-[28rem] bg-white rounded-2xl shadow-2xl border border-black/10 flex flex-col overflow-hidden">
          <div className="bg-brand-800 text-white px-4 py-3 flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-brand-200 flex items-center justify-center text-lg">🤖</div>
            <div>
              <div className="font-bold text-sm">{brand.coachName}</div>
              <div className="text-xs text-brand-100">مدرّبك الذكي</div>
            </div>
            <button onClick={() => setOpen(false)} className="mr-auto text-white/80 hover:text-white text-lg">
              ✕
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-3 space-y-2">
            {messages.length === 0 && (
              <div className="text-center py-6">
                <p className="text-sm text-neutral-500 mb-4">
                  أهلًا! أنا {brand.coachName}، مدرّبك الذكي. اسألني أي حاجة عن رحلتك.
                </p>
                <div className="flex flex-wrap gap-2 justify-center">
                  {QUICK_REPLIES.map((q) => (
                    <button
                      key={q}
                      onClick={() => send(q)}
                      className="text-xs bg-brand-50 text-brand-800 rounded-full px-3 py-1.5"
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
                    m.role === "user" ? "bg-neutral-100 text-neutral-900" : "bg-brand-50 text-brand-900"
                  }`}
                >
                  {m.content}
                </div>
              </div>
            ))}
            {loading && <div className="text-xs text-neutral-400">{brand.coachName} بيكتب...</div>}
            <div ref={bottomRef} />
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              send(input);
            }}
            className="border-t border-black/5 p-2 flex gap-2"
          >
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={`اسأل ${brand.coachName} أي حاجة...`}
              className="flex-1 text-sm px-3 py-2 rounded-full bg-neutral-100 outline-none"
            />
            <button
              type="submit"
              disabled={loading}
              className="bg-brand-600 text-white rounded-full w-9 h-9 flex items-center justify-center disabled:opacity-50"
            >
              ➤
            </button>
          </form>
        </div>
      )}

      <button
        onClick={() => setOpen((v) => !v)}
        className="fixed bottom-24 left-4 z-40 w-14 h-14 rounded-full bg-brand-600 text-white text-2xl shadow-lg flex items-center justify-center"
        aria-label={`تحدث مع ${brand.coachName}`}
      >
        {open ? "✕" : "🤖"}
      </button>
    </>
  );
}
