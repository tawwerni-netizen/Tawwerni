import { readFileSync, writeFileSync } from "node:fs";
const f = "src/lib/email-templates.ts";
let s = readFileSync(f, "utf8");

const from = `      <p style="margin:0;font-size:11px;color:#9ca3af;">
        وصلتك الرسالة دي لأن عندك حساب على \${brand.name}. دي رسالة خدمة عن حسابك.
      </p>`;

// Text links, not icon images: an <img> in an email is blocked by default in
// Gmail and Outlook, so an icon row arrives as four broken boxes.
const to = `      <p style="margin:0 0 8px;font-size:12px;color:\${MUTED};">
        \${social.map((s) => \`<a href="\${s.url}" style="color:\${TEAL};text-decoration:none;">\${s.label}</a>\`).join(' &nbsp;·&nbsp; ')}
      </p>
      <p style="margin:0;font-size:11px;color:#9ca3af;">
        وصلتك الرسالة دي لأن عندك حساب على \${brand.name}. دي رسالة خدمة عن حسابك.
      </p>`;

if (!s.includes(from)) { console.log("⚠ مش لاقي الفوتر"); process.exit(1); }
s = s.replace(from, to);

s = s.replace(/import \{ brand, ([^}]*)\} from "@\/content\/brand";/, (m, rest) =>
  rest.includes("social") ? m : `import { brand, ${rest.trim()}, social } from "@/content/brand";`);

writeFileSync(f, s, "utf8");
console.log("✓ الفوتر اتحدّث");
