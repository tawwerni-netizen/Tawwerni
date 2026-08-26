import { faqCategories } from "@/content/faq";

/**
 * Opening the help centre from anywhere.
 *
 * A browser event rather than shared React state: the panel lives in the app
 * layout and the things that open it are scattered across pages, so wiring a
 * context through every one of them would cost more than it's worth. Anything
 * can now ask for the panel — including a link inside a lesson.
 */
export const HELP_OPEN_EVENT = "tawwerni:help-open";

export type HelpOpenDetail = { query?: string; category?: string };

export function openHelpCentre(detail: HelpOpenDetail = {}) {
  if (typeof window === "undefined") return;
  window.dispatchEvent(new CustomEvent<HelpOpenDetail>(HELP_OPEN_EVENT, { detail }));
}

/** Total questions across every category — used in the copy so it can't drift. */
export function faqCount(): number {
  return faqCategories.reduce((sum, c) => sum + c.items.length, 0);
}

/** Rounded down to a tidy number, for marketing lines. */
export function faqCountRounded(): number {
  return Math.floor(faqCount() / 10) * 10;
}
