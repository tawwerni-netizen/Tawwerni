"use client";

import { useEffect, useState } from "react";
import { useI18n } from "./LanguageContext";

/**
 * Time-of-day greeting, read from the visitor's own clock.
 *
 * This used to be computed in the server component. That meant it followed the
 * *host's* timezone — Hostinger runs UTC, so somebody opening the app at 9pm in
 * Cairo was told "مساء النور" because it was still 7pm on the server. The only
 * clock that matters here is the one in the learner's pocket.
 *
 * Renders the evening greeting on the server pass and corrects itself on mount,
 * so there is no empty gap and no hydration mismatch.
 */

function greetingFor(hour: number, isEn: boolean) {
  if (isEn) {
    if (hour < 12) return "Good morning";
    if (hour < 17) return "Good afternoon";
    return "Good evening";
  }
  if (hour < 5) return "مساء الخير";      // after midnight is still "evening"
  if (hour < 12) return "صباح الخير";
  if (hour < 17) return "مساء النور";
  return "مساء الخير";
}

export default function Greeting({ className = "" }: { className?: string }) {
  const { lang } = useI18n();
  const isEn = lang === "en";
  const [text, setText] = useState(isEn ? "Welcome back" : "مساء الخير");

  useEffect(() => {
    setText(greetingFor(new Date().getHours(), isEn));
  }, [isEn]);

  return (
    <p className={className} suppressHydrationWarning>
      {text} 👋
    </p>
  );
}
