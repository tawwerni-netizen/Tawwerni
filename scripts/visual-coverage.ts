/**
 * How many real lesson cards get a graphic, and which kind.
 *
 * The complaint was that lessons read as walls of text. This measures it
 * against the actual content instead of guessing.
 */
import { allCourses } from "../src/content/courses";
import { pickVisual } from "../src/components/CardVisual";

const counts = new Map<string, number>();
let total = 0;
const samples = new Map<string, string>();

for (const course of allCourses) {
  for (const module of course.modules) {
    for (const lesson of module.lessons) {
      for (const card of lesson.cards) {
        total++;
        const v = pickVisual(card.heading, card.lines);
        counts.set(v.kind, (counts.get(v.kind) ?? 0) + 1);
        if (!samples.has(v.kind)) samples.set(v.kind, card.heading);
      }
    }
  }
}

const plain = counts.get("none") ?? 0;
console.log(`بطاقات المحتوى: ${total}`);
console.log("─".repeat(46));

for (const [kind, n] of [...counts].sort((a, b) => b[1] - a[1])) {
  const pct = ((n / total) * 100).toFixed(1).padStart(5);
  console.log(`${pct}%  ${String(n).padStart(4)}  ${kind.padEnd(10)} مثال: ${samples.get(kind)}`);
}

console.log("─".repeat(46));
console.log(`فيها رسم: ${(((total - plain) / total) * 100).toFixed(1)}%  ·  نص فقط: ${plain}`);
