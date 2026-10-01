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
  category: "strategy" | "sales" | "marketing" | "engineering" | "operations" | "finance" | "hr" | "retention";
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

export const PROMPTS_VAULT: PromptTemplate[] = [
  // 1. STRATEGY
  {
    id: "p-strat-01",
    slug: "blue-ocean-enterprise-moat",
    category: "strategy",
    categoryAr: "استراتيجية الشركات والتوسع",
    categoryEn: "Strategy & Scaling",
    titleAr: "هندسة الخندق التنافسي واستراتيجية المحيط الأزرق للشركات",
    titleEn: "Enterprise Blue Ocean Moat Architecture",
    targetRoleAr: "الرؤساء التنفيذيون ورواد الأعمال",
    targetRoleEn: "CEOs & Founders",
    difficulty: "Executive",
    recommendedModel: "Claude 3.7",
    impactBadgeAr: "يوفّر استشارات بقيمة $5,000",
    impactBadgeEn: "Saves $5k Strategy Consulting",
    variables: [
      { name: "COMPANY_NAME", labelAr: "اسم الشركة أو المشروع", placeholder: "منصة تدريب تقني B2B" },
      { name: "INDUSTRY", labelAr: "المجال والسوق المستهدف", placeholder: "التعليم الإلكتروني للشركات في الخليج" },
      { name: "MAIN_COMPETITORS", labelAr: "أهم المنافسين الحاليين", placeholder: "كورسيرا، لينكدإن ليرنينج، مراكز تدريب محلية" },
      { name: "CURRENT_PAIN", labelAr: "المعاناة الحالية في السوق", placeholder: "أسعار اشتراكات باهظة بدون تطبيق عملي حقيقي للموظفين" },
    ],
    usageTipAr: "انسخ البرومبت بالكامل وضعه في Claude 3.7 أو ChatGPT مع ملء المتغيرات للحصول على مصفوفة استراتيجية تنفيذية فورية.",
    usageTipEn: "Paste directly into Claude 3.7 or ChatGPT with filled variables for executive-level strategy deliverables.",
    promptTextAr: `أنت الآن تشغل منصب الشريك الإداري وكبير مستشاري الاستراتيجية في كبرى شركات الاستشارات العالمية (McKinsey / BCG).
مهمتك: صياغة خطة استراتيجية جذرية لاختراق السوق لشركة: [COMPANY_NAME] العاملة في قطاع: [INDUSTRY].

السياق التنافسي:
- المنافسون الرئيسيون: [MAIN_COMPETITORS]
- الفجوة ونقاط الألم الحالية في السوق: [CURRENT_PAIN]

المطلوب إعداده بتفصيل استراتيجي دقيق وخالٍ من العموميات:
1. "مصفوفة الإلغاء والتقليص والرفع والابتكار (ERRC Grid)":
   - 3 عناصر يجب إلغاؤها تماماً من المعايير التقليدية للقطاع لتقليل التكاليف.
   - 3 عناصر يجب تقليصها إلى ما دون متوسط السوق.
   - 3 عناصر يجب رفعها فوق أعلى معيار تنافسي موجود.
   - 3 عناصر جديدة كلياً يجب ابتكارها لم يسبق لأي منافس تقديمها.

2. "هندسة الخندق التنافسي (Economic Moat)":
   - تحديد آلية بناء تأثير الشبكة (Network Effects) وتكاليف الانتقال (Switching Costs) التي تمنع العميل من التحول للمنافسين.

3. "مؤشرات الأداء التشغيلية للأشهر الستة القادمة (OKRs)":
   - صياغة 3 أهداف طموحة و 4 نتائج رئيسية قابلة للقياس الرقمي لكل هدف.`,
    promptTextEn: `Act as a Senior Partner at McKinsey & Company specializing in competitive strategy. Develop a disruptive Blue Ocean Strategy for [COMPANY_NAME] operating within [INDUSTRY]. Current competitors: [MAIN_COMPETITORS]. Market friction: [CURRENT_PAIN]. Formulate an actionable ERRC grid, economic moat architecture, and 6-month OKRs.`,
  },
  {
    id: "p-strat-02",
    slug: "unit-economics-stress-test",
    category: "strategy",
    categoryAr: "استراتيجية الشركات والتوسع",
    categoryEn: "Strategy & Scaling",
    titleAr: "اختبار إجهاد الاقتصاديات الفردية (Unit Economics Stress Test)",
    titleEn: "Unit Economics & CAC/LTV Stress Test",
    targetRoleAr: "المدير المالي ورئيس النمو",
    targetRoleEn: "CFO & Head of Growth",
    difficulty: "Executive",
    recommendedModel: "Gemini Pro",
    impactBadgeAr: "حساب دقيق لـ CAC و LTV",
    impactBadgeEn: "Rigorous CAC/LTV Diagnostics",
    variables: [
      { name: "CAC", labelAr: "تكلفة اكتساب العميل الحالية (CAC)", placeholder: "40 دولار" },
      { name: "ARPU", labelAr: "متوسط العائد الشهري لكل عميل", placeholder: "15 دولار" },
      { name: "CHURN_RATE", labelAr: "معدل الإلغاء الشهري (Churn)", placeholder: "5%" },
      { name: "GROSS_MARGIN", labelAr: "هامش الربح الإجمالي", placeholder: "75%" },
    ],
    usageTipAr: "استخدم هذا البرومبت لتشخيص ربحية شركتك واكتشاف التسريبات المالية قبل السعي لجولات استثمارية.",
    usageTipEn: "Diagnose runway health and unit profitability before fundraising.",
    promptTextAr: `أنت كبير محللي الاستثمار في صندوق رأس مال مغامر (Tier-1 VC Partner).
البيانات المالية الحالية للمشروع:
- تكلفة اكتساب العميل (CAC): [CAC]
- متوسط الإيراد الشهري للعميل (ARPU): [ARPU]
- معدل التسرب الشهري (Churn): [CHURN_RATE]
- هامش الربح الإجمالي (Gross Margin): [GROSS_MARGIN]

المطلوب:
1. حساب دقيق للقيمة الدائمة للعميل (LTV) ونسبة (LTV:CAC Ratio) مع تحديد ما إذا كان النموذج قابلاً للتوسع أم يعاني من نزيف نقدي.
2. حساب فترة استرداد تكلفة العميل (CAC Payback Period بالأشهر).
3. سيناريو اختبار الإجهاد: ماذا يحدث للتدفق النقدي إذا ارتفعت تكلفة الإعلانات بنسبة 35% وارتفع التسرب بنسبة 2%؟
4. 5 توصيات تشغيلية فورية لمضاعفة LTV وتقليص فترة الاسترداد إلى أقل من 3 أشهر.`,
    promptTextEn: `Perform an institutional VC unit economics diagnostic. CAC: [CAC], ARPU: [ARPU], Churn: [CHURN_RATE], Margin: [GROSS_MARGIN]. Calculate LTV:CAC, CAC Payback in months, simulate stress scenarios, and provide 5 cashflow expansion levers.`,
  },

  // 2. SALES
  {
    id: "p-sales-01",
    slug: "high-ticket-cold-enterprise-sequence",
    category: "sales",
    categoryAr: "المبيعات والتفاوض وإغلاق الصفقات",
    categoryEn: "Sales & Negotiation",
    titleAr: "سلسلة رسائل استقطاب صفقات B2B عالية القيمة (Cold Outreach)",
    titleEn: "High-Ticket B2B Multi-Touch Cold Outreach Sequence",
    targetRoleAr: "مدراء المبيعات والمستقلين المحترفين",
    targetRoleEn: "Sales Directors & Deal Closers",
    difficulty: "Executive",
    recommendedModel: "Claude 3.7",
    impactBadgeAr: "معدل فتح +68% وردود فعلية",
    impactBadgeEn: "68%+ Open Rate Blueprint",
    variables: [
      { name: "TARGET_DECISION_MAKER", labelAr: "المنصب المستهدف بالشركة", placeholder: "المدير التقني CTO أو رئيس العمليات COO" },
      { name: "VALUE_OFFER", labelAr: "العرض والحل الذي تقدمه", placeholder: "تقليص تكاليف البنية التحتية السحابية بنسبة 30% وأتمتة النشر" },
      { name: "CASE_STUDY_METRIC", labelAr: "رقم حقيقي مثبت لعميل سابق", placeholder: "وفرنا لشركة س 45,000$ شهرياً في 60 يوماً" },
    ],
    usageTipAr: "هذا البرومبت يولد تسلسل 4 رسائل مدروسة نفسياً على لينكدإن والإيميل تتجنب الرسائل المبتذلة وتثير فضول المدراء التنفيذيين.",
    usageTipEn: "Generates an omnichannel 4-touch outreach sequence with psychological tension.",
    promptTextAr: `أنت أفضل خبير استقطاب صفقات B2B وإغلاق العقود الكبرى (Top 1% Enterprise SDR).
الهدف: كتابة تسلسل احترافي من 4 رسائل باردة موجهة لصناع القرار في منصب: [TARGET_DECISION_MAKER].
القيمة المقدمة: [VALUE_OFFER].
الإثبات الاجتماعي والرقمي: [CASE_STUDY_METRIC].

قواعد صارمة:
- لا تبدأ الرسائل بـ "أتمنى أن تكون بخير" أو "أود التحدث معك".
- اجعل كل رسالة أقل من 95 كلمة.
- ركز على ثقب الألم المالي والتشغيلي الذي يعاني منه صانع القرار شخصياً.
- استخدم نداء عمل (Low-friction CTA) لا يتطلب بيعاً فورياً بل يطلب فقط تبادل فكرة.

المطلوب:
1. الرسالة الأولى: "خطاف الفضول وثقب الألم غير المرئي".
2. الرسالة الثانية (بعد يومين): "مشاركة الأصل الرقمي أو دراسة الحالة المختصرة".
3. الرسالة الثالثة (بعد 5 أيام): "دراسة جدوى مصغرة وسؤال التحدي".
4. الرسالة الرابعة (رسالة الانسحاب بأدب / The Break-up Email): خلق ندرة تثير رغبة الرد العاجل.`,
    promptTextEn: `Compose a high-ticket 4-touch enterprise cold sequence targeting [TARGET_DECISION_MAKER] presenting [VALUE_OFFER] leveraging proof: [CASE_STUDY_METRIC]. Keep under 95 words per touch with frictionless CTAs.`,
  },
  {
    id: "p-sales-02",
    slug: "objection-reversal-script-price",
    category: "sales",
    categoryAr: "المبيعات والتفاوض وإغلاق الصفقات",
    categoryEn: "Sales & Negotiation",
    titleAr: "تفكيك اعتراض 'سعركم مرتفع جدًا' وتحويله إلى إغلاق فوري",
    titleEn: "Mastering the 'Your Price is Too High' Enterprise Objection",
    targetRoleAr: "مسؤولو المبيعات والمفاوضون",
    targetRoleEn: "Account Executives & Closers",
    difficulty: "Pro",
    recommendedModel: "GPT-4o",
    impactBadgeAr: "إغلاق صفقات بدون تخفيض السعر",
    impactBadgeEn: "Closes Without Discounting",
    variables: [
      { name: "OFFER_PRICE", labelAr: "سعر خدمتك المعروض", placeholder: "10,000 دولار" },
      { name: "CLIENT_BUDGET", labelAr: "ميزانية العميل المزعومة أو عرض المنافس", placeholder: "4,000 دولار من وكالة أخرى" },
      { name: "COST_OF_FAILURE", labelAr: "تكلفة فشل المشروع إذا نفذ بشكل رخيص", placeholder: "فقدان ثقة 20,000 مستخدم وتوقف النظام" },
    ],
    usageTipAr: "استخدم هذا السيناريو عندما يطالبك العميل بخصم أو يهدد بالتعامل مع بديل أرخص.",
    usageTipEn: "Use on live sales calls when clients demand heavy discounts.",
    promptTextAr: `أنت كريس فوس (مفاوض الرهائن الدولي ومؤلف Never Split the Difference).
العميل قال لك في اجتماع الإغلاق: "عرضكم ممتاز، لكن سعركم [OFFER_PRICE] مرتفع جداً مقارنة بميزانيتنا التي لا تتعدى [CLIENT_BUDGET] ومنافسكم عرض نفس الشيء بنصف السعر!".
تكلفة الخطأ على العميل إذا تم المشروع بشكل رخيص: [COST_OF_FAILURE].

المطلوب:
1. صياغة 3 أسئلة معايرة (Calibrated Questions) تبدأ بـ "كيف" و "ماذا" تجعل العميل يعترف بنفسه بمخاطر الخيار الرخيص دون أن تبدو مدافعاً.
2. تكتيك "التأطير بالتكلفة مقابل الاستثمار" بالأرقام.
3. سيناريو رد صوتي حرفي مدته 45 ثانية يعيد السيطرة للمفاوض ويرفض الخصم بأدب وحزم قاطع.`,
    promptTextEn: `Channel Chris Voss negotiation tactics to dismantle the objection: 'Your price is too high'. Price: [OFFER_PRICE], Competitor/budget: [CLIENT_BUDGET], Risk of failure: [COST_OF_FAILURE]. Provide calibrated questions and an unyielding verbal rebuttal.`,
  },

  // 3. MARKETING
  {
    id: "p-mkt-01",
    slug: "viral-meta-tiktok-ad-script-matrix",
    category: "marketing",
    categoryAr: "التسويق الإعلاني وصناعة المحتوى عالي التحويل",
    categoryEn: "Growth Marketing & Copy",
    titleAr: "مصفوفة إعلانات الفيديو الفيروسية عالية التحويل (TikTok / Meta Ads)",
    titleEn: "High-ROAS Direct-Response Video Ad Matrix",
    targetRoleAr: "خبراء الإعلانات وصناع المحتوى",
    targetRoleEn: "Media Buyers & Copywriters",
    difficulty: "Pro",
    recommendedModel: "Claude 3.7",
    impactBadgeAr: "مضاعفة معدل ROAS بنسبة 3x",
    impactBadgeEn: "3x ROAS Creative Blueprint",
    variables: [
      { name: "PRODUCT_SERVICE", labelAr: "المنتج أو الخدمة المعلن عنها", placeholder: "كورس تدريبي عملي لتعلم أدوات الذكاء الاصطناعي في 28 يوماً" },
      { name: "TARGET_AUDIENCE", labelAr: "الجمهور المستهدف بدقة", placeholder: "الشباب والموظفون العرب الراغبون في زيادة دخلهم بالعمل الحر" },
      { name: "PRIMARY_FRUSTRATION", labelAr: "الإحباط النفسي الأكبر لديهم", placeholder: "الخوف من فقدان الوظيفة والشعور بالضياع وسط كثرة الأدوات النظرية" },
      { name: "TRANSFORMATION_PROMISE", labelAr: "وعد التحول النهائي", placeholder: "إتقان بناء مشاريع حقيقية وكسب أول 500 دولار خلال شهر" },
    ],
    usageTipAr: "يمنحك 3 خطافات أولية خارقة (First 3 Seconds Hooks) وسيناريو إعلاني كامل بنظام المشهد البصري + النص الصوتي.",
    usageTipEn: "Generates high-stopping-power visual scripts engineered for TikTok and Instagram Reels.",
    promptTextAr: `أنت كبير مسؤولي الإعلانات الإبداعية (Direct Response Creative Director) الذي أدار أكثر من 10 ملايين دولار في إعلانات Meta و TikTok.
المطلوب كتابة سكريبت فيديو إعلاني مدته 45-60 ثانية لـ:
المنتج: [PRODUCT_SERVICE]
الجمهور: [TARGET_AUDIENCE]
المعاناة النفسية: [PRIMARY_FRUSTRATION]
النتيجة والتحول الموعود: [TRANSFORMATION_PROMISE]

المطلوب بالدقة:
1. "3 خيارات لخطافات الثواني الثلاث الأولى (Pattern-Interrupt Hooks)":
   - خيار يعتمد على الصدمة الإحصائية أو كشف وهم شائع.
   - خيار يعتمد على تصوير سيناريو يومي مؤلم يعيشه المشاهد الآن.
   - خيار يعتمد على المقارنة الفاضحة (قبل وبعد).

2. "السكريبت الكامل المشهد بمشهد":
   - جدول مكون من 4 أعمدة: [التوقيت بالثانية | المشهد البصري / B-roll المقترح | الصوت والنص المكتوب | النص المتحرك على الشاشة On-screen Text].
   - يجب أن يتبع الهيكل: Hook -> Agitate -> Epiphany -> Proof -> Irresistible CTA.`,
    promptTextEn: `Draft a high-converting direct-response video script for Meta/TikTok. Product: [PRODUCT_SERVICE], Audience: [TARGET_AUDIENCE], Pain: [PRIMARY_FRUSTRATION], Promise: [TRANSFORMATION_PROMISE]. Detail 3 pattern-interrupt hooks and a time-coded storyboard.`,
  },
  {
    id: "p-mkt-02",
    slug: "landing-page-psychological-copy",
    category: "marketing",
    categoryAr: "التسويق الإعلاني وصناعة المحتوى عالي التحويل",
    categoryEn: "Growth Marketing & Copy",
    titleAr: "هندسة نصوص صفحات الهبوط الخارقة (Conversion Rate Optimization)",
    titleEn: "High-Converting Long-Form Landing Page Architecture",
    targetRoleAr: "مصممو الويب ومسوقو التحويل",
    targetRoleEn: "CRO Specialists & Founders",
    difficulty: "Executive",
    recommendedModel: "Claude 3.7",
    impactBadgeAr: "رفع معدل التحويل إلى +8%",
    impactBadgeEn: "Elevates CVR to 8%+",
    variables: [
      { name: "OFFERING_NAME", labelAr: "اسم المنتج والعرض", placeholder: "منصة طوّرني (اشتراك سنوي في 100 مسار عملي)" },
      { name: "PRICE_POINT", labelAr: "السعر والضمان", placeholder: "349 جنيه مصري مع ضمان استرجاع 48 ساعة" },
      { name: "CORE_OBJECTIONS", labelAr: "أهم الاعتراضات في عقل الزائر", placeholder: "معنديش وقت، أخاف الكورسات تكون نظري، مش واثق من النتيجة" },
    ],
    usageTipAr: "استخدم هذا المخطط لبناء صفحات هبوط تبيع بقوة دون ابتذال، وتجيب عن كافة مخاوف المشتري.",
    usageTipEn: "Architect landing page copy structured to dismantle visitor scepticism section by section.",
    promptTextAr: `أنت يوجين شوارتز وجون كابلز في العصر الرقمي.
المهمة: كتابة الهيكل النصي الكامل لصفحة هبوط خارقة لمنتج: [OFFERING_NAME].
السعر والضمان: [PRICE_POINT].
الاعتراضات الذهنية: [CORE_OBJECTIONS].

قم بصياغة نصوص الأقسام الآتية:
١. قسم الهيرو (Hero Section): العنوان الرئيسي (H1)، العنوان الفرعي المقنع، 3 نقاط ثقة فورية، زر اتخاذ القرار الحاسم.
٢. قسم كشف المشكلة (The Real Enemy): تشخيص السبب الحقيقي وراء فشل الطرق التقليدية ولماذا ليس اللوم على الزائر.
٣. آلية العمل الفريدة (Unique Mechanism): كيف تحقق المنصة النتيجة في 5 دقائق يومياً بدون تسويف.
٤. حزمة العرض الكاسح (The Grand Slam Offer): تفصيل ما يحصل عليه المشترك فوراً والبونص الملحق.
٥. تفكيك المخاطر (Risk-Reversal): صياغة فقرة الضمان بأسلوب يمنح الزائر شعوراً بالأمان المطلق.
٦. قسم الأسئلة الشائعة الفتاكة (FAQ): 5 أسئلة تقتل كل تردد متبقٍ.`,
    promptTextEn: `Compose a full-spectrum high-converting landing page framework for [OFFERING_NAME] priced at [PRICE_POINT], addressing objections: [CORE_OBJECTIONS].`,
  },

  // 4. ENGINEERING
  {
    id: "p-eng-01",
    slug: "clean-architecture-production-audit",
    category: "engineering",
    categoryAr: "البرمجة وهندسة البرمجيات المعمارية",
    categoryEn: "Software Architecture",
    titleAr: "مراجعة كود معماري ومراجعة أمان الإنتاج (Production Architecture Audit)",
    titleEn: "Full-Stack Security & Clean Architecture Code Audit",
    targetRoleAr: "كبار المهندسين ومدراء التكنولوجيا",
    targetRoleEn: "Staff Engineers & Tech Leads",
    difficulty: "Executive",
    recommendedModel: "Claude 3.7",
    impactBadgeAr: "كشف الثغرات والديون التقنية",
    impactBadgeEn: "Exposes CVEs & Tech Debt",
    variables: [
      { name: "STACK_DETAILS", labelAr: "التقنيات المستخدمة", placeholder: "Next.js 15, Prisma ORM, PostgreSQL, Tailwind, Docker" },
      { name: "FEATURE_DESCRIPTION", labelAr: "الميزة أو الجزء البرمجي المراد مراجعته", placeholder: "نظام تسجيل المدفوعات التلقائي وتفعيل الاشتراكات عبر Webhooks و SMS" },
      { name: "CONCERNS", labelAr: "نقاط القلق الأساسية", placeholder: "سباقات المعالجة (Race conditions)، هجمات التخمين، والتحقق المالي المزدوج" },
    ],
    usageTipAr: "ضع هذا البرومبت متبوعاً بمقتطف الكود الخاص بك للحصول على مراجعة معمارية وأمنية من مستوى مهندسي Google و Meta.",
    usageTipEn: "Supply code snippets after this prompt for staff-level vulnerability and concurrency stress analysis.",
    promptTextAr: `أنت مهندس معماري أول ورئيس الأمان البرمجي (Principal Security & Systems Architect).
البنية التقنية: [STACK_DETAILS].
الميزة البرمجية: [FEATURE_DESCRIPTION].
المخاطر المحتملة: [CONCERNS].

المطلوب:
1. تحليل معمارية الكود وفق مبادئ Clean Architecture و SOLID.
2. فحص مخاطر التزامن والسباقات (Race Conditions): كيفية ضمان العمليات الذرية (ACID Transactions) ومنع الدفع المزدوج أو التفعيل المتكرر.
3. مراجعة أمنية متقدمة: هل هناك ثغرات SQL Injection، أو Replay Attacks، أو تسريب لرموز التحقق الحساسة؟
4. تقديم كود TypeScript بديل ومصحح يطبق:
   - Database Row Locking (SELECT FOR UPDATE)
   - Idempotency Keys للعمليات المالية
   - Structured Error Handling بدون تسريب تفاصيل السيرفر للعميل.`,
    promptTextEn: `Perform a Principal Software Architect security and concurrency audit for [FEATURE_DESCRIPTION] on [STACK_DETAILS] focusing on [CONCERNS]. Deliver refactored idempotent code.`,
  },
  {
    id: "p-eng-02",
    slug: "database-schema-scaling-bottlenecks",
    category: "engineering",
    categoryAr: "البرمجة وهندسة البرمجيات المعمارية",
    categoryEn: "Software Architecture",
    titleAr: "تصميم وتطوير قواعد البيانات لملايين السجلات بدون بطء",
    titleEn: "Database Schema Optimization & High-Scale Indexing",
    targetRoleAr: "مهندسو الباك إند وقواعد البيانات",
    targetRoleEn: "Backend & Database Engineers",
    difficulty: "Pro",
    recommendedModel: "Gemini Pro",
    impactBadgeAr: "تسريع الاستعلامات بنسبة 10x",
    impactBadgeEn: "10x Faster Query Latency",
    variables: [
      { name: "DATABASE_TYPE", labelAr: "نوع قاعدة البيانات", placeholder: "PostgreSQL / MySQL" },
      { name: "ACTIVE_USERS_SCALE", labelAr: "حجم البيانات المتوقع", placeholder: "100,000 مستخدم نشط و 5 ملايين سجل إتمام دروس" },
      { name: "CRITICAL_QUERY", labelAr: "الاستعلام الأكثر تكراراً وأهمية", placeholder: "حساب الـ Streak وإجمالي الـ XP لكل طالب عند فتح التطبيق" },
    ],
    usageTipAr: "يساعدك على تصميم الفهارس المناسبة وتجنب استعلامات N+1 ومشاكل القفل على الجداول الكبيرة.",
    usageTipEn: "Optimizes indexing strategies and eliminates lock contention under massive concurrency.",
    promptTextAr: `أنت خبير أداء قواعد البيانات (Database Performance Tuning Specialist).
قاعدة البيانات: [DATABASE_TYPE].
حجم العمل المتوقع: [ACTIVE_USERS_SCALE].
الاستعلام الحرج: [CRITICAL_QUERY].

المطلوب:
1. تصميم مخطط الفهارس المركبة (Composite Indexes) اللازمة لتقليص زمن الاستعلام من مئات المللي ثانية إلى أقل من 5ms.
2. هل يفضل الحساب الفوري أم استخدام Materialized Views / Denormalized Counters؟ قدم تحليلاً للمفاضلات (Trade-offs).
3. استراتيجية التقسيم (Partitioning) والأرشفة للبيانات التاريخية.
4. كود SQL / Prisma Schema المحسن كاملاً.`,
    promptTextEn: `Architect high-scale database indexing and schema design for [DATABASE_TYPE] handling [ACTIVE_USERS_SCALE] optimizing [CRITICAL_QUERY].`,
  },

  // 5. OPERATIONS
  {
    id: "p-ops-01",
    slug: "sop-automation-delegation-builder",
    category: "operations",
    categoryAr: "أتمتة العمليات والمهام الذكية",
    categoryEn: "Operations & Automation",
    titleAr: "بناء أدلة التشغيل القياسية (SOPs) القابلة للأتمتة بالذكاء الاصطناعي",
    titleEn: "Self-Executing Operational SOP Builder",
    targetRoleAr: "مدراء العمليات ومؤسسو الشركات",
    targetRoleEn: "COOs & Operations Leads",
    difficulty: "Pro",
    recommendedModel: "GPT-4o",
    impactBadgeAr: "توفير 15 ساعة عمل أسبوعيًا",
    impactBadgeEn: "Saves 15 Hours / Week",
    variables: [
      { name: "PROCESS_NAME", labelAr: "العملية المراد توثيقها وأتمتتها", placeholder: "تأكيد طلبات الشراء الواردة عبر فودافون كاش وإنستاباي وتفعيل الحساب" },
      { name: "HUMAN_STEPS", labelAr: "الخطوات التي ينفذها الإنسان حالياً يدوياً", placeholder: "فتح رسالة الـ SMS، البحث عن رقم الهاتف في لوحة الإدارة، تغيير الحالة لمقبول، إرسال إيميل الترحيب" },
      { name: "FAILURE_POINTS", labelAr: "الأخطاء الشائعة الحالية", placeholder: "تأخر الموافقة عدة ساعات، أخطاء في نقل الأرقام، نسيان إرسال الإيميل" },
    ],
    usageTipAr: "يحول أي فوضى تشغيلية يدوية إلى دليل عمل منضبط يمكن تفويضه لموظف جديد في دقائق أو تحويله لكود أوتوماتيكي.",
    usageTipEn: "Turns messy manual bottlenecks into foolproof standard operating procedures ready for automation.",
    promptTextAr: `أنت مدير عمليات عالمي متخصص في أتمتة الأنظمة (Systems & Automation COO).
العملية المطلوب توثيقها: [PROCESS_NAME].
الخطوات اليدوية الحالية: [HUMAN_STEPS].
نقاط الخلل والأخطاء: [FAILURE_POINTS].

المطلوب:
1. صياغة "دليل تشغيل قياسي (SOP)" متكامل بخطوات لا تحتمل اللبس (Zero-ambiguity Checklist).
2. تحديد الأجزاء التي يمكن أتمتتها بنسبة 100% باستخدام Webhooks أو APIs مع رسم مخطط تدفق البيانات (Data Flow).
3. آلية معالجة الحالات الشاذة (Edge Cases / Exceptions): ماذا يحدث عند وصول رسالة غير مفهومة أو نقص بيانات العميل؟
4. مصفوفة الصلاحيات وتدابير منع الاحتيال المالي.`,
    promptTextEn: `Create a fail-safe, automation-ready Standard Operating Procedure (SOP) for [PROCESS_NAME]. Analyze steps: [HUMAN_STEPS] and failure points: [FAILURE_POINTS]. Include edge-case routing.`,
  },

  // 6. FINANCE
  {
    id: "p-fin-01",
    slug: "saas-pricing-tier-revenue-maximizer",
    category: "finance",
    categoryAr: "المالية والتسعير والتدفقات النقدية",
    categoryEn: "Finance & Cash Flow",
    titleAr: "هندسة باقات التسعير ومضاعفة الإيراد الصافي (Pricing Optimization)",
    titleEn: "Revenue-Maximizing Tiered Pricing Architecture",
    targetRoleAr: "المسؤولون الماليون ومسؤولو التسعير",
    targetRoleEn: "CFOs & Pricing Strategists",
    difficulty: "Executive",
    recommendedModel: "Claude 3.7",
    impactBadgeAr: "زيادة العائد لكل مستخدم +35%",
    impactBadgeEn: "+35% ARPU Expansion",
    variables: [
      { name: "CURRENT_OFFER", labelAr: "العرض الحالي وسعره", placeholder: "اشتراك سنوي شامل 100 كورس بسعر 349 ج.م" },
      { name: "TARGET_AUDIENCE_BUDGET", labelAr: "طبيعة ميزانية العملاء المستهدفين", placeholder: "طلاب وخريجون باحثون عن فرصة عمل ذات دخل" },
      { name: "PROPOSED_ADDONS", labelAr: "القيم الإضافية الممكن تقديمها كترقية", placeholder: "بنك البرومبتات، عقود الفريلانس، مراجعة السيرة الذاتية، مجتمع خاص" },
    ],
    usageTipAr: "يصمم باقات التسعير النفسي (Decoy Pricing و Order Bumps) التي تحفز العملاء على اختيار الباقة الأعلى قيمة تلقائياً.",
    usageTipEn: "Designs behavioral decoy tiers and order bumps that naturally tilt buyer preference to premium packages.",
    promptTextAr: `أنت مستشار استراتيجي متخصص في التسعير السلوكي للشركات (Behavioral Pricing Strategist).
المنتج الحالي: [CURRENT_OFFER].
الجمهور المستهدف: [TARGET_AUDIENCE_BUDGET].
الإضافات المتاحة: [PROPOSED_ADDONS].

المطلوب:
1. تصميم بنية تسعير ثلاثية (Good, Better, Best) تستخدم تأثير الطُعم (Decoy Effect) لدفع 60% من المشترين نحو الخيار الأوسط أو الأعلى.
2. تصميم ترقية لحظية عند الدفع (Order Bump) بقيمة لا تتردد في دفعها (No-Brainer) ونسبة قبول متوقعة تتجاوز 35%.
3. صياغة المبرر النفسي لكل فئة سعرية والعبارات التي تبرز القيمة الفائقة مقارنة بالسعر الزهيد.
4. حساب التأثير المالي المتوقع على إجمالي الإيرادات وهامش الربح.`,
    promptTextEn: `Architect a high-margin 3-tier behavioral pricing model with order-bump mechanics for [CURRENT_OFFER] using [PROPOSED_ADDONS].`,
  },

  // 7. HR & TALENT
  {
    id: "p-hr-01",
    slug: "executive-hiring-scorecard-generator",
    category: "hr",
    categoryAr: "الموارد البشرية واستقطاب الكفاءات",
    categoryEn: "HR & Talent",
    titleAr: "بطاقة تقييم التوظيف النخبوي واختبار الكفاءة الحقيقية (Scorecard)",
    titleEn: "Elite Talent Hiring Scorecard & Work-Sample Test",
    targetRoleAr: "مدراء التوظيف والمدراء التنفيذيون",
    targetRoleEn: "Hiring Managers & People Leads",
    difficulty: "Pro",
    recommendedModel: "GPT-4o",
    impactBadgeAr: "تجنب التوظيف الخاطئ المكلف",
    impactBadgeEn: "Eliminates Costly Bad Hires",
    variables: [
      { name: "ROLE_TITLE", labelAr: "المسمى الوظيفي المطلوب", placeholder: "Senior Growth Marketing Manager" },
      { name: "CORE_MISSION", labelAr: "المهمة الأساسية للوظيفة خلال سنة", placeholder: "مضاعفة عدد المشتركين الجدد من 500 إلى 5,000 شهرياً بكفاءة CAC عالية" },
      { name: "REQUIRED_SKILLS", labelAr: "المهارات غير القابلة للتفاوض", placeholder: "إدارة ميزانيات إعلانية كبيرة، تحليل البيانات بالـ SQL، كتابة نصوص تحويلية" },
    ],
    usageTipAr: "يمنحك أسئلة سيناريوهات واقعية وتحدي عملي لا يمكن للمرشحين تجاوزه بالكلام النظري فقط.",
    usageTipEn: "Produces practical work-sample testing protocols that separate talkers from elite executioners.",
    promptTextAr: `أنت رئيس قطاع الموارد البشرية التنفيذي (Chief People Officer) في شركة تقنية سريعة النمو.
الوظيفة المطلوبة: [ROLE_TITLE].
المهمة الحيوية للوظيفة: [CORE_MISSION].
المهارات الصارمة: [REQUIRED_SKILLS].

المطلوب:
1. "بطاقة تقييم الأداء (Role Scorecard)": 4 مخرجات حاسمة (Outcomes) يجب أن يحققها المرشح في أول 90 يوماً.
2. "5 أسئلة مقابلة قائمة على المحاكاة السلوكية المعقدة (Behavioral Scenarios)": تكشف ما إذا كان المرشح نفذ هذه النتائج بيده أم كان مجرد مراقب في فريقه السابق.
3. "اختبار عملي مدفوع مدته 3 ساعات (Paid Work Sample Test)": يقيس الكفاءة الحقيقية قبل توقيع العقد.
4. مؤشرات الإنذار المبكر (Red Flags) التي تستوجب رفض المرشح فوراً.`,
    promptTextEn: `Generate a rigorous A-Player hiring scorecard and practical work-sample assessment for [ROLE_TITLE] with mission [CORE_MISSION].`,
  },

  // 8. CUSTOMER SUCCESS & CHURN
  {
    id: "p-cs-01",
    slug: "churn-interception-and-rescue",
    category: "retention",
    categoryAr: "خدمة العملاء وتقليل معدل الإلغاء",
    categoryEn: "Retention & Churn",
    titleAr: "خطة اعتراض العميل الغاضب ومنع الإلغاء وتحويله لعميل مخلص",
    titleEn: "Escalated Churn Interception & Turnaround Playbook",
    targetRoleAr: "مدراء نجاح العملاء وخدمة ما بعد البيع",
    targetRoleEn: "Head of Customer Success & Support",
    difficulty: "Executive",
    recommendedModel: "Claude 3.7",
    impactBadgeAr: "إنقاذ 40% من طلبات الإلغاء",
    impactBadgeEn: "Rescues 40% of Cancellations",
    variables: [
      { name: "SERVICE_PRODUCT", labelAr: "الخدمة أو الاشتراك", placeholder: "منصة التعليم المهني طوّرني" },
      { name: "CUSTOMER_COMPLAINT", labelAr: "سبب غضب العميل أو طلبه للاسترجاع", placeholder: "يقول إنه مش لاقي وقت يذاكر وحاسس إنه دفع فلوس على الفاضي" },
      { name: "RESOLUTION_OPTIONS", labelAr: "الحلول التي يمكن تقديمها له", placeholder: "تجميد الحساب مؤقتاً، جلسة استشارية لتحديد خطة 5 دقائق يومياً، مسار بديل سهل" },
    ],
    usageTipAr: "استخدم هذا الرد عندما يطلب العميل استرداد أمواله أو يشعر بالإحباط، لتحويل الموقف إلى تجربة استثنائية.",
    usageTipEn: "Transforms frustrated or overwhelmed cancellation requests into high-loyalty member relationships.",
    promptTextAr: `أنت نائب رئيس نجاح العملاء في شركة مثل Apple أو Amazon المعروفة بخدمة العملاء الخارقة.
المنتج: [SERVICE_PRODUCT].
شكوى العميل: [CUSTOMER_COMPLAINT].
الحلول المتاحة لدينا: [RESOLUTION_OPTIONS].

المطلوب:
1. صياغة رد احترافي وإنساني فائق التعاطف (Empathy-First Communication) يبدأ بامتصاص الغضب تماماً والاعتراف بشعور العميل دون جدال.
2. إعادة تأطير المشكلة وإظهار كيف أن التوقف الآن سيضيع عليه فرصة ثمينة، مع تقديم الحلول البديلة كهدية وتقدير له.
3. خطة متابعة على مدار 7 أيام للتأكد من عودة العميل للاستفادة دون أن يشعر بأي ضغط.`,
    promptTextEn: `Formulate an ultra-empathetic, churn-reversal response and 7-day retention protocol for a customer complaining: [CUSTOMER_COMPLAINT] about [SERVICE_PRODUCT].`,
  },
];

export const TOTAL_PROMPTS_COUNT = 1000;
