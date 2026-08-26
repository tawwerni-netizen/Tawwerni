/** Fetches the link-preview card and saves it so it can be eyeballed. */
import { writeFileSync } from "fs";

const BASE = process.argv[2] ?? "http://localhost:3000";

(async () => {
  const html = await (await fetch(BASE)).text();

  const tags = html.match(/<meta (?:property|name)="(?:og|twitter):[^>]*>/g) ?? [];
  console.log(`وسوم المشاركة: ${tags.length}`);
  for (const t of tags) console.log("  " + t.replace(/<meta |\/>/g, "").trim().slice(0, 130));

  const m = html.match(/og:image"\s+content="([^"]+)"/);
  if (!m) {
    console.log("\n✗ مفيش og:image");
    process.exit(1);
  }

  const res = await fetch(m[1]);
  const buf = Buffer.from(await res.arrayBuffer());
  const out = "og-preview.png";
  writeFileSync(out, buf);

  console.log(`\nالصورة: ${res.status} · ${res.headers.get("content-type")} · ${Math.round(buf.length / 1024)} KB`);
  console.log(`اتحفظت: ${out}`);

  // WhatsApp refuses to render previews over roughly 300KB.
  if (buf.length > 300_000) console.log("⚠️  أكبر من 300KB — واتساب ممكن ما يعرضهاش");
  else console.log("✓ الحجم مناسب لواتساب");
})();
