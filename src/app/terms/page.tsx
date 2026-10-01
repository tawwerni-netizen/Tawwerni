"use client";

import Link from "next/link";
import { LogoLink } from "@/components/Logo";
import { brand, pricing, payment } from "@/content/brand";
import { useI18n } from "@/components/LanguageContext";
import LanguageToggle from "@/components/LanguageToggle";
import ThemeToggle from "@/components/ThemeToggle";

export default function TermsPage() {
  const { lang } = useI18n();
  const isEn = lang === "en";

  return (
    <div
      dir={isEn ? "ltr" : "rtl"}
      className="min-h-screen bg-neutral-50 dark:bg-neutral-950 text-neutral-800 dark:text-neutral-200 transition-colors"
    >
      <header className="sticky top-0 z-40 border-b border-black/5 dark:border-white/10 bg-white/80 dark:bg-neutral-950/80 backdrop-blur-md transition-colors">
        <div className="mx-auto flex h-14 max-w-2xl items-center justify-between px-5">
          <LogoLink size={32} href="/" />
          <div className="flex items-center gap-2">
            <LanguageToggle />
            <ThemeToggle />
            <Link
              href="/"
              className="tap px-2 py-1 text-xs font-semibold text-neutral-500 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white transition-colors"
            >
              {isEn ? "Home" : "الرئيسية"}
            </Link>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-2xl px-5 py-10 text-sm leading-relaxed">
        <h1 className="mb-2 text-2xl sm:text-3xl font-black text-neutral-900 dark:text-white">
          {isEn ? "Application Terms of Service" : "شروط وأحكام استخدام المنصة"}
        </h1>
        <p className="mb-6 text-xs text-neutral-400">
          {isEn ? "Last updated: October 2026" : "آخر تحديث: أكتوبر 2026"}
        </p>

        <p className="mb-6 text-neutral-700 dark:text-neutral-300">
          {isEn
            ? `Welcome to ${brand.nameEn} (${brand.domain}). By creating an account, accessing, or using our web application and educational services, you agree to be bound by these Application Terms of Service and our Privacy Policy. If you do not agree to these terms, please do not use the application.`
            : `أهلاً بك في منصة "${brand.name}" (${brand.domain}). بمجرد إنشاء حساب أو استخدام المنصة أو الاستفادة من الخدمات التعليمية، فإنك توافق على الالتزام بشروط وأحكام الاستخدام هذه وبسياسة الخصوصية الخاصة بنا. إذا كنت لا توافق على هذه الشروط، يرجى التوقف عن استخدام المنصة.`}
        </p>

        <div className="space-y-6">
          {/* Section 1 */}
          <section>
            <h2 className="mb-2 text-lg font-bold text-neutral-900 dark:text-white">
              {isEn ? "1. Description of Services" : "1. وصف الخدمات"}
            </h2>
            <p className="text-neutral-700 dark:text-neutral-300">
              {isEn
                ? `${brand.nameEn} provides an interactive online learning platform featuring 100+ practical educational tracks, daily micro-lessons, hands-on projects, digital badges, and verified completion certificates across technology, AI, self-development, and business disciplines.`
                : `تقدم منصة "${brand.name}" بيئة تعليمية تفاعلية تشمل أكثر من 100 مسار عملي متخصص، ودروساً تطبيقية يومية قصيرة، وأدوات تركيز، واختبارات قياس مستوى، وشهادات إتمام معتمدة قابلة للتحقق في مجالات الذكاء الاصطناعي والتكنولوجيا وتطوير المهارات.`}
            </p>
          </section>

          {/* Section 2 */}
          <section>
            <h2 className="mb-2 text-lg font-bold text-neutral-900 dark:text-white">
              {isEn ? "2. User Registration & Google Authentication" : "2. إنشاء الحساب وتسجيل الدخول عبر جوجل"}
            </h2>
            <p className="text-neutral-700 dark:text-neutral-300 mb-2">
              {isEn
                ? "To access personalized learning features, track progress, and obtain certificates, you must create a user account:"
                : "للوصول إلى الميزات التعليمية وتتبع تقدمك وإصدار الشهادات، يتعين عليك إنشاء حساب شخصي:"}
            </p>
            <ul className="list-disc ps-5 space-y-1.5 text-neutral-700 dark:text-neutral-300">
              <li>
                {isEn
                  ? "Authentication via Google: You may sign up and log in using your Google account via Google OAuth. You authorize us to receive your verified email and full name from Google to create and maintain your account."
                  : "تسجيل الدخول عبر جوجل: يمكنك إنشاء الحساب وتسجيل الدخول باستخدام حساب جوجل (Google OAuth). وبذلك تفوضنا باستلام اسمك وبريدك الإلكتروني المعتمدين من جوجل لإنشاء وإدارة حسابك التعليمي."}
              </li>
              <li>
                {isEn
                  ? "Account Integrity: Each account is personal and strictly non-transferable. You are responsible for maintaining the security of your credentials and all activity conducted through your account."
                  : "نزاهة الحساب: الحساب شخصي وغير قابل للتنازل أو المشاركة مع أطراف أخرى. وتقع على عاتقك مسؤولية الحفاظ على سرية بياناتك وجميع الأنشطة التي تتم من خلال حسابك."}
              </li>
              <li>
                {isEn
                  ? "Authentic Information: You agree to provide accurate and truthful details. Duplicate, misleading, or bot-generated accounts are subject to immediate termination."
                  : "صحة البيانات: تلتزم بتقديم بيانات صحيحة ومطابقة للواقع. الحسابات الوهمية أو المكررة أو المنشأة بطرق احتيالية سيتم إيقافها فوراً."}
              </li>
            </ul>
          </section>

          {/* Section 3 */}
          <section>
            <h2 className="mb-2 text-lg font-bold text-neutral-900 dark:text-white">
              {isEn ? "3. Membership, Fees, and 14-Day Guarantee" : "3. الاشتراكات، الرسوم، وضمان الاسترداد"}
            </h2>
            <ul className="list-disc ps-5 space-y-1.5 text-neutral-700 dark:text-neutral-300">
              <li>
                {isEn
                  ? `Access Model: Premium access is granted via a transparent, one-time payment of ${pricing.priceEgp} EGP (or equivalent in supported currencies) for 1 full year of unlimited access to all 100 tracks. No automatic recurring rebills or hidden surcharges.`
                  : `آلية الاشتراك: يتم تفعيل الوصول الشامل لجميع الـ 100 مسار عبر دفعة واحدة واضحة بقيمة ${pricing.priceEgp} جنيه مصري (أو ما يعادلها) لمدة عام كامل. لا توجد أي اشتراكات دورية خفية أو تجديد تلقائي للبطاقات.`}
              </li>
              <li>
                {isEn
                  ? "Free Trial Period: The first day of every single track is 100% free for all registered users to test the learning experience before making any financial commitment."
                  : "التجربة المجانية: اليوم الأول من كل مسار متاح مجاناً بنسبة 100% لجميع المسجلين لتجربة جودة المحتوى وطريقة الشرح قبل الدفع."}
              </li>
              <li>
                {isEn
                  ? "14-Day Money-Back Guarantee: If you are unsatisfied with the platform, you may request a 100% full refund within 14 calendar days from the date of payment by contacting support directly."
                  : "ضمان استرداد الأموال: نتيح ضمان استرداد كامل للمبلغ بنسبة 100% خلال 14 يوماً من تاريخ الاشتراك في حال عدم رضاك، دون تعقيدات، بالتواصل المباشر مع الدعم الفني."}
              </li>
            </ul>
          </section>

          {/* Section 4 */}
          <section>
            <h2 className="mb-2 text-lg font-bold text-neutral-900 dark:text-white">
              {isEn ? "4. Acceptable Use & Prohibited Conduct" : "4. شروط الاستخدام المقبول والمحظورات"}
            </h2>
            <p className="text-neutral-700 dark:text-neutral-300 mb-2">
              {isEn
                ? "When using our platform, you strictly agree NOT to:"
                : "أثناء استخدامك للمنصة، تلتزم بشكل صارم بعدم القيام بأي مما يلي:"}
            </p>
            <ul className="list-disc ps-5 space-y-1 text-neutral-700 dark:text-neutral-300">
              <li>
                {isEn
                  ? "Scrape, harvest, copy, redistribute, republish, or commercially resell any course material, curricula, code examples, or infographics."
                  : "نسخ، أو سحب (Scraping)، أو إعادة نشر، أو بيع وتوزيع أي من محتويات الكورسات، أو الدروس، أو الرسوم التوضيحية تجارياً."}
              </li>
              <li>
                {isEn
                  ? "Attempt unauthorized access, reverse-engineer platform endpoints, bypass security controls, or interfere with system performance."
                  : "محاولة اختراق خوادم المنصة، أو الهندسة العكسية، أو تخطي أنظمة الأمان والتحقق من الاشتراكات."}
              </li>
              <li>
                {isEn
                  ? "Use automated scripts, bots, or deceptive practices to manipulate XP points, streaks, badges, or affiliate referral commissions."
                  : "استخدام برامج روبوتية (Bots) أو تلاعب برمجي لتزييف نقاط الخبرة (XP)، أو أيام الالتزام، أو عمولات نظام الإحالة (Affiliate)."}
              </li>
            </ul>
          </section>

          {/* Section 5 */}
          <section>
            <h2 className="mb-2 text-lg font-bold text-neutral-900 dark:text-white">
              {isEn ? "5. Intellectual Property Rights" : "5. حقوق الملكية الفكرية"}
            </h2>
            <p className="text-neutral-700 dark:text-neutral-300">
              {isEn
                ? `All intellectual property rights, trademarks, software code, visual brand assets, and educational course materials available on ${brand.nameEn} are the sole and exclusive property of ${brand.nameEn} and its creators. Access is granted as a limited, personal, revocable, and non-exclusive educational license.`
                : `جميع حقوق الملكية الفكرية، والعلامات التجارية، والمصنفات الرقمية، والتصميمات، والنصوص، والشفرات البرمجية المنشورة على منصة "${brand.name}" مملوكة حصرياً لإدارة المنصة ومؤسسيها. يُمنح المستخدم ترخيصاً شخصياً ومحدوداً للاستفادة التعليمية فقط.`}
            </p>
          </section>

          {/* Section 6 */}
          <section>
            <h2 className="mb-2 text-lg font-bold text-neutral-900 dark:text-white">
              {isEn ? "6. Privacy & Data Handling" : "6. الخصوصية والتعامل مع البيانات"}
            </h2>
            <p className="text-neutral-700 dark:text-neutral-300">
              {isEn
                ? "Your privacy and the security of your Google account data are paramount. Our data collection, usage, and deletion procedures are governed by our "
                : "خصوصيتك وحماية بياناتك المرتبطة بحساب جوجل تأتي على رأس أولوياتنا. تخضع جميع عمليات جمع ومعالجة وحذف البيانات إلى "}
              <Link href="/privacy" className="text-teal-600 dark:text-teal-400 font-bold hover:underline">
                {isEn ? "Privacy Policy" : "سياسة الخصوصية"}
              </Link>
              {isEn
                ? ", which is incorporated into these terms by reference."
                : "، والتي تعد جزءاً لا يتجزأ من هذه الشروط."}
            </p>
          </section>

          {/* Section 7 */}
          <section>
            <h2 className="mb-2 text-lg font-bold text-neutral-900 dark:text-white">
              {isEn ? "7. Disclaimers & Limitation of Liability" : "7. إخلاء المسؤولية وحدودها"}
            </h2>
            <p className="text-neutral-700 dark:text-neutral-300">
              {isEn
                ? `${brand.nameEn} provides educational content and practical skills training 'as is'. While our curriculum is designed around industry-standard practical workflows, we do not guarantee specific income levels, job placements, or business results. Under no circumstances shall ${brand.nameEn} be liable for indirect, incidental, or consequential damages resulting from platform usage.`
                : `تقدم منصة "${brand.name}" محتواها التعليمي وفق أفضل الممارسات التطبيقية، إلا أنها لا تقدم أي وعود أو ضمانات لأرباح مالية محددة أو وظائف مستقبلية مؤكدة لكون النتائج تعتمد على الجهد الفردي والتطبيق العملي لكل متدرب. المنصة غير مسؤولة عن أي خسائر غير مباشرة ناتجة عن استخدام أو عدم القدرة على استخدام خدماتها.`}
            </p>
          </section>

          {/* Section 8 */}
          <section>
            <h2 className="mb-2 text-lg font-bold text-neutral-900 dark:text-white">
              {isEn ? "8. Account Suspension and Termination" : "8. إنهاء الحسابات والتعليق"}
            </h2>
            <p className="text-neutral-700 dark:text-neutral-300">
              {isEn
                ? "We reserve the right to suspend or terminate accounts that breach these terms, engage in copyright infringement, or commit fraud, without prior notice. Users may also voluntarily request account closure and data deletion at any time."
                : "تحتفظ إدارة المنصة بالحق في تعليق أو إغلاق أي حساب يثبت انتهاكه لهذه الشروط أو انتهاك حقوق النشر أو ممارسة أي احتيال، دون أي إشعار مسبق. كما يحق للمستخدم طلب إغلاق حسابه وحذف بياناته في أي وقت."}
            </p>
          </section>

          {/* Section 9 */}
          <section>
            <h2 className="mb-2 text-lg font-bold text-neutral-900 dark:text-white">
              {isEn ? "9. Contact and Inquiries" : "9. التواصل والاستفسارات"}
            </h2>
            <p className="text-neutral-700 dark:text-neutral-300">
              {isEn
                ? "If you have questions regarding these Application Terms of Service or require customer support, contact us directly:"
                : "إذا كانت لديك أي استفسارات تتعلق بشروط وأحكام الاستخدام أو كنت بحاجة للمساعدة، يرجى التواصل معنا مباشرة:"}
            </p>
            <div className="mt-3 rounded-2xl bg-white dark:bg-neutral-900 border border-black/10 dark:border-white/10 p-4">
              <p className="text-sm">
                📧 <strong>{isEn ? "Email:" : "البريد الإلكتروني:"}</strong>{" "}
                <a href={`mailto:${payment.supportEmail}`} className="text-teal-600 dark:text-teal-400 font-bold hover:underline">
                  {payment.supportEmail}
                </a>
              </p>
              <p className="text-sm mt-1">
                💬 <strong>{isEn ? "WhatsApp Support:" : "الدعم الفني عبر واتساب:"}</strong>{" "}
                <a
                  href={`https://wa.me/2${payment.supportWhatsapp}`}
                  dir="ltr"
                  className="text-teal-600 dark:text-teal-400 font-bold hover:underline"
                >
                  +{payment.supportWhatsapp}
                </a>
              </p>
            </div>
          </section>
        </div>

        <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-10 border-t border-black/5 dark:border-neutral-800 pt-6">
          {isEn
            ? "Tawwerni reserves the right to update these terms to reflect service updates or regulatory compliance. Continued use of the platform constitutes acceptance of revised terms."
            : "تحتفظ منصة طوّرني بالحق في تحديث هذه الشروط بما يتوافق مع التطورات التقنية والتنظيمية. استمرارك في استخدام المنصة يعد موافقة على أي تحديثات لاحقة."}
        </p>
      </main>
    </div>
  );
}
