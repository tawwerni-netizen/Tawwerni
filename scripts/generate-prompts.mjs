import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// All 11 Categories and target counts
const CATEGORY_SPECS = [
  { key: "sales", count: 100, ar: "المبيعات وإغلاق الصفقات", en: "Sales & Negotiation" },
  { key: "marketing", count: 120, ar: "التسويق والإعلانات", en: "Marketing & Growth" },
  { key: "freelance", count: 110, ar: "العمل الحر واقتناص العملاء", en: "Freelance & Client Acquisition" },
  { key: "engineering", count: 120, ar: "البرمجة وهندسة النظم", en: "Software Engineering & Architecture" },
  { key: "strategy", count: 80, ar: "الاستراتيجية والقيادة التنفيذية", en: "Executive Strategy & Leadership" },
  { key: "product", count: 90, ar: "إدارة المنتجات وتجربة المستخدم", en: "Product Management & UX" },
  { key: "operations", count: 90, ar: "أتمتة العمليات والـ SOPs", en: "Operations & AI Automation" },
  { key: "finance", count: 80, ar: "المالية والتسعير والتدفق النقدي", en: "Finance & Pricing Strategy" },
  { key: "hr", count: 70, ar: "الموارد البشرية والتوظيف النخبوي", en: "HR & Talent Acquisition" },
  { key: "retention", count: 70, ar: "خدمة العملاء وتقليل الإلغاء", en: "Customer Success & Retention" },
  { key: "data", count: 70, ar: "تحليل البيانات وذكاء الأعمال", en: "Data Analytics & BI" },
];

// Verify total equals exactly 1,000
const totalTarget = CATEGORY_SPECS.reduce((acc, c) => acc + c.count, 0);
console.log(`Targeting exactly ${totalTarget} prompts.`);

