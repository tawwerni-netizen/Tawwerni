import type { Metadata } from "next";
import Link from "next/link";
import { LogoLink } from "@/components/Logo";
import { brand, payment } from "@/content/brand";

export const metadata: Metadata = {
  title: "سياسة الخصوصية",
  description: `إيه البيانات اللي ${brand.name} بيجمعها، ليه، وإزاي بنحميها.`,
  alternates: { canonical: "/privacy" },
};

export default function PrivacyPage() {
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
        <h1 className="mb-2 text-2xl font-bold text-neutral-800">سياسة الخصوصية</h1>
        <p className="mb-8 text-xs text-neutral-400">آخر تحديث: سبتمبر 2026</p>

        <p className="mb-6">
          الصفحة دي بتشرح بوضوح إيه البيانات اللي {brand.name} بيجمعها منك، ليه،
          وإزاي بنستخدمها. مفيش لغة قانونية معقّدة — الهدف إنك تفهم بالظبط اللي بيحصل.
        </p>

        <h2 className="mb-2 mt-8 text-lg font-bold text-neutral-800">البيانات اللي بنجمعها</h2>
        <ul className="mb-6 list-disc space-y-1.5 pr-5">
          <li>الاسم والإيميل ورقم الموبايل — لما تعمل حساب</li>
          <li>كلمة السر — متخزنة مشفّرة باتجاه واحد (scrypt)، مستحيل ترجع نص واضح حتى لينا</li>
          <li>رقم الموبايل اللي هتحوّل منه، أو اسمك على إنستاباي — عشان نطابق تحويلك أوتوماتيك</li>
          <li>إجابات الكويز التعريفي، وتقدّمك في الدروس (نقاط الكويز، الشارات، الأيام اللي خلّصتها)</li>
          <li>أي رسالة تبعتها لمساعد "{brand.coachName}" داخل المنصة</li>
        </ul>

        <p className="mb-6">
          <b>مبنجمعش بيانات بطاقات بنكية أبدًا.</b> الدفع بيتم بتحويل مباشر من
          محفظتك (فودافون كاش أو إنستاباي)، وإثبات التحويل بتبعته لينا يدويًا على
          واتساب أو إيميل — مش عن طريق فورم على الموقع. مفيش حقل بطاقة في المنصة
          أصلًا.
        </p>

        <h2 className="mb-2 mt-8 text-lg font-bold text-neutral-800">إزاي بنستخدم البيانات دي</h2>
        <ul className="mb-6 list-disc space-y-1.5 pr-5">
          <li>تشغيل حسابك وتسجيل دخولك</li>
          <li>مطابقة تحويلك المالي بطلبك وتفعيل وصولك للمسارات</li>
          <li>تتبّع تقدّمك (XP، الشارات، الشهادات) وعرضه لك</li>
          <li>إرسال إيميلات ضرورية: أهلًا بيك، إيصال الطلب، تفعيل الاشتراك، تنبيهات الأمان</li>
          <li>الرد على استفساراتك لما تكلّمنا على واتساب أو إيميل</li>
        </ul>

        <h2 className="mb-2 mt-8 text-lg font-bold text-neutral-800">مين بيشوف بياناتك</h2>
        <p className="mb-4">
          بنستخدم خدمات خارجية محدودة تساعدنا نشغّل المنصة وندفعها للناس المهتمة:
        </p>
        <ul className="mb-6 list-disc space-y-1.5 pr-5">
          <li>
            <b>Google Analytics و Meta Pixel</b> — بيقيسوا زيارات الموقع وأحداث زي
            بداية الكويز أو إتمام الشراء، عشان نفهم أداء الموقع والإعلانات. البيانات
            دي مش بتشمل اسمك أو إيميلك.
          </li>
          <li>
            <b>خدمة إرسال الإيميلات</b> (Hostinger SMTP أو Resend) — بترسل الإيميلات
            اللي المنصة بتبعتهالك.
          </li>
          <li>
            لو استخدمت شات "{brand.coachName}"، رسالتك بتتبعت لـ Anthropic (شركة
            الذكاء الاصطناعي Claude) عشان يرد عليك.
          </li>
        </ul>
        <p className="mb-6">
          مبنبيعش ولا بنأجّر بياناتك لأي حد. مفيش طرف تالت بيشوف بياناتك غير
          الخدمات دي، وبس عشان يشغّلوا الوظيفة اللي المفروض يعملوها.
        </p>

        <h2 className="mb-2 mt-8 text-lg font-bold text-neutral-800">الكوكيز</h2>
        <p className="mb-6">
          بنستخدم كوكي واحدة أساسية لتسجيل دخولك (مشفّرة، ومحمية بحيث المتصفح بس
          يقدر يقراها)، وكوكي بسيطة لتتبّع لينك الإحالة لو دخلت بلينك صاحبك. Google
          وMeta بيحطوا كوكيز التتبّع بتاعتهم بعد موافقتك الضمنية على الاستخدام.
        </p>

        <h2 className="mb-2 mt-8 text-lg font-bold text-neutral-800">حقوقك</h2>
        <p className="mb-6">
          تقدر تطلب منّا في أي وقت: نبعتلك نسخة من بياناتك، نصحّح بيانات غلط، أو
          نمسح حسابك بالكامل. ابعتلنا الطلب على{" "}
          <a href={`mailto:${payment.supportEmail}`} className="font-bold text-brand-600">
            {payment.supportEmail}
          </a>{" "}
          من نفس إيميل حسابك، وهنتعامل معاه خلال أيام قليلة.
        </p>

        <h2 className="mb-2 mt-8 text-lg font-bold text-neutral-800">الأطفال</h2>
        <p className="mb-6">
          المنصة مش موجّهة لأطفال تحت 16 سنة، ومبنجمعش بيانات عن قصد من حد في
          السن ده.
        </p>

        <h2 className="mb-2 mt-8 text-lg font-bold text-neutral-800">تحديث السياسة</h2>
        <p className="mb-6">
          لو غيّرنا حاجة جوهرية في السياسة دي، هنحدّث التاريخ فوق الصفحة. الاستمرار
          في استخدام المنصة بعد التحديث معناه موافقتك على النسخة الجديدة.
        </p>

        <p className="mt-10 rounded-2xl bg-white p-4 text-xs text-neutral-500">
          عندك سؤال عن بياناتك؟ كلّمنا على واتساب{" "}
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
