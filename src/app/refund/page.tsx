import type { Metadata } from "next";
import Link from "next/link";
import { LogoLink } from "@/components/Logo";
import { brand, pricing, payment } from "@/content/brand";

export const metadata: Metadata = {
  title: "سياسة الاسترجاع",
  description: "ليه المنصة مبتدّيش استرجاع فلوس، والبديل اللي بيغنيك عنه.",
  alternates: { canonical: "/refund" },
};

export default function RefundPage() {
  return (
    <div className="min-h-screen bg-neutral-50">
      <header className="sticky top-0 z-40 app-header">
        <div className="mx-auto flex h-14 max-w-2xl items-center justify-between px-5">
          <LogoLink size={32} href="/" />
          <Link href="/" className="tap px-2 py-2 text-xs text-neutral-500">
            الرئيسية
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-2xl px-5 py-10 text-sm leading-relaxed text-neutral-700">
        <h1 className="mb-2 text-2xl font-bold text-neutral-800">سياسة الاسترجاع</h1>
        <p className="mb-8 text-xs text-neutral-400">آخر تحديث: سبتمبر 2026</p>

        <div className="mb-8 rounded-2xl border border-amber-200 bg-amber-50 p-4">
          <p className="font-bold text-amber-900">مفيش استرجاع فلوس بعد الدفع.</p>
          <p className="mt-1 text-amber-800">
            وده مكتوب هنا بوضوح تام، من غير لف ودوران — عشان تقرر وانت عارف.
          </p>
        </div>

        <h2 className="mb-2 mt-8 text-lg font-bold text-neutral-800">ليه بالظبط؟</h2>
        <p className="mb-6">
          محتوى المنصة رقمي بالكامل، وبيتفتح كامل فور ما التفعيل يتم — مفيش جزء
          فيه بيتقفل بعد كده تقدر ترجعه. عشان كده مش منطقي نوعد باسترجاع على
          حاجة اتفتحت بالكامل من أول لحظة.
        </p>

        <h2 className="mb-2 mt-8 text-lg font-bold text-neutral-800">البديل: جرّب قبل ما تدفع</h2>
        <p className="mb-6">
          بدل ما نوعدك باسترجاع بعد الدفع، بنخليك تجرّب <b>قبله</b>. اليوم الأول
          من كل مسار مفتوح مجانًا لأي حساب — درس كامل، بمهمته وكويزه، من غير ما
          تدفع مليم. لو المحتوى مش عاجبك، متدفعش خالص. القرار في إيدك من الأول.
        </p>

        <h2 className="mb-2 mt-8 text-lg font-bold text-neutral-800">لو حوّلت غلط</h2>
        <p className="mb-6">
          ده موضوع مختلف عن الاسترجاع — لو حوّلت لرقم غلط، أو المبلغ مش مطابق، أو
          حصل أي لبس في التحويل نفسه، كلّمنا فورًا على واتساب{" "}
          <span dir="ltr" className="font-bold">{payment.supportWhatsapp}</span> وهنشوف
          الموضوع معاك.
        </p>

        <h2 className="mb-2 mt-8 text-lg font-bold text-neutral-800">للتوضيح</h2>
        <ul className="mb-6 list-disc space-y-1.5 pr-5">
          <li>السعر {pricing.priceEgp} جنيه دفعة واحدة، مش اشتراك بيتجدد — فمفيش "إلغاء اشتراك" أصلًا</li>
          <li>وصولك بعد الدفع مدى الحياة، بما فيه أي مسار جديد ننزّله بعد كده</li>
          <li>مفيش رسوم إضافية أو خفية بعد الدفعة الأولى تحت أي ظرف</li>
        </ul>

        <p className="mt-10 rounded-2xl bg-white p-4 text-xs text-neutral-500">
          عندك موقف مختلف عن اللي فوق؟ كلّمنا على واتساب{" "}
          <span dir="ltr" className="font-bold">{payment.supportWhatsapp}</span> أو
          إيميل{" "}
          <a href={`mailto:${payment.supportEmail}`} className="font-bold text-brand-600">
            {payment.supportEmail}
          </a>
          . بنقرا كل رسالة.
        </p>
      </main>
    </div>
  );
}
