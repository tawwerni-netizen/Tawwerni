const { BRAND, COMMON_CSS, renderPdf } = require('./shared');

function getProjectContextHtml(lang = 'ar') {
  const isAr = lang === 'ar';
  const dir = isAr ? 'rtl' : 'ltr';
  const fontClass = isAr ? 'font-ar' : 'font-en';

  return `<!DOCTYPE html>
<html lang="${lang}" dir="${dir}">
<head>
<meta charset="utf-8">
<title>${isAr ? 'وثيقة سياق المشروع ودليل التشغيل' : 'Tawwerni - Project Context & Due Diligence Brief'}</title>
<style>
${COMMON_CSS}

@page {
  size: 210mm 297mm;
  margin: 0;
}

.context-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 2px solid rgba(93, 202, 165, 0.3);
  padding-bottom: 5mm;
  margin-bottom: 6mm;
}

.logo-badge {
  display: flex;
  align-items: center;
  gap: 10px;
}

.logo-box {
  width: 32px;
  height: 32px;
  border-radius: 8px;
  background: linear-gradient(135deg, #1D9E75, #085041);
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 900;
  color: #FFF;
  font-size: 16px;
}

.step-row {
  display: flex;
  gap: 12px;
  align-items: flex-start;
  margin-bottom: 8px;
  background: rgba(14, 26, 43, 0.5);
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 8px;
  padding: 10px 12px;
}

.step-num {
  width: 24px;
  height: 24px;
  border-radius: 6px;
  background: rgba(29, 158, 117, 0.2);
  color: #5DCAA5;
  font-weight: 800;
  font-size: 11px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}
</style>
</head>
<body class="${fontClass}">

<!-- PAGE 1: ORIGIN STORY & TARGET AUDIENCE -->
<div class="page">
  <div class="bg-glow-1"></div>
  <div class="grid-pattern"></div>

  <div class="context-header">
    <div class="logo-badge">
      <div class="logo-box">ط</div>
      <div>
        <div style="font-weight: 900; font-size: 15px; color: #FFF;">Tawwerni Project Context</div>
        <div style="font-size: 10px; color: #5DCAA5;">${isAr ? 'دليل السياق الاستراتيجي والتشغيلي الشامل' : 'Strategic Context, Due Diligence & Operations Brief'}</div>
      </div>
    </div>
    <div class="badge">${isAr ? 'ملف الفحص النافي للجهالة' : 'Due Diligence Dossier'}</div>
  </div>

  <div style="margin-bottom: 12px;">
    <h1 style="font-size: 22px; font-weight: 900; color: #FFF; margin-bottom: 4px;">
      ${isAr ? '١. قصة النشأة والجمهور المستهدف (Origin & Market)' : '1. Genesis, Vision & Market Demographics'}
    </h1>
    <p style="font-size: 11px; color: #94A3B8; line-height: 1.5;">
      ${isAr 
        ? 'انطلقت منصة طوّرني لمعالجة أزمة حقيقية في قطاع التعليم الرقمي العربي: آلاف الكورسات التقليدية المسجلة التي تنتهي بالإحباط وعدم الإكمال. تقدم طوّرني بديلاً عملياً يقوم على خطوات تنفيذية يومية محددة.' 
        : 'Tawwerni was conceived to solve the critical friction point of MENA online learning: low completion and lack of accountability. It reimagines skill building as a high-velocity, 5-minute daily micro-routine.'}
    </p>
  </div>

  <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 12px;">
    <div class="card" style="border-top: 3px solid #5DCAA5;">
      <div style="font-size: 13px; font-weight: 800; color: #5DCAA5; margin-bottom: 6px;">
        🌍 ${isAr ? 'حجم السوق والفرصة الإقليمية' : 'Regional Addressable Market'}
      </div>
      <div style="font-size: 10px; color: #CBD5E1; line-height: 1.5;">
        ${isAr 
          ? '• أكثر من 100 مليون شاب في الشرق الأوسط يبحثون عن مهارات العمل الحر والذكاء الاصطناعي.<br>• سوق التعليم الإلكتروني في المنطقة ينمو بمعدل مركب يفوق 15% سنوياً.<br>• تعطش غير مسبوق في مصر والسعودية والإمارات لمحتوى تقني معاصر يواكب سرعة أدوات الذكاء الاصطناعي.' 
          : '• Over 100M Arab-speaking youths and professionals seeking high-income tech skills.<br>• Regional EdTech growing at 15%+ CAGR.<br>• Unprecedented appetite across Egypt, KSA, and UAE for practical AI workflows.'}
      </div>
    </div>

    <div class="card" style="border-top: 3px solid #F59E0B;">
      <div style="font-size: 13px; font-weight: 800; color: #FBBF24; margin-bottom: 6px;">
        👥 ${isAr ? 'شرائح العملاء الأساسية (Buyer Personas)' : 'Primary User Personas'}
      </div>
      <div style="font-size: 10px; color: #CBD5E1; line-height: 1.5;">
        ${isAr 
          ? '<b>١. الراغبون في التحول المهني:</b> موظفون يبحثون عن الانتقال لمجال التقنية والذكاء الاصطناعي.<br><b>٢. المستقلون (Freelancers):</b> شباب يسعون لتقديم خدماتهم لعملاء في الخليج وأمريكا بالدولار.<br><b>٣. خريجو الجامعات:</b> يبحثون عن شهادات عملية وإثبات للمهارات أمام أصحاب العمل.' 
          : '<b>1. Career Shifters:</b> Professionals transitioning into lucrative digital roles.<br><b>2. Global Freelancers:</b> Independent contractors aiming for high-ticket USD clients.<br><b>3. University Grads:</b> Seeking verifiable, credentialed proof of real skills.'}
      </div>
    </div>
  </div>

  <div class="card card-hover" style="padding: 12px;">
    <div style="font-size: 13px; font-weight: 800; color: #5DCAA5; margin-bottom: 4px;">
      💡 ${isAr ? 'ميزة التنافسية المحصنة (Competitive Moat):' : 'Unmatched Competitive Advantage:'}
    </div>
    <div style="font-size: 10px; color: #94A3B8; line-height: 1.5;">
      ${isAr 
        ? 'بينما يعتمد المنافسون على فيديوهات سلبية مملة، توفر طوّرني بطاقات تفاعلية وكويزات فورية مع كود التحقق من الشهادات (Tamper-Proof Verification Codes)، مما يجعل تجربة الطالب ممتعة وشبيهة بالألعاب (Gamified).' 
        : 'Unlike legacy video course catalogs with 40-hour marathons, Tawwerni engages users with bite-sized daily cards, live quizzes, and instant verifiable certificates that prove real mastery.'}
    </div>
  </div>

  <div class="footer-bar">
    <span>Tawwerni Project Context · Page 1/4</span>
    <span>Market Positioning & Customer Personas</span>
  </div>
</div>

<!-- PAGE 2: 100 TRACKS ENGINE & CURRICULUM -->
<div class="page">
  <div class="context-header">
    <div class="logo-badge">
      <div class="logo-box">ط</div>
      <div>
        <div style="font-weight: 900; font-size: 15px; color: #FFF;">Curriculum Architecture & 100 Tracks</div>
        <div style="font-size: 10px; color: #5DCAA5;">${isAr ? 'هندسة المناهج التعليمية وتوزيع الـ 100 مسار' : 'Curriculum Structure & The 10 Master Pillars'}</div>
      </div>
    </div>
    <div class="badge badge-gold">100 Tracks Portfolio</div>
  </div>

  <div style="margin-bottom: 12px;">
    <h1 style="font-size: 20px; font-weight: 900; color: #FFF; margin-bottom: 4px;">
      ${isAr ? '٢. خريطة المناهج التعليمية (The 10 Master Pillars)' : '2. Curriculum Architecture & The 10 Master Pillars'}
    </h1>
    <p style="font-size: 11px; color: #94A3B8; line-height: 1.4;">
      ${isAr 
        ? 'تم بناء كل مسار من المسارات الـ 100 وفق معمارية الـ 28 يوماً (5 دقائق يومياً) الموزعة على وحدات تدريبية متسلسلة تنتهي بكويز تفاعلي وشهادة معتمدة.' 
        : 'Every one of the 100 tracks follows our proven 28-day habit framework (5 minutes/day), divided into structured modules and verified with interactive quizzes.'}
    </p>
  </div>

  <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px; margin-bottom: 10px; font-size: 10px;">
    <div class="card" style="padding: 8px 10px;">
      <b style="color:#5DCAA5;">1. AI & Automation (10 Tracks):</b>
      <div style="color:#94A3B8; margin-top: 2px;">Prompt Engineering, Generative Media, Agentic Workflows, LLM fine-tuning, AI for Business.</div>
    </div>
    <div class="card" style="padding: 8px 10px;">
      <b style="color:#5DCAA5;">2. Web & Modern Dev (10 Tracks):</b>
      <div style="color:#94A3B8; margin-top: 2px;">Next.js, React 19, TypeScript, Python Automation, API Design, Full-Stack Architecture.</div>
    </div>
    <div class="card" style="padding: 8px 10px;">
      <b style="color:#5DCAA5;">3. Data Analytics & BI (10 Tracks):</b>
      <div style="color:#94A3B8; margin-top: 2px;">SQL Mastery, Business Intelligence, Data Pipelines, Tableau/PowerBI, Predictive Stats.</div>
    </div>
    <div class="card" style="padding: 8px 10px;">
      <b style="color:#5DCAA5;">4. Global Freelancing (10 Tracks):</b>
      <div style="color:#94A3B8; margin-top: 2px;">Upwork Dominance, High-Ticket Deals, Contract Negotiations, Global Payment Rails.</div>
    </div>
    <div class="card" style="padding: 8px 10px;">
      <b style="color:#5DCAA5;">5. Digital Growth & Ads (10 Tracks):</b>
      <div style="color:#94A3B8; margin-top: 2px;">Meta & Google Ads, Funnel Architecture, SEO Engineering, Conversion Copywriting.</div>
    </div>
    <div class="card" style="padding: 8px 10px;">
      <b style="color:#5DCAA5;">6. UI/UX & Design Systems (10 Tracks):</b>
      <div style="color:#94A3B8; margin-top: 2px;">Figma Mastery, User Psychology, Mobile App Architecture, Design Token Systems.</div>
    </div>
    <div class="card" style="padding: 8px 10px;">
      <b style="color:#5DCAA5;">7. Business & Startups (10 Tracks):</b>
      <div style="color:#94A3B8; margin-top: 2px;">Bootstrapping, Unit Economics, SaaS Metrics, Sales Closing, Enterprise Pitching.</div>
    </div>
    <div class="card" style="padding: 8px 10px;">
      <b style="color:#5DCAA5;">8. Cybersecurity & Ops (10 Tracks):</b>
      <div style="color:#94A3B8; margin-top: 2px;">Threat Modeling, Defense in Depth, Privacy Engineering, Incident Response.</div>
    </div>
    <div class="card" style="padding: 8px 10px;">
      <b style="color:#5DCAA5;">9. Executive Leadership (10 Tracks):</b>
      <div style="color:#94A3B8; margin-top: 2px;">High-Stakes Negotiation, Strategic Communication, Team Management, Crisis Leadership.</div>
    </div>
    <div class="card" style="padding: 8px 10px;">
      <b style="color:#5DCAA5;">10. Peak Productivity (10 Tracks):</b>
      <div style="color:#94A3B8; margin-top: 2px;">Deep Work Protocols, Habit Loops, Energy Management, Mental Models for Execution.</div>
    </div>
  </div>

  <div class="card card-hover" style="padding: 10px; font-size: 10px; color: #CBD5E1;">
    <b style="color:#FBBF24;">${isAr ? '✨ إمكانية استيعاب شروحات الفيديو (Video Walkthroughs Ready):' : '✨ Built-In Video Screen Recording Capability:'}</b><br>
    ${isAr 
      ? 'جدول الدروس يحتوي على حقل اختياري <span class="code-pill">videoUrl</span>، مما يتيح للمشتري الجديد إضافة فيديوهات مسجلة لأي درس عند الرغبة دون الحاجة لأي تعديلات برمجية.' 
      : 'The lesson model contains a native nullable <span class="code-pill">videoUrl</span> property, allowing the buyer to embed optional video walkthroughs into any card on demand.'}
  </div>

  <div class="footer-bar">
    <span>Tawwerni Project Context · Page 2/4</span>
    <span>The 100 Complete Career Tracks Portfolio</span>
  </div>
</div>

<!-- PAGE 3: OPERATIONAL WORKFLOWS & ADMIN -->
<div class="page">
  <div class="context-header">
    <div class="logo-badge">
      <div class="logo-box">ط</div>
      <div>
        <div style="font-weight: 900; font-size: 15px; color: #FFF;">Operations & Business Workflows</div>
        <div style="font-size: 10px; color: #5DCAA5;">${isAr ? 'دورة التشغيل، معالجة الدفع، وإدارة الشركاء' : 'Payment Reconciliation, Payouts & Operational Workflows'}</div>
      </div>
    </div>
    <div class="badge">Operational Playbook</div>
  </div>

  <div style="margin-bottom: 12px;">
    <h1 style="font-size: 20px; font-weight: 900; color: #FFF; margin-bottom: 4px;">
      ${isAr ? '٣. العمليات التشغيلية ولوحة تحكم الإدارة' : '3. Daily Operations, Payments & Admin Control'}
    </h1>
    <p style="font-size: 11px; color: #94A3B8; line-height: 1.5;">
      ${isAr 
        ? 'تمت أتمتة العمليات اليومية لتقليل التدخل البشري إلى أدنى حد ممكن، مع لوحة تحكم تنفيذية تمكّن شخصاً واحداً من إدارة المنصة بالكامل في أقل من 15 دقيقة يومياً.' 
        : 'Engineered for lean, frictionless execution. A single operator can manage enrollments, reconciliation, and payouts in under 15 minutes per day.'}
    </p>
  </div>

  <!-- WORKFLOW STEPS -->
  <div style="margin-bottom: 12px;">
    <div class="step-row">
      <div class="step-num">1</div>
      <div style="font-size: 11px;">
        <b style="color:#FFF;">${isAr ? 'رحلة التسجيل والتشخيص الذكي (Diagnostic Funnel):' : 'Diagnostic Quiz & Funnel Lead Capture:'}</b>
        <div style="color:#94A3B8; margin-top: 2px;">
          ${isAr ? 'المستخدم يدخل عبر الكويز التشخيصي، يحصل على تقييم جاهزيته للذكاء الاصطناعي، ويتم توجيهه للمسار الأنسب مع إتاحة اليوم الأول مجاناً لزيادة الثقة.' : 'Prospects complete a gamified diagnostic quiz, receive their AI readiness score, and get personalized course recommendations with Day 1 free.'}
        </div>
      </div>
    </div>

    <div class="step-row">
      <div class="step-num">2</div>
      <div style="font-size: 11px;">
        <b style="color:#FFF;">${isAr ? 'معالجة الدفع الفوري (Payment Reconciliation):' : 'Frictionless Payment Reconciliation:'}</b>
        <div style="color:#94A3B8; margin-top: 2px;">
          ${isAr ? 'يدفع المشترك عبر إنستاباي أو فودافون كاش، ويسجل رقم المحفظة أو اسم إنستاباي. يظهر الطلب فوراً في لوحة الأدمن مع زر قبول فوري يفتح المسارات ويرسل إيميل ترحيبي آلياً.' : 'Customers pay via InstaPay or Vodafone Cash. The transaction appears in the Admin Dashboard with one-click approval triggering automated welcome emails.'}
        </div>
      </div>
    </div>

    <div class="step-row">
      <div class="step-num">3</div>
      <div style="font-size: 11px;">
        <b style="color:#FFF;">${isAr ? 'إدارة عمولات الإحالة والتسويات (Affiliate Payouts):' : 'Automated Affiliate Payout Settlements:'}</b>
        <div style="color:#94A3B8; margin-top: 2px;">
          ${isAr ? 'تُحسب عمولة 75 ج.م لكل إحالة مقبولة. عند بلوغ 150 ج.م، يطلب المسوق سحب أرباحه عبر محفظته، ويقوم الأدمن بتسويتها وتوثيق السجل بضغطة زر واحدة.' : 'Affiliates earn 75 EGP per referral. Upon reaching 150 EGP, payout requests can be cleared via mobile wallet in seconds with immutable audit logs.'}
        </div>
      </div>
    </div>
  </div>

  <div class="card" style="padding: 12px; font-size: 10px; color: #CBD5E1;">
    <b style="color:#5DCAA5;">${isAr ? 'لوحة تحكم الأدمن المدمجة (Executive Admin Suite):' : 'Built-In Admin Capabilities:'}</b><br>
    ${isAr 
      ? '• إدارة المستخدمين والاشتراكات.<br>• تدقيق التحويلات المالية وطلبات السحب.<br>• محرر المقالات ومحتوى الـ Hub.<br>• سجل التدقيق الكامل (Audit Log) لرصد كافة العمليات الحساسة.' 
      : '• User & subscription oversight.<br>• Payment receipt matching and payout clearances.<br>• Content Hub CMS & article editor.<br>• Comprehensive immutable admin audit logging.'}
  </div>

  <div class="footer-bar">
    <span>Tawwerni Project Context · Page 3/4</span>
    <span>Daily Operations & Business Workflows</span>
  </div>
</div>

<!-- PAGE 4: 100-DAY SCALE ROADMAP (FOR THE BUYER) -->
<div class="page">
  <div class="context-header">
    <div class="logo-badge">
      <div class="logo-box">ط</div>
      <div>
        <div style="font-weight: 900; font-size: 15px; color: #FFF;">Buyer Growth Playbook & 100-Day Scale</div>
        <div style="font-size: 10px; color: #5DCAA5;">${isAr ? 'خطة التوسع ومضاعفة العائد للمشتري الجديد' : 'Post-Acquisition Growth Playbook & Scale Strategy'}</div>
      </div>
    </div>
    <div class="badge badge-gold">Acquirer Growth Engine</div>
  </div>

  <div style="margin-bottom: 12px;">
    <h1 style="font-size: 20px; font-weight: 900; color: #FFF; margin-bottom: 4px;">
      ${isAr ? '٤. خطة الـ 100 يوم لمضاعفة الأرباح (Post-Acquisition Playbook)' : '4. 100-Day Post-Acquisition Scale Roadmap'}
    </h1>
    <p style="font-size: 11px; color: #94A3B8; line-height: 1.5;">
      ${isAr 
        ? 'خريطة طريق عملية توضح كيف يمكن للمشتري استعادة سعر الشراء ومضاعفة الإيرادات في الأشهر الثلاثة الأولى بعد الاستحواذ.' 
        : 'Actionable playbook outlining how the acquirer can recoup their purchase price and scale ARR within the first 90 days.'}
    </p>
  </div>

  <!-- 3 PHASES -->
  <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; margin-bottom: 14px;">
    <div class="card" style="border-top: 3px solid #38BDF8;">
      <div style="font-size: 12px; font-weight: 800; color: #38BDF8; margin-bottom: 6px;">
        ${isAr ? 'المرحلة ١: الأيام 1-30' : 'Phase 1: Days 1-30'}
      </div>
      <div style="font-size: 10px; color: #CBD5E1; line-height: 1.5;">
        <b>${isAr ? 'التفعيل الإقليمي والدفع الفوري:' : 'Global Payment Activation:'}</b><br>
        ${isAr 
          ? '• ربط بوابة دفع بالبطاقات (Stripe أو Paymob أو Tap) لتسهيل الشراء للعملاء في السعودية والإمارات.<br>• إطلاق إعلانات ميتا وتيك توك على كويز الذكاء الاصطناعي (CAC متوقع < $2).' 
          : '• Integrate Stripe / Tap for instant KSA/UAE credit card checkout.<br>• Launch Meta/TikTok ads targeting the AI diagnostic quiz (target CAC < $2).'}
      </div>
    </div>

    <div class="card" style="border-top: 3px solid #5DCAA5;">
      <div style="font-size: 12px; font-weight: 800; color: #5DCAA5; margin-bottom: 6px;">
        ${isAr ? 'المرحلة ٢: الأيام 31-60' : 'Phase 2: Days 31-60'}
      </div>
      <div style="font-size: 10px; color: #CBD5E1; line-height: 1.5;">
        <b>${isAr ? 'بيع اشتراكات الشركات (B2B):' : 'B2B Enterprise Team Seats:'}</b><br>
        ${isAr 
          ? '• تسويق الـ 100 مسار كحزمة تدريب وتأهيل سنوية للشركات والناشئة (باقات من $1,000 إلى $3,000 للمنظمة).<br>• توظيف 20 مؤثراً تقنياً في برنامج الإحالة لتحقيق انتشار فيروسي.' 
          : '• Package the 100 tracks as corporate upskilling licenses for SMEs ($1k-$3k/team).<br>• Onboard 20 key tech creators to the high-commission referral program.'}
      </div>
    </div>

    <div class="card" style="border-top: 3px solid #F59E0B;">
      <div style="font-size: 12px; font-weight: 800; color: #FBBF24; margin-bottom: 6px;">
        ${isAr ? 'المرحلة ٣: الأيام 61-100' : 'Phase 3: Days 61-100'}
      </div>
      <div style="font-size: 10px; color: #CBD5E1; line-height: 1.5;">
        <b>${isAr ? 'التطبيق والمجتمع الحصري:' : 'Mobile App & Retention Engine:'}</b><br>
        ${isAr 
          ? '• تغليف المنصة عبر Capacitor كـ Mobile App على App Store و Google Play.<br>• إطلاق تحديات جماعية شهرية ومسابقات Streak لتعزيز بقاء وتجديد الاشتراكات السنوية.' 
          : '• Wrap Next.js via Capacitor for iOS & Android app stores.<br>• Launch monthly community challenges to guarantee 60%+ year-two renewal rates.'}
      </div>
    </div>
  </div>

  <!-- FINANCIAL TARGETS -->
  <div class="card card-hover" style="padding: 12px; text-align: center;">
    <div style="font-size: 13px; font-weight: 800; color: #5DCAA5; margin-bottom: 4px;">
      📈 ${isAr ? 'التوقعات المالية التقديرية للسنة الأولى للمشتري (Pro-Forma Upside):' : 'Estimated Year 1 Potential For The Acquirer:'}
    </div>
    <div style="display: flex; justify-content: space-around; font-size: 11px; margin-top: 8px;">
      <div>
        <div style="color:#94A3B8;">${isAr ? 'المشتركون المستهدفون:' : 'Target Subscribers:'}</div>
        <div style="font-size: 18px; font-weight: 900; color: #FFF;">2,500 - 5,000</div>
      </div>
      <div>
        <div style="color:#94A3B8;">${isAr ? 'الإيرادات المتوقعة (ARR):' : 'Target Annual Run-Rate:'}</div>
        <div style="font-size: 18px; font-weight: 900; color: #5DCAA5;">$75,000 - $150,000</div>
      </div>
      <div>
        <div style="color:#94A3B8;">${isAr ? 'العائد على الاستثمار (ROI):' : 'Projected Acquirer ROI:'}</div>
        <div style="font-size: 18px; font-weight: 900; color: #FBBF24;">5x - 10x In Year 1</div>
      </div>
    </div>
  </div>

  <div class="footer-bar">
    <span>Tawwerni Project Context · Page 4/4</span>
    <span>End of Strategic Due Diligence Brief · Confidential</span>
  </div>
</div>

</body>
</html>`;
}

module.exports = {
  getProjectContextHtml
};
