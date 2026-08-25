import { writeFileSync, mkdirSync } from "fs";
import { otpEmail, orderReceivedEmail, courseActivatedEmail } from "../src/lib/email-templates";

const out = "email-preview";
mkdirSync(out, { recursive: true });

const samples = [
  ["otp", otpEmail("623402")],
  ["order-received", orderReceivedEmail({ name: "أحمد محمد", courseTitle: "تحدي الذكاء الاصطناعي - 28 يوم", method: "vodafone_cash" })],
  ["activated", courseActivatedEmail({ name: "أحمد محمد", courseTitle: "تحدي الذكاء الاصطناعي - 28 يوم", courseSlug: "tahaddi-28-yawm", amountEgp: 200 })],
] as const;

for (const [name, tpl] of samples) {
  writeFileSync(`${out}/${name}.html`, tpl.html, "utf8");
  console.log(`${name.padEnd(16)} | ${tpl.subject}`);
  console.log(`   نص بديل: ${tpl.text.split("\n")[0]}`);
}
console.log(`\nملفات المعاينة في: ${out}/`);
