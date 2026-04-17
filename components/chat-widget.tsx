"use client";

import { useState } from "react";
import { MessageCircle, Sparkles, X } from "lucide-react";

const sampleMessages = [
  {
    role: "assistant",
    text: "Hi! I can help explain reward types, fees, and card differences."
  },
  {
    role: "user",
    text: "Which card is better for travel and dining?"
  },
  {
    role: "assistant",
    text: "Once connected to real recommendations, this panel can answer that instantly. For now, this is a frontend-only preview."
  }
];

export function ChatWidget() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <div className="fixed bottom-6 right-6 z-40">
        <button
          type="button"
          onClick={() => setOpen((value) => !value)}
          className="group relative flex h-16 w-16 items-center justify-center rounded-full bg-brand-blue text-white shadow-2xl shadow-blue-500/30 transition hover:-translate-y-1"
          aria-label="Toggle chat"
        >
          <span className="absolute inset-0 animate-pulseRing rounded-full bg-brand-blue/40" />
          {open ? <X className="relative h-6 w-6" /> : <MessageCircle className="relative h-6 w-6" />}
        </button>
      </div>

      {open && (
        <div className="fixed bottom-28 right-4 z-40 w-[calc(100vw-2rem)] max-w-sm animate-appear">
          <div className="panel overflow-hidden">
            <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4 dark:border-slate-700">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-brand-blue/10 text-brand-blue">
                  <Sparkles className="h-5 w-5" />
                </div>
                <div>
                  <p className="font-semibold text-slate-900 dark:text-white">CardMatch Assistant</p>
                  <p className="text-xs text-slate-500 dark:text-slate-300">Frontend preview only</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="rounded-full p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-700 dark:hover:text-white"
                aria-label="Close chat"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="space-y-4 bg-slate-50/80 px-5 py-5 dark:bg-slate-900/50">
              {sampleMessages.map((message, index) => (
                <div
                  key={`${message.role}-${index}`}
                  className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-6 ${
                    message.role === "assistant"
                      ? "bg-white text-slate-700 shadow-sm dark:bg-slate-800 dark:text-slate-100"
                      : "ml-auto bg-brand-blue text-white"
                  }`}
                >
                  {message.text}
                </div>
              ))}
            </div>

            <div className="border-t border-slate-200 p-4 dark:border-slate-700">
              <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3 dark:border-slate-600 dark:bg-slate-800">
                <input
                  disabled
                  placeholder="Ask a question..."
                  className="w-full bg-transparent text-sm text-slate-500 outline-none dark:text-slate-300"
                />
                <button
                  type="button"
                  disabled
                  className="rounded-full bg-slate-100 px-3 py-1.5 text-xs font-semibold text-slate-400 dark:bg-slate-700 dark:text-slate-300"
                >
                  Send
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
