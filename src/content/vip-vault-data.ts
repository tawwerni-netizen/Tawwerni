export interface LegalContract {
  id: string;
  slug: string;
  titleAr: string;
  titleEn: string;
  taglineAr: string;
  taglineEn: string;
  categoryAr: string;
  categoryEn: string;
  riskAvoidedAr: string;
  riskAvoidedEn: string;
  estimatedLegalCostSavedEgp: number;
  contentAr: string;
  contentEn: string;
  fillableFields: { key: string; labelAr: string; labelEn: string; defaultValue: string }[];
}

export interface PromptTemplate {
  id: string;
  slug: string;
  category:
    | "strategy"
    | "sales"
    | "marketing"
    | "engineering"
    | "operations"
    | "finance"
    | "hr"
    | "retention"
    | "freelance"
    | "product"
    | "data";
  categoryAr: string;
  categoryEn: string;
  titleAr: string;
  titleEn: string;
  targetRoleAr: string;
  targetRoleEn: string;
  difficulty: "Executive" | "Pro" | "Advanced";
  recommendedModel: "Gemini Pro" | "Claude 3.7" | "GPT-4o";
  impactBadgeAr: string;
  impactBadgeEn: string;
  promptTextAr: string;
  promptTextEn: string;
  variables: { name: string; labelAr: string; placeholder: string }[];
  usageTipAr: string;
  usageTipEn: string;
}

