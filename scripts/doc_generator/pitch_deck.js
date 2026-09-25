const { BRAND, COMMON_CSS, renderPdf } = require('./shared');

function getPitchDeckHtml(lang = 'ar') {
  const isAr = lang === 'ar';
  const dir = isAr ? 'rtl' : 'ltr';
  const fontClass = isAr ? 'font-ar' : 'font-en';

  return `<!DOCTYPE html>
<html lang="${lang}" dir="${dir}">
<head>
<meta charset="utf-8">
<title>${isAr ? 'عرض الاستحواذ على منصة طوّرني' : 'Tawwerni - Acquisition Pitch Deck'}</title>
<style>
${COMMON_CSS}

@page {
  size: 297mm 210mm;
  margin: 0;
}

.slide {
  width: 297mm;
  height: 210mm;
  page-break-after: always;
  position: relative;
  overflow: hidden;
  background: radial-gradient(circle at 10% 20%, #052922 0%, #070e18 55%, #03060a 100%);
  padding: 16mm 20mm;
  display: flex;
  flex-direction: column;
}

.slide-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8mm;
  border-bottom: 1px solid rgba(93, 202, 165, 0.2);
  padding-bottom: 4mm;
}

.slide-title-wrap h2 {
  font-size: 22px;
  font-weight: 800;
  color: #FFFFFF;
  display: flex;
  align-items: center;
  gap: 8px;
}

.slide-title-wrap p {
  font-size: 11px;
  color: #94A3B8;
  margin-top: 2px;
}

.slide-number {
  font-size: 12px;
  font-weight: 700;
  color: #5DCAA5;
  background: rgba(93, 202, 165, 0.1);
  padding: 3px 10px;
  border-radius: 9999px;
  border: 1px solid rgba(93, 202, 165, 0.3);
}

.hero-metric {
  background: linear-gradient(135deg, rgba(15, 110, 86, 0.3) 0%, rgba(14, 26, 43, 0.7) 100%);
  border: 1px solid rgba(93, 202, 165, 0.3);
  border-radius: 12px;
  padding: 14px;
  text-align: center;
}

.hero-metric .num {
  font-size: 26px;
  font-weight: 900;
  color: #5DCAA5;
  font-family: 'Plus Jakarta Sans', system-ui, sans-serif;
}

.hero-metric .lbl {
  font-size: 11px;
  font-weight: 600;
  color: #CBD5E1;
  margin-top: 2px;
}

.feature-box {
  background: rgba(14, 26, 43, 0.6);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 10px;
  padding: 12px 14px;
  margin-bottom: 8px;
  display: flex;
  gap: 12px;
  align-items: flex-start;
}

.feature-box .icon {
  width: 32px;
  height: 32px;
  border-radius: 8px;
  background: rgba(29, 158, 117, 0.2);
  color: #5DCAA5;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  flex-shrink: 0;
}

.deal-card {
  background: linear-gradient(145deg, rgba(8, 80, 65, 0.35) 0%, rgba(14, 26, 43, 0.85) 100%);
  border: 1px solid rgba(93, 202, 165, 0.4);
  border-radius: 14px;
  padding: 18px;
  box-shadow: 0 10px 30px rgba(0,0,0,0.5);
}
</style>
</head>
<body class="${fontClass}">

<!-- SLIDE 1: COVER -->
<div class="slide">
  <div class="bg-glow-1"></div>
  <div class="bg-glow-2"></div>
  <div class="grid-pattern"></div>

  <div style="display: flex; justify-content: space-between; align-items: center;">
    <div style="display: flex; align-items: center; gap: 10px;">
      <div style="width: 38px; height: 38px; border-radius: 10px; background: linear-gradient(135deg, #1D9E75, #085041); display: flex; align-items: center; justify-content: center; font-weight: 900; font-size: 20px; color: #FFF; box-shadow: 0 0 20px rgba(29, 158, 117, 0.5);">
        ط
      </div>
      <div>
        <div style="font-size: 18px; font-weight: 900; color: #FFF; letter-spacing: 0.5px;">${isAr ? 'طوّرني | Tawwerni' : 'Tawwerni | طوّرني'}</div>
        <div style="font-size: 10px; color: #5DCAA5;">${isAr ? 'منصة التعليم المصغّر وتطوير المهارات' : 'Bilingual Microlearning & Career Elevation Platform'}</div>
      </div>
    </div>
    <div class="badge badge-gold">${isAr ? 'مذكرة استحواذ سرية وحصرية' : 'Confidential Acquisition Memorandum'}</div>
  </div>

  <div style="margin-top: auto; margin-bottom: auto; max-width: 850px;">
    <div class="badge" style="margin-bottom: 12px;">${isAr ? 'فرصة استثمارية جاهزة للإطلاق الفوري' : 'Turnkey EdTech Digital Asset for Sale'}</div>
    <h1 style="font-size: 38px; font-weight: 900; color: #FFFFFF; line-height: 1.25; margin-bottom: 14px;">
      ${isAr 
        ? 'استحواذ استراتيجي على منصة التعليم التفاعلي الأولى بـ <span style="color:#5DCAA5;">100 مسار مهني متكامل</span>' 
        : 'Strategic Acquisition of MENA\'s Premier Microlearning Platform with <span style="color:#5DCAA5;">100 Full Career Tracks</span>'}
    </h1>
    <p style="font-size: 15px; color: #94A3B8; line-height: 1.6; max-width: 750px;">
      ${isAr 
        ? 'منصة جاهزة للتشغيل الفوري (Turnkey SaaS) ثنائية اللغة مبنية بأحدث تقنيات Next.js 16، مع نموذج اشتراك سنوي ونظام إحالة فيروسي، متضمنة كافة الحقوق الفكرية، الكود المصدري، وبنك محتوى تعليمي ضخم يضم أكثر من 2,800 درس عملي.' 
        : 'A production-grade, bilingual EdTech asset built with Next.js 16 & Turbopack. Features a 1-year recurring model, viral affiliate engine, complete IP ownership, full source code, and a turnkey curriculum of 2,800+ micro-lessons across 10 vital disciplines.'}
    </p>
  </div>

  <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 14px; margin-bottom: 6mm;">
    <div class="hero-metric">
      <div class="num">100</div>
      <div class="lbl">${isAr ? 'مسار مهني وتطبيقي كامل' : 'Full Career Tracks'}</div>
    </div>
    <div class="hero-metric">
      <div class="num">2,800+</div>
      <div class="lbl">${isAr ? 'درس ومهام تطبيقية يومية' : 'Bite-Sized Practical Lessons'}</div>
    </div>
    <div class="hero-metric">
      <div class="num">100%</div>
      <div class="lbl">${isAr ? 'ملكية الكود والمحتوى بدون شراكة' : 'Proprietary IP & Full Codebase'}</div>
    </div>
    <div class="hero-metric">
      <div class="num">0 sec</div>
      <div class="lbl">${isAr ? 'جاهزة للتشغيل واستقبال الدفع' : 'Zero Setup - Turnkey Ready'}</div>
    </div>
  </div>

  <div class="footer-bar">
    <span>${isAr ? 'مذكرة عرض بيع خاصة · طوّرني 2026' : 'Private Placement Memorandum · Tawwerni 2026'}</span>
    <span>tawwerni.com · Confidential</span>
  </div>
</div>

<!-- SLIDE 2: THE PROBLEM & OPPORTUNITY -->
<div class="slide">
  <div class="slide-header">
    <div class="slide-title-wrap">
      <h2>${isAr ? 'فجوة السوق والفرصة الاستثمارية' : 'Market Gap & The Tawwerni Opportunity'}</h2>
      <p>${isAr ? 'لماذا تفشل منصات الكورسات التقليدية وكيف تملأ طوّرني الفراغ؟' : 'Why traditional video courses fail and how Tawwerni captures high-retention learners'}</p>
    </div>
    <div class="slide-number">02 / 06</div>
  </div>

  <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 18px; flex: 1;">
    <div class="card" style="border-left: 4px solid #EF4444;">
      <div style="font-size: 15px; font-weight: 800; color: #F87171; margin-bottom: 10px; display: flex; align-items: center; gap: 6px;">
        <span>⚠️</span> ${isAr ? 'معضلة التعليم الرقمي التقليدي (Pain Points)' : 'Traditional EdTech Failures'}
      </div>
      <div class="feature-box">
        <div class="icon" style="background: rgba(239, 68, 68, 0.15); color: #F87171;">⏳</div>
        <div>
          <div style="font-weight: 700; font-size: 13px; color: #FFF;">${isAr ? 'فيديوهات طويلة ومملة (نسبة إتمام < 4%)' : '40-Hour Video Fatigue (<4% Completion)'}</div>
          <div style="font-size: 11px; color: #94A3B8;">${isAr ? 'المستخدم يشتري الدورة ويشاهد أول ساعتين فقط ثم ينسحب لعدم وجود التزام يومي.' : 'Learners purchase lengthy courses but drop out after 2 hours due to lack of habit formation.'}</div>
        </div>
      </div>
      <div class="feature-box">
        <div class="icon" style="background: rgba(239, 68, 68, 0.15); color: #F87171;">🌐</div>
        <div>
          <div style="font-weight: 700; font-size: 13px; color: #FFF;">${isAr ? 'غياب التخصيص والمحتوى العربي المعاصر' : 'Outdated Arabic Content'}</div>
          <div style="font-size: 11px; color: #94A3B8;">${isAr ? 'معظم المنصات تقدم محتوى مترجم بشكل رديء أو دورات أصبحت متقادمة بعد ثورة الذكاء الاصطناعي.' : 'Most regional platforms offer rigid, outdated video libraries lacking modern AI workflows.'}</div>
        </div>
      </div>
      <div class="feature-box">
        <div class="icon" style="background: rgba(239, 68, 68, 0.15); color: #F87171;">💳</div>
        <div>
          <div style="font-weight: 700; font-size: 13px; color: #FFF;">${isAr ? 'اشتراكات شهرية متكررة تسبب تسرب المشتركين (High Churn)' : 'High Monthly Churn Subscriptions'}</div>
          <div style="font-size: 11px; color: #94A3B8;">${isAr ? 'النماذج الشهرية في العالم العربي تعاني من توقف الدفع بعد أول شهر بنسبة تفوق 75%.' : 'Monthly SaaS in MENA suffers 70%+ month-two churn due to payment friction.'}</div>
        </div>
      </div>
    </div>

    <div class="card card-hover" style="border-left: 4px solid #5DCAA5;">
      <div style="font-size: 15px; font-weight: 800; color: #5DCAA5; margin-bottom: 10px; display: flex; align-items: center; gap: 6px;">
        <span>✨</span> ${isAr ? 'معادلة طوّرني الرابحة (The Secret Sauce)' : 'Tawwerni\'s Proven Solution'}
      </div>
      <div class="feature-box">
        <div class="icon">⚡</div>
        <div>
          <div style="font-weight: 700; font-size: 13px; color: #FFF;">${isAr ? 'تعلّم مصغّر 5 دقائق يومياً (Microlearning)' : '5-Minute Daily Habitual Microlearning'}</div>
          <div style="font-size: 11px; color: #94A3B8;">${isAr ? 'دروس مركزة، مهام تطبيقية فورية، كويز تفاعلي يرفع نسبة الإتمام إلى أكثر من 45%.' : 'Bite-sized cards, actionable prompts, and interactive quizzes driving 45%+ completion.'}</div>
        </div>
      </div>
      <div class="feature-box">
        <div class="icon">🔥</div>
        <div>
          <div style="font-weight: 700; font-size: 13px; color: #FFF;">${isAr ? 'التلعيب وعادات الاستمرارية (Streak & XP)' : 'Gamification, Streaks & Verifiable Certificates'}</div>
          <div style="font-size: 11px; color: #94A3B8;">${isAr ? 'عداد الحماس اليومي، نقاط الخبرة، وشهادات إتمام ذكية يتم التحقق منها برابط فوري.' : 'Daily streak counter, XP leaderboards, and instant cryptographic certificate verification.'}</div>
        </div>
      </div>
      <div class="feature-box">
        <div class="icon">📅</div>
        <div>
          <div style="font-weight: 700; font-size: 13px; color: #FFF;">${isAr ? 'اشتراك سنوي دفعة واحدة (1-Year Pass)' : '1-Year Access Pass (Zero Month-to-Month Churn)'}</div>
          <div style="font-size: 11px; color: #94A3B8;">${isAr ? 'التحصيل مقدماً لعام كامل، تدفق كاش نقدي مباشر يمنح المشتري عائداً فورياً بدون مطاردة الاشتراكات.' : 'Cash upfront for 1 full year locks in customer LTV and generates immediate cash flow.'}</div>
        </div>
      </div>
    </div>
  </div>

  <div class="footer-bar">
    <span>Tawwerni Acquisition Deck</span>
    <span>Market Analysis & Competitive Moat</span>
  </div>
</div>

<!-- SLIDE 3: CONTENT & PRODUCT ASSET -->
<div class="slide">
  <div class="slide-header">
    <div class="slide-title-wrap">
      <h2>${isAr ? 'الأصل الرقمي: 100 مسار في 10 مجالات رئيسية' : 'The Asset: 100 Comprehensive Tracks Across 10 Pillars'}</h2>
      <p>${isAr ? 'مكتبة محتوى شاملة تغطي أعلى المهارات طلباً ودخلاً في سوق العمل' : 'Turnkey curriculum covering the most lucrative digital economy skills'}</p>
    </div>
    <div class="slide-number">03 / 06</div>
  </div>

  <div style="display: grid; grid-template-columns: repeat(5, 1fr); gap: 10px; margin-bottom: 12px;">
    <div class="card" style="text-align: center; padding: 10px;">
      <div style="font-size: 22px;">🤖</div>
      <div style="font-weight: 800; font-size: 12px; color: #5DCAA5; margin: 4px 0;">${isAr ? 'الذكاء الاصطناعي' : 'Artificial Intelligence'}</div>
      <div style="font-size: 10px; color: #94A3B8;">10 ${isAr ? 'مسارات' : 'Tracks'} · Prompts, LLMs, Automation</div>
    </div>
    <div class="card" style="text-align: center; padding: 10px;">
      <div style="font-size: 22px;">💻</div>
      <div style="font-weight: 800; font-size: 12px; color: #5DCAA5; margin: 4px 0;">${isAr ? 'البرمجة وتطوير الويب' : 'Web & Coding'}</div>
      <div style="font-size: 10px; color: #94A3B8;">10 ${isAr ? 'مسارات' : 'Tracks'} · React, Fullstack, Python</div>
    </div>
    <div class="card" style="text-align: center; padding: 10px;">
      <div style="font-size: 22px;">📊</div>
      <div style="font-weight: 800; font-size: 12px; color: #5DCAA5; margin: 4px 0;">${isAr ? 'تحليل البيانات' : 'Data Analytics'}</div>
      <div style="font-size: 10px; color: #94A3B8;">10 ${isAr ? 'مسارات' : 'Tracks'} · SQL, BI, Visualization</div>
    </div>
    <div class="card" style="text-align: center; padding: 10px;">
      <div style="font-size: 22px;">💼</div>
      <div style="font-weight: 800; font-size: 12px; color: #5DCAA5; margin: 4px 0;">${isAr ? 'العمل الحر والعالمي' : 'Global Freelancing'}</div>
      <div style="font-size: 10px; color: #94A3B8;">10 ${isAr ? 'مسارات' : 'Tracks'} · Upwork, High-Ticket Deals</div>
    </div>
    <div class="card" style="text-align: center; padding: 10px;">
      <div style="font-size: 22px;">📈</div>
      <div style="font-weight: 800; font-size: 12px; color: #5DCAA5; margin: 4px 0;">${isAr ? 'التسويق الرقمي' : 'Digital Marketing'}</div>
      <div style="font-size: 10px; color: #94A3B8;">10 ${isAr ? 'مسارات' : 'Tracks'} · Ads, Growth Hacking, SEO</div>
    </div>
    <div class="card" style="text-align: center; padding: 10px;">
      <div style="font-size: 22px;">🎨</div>
      <div style="font-weight: 800; font-size: 12px; color: #5DCAA5; margin: 4px 0;">${isAr ? 'تصميم تجربة المستخدم' : 'UI/UX & Design'}</div>
      <div style="font-size: 10px; color: #94A3B8;">10 ${isAr ? 'مسارات' : 'Tracks'} · Figma, Design Systems</div>
    </div>
    <div class="card" style="text-align: center; padding: 10px;">
      <div style="font-size: 22px;">🚀</div>
      <div style="font-weight: 800; font-size: 12px; color: #5DCAA5; margin: 4px 0;">${isAr ? 'ريادة الأعمال والمشاريع' : 'Entrepreneurship'}</div>
      <div style="font-size: 10px; color: #94A3B8;">10 ${isAr ? 'مسارات' : 'Tracks'} · Bootstrapping, Sales</div>
    </div>
    <div class="card" style="text-align: center; padding: 10px;">
      <div style="font-size: 22px;">🛡️</div>
      <div style="font-weight: 800; font-size: 12px; color: #5DCAA5; margin: 4px 0;">${isAr ? 'الأمن السيبراني' : 'Cybersecurity'}</div>
      <div style="font-size: 10px; color: #94A3B8;">10 ${isAr ? 'مسارات' : 'Tracks'} · Defense, Privacy, Ops</div>
    </div>
    <div class="card" style="text-align: center; padding: 10px;">
      <div style="font-size: 22px;">👑</div>
      <div style="font-weight: 800; font-size: 12px; color: #5DCAA5; margin: 4px 0;">${isAr ? 'القيادة والتفاوض' : 'Leadership & Career'}</div>
      <div style="font-size: 10px; color: #94A3B8;">10 ${isAr ? 'مسارات' : 'Tracks'} · Management, Communication</div>
    </div>
    <div class="card" style="text-align: center; padding: 10px;">
      <div style="font-size: 22px;">⚡</div>
      <div style="font-weight: 800; font-size: 12px; color: #5DCAA5; margin: 4px 0;">${isAr ? 'الإنتاجية وإدارة الذات' : 'Peak Productivity'}</div>
      <div style="font-size: 10px; color: #94A3B8;">10 ${isAr ? 'مسارات' : 'Tracks'} · Focus, Deep Work, Habits</div>
    </div>
  </div>

  <div class="card card-hover" style="display: flex; gap: 18px; align-items: center; padding: 14px 18px;">
    <div style="font-size: 32px;">💎</div>
    <div style="flex: 1;">
      <div style="font-size: 14px; font-weight: 800; color: #FFFFFF;">${isAr ? 'القيمة الحقيقية للمحتوى (Replacement Cost)' : 'Content Asset Replacement Cost'}</div>
      <div style="font-size: 11px; color: #CBD5E1; line-height: 1.5;">
        ${isAr 
          ? 'بناء هذا المحتوى من الصفر (كتابة 2,800 درس عملي + بنك أسئلة + كويزات تفاعلية + ترجمة ثنائية معتمدة) يتطلب توظيف 5 خبراء محتوى لمدة 6 أشهر بتكلفة إنتاج تتجاوز <b style="color:#5DCAA5;">18,000 دولار أمريكي</b>. المشتري يحصل على الأصل جاهزاً بالكامل لليوم الأول.' 
          : 'Building this curriculum from scratch (authoring 2,800+ practical lessons, interactive quizzes, multi-language parity, and pedagogical sequencing) would take a dedicated team 6+ months and upwards of <b style="color:#5DCAA5;">$18,000 USD</b> in direct authoring costs.'}
      </div>
    </div>
  </div>

  <div class="footer-bar">
    <span>Tawwerni Acquisition Deck</span>
    <span>Turnkey Educational Portfolio</span>
  </div>
</div>

<!-- SLIDE 4: MONETIZATION & GROWTH -->
<div class="slide">
  <div class="slide-header">
    <div class="slide-title-wrap">
      <h2>${isAr ? 'نموذج الإيرادات والتسويق الفيروسي' : 'Monetization Model & Viral Unit Economics'}</h2>
      <p>${isAr ? 'محرك نمو ذاتي يعتمد على هوامش ربح عالية ونظام عمولات تحفيزي' : 'High-margin cash upfront model paired with an integrated growth loop'}</p>
    </div>
    <div class="slide-number">04 / 06</div>
  </div>

  <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-bottom: 12px;">
    <div class="card">
      <div style="font-size: 14px; font-weight: 800; color: #5DCAA5; margin-bottom: 10px; display: flex; align-items: center; gap: 6px;">
        <span>💰</span> ${isAr ? 'قنوات الدخل الأساسية (Revenue Streams)' : 'Direct Revenue Channels'}
      </div>
      <table class="styled-table">
        <tr>
          <th>${isAr ? 'المنتج' : 'Product'}</th>
          <th>${isAr ? 'السعر' : 'Price Point'}</th>
          <th>${isAr ? 'هامش الربح' : 'Gross Margin'}</th>
        </tr>
        <tr>
          <td><b>${isAr ? 'اشتراك 1-Year All-Access' : '1-Year All-Access Pass'}</b></td>
          <td>349 EGP / $29 USD</td>
          <td style="color:#5DCAA5; font-weight:700;">94%</td>
        </tr>
        <tr>
          <td><b>${isAr ? 'ترقية سريعة (Order Bump)' : 'Secret Prompts Order Bump'}</b></td>
          <td>99 EGP / $8 USD</td>
          <td style="color:#5DCAA5; font-weight:700;">99%</td>
        </tr>
        <tr>
          <td><b>${isAr ? 'اشتراكات الشركات (B2B)' : 'Corporate / Team Seats'}</b></td>
          <td>${isAr ? 'تسعير مخصص للشركات' : 'Custom Team Tiers'}</td>
          <td style="color:#5DCAA5; font-weight:700;">90%+</td>
        </tr>
      </table>
      <div style="font-size: 11px; color: #94A3B8; margin-top: 6px;">
        ${isAr ? '✓ دعم الدفع الفوري بمصر (Vodafone Cash + InstaPay) مع لوحة تحكم فورية، وقابلية فورية لربط Stripe/Paymob للخليج والعالم.' : '✓ Integrated Egyptian mobile wallets (Vodafone Cash + InstaPay) with instant pluggability for Stripe / Paymob.'}
      </div>
    </div>

    <div class="card card-gold">
      <div style="font-size: 14px; font-weight: 800; color: #FBBF24; margin-bottom: 10px; display: flex; align-items: center; gap: 6px;">
        <span>🚀</span> ${isAr ? 'محرك الإحالة الفيروسي (Affiliate Loop)' : 'Built-In Viral Affiliate Loop'}
      </div>
      <div style="font-size: 11px; color: #E2E8F0; line-height: 1.6; margin-bottom: 10px;">
        ${isAr 
          ? 'المنصة مزودة بنظام إحالة برمجي كامل (Affiliate System) يمنح كل مشترك رابطاً خاصاً وكوداً فريداً، ويمنحه عمولة 75 ج.م عند إحالة صديق.'
          : 'Built-in referral architecture turns students into brand ambassadors. Every user gets a unique trackable code with automated commission calculations.'}
      </div>
      <div style="background: rgba(0,0,0,0.3); border-radius: 8px; padding: 10px; font-size: 11px;">
        <div style="display: flex; justify-content: space-between; margin-bottom: 4px;">
          <span style="color:#94A3B8;">${isAr ? 'عمولة الإحالة المسددة:' : 'Referral Commission:'}</span>
          <span style="color:#5DCAA5; font-weight:700;">75 EGP / Sale</span>
        </div>
        <div style="display: flex; justify-content: space-between; margin-bottom: 4px;">
          <span style="color:#94A3B8;">${isAr ? 'المبيعات لتغطية التكلفة للمستخدم:' : 'Sales to Break-Even:'}</span>
          <span style="color:#FBBF24; font-weight:700;">5 ${isAr ? 'إحالات فقط' : 'Referrals'}</span>
        </div>
        <div style="display: flex; justify-content: space-between;">
          <span style="color:#94A3B8;">${isAr ? 'تكلفة اكتساب العميل المباشرة (CAC):' : 'Effective Organic CAC:'}</span>
          <span style="color:#5DCAA5; font-weight:700;">${isAr ? 'شبه صفرية عبر الطلاب' : 'Near Zero via Word-of-Mouth'}</span>
        </div>
      </div>
    </div>
  </div>

  <div class="footer-bar">
    <span>Tawwerni Acquisition Deck</span>
    <span>Monetization & Organic Growth Architecture</span>
  </div>
</div>

<!-- SLIDE 5: TECH STACK & SINGLE-DEVICE MOAT -->
<div class="slide">
  <div class="slide-header">
    <div class="slide-title-wrap">
      <h2>${isAr ? 'البنية التقنية وحماية الملكية الفكرية' : 'Technology Stack & Security Architecture'}</h2>
      <p>${isAr ? 'هندسة برمجية حديثة تضمن الاستقرار، السرعة الفائقة، ومنع مشاركة الحسابات' : 'Modern serverless architecture engineered for speed, scalability, and account security'}</p>
    </div>
    <div class="slide-number">05 / 06</div>
  </div>

  <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 14px; margin-bottom: 12px;">
    <div class="card">
      <div style="font-size: 18px; margin-bottom: 6px;">⚡</div>
      <div style="font-size: 13px; font-weight: 800; color: #5DCAA5;">Next.js 16 + Turbopack</div>
      <div style="font-size: 11px; color: #94A3B8; margin-top: 4px; line-height: 1.5;">
        ${isAr 
          ? 'واجهة تفاعلية خفيفة جداً، معالجة على السيرفر (SSR)، وتحميل فوري للصفحات مع تزامن كامل للغة بدون وميض (Zero-Flicker).' 
          : 'High-speed App Router architecture, server-rendered components, instant navigation, and zero-flicker bilingual hydration.'}
      </div>
    </div>
    <div class="card">
      <div style="font-size: 18px; margin-bottom: 6px;">🛡️</div>
      <div style="font-size: 13px; font-weight: 800; color: #5DCAA5;">Single-Device Protection</div>
      <div style="font-size: 11px; color: #94A3B8; margin-top: 4px; line-height: 1.5;">
        ${isAr 
          ? 'حماية مشددة: كل تسجيل دخول جديد يلغي فوراً الجلسات السابقة (Session Versioning)، مما يمنع تسريب الحسابات بين عدة أجهزة نهائياً.' 
          : 'Strict single-session concurrency: Every new sign-in increments database sessionVersion, automatically invalidating stale sessions.'}
      </div>
    </div>
    <div class="card">
      <div style="font-size: 18px; margin-bottom: 6px;">🗄️</div>
      <div style="font-size: 13px; font-weight: 800; color: #5DCAA5;">Prisma ORM & MariaDB</div>
      <div style="font-size: 11px; color: #94A3B8; margin-top: 4px; line-height: 1.5;">
        ${isAr 
          ? 'قاعدة بيانات علائقية متماسكة تدعم مئات الآلاف من الطلاب، مع سجل تدقيق إداري (Audit Log) وتتبع دقيق للعمولات والشهادات.' 
          : 'Strict schema relations, indexed performance for millions of lessons, audit logs for compliance, and instant backup capabilities.'}
      </div>
    </div>
  </div>

  <div class="card card-hover" style="padding: 14px 18px;">
    <div style="font-size: 13px; font-weight: 800; color: #FFFFFF; margin-bottom: 6px;">
      ${isAr ? '🌐 التوافق الثنائي التام (Bilingual Architectural Parity)' : 'Full Bilingual Architectural Parity'}
    </div>
    <div style="font-size: 11px; color: #CBD5E1; line-height: 1.6;">
      ${isAr 
        ? 'تم تدقيق كافة المسارات البرمجية (53 مساراً) لتكون ثنائية اللغة بنسبة 100%، حيث يدعم النظام التبديل الفوري مع ضبط تلقائي لاتجاه الواجهة (RTL/LTR)، الخطوط المعتمدة (Cairo و Plus Jakarta Sans)، وتخزين تفضيلات المستخدم دون الحاجة لملفات ثقيلة.' 
        : 'Every single route and component is 100% localized with zero hardcoded leaks. Cookie and localStorage pre-paint synchronization ensures flawless RTL/LTR directionality without layout shift.'}
    </div>
  </div>

  <div class="footer-bar">
    <span>Tawwerni Acquisition Deck</span>
    <span>Software Engineering & Security Moat</span>
  </div>
</div>

<!-- SLIDE 6: THE DEAL & ACQUISITION TERMS -->
<div class="slide">
  <div class="slide-header">
    <div class="slide-title-wrap">
      <h2>${isAr ? 'تفاصيل صفقة الاستحواذ والتسليم' : 'Acquisition Package & Transaction Terms'}</h2>
      <p>${isAr ? 'نقل ملكية كامل وشامل لكافة الأصول الرقمية والتقنية للمشتري الجديد' : 'Full intellectual property transfer, technical onboarding, and commercial terms'}</p>
    </div>
    <div class="slide-number">06 / 06</div>
  </div>

  <div style="display: grid; grid-template-columns: 1.2fr 0.8fr; gap: 16px; flex: 1;">
    <div class="card" style="padding: 16px;">
      <div style="font-size: 14px; font-weight: 800; color: #5DCAA5; margin-bottom: 10px;">
        ${isAr ? '📦 محتويات صفقة البيع (What is Included)' : 'Complete Asset Transfer Package'}
      </div>
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px; font-size: 11px;">
        <div style="display: flex; gap: 6px; align-items: center;"><span style="color:#5DCAA5;">✓</span> ${isAr ? 'الكود المصدري الكامل 100%' : '100% Full Source Code'}</div>
        <div style="display: flex; gap: 6px; align-items: center;"><span style="color:#5DCAA5;">✓</span> ${isAr ? 'محتوى 100 مسار كامل' : '100 Complete Course Curriculums'}</div>
        <div style="display: flex; gap: 6px; align-items: center;"><span style="color:#5DCAA5;">✓</span> ${isAr ? 'قاعدة البيانات وبنية السيرفر' : 'Production Database & Schemas'}</div>
        <div style="display: flex; gap: 6px; align-items: center;"><span style="color:#5DCAA5;">✓</span> ${isAr ? 'اسم النطاق الرسمي (tawwerni.com)' : 'Primary Domain (tawwerni.com)'}</div>
        <div style="display: flex; gap: 6px; align-items: center;"><span style="color:#5DCAA5;">✓</span> ${isAr ? 'لوحة تحكم الإدارة الشاملة' : 'Executive Admin Dashboard'}</div>
        <div style="display: flex; gap: 6px; align-items: center;"><span style="color:#5DCAA5;">✓</span> ${isAr ? 'هوية العلامة والأصول التصميمية' : 'Brand Identity & Design Assets'}</div>
        <div style="display: flex; gap: 6px; align-items: center;"><span style="color:#5DCAA5;">✓</span> ${isAr ? 'حسابات التواصل الاجتماعي' : 'Social Channels & Brand Handles'}</div>
        <div style="display: flex; gap: 6px; align-items: center;"><span style="color:#5DCAA5;">✓</span> ${isAr ? 'دعم فني وتسليم لمدة 30 يوماً' : '30-Day Technical Transition'}</div>
      </div>

      <div style="margin-top: 14px; padding-top: 10px; border-top: 1px solid rgba(255,255,255,0.08); font-size: 11px; color: #94A3B8;">
        <b style="color:#FFF;">${isAr ? 'المشتري المثالي للمنصة:' : 'Ideal Strategic Buyers:'}</b><br>
        ${isAr 
          ? '• مراكز التدريب والأكاديميات التقليدية الراغبة في التحول الرقمي الفوري.<br>• صناع المحتوى والمؤثرون في مجال التقنية والأعمال.<br>• المستثمرون في منصات Micro-SaaS الباحثون عن عائد نقدي سريع بدون تكاليف تطوير.' 
          : '• Training Academies & Bootcamps seeking immediate digital transformation.<br>• Tech & Business Influencers seeking proprietary monetization.<br>• SaaS investors looking for a high-margin, zero-maintenance asset.'}
      </div>
    </div>

    <div class="deal-card" style="display: flex; flex-direction: column; justify-content: center; text-align: center;">
      <div class="badge badge-gold" style="align-self: center; margin-bottom: 8px;">${isAr ? 'تسعير البيع السريع' : 'Attractive Exit Valuation'}</div>
      <div style="font-size: 28px; font-weight: 900; color: #5DCAA5; font-family: 'Plus Jakarta Sans', sans-serif;">
        $12,000 - $15,000 USD
      </div>
      <div style="font-size: 12px; color: #CBD5E1; margin-top: 2px;">
        ${isAr ? 'أو ما يعادله بالجنيه المصري / الريال السعودي' : 'Or Equivalent in Local Currency'}
      </div>
      <div style="font-size: 11px; color: #94A3B8; margin-top: 12px; line-height: 1.5;">
        ${isAr 
          ? 'أقل من نصف تكلفة بناء المنصة من الصفر، ومتاحة للاستحواذ الفوري ونقل الملكية خلال 48 ساعة.' 
          : 'Priced well below replacement cost for an immediate, friction-free ownership transition within 48 hours.'}
      </div>
      <div style="margin-top: 14px; background: rgba(0,0,0,0.4); padding: 8px; border-radius: 8px; font-size: 10px; color: #5DCAA5;">
        <b>${isAr ? 'للتواصل المباشر مع المالك:' : 'Direct Inquiries:'}</b> tawwerni@gmail.com
      </div>
    </div>
  </div>

  <div class="footer-bar">
    <span>Tawwerni Acquisition Deck · Final Slide</span>
    <span>Confidential · All Rights Reserved 2026</span>
  </div>
</div>

</body>
</html>`;
}

module.exports = {
  getPitchDeckHtml
};
