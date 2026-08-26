"use client";

import { useEffect, useState } from "react";

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

function greetingFor(hour: number) {
  if (hour < 5) return "مساء الخير";      // after midnight is still "evening"
  if (hour < 12) return "صباح الخير";
  if (hour < 17) return "مساء النور";
  return "مساء الخير";
}

export default function Greeting({ className = "" }: { className?: string }) {
  const [text, setText] = useState("مساء الخير");

  useEffect(() => {
    setText(greetingFor(new Date().getHours()));
  }, []);

  return (
    <p className={className} suppressHydrationWarning>
      {text} 👋
    </p>
  );
}
