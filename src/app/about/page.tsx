import type { Metadata } from "next";
import Link from "next/link";
import { LogoLink } from "@/components/Logo";
import { brand, pricing, payment } from "@/content/brand";
import { allCourses, courseStats } from "@/content/courses";
import SocialLinks from "@/components/SocialLinks";

export const metadata: Metadata = {
  title: "من إحنا",
  description: `القصة اللي وراء ${brand.name}، وليه اتبنى بالشكل ده.`,
  alternates: { canonical: "/about" },
};

export default function AboutPage() {
  const totalLessons = allCourses.reduce((s, c) => s + courseStats(c).totalLessons, 0);

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
        <h1 className="mb-6 text-2xl font-bold text-neutral-800">من وراء {brand.name}؟</h1>

        <p className="mb-5">
          {brand.name} بدأ من ملاحظة بسيطة: أغلب الناس مش محتاجة كورس تاني تحفظه
          وتسيبه — محتاجة نظام يومي صغير يقدر يكمّله فعلًا. عشان كده كل مسار هنا
          مقسّم ٢٨ يوم × ٥ دقايق، مش ساعات فيديو حد بيحمّسها وميكملهاش.
        </p>

        <p className="mb-5">
          المنصة صغيرة ومتخصصة عمدًا: {allCourses.length} مسارات مكتوبة بالكامل،
          يوم بيوم — {totalLessons} درس عملي، مش عشرين مسار نصهم "قريبًا".
        </p>

        <h2 className="mb-2 mt-8 text-lg font-bold text-neutral-800">اتبنى إزاي</h2>
        <p className="mb-5">
          الموقع اللي إنت فيه دلوقتي اتبنى فعليًا بالذكاء الاصطناعي — من غير
          مبرمج ولا مصمّم منفصل. المسار اللي اتبنى بيه ("ابنِ منصتك") هو نفسه أول
          مسار هتلاقيه جوّه المنصة. مش قصة تسويقية — ده حرفيًا إزاي المنصة دي
          موجودة.
        </p>

        <h2 className="mb-2 mt-8 text-lg font-bold text-neutral-800">القيم اللي بنشتغل بيها</h2>
        <ul className="mb-5 list-disc space-y-1.5 pr-5">
          <li>مفيش أرقام مختلقة — أي رقم على الموقع (عدد المستخدمين، الدروس، أي حاجة) بيتحسب من قاعدة البيانات الحقيقية، مش بيتكتب بالإيد</li>
          <li>مفيش شهادات أو تقييمات وهمية</li>
          <li>مفيش عد تنازلي أو "عرض لفترة محدودة" وهمي — السعر {pricing.priceEgp} جنيه واضح وثابت</li>
          <li>اليوم الأول مجاني فعلًا، من غير بطاقة بنكية ومن غير شروط</li>
        </ul>

        <h2 className="mb-2 mt-8 text-lg font-bold text-neutral-800">كلّمنا</h2>
        <p className="mb-3">
          مفيش خدمة عملاء آلية بترد عليك برسائل جاهزة. لو كلّمتنا، بترد على حد
          فعلي بيشوف الرسالة.
        </p>
        <p className="mb-6">
          واتساب <span dir="ltr" className="font-bold">{payment.supportWhatsapp}</span> ·
          إيميل{" "}
          <a href={`mailto:${payment.supportEmail}`} className="font-bold text-brand-600">
            {payment.supportEmail}
          </a>
        </p>

        <SocialLinks className="mt-8" />
      </main>
    </div>
  );
}