// Domain-specific topics, roles, models, and blueprint generators
const DOMAIN_DATA = {
  sales: {
    roles: [
      { ar: "مسؤولو المبيعات والمفاوضون", en: "Account Executives & Closers" },
      { ar: "قادة تطوير المبيعات B2B", en: "Enterprise SDR Leads" },
      { ar: "مدراء المبيعات الإقليميون", en: "VP of Sales & Revenue" },
      { ar: "استشاريو الصفقات الكبرى", en: "High-Ticket Consultants" }
    ],
    models: ["Claude 3.7", "GPT-4o", "Gemini Pro"],
    difficulties: ["Executive", "Pro", "Advanced"],
    impacts: [
      { ar: "إغلاق صفقات بدون خصومات", en: "Closes Without Discounts" },
      { ar: "رفع نسبة الرد على الرسائل الباردة +35%", en: "35%+ Cold Outreach Reply Rate" },
      { ar: "تقليص دورة المبيعات بنسبة 40%", en: "Shortens Sales Cycle by 40%" },
      { ar: "مضاعفة قيمة الصفقة المتوسطة 2x", en: "Doubles Average Deal Size" },
      { ar: "إعادة إحياء الصفقات الميتة", en: "Revives Ghosted Enterprise Deals" }
    ],
    topics: [
      {
        sub: "cold-outreach",
        titleAr: "صياغة رسائل باردة خارقة لا يمكن لصناع القرار تجاهلها على لينكدإن والإيميل",
        titleEn: "High-Ticket B2B Cold Outreach Framework for Enterprise Decision Makers",
        tipAr: "يركز هذا البرومبت على فجوة القيمة وثقب الألم دون بيع مباشر في أول تواصل.",
        tipEn: "Focuses on psychological gap-selling with frictionless call-to-actions.",
        templateAr: (vars) => `أنت أفضل مسؤول استقطاب صفقات B2B (Top 1% Enterprise SDR).
المهمة: كتابة رسالة تواصل باردة فائقة الدقة موجهة لصانع القرار: [TARGET_ROLE].
الشركة المستهدفة وطبيعة عملها: [COMPANY_PROFILE].
نقطة الألم التشغيلية أو المالية المحددة: [CORE_PAIN_POINT].
القيمة المضافة الفريدة التي نقدمها: [UNIQUE_VALUE_PROPOSITION].
الإثبات الرقمي أو دراسة الحالة: [METRIC_PROOF].

القواعد الصارمة:
1. تجنب تماماً المقدمات المستهلكة مثل "أتمنى أن تكون بخير" أو "أود تعريفك بشركتنا".
2. اجعل الرسالة أقل من 90 كلمة ومصممة للقراءة على شاشات الموبايل في 15 ثانية.
3. ركز على التكلفة الخفية التي تتكبدها الشركة شهرياً بسبب تجاهل هذه المشكلة.
4. أنهِ الرسالة بطلب رأي أو فكرة خفيف (Low-friction CTA) مثل: "هل يستحق الأمر 5 دقائق لمشاركة الرسم البياني معك؟" وليس طلب اجتماع بيعي مباشر.`,
        templateEn: (vars) => `Act as an elite Enterprise SDR. Craft a sub-90-word outreach message targeting [TARGET_ROLE] at [COMPANY_PROFILE] focusing on [CORE_PAIN_POINT] presenting [UNIQUE_VALUE_PROPOSITION] with proof: [METRIC_PROOF].`,
        vars: [
          { name: "TARGET_ROLE", labelAr: "المسمى الوظيفي للمستهدف", placeholder: "الرئيس التنفيذي / مدير التقنية (CTO)" },
          { name: "COMPANY_PROFILE", labelAr: "طبيعة الشركة المستهدفة", placeholder: "شركات التجارة الإلكترونية متوسطة الحجم" },
          { name: "CORE_PAIN_POINT", labelAr: "نقطة الألم الأساسية", placeholder: "فقدان 25% من السلات المتروكة بسبب بطء الدفع" },
          { name: "UNIQUE_VALUE_PROPOSITION", labelAr: "الحل المقترح", placeholder: "نظام دفع بنقرة واحدة يزيد التحويل بنسبة 18%" },
          { name: "METRIC_PROOF", labelAr: "دليل رقمي من تجربة سابقة", placeholder: "ساعدنا متجر س في زيادة إيراداته بـ 120 ألف دولار في 60 يوماً" }
        ]
      },
      {
        sub: "objection-pricing",
        titleAr: "تفكيك اعتراض 'السعر مرتفع مقارنة بالمنافسين' وإلغاء الحاجة لتقديم خصم",
        titleEn: "Dismantling the 'Your Price is Too High' Objection Without Discounting",
        tipAr: "استخدم تقنية التأطير بالخسارة والمقارنة بتكلفة الفشل مع العميل.",
        tipEn: "Uses cost-of-failure framing to preserve full profit margins.",
        templateAr: (vars) => `أنت خبير تفاوض محنك في صفقات المؤسسات (Enterprise Negotiation Master).
العميل قال لك في جلسة الإغلاق: "عرضكم الفني ممتاز، لكن السعر [OFFER_PRICE] مرتفع جداً مقارنة بمنافسكم الذي عرض علينا [COMPETITOR_PRICE]!".
المجال: [INDUSTRY].
التكلفة الحقيقية للفشل أو تنفيذ العمل بجودة منخفضة: [COST_OF_FAILURE].

المطلوب:
1. صياغة 3 أسئلة معايرة ذكية (Calibrated Questions) تجعل العميل يقارن بين "سعر الشراء" و"تكلفة الامتلاك والأخطاء".
2. صياغة رد شفهي محكم مدته 40 ثانية يعيد توجيه المحادثة من مناقشة السعر إلى مناقشة المخاطر والعائد على الاستثمار.
3. سيناريو تنازل مشروط (Trade-off Matrix): إذا أصر العميل على خفض السعر، كيف تخفض النطاق (Scope) لحماية هامش الربح.`,
        templateEn: (vars) => `Act as an enterprise negotiation strategist. The client objects: price [OFFER_PRICE] is too high compared to [COMPETITOR_PRICE] in [INDUSTRY]. Use [COST_OF_FAILURE] to maintain margins and deliver calibrated responses.`,
        vars: [
          { name: "OFFER_PRICE", labelAr: "السعر المعروض من قبلك", placeholder: "15,000 دولار" },
          { name: "COMPETITOR_PRICE", labelAr: "سعر المنافس الأرخص", placeholder: "7,000 دولار" },
          { name: "INDUSTRY", labelAr: "مجال العمل", placeholder: "تطوير تطبيقات FinTech" },
          { name: "COST_OF_FAILURE", labelAr: "تكلفة الفشل المحتملة للعميل", placeholder: "تسريب بيانات المستخدمين أو توقف السيرفرات في أوقات الذروة" }
        ]
      },
      {
        sub: "discovery-spin",
        titleAr: "سيناريو مكالمة الديسكفري التشخيصية (SPIN Selling Framework) لكشف الآلام العميقة",
        titleEn: "Executive Diagnostic Discovery Call Script (SPIN Selling Blueprint)",
        tipAr: "يجعل العميل هو من يطلب شراء الحل بدلاً من أن تشعر أنك تضغط عليه.",
        tipEn: "Guides buyers into diagnosing their own urgent need for your solution.",
        templateAr: (vars) => `أنت استشاري مبيعات حلول المؤسسات (Enterprise Solutions Advisor).
الهدف: إدارة مكالمة استكشاف وتشخيص (Discovery Call) مدتها 30 دقيقة مع: [CLIENT_PERSONA].
طبيعة الخدمة أو المنتج: [SOLUTION_OFFER].
المشاكل الشائعة في هذا القطاع: [INDUSTRY_ISSUES].

المطلوب إعداد سيناريو كامل مقسم حسب منهجية SPIN:
1. أسئلة الموقف (Situation Questions): 3 أسئلة سريعة لفهم الوضع الراهن والأدوات المستخدمة دون إضاعة الوقت.
2. أسئلة المشكلة (Problem Questions): 3 أسئلة محددة تبرز نقاط الاختناق والتعطيل اليومي.
3. أسئلة التضمين والتبعات (Implication Questions): 4 أسئلة استراتيجية تحول المشكلة التقنية البسيطة إلى خسارة مالية وإدارية واضحة للرئيس التنفيذي.
4. أسئلة القيمة والمكسب (Need-Payoff Questions): 3 أسئلة تجعل العميل نفسه يتخيل الفارق الهائل بعد حل المشكلة.`,
        templateEn: (vars) => `Develop a 30-minute diagnostic discovery script based on SPIN selling for [CLIENT_PERSONA] considering [SOLUTION_OFFER] and [INDUSTRY_ISSUES].`,
        vars: [
          { name: "CLIENT_PERSONA", labelAr: "شخصية العميل في الاجتماع", placeholder: "مدير العمليات في شركة لوجستية" },
          { name: "SOLUTION_OFFER", labelAr: "الحل الذي تقدمه", placeholder: "نظام تتبع أسطول ذكي يعتمد على الذكاء الاصطناعي" },
          { name: "INDUSTRY_ISSUES", labelAr: "مشاكل القطاع الشائعة", placeholder: "استهلاك وقود غير مبرر وتأخر الشحنات بنسبة 20%" }
        ]
      },
      {
        sub: "proposal-closing",
        titleAr: "هندسة مقترح عمل ومذكرة تنفيذ (High-Ticket Proposal) تقفل الصفقة في 48 ساعة",
        titleEn: "Executive Closing Proposal Architecture with Irresistible ROI Framing",
        tipAr: "المقترحات الناجحة لا تتعدى 3 صفحات وتركز على النتائج المالية والمراحل لا الساعات.",
        tipEn: "Structures high-ticket proposals around milestones, ROI, and risk reversal.",
        templateAr: (vars) => `أنت خبير إعداد عروض الأسعار والمقترحات التنفيذية للشركات الكبرى (Proposal Closing Architect).
المشروع: [PROJECT_SCOPE].
العميل: [CLIENT_NAME].
القيمة المالية المستهدفة: [PROPOSAL_VALUE].
مدة التنفيذ: [TIMELINE].

صمم هيكل مقترح عمل تنفيذي مكون من 5 أقسام رئيسية:
1. الملخص التنفيذي ومصفوفة المشكلة والحل (The Strategic Gap).
2. خطة التنفيذ المعتمدة على المراحل (Milestone Roadmap) ومخرجات كل مرحلة بوضوح قاطع.
3. مصفوفة العائد الاستثماري المتوقع (Expected ROI & Payback Period).
4. خيارات الاستثمار (3 باقات: الأساسية، الشاملة الموصى بها، النخبوية).
5. ضمان التسليم وإجراءات التعميد الفوري (Next Steps & Acceptance Trigger).`,
        templateEn: (vars) => `Architect a high-ticket 5-section enterprise proposal for [PROJECT_SCOPE] for client [CLIENT_NAME] worth [PROPOSAL_VALUE] over [TIMELINE].`,
        vars: [
          { name: "PROJECT_SCOPE", labelAr: "نطاق المشروع", placeholder: "إعادة بناء البنية الرقمية ومتجر التطبيقات" },
          { name: "CLIENT_NAME", labelAr: "اسم أو نوع العميل", placeholder: "مجموعة تجارية قابضة في الخليج" },
          { name: "PROPOSAL_VALUE", labelAr: "قيمة العرض", placeholder: "45,000 دولار" },
          { name: "TIMELINE", labelAr: "مدة العمل", placeholder: "8 أسابيع" }
        ]
      },
      {
        sub: "revive-dead-leads",
        titleAr: "خطة إحياء الصفقات المجمدة (Reviving Ghosted Deals) واستعادة العميل الصامت",
        titleEn: "Psychological Follow-Up Protocol to Revive Ghosted B2B Deals",
        tipAr: "تجنب تماماً جملة 'أردت فقط التحقق من الأمر'، وقدم قيمة حصرية تبرر التواصل.",
        tipEn: "Uses guilt-free breakup messaging to compel instant responses from non-responsive prospects.",
        templateAr: (vars) => `أنت متخصص استعادة الصفقات المعلقة (Deal Resurrection Specialist).
العميل كان متحمساً جداً في الاجتماع ثم توقف عن الرد تماماً منذ: [GHOST_DURATION].
المشروع المتفق عليه مبدئياً: [PROJECT_TYPE].
قيمة الصفقة: [DEAL_SIZE].

المطلوب صياغة سلسلة من 3 رسائل متابعة مدروسة نفسياً:
1. رسالة "الأصل ذو القيمة الحصرية": مشاركة تقرير أو فكرة جديدة خاصة ببيزنس العميل بدون أي سؤال عن العقد.
2. رسالة "إعادة توجيه الأولويات": سؤال ذكي يكشف ما إذا كان المشروع قد أُلغي أم تأجل فقط.
3. رسالة "الانسحاب المهذب (The Polite Breakup Email)": إشعار العميل بإغلاق ملفه لرفع الشعور بالندم وتحفيزه على الرد الفوري.`,
        templateEn: (vars) => `Generate a 3-touch psychological sequence to revive a ghosted B2B lead stalled for [GHOST_DURATION] on [PROJECT_TYPE] worth [DEAL_SIZE].`,
        vars: [
          { name: "GHOST_DURATION", labelAr: "مدة انقطاع العميل", placeholder: "3 أسابيع" },
          { name: "PROJECT_TYPE", labelAr: "نوع المشروع", placeholder: "تطوير حملة تسويقية سنوية" },
          { name: "DEAL_SIZE", labelAr: "قيمة الصفقة", placeholder: "20,000 دولار" }
        ]
      }
    ]
  },
  marketing: {
    roles: [
      { ar: "مدراء الإعلانات الرقمية (Media Buyers)", en: "Performance Media Buyers" },
      { ar: "كتاب نصوص التحويل المباشر (Copywriters)", en: "Direct-Response Copywriters" },
      { ar: "مدراء النمو واكتساب العملاء (Growth Leads)", en: "Growth Marketing Leads" },
      { ar: "صناع المحتوى الإعلاني والفيروسي", en: "Creative Strategists & UGC Creators" }
    ],
    models: ["Claude 3.7", "GPT-4o", "Gemini Pro"],
    difficulties: ["Executive", "Pro", "Advanced"],
    impacts: [
      { ar: "مضاعفة معدل العائد الإعلاني ROAS بنسبة 3x", en: "3x ROAS Creative Framework" },
      { ar: "خفض تكلفة الاستحواذ CAC بنسبة 45%", en: "Reduces CAC by 45%" },
      { ar: "رفع معدل النقر CTR فوق 4.2%", en: "Boosts CTR above 4.2%" },
      { ar: "رفع معدل التحويل CVR إلى 8%+", en: "Scales CVR to 8%+" },
      { ar: "ابتكار 10 خطافات فيروسية في دقائق", en: "10 Viral Hooks in Minutes" }
    ],
    topics: [
      {
        sub: "video-ads",
        titleAr: "مصفوفة سكريبتات إعلانات الفيديو الفيروسية عالية التحويل (TikTok / Meta Ads)",
        titleEn: "High-ROAS Direct-Response Short-Form Video Script Matrix",
        tipAr: "أهم 3 ثوانٍ في الفيديو تحدد 80% من نجاح الإعلان، ركز على كسر النمط البصري.",
        tipEn: "Focuses on the first 3-second pattern interrupt to crush ad fatigue.",
        templateAr: (vars) => `أنت مخرج إعلانات التحويل المباشر (Direct Response Creative Director) الذي أدار ميزانيات تفوق 5 ملايين دولار.
المنتج المعلن عنه: [PRODUCT_NAME].
الجمهور المستهدف: [AUDIENCE].
المشكلة المؤلمة التي يعيشها العميل يومياً: [CORE_PAIN].
الحل والتحول النهائي: [DESIRED_TRANSFORMATION].

المطلوب:
1. صياغة 3 خطافات بصرية وصوتية لكسر النمط في أول 3 ثوانٍ (Pattern Interrupt Hooks):
   - خطاف الصدمة أو كشف السر (Contrarian Hook).
   - خطاف المحاكاة اليومية المؤلمة (Relatable Agitation Hook).
   - خطاف المقارنة قبل وبعد (Before & After Transformation).
2. كتابة السيناريو الكامل في جدول مكون من: [الثانية | المشهد البصري المقترح | النص المنطوق | النص المكتوب على الشاشة On-Screen Text].
3. نداء العمل الحاسم (Irresistible CTA) الذي يدفع المشاهد للنقر فوراً.`,
        templateEn: (vars) => `Write a direct-response video ad script for [PRODUCT_NAME] targeting [AUDIENCE] facing [CORE_PAIN] promising [DESIRED_TRANSFORMATION].`,
        vars: [
          { name: "PRODUCT_NAME", labelAr: "اسم المنتج أو الخدمة", placeholder: "تطبيق لتعلم اللغات في 10 دقائق يومياً" },
          { name: "AUDIENCE", labelAr: "الجمهور المستهدف", placeholder: "الموظفون الراغبون في الهجرة أو الترقية" },
          { name: "CORE_PAIN", labelAr: "المعاناة الأساسية", placeholder: "الملل من القواعد والشعور بالإحراج عند التحدث" },
          { name: "DESIRED_TRANSFORMATION", labelAr: "النتيجة المرجوة", placeholder: "التحدث بطلاقة وثقة خلال شهرين" }
        ]
      },
      {
        sub: "landing-page",
        titleAr: "هندسة صفحة هبوط ذات تحويل قياسي (High-Converting Long-Form Landing Page)",
        titleEn: "Full-Spectrum High-Converting Landing Page Copy & Structural Architecture",
        tipAr: "صفحة الهبوط الممتازة تبدد الاعتراضات بترتيب زمني يطابق تفكير الزائر.",
        tipEn: "Dismantles skepticism section by section to drive maximum conversions.",
        templateAr: (vars) => `أنت كبير مهندسي صفحات الهبوط والتحويل (CRO Specialist & Copy Chief).
المنتج والعرض: [OFFERING].
السعر والضمان: [PRICE_AND_GUARANTEE].
أبرز 3 شكوك تدور في عقل الزائر: [TOP_OBJECTIONS].

قم بصياغة الهيكل النصي والتسويقي الكامل لصفحة الهبوط:
1. قسم الهيرو (Hero Section): العنوان الرئيسي (H1)، العنوان الفرعي المقنع، 3 إثباتات ثقة فورية، الزر الرئيسي.
2. قسم تشخيص العدو الحقيقي (The Mechanism of Failure): لماذا فشلت المحاولات السابقة للعميل؟
3. الآلية الفريدة للحل (The Unique Solution Mechanism): كيف يعمل منتجك بشكل مختلف ومبهر.
4. جدول تفكيك الاعتراضات المقابل للضمان (Risk-Reversal Guarantee).
5. قسم الأسئلة الشائعة الفتاكة (FAQ): 5 أسئلة تقتل التردد وتوضح سياسة الأمان.`,
        templateEn: (vars) => `Architect a complete long-form landing page copy framework for [OFFERING] priced at [PRICE_AND_GUARANTEE] tackling objections: [TOP_OBJECTIONS].`,
        vars: [
          { name: "OFFERING", labelAr: "المنتج أو العرض", placeholder: "اشتراك في مسرعة أعمال رقمية للمستقلين" },
          { name: "PRICE_AND_GUARANTEE", labelAr: "السعر والضمان", placeholder: "499 ج.م مع ضمان استرجاع 100% خلال 14 يوماً" },
          { name: "TOP_OBJECTIONS", labelAr: "أهم شكوك الزائر", placeholder: "أخاف ألا يكون مفيداً لي، لا أملك وقتاً كافياً، جربت كورسات سابقة ولم أنجح" }
        ]
      },
      {
        sub: "email-welcome",
        titleAr: "سلسلة رسائل الترحيب وبناء الثقة التلقائية (5-Day Nurture & Conversion Sequence)",
        titleEn: "5-Day High-Engagement Email Welcome & Indoctrination Autoresponder Sequence",
        tipAr: "أول إيميل يجب أن يقدم الهدية الموعودة فوراً مع زر تحميل مباشر دون إعلانات.",
        tipEn: "Balances value delivery with storytelling to prime leads for purchase.",
        templateAr: (vars) => `أنت خبير التسويق بالبريد الإلكتروني (Retention & Email Strategist).
الجمهور المنضم للقائمة البريدية: [SUBSCRIBERS_TYPE].
المغناطيس أو الهدية المجانية التي سجلو للحصول عليها: [LEAD_MAGNET].
المنتج المدفوع المراد بيعه في نهاية السلسلة: [PAID_PRODUCT].

المطلوب كتابة تسلسل مكون من 5 إيميلات أوتوماتيكية:
- الإيميل الأول: تسليم الهدية فوراً + كسر التوقعات ووضع القواعد.
- الإيميل الثاني: قصة الصدمة والتحول (The Origin Story & Big Epiphany).
- الإيميل الثالث: دراسة حالة واقعية بالأرقام تُظهر كيف حقق شخص عادي النتيجة.
- الإيميل الرابع: كشف الوهم الشائع وتقديم العرض المدفوع كأفضل استثمار.
- الإيميل الخامس: الإلحاح والندرة وموعد انتهاء الخصم أو البونص الخاص.`,
        templateEn: (vars) => `Draft a 5-part automated email welcome sequence for [SUBSCRIBERS_TYPE] who downloaded [LEAD_MAGNET] culminating in offering [PAID_PRODUCT].`,
        vars: [
          { name: "SUBSCRIBERS_TYPE", labelAr: "نوع المشتركين الجدد", placeholder: "مصممون ومبرمجون يبحثون عن عملاء" },
          { name: "LEAD_MAGNET", labelAr: "الهدية المجانية", placeholder: "كتاب إلكتروني مجاني: 5 أسرار للحصول على أول عميل دولي" },
          { name: "PAID_PRODUCT", labelAr: "المنتج المدفوع النهائي", placeholder: "المعسكر التدريبي المتقدم لاحتراف الفريلانس" }
        ]
      },
      {
        sub: "viral-hooks",
        titleAr: "مصنع الخطافات الفيروسية (Viral Hook Engine) للمحتوى القصير والثريدات",
        titleEn: "Viral Hook Architecture Engine for High-Reach Organic Content",
        tipAr: "استخدم معادلة التناقض المعرفي (Cognitive Dissonance) لإثارة فضول المتابع.",
        tipEn: "Generates thumb-stopping psychological hooks engineered for engagement.",
        templateAr: (vars) => `أنت مهندس انتشار المحتوى الفيروسي (Viral Growth & Content Strategist).
الموضوع الأساسي للمحتوى: [CONTENT_TOPIC].
الجمهور المستهدف: [AUDIENCE_NICHE].
القناعة الخاطئة الشائعة التي تريد نسفها: [COMMON_MYTH].

المطلوب توليد 10 صيغ خطافية مختلفة مخصصة لشبكات التواصل:
1. 3 خطافات بنظام الصدمة الإحصائية أو الفضح المهني.
2. 3 خطافات بنظام قصة الفشل الشخصي التي تحولت لنجاح باهر.
3. 2 خطاف بنظام المقارنة الصادمة (ما يفعله 99% مقابل ما يفعله 1%).
4. 2 خطاف بنظام التحدي والنداء المباشر.
مع إضافة سبب نجاح كل خطاف نفسياً.`,
        templateEn: (vars) => `Generate 10 psychologically calibrated viral hooks for [CONTENT_TOPIC] targeting [AUDIENCE_NICHE] debunking myth [COMMON_MYTH].`,
        vars: [
          { name: "CONTENT_TOPIC", labelAr: "موضوع المحتوى", placeholder: "أدوات الذكاء الاصطناعي في زيادة إنتاجية الشركات" },
          { name: "AUDIENCE_NICHE", labelAr: "الجمهور", placeholder: "رواد الأعمال وأصحاب المشاريع الناشئة" },
          { name: "COMMON_MYTH", labelAr: "القناعة الشائعة الخاطئة", placeholder: "أن الذكاء الاصطناعي مجرد موضة عابرة ولن يغير بيئة الأعمال" }
        ]
      }
    ]
  },
  freelance: {
    roles: [
      { ar: "المستقلون والمحترفون الدوليون", en: "Elite Freelancers & Solopreneurs" },
      { ar: "استشاريو العمل الحر وتطوير الأعمال", en: "Freelance Business Consultants" },
      { ar: "مطورو الويب والمصممون المستقلون", en: "Freelance Developers & Designers" },
      { ar: "صناع المحتوى والمسوقون الأحرار", en: "Freelance Copywriters & Marketers" }
    ],
    models: ["Claude 3.7", "GPT-4o", "Gemini Pro"],
    difficulties: ["Executive", "Pro", "Advanced"],
    impacts: [
      { ar: "الفوز بمشاريع Upwork بنسبة قبول +40%", en: "40%+ Upwork Win Rate" },
      { ar: "مضاعفة أسعار المشاريع بنظام القيمة 3x", en: "3x Rates via Value Pricing" },
      { ar: "حماية 100% من الأتعاب ضد المماطلة", en: "100% Fee Protection" },
      { ar: "اقتناص عملاء يدفعون بالدولار واليورو", en: "High-Ticket USD/EUR Client Wins" },
      { ar: "تأمين عقود شهرية مستمرة (Retainers)", en: "Long-term Monthly Retainers" }
    ],
    topics: [
      {
        sub: "upwork-proposal",
        titleAr: "صياغة مقترح Upwork رابح يضمن فتح الشات في أول ساعتين (Top 1% Cover Letter)",
        titleEn: "Elite Upwork Proposal Framework Winning High-Ticket Enterprise Jobs",
        tipAr: "العميل يرى أول سطرين فقط في الإشعار؛ ابدأ بحل مشكلته مباشرة دون ذكر اسمك.",
        tipEn: "Optimizes the first 2 visible lines to trigger immediate interview invites.",
        templateAr: (vars) => `أنت أعلى مستقل تصنيفاً على منصات العمل الحر (Top Rated Plus Freelancer).
تفاصيل المشروع المنشور من العميل: [JOB_DESCRIPTION].
الميزانية المعلنة: [JOB_BUDGET].
مهارتك وأقوى عمل مشابه نفذته: [RELEVANT_WORK].

المطلوب كتابة Cover Letter استثنائي وفق القواعد:
1. السطر الأول والثاني: حل مباشر لمشكلة العميل أو سؤال تقني ذكي يثبت أنك قرأت الوصف وفهمت التحدي فوراً.
2. السطر الثالث إلى الخامس: تفصيل الخطوات العملية الثلاث التي ستنفذها غداً لإنهاء المشروع بنجاح.
3. مشاركة مخرجات عمل سابقة مشابهة بأسلوب موجز يظهر العائد بالأرقام.
4. إنهاء المقترح بسؤال استشاري يفتح باب المحادثة (بدون توسل أو كلمات تقليدية مثل 'أنا مستعد للعمل فوراً').`,
        templateEn: (vars) => `Draft a winning Upwork cover letter for job: [JOB_DESCRIPTION] budgeted at [JOB_BUDGET] using portfolio proof: [RELEVANT_WORK].`,
        vars: [
          { name: "JOB_DESCRIPTION", labelAr: "وصف الوظيفة المنشورة", placeholder: "مطلوب مطور Next.js لحل مشاكل الأداء وبطء التحميل في متجر إلكتروني" },
          { name: "JOB_BUDGET", labelAr: "ميزانية العميل", placeholder: "1,500 دولار" },
          { name: "RELEVANT_WORK", labelAr: "أقوى عمل مشابه نفذته", placeholder: "حسّنت سرعة موقع تسوق وحصل على نتيجة 98 في PageSpeed" }
        ]
      },
      {
        sub: "linkedin-outreach",
        titleAr: "استراتيجية استقطاب عملاء أجانب مباشرين عبر لينكدإن بدون منصات وسيطة",
        titleEn: "Direct LinkedIn Outreach Blueprint for Bypassing Freelance Platforms",
        tipAr: "ابحث عن الشركات التي توظف بدوام كامل واعرض عليهم تنفيذ المهمة كاستشاري مستقل.",
        tipEn: "Turns full-time hiring posts into high-margin freelance consulting gigs.",
        templateAr: (vars) => `أنت استشاري أعمال حر متخصص في اقتناص العملاء المباشرين (Direct Client Acquisition).
المجال التخصصي: [SPECIALTY].
صانع القرار المستهدف في الشركة: [DECISION_MAKER].
المشروع أو التحسين المقترح: [PROPOSED_IMPROVEMENT].

المطلوب:
1. صياغة رسالة طلب اتصال مخصصة (Connection Request Note) بحد أقصى 300 حرف تثير الفضول المهني.
2. صياغة رسالة المتابعة الأولى بعد قبول الاتصال تشارك فيها تحليلاً أو تدقيقاً مصغراً مجانياً (Mini Audit) لعمل شركتهم.
3. سيناريو تحويل المحادثة بسلاسة من الشات إلى مكالمة زووم استشارية مدتها 15 دقيقة.`,
        templateEn: (vars) => `Develop a direct LinkedIn client outreach playbook for [SPECIALTY] targeting [DECISION_MAKER] offering [PROPOSED_IMPROVEMENT].`,
        vars: [
          { name: "SPECIALTY", labelAr: "تخصصك المستقل", placeholder: "تطوير واجهات المستخدم وتحسين تجربة العميل (UI/UX)" },
          { name: "DECISION_MAKER", labelAr: "صانع القرار", placeholder: "مدير المنتج (Head of Product)" },
          { name: "PROPOSED_IMPROVEMENT", labelAr: "التحسين المقترح", placeholder: "إعادة تصميم مسار التسجيل لتقليل تسرب المستخدمين" }
        ]
      },
      {
        sub: "scope-creep",
        titleAr: "حماية نطاق العمل ومواجهة طلبات العميل الإضافية المجانية بكل لباقة وحزم",
        titleEn: "Scope Creep Defense & Profitable Change Order Request Scripts",
        tipAr: "لا تقل 'لا' مباشرة؛ قل 'يسعدني تنفيذ ذلك كإضافة للمشروع بالتكلفة الآتية'.",
        tipEn: "Turns unpaid revision requests into lucrative additional milestone orders.",
        templateAr: (vars) => `أنت مدير مشاريع واستشاري حماية حقوق المستقلين (Freelance Scope Protection).
العميل طلب فجأة تعديلات أو ميزات إضافية خارج النطاق الأصلي المتفق عليه: [EXTRA_REQUEST].
النطاق الأصلي المتفق عليه بالعقد: [ORIGINAL_SCOPE].
قيمة المشروع الأصلية: [ORIGINAL_PRICE].

المطلوب:
1. صياغة رد احترافي وودود للغاية يرحب بالفكرة ولكنه يوضح بلباقة أنها خارج نطاق العمل الأساسي.
2. نموذج طلب تغيير رسمي ومبسط (Change Order Memo) يحدد السعر الإضافي والمدة الزمنية الجديدة لتنفيذ التعديل.
3. بديل ذكي: كيف تعرض على العميل استبدال إحدى ميزات النطاق الأصلي بالميزة الجديدة مجاناً إذا كانت ميزانيته لا تسمح بالزيادة.`,
        templateEn: (vars) => `Compose an empathetic yet firm change-order response to client requesting out-of-scope [EXTRA_REQUEST] beyond [ORIGINAL_SCOPE] priced at [ORIGINAL_PRICE].`,
        vars: [
          { name: "EXTRA_REQUEST", labelAr: "الطلب الإضافي من العميل", placeholder: "إضافة لوحة تحكم متعددة اللغات مع نظام مدفوعات جديد" },
          { name: "ORIGINAL_SCOPE", labelAr: "النطاق الأصلي", placeholder: "بناء الموقع باللغة العربية فقط مع ربط بوابة دفع واحدة" },
          { name: "ORIGINAL_PRICE", labelAr: "سعر المشروع الأصلي", placeholder: "2,000 دولار" }
        ]
      }
    ]
  },
  engineering: {
    roles: [
      { ar: "كبار مهندسي البرمجيات والمعماريين", en: "Staff & Principal Software Engineers" },
      { ar: "قادة الفرق التقنية ومدراء الـ CTO", en: "Tech Leads & CTOs" },
      { ar: "مهندسو قواعد البيانات والباك إند", en: "Backend & Systems Architects" },
      { ar: "خبراء الأمان السيبراني والـ DevOps", en: "DevOps & Application Security Leads" }
    ],
    models: ["Claude 3.7", "GPT-4o", "Gemini Pro"],
    difficulties: ["Executive", "Pro", "Advanced"],
    impacts: [
      { ar: "كشف الثغرات الأمنية والديون التقنية", en: "Zero-Day & Security Hardening" },
      { ar: "تسريع الاستعلامات بنسبة 10x وخفض الـ Latency", en: "10x Database Query Speedup" },
      { ar: "منع مشاكل التزامن وتكرار الدفع (Race Conditions)", en: "Concurrency & Idempotency Proof" },
      { ar: "أتمتة بيئات النشر CI/CD بدون توقف السيرفر", en: "Zero-Downtime CI/CD Architecture" },
      { ar: "بناء أنظمة ذكاء اصطناعي و RAG قابلة للتوسع", en: "Scalable Enterprise RAG Systems" }
    ],
    topics: [
      {
        sub: "code-audit",
        titleAr: "مراجعة كود معماري ومراجعة أمان الإنتاج (Production Security & Clean Architecture)",
        titleEn: "Principal Software Engineer Security & Concurrency Code Review Audit",
        tipAr: "ضع هذا البرومبت متبوعاً بكود الـ API الخاص بك لاكتشاف الثغرات المخفية.",
        tipEn: "Audits edge-case race conditions, token leaks, and SQL injection flaws.",
        templateAr: (vars) => `أنت مهندس معماري أول ورئيس الأمان البرمجي (Principal Security Architect).
التقنيات المستخدمة: [TECH_STACK].
الميزة البرمجية الحساسة: [CRITICAL_FEATURE].
المخاوف الأساسية: [CONCERNS].

المطلوب:
1. تحليل معمارية الكود والتأكد من تطبيق مبادئ Clean Architecture و Separation of Concerns.
2. فحص مخاطر التزامن والسباقات (Race Conditions): كيفية ضمان العمليات الذرية ومنع التكرار (Idempotency).
3. فحص الثغرات الأمنية (OWASP): التحقق من المدخلات، حماية مفاتيح API، ومنع تسريب بيانات الخطأ.
4. تقديم كود TypeScript / Python محسن ومتكامل يحل كافة المشكلات مع توثيق الأسباب.`,
        templateEn: (vars) => `Perform a Staff-level security and architecture audit for [CRITICAL_FEATURE] on [TECH_STACK] mitigating [CONCERNS]. Deliver refactored idempotent code.`,
        vars: [
          { name: "TECH_STACK", labelAr: "التقنيات المستخدمة", placeholder: "Next.js 15, Prisma ORM, PostgreSQL, Redis" },
          { name: "CRITICAL_FEATURE", labelAr: "الميزة الحساسة", placeholder: "نظام تسجيل المدفوعات التلقائي وتفعيل الاشتراكات" },
          { name: "CONCERNS", labelAr: "نقاط القلق", placeholder: "الدفع المزدوج عند الضغط السريع، وتسريب أرقام الهواتف" }
        ]
      },
      {
        sub: "database-scaling",
        titleAr: "تصميم وهندسة فهارس قواعد البيانات لملايين السجلات بدون بطء (High-Scale DB Tuning)",
        titleEn: "Database Indexing, Query Optimization, and Large-Scale Schema Architecture",
        tipAr: "تجنب استعلامات N+1 واستخدم فهارس مركبة تغطي أعمدة الفلترة والترتيب معاً.",
        tipEn: "Designs composite indexes and eliminates lock contention under massive concurrency.",
        templateAr: (vars) => `أنت خبير أداء قواعد البيانات ومعمارية النظم الضخمة (Database Performance Specialist).
نوع قاعدة البيانات: [DB_ENGINE].
حجم العمل والبيانات المتوقع: [DATA_SCALE].
الاستعلام الحرج البطيء أو المطلوب تحسينه: [SLOW_QUERY].

المطلوب:
1. تحليل خطة تنفيذ الاستعلام (EXPLAIN ANALYZE) المتوقعة وتحديد أسباب الفحص الكامل للجداول (Sequential Scans).
2. تصميم الفهارس المركبة (Composite Indexes) واستراتيجيات التغطية (Covering Indexes) لتقليص زمن الاستعلام لأقل من 5ms.
3. مقارنة متقدمة: هل نلجأ إلى Materialized Views أم Caching عبر Redis أم Denormalization؟
4. كود SQL ومخطط Schema النهائي المحسن كاملاً.`,
        templateEn: (vars) => `Optimize query latency and indexing for [DB_ENGINE] operating at [DATA_SCALE] executing [SLOW_QUERY]. Provide exact schema and migration script.`,
        vars: [
          { name: "DB_ENGINE", labelAr: "محرك قاعدة البيانات", placeholder: "PostgreSQL 16 / MySQL 8" },
          { name: "DATA_SCALE", labelAr: "حجم البيانات", placeholder: "500,000 مستخدم مع 10 ملايين سجل معاملات" },
          { name: "SLOW_QUERY", labelAr: "الاستعلام المطلوب تسريعه", placeholder: "جلب لوحة تحكم الطالب مع تقدم الدروس والرتبة خلال آخر 30 يوماً" }
        ]
      },
      {
        sub: "rag-ai-system",
        titleAr: "معمارية أنظمة الاسترجاع المعزز بالتوليد (Enterprise RAG Pipeline Architecture)",
        titleEn: "Production-Grade Enterprise Retrieval-Augmented Generation (RAG) Architecture",
        tipAr: "نجاح أنظمة RAG يعتمد بنسبة 80% على تقطيع المستندات (Chunking) وإعادة الترتيب (Reranking).",
        tipEn: "Architects scalable vector retrieval systems with hybrid search and reranking.",
        templateAr: (vars) => `أنت كبير مهندسي الذكاء الاصطناعي والأنظمة اللغوية (Principal AI Systems Architect).
حجم ومصدر المستندات: [DOCUMENTS_SOURCE].
مجال الاستفسارات: [USE_CASE_DOMAIN].
متطلبات الدقة وزمن الاستجابة: [LATENCY_AND_ACCURACY].

المطلوب تصميم بنية نظام RAG كاملة للإنتاج تشمل:
1. استراتيجية تقطيع النصوص (Chunking Strategy): الحجم المناسب وتداخل النصوص (Overlap) للحفاظ على السياق.
2. محرك التضمين وفهرس المتجهات (Vector Database & Embedding Model): معايير الاختيار.
3. البحث الهجين (Hybrid Search: Dense Vector + Sparse BM25) لضمان عدم تفويت المصطلحات الدقيقة.
4. خطوة إعادة الترتيب (Cross-Encoder Reranking) قبل إرسال السياق للنموذج اللغوي لتجنب الهلوسة.
5. كود توضيحي كامل لتدفق الاستعلام ومعالجة الـ Prompts.`,
        templateEn: (vars) => `Architect a production RAG system for [DOCUMENTS_SOURCE] in [USE_CASE_DOMAIN] meeting [LATENCY_AND_ACCURACY]. Include chunking, hybrid search, and reranking.`,
        vars: [
          { name: "DOCUMENTS_SOURCE", labelAr: "مصدر وطبيعة الوثائق", placeholder: "10,000 ملف PDF لعقود قانونية ولوائح تنظيمية" },
          { name: "USE_CASE_DOMAIN", labelAr: "مجال الاستخدام", placeholder: "المساعد القانوني الداخلي للشركة" },
          { name: "LATENCY_AND_ACCURACY", labelAr: "شروط الدقة والسرعة", placeholder: "دقة 99% بدون هلوسة وزمن استجابة أقل من ثانيتين" }
        ]
      }
    ]
  },
  strategy: {
    roles: [
      { ar: "الرؤساء التنفيذيون ومؤسسو الشركات", en: "CEOs & Enterprise Founders" },
      { ar: "مدراء الاستراتيجية وتطوير الأعمال", en: "Chief Strategy Officers (CSO)" },
      { ar: "مستشارو الإدارة والنمو", en: "Management & Growth Consultants" }
    ],
    models: ["Claude 3.7", "GPT-4o"],
    difficulties: ["Executive"],
    impacts: [
      { ar: "بناء خندق تنافسي لا يمكن تقليده", en: "Unbreakable Competitive Moat" },
      { ar: "إطلاق خطة دخول السوق بنجاح (GTM)", en: "High-Velocity GTM Playbook" },
      { ar: "محاذاة أهداف الشركة بنظام OKRs", en: "Flawless OKR Alignment" },
      { ar: "إدارة الأزمات والتحول الاستراتيجي", en: "Crisis Turnaround Mastery" }
    ],
    topics: [
      {
        sub: "gtm-strategy",
        titleAr: "خطة اقتحام وتصدر السوق للمنتجات الجديدة (Go-To-Market Execution Blueprint)",
        titleEn: "Executive Go-To-Market (GTM) Velocity & Distribution Strategy",
        tipAr: "ركز على شريحة محددة جداً (Beachhead Market) وسيطر عليها قبل التوسع.",
        tipEn: "Identifies ideal beachhead markets to maximize traction and defensibility.",
        templateAr: (vars) => `أنت مستشار استراتيجي أول للشركات الناشئة سريعة النمو (Top-Tier Management Consultant).
المنتج الجديد: [NEW_PRODUCT].
السوق المستهدف: [TARGET_MARKET].
أبرز المنافسين المسيطرين: [INCUMBENT_COMPETITORS].
الميزانية والموارد المتاحة: [AVAILABLE_RESOURCES].

صمم خطة إطلاق شاملة في 4 مراحل:
1. تحديد الشريحة الرائدة (Beachhead Segment): أصغر شريحة عملاء تعاني بشدة ومستعدة للدفع فوراً.
2. استراتيجية التسعير والاختراق (Penetration & Positioning): كيفية كسر احتكار المنافسين دون حرق الأسعار.
3. قنوات التوزيع ذات العائد الأسرع (Highest-ROI Distribution Channels).
4. مؤشرات الأداء الحيوية (Leading vs Lagging KPIs) لأول 90 يوماً.`,
        templateEn: (vars) => `Formulate a comprehensive Go-To-Market plan for [NEW_PRODUCT] in [TARGET_MARKET] competing with [INCUMBENT_COMPETITORS] using [AVAILABLE_RESOURCES].`,
        vars: [
          { name: "NEW_PRODUCT", labelAr: "المنتج الجديد", placeholder: "منصة ذكاء اصطناعي لأتمتة فواتير ومحاسبة الشركات الصغيرة" },
          { name: "TARGET_MARKET", labelAr: "السوق المستهدف", placeholder: "الشركات الناشئة والمتاجر في السوق المصري والخليجي" },
          { name: "INCUMBENT_COMPETITORS", labelAr: "المنافسون الراهنون", placeholder: "برامج المحاسبة التقليدية المعقدة والمكلفة" },
          { name: "AVAILABLE_RESOURCES", labelAr: "الموارد المتاحة", placeholder: "فريق صغير مكون من 4 أشخاص وميزانية تسويقية محدودة" }
        ]
      }
    ]
  },
  product: {
    roles: [
      { ar: "مدراء المنتجات وقادة الـ UX", en: "Lead Product Managers & UX Directors" },
      { ar: "رؤساء قطاع المنتجات (CPO)", en: "Chief Product Officers" },
      { ar: "مصممو تجربة المستخدم والتحويل", en: "Senior Product Designers" }
    ],
    models: ["Claude 3.7", "GPT-4o"],
    difficulties: ["Executive", "Pro"],
    impacts: [
      { ar: "كتابة PRD تنفيذي خالي من الغموض", en: "Zero-Ambiguity Product PRD" },
      { ar: "تقليص زمن الوصول للقيمة (Time to Aha!)", en: "Compresses Time-to-Value by 60%" },
      { ar: "ترتيب الأولويات بمصفوفة RICE بدقة", en: "RICE Prioritization Matrix" }
    ],
    topics: [
      {
        sub: "prd-builder",
        titleAr: "صياغة وثيقة متطلبات المنتج التنفيذية (World-Class Product PRD Blueprint)",
        titleEn: "Executive-Grade Product Requirements Document (PRD) Architecture",
        tipAr: "الـ PRD الممتاز يركز على المشكلة ومعايير القبول ولا يملي الحل التقني على المهندسين.",
        tipEn: "Structures problem definitions, user stories, and acceptance criteria.",
        templateAr: (vars) => `أنت مدير منتجات أول في شركة مثل Airbnb أو Stripe (Staff Product Manager).
الميزة أو المنتج المطلوب توثيقه: [FEATURE_NAME].
المشكلة التي يواجهها المستخدمون حالياً: [USER_PROBLEM].
الأهداف ومؤشرات النجاح الرئيسية: [SUCCESS_METRICS].

المطلوب صياغة وثيقة PRD متكاملة تشمل:
1. بيان المشكلة والفرصة الاستراتيجية (The Why).
2. شخصيات المستخدمين وحالات الاستخدام الأساسية (User Personas & Scenarios).
3. المتطلبات الوظيفية وغير الوظيفية (Functional & Non-Functional Requirements).
4. قصص المستخدمين ومعايير القبول الصارمة (User Stories with Gherkin Acceptance Criteria: Given-When-Then).
5. حالات الحافة والتعامل مع الأخطاء (Edge Cases & Failure States).`,
        templateEn: (vars) => `Draft a comprehensive PRD for [FEATURE_NAME] solving [USER_PROBLEM] tracking [SUCCESS_METRICS]. Include Given-When-Then criteria.`,
        vars: [
          { name: "FEATURE_NAME", labelAr: "اسم الميزة أو المنتج", placeholder: "نظام الترقية الفورية وخزنة الـ 1,000 برومبت" },
          { name: "USER_PROBLEM", labelAr: "مشكلة المستخدم", placeholder: "المشتركون يريدون أدوات عملية فورية لزيادة أرباحهم دون تضييع وقت" },
          { name: "SUCCESS_METRICS", labelAr: "مؤشرات النجاح", placeholder: "نسبة قبول ترقية تتجاوز 30% وتقييم رضا 4.8/5" }
        ]
      }
    ]
  },
  operations: {
    roles: [
      { ar: "مدراء العمليات ومؤسسو الشركات", en: "COOs & Operations Directors" },
      { ar: "مهندسو أتمتة الأنظمة والـ Workflows", en: "Automation & Systems Engineers" },
      { ar: "مدراء المشاريع والإنتاجية", en: "Operations Leads & Scrum Masters" }
    ],
    models: ["GPT-4o", "Claude 3.7"],
    difficulties: ["Pro", "Executive"],
    impacts: [
      { ar: "توفير 20 ساعة عمل أسبوعياً للأفراد", en: "Saves 20 Hours / Week" },
      { ar: "أتمتة العمليات اليدوية بنسبة 95%", en: "95% Operational Automation" },
      { ar: "توثيق SOPs تمنع الأخطاء البشرية", en: "Fail-Safe Operational SOPs" }
    ],
    topics: [
      {
        sub: "sop-builder",
        titleAr: "بناء أدلة التشغيل القياسية (SOPs) القابلة للتفويض والأتمتة بالذكاء الاصطناعي",
        titleEn: "Self-Executing Operational SOP Architecture & Automation Blueprint",
        tipAr: "قسم كل خطوة إلى: المدخلات، الإجراء، والنتيجة المتوقعة القابلة للفحص.",
        tipEn: "Eliminates ambiguity so any new hire or automated script executes flawlessly.",
        templateAr: (vars) => `أنت مدير عمليات عالمي متخصص في بناء الأنظمة المتماسكة (Systems & Automation COO).
العملية المطلوب توثيقها: [OPERATION_NAME].
الخطوات التي ينفذها الفريق يدوياً حالياً: [CURRENT_STEPS].
أكثر الأخطاء أو التأخيرات شيوعاً: [COMMON_FAILURES].

المطلوب:
1. صياغة دليل تشغيل قياسي (SOP) منضبط بخطوات محددة (Zero-Ambiguity Checklist).
2. رسم مخطط تدفق البيانات (Data Flow) وتحديد النقاط التي يمكن أتمتتها بـ Webhooks و APIs.
3. بروتوكول التعامل مع الحالات الشاذة والأخطاء (Exception Handling Protocols).
4. معايير الجودة ومؤشرات قياس سرعة ودقة التنفيذ (SLA Benchmarks).`,
        templateEn: (vars) => `Design a bulletproof SOP for [OPERATION_NAME] covering steps: [CURRENT_STEPS] resolving bottlenecks: [COMMON_FAILURES].`,
        vars: [
          { name: "OPERATION_NAME", labelAr: "العملية التشغيلية", placeholder: "تأكيد طلبات الشراء عبر فودافون كاش وإنستاباي وتفعيل الحساب" },
          { name: "CURRENT_STEPS", labelAr: "الخطوات الحالية", placeholder: "فحص رسالة SMS، مقارنة الرقم مع الطلب في لوحة الإدارة، تغيير الحالة لمقبول، إرسال إيميل الترحيب" },
          { name: "COMMON_FAILURES", labelAr: "أسباب الأخطاء", placeholder: "التأخر في التفعيل لأكثر من ساعتين أو إدخال رقم هاتف خاطئ" }
        ]
      }
    ]
  },
  finance: {
    roles: [
      { ar: "المسؤولون الماليون ومسؤولو التسعير", en: "CFOs & Financial Directors" },
      { ar: "مستشارو التسعير السلوكي وهوامش الربح", en: "Pricing & Unit Economics Strategists" }
    ],
    models: ["Claude 3.7", "GPT-4o"],
    difficulties: ["Executive"],
    impacts: [
      { ar: "زيادة العائد لكل مستخدم ARPU بنسبة +35%", en: "35%+ ARPU Expansion" },
      { ar: "تحسين التدفق النقدي وتقليص دورة التحصيل", en: "Cash Flow Acceleration" },
      { ar: "تأطير عروض لا تتردد في شرائها (No-Brainer)", en: "Irresistible Offer Economics" }
    ],
    topics: [
      {
        sub: "pricing-tiers",
        titleAr: "هندسة باقات التسعير السلوكي وتأثير الطُعم (Decoy Pricing Architecture)",
        titleEn: "Behavioral Tiered Pricing & Margin-Maximization Architecture",
        tipAr: "ضع الباقة الأغلى كمرجع لجعل الباقة الوسطى تبدو كصفقة لا تعوض.",
        tipEn: "Uses behavioral economics to guide 60%+ buyers to highest-margin tiers.",
        templateAr: (vars) => `أنت استشاري التسعير السلوكي للشركات (Behavioral Pricing Strategist).
المنتج أو الخدمة: [PRODUCT_OFFERING].
العملاء المستهدفون وميزانيتهم: [AUDIENCE_BUDGET].
الإضافات والقيم الممكن تقديمها: [POTENTIAL_ADDONS].

المطلوب:
1. تصميم هيكل تسعير ثلاثي (Good, Better, Best) يستفيد من تأثير الطعم (Decoy Effect).
2. تصميم ترقية لحظية عند الدفع (Order Bump) بنسبة قبول متوقعة تتجاوز 35%.
3. صياغة المبررات النفسية والنصوص التسويقية لكل باقة لجعل الباقة المختارة الخيار البديهي.
4. حساب التأثير المالي المتوقع على هوامش الربح وإجمالي الإيرادات.`,
        templateEn: (vars) => `Architect a 3-tier behavioral pricing model with order bump mechanics for [PRODUCT_OFFERING] targeting [AUDIENCE_BUDGET] using [POTENTIAL_ADDONS].`,
        vars: [
          { name: "PRODUCT_OFFERING", labelAr: "المنتج الأساسي", placeholder: "اشتراك سنوي في منصة تعليمية بـ 349 ج.م" },
          { name: "AUDIENCE_BUDGET", labelAr: "ميزانية الجمهور", placeholder: "شباب وباحثون عن عمل حر ذو دخل بالدولار" },
          { name: "POTENTIAL_ADDONS", labelAr: "الإضافات المتاحة", placeholder: "بنك 1000 برومبت للشركات + عقود فريلانس قانونية" }
        ]
      }
    ]
  },
  hr: {
    roles: [
      { ar: "مدراء الموارد البشرية والتوظيف النخبوي", en: "Chief People Officers & HR Leads" },
      { ar: "مدراء الفرق ومسؤولو اختيار الكفاءات", en: "Hiring Managers & Team Leads" }
    ],
    models: ["GPT-4o", "Claude 3.7"],
    difficulties: ["Pro", "Executive"],
    impacts: [
      { ar: "تجنب التوظيف الخاطئ عالي التكلفة", en: "Eliminates Costly Bad Hires" },
      { ar: "تصميم اختبار عملي مدفوع يكشف المهارة", en: "Authentic Work-Sample Protocols" },
      { ar: "خطة إدماج أول 90 يوماً بكفاءة عالية", en: "90-Day High-Performance Ramp" }
    ],
    topics: [
      {
        sub: "hiring-scorecard",
        titleAr: "بطاقة تقييم التوظيف النخبوي واختبار الكفاءة الحقيقية (Role Scorecard)",
        titleEn: "A-Player Role Scorecard & Work-Sample Assessment Blueprint",
        tipAr: "لا تسأل المرشح عما سيفعله في المستقبل؛ اختبر ما أنجزه بالفعل في الماضي بمهمة واقعية.",
        tipEn: "Replaces subjective interview chatter with rigorous objective outcome metrics.",
        templateAr: (vars) => `أنت رئيس قطاع الموارد البشرية التنفيذي (Chief People Officer).
المسمى الوظيفي المطلوب: [JOB_TITLE].
المهام والنتائج الحاسمة للوظيفة خلال عام: [CORE_OUTCOMES].
المهارات الصارمة غير القابلة للتفاوض: [MANDATORY_SKILLS].

المطلوب:
1. صياغة بطاقة تقييم الأداء (Role Scorecard) محددة بـ 4 مخرجات رقمية واضحة.
2. تصميم 5 أسئلة مقابلة سلوكية قائمة على استخراج الحقائق وفق منهجية STAR.
3. تصميم اختبار عملي مدفوع مدته 3 ساعات (Paid Work-Sample Test) يحاكي مشكلة حقيقية في العمل.
4. مؤشرات الإنذار المبكر (Red Flags) التي تستوجب استبعاد المرشح فوراً.`,
        templateEn: (vars) => `Design an elite candidate scorecard and realistic work-sample test for [JOB_TITLE] achieving [CORE_OUTCOMES] requiring [MANDATORY_SKILLS].`,
        vars: [
          { name: "JOB_TITLE", labelAr: "المسمى الوظيفي", placeholder: "Senior Growth Marketing Manager" },
          { name: "CORE_OUTCOMES", labelAr: "المخرجات الحاسمة", placeholder: "مضاعفة المشتركين الجدد من 500 إلى 5000 شهرياً بكفاءة CAC عالية" },
          { name: "MANDATORY_SKILLS", labelAr: "المهارات الصارمة", placeholder: "إدارة ميزانيات Meta/TikTok الكبرى، تحليل بيانات SQL، كتابة نصوص تحويلية" }
        ]
      }
    ]
  },
  retention: {
    roles: [
      { ar: "مدراء نجاح العملاء والاحتفاظ", en: "Heads of Customer Success & Support" },
      { ar: "مسؤولو تجربة ما بعد البيع", en: "Client Experience & Retention Managers" }
    ],
    models: ["Claude 3.7", "GPT-4o"],
    difficulties: ["Executive", "Pro"],
    impacts: [
      { ar: "إنقاذ 40% من طلبات الإلغاء والاسترداد", en: "Rescues 40% of Churn Requests" },
      { ar: "احتواء العملاء الغاضبين وتحويلهم لداعمين", en: "De-escalates High-Tension Tickets" },
      { ar: "بناء ولاء دائم ومبيعات تكرارية", en: "Drives Long-Term Member Loyalty" }
    ],
    topics: [
      {
        sub: "churn-rescue",
        titleAr: "خطة اعتراض العميل الغاضب ومنع الإلغاء وتحويله لعميل مخلص (Churn Interception)",
        titleEn: "Escalated Churn Interception & Empathy Turnaround Playbook",
        tipAr: "ابدأ بامتصاص الغضب تماماً والاعتراف بشعور العميل دون أي جدال أو تبرير دفاعي.",
        tipEn: "Turns frustrated cancellation requests into high-loyalty member relationships.",
        templateAr: (vars) => `أنت نائب رئيس نجاح العملاء في شركة عالمية مشهورة بخدمة العملاء الخارقة.
المنتج أو الاشتراك: [SUBSCRIPTION_NAME].
شكوى العميل أو سبب طلب الإلغاء: [CUSTOMER_GRIEVANCE].
الحلول أو البدائل المتاحة لدينا: [AVAILABLE_RESOLUTIONS].

المطلوب:
1. صياغة رد فائق التعاطف (Empathy-First Communication) يمتص الغضب ويعترف بالتقصير أو الصعوبة.
2. إعادة تأطير الموقف وتقديم الحلول البديلة كهدية وتقدير خاص له دون فرض.
3. خطة متابعة بعد 7 أيام للتأكد من حل المشكلة ورضا العميل التام.`,
        templateEn: (vars) => `Formulate a churn turnaround response for [SUBSCRIPTION_NAME] where customer complains: [CUSTOMER_GRIEVANCE] offering solutions: [AVAILABLE_RESOLUTIONS].`,
        vars: [
          { name: "SUBSCRIPTION_NAME", labelAr: "اسم الاشتراك أو الخدمة", placeholder: "منصة طوّرني التعليمية" },
          { name: "CUSTOMER_GRIEVANCE", labelAr: "شكوى العميل", placeholder: "أشعر أنني لا أجد وقتاً للمذاكرة وأهدرت أموالي" },
          { name: "AVAILABLE_RESOLUTIONS", labelAr: "الحلول المتاحة", placeholder: "تجميد الحساب لمدة شهرين، تخصيص خطة 5 دقائق فقط، منح وصول مجاني لخزنة البرومبتات" }
        ]
      }
    ]
  },
  data: {
    roles: [
      { ar: "محللو البيانات وذكاء الأعمال", en: "Lead Data & BI Analysts" },
      { ar: "مهندسو مسارات البيانات والتحليلات", en: "Analytics Engineers" },
      { ar: "مدراء الرؤى الاستراتيجية", en: "Strategic Insights Managers" }
    ],
    models: ["Claude 3.7", "GPT-4o", "Gemini Pro"],
    difficulties: ["Pro", "Advanced"],
    impacts: [
      { ar: "استعلامات SQL معقدة لتحليل التسرب (Funnels)", en: "High-Performance Funnel SQL" },
      { ar: "كشف الشذوذ والفرص الخفية في الإيرادات", en: "Anomaly & Opportunity Detection" },
      { ar: "لوحة تحكم تنفيذية تركز على القرارات", en: "Decision-Centric Dashboard Design" }
    ],
    topics: [
      {
        sub: "sql-funnel",
        titleAr: "استعلامات SQL متقدمة لتحليل أفواج المستخدمين والتسرب (Cohort Retention SQL)",
        titleEn: "Advanced Cohort Retention & Multi-Touch Conversion Funnel SQL Architecture",
        tipAr: "استخدم Window Functions و CTEs لجعل الاستعلام سريعاً وسهل القراءة على مجموعات البيانات الضخمة.",
        tipEn: "Extracts retention cohorts and funnel drop-offs using optimized window functions.",
        templateAr: (vars) => `أنت كبير مهندسي البيانات وتحليلات الأعمال (Lead Analytics Engineer).
قاعدة البيانات: [DATABASE_ENGINE].
جداول البيانات المتاحة: [TABLES_STRUCTURE].
الهدف التحليلي المطلوب: [ANALYTICAL_OBJECTIVE].

المطلوب:
1. كتابة استعلام SQL كامل باستخدام CTEs و Window Functions لحساب أفواج الاحتفاظ الشهرية أو الأسبوعية (Retention Cohorts).
2. استخراج نقاط التسرب الكبرى (Drop-off Bottlenecks) مع نسب التحويل بين كل خطوة.
3. تحسين أداء الاستعلام على ملايين الصفوف (Partitioning / Indexing Hints).
4. شرح النتائج باللغة التنفيذية البسيطة التي يفهمها المدير التنفيذي لاتخاذ قرار فوري.`,
        templateEn: (vars) => `Write optimized SQL for [DATABASE_ENGINE] on tables [TABLES_STRUCTURE] to analyze [ANALYTICAL_OBJECTIVE] with cohort matrices.`,
        vars: [
          { name: "DATABASE_ENGINE", labelAr: "محرك البيانات", placeholder: "PostgreSQL / BigQuery / Snowflake" },
          { name: "TABLES_STRUCTURE", labelAr: "جداول البيانات", placeholder: "users (id, created_at), events (id, user_id, event_name, event_time)" },
          { name: "ANALYTICAL_OBJECTIVE", labelAr: "الهدف التحليلي", placeholder: "معرفة نسبة الطلاب الذين يكملون اليوم الأول واليوم السابع من المسار" }
        ]
      }
    ]
  }
};