export const LEGAL_CONTRACTS: LegalContract[] = [
  {
    id: "contract-1",
    slug: "freelance-master-services-agreement",
    titleAr: "عقد تقديم خدمات عمل حر متكامل (حماية الأتعاب والتسليم)",
    titleEn: "Master Freelance Services Agreement (Full Fee Protection)",
    taglineAr: "عقد قانوني ملزم يضمن استلامك لمقدم 50% ويقنن عدد التعديلات ويمنع المماطلة",
    taglineEn: "Legally binding MSA enforcing 50% upfront, caps revisions, and prevents client delays",
    categoryAr: "العقود التشغيلية الأساسية",
    categoryEn: "Core Operational Contracts",
    riskAvoidedAr: "تجنب هروب العميل بدون دفع، أو طلب تعديلات لا نهائية مجانًا",
    riskAvoidedEn: "Prevents client disappearing unpaid, or demanding infinite scope creep",
    estimatedLegalCostSavedEgp: 5000,
    fillableFields: [
      { key: "CLIENT_NAME", labelAr: "اسم العميل أو الشركة", labelEn: "Client/Company Name", defaultValue: "شركة الأفق للاستشارات" },
      { key: "CLIENT_CR", labelAr: "السجل التجاري أو الرقم القومي للعميل", labelEn: "Client CR / National ID", defaultValue: "123456789" },
      { key: "FREELANCER_NAME", labelAr: "اسم المستقل الكامل", labelEn: "Freelancer Full Name", defaultValue: "محمد أحمد علي" },
      { key: "FREELANCER_ID", labelAr: "الرقم القومي للمستقل", labelEn: "Freelancer National ID", defaultValue: "29501011234567" },
      { key: "PROJECT_NAME", labelAr: "اسم المشروع ونطاق العمل", labelEn: "Project Scope Name", defaultValue: "تطوير المتجر الإلكتروني والهوية الرقمية" },
      { key: "TOTAL_PRICE_EGP", labelAr: "إجمالي المقابل المادي (ج.م)", labelEn: "Total Amount (EGP)", defaultValue: "25000" },
      { key: "UPFRONT_EGP", labelAr: "دفعة المقدم (50%)", labelEn: "Upfront Payment (50%)", defaultValue: "12500" },
      { key: "DELIVERY_DAYS", labelAr: "مدة التنفيذ (أيام عمل)", labelEn: "Delivery Period (Days)", defaultValue: "21" },
      { key: "GOVERNING_CITY", labelAr: "مدينة المحكمة المختصة", labelEn: "Jurisdiction City", defaultValue: "القاهرة" },
    ],
    contentAr: `عقد تقديم خدمات واستشارات مهنية (عمل حر)

إنه في يوم [تاريخ اليوم]، تم الاتفاق والتراضي بين كلٍ من:
أولاً: الطرف الأول (العميل):
السيد/ شركة: [CLIENT_NAME]، سجل تجاري / رقم قومي: [CLIENT_CR]، ومقرها المختار: [عنوان العميل].
(ويُشار إليه فيما بعد بـ "الطرف الأول" أو "العميل").

ثانياً: الطرف الثاني (مقدّم الخدمة / المستقل):
السيد: [FREELANCER_NAME]، مصري الجنسية، بطاقة رقم قومي: [FREELANCER_ID]، ومقره المختار: [عنوان المستقل].
(ويُشار إليه فيما بعد بـ "الطرف الثاني" أو "المستقل").

تمهيد:
بما أن الطرف الأول يرغب في الاستعانة بخبرة الطرف الثاني لتنفيذ مشروع: [PROJECT_NAME]، وحيث إن الطرف الثاني يمتلك الكفاءة والخبرة اللازمة لتنفيذ تلك المهام وفق المعايير المهنية، فقد اتفق الطرفان بكامل أهليتهما القانونية على البنود الآتية:

البند الأول: موضوع العقد ونطاق العمل (Scope of Work):
يلتزم الطرف الثاني بتنفيذ وتسليم مخرجات مشروع [PROJECT_NAME] بدقة واحترافية وفق المواصفات الفنية الملحقة بهذا العقد. وأي طلبات أو خصائص لم تذكر صراحةً في هذا العقد تعتبر خارج نطاق العمل وتخضع لاتفاق مالي وزمني مستقل.

البند الثاني: المقابل المالي وطريقة السداد (Payment Terms):
1. اتفق الطرفان على أن إجمالي المقابل المادي لقاء تنفيذ المشروع هو [TOTAL_PRICE_EGP] جنيه مصري فقط لا غير.
2. يتم سداد المستحقات على مرحلتين غير قابلتين للتجزئة:
   أ- الدفعة الأولى (مقدم تعاقد بنسبة 50%): وقيمتها [UPFRONT_EGP] جنيه مصري، تُسدد فور التوقيع على هذا العقد ولا يبدأ الطرف الثاني في أي عمل تنفيذي قبل تأكيد استلام هذا المبلغ بحسابه البنكي أو المحفظة الإلكترونية.
   ب- الدفعة الثانية (دفعة التسليم النهائي بنسبة 50%): وقيمتها [UPFRONT_EGP] جنيه مصري، تُسدد قبل تسليم الأكواد المصدرية النهائية / ملفات التصميم المفتوحة / كلمة سر النشر.
3. المبالغ المدفوعة كمقدم تعاقد غير قابلة للاسترداد بعد مضي 24 ساعة من تاريخ العقد لتغطية حجز الوقت والجهد التحضيري.

البند الثالث: مدة التنفيذ والتسليم (Timeline & Milestones):
1. يلتزم الطرف الثاني بتسليم النسخة الأولية للاعتماد خلال [DELIVERY_DAYS] يوم عمل، تبدأ من اليوم التالي لاستلام الدفعة المقدمة وكافة المواد والمعلومات اللازمة من الطرف الأول.
2. أي تأخير من الطرف الأول في تزويد الطرف الثاني بالبيانات أو الاعتمادات يترتب عليه تمديد مدة التسليم تلقائياً بنفس فترة التأخير.

البند الرابع: ضوابط الملاحظات والتعديلات (Revisions Policy):
1. يحق للطرف الأول تقديم جولة واحدة من الملاحظات والتعديلات (بحد أقصى جولتين) شريطة أن تكون داخلة في نطاق العمل الأصلي المتفق عليه، وأن تُرسل مكتوبة دفعة واحدة خلال 3 أيام عمل من تاريخ استلام النسخة الأولية.
2. أي تعديلات تتضمن تغييرات جوهرية أو خروجاً عن التصور الأولي، أو أي طلبات تعديل إضافية بعد استنفاد الجولتين، تُحاسب بسعر منفصل قدره 500 جنيه مصري لكل ساعة عمل إضافية.

البند الخامس: حقوق الملكية الفكرية المعلقة (Conditional IP Transfer):
تبقى كافة حقوق الملكية الفكرية، وحقوق المؤلف، والأكواد البرمجية، والتصاميم المبتكرة ملكاً خالصاً وحصرياً للطرف الثاني (المستقل)، ولا تنتقل ملكيتها أو ترخيص استغلالها التجاري للطرف الأول إلا بعد سداد كامل المقابل المادي المتفق عليه بالبند الثاني بنسبة 100%. وفي حال استخدام الطرف الأول للمخرجات قبل السداد الكامل، يُعد ذلك تعدياً جنائياً ومدنياً على حقوق الملكية الفكرية.

البند السادس: غرامات التأخير والإخلال:
في حال تأخر الطرف الأول عن سداد الدفعة النهائية عن موعد استحقاقها بأكثر من 5 أيام عمل، يُلزم بسداد فائدة تأخير اتفاقية قدرها 1.5% عن كل أسبوع تأخير، ويحق للطرف الثاني تعليق كافة الخدمات فوراً وإيقاف الخوادم أو تسليم المواد حتى السداد الكامل.

البند السابع: إنهاء العقد (Termination):
في حال رغبة الطرف الأول في إلغاء المشروع قبل اكتماله، يلتزم بسداد قيمة كامل ساعات العمل والجهد المبذول حتى تاريخ الإخطار، ولا يحق له استرداد دفعة المقدم بحال من الأحوال.

البند الثامن: القانون الواجب التطبيق والاختصاص القضائي:
يخضع هذا العقد ويفسر وفقاً لأحكام القانون المصري. وتختص محاكم [GOVERNING_CITY] بنظر أي نزاع قد ينشأ عن تنفيذ أو تفسير بنود هذا العقد.

حرر هذا العقد من نسختين بيد كل طرف نسخة للعمل بموجبها عند اللزوم.
الطرف الأول (العميل): ........................    الطرف الثاني (المستقل): ........................`,
    contentEn: `MASTER FREELANCE PROFESSIONAL SERVICES AGREEMENT

This Agreement is entered into on [Date] by and between:
Client: [CLIENT_NAME] (Tax ID / Reg: [CLIENT_CR])
Freelance Contractor: [FREELANCER_NAME] (ID: [FREELANCER_ID])

1. SCOPE OF SERVICES:
The Contractor agrees to perform the services defined under "[PROJECT_NAME]". Any requests beyond the agreed specifications shall constitute a scope change and require separate written approval and billing.

2. COMPENSATION & PAYMENT TERMS:
Total Fee: [TOTAL_PRICE_EGP] EGP.
- Upfront Deposit (50%): [UPFRONT_EGP] EGP due immediately upon signing before any work commences (non-refundable).
- Final Milestone (50%): [UPFRONT_EGP] EGP due upon completion prior to releasing final source code, production deployment credentials, or raw master design files.

3. REVISIONS & CHANGE ORDERS:
Deliverables include up to two (2) rounds of constructive consolidated revisions requested within three (3) business days of milestone delivery. Out-of-scope alterations are billed at an hourly rate of 500 EGP / hour.

4. CONDITIONAL INTELLECTUAL PROPERTY TRANSFER:
All intellectual property, codebases, assets, and copyrights remain the exclusive property of the Contractor until the Client has settled 100% of all invoices. Unauthorized commercial deployment prior to full payment constitutes copyright infringement.

5. JURISDICTION:
This Agreement is governed by the laws of Egypt, and any disputes shall be resolved exclusively before the competent courts of [GOVERNING_CITY].

Client Signature: ____________________    Contractor Signature: ____________________`,
  },
  {
    id: "contract-2",
    slug: "mutual-non-disclosure-agreement-nda",
    titleAr: "اتفاقية عدم إفصاح وحماية السرية التجارية (NDA متبادلة)",
    titleEn: "Mutual Non-Disclosure Agreement (NDA)",
    taglineAr: "تحمي أفكارك، أكوادك، استراتيجياتك وبيانات عميلك وتمنع سرقة الفكرة أو تسريبها",
    taglineEn: "Guarantees confidentiality of proprietary code, trade secrets, and client data",
    categoryAr: "حماية الأسرار والملكية",
    categoryEn: "Confidentiality & IP",
    riskAvoidedAr: "سرقة فكرة مشروعك أو استخدام خوارزمياتك وأكوادك الخاصة بدون إذنك",
    riskAvoidedEn: "Protects proprietary algorithms and product blueprints from being leaked",
    estimatedLegalCostSavedEgp: 3500,
    fillableFields: [
      { key: "PARTY_A", labelAr: "الطرف الأول", labelEn: "Party A", defaultValue: "شركة المستقبل للبرمجيات" },
      { key: "PARTY_B", labelAr: "الطرف الثاني (المستقل)", labelEn: "Party B (Freelancer)", defaultValue: "أحمد محمود حسن" },
      { key: "PURPOSE", labelAr: "الغرض من تبادل المعلومات", labelEn: "Disclosure Purpose", defaultValue: "دراسة وتطوير تطبيق الذكاء الاصطناعي للأتمتة" },
      { key: "DURATION_YEARS", labelAr: "مدة سريان السرية (سنوات)", labelEn: "Duration (Years)", defaultValue: "2" },
      { key: "PENALTY_EGP", labelAr: "الشرط الجزائي عند الإخلال (ج.م)", labelEn: "Breach Penalty (EGP)", defaultValue: "100000" },
    ],
    contentAr: `اتفاقية سرية وعدم إفصاح متبادلة (Mutual Non-Disclosure Agreement)

بين كل من:
الطرف الأول: [PARTY_A]
الطرف الثاني: [PARTY_B]

١. تعريف المعلومات السرية:
تشمل كافة البيانات الفنية، والبرمجية، والتصاميم، والخوارزميات، وقواعد البيانات، وخطط العمل، وأسرار التسويق، التي يفصح عنها أي طرف للآخر في إطار: [PURPOSE].

٢. الالتزام بالحفاظ على السرية:
يتعهد كل طرف بعدم نسخ، أو نشر، أو نقل، أو إفشاء أي جزء من المعلومات السرية للغير، وألا يستخدمها إلا للغرض المصرح به حصرًا.

٣. المدة:
تظل هذه الاتفاقية سارية وملزمة للطرفين طوال فترة التعاون ولمدة [DURATION_YEARS] سنوات من تاريخ انتهائه.

٤. الشرط الجزائي:
يلتزم الطرف المخل بدفع تعويض اتفاقي غير خاضع لرقابة القضاء قدره [PENALTY_EGP] جنيه مصري فور ثبوت الإفشاء، مع حفظ حق الطرف المتضرر في التعويض التكميلي عن الأضرار المادية والأدبية.

توقيع الطرف الأول: ........................    توقيع الطرف الثاني: ........................`,
    contentEn: `MUTUAL NON-DISCLOSURE AGREEMENT (NDA)

Between: [PARTY_A] and [PARTY_B]
Purpose: [PURPOSE]

1. CONFIDENTIAL INFORMATION:
Includes all technical specifications, code, trade secrets, architecture, and business strategies disclosed in connection with the Purpose.

2. OBLIGATIONS:
Each party agrees to safeguard the other's proprietary information with strict confidentiality and not disclose it to any third party for a period of [DURATION_YEARS] years.

3. LIQUIDATED DAMAGES:
Breach of this agreement incurs liquidated damages of [PENALTY_EGP] EGP without prejudice to additional injunctive remedies.`,
  },
  {
    id: "contract-3",
    slug: "milestone-acceptance-and-scope-protection",
    titleAr: "محضر تسليم مرحلي وحماية نطاق العمل (ضد التعديل المجاني)",
    titleEn: "Milestone Acceptance Sign-off Protocol",
    taglineAr: "وثيقة توقيع رسمي لكل مرحلة تُخلي مسؤوليتك وتمنع العميل من الرجوع في كلامه",
    taglineEn: "Formal milestone sign-off sheet preventing retrospective change demands",
    categoryAr: "إدارة المشاريع والتسليم",
    categoryEn: "Project Management",
    riskAvoidedAr: "اعتراض العميل على ما تم تسليمه مسبقاً أو المطالبة بإعادة بناء الأساسات مجاناً",
    riskAvoidedEn: "Prevents clients reversing accepted milestones or demanding rewrites",
    estimatedLegalCostSavedEgp: 2500,
    fillableFields: [
      { key: "CLIENT_NAME", labelAr: "اسم العميل", labelEn: "Client Name", defaultValue: "مؤسسة النور للتجارة" },
      { key: "FREELANCER_NAME", labelAr: "اسم المستقل", labelEn: "Freelancer Name", defaultValue: "كريم شريف" },
      { key: "MILESTONE_TITLE", labelAr: "عنوان المرحلة المنجزة", labelEn: "Milestone Title", defaultValue: "المرحلة الأولى: الواجهات وتجربة المستخدم (UI/UX)" },
      { key: "DELIVERABLE_SUMMARY", labelAr: "ملخص ما تم تسليمه", labelEn: "Deliverables Summary", defaultValue: "تصاميم الويب والموبايل التفاعلية بنسخة فيجما النهائية" },
    ],
    contentAr: `محضر استلام واعتماد مرحلي نهائي (Milestone Sign-off)

المشروع: [MILESTONE_TITLE]
العميل: [CLIENT_NAME]
المستقل: [FREELANCER_NAME]

إقرار استلام واعتماد:
يقر العميل [CLIENT_NAME] بأنه عاين وفحص مخرجات [MILESTONE_TITLE] المتمثلة في ([DELIVERABLE_SUMMARY])، ويشهد بأنها مطابقة للمواصفات الفنية المتفق عليها وخالية من العيوب، ويعلن قبوله التام والنهائي لها دون أي تحفظ.

الآثار المترتبة على هذا المحضر:
١. يترتب على توقيع هذا المحضر استحقاق المستقل للدفعة المالية المقررة لهذه المرحلة فورًا.
٢. يعتبر العمل في هذه المرحلة منتهيًا تمامًا، ولا يحق للعميل مستقبلاً طلب أي تعديلات مجانية على هذه المخرجات.
٣. أي تعديل مستقبلي يطلب في عناصر هذه المرحلة يخضع لتسعير وتمديد زمني مستقل (Change Order).

توقيع العميل بالاعتماد النهائي: ........................    التاريخ: ........................`,
    contentEn: `FORMAL MILESTONE ACCEPTANCE CERTIFICATE

Project: [MILESTONE_TITLE]
Client: [CLIENT_NAME] | Contractor: [FREELANCER_NAME]

The Client certifies that the deliverables for [MILESTONE_TITLE] ([DELIVERABLE_SUMMARY]) have been fully inspected, verified, and accepted without reservation.
All financial dues linked to this milestone are immediately payable, and any subsequent modifications shall constitute a separate billable change request.`,
  },
  {
    id: "contract-4",
    slug: "overdue-payment-legal-demand-notice",
    titleAr: "إنذار ومطالبة قانونية رسمية بمستحقات مالية متأخرة",
    titleEn: "Formal Overdue Payment Demand Notice",
    taglineAr: "صيغة قانونية شديدة الحزم تُرسل للعميل المماطل تمنحه 5 أيام قبل التوجه للمحكمة",
    taglineEn: "Pre-litigation demand letter giving non-paying client 5 days before court action",
    categoryAr: "تحصيل الديون والمستحقات",
    categoryEn: "Debt Recovery",
    riskAvoidedAr: "مماطلة العميل وتهربه من دفع باقي الأتعاب بعد تسلم المشروع",
    riskAvoidedEn: "Stops non-paying clients from ghosting without settling outstanding invoices",
    estimatedLegalCostSavedEgp: 4000,
    fillableFields: [
      { key: "CLIENT_NAME", labelAr: "اسم العميل المتأخر", labelEn: "Debtor Name", defaultValue: "شركة الأهرام للتسويق" },
      { key: "INVOICE_NUMBER", labelAr: "رقم الفاتورة أو العقد", labelEn: "Invoice / Contract No.", defaultValue: "INV-2026-089" },
      { key: "AMOUNT_DUE_EGP", labelAr: "المبلغ المستحق (ج.م)", labelEn: "Amount Due (EGP)", defaultValue: "18500" },
      { key: "DAYS_OVERDUE", labelAr: "عدد أيام التأخير", labelEn: "Days Overdue", defaultValue: "25" },
      { key: "DEADLINE_DATE", labelAr: "تاريخ المهلة النهائية", labelEn: "Final Deadline Date", defaultValue: "15 أكتوبر 2026" },
    ],
    contentAr: `إنذار وتكليف رسمي بالوفاء بمستحقات مالية (قبل اتخاذ الإجراءات القضائية)

إلى السيد/ الممثل القانوني لشركة: [CLIENT_NAME]
تحية طيبة وبعد،

الموضوع: إخطار نهائي ومطالبة بسداد الفاتورة رقم [INVOICE_NUMBER] بمبلغ [AMOUNT_DUE_EGP] ج.م.

نحيطكم علماً بأن ذمتكم المالية مشغولة بمبلغ قدره [AMOUNT_DUE_EGP] جنيه مصري، نظير الأعمال والخدمات المهنية المنفذة لصالحكم والتي تم تسليمها واعتمادها من جانبكم، وقد مضى على ميعاد استحقاق السداد أكثر من [DAYS_OVERDUE] يوماً رغم المطالبات الودية المتكررة.

بناءً عليه؛ نمنحكم مهلة نهائية وأخيرة غايتها يوم [DEADLINE_DATE] لسداد كامل المبلغ أعلاه عبر الحساب البنكي المعتمد.

وفي حال انقضاء هذه المهلة دون إتمام السداد:
١. سيتم سحب ترخيص الاستخدام وإيقاف الخوادم والخدمات البرمجية فوراً لعدم استيفاء المقابل المادي.
٢. سنشرع فوراً ودون حاجة لأي إعذار آخر في اتخاذ كافة الإجراءات القضائية المدنية والجنائية (جنحة نصب وتعدٍ على حقوق الملكية الفكرية)، مع إلزامكم بكافة التعويضات، والفوائد القانونية، وأتعاب المحاماة والمصروفات.

نأمل تسوية الأمر ودياً قبل تصعيده للنيابة والمحاكم المختصة.
مقدمه: ........................    التاريخ: ........................`,
    contentEn: `FORMAL PRE-LEGAL DEMAND FOR OVERDUE PAYMENT

To: [CLIENT_NAME]
Reference: Invoice/Contract #[INVOICE_NUMBER]
Amount Outstanding: [AMOUNT_DUE_EGP] EGP (Overdue by [DAYS_OVERDUE] days)

You are hereby formally notified that the amount of [AMOUNT_DUE_EGP] EGP remains past due despite prior notifications.
Failure to settle this account in full on or before [DEADLINE_DATE] will result in:
1. Immediate revocation of all licenses and suspension of services.
2. Initiation of legal proceedings seeking the principal sum plus statutory late payment damages and legal costs.`,
  },
  {
    id: "contract-5",
    slug: "source-code-and-asset-retention-clause",
    titleAr: "بند حجز الأكواد المصدرية والملفات المفتوحة حتى السداد الكامل",
    titleEn: "Source Code & Master Asset Retention Clause",
    taglineAr: "بند ذهبي يُضاف لأي عرض سعر أو بريف يمنع العميل من الحصول على السورس كود مجاناً",
    taglineEn: "Golden contractual clause withholding source code and master files until 100% paid",
    categoryAr: "بنود الحماية الفورية",
    categoryEn: "Protective Clauses",
    riskAvoidedAr: "حصول العميل على ملفات العمل واستكمالها مع مطور رخيص دون سداد مستحقاتك",
    riskAvoidedEn: "Client taking source code to a cheaper developer without paying your final bill",
    estimatedLegalCostSavedEgp: 2000,
    fillableFields: [
      { key: "HOURLY_RATE_EGP", labelAr: "تكلفة ساعة التطوير الإضافية", labelEn: "Hourly Rate (EGP)", defaultValue: "600" },
    ],
    contentAr: `بند حجز الكود المصدري وحظر النشر (Source Code Retention Clause):

"يقر الطرف الأول (العميل) بأن مخرجات المشروع البرمجية والتصميمية المنفذة من الطرف الثاني لا تشمل نقل الأكواد المصدرية الكاملة (Source Code)، أو ملفات التصميم الأصلية المفتوحة (Raw Files / Figma editable / PSD)، أو صلاحيات السيرفر الجذرية (Root Access)، إلا بعد سداد 100% من كامل المستحقات المالية المتفق عليها.

ويحظر تماماً على العميل نشر، أو تعديل، أو تفكيك، أو إعادة استخدام الكود البرمجي بواسطة أي طرف ثالث قبل الوفاء بكامل الأتعاب، وإلا التزم بسداد تعويض فوري يعادل ضعف إجمالي قيمة العقد، مع أحقية المستقل في إيقاف السيرفر فوراً."`,
    contentEn: `SOURCE CODE & ASSET RETENTION CLAUSE:
Under no circumstances shall the Client be provided with raw source code, production repositories, editable master design files, or root administrative credentials until all associated fees have been remitted and cleared in full. Any deployment prior to final settlement is strictly prohibited.`,
  },
];

import vipPromptsJson from "./vip-prompts-1000.json";

export const PROMPTS_VAULT: PromptTemplate[] = vipPromptsJson as unknown as PromptTemplate[];
export const TOTAL_PROMPTS_COUNT = PROMPTS_VAULT.length;

