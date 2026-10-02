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
      className="min-h-screen bg-neutral-50 dark:bg-neutral-950 text-neutral-800 dark:text-neutral-200 transition-colors relative overflow-hidden flex flex-col"
    >
      {/* Ambient background glows */}
      <div className="pointer-events-none absolute -top-40 left-1/2 -translate-x-1/2 w-[600px] h-[400px] rounded-full bg-teal-500/10 dark:bg-teal-500/15 blur-3xl -z-10" />
      <div className="pointer-events-none absolute bottom-40 -left-20 w-80 h-80 rounded-full bg-emerald-500/10 blur-3xl -z-10" />

      <header className="sticky top-0 z-40 border-b border-black/5 dark:border-white/10 bg-white/80 dark:bg-neutral-950/80 backdrop-blur-xl transition-colors">
        <div className="mx-auto flex h-16 max-w-4xl items-center justify-between px-5">
          <div className="flex items-center gap-3">
            <LogoLink size={34} href="/" />
            <span className="text-xs text-neutral-400 hidden sm:inline">|</span>
            <span className="text-xs font-bold text-neutral-600 dark:text-neutral-400 hidden sm:inline">
              {isEn ? "Terms of Service" : "الشروط والأحكام"}
            </span>
          </div>

          <div className="flex items-center gap-1.5 sm:gap-2.5 shrink-0">
            <LanguageToggle />
            <ThemeToggle />
            <Link
              href="/"
              className="whitespace-nowrap shrink-0 text-xs font-bold px-2.5 sm:px-3 py-1.5 rounded-full bg-neutral-100 hover:bg-neutral-200 dark:bg-neutral-800 dark:hover:bg-neutral-700 text-neutral-700 dark:text-neutral-300 transition-all"
            >
              {isEn ? "Home" : "الرئيسية"}
            </Link>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-5 py-12 text-sm leading-relaxed flex-1 w-full">
        {/* Top badge */}
        <span className="inline-flex items-center gap-2 rounded-full border border-teal-500/30 bg-teal-500/10 px-3.5 py-1 text-xs font-bold text-teal-700 dark:text-teal-300 mb-4 shadow-2xs">
          <span>📜</span>
          <span>{isEn ? "Legal Agreement & Usage Terms" : "الاتفاقية القانونية وشروط الاستخدام"}</span>
        </span>

        <h1 className="mb-2 text-3xl sm:text-4xl font-black text-neutral-900 dark:text-white tracking-tight">
          {isEn ? "Application Terms of Service" : "شروط وأحكام استخدام المنصة"}
        </h1>
        <p className="mb-6 text-xs text-neutral-500 dark:text-neutral-400 font-medium">
          {isEn ? "Last updated: October 2026 · Official Document" : "آخر تحديث: أكتوبر 2026 · وثيقة رسمية معتمدة"}
        </p>

        <div className="p-4 rounded-2xl bg-teal-50/80 dark:bg-teal-950/40 border border-teal-500/20 text-teal-900 dark:text-teal-200 text-xs sm:text-sm mb-8 leading-relaxed">
          {isEn
            ? `Welcome to ${brand.nameEn} (${brand.domain}). By creating an account, accessing, or using our web application and educational services, you agree to be bound by these Application Terms of Service and our Privacy Policy. If you do not agree to these terms, please do not use the application.`
            : `أهلاً بك في منصة "${brand.name}" (${brand.domain}). بمجرد إنشاء حساب أو استخدام المنصة أو الاستفادة من الخدمات التعليمية، فإنك توافق على الالتزام بشروط وأحكام الاستخدام هذه وبسياسة الخصوصية الخاصة بنا. إذا كنت لا توافق على هذه الشروط، يرجى التوقف عن استخدام المنصة.`}
        </div>

        <div className="space-y-6">
          {/* Section 1 */}
          <section className="bg-white/80 dark:bg-neutral-900/80 backdrop-blur-md rounded-2xl p-5 sm:p-6 border border-black/5 dark:border-white/10 shadow-xs">
            <h2 className="mb-2 text-base sm:text-lg font-black text-neutral-900 dark:text-white flex items-center gap-2">
              <span className="text-teal-600 dark:text-teal-400">1.</span>
              <span>{isEn ? "Description of Services" : "وصف الخدمات"}</span>
            </h2>
            <p className="text-neutral-700 dark:text-neutral-300">
              {isEn
                ? `${brand.nameEn} provides an interactive online learning platform featuring 100+ practical educational tracks, daily micro-lessons, hands-on projects, digital badges, and verified completion certificates across technology, AI, self-development, and business disciplines.`
                : `تقدم منصة "${brand.name}" بيئة تعليمية تفاعلية تشمل أكثر من 100 مسار عملي متخصص، ودروساً تطبيقية يومية قصيرة، وأدوات تركيز، واختبارات قياس مستوى، وشهادات إتمام معتمدة قابلة للتحقق في مجالات الذكاء الاصطناعي والتكنولوجيا وتطوير المهارات.`}
            </p>
          </section>

          {/* Section 2 */}
          <section className="bg-white/80 dark:bg-neutral-900/80 backdrop-blur-md rounded-2xl p-5 sm:p-6 border border-black/5 dark:border-white/10 shadow-xs">
            <h2 className="mb-2 text-base sm:text-lg font-black text-neutral-900 dark:text-white flex items-center gap-2">
              <span className="text-teal-600 dark:text-teal-400">2.</span>
              <span>{isEn ? "User Registration & Google Authentication" : "إنشاء الحساب وتسجيل الدخول عبر جوجل"}</span>
            </h2>
            <p className="text-neutral-700 dark:text-neutral-300 mb-2">
              {isEn
                ? "To access personalized learning features, track progress, and obtain certificates, you must create a user account:"
                : "للوصول إلى الميزات التعليمية وتتبع تقدمك وإصدار الشهادات، يتعين عليك إنشاء حساب شخصي:"}
            </p>
            <ul className="list-disc ps-5 space-y-2 text-neutral-700 dark:text-neutral-300">
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
          <section className="bg-white/80 dark:bg-neutral-900/80 backdrop-blur-md rounded-2xl p-5 sm:p-6 border border-black/5 dark:border-white/10 shadow-xs border-l-4 border-l-teal-500">
            <h2 className="mb-2 text-base sm:text-lg font-black text-neutral-900 dark:text-white flex items-center gap-2">
              <span className="text-teal-600 dark:text-teal-400">3.</span>
              <span>{isEn ? "Membership, Fees, and 7-Day Guarantee" : "الاشتراكات، الرسوم، وضمان الـ 7 أيام"}</span>
            </h2>
            <ul className="list-disc ps-5 space-y-2 text-neutral-700 dark:text-neutral-300">
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
              <li className="font-bold text-teal-800 dark:text-teal-300">
                {isEn
                  ? "7-Day Money-Back Guarantee: If you are unsatisfied with the platform, you may request a 100% full refund within 7 days from the date of activation by contacting support directly."
                  : "ضمان استرداد الأموال خلال 7 أيام: نتيح ضمان استرداد كامل للمبلغ بنسبة 100% خلال 7 أيام من تاريخ تفعيل الاشتراك في حال رغبتك، دون تعقيدات، بالتواصل المباشر مع الدعم الفني."}
              </li>
              <li className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed">
                {isEn
                  ? "Fair-Use Standard for Downloadable Assets: In accordance with industry standards for digital products, the 7-day refund policy covers platform experience and course learning, but does not apply if an account has already downloaded or exported full offline asset packages (such as the 10,000 Prompts Vault or freelance contract templates), as these files cannot be returned once saved."
                  : "معيار الاستخدام العادل للأصول الرقمية: وفقاً للأعراف القانونية للمنتجات الرقمية، يغطي ضمان الـ 7 أيام تجربة المنصة ومساراتها التعليمية، وتسقط إمكانية الاسترداد في حال قيام الحساب بتنزيل وحفظ الحزم الرقمية الكاملة غير القابلة للاسترجاع (مثل بنك الـ 10,000 برومبت أو حزم العقود القانونية المفتوحة) حمايةً لحقوق الملكية الفكرية ومنع الاستغلال غير العادل."}
              </li>
            </ul>
          </section>

          {/* Section 4 */}
          <section className="bg-white/80 dark:bg-neutral-900/80 backdrop-blur-md rounded-2xl p-5 sm:p-6 border border-black/5 dark:border-white/10 shadow-xs">
            <h2 className="mb-2 text-base sm:text-lg font-black text-neutral-900 dark:text-white flex items-center gap-2">
              <span className="text-teal-600 dark:text-teal-400">4.</span>
              <span>{isEn ? "Acceptable Use & Prohibited Conduct" : "شروط الاستخدام المقبول والمحظورات"}</span>
            </h2>
            <p className="text-neutral-700 dark:text-neutral-300 mb-2">
              {isEn
                ? "When using our platform, you strictly agree NOT to:"
                : "أثناء استخدامك للمنصة، تلتزم بشكل صارم بعدم القيام بأي مما يلي:"}
            </p>
            <ul className="list-disc ps-5 space-y-1.5 text-neutral-700 dark:text-neutral-300">
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
          <section className="bg-white/80 dark:bg-neutral-900/80 backdrop-blur-md rounded-2xl p-5 sm:p-6 border border-black/5 dark:border-white/10 shadow-xs">
            <h2 className="mb-2 text-base sm:text-lg font-black text-neutral-900 dark:text-white flex items-center gap-2">
              <span className="text-teal-600 dark:text-teal-400">5.</span>
              <span>{isEn ? "Intellectual Property Rights" : "حقوق الملكية الفكرية"}</span>
            </h2>
            <p className="text-neutral-700 dark:text-neutral-300">
              {isEn
                ? `All intellectual property rights, trademarks, software code, visual brand assets, and educational course materials available on ${brand.nameEn} are the sole and exclusive property of ${brand.nameEn} and its creators. Access is granted as a limited, personal, revocable, and non-exclusive educational license.`
                : `جميع حقوق الملكية الفكرية، والعلامات التجارية، والمصنفات الرقمية، والتصميمات، والنصوص، والشفرات البرمجية المنشورة على منصة "${brand.name}" مملوكة حصرياً لإدارة المنصة ومؤسسيها. يُمنح المستخدم ترخيصاً شخصياً ومحدوداً للاستفادة التعليمية فقط.`}
            </p>
          </section>

          {/* Section 6 */}
          <section className="bg-white/80 dark:bg-neutral-900/80 backdrop-blur-md rounded-2xl p-5 sm:p-6 border border-black/5 dark:border-white/10 shadow-xs">
            <h2 className="mb-2 text-base sm:text-lg font-black text-neutral-900 dark:text-white flex items-center gap-2">
              <span className="text-teal-600 dark:text-teal-400">6.</span>
              <span>{isEn ? "Privacy & Data Handling" : "الخصوصية والتعامل مع البيانات"}</span>
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
          <section className="bg-white/80 dark:bg-neutral-900/80 backdrop-blur-md rounded-2xl p-5 sm:p-6 border border-black/5 dark:border-white/10 shadow-xs">
            <h2 className="mb-2 text-base sm:text-lg font-black text-neutral-900 dark:text-white flex items-center gap-2">
              <span className="text-teal-600 dark:text-teal-400">7.</span>
              <span>{isEn ? "Disclaimers & Limitation of Liability" : "إخلاء المسؤولية وحدودها"}</span>
            </h2>
            <p className="text-neutral-700 dark:text-neutral-300">
              {isEn
                ? `${brand.nameEn} provides educational content and practical skills training 'as is'. While our curriculum is designed around industry-standard practical workflows, we do not guarantee specific income levels, job placements, or business results. Under no circumstances shall ${brand.nameEn} be liable for indirect, incidental, or consequential damages resulting from platform usage.`
                : `تقدم منصة "${brand.name}" محتواها التعليمي وفق أفضل الممارسات التطبيقية، إلا أنها لا تقدم أي وعود أو ضمانات لأرباح مالية محددة أو وظائف مستقبلية مؤكدة لكون النتائج تعتمد على الجهد الفردي والتطبيق العملي لكل متدرب. المنصة غير مسؤولة عن أي خسائر غير مباشرة ناتجة عن استخدام أو عدم القدرة على استخدام خدماتها.`}
            </p>
          </section>

          {/* Section 8 */}
          <section className="bg-white/80 dark:bg-neutral-900/80 backdrop-blur-md rounded-2xl p-5 sm:p-6 border border-black/5 dark:border-white/10 shadow-xs">
            <h2 className="mb-2 text-base sm:text-lg font-black text-neutral-900 dark:text-white flex items-center gap-2">
              <span className="text-teal-600 dark:text-teal-400">8.</span>
              <span>{isEn ? "Account Suspension and Termination" : "إنهاء الحسابات والتعليق"}</span>
            </h2>
            <p className="text-neutral-700 dark:text-neutral-300">
              {isEn
                ? "We reserve the right to suspend or terminate accounts that breach these terms, engage in copyright infringement, or commit fraud, without prior notice. Users may also voluntarily request account closure and data deletion at any time."
                : "تحتفظ إدارة المنصة بالحق في تعليق أو إغلاق أي حساب يثبت انتهاكه لهذه الشروط أو انتهاك حقوق النشر أو ممارسة أي احتيال، دون أي إشعار مسبق. كما يحق للمستخدم طلب إغلاق حسابه وحذف بياناته في أي وقت."}
            </p>
          </section>

          {/* Section 9 */}
          <section className="bg-white/80 dark:bg-neutral-900/80 backdrop-blur-md rounded-2xl p-5 sm:p-6 border border-black/5 dark:border-white/10 shadow-xs">
            <h2 className="mb-2 text-base sm:text-lg font-black text-neutral-900 dark:text-white flex items-center gap-2">
              <span className="text-teal-600 dark:text-teal-400">9.</span>
              <span>{isEn ? "Contact and Inquiries" : "التواصل والاستفسارات"}</span>
            </h2>
            <p className="text-neutral-700 dark:text-neutral-300 mb-3">
              {isEn
                ? "If you have questions regarding these Application Terms of Service or require customer support, contact us directly:"
                : "إذا كانت لديك أي استفسارات تتعلق بشروط وأحكام الاستخدام أو كنت بحاجة للمساعدة، يرجى التواصل معنا مباشرة:"}
            </p>
            <div className="rounded-2xl bg-neutral-50 dark:bg-neutral-800/80 border border-black/10 dark:border-white/10 p-4 space-y-2">
              <p className="text-xs sm:text-sm">
                📧 <strong>{isEn ? "Email:" : "البريد الإلكتروني:"}</strong>{" "}
                <a href={`mailto:${payment.supportEmail}`} className="text-teal-600 dark:text-teal-400 font-bold hover:underline">
                  {payment.supportEmail}
                </a>
              </p>
              <p className="text-xs sm:text-sm">
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

        <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-10 border-t border-black/5 dark:border-neutral-800 pt-6 text-center">
          {isEn
            ? "Tawwerni reserves the right to update these terms to reflect service updates or regulatory compliance. Continued use of the platform constitutes acceptance of revised terms."
            : "تحتفظ منصة طوّرني بالحق في تحديث هذه الشروط بما يتوافق مع التطورات التقنية والتنظيمية. استمرارك في استخدام المنصة يعد موافقة على أي تحديثات لاحقة."}
        </p>
      </main>

      {/* Footer */}
      <footer className="border-t border-black/5 dark:border-neutral-900 py-8 px-4 text-center text-xs text-neutral-500 bg-white/50 dark:bg-neutral-950/50 backdrop-blur-md">
        <div className="mx-auto max-w-xl space-y-2">
          <p>© {new Date().getFullYear()} {isEn ? brand.nameEn : brand.name} ({brand.domain}) · {isEn ? "Terms of Service" : "شروط الاستخدام"}</p>
          <div className="flex items-center justify-center gap-4 text-neutral-500 dark:text-neutral-400">
            <Link href="/about" className="hover:text-teal-600 transition-colors">{isEn ? "About Us" : "من نحن"}</Link>
            <span>•</span>
            <Link href="/tracks" className="hover:text-teal-600 transition-colors">{isEn ? "Tracks" : "المسارات"}</Link>
            <span>•</span>
            <Link href="/privacy" className="hover:text-teal-600 transition-colors">{isEn ? "Privacy" : "سياسة الخصوصية"}</Link>
            <span>•</span>
            <Link href="/refund" className="hover:text-teal-600 transition-colors font-semibold text-teal-700 dark:text-teal-400">{isEn ? "7-Day Refund Guarantee" : "ضمان الـ 7 أيام"}</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
