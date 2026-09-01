/**
 * Arabic cardinal-number/noun agreement.
 *
 * The rule that keeps getting missed: 3–10 takes the *plural* noun ("٩
 * مسارات"), but 11 and up takes the *singular* ("١٥ مسار", not "١٥ مسارات")
 * — true even for compounds like 23 or 241, not just round numbers. Every
 * "X مسارات" in this codebase was hardcoded against a catalogue that used to
 * sit at 6, then 9 courses, both inside the plural range — so the bug never
 * showed until the catalogue crossed into 11+. Same rule applies to any
 * counted noun, not just tracks; a lesson count only needs this if it can
 * ever land in the 3–10 range (course-level totals are always well past 10,
 * so "دروس" hasn't needed the same fix — yet).
 */
export function coursesWord(n: number): string {
  return n >= 3 && n <= 10 ? "مسارات" : "مسار";
}