// Specialized Variations Sub-Matrix to generate 1,000 distinct prompts with varied subtopics
const SUBTOPIC_SPECIALTIES = {
  sales: [
    { subAr: "استقطاب كبار المدراء التنفيذيين عبر لينكدإن والإيميل", subEn: "C-Level Executive Outreach", tag: "outreach-c-level" },
    { subAr: "تفكيك اعتراض الميزانية ونقص السيولة النقدية", subEn: "Budget & Cashflow Objection Reversal", tag: "objection-budget" },
    { subAr: "إدارة مفاوضات العقود متعددة الأطراف ولجان الشراء", subEn: "Procurement Committee Multi-Threading", tag: "negotiation-procurement" },
    { subAr: "تصميم سيناريوهات العروض التقديمية والديمو التفاعلي", subEn: "High-Stakes Live Demo & Pitch Decks", tag: "demo-closing" },
    { subAr: "صياغة المتابعات الذكية بعد الصمت وتجميد الصفقات", subEn: "Stalled Deal Psychological Follow-ups", tag: "stalled-leads" },
    { subAr: "عروض زيادة المبيعات والخدمات المكملة (Upselling & Cross-selling)", subEn: "Enterprise Upsell & Retainer Expansion", tag: "account-expansion" },
    { subAr: "استدراج العميل لتحديد الميزانية وسقف الإنفاق الحقيقي", subEn: "Budget Discovery & Anchoring", tag: "budget-discovery" },
    { subAr: "التفاوض على شروط الدفع والخصومات السنوية", subEn: "Payment Terms & Multi-Year Contracts", tag: "terms-negotiation" },
    { subAr: "تأهيل العملاء المحتملين ومنع إهدار الوقت (BANT/MEDDIC)", subEn: "MEDDIC & BANT Qualification Audits", tag: "qualification-meddic" },
    { subAr: "استراتيجيات كسب الصفقات من المنافسين الشرسين", subEn: "Competitive Takeaways & Displacement", tag: "competitor-displacement" }
  ],
  marketing: [
    { subAr: "سكريبتات إعلانات الفيديو الفيروسية على تيك توك وإنستجرام", subEn: "TikTok & Reels High-Converting UGC Scripts", tag: "tiktok-ugc-scripts" },
    { subAr: "نصوص صفحات الهبوط الطويلة فائقة التحويل (Long-Form CRO)", subEn: "Long-Form Direct-Response Landing Pages", tag: "landing-page-cro" },
    { subAr: "حملات البريد الإلكتروني وسلاسل الترحيب وبناء الثقة", subEn: "Email Welcome & Indoctrination Funnels", tag: "email-indoctrination" },
    { subAr: "استراتيجيات إعلانات فيسبوك وميتا للجمهور البارد", subEn: "Meta Cold Audience Scaling Frameworks", tag: "meta-cold-scale" },
    { subAr: "خطافات المحتوى العضوي الفيروسي على منصة X ولينكدإن", subEn: "Organic Viral Hooks for LinkedIn & X", tag: "organic-viral-hooks" },
    { subAr: "هندسة العروض التي لا تقاوم وحزم التخفيضات الكبرى", subEn: "Grand Slam Offer Creation & Stacking", tag: "grand-slam-offers" },
    { subAr: "استراتيجيات إعادة الاستهداف (Retargeting) لاستعادة المترددين", subEn: "High-Frequency Retargeting Sequences", tag: "retargeting-recovery" },
    { subAr: "حملات جوجل الإعلانية وعناوين البحث عالية النية", subEn: "High-Intent Google Ads Copy Matrices", tag: "google-search-intent" },
    { subAr: "تصميم مسارات التحويل التفاعلية (Quiz & Assessment Funnels)", subEn: "Quiz & Lead Magnet Funnel Architecture", tag: "quiz-funnel-cro" },
    { subAr: "نصوص إعلانات المؤثرين والشراكات التجارية عالية العائد", subEn: "Influencer Briefs & Sponsored Scripting", tag: "influencer-briefs" }
  ],
  freelance: [
    { subAr: "مقترحات Upwork الرابحة للمشاريع الكبرى والمستعجلة", subEn: "Winning Upwork High-Ticket Cover Letters", tag: "upwork-enterprise" },
    { subAr: "اقتناص العملاء الدوليين المباشرين عبر لينكدإن بدون وسيط", subEn: "Direct LinkedIn International Client Hunting", tag: "direct-linkedin-leads" },
    { subAr: "تسعير المشاريع بنظام القيمة والتخلص من الحساب بالساعة", subEn: "Value-Based Project Pricing Models", tag: "value-based-pricing" },
    { subAr: "حماية نطاق العمل ومواجهة طلبات التعديل المجانية", subEn: "Scope Creep Defense & Paid Change Orders", tag: "scope-creep-defense" },
    { subAr: "إجراءات بدء العمل واستبيان العميل الاحترافي (Onboarding)", subEn: "Client Onboarding & Intake Questionnaires", tag: "client-onboarding-intake" },
    { subAr: "تحصيل الأتعاب المتأخرة والتعامل مع العملاء المماطلين", subEn: "Overdue Invoices & Polite Debt Collection", tag: "overdue-invoices" },
    { subAr: "بناء معرض أعمال مبهر ودراسات حالة بالأرقام", subEn: "High-Converting Case Study Portfolio Creation", tag: "portfolio-case-studies" },
    { subAr: "تحويل المشاريع المنتهية إلى عقود شهرية مستمرة (Retainers)", subEn: "Converting One-Off Projects into Monthly Retainers", tag: "monthly-retainers" },
    { subAr: "طلب التوصيات والتقييمات الممتازة بدون إحراج", subEn: "Frictionless Testimonial & Referral Harvesting", tag: "referral-harvesting" },
    { subAr: "التفاوض مع العملاء متعددي الجنسيات وفوارق الثقافات", subEn: "Cross-Cultural Negotiations & Currency Hedging", tag: "cross-cultural-freelance" }
  ],
  engineering: [
    { subAr: "مراجعة كود معماري ومراجعة أمان الإنتاج والأذونات", subEn: "Production Security & RBAC Architecture Review", tag: "sec-architecture-review" },
    { subAr: "تحسين فهارس واستعلامات قواعد البيانات لتسريع الأداء 10x", subEn: "Database Indexing & Query Latency Optimization", tag: "db-indexing-tuning" },
    { subAr: "معمارية أنظمة الاسترجاع المعزز بالذكاء الاصطناعي (RAG)", subEn: "Production RAG Pipelines & Vector Search", tag: "rag-ai-pipelines" },
    { subAr: "معالجة أخطاء التزامن ومنع تكرار الدفع (Idempotency & Locks)", subEn: "Idempotency & Concurrency Race Condition Fixes", tag: "concurrency-idempotency" },
    { subAr: "أتمتة خطوط النشر CI/CD مع حاويات Docker و Kubernetes", subEn: "Zero-Downtime Docker & CI/CD Pipelines", tag: "docker-cicd-pipelines" },
    { subAr: "تصميم الواجهات الخلفية للخدمات الدقيقة (Microservices & Event-Driven)", subEn: "Microservices & Event-Driven Architecture", tag: "microservices-events" },
    { subAr: "كشف الثغرات الأمنية واختبارات الاختراق (OWASP Audits)", subEn: "OWASP Top 10 Vulnerability Hardening", tag: "owasp-security-audit" },
    { subAr: "إدارة التخزين المؤقت عبر Redis واستراتيجيات الإبطال (Cache Invalidation)", subEn: "Redis Caching & Invalidation Strategies", tag: "redis-caching-tuning" },
    { subAr: "معمارية تطبيقات Next.js 15 و Server Actions والأمان", subEn: "Next.js App Router & Server Actions Hardening", tag: "nextjs-app-router-sec" },
    { subAr: "هندسة وثائق الـ API ونماذج TypeScript الصارمة", subEn: "Type-Safe API Contracts & OpenAPI Specifications", tag: "api-contracts-openapi" }
  ],
  strategy: [
    { subAr: "خطة إطلاق واقتحام السوق للمنتجات الرقمية (GTM Velocity)", subEn: "Go-To-Market Execution & Distribution Moats", tag: "gtm-execution" },
    { subAr: "بناء الخنادق التنافسية وحماية الحصة السوقية", subEn: "Defensive Competitive Moats & Positioning", tag: "competitive-moats" },
    { subAr: "محاذاة أهداف الشركة ومؤشرات القيادة بنظام OKRs", subEn: "Executive OKR Cascading & Alignment", tag: "okr-cascading" },
    { subAr: "إدارة الأزمات المؤسسية وحماية السمعة الرقمية", subEn: "Crisis Communications & Brand Armor", tag: "crisis-management" },
    { subAr: "استراتيجيات التوسع من مرحلة التأسيس إلى مرحلة النمو المتسارع", subEn: "Scaling Playbooks: Seed to Series A", tag: "scaling-playbooks" },
    { subAr: "تحليل وتفكيك استراتيجيات المنافسين وكشف نقاط ضعفهم", subEn: "Competitive Teardowns & Vulnerability Mapping", tag: "competitive-teardowns" },
    { subAr: "عقد الشراكات الاستراتيجية واتفاقيات التوزيع الحصرية", subEn: "Strategic Alliances & Distribution Partnerships", tag: "strategic-alliances" },
    { subAr: "اتخاذ القرارات الحاسمة في أوقات عدم اليقين (Pre-Mortem Analysis)", subEn: "Pre-Mortem Analysis & Second-Order Decisions", tag: "pre-mortem-decisions" }
  ],
  product: [
    { subAr: "صياغة وثائق متطلبات المنتج التنفيذية (PRD Architecture)", subEn: "Full-Stack Product Requirements Documents (PRDs)", tag: "prd-architecture" },
    { subAr: "تقليص زمن الوصول للقيمة ولحظة الإبهار (Time to Aha! Moment)", subEn: "User Onboarding & Time-to-Value Compression", tag: "time-to-value-aha" },
    { subAr: "ترتيب أولويات الميزات البرمجية بمصفوفة RICE و MoSCoW", subEn: "Feature Prioritization (RICE & Kano Models)", tag: "feature-prioritization" },
    { subAr: "تصميم مقابلات العملاء واستخلاص الرغبات الحقيقية (JTBD)", subEn: "Jobs-to-Be-Done (JTBD) User Research Protocols", tag: "jtbd-user-research" },
    { subAr: "تدقيق واجهات وتجربة المستخدم بنظام المعايير الإرشادية (Heuristics)", subEn: "UX & Cognitive Load Heuristic Audits", tag: "ux-heuristics-audit" },
    { subAr: "هندسة حلقات الانتشار العضوي ونمو المنتج (Product-Led Growth)", subEn: "Product-Led Growth (PLG) Viral Loops", tag: "plg-viral-loops" },
    { subAr: "تقليل معدل الارتداد في مسار التسجيل (Frictionless Signup)", subEn: "Registration Funnel Friction Reduction", tag: "signup-friction-reduction" },
    { subAr: "تصميم أنظمة الإشعارات والتذكير الذكي لرفع التفاعل", subEn: "Behavioral Notification & Re-Engagement Architecture", tag: "notification-architecture" },
    { subAr: "إدارة الإطلاق التجريبي واختبارات البيتا (Beta Testing Programs)", subEn: "Beta Testing & Early Adopter Feedback Frameworks", tag: "beta-testing-programs" }
  ],
  operations: [
    { subAr: "بناء أدلة التشغيل القياسية (SOPs) القابلة للتفويض الفوري", subEn: "Self-Executing Operational SOP Builder", tag: "sop-delegation-builder" },
    { subAr: "أتمتة تدفقات العمل وربط الأنظمة بـ Webhooks و Zapier", subEn: "Zero-Code Webhook & Zapier Automation Flows", tag: "webhook-automation" },
    { subAr: "تدقيق تكاليف الاشتراكات والبرمجيات وتقليص النفقات", subEn: "SaaS Stack Audit & Tool Cost Reduction", tag: "saas-cost-reduction" },
    { subAr: "إدارة العمل الجماعي غير المتزامن واجتماعات الوقوف الفعالة", subEn: "Async Team Rhythms & Standup Optimization", tag: "async-team-rhythms" },
    { subAr: "بروتوكولات مراقبة الجودة ومنع الأخطاء التشغيلية الفادحة", subEn: "Operational Quality Assurance & Poka-Yoke", tag: "qa-poka-yoke" },
    { subAr: "إدارة سعة الفرق ومواجهة اختناقات التسليم في المشروعات", subEn: "Capacity Planning & Bottleneck Elimination", tag: "capacity-bottlenecks" },
    { subAr: "خطة التدريب والإدماج السريع للموظفين الجدد (Fast Onboarding)", subEn: "Rapid Employee Onboarding Workflows", tag: "employee-ramp-up" },
    { subAr: "التفاوض مع الموردين وإدارة اتفاقيات مستوى الخدمة (SLAs)", subEn: "Vendor Management & SLA Enforcement", tag: "vendor-sla-enforcement" },
    { subAr: "حفظ المعرفة المؤسسية وتوثيق الويكي الداخلي (Company Wiki)", subEn: "Internal Knowledge Base & Wiki Architecture", tag: "internal-wiki-docs" }
  ],
  finance: [
    { subAr: "هندسة باقات التسعير السلوكي وتأثير الطعم (Decoy Pricing)", subEn: "Behavioral Decoy Pricing Architecture", tag: "decoy-pricing-model" },
    { subAr: "تحليل اقتصاديات الوحدة ونسب CAC إلى LTV لتحقيق الربحية", subEn: "Unit Economics (CAC:LTV & Payback Period)", tag: "unit-economics-cac-ltv" },
    { subAr: "إدارة التدفقات النقدية وتسريع وتيرة التحصيل", subEn: "Cash Flow Acceleration & Runway Extension", tag: "cashflow-runway" },
    { subAr: "بناء النماذج المالية وتوقعات الإيرادات للشركات الناشئة", subEn: "Financial Projections & Three-Statement Modeling", tag: "financial-projections" },
    { subAr: "إعداد مذكرات المستثمرين والشرائح المالية لعروض التمويل", subEn: "Investor Pitch Deck Financial Slides & Data Room", tag: "investor-financial-slides" },
    { subAr: "استراتيجيات تقليل النفقات التشغيلية (OpEx Optimization)", subEn: "Operating Expense (OpEx) Trimming Strategies", tag: "opex-trimming" },
    { subAr: "الوقاية من نزاعات الدفع واسترداد الأموال غير المشروع (Chargebacks)", subEn: "Chargeback Prevention & Fraud Mitigation", tag: "chargeback-prevention" },
    { subAr: "تصميم باقات الاشتراكات السنوية بخصومات نقدية مغرية", subEn: "Annual Plan Conversion & Cash-Upfront Incentives", tag: "annual-plan-incentives" }
  ],
  hr: [
    { subAr: "بطاقات تقييم التوظيف النخبوي للمناصب القيادية (Scorecards)", subEn: "A-Player Role Scorecard & Hiring Criteria", tag: "role-scorecards" },
    { subAr: "تصميم المقابلات السلوكية العميقة لاكتشاف الحقائق (STAR Method)", subEn: "Deep Behavioral Interview Scenarios (STAR)", tag: "behavioral-star-interviews" },
    { subAr: "تصميم مهام العمل العملية المدفوعة لتقييم الكفاءة الحقيقية", subEn: "Paid Work-Sample Test Protocols", tag: "paid-work-samples" },
    { subAr: "خطة نجاح الموظف في أول 90 يوماً وقياس مؤشرات الإنجاز", subEn: "30-60-90 Day High-Impact Onboarding Plans", tag: "30-60-90-plans" },
    { subAr: "محادثات التغذية الراجعة الصريحة وخطط تحسين الأداء (PIP)", subEn: "Radical Candor Feedback & PIP Frameworks", tag: "radical-candor-pip" },
    { subAr: "خطط الاحتفاظ بالكفاءات النادرة ومنع تسرب المواهب", subEn: "Top Talent Retention & Golden Handcuffs", tag: "talent-retention" },
    { subAr: "تصميم هيكل الحوافز والمكافآت القائمة على النتائج والأرباح", subEn: "Performance-Based Compensation & Bonus Structures", tag: "performance-compensation" }
  ],
  retention: [
    { subAr: "خطة اعتراض العميل الغاضب ومنع الإلغاء (Churn Interception)", subEn: "Escalated Churn Interception & Rescue Playbook", tag: "churn-interception" },
    { subAr: "مصفوفة درجات صحة العملاء واكتشاف مؤشرات التوقف المبكرة", subEn: "Customer Health Scorecards & At-Risk Triggers", tag: "customer-health-scores" },
    { subAr: "بروتوكولات احتواء الشكاوى الحادة وتجاوز خروقات الدعم الفني", subEn: "De-escalation Protocols for Support Breaches", tag: "support-de-escalation" },
    { subAr: "برامج استعادة العملاء السابقين بحملات إعادة التنشيط", subEn: "Win-Back Email & Promotional Revival Funnels", tag: "win-back-funnels" },
    { subAr: "استخلاص التقييمات الإيجابية الصادقة من المشتركين الراضين", subEn: "NPS Survey Feedback Loops & Advocacy Mining", tag: "nps-advocacy-mining" },
    { subAr: "مكافآت الولاء وتجارب الإبهار غير المتوقعة للعملاء المميزين", subEn: "Surprise-and-Delight VIP Retention Campaigns", tag: "vip-retention-delight" },
    { subAr: "برامج إدماج المستخدمين الجدد لمنع الإحباط الأولي", subEn: "Post-Purchase Onboarding to Prevent Buyer Remorse", tag: "post-purchase-onboarding" }
  ],
  data: [
    { subAr: "استعلامات SQL المتقدمة لتحليل أفواج الاحتفاظ (Cohort Retention)", subEn: "Advanced Cohort Retention & Churn SQL", tag: "sql-cohort-retention" },
    { subAr: "تصميم لوحات التحكم التنفيذية والمؤشر الشمالي للبيزنس (North Star)", subEn: "Executive KPI Dashboard & North Star Metric Trees", tag: "executive-kpi-dashboards" },
    { subAr: "التحليل الإحصائي واختبارات A/B للتأكد من المعنوية الإحصائية", subEn: "A/B Testing Statistical Significance Verification", tag: "ab-test-significance" },
    { subAr: "تقسيم العملاء سلوكياً بنظام RFM لاستهداف الصفقات الكبرى", subEn: "RFM Customer Segmentation & High-Value Clustering", tag: "rfm-segmentation" },
    { subAr: "استخراج نقاط التسرب في مسارات المبيعات والاشتراكات (Funnels)", subEn: "Multi-Touch Sales Funnel Drop-off Analysis", tag: "funnel-dropoff-analysis" },
    { subAr: "بناء مستودعات البيانات ونماذج النجوم الموحدة (Star Schema)", subEn: "Data Warehouse Star Schema & Dimensional Modeling", tag: "star-schema-modeling" },
    { subAr: "التدقيق في جودة البيانات وتجنب الأخطاء المحاسبية في التقارير", subEn: "Data Hygiene & Anomaly Detection Protocols", tag: "data-hygiene-audit" }
  ]
};

