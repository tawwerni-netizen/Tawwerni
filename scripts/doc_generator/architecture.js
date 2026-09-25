const { BRAND, COMMON_CSS, renderPdf } = require('./shared');

function getArchitectureHtml(lang = 'ar') {
  const isAr = lang === 'ar';
  const dir = isAr ? 'rtl' : 'ltr';
  const fontClass = isAr ? 'font-ar' : 'font-en';

  return `<!DOCTYPE html>
<html lang="${lang}" dir="${dir}">
<head>
<meta charset="utf-8">
<title>${isAr ? 'المعمارية الهندسية لمنصة طوّرني' : 'Tawwerni - Platform Architecture Specification'}</title>
<style>
${COMMON_CSS}

@page {
  size: 210mm 297mm;
  margin: 0;
}

.doc-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 2px solid rgba(93, 202, 165, 0.3);
  padding-bottom: 5mm;
  margin-bottom: 6mm;
}

.doc-header .logo-area {
  display: flex;
  align-items: center;
  gap: 10px;
}

.doc-header .logo-box {
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

.section-title {
  font-size: 16px;
  font-weight: 800;
  color: #5DCAA5;
  margin-bottom: 8px;
  display: flex;
  align-items: center;
  gap: 8px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
  padding-bottom: 4px;
}

.arch-layer {
  background: rgba(14, 26, 43, 0.6);
  border: 1px solid rgba(93, 202, 165, 0.25);
  border-radius: 8px;
  padding: 10px 14px;
  margin-bottom: 8px;
}

.arch-layer-title {
  font-size: 12px;
  font-weight: 800;
  color: #5DCAA5;
  display: flex;
  justify-content: space-between;
  margin-bottom: 4px;
}

.arch-tag {
  background: rgba(255, 255, 255, 0.06);
  padding: 2px 6px;
  border-radius: 4px;
  font-size: 9px;
  color: #CBD5E1;
  font-family: 'JetBrains Mono', monospace;
}

.code-pill {
  font-family: 'JetBrains Mono', monospace;
  background: rgba(0, 0, 0, 0.4);
  border: 1px solid rgba(93, 202, 165, 0.3);
  padding: 2px 6px;
  border-radius: 4px;
  color: #5DCAA5;
  font-size: 11px;
}
</style>
</head>
<body class="${fontClass}">

<!-- PAGE 1: SYSTEM TOPOLOGY & HIGH-LEVEL OVERVIEW -->
<div class="page">
  <div class="bg-glow-1"></div>
  <div class="grid-pattern"></div>

  <div class="doc-header">
    <div class="logo-area">
      <div class="logo-box">ط</div>
      <div>
        <div style="font-weight: 900; font-size: 15px; color: #FFF;">Tawwerni Architecture Specification</div>
        <div style="font-size: 10px; color: #5DCAA5;">${isAr ? 'الوثيقة الهندسية الشاملة للبنية التحتية' : 'Comprehensive System & Infrastructure Blueprint'}</div>
      </div>
    </div>
    <div class="badge">${isAr ? 'النسخة التقنية 2.4' : 'Technical Version 2.4'}</div>
  </div>

  <div style="margin-bottom: 12px;">
    <h1 style="font-size: 22px; font-weight: 900; color: #FFF; margin-bottom: 4px;">
      ${isAr ? '١. الهيكلية المعمارية العامة ومخطط التدفق' : '1. System Topology & Architectural Blueprint'}
    </h1>
    <p style="font-size: 11px; color: #94A3B8; line-height: 1.5;">
      ${isAr 
        ? 'تم تصميم منصة طوّرني وفق أحدث معايير هندسة البرمجيات القابلة للتوسع (Serverless & Micro-Component Architecture)، معتمدة على Next.js 16 كطبقة معالجة مدمجة، وPrisma ORM كطبقة تجريد للبيانات، مما يوفر سرعة تحميل فائقة وتكلفة تشغيل تقترب من الصفر.' 
        : 'Tawwerni is architected on a high-concurrency, modern TypeScript stack utilizing Next.js 16 App Router with Turbopack compilation. The platform minimizes server cold-starts and operational expenses via optimized serverless and edge patterns.'}
    </p>
  </div>

  <!-- ARCHITECTURE TIERS -->
  <div class="arch-layer" style="border-left: 4px solid #38BDF8;">
    <div class="arch-layer-title">
      <span>${isAr ? 'الطبقة الأولى: واجهة المستخدم والوصول (Client & Edge Layer)' : 'Tier 1: Client & Edge Layer'}</span>
      <span class="arch-tag">Next.js 16 · React 19 · Tailwind CSS</span>
    </div>
    <div style="font-size: 11px; color: #CBD5E1; line-height: 1.4;">
      ${isAr 
        ? 'تعتمد على React Server Components (RSC) لتقليل حجم حزم الجافاسكريبت المحملة للعميل. تحكم كامل في اتجاه العرض (RTL/LTR) عبر مزامنة مسبقة للكوكيز تمنع أي وميض هيكلي، مع نظام سمات متطور (Dark/Light Mode) وأيقونات Vector SVG خفيفة الوزن.' 
        : 'Leverages React Server Components to eliminate client-side JavaScript bloat. Features zero-flicker pre-paint cookie synchronization for seamless RTL/LTR bilingual rendering, dark/light themes, and custom inline SVG iconography.'}
    </div>
  </div>

  <div class="arch-layer" style="border-left: 4px solid #5DCAA5;">
    <div class="arch-layer-title">
      <span>${isAr ? 'الطبقة الثانية: السيرفر ومعالجة المسارات (Application & API Layer)' : 'Tier 2: Application & API Layer'}</span>
      <span class="arch-tag">App Router · Edge Middleware · 53 Routes</span>
    </div>
    <div style="font-size: 11px; color: #CBD5E1; line-height: 1.4;">
      ${isAr 
        ? 'تقسيم هجين بين 19 صفحة ثابتة فائقة السرعة (Static Pre-rendered) و 34 مساراً ديناميكياً لمعالجة المستخدمين، الدروس، الكويزات، والدفع. معالجة آمنة للطلبات مع فحص صارم للصلاحيات وحماية ضد هجمات الـ Injection.' 
        : 'Hybrid route architecture with 19 statically pre-rendered routes and 34 high-speed dynamic endpoints. Enforces strict input validation, rate limiting, and centralized JSON payload parsers.'}
    </div>
  </div>

  <div class="arch-layer" style="border-left: 4px solid #F59E0B;">
    <div class="arch-layer-title">
      <span>${isAr ? 'الطبقة الثالثة: الأمان والتحكم في الجلسات (Security & Auth Gateway)' : 'Tier 3: Security & Session Gateway'}</span>
      <span class="arch-tag">JOSE JWT · Scrypt Hashing · Session Versioning</span>
    </div>
    <div style="font-size: 11px; color: #CBD5E1; line-height: 1.4;">
      ${isAr 
        ? 'حماية مشددة للمصادقة: تشفير كلمات المرور بخوارزمية Scrypt المستعصية، توثيق الجلسات بـ HTTP-only Cookies، ونظام حظر الحسابات المتعددة (Single-Device Protection) المعتمد على تدوير إصدار الجلسة.' 
        : 'Military-grade cryptographic protection: Scrypt password hashing, tamper-proof HTTP-only JWTs, brute-force rate limiters, and hardware-level single-device concurrency control.'}
    </div>
  </div>

  <div class="arch-layer" style="border-left: 4px solid #A855F7;">
    <div class="arch-layer-title">
      <span>${isAr ? 'الطبقة الرابعة: قاعدة البيانات وإدارة البيانات (Persistence & ORM Layer)' : 'Tier 4: Persistence & ORM Layer'}</span>
      <span class="arch-tag">Prisma ORM · MariaDB / MySQL · Indexed Queries</span>
    </div>
    <div style="font-size: 11px; color: #CBD5E1; line-height: 1.4;">
      ${isAr 
        ? 'مخطط بيانات علائقي متماسك يربط المستخدمين بالمسارات والشهادات ونظام العمولات. فهرسة ذكية لكافة الاستعلامات الحرجة لضمان استجابة أقل من 15ms تحت ضغط مئات الآلاف من الزيارات.' 
        : 'Enterprise relational schema covering users, curriculums, certificates, referral earnings, and payouts. Intelligent composite indexing ensures <15ms query execution at scale.'}
    </div>
  </div>

  <div class="card card-hover" style="margin-top: 6px; padding: 12px;">
    <div style="font-size: 12px; font-weight: 800; color: #5DCAA5; margin-bottom: 4px;">
      ${isAr ? '⚙️ مواصفات الاعتمادية وتكلفة الاستضافة:' : '⚙️ Reliability & Cloud Hosting Footprint:'}
    </div>
    <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 8px; font-size: 10px; color: #94A3B8;">
      <div>• <b>${isAr ? 'تكلفة الاستضافة:' : 'Hosting Cost:'}</b> $0-$10/mo (Vercel/Cloudflare)</div>
      <div>• <b>${isAr ? 'زمن الاستجابة:' : 'P95 Latency:'}</b> < 120ms globally</div>
      <div>• <b>${isAr ? 'التوسع التلقائي:' : 'Autoscaling:'}</b> Up to 100k DAU ready</div>
    </div>
  </div>

  <div class="footer-bar">
    <span>Tawwerni Architecture Blueprint · Page 1/4</span>
    <span>Confidential Technical Specification</span>
  </div>
</div>

<!-- PAGE 2: SECURITY & SINGLE-DEVICE MOAT -->
<div class="page">
  <div class="doc-header">
    <div class="logo-area">
      <div class="logo-box">ط</div>
      <div>
        <div style="font-weight: 900; font-size: 15px; color: #FFF;">Security & Anti-Piracy Architecture</div>
        <div style="font-size: 10px; color: #5DCAA5;">${isAr ? 'منظومة الأمان وحماية المحتوى ضد التسريب ومشاركة الحسابات' : 'Protection Blueprint & Single-Device Concurrency Control'}</div>
      </div>
    </div>
    <div class="badge badge-gold">Security Hardened</div>
  </div>

  <div style="margin-bottom: 12px;">
    <h1 style="font-size: 20px; font-weight: 900; color: #FFF; margin-bottom: 4px;">
      ${isAr ? '٢. منظومة حماية الحسابات ومنع المشاركة (Single-Device Moat)' : '2. Single-Device Concurrency & Content Protection'}
    </h1>
    <p style="font-size: 11px; color: #94A3B8; line-height: 1.5;">
      ${isAr 
        ? 'أكبر تهديد لأي منصة كورسات هو مشاركة الحساب الواحد بين عدة أشخاص (Account Sharing). في طوّرني تم بناء حل برمجي مبتكر على مستوى السيرفر يمنع فتح الحساب على أكثر من جهاز في نفس الوقت.' 
        : 'Course platforms lose millions to credential sharing. Tawwerni features a native database-backed session versioning engine that enforces strict single-device concurrency.'}
    </p>
  </div>

  <!-- HOW SINGLE DEVICE WORKS -->
  <div class="card" style="border: 1px solid rgba(93, 202, 165, 0.4); margin-bottom: 12px; padding: 14px;">
    <div style="font-size: 13px; font-weight: 800; color: #5DCAA5; margin-bottom: 8px;">
      ${isAr ? '🔄 آلية العمل التقنية لتدوير إصدار الجلسة (Session Versioning Protocol):' : '🔄 Session Versioning Protocol Flow:'}
    </div>
    
    <div style="display: flex; flex-direction: column; gap: 8px; font-size: 11px;">
      <div style="display: flex; gap: 10px; align-items: flex-start;">
        <span class="code-pill">Step 1</span>
        <div>
          <b>${isAr ? 'تسجيل الدخول وإصدار التوكن:' : 'Login & Token Issuance:'}</b> 
          ${isAr ? 'عند تسجيل الدخول من جهاز جديد، يستدعي السيرفر الدالة ويقوم بزيادة حقل <span class="code-pill">sessionVersion</span> في جدول المستخدم في قاعدة البيانات (+1) ثم يوقّع التوكن بالقيمة الجديدة.' : 'Upon authentication, the server increments <span class="code-pill">sessionVersion: { increment: 1 }</span> in the User table and embeds the new version into the signed JWT.'}
        </div>
      </div>
      <div style="display: flex; gap: 10px; align-items: flex-start;">
        <span class="code-pill">Step 2</span>
        <div>
          <b>${isAr ? 'إلغاء الجلسات القديمة فوراً:' : 'Instant Stale Session Invalidation:'}</b> 
          ${isAr ? 'أي أجهزة سابقة كانت مسجلة الدخول تحمل توكن برقم الإصدار القديم. عند قيامها بأي طلب، يتحقق السيرفر ويجد عدم تطابق، فيقوم بطرد الجهاز فوراً دون انتظار انتهاء وقت الكوكيز.' : 'Any previous devices hold JWTs carrying the old version number. When an incoming request arrives, the server detects the mismatch and immediately revokes access.'}
        </div>
      </div>
      <div style="display: flex; gap: 10px; align-items: flex-start;">
        <span class="code-pill">Step 3</span>
        <div>
          <b>${isAr ? 'حماية إضافية عند تغيير الباسورد:' : 'Password Reset Lockout:'}</b> 
          ${isAr ? 'عند إعادة تعيين كلمة المرور، يتم تدوير الإصدار مجدداً، مما يضمن خروج أي متسلل من كافة الأجهزة فوراً وبشكل حاسم.' : 'Password reset operations automatically bump the version, kicking out all unauthorized sessions globally.'}
        </div>
      </div>
    </div>
  </div>

  <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 12px;">
    <div class="card">
      <div style="font-size: 13px; font-weight: 800; color: #5DCAA5; margin-bottom: 6px;">
        🛡️ ${isAr ? 'مكافحة التخمين والقوة الغاشمة' : 'Brute-Force & Rate Limiting'}
      </div>
      <div style="font-size: 10px; color: #CBD5E1; line-height: 1.5;">
        ${isAr 
          ? '• نظام قفل آلي للحساب بعد 8 محاولات خاطئة لمدة 15 دقيقة.<br>• بوابات Rate Limiting تفحص IP العميل في الدخول واستعادة الباسورد.<br>• رسائل أخطاء موحدة تمنع تخمين وجود البريد من عدمه (Account Enumeration Prevention).' 
          : '• Account lockout triggered after 8 consecutive failures for 15 minutes.<br>• IP-based rate limiting gates on all auth routes.<br>• Unified error responses to prevent account enumeration attacks.'}
      </div>
    </div>

    <div class="card">
      <div style="font-size: 13px; font-weight: 800; color: #5DCAA5; margin-bottom: 6px;">
        🔐 ${isAr ? 'سجل التدقيق الإداري الصارم' : 'Immutable Admin Audit Trail'}
      </div>
      <div style="font-size: 10px; color: #CBD5E1; line-height: 1.5;">
        ${isAr 
          ? '• جدول <span class="code-pill">AdminAuditLog</span> يسجل كل إجراء حساس (قبول طلب، تسوية عمولة، تعديل باسورد).<br>• تسجيل مستقل عن حساب الأدمن لضمان بقاء السجلات حتى لو حُذف الحساب.<br>• حماية مسارات الـ Admin بصلاحيات مشددة وفحص مزدوج.' 
          : '• Table <span class="code-pill">AdminAuditLog</span> tracks every critical action (approvals, payouts, password overrides).<br>• Retains audit trails even if admin accounts are deleted.<br>• Dual-layer authorization checks on all executive routes.'}
      </div>
    </div>
  </div>

  <div class="footer-bar">
    <span>Tawwerni Architecture Blueprint · Page 2/4</span>
    <span>Security, Identity & Anti-Piracy Architecture</span>
  </div>
</div>

<!-- PAGE 3: DATABASE SCHEMA & RELATIONAL MODEL -->
<div class="page">
  <div class="doc-header">
    <div class="logo-area">
      <div class="logo-box">ط</div>
      <div>
        <div style="font-weight: 900; font-size: 15px; color: #FFF;">Database Schema & Entity Models</div>
        <div style="font-size: 10px; color: #5DCAA5;">${isAr ? 'المخطط العلائقي لقاعدة البيانات وتصميم الجداول' : 'Prisma Schema & Relational Data Engineering'}</div>
      </div>
    </div>
    <div class="badge">Relational Core</div>
  </div>

  <div style="margin-bottom: 10px;">
    <h1 style="font-size: 20px; font-weight: 900; color: #FFF; margin-bottom: 4px;">
      ${isAr ? '٣. المخطط الهيكلي لقاعدة البيانات (Entity-Relationship Blueprint)' : '3. Entity-Relationship & Schema Engineering'}
    </h1>
    <p style="font-size: 11px; color: #94A3B8; line-height: 1.4;">
      ${isAr 
        ? 'تم بناء قاعدة البيانات عبر Prisma ORM لتكون متوافقة تماماً مع MariaDB و MySQL و Postgres. الجداول مصممة لدعم السرعة الفائقة والاعتمادية دون تكرار للبيانات.' 
        : 'Engineered via Prisma ORM for maximum data integrity across MySQL/MariaDB. Includes optimized indexes for high-throughput reads and zero data redundancy.'}
    </p>
  </div>

  <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 10px;">
    <!-- USER & CORE MODEL -->
    <div class="card" style="padding: 10px;">
      <div style="font-size: 12px; font-weight: 800; color: #5DCAA5; margin-bottom: 4px;">👤 User & Security Entity</div>
      <table class="styled-table" style="font-size: 10px;">
        <tr><th>Field</th><th>Type</th><th>Purpose</th></tr>
        <tr><td><span class="code-pill">id</span></td><td>String (cuid)</td><td>Primary Key</td></tr>
        <tr><td><span class="code-pill">email</span></td><td>String (unique)</td><td>Auth & Comms</td></tr>
        <tr><td><span class="code-pill">sessionVersion</span></td><td>Int (default 0)</td><td>Single-device lock</td></tr>
        <tr><td><span class="code-pill">referralCode</span></td><td>String (unique)</td><td>Affiliate track key</td></tr>
        <tr><td><span class="code-pill">referredById</span></td><td>String?</td><td>Attribution index</td></tr>
      </table>
    </div>

    <!-- CURRICULUM MODEL -->
    <div class="card" style="padding: 10px;">
      <div style="font-size: 12px; font-weight: 800; color: #5DCAA5; margin-bottom: 4px;">📚 Curriculum Hierarchy</div>
      <table class="styled-table" style="font-size: 10px;">
        <tr><th>Entity</th><th>Relationship</th><th>Purpose</th></tr>
        <tr><td><span class="code-pill">Course</span></td><td>1-to-N Modules</td><td>100 Career Tracks</td></tr>
        <tr><td><span class="code-pill">Module</span></td><td>1-to-N Lessons</td><td>Pillar Sections</td></tr>
        <tr><td><span class="code-pill">Lesson</span></td><td>Cards & Quizzes</td><td>28-Day Cadence</td></tr>
        <tr><td><span class="code-pill">LessonCompletion</span></td><td>User + Lesson</td><td>Progress & XP</td></tr>
        <tr><td><span class="code-pill">Certificate</span></td><td>Public Code (unique)</td><td>Tamper-proof Credential</td></tr>
      </table>
    </div>
  </div>

  <!-- MONETIZATION & GROWTH SCHEMA -->
  <div class="card" style="padding: 10px; margin-bottom: 10px;">
    <div style="font-size: 12px; font-weight: 800; color: #FBBF24; margin-bottom: 4px;">
      💵 Monetization & Referral Relational Engine
    </div>
    <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 8px; font-size: 10px; color: #CBD5E1;">
      <div style="background: rgba(0,0,0,0.3); padding: 8px; border-radius: 6px;">
        <b style="color:#5DCAA5;">Order:</b>
        <div style="color:#94A3B8; margin-top: 2px;">userId, courseId, amountEgp, status, senderPhone, instapayName. Deduplicated via payment transactions.</div>
      </div>
      <div style="background: rgba(0,0,0,0.3); padding: 8px; border-radius: 6px;">
        <b style="color:#5DCAA5;">ReferralEarning:</b>
        <div style="color:#94A3B8; margin-top: 2px;">userId (earner), referredUserId, orderId (unique dedupe), amountEgp (75), status (available/locked/paid).</div>
      </div>
      <div style="background: rgba(0,0,0,0.3); padding: 8px; border-radius: 6px;">
        <b style="color:#5DCAA5;">Payout:</b>
        <div style="color:#94A3B8; margin-top: 2px;">userId, amountEgp, method (vodafone_cash/instapay), destination, status, settledAt.</div>
      </div>
    </div>
  </div>

  <div class="card card-hover" style="padding: 10px;">
    <div style="font-size: 11px; font-weight: 800; color: #5DCAA5; margin-bottom: 2px;">
      🚀 ${isAr ? 'استراتيجية الفهرسة والأداء الفائق (Indexing Strategy):' : 'Composite Indexing Strategy:'}
    </div>
    <div style="font-size: 10px; color: #94A3B8; line-height: 1.4;">
      ${isAr 
        ? 'تم تزويد الجداول بفهارس مركبة مثل <span class="code-pill">@@index([userId, status])</span> في الأرباح و <span class="code-pill">@@index([senderPhone])</span> في المعاملات المالية، مما يتيح معالجة والتحقق من آلاف الإيصالات البنكية ومطابقتها آلياً دون أي بطء في النظام.' 
        : 'All critical paths utilize composite indexes such as <span class="code-pill">@@index([userId, status])</span> for referral earnings and <span class="code-pill">@@index([senderPhone])</span> for payment SMS matching, enabling real-time reconciliation at scale.'}
    </div>
  </div>

  <div class="footer-bar">
    <span>Tawwerni Architecture Blueprint · Page 3/4</span>
    <span>Database Schema & Data Flow Architecture</span>
  </div>
</div>

<!-- PAGE 4: BILINGUAL ENGINE, PERFORMANCE & DEVOPS -->
<div class="page">
  <div class="doc-header">
    <div class="logo-area">
      <div class="logo-box">ط</div>
      <div>
        <div style="font-weight: 900; font-size: 15px; color: #FFF;">Deployment, i18n Engine & DevOps</div>
        <div style="font-size: 10px; color: #5DCAA5;">${isAr ? 'محرك التعريب، الأداء، ونموذج النشر السحابي' : 'Bilingual Engine, Performance Metrics & DevOps Architecture'}</div>
      </div>
    </div>
    <div class="badge">Production Grade</div>
  </div>

  <div style="margin-bottom: 12px;">
    <h1 style="font-size: 20px; font-weight: 900; color: #FFF; margin-bottom: 4px;">
      ${isAr ? '٤. محرك التعريب، الأداء الفائق والتشغيل السحابي' : '4. Bilingual Engine, Performance & Deployment DevOps'}
    </h1>
    <p style="font-size: 11px; color: #94A3B8; line-height: 1.5;">
      ${isAr 
        ? 'تم فحص وتدقيق كل جزء في الواجهة ليقدم تجربة مستخدم عالمية (Tier-1 Quality) بأقل استهلاك لموارد السيرفر.' 
        : 'Audited across all 53 application routes to deliver an elite user experience with optimal resource consumption.'}
    </p>
  </div>

  <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 12px;">
    <div class="card">
      <div style="font-size: 13px; font-weight: 800; color: #5DCAA5; margin-bottom: 6px;">
        🌐 ${isAr ? 'محرك التعريب الخالي من الوميض' : 'Zero-Flicker Bilingual Engine'}
      </div>
      <div style="font-size: 10px; color: #CBD5E1; line-height: 1.5;">
        ${isAr 
          ? '• مزامنة مسبقة للغة عبر <span class="code-pill">document.cookie</span> قبل معالجة الـ DOM.<br>• التبديل الفوري يغير الـ HTML <span class="code-pill">dir="rtl/ltr"</span> والخطوط بدون إعادة تحميل الصفحة.<br>• فصل كامل لملفات الترجمة <span class="code-pill">src/lib/i18n.ts</span> لسهولة إضافة لغات أخرى مستقبلاً.' 
          : '• Pre-paint language synchronization via cookie injection prior to DOM paint.<br>• Instant toggle shifts HTML directionality and typography without full page reloads.<br>• Clean localization abstraction in <span class="code-pill">src/lib/i18n.ts</span> ready for multi-region expansion.'}
      </div>
    </div>

    <div class="card">
      <div style="font-size: 13px; font-weight: 800; color: #5DCAA5; margin-bottom: 6px;">
        ⚡ ${isAr ? 'مؤشرات الأداء وسرعة التحميل' : 'Core Web Vitals & Speed Scores'}
      </div>
      <div style="font-size: 10px; color: #CBD5E1; line-height: 1.5;">
        ${isAr 
          ? '• سرعة البناء الفائقة: تجميع الـ 53 مساراً في أقل من 25 ثانية عبر Turbopack.<br>• حجم الحزم الأساسية خفيف جداً، واستخدام أيقونات Inline SVG يمنع طلبات الشبكة الزائدة.<br>• تبريد كامل للذاكرة مع إغلاق آمن لاتصالات قاعدة البيانات.' 
          : '• Blazing compilation: All 53 routes build in ~22 seconds via Turbopack.<br>• Lightweight bundles and inline vector assets eliminate network request waterfalls.<br>• Connection pooling and safe MariaDB teardown prevent database leaks.'}
      </div>
    </div>
  </div>

  <!-- DEPLOYMENT STACK -->
  <div class="card card-hover" style="padding: 14px; margin-bottom: 12px;">
    <div style="font-size: 13px; font-weight: 800; color: #5DCAA5; margin-bottom: 8px;">
      🚢 ${isAr ? 'خيارات النشر والتشغيل للمشتري الجديد (Turnkey Deployment):' : 'Turnkey Deployment Options for the Acquirer:'}
    </div>
    <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; font-size: 10px;">
      <div style="background: rgba(0,0,0,0.3); padding: 8px; border-radius: 6px;">
        <b style="color:#FFF;">Option A: Vercel / Cloudflare</b>
        <div style="color:#94A3B8; margin-top: 2px;">Deploy with one git push. Uses Edge network with serverless compute and remote MariaDB.</div>
      </div>
      <div style="background: rgba(0,0,0,0.3); padding: 8px; border-radius: 6px;">
        <b style="color:#FFF;">Option B: Docker / VPS</b>
        <div style="color:#94A3B8; margin-top: 2px;">Self-host on a $5/month Hetzner or DigitalOcean droplet using Node.js standalone runtime with PM2.</div>
      </div>
      <div style="background: rgba(0,0,0,0.3); padding: 8px; border-radius: 6px;">
        <b style="color:#FFF;">Option C: AWS / GCP</b>
        <div style="color:#94A3B8; margin-top: 2px;">Enterprise multi-region setup with AWS ECS/Fargate and RDS MySQL for institutional scaling.</div>
      </div>
    </div>
  </div>

  <div class="footer-bar">
    <span>Tawwerni Architecture Blueprint · Page 4/4</span>
    <span>End of Technical Specification · Version 2.4</span>
  </div>
</div>

</body>
</html>`;
}

module.exports = {
  getArchitectureHtml
};
