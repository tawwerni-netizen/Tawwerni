/** Confirms JSON-LD output can't break out of its script tag. */
import { ldJson } from "../src/lib/ld-json";

const hostile = {
  q: "</script><img src=x onerror=alert(1)>",
  a: "a < b and c > d",
};

const out = ldJson(hostile);

console.log(out);
console.log("─".repeat(40));

const checks: [string, boolean][] = [
  ["مفيش </script>", !out.includes("</script>")],
  ["مفيش < خام", !out.includes("<")],
  ["مفيش > خام", !out.includes(">")],
  [
    "لسه JSON صالح",
    (() => {
      try {
        JSON.parse(out);
        return true;
      } catch {
        return false;
      }
    })(),
  ],
  [
    "المحتوى بيرجع زي ما هو",
    (() => {
      try {
        return JSON.parse(out).q === hostile.q;
      } catch {
        return false;
      }
    })(),
  ],
];

let bad = 0;
for (const [name, ok] of checks) {
  console.log(`  ${ok ? "✓" : "✗"} ${name}`);
  if (!ok) bad++;
}

console.log(bad ? "\nفيه مشاكل ☝️" : "\nنضيف ✓");
process.exit(bad ? 1 : 0);
