/** Counts FAQ questions per category and flags duplicates or thin answers. */
import { faqCategories } from "../src/content/faq";

let total = 0;
for (const c of faqCategories) {
  console.log(`${String(c.items.length).padStart(3)}  ${c.icon}  ${c.title}`);
  total += c.items.length;
}

console.log("─".repeat(40));
console.log(`المجموع: ${total} سؤال في ${faqCategories.length} قسم`);

const seen = new Map<string, string>();
let dupes = 0;
let thin = 0;

for (const c of faqCategories) {
  for (const item of c.items) {
    const key = item.q.trim();
    if (seen.has(key)) {
      dupes++;
      console.log(`  ✗ مكرر: "${key}" في ${c.title} و ${seen.get(key)}`);
    }
    seen.set(key, c.title);

    if (item.a.trim().length < 40) {
      thin++;
      console.log(`  ✗ إجابة قصيرة أوي: "${key}"`);
    }
    if (!item.q.trim()) console.log(`  ✗ سؤال فاضي في ${c.title}`);
  }
}

const keys = faqCategories.map((c) => c.key);
const dupKeys = keys.filter((k, i) => keys.indexOf(k) !== i);
if (dupKeys.length) console.log(`  ✗ مفاتيح أقسام مكررة: ${dupKeys.join(", ")}`);

console.log(dupes || thin || dupKeys.length ? "\nفيه مشاكل ☝️" : "\nنضيف ✓");
process.exit(dupes || thin || dupKeys.length ? 1 : 0);