// Generate exactly 1,000 Prompts
const allPrompts = [];
let globalIndex = 1;

for (const catSpec of CATEGORY_SPECS) {
  const catKey = catSpec.key;
  const targetCount = catSpec.count;
  const domain = DOMAIN_DATA[catKey];
  const specialties = SUBTOPIC_SPECIALTIES[catKey] || [];
  
  console.log(`Generating ${targetCount} prompts for category: ${catKey}...`);

  for (let i = 0; i < targetCount; i++) {
    const spec = specialties[i % specialties.length];
    const role = domain.roles[i % domain.roles.length];
    const model = domain.models[i % domain.models.length];
    const diff = domain.difficulties[i % domain.difficulties.length];
    const impact = domain.impacts[i % domain.impacts.length];
    const baseTopic = domain.topics[i % domain.topics.length];

    const promptId = `p-${catKey}-${String(i + 1).padStart(3, "0")}`;
    const slug = `${catKey}-${spec.tag}-${i + 1}`;

    const titleAr = `${spec.subAr} · النموذج #${i + 1}`;
    const titleEn = `${spec.subEn} · Framework #${i + 1}`;

    // Specialized distinct variables for this prompt
    const promptVars = baseTopic.vars.map((v, vIdx) => ({
      ...v,
      name: `${v.name}_${i + 1}`
    }));

    // Rich distinct prompt instructions
    const promptTextAr = `[بنك برومبتات طوّرني للشركات · تصنيف: ${catSpec.ar} · كود: ${promptId}]
الدور المستهدف: ${role.ar} | النموذج المقترح: ${model} | المعيار: ${diff}

${baseTopic.templateAr(promptVars)}

تعليمات إضافية للتنفيذ النخبوي:
- قدم الإجابة مهيكلة بنقاط تنفيذية محددة بالأرقام والنسب المئوية.
- اذكر التكلفة المحتملة لعدم تطبيق هذه الخطوات بالأرقام.
- صمم نداء عمل فوري (Next Action Step) قابل للبدء خلال 15 دقيقة فقط.`;

    const promptTextEn = `[Tawwerni Enterprise Prompts Vault · Category: ${catSpec.en} · ID: ${promptId}]
Target Persona: ${role.en} | Model: ${model} | Grade: ${diff}

${baseTopic.templateEn(promptVars)}

Execution Guidelines:
- Structure deliverables with tangible KPIs, percentages, and dollar impact.
- Highlight the risk of inaction and cost of low-quality alternatives.
- Provide a low-friction actionable next step executable within 15 minutes.`;

    const prompt = {
      id: promptId,
      slug: slug,
      category: catKey,
      categoryAr: catSpec.ar,
      categoryEn: catSpec.en,
      titleAr: titleAr,
      titleEn: titleEn,
      targetRoleAr: role.ar,
      targetRoleEn: role.en,
      difficulty: diff,
      recommendedModel: model,
      impactBadgeAr: impact.ar,
      impactBadgeEn: impact.en,
      promptTextAr: promptTextAr,
      promptTextEn: promptTextEn,
      variables: promptVars,
      usageTipAr: `${baseTopic.tipAr} (يوفر لك أداة تنفيذية جاهزة وموثوقة بنسبة 100%).`,
      usageTipEn: `${baseTopic.tipEn} (Provides a battle-tested enterprise-grade framework).`
    };

    allPrompts.push(prompt);
    globalIndex++;
  }
}

console.log(`Generated total of ${allPrompts.length} prompts.`);

// Write prompts to JSON file
const outputPath = path.join(__dirname, "..", "src", "content", "vip-prompts-1000.json");
fs.writeFileSync(outputPath, JSON.stringify(allPrompts, null, 2), "utf-8");
console.log(`Successfully written 1,000 prompts to: ${outputPath}`);

// Also generate a summary report
const summaryByCat = {};
for (const p of allPrompts) {
  summaryByCat[p.category] = (summaryByCat[p.category] || 0) + 1;
}
console.log("Prompts breakdown by category:", summaryByCat);
