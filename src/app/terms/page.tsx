import type { Metadata } from "next";
import Link from "next/link";
import { LogoLink } from "@/components/Logo";
import { brand, pricing, payment } from "@/content/brand";

export const metadata: Metadata = {
  title: "الشروط والأحكام",
  description: `شروط استخدام ${brand.name} — قبل ما تشترك، اعرف بالظبط اللي بتوافق عليه.`,
  alternates: { canonical: "/terms" },
};

export default function TermsPage() {
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
        <h1 className="mb-2 text-2xl font-bold text-neutral-800">الشروط والأحكام</h1>
        <p className="mb-8 text-xs text-neutral-400">آخر تحديث: سبتمبر 2026</p>

        <p className="mb-6">
          استخدامك لـ{brand.name} معناه موافقتك على الشروط دي. اتكتبت بوضوح عشان
          تعرف بالظبط اللي بتوافق عليه، مش عشان تكون عائق.
        </p>

        <h2 className="mb-2 mt-8 text-lg font-bold text-neutral-800">١. إيه اللي بتشتريه</h2>
        <p className="mb-6">
          دفعة واحدة {pricing.priceEgp} جنيه بتفتحلك وصول مدى الحياة لكل مسارات
          المنصة، بما فيها أي مسار جديد ننزّله بعد كده. مش اشتراك شهري، ومفيش
          تجديد تلقائي ومفيش رسوم خفية. اليوم الأول من كل مسار مفتوح مجانًا لأي
          حساب قبل ما تدفع.
        </p>

        <h2 className="mb-2 mt-8 text-lg font-bold text-neutral-800">٢. حسابك</h2>
        <ul className="mb-6 list-disc space-y-1.5 pr-5">
          <li>الحساب شخصي — بياناتك اللي بتدخل بيها لازم تكون حقيقية</li>
          <li>انت مسؤول عن سرّية كلمة السر بتاعتك</li>
          <li>حساب واحد للشخص الواحد. حسابات مكررة أو وهمية بنقفلها من غير إشعار مسبق</li>
        </ul>

        <h2 className="mb-2 mt-8 text-lg font-bold text-neutral-800">٣. المحتوى</h2>
        <p className="mb-6">
          كل محتوى المسارات — الدروس والمهام والكويزات — ملك {brand.name}. وصولك
          ليه شخصي لاستخدامك انت بس. مش مسموح تنسخه أو تعيد بيعه أو توزّعه لحد
          تاني، سواء مجانًا أو بمقابل.
        </p>

        <h2 className="mb-2 mt-8 text-lg font-bold text-neutral-800">٤. الإحالة والمكافآت</h2>
        <p className="mb-6">
          نظام الإحالة بيدّيك {" "}
          <b>عمولة حقيقية عن كل حد يشترك فعليًا بلينكك</b>. أي محاولة تلاعب —
          إحالة نفسك بحساب تاني، حسابات وهمية، أو تحويلات مصطنعة — بتلغي المكافأة
          المرتبطة بيها، وممكن تقفل الحساب.
        </p>

        <h2 className="mb-2 mt-8 text-lg font-bold text-neutral-800">٥. مسار الصحة والطاقة</h2>
        <p className="mb-6">
          مسار "الصحة والطاقة" محتوى تثقيفي عام عن النوم والحركة والطاقة اليومية.
          مش بديل عن استشارة طبيب، ومش بيقدّم تشخيص أو علاج أو نصيحة طبية شخصية.
          لو عندك حالة صحية، ارجع لطبيبك.
        </p>

        <h2 className="mb-2 mt-8 text-lg font-bold text-neutral-800">٦. الدفع والاسترجاع</h2>
        <p className="mb-6">
          تفاصيل الدفع والاسترجاع مذكورة بالكامل في{" "}
          <Link href="/refund" className="font-bold text-brand-600">
            سياسة الاسترجاع
          </Link>
          .
        </p>

        <h2 className="mb-2 mt-8 text-lg font-bold text-neutral-800">٧. حدود المسؤولية</h2>
        <p className="mb-6">
          بنبذل جهدنا إن المحتوى يكون دقيق ومفيد، بس نتايجك الفعلية بتعتمد على
          مجهودك في التطبيق. المنصة بتقدّم أدوات وخطة، مش وعد بنتيجة مالية أو
          مهنية محددة.
        </p>

        <h2 className="mb-2 mt-8 text-lg font-bold text-neutral-800">٨. تعديل الشروط</h2>
        <p className="mb-6">
          ممكن نحدّث الشروط دي مع نمو المنصة. أي تعديل جوهري هنحدّث تاريخه فوق
          الصفحة، واستمرارك في الاستخدام معناه موافقتك.
        </p>

        <p className="mt-10 rounded-2xl bg-white p-4 text-xs text-neutral-500">
          عندك سؤال عن الشروط دي؟ كلّمنا على واتساب{" "}
          <span dir="ltr" className="font-bold">{payment.supportWhatsapp}</span> أو
          إيميل{" "}
          <a href={`mailto:${payment.supportEmail}`} className="font-bold text-brand-600">
            {payment.supportEmail}
          </a>
          .
        </p>
      </main>
    </div>
  );
}
