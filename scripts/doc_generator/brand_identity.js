const { BRAND, COMMON_CSS, renderPdf } = require('./shared');

function getBrandIdentityHtml(lang = 'ar') {
  const isAr = lang === 'ar';
  const dir = isAr ? 'rtl' : 'ltr';
  const fontClass = isAr ? 'font-ar' : 'font-en';

  return `<!DOCTYPE html>
<html lang="${lang}" dir="${dir}">
<head>
<meta charset="utf-8">
<title>${isAr ? 'دليل الهوية البصرية لمنصة طوّرني' : 'Tawwerni - Brand Identity & Design System'}</title>
<style>
${COMMON_CSS}

@page {
  size: 210mm 297mm;
  margin: 0;
}

.brand-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 2px solid rgba(93, 202, 165, 0.3);
  padding-bottom: 5mm;
  margin-bottom: 6mm;
}

.brand-logo-badge {
  display: flex;
  align-items: center;
  gap: 10px;
}

.logo-icon {
  width: 34px;
  height: 34px;
  border-radius: 9px;
  background: linear-gradient(135deg, #1D9E75, #085041);
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 900;
  color: #FFF;
  font-size: 18px;
  box-shadow: 0 0 15px rgba(29, 158, 117, 0.4);
}

.swatch-card {
  border-radius: 10px;
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, 0.1);
  background: rgba(14, 26, 43, 0.6);
}

.swatch-color {
  height: 48px;
  width: 100%;
}

.swatch-info {
  padding: 8px 10px;
  font-size: 10px;
}

.swatch-info b {
  display: block;
  font-size: 11px;
  color: #FFF;
}

.swatch-info span {
  color: #94A3B8;
  font-family: 'JetBrains Mono', monospace;
  font-size: 9px;
}

.tone-box {
  background: rgba(14, 26, 43, 0.6);
  border: 1px solid rgba(93, 202, 165, 0.2);
  border-radius: 8px;
  padding: 10px 12px;
  margin-bottom: 8px;
}
</style>
</head>
<body class="${fontClass}">

<!-- PAGE 1: BRAND ESSENCE & VOICE -->
<div class="page">
  <div class="bg-glow-1"></div>
  <div class="grid-pattern"></div>

  <div class="brand-header">
    <div class="brand-logo-badge">
      <div class="logo-icon">ط</div>
      <div>
        <div style="font-weight: 900; font-size: 15px; color: #FFF;">Tawwerni Brand Guidelines</div>
        <div style="font-size: 10px; color: #5DCAA5;">${isAr ? 'دليل الهوية البصرية ونظام التصميم' : 'Design System & Visual Identity Manual'}</div>
      </div>
    </div>
    <div class="badge">${isAr ? 'الهوية الرسمية المعتمدة' : 'Official Guidelines 2026'}</div>
  </div>

  <div style="margin-bottom: 12px;">
    <h1 style="font-size: 22px; font-weight: 900; color: #FFF; margin-bottom: 4px;">
      ${isAr ? '١. فلسفة العلامة التجارية وصوت المنصة (Brand Essence)' : '1. Brand Philosophy & Tone of Voice'}
    </h1>
    <p style="font-size: 11px; color: #94A3B8; line-height: 1.5;">
      ${isAr 
        ? 'طوّرني هي علامة تجارية تجمع بين الفخامة المعاصرة والانضباط العملي. تهدف إلى تمكين الشباب العربي من اكتساب مهارات عالية الدخل في دقائق معدودة يومياً، متجاوزة الوعود الفارغة بتقديم أدوات واقعية قابلة للتطبيق الفوري.' 
        : 'Tawwerni represents modern tech elevation paired with practical rigor. It empowers Arabic and regional learners to master high-income skills through disciplined daily micro-habits, eschewing generic fluff for real-world velocity.'}
    </p>
  </div>

  <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 12px;">
    <div class="card" style="border-top: 3px solid #5DCAA5;">
      <div style="font-size: 13px; font-weight: 800; color: #5DCAA5; margin-bottom: 6px;">
        🎯 ${isAr ? 'الرسالة والرؤية (Mission & Vision)' : 'Mission & Core Vision'}
      </div>
      <div style="font-size: 10px; color: #CBD5E1; line-height: 1.5;">
        <b>${isAr ? 'الرسالة:' : 'Mission:'}</b> ${isAr ? 'تحويل التعلم اليومي العشوائي إلى تقدم وظيفي ومالي ملموس عبر 5 دقائق من التطبيق المركز يومياً.' : 'Transform random, unfinished courses into tangible career momentum through 5 minutes of focused daily execution.'}<br><br>
        <b>${isAr ? 'الرؤية:' : 'Vision:'}</b> ${isAr ? 'أن نكون المنصة الأكثر كفاءة وموثوقية في الشرق الأوسط وشمال أفريقيا لتعلم واحتراف مهارات عصر الذكاء الاصطناعي.' : 'Become the most dependable microlearning ecosystem in MENA for AI-era skills.'}
      </div>
    </div>

    <div class="card" style="border-top: 3px solid #F59E0B;">
      <div style="font-size: 13px; font-weight: 800; color: #FBBF24; margin-bottom: 6px;">
        💡 ${isAr ? 'شخصية المنصة والمرشد الذكي (Persona)' : 'The Brand Persona & "Faheem"'}
      </div>
      <div style="font-size: 10px; color: #CBD5E1; line-height: 1.5;">
        ${isAr 
          ? 'تم تجسيد صوت المنصة في المدرب الذكي <b>"فهيم"</b>: خبير تقني ودود ومباشر، لا يطيل الكلام، يشجعك باستمرار، ويعطيك الزبدة التطبيقية بدون تعقيد. يتحدث بعربية معاصرة سلسة خالية من التكلف.' 
          : 'Personified through the built-in AI mentor <b>"Faheem"</b>: sharp, pragmatic, encouraging, and focused on action. Communicates with energetic clarity, rejecting bureaucratic jargon.'}
      </div>
    </div>
  </div>

  <!-- TONE OF VOICE MATRIX -->
  <div class="card card-hover" style="padding: 12px; margin-bottom: 12px;">
    <div style="font-size: 13px; font-weight: 800; color: #5DCAA5; margin-bottom: 6px;">
      🗣️ ${isAr ? 'محددات نبرة الصوت (Tone of Voice Matrix):' : 'Tone of Voice Parameters:'}
    </div>
    <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; font-size: 10px;">
      <div class="tone-box">
        <b style="color:#FFF;">${isAr ? 'عملي وواقعي (Pragmatic)' : 'Pragmatic & Action-First'}</b>
        <div style="color:#94A3B8; margin-top: 2px;">${isAr ? 'نبدأ بالفعل والخطوة الأولى، لا نغرق في النظريات التي لا فائدة منها.' : 'We prioritize immediate execution over passive theory. Always provide a prompt or template.'}</div>
      </div>
      <div class="tone-box">
        <b style="color:#FFF;">${isAr ? 'محفز ومنضبط (Disciplined)' : 'Disciplined & Motivating'}</b>
        <div style="color:#94A3B8; margin-top: 2px;">${isAr ? 'نحتفل بالاستمرارية والـ Streak اليومي كقيمة أساسية للنجاح.' : 'We celebrate consistency, streak momentum, and small daily wins as real progress.'}</div>
      </div>
      <div class="tone-box">
        <b style="color:#FFF;">${isAr ? 'صادق وشفاف (Transparent)' : 'Transparent & Honest'}</b>
        <div style="color:#94A3B8; margin-top: 2px;">${isAr ? 'أسعارنا واضحة، بدون عدادات وهمية، وبضمان استرجاع حقيقي.' : 'No artificial countdowns or fake urgency. Clear pricing with zero hidden fees.'}</div>
      </div>
    </div>
  </div>

  <div class="footer-bar">
    <span>Tawwerni Brand Guidelines · Page 1/4</span>
    <span>Brand Identity, Essence & Voice</span>
  </div>
</div>

<!-- PAGE 2: LOGO GEOMETRY & CLEAR SPACE -->
<div class="page">
  <div class="brand-header">
    <div class="brand-logo-badge">
      <div class="logo-icon">ط</div>
      <div>
        <div style="font-weight: 900; font-size: 15px; color: #FFF;">Logo Geometry & Icon Mark</div>
        <div style="font-size: 10px; color: #5DCAA5;">${isAr ? 'هندسة الشعار، النسب، والمساحات الآمنة' : 'Logo Construction, Clear Space & Lockups'}</div>
      </div>
    </div>
    <div class="badge">Visual Standards</div>
  </div>

  <div style="margin-bottom: 12px;">
    <h1 style="font-size: 20px; font-weight: 900; color: #FFF; margin-bottom: 4px;">
      ${isAr ? '٢. تشريح الشعار والرمز البصري (Logo Anatomy)' : '2. Logo Construction & Mark Geometry'}
    </h1>
    <p style="font-size: 11px; color: #94A3B8; line-height: 1.5;">
      ${isAr 
        ? 'يجمع شعار طوّرني بين انسيابية الحرف العربي المعاصر ودقة الهندسة الرقمية، ليعبر عن الصعود المستمر والتطور السريع.' 
        : 'The Tawwerni brandmark merges fluid Arabic calligraphic roots with modern digital precision, conveying upward career ascension.'}
    </p>
  </div>

  <!-- LOGO PREVIEWS -->
  <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 14px; margin-bottom: 14px;">
    <div class="card" style="background: #070E18; padding: 20px; text-align: center; border: 1px solid rgba(93, 202, 165, 0.3);">
      <div style="font-size: 10px; color: #5DCAA5; font-weight: 700; margin-bottom: 12px; text-transform: uppercase;">
        ${isAr ? 'الشعار الأساسي (Dark Obsidian Edition)' : 'Primary Lockup (Dark Background)'}
      </div>
      <div style="display: inline-flex; align-items: center; gap: 12px; padding: 10px 18px; background: rgba(255,255,255,0.03); border-radius: 12px; border: 1px solid rgba(93, 202, 165, 0.2);">
        <div style="width: 44px; height: 44px; border-radius: 12px; background: linear-gradient(135deg, #1D9E75, #085041); display: flex; align-items: center; justify-content: center; font-weight: 900; font-size: 24px; color: #FFF; box-shadow: 0 0 20px rgba(29, 158, 117, 0.4);">
          ط
        </div>
        <div style="text-align: ${isAr ? 'right' : 'left'};">
          <div style="font-size: 22px; font-weight: 900; color: #FFF;">طوّرني <span style="font-size: 16px; color: #5DCAA5; font-family:'Plus Jakarta Sans'; font-weight:700;">Tawwerni</span></div>
          <div style="font-size: 9px; color: #94A3B8;">Microlearning Platform</div>
        </div>
      </div>
    </div>

    <div class="card" style="background: #FFFFFF; padding: 20px; text-align: center; border: 1px solid #E2E8F0;">
      <div style="font-size: 10px; color: #0F6E56; font-weight: 700; margin-bottom: 12px; text-transform: uppercase;">
        ${isAr ? 'الشعار الثانوي (Light Mode Edition)' : 'Secondary Lockup (Light Background)'}
      </div>
      <div style="display: inline-flex; align-items: center; gap: 12px; padding: 10px 18px; background: #F8FAFC; border-radius: 12px; border: 1px solid #CBD5E1;">
        <div style="width: 44px; height: 44px; border-radius: 12px; background: linear-gradient(135deg, #0F6E56, #1D9E75); display: flex; align-items: center; justify-content: center; font-weight: 900; font-size: 24px; color: #FFF;">
          ط
        </div>
        <div style="text-align: ${isAr ? 'right' : 'left'};">
          <div style="font-size: 22px; font-weight: 900; color: #0F172A;">طوّرني <span style="font-size: 16px; color: #0F6E56; font-family:'Plus Jakarta Sans'; font-weight:700;">Tawwerni</span></div>
          <div style="font-size: 9px; color: #64748B;">Microlearning Platform</div>
        </div>
      </div>
    </div>
  </div>

  <!-- RULES & CLEAR SPACE -->
  <div class="card" style="padding: 12px; margin-bottom: 12px;">
    <div style="font-size: 13px; font-weight: 800; color: #5DCAA5; margin-bottom: 6px;">
      📏 ${isAr ? 'المساحة الآمنة والقيود الصارمة (Clear Space & Rules):' : 'Clear Space & Usage Restrictions:'}
    </div>
    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px; font-size: 10px; color: #CBD5E1; line-height: 1.5;">
      <div>
        <b style="color:#5DCAA5;">${isAr ? 'المساحة المحمية (Clear Space):' : 'Clear Space Rule:'}</b><br>
        ${isAr ? 'يجب ترك مسافة حرة تعادل نصف عرض الأيقونة (0.5X) حول الشعار من جميع الجهات لضمان وضوحه التام وعدم تداخله مع أي نصوص.' : 'Maintain a minimum perimeter equal to 0.5X (half icon width) free of text and visual interference.'}
      </div>
      <div>
        <b style="color:#F87171;">${isAr ? 'الاستخدامات المحظورة (Never Do):' : 'Forbidden Usage:'}</b><br>
        ${isAr ? '• لا تقم بمط الشعار أفقياً أو رأسياً.<br>• لا تغيّر زاوية التدرج الزمردي.<br>• لا تضعه على خلفيات مشوشة تضعف التباين.' : '• Never stretch or distort aspect ratio.<br>• Never alter the emerald gradient angle.<br>• Never place on noisy, low-contrast photos.'}
      </div>
    </div>
  </div>

  <div class="footer-bar">
    <span>Tawwerni Brand Guidelines · Page 2/4</span>
    <span>Logo Architecture, Geometry & Mark</span>
  </div>
</div>

<!-- PAGE 3: COLOR SYSTEM & SWATCHES -->
<div class="page">
  <div class="brand-header">
    <div class="brand-logo-badge">
      <div class="logo-icon">ط</div>
      <div>
        <div style="font-weight: 900; font-size: 15px; color: #FFF;">Color Palette & Atmospheric System</div>
        <div style="font-size: 10px; color: #5DCAA5;">${isAr ? 'لوحة الألوان المعتمدة ورموز التدرجات' : 'Color System, Tokens & Gradients'}</div>
      </div>
    </div>
    <div class="badge badge-gold">Color Architecture</div>
  </div>

  <div style="margin-bottom: 12px;">
    <h1 style="font-size: 20px; font-weight: 900; color: #FFF; margin-bottom: 4px;">
      ${isAr ? '٣. المنظومة اللونية والتدرجات الفاخرة (Color System)' : '3. Official Palette & Atmospheric Gradients'}
    </h1>
    <p style="font-size: 11px; color: #94A3B8; line-height: 1.5;">
      ${isAr 
        ? 'تم اختيار الألوان بدقة لتحقق طابعاً يجمع بين الموثوقية العالية (الزمردي والتيل) والتقنية المتطورة (السواد الليلي العميق) مع لمسات ذهبية تدل على الإنجاز والتميز.' 
        : 'Engineered for optimal WCAG AAA contrast, featuring our signature emerald teal, deep space obsidian, and prestige gold accents.'}
    </p>
  </div>

  <!-- PRIMARY TEAL SCALE -->
  <div style="margin-bottom: 12px;">
    <div style="font-size: 12px; font-weight: 800; color: #5DCAA5; margin-bottom: 6px;">
      ${isAr ? 'ألوان التيل والزمرد الأساسية (Primary Emerald / Teal)' : 'Primary Emerald / Teal Spectrum'}
    </div>
    <div style="display: grid; grid-template-columns: repeat(5, 1fr); gap: 8px;">
      <div class="swatch-card">
        <div class="swatch-color" style="background: #04342C;"></div>
        <div class="swatch-info">
          <b>Teal 900</b>
          <span>#04342C</span>
        </div>
      </div>
      <div class="swatch-card">
        <div class="swatch-color" style="background: #0F6E56;"></div>
        <div class="swatch-info">
          <b>Teal 600</b>
          <span>#0F6E56</span>
        </div>
      </div>
      <div class="swatch-card">
        <div class="swatch-color" style="background: #1D9E75;"></div>
        <div class="swatch-info">
          <b>Teal 400 (Hero)</b>
          <span>#1D9E75</span>
        </div>
      </div>
      <div class="swatch-card">
        <div class="swatch-color" style="background: #5DCAA5;"></div>
        <div class="swatch-info">
          <b>Teal 200 (Accent)</b>
          <span>#5DCAA5</span>
        </div>
      </div>
      <div class="swatch-card">
        <div class="swatch-color" style="background: #E1F5EE;"></div>
        <div class="swatch-info">
          <b>Teal 50</b>
          <span>#E1F5EE</span>
        </div>
      </div>
    </div>
  </div>

  <!-- SECONDARY OBSIDIAN & ACCENTS -->
  <div style="margin-bottom: 12px;">
    <div style="font-size: 12px; font-weight: 800; color: #FBBF24; margin-bottom: 6px;">
      ${isAr ? 'الخلفيات الليلية ولمسات الإنجاز الذهبية (Obsidian & Prestige Gold)' : 'Obsidian Space & Prestige Gold Accents'}
    </div>
    <div style="display: grid; grid-template-columns: repeat(4, 1fr); gap: 8px;">
      <div class="swatch-card">
        <div class="swatch-color" style="background: #070E18;"></div>
        <div class="swatch-info">
          <b>Dark Obsidian</b>
          <span>#070E18</span>
        </div>
      </div>
      <div class="swatch-card">
        <div class="swatch-color" style="background: #0E1A2B;"></div>
        <div class="swatch-info">
          <b>Card Slate</b>
          <span>#0E1A2B</span>
        </div>
      </div>
      <div class="swatch-card">
        <div class="swatch-color" style="background: #F59E0B;"></div>
        <div class="swatch-info">
          <b>Prestige Gold</b>
          <span>#F59E0B</span>
        </div>
      </div>
      <div class="swatch-card">
        <div class="swatch-color" style="background: #FBBF24;"></div>
        <div class="swatch-info">
          <b>Gold Glow</b>
          <span>#FBBF24</span>
        </div>
      </div>
    </div>
  </div>

  <div class="footer-bar">
    <span>Tawwerni Brand Guidelines · Page 3/4</span>
    <span>Color Palette & Gradient Specifications</span>
  </div>
</div>

<!-- PAGE 4: TYPOGRAPHY & UI COMPONENTS -->
<div class="page">
  <div class="brand-header">
    <div class="brand-logo-badge">
      <div class="logo-icon">ط</div>
      <div>
        <div style="font-weight: 900; font-size: 15px; color: #FFF;">Typography & UI Component Library</div>
        <div style="font-size: 10px; color: #5DCAA5;">${isAr ? 'الخطوط الرسمية ومكونات واجهة المستخدم التفاعلية' : 'Typography Hierarchy & Custom UI Elements'}</div>
      </div>
    </div>
    <div class="badge">Component Specs</div>
  </div>

  <div style="margin-bottom: 12px;">
    <h1 style="font-size: 20px; font-weight: 900; color: #FFF; margin-bottom: 4px;">
      ${isAr ? '٤. الخطوط المعتمدة ومكونات الواجهة الفاخرة' : '4. Typography Scale & Bespoke UI Elements'}
    </h1>
    <p style="font-size: 11px; color: #94A3B8; line-height: 1.5;">
      ${isAr 
        ? 'تم بناء نظام خطوط متناسق بين العربية والإنجليزية يضمن الراحة الكاملة للعين وسرعة القراءة على مختلف الشاشات.' 
        : 'Harmonized bilingual typography hierarchy engineered for rapid reading on mobile and desktop.'}
    </p>
  </div>

  <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 12px;">
    <div class="card">
      <div style="font-size: 13px; font-weight: 800; color: #5DCAA5; margin-bottom: 6px;">
        العربية: خط كايرو (Cairo)
      </div>
      <div style="font-size: 11px; color: #CBD5E1; line-height: 1.6;">
        <span style="font-weight: 900; font-size: 15px;">طوّر مهاراتك اليومية بخمس دقائق</span><br>
        <span style="font-weight: 700;">عناوين رئيسية واضحة وجذابة (Weights: 700, 800, 900)</span><br>
        <span style="font-weight: 400; color:#94A3B8;">نصوص الدروس والمقالات بوزن خفيف ومريح للقراءة الطويلة (Weight: 400).</span>
      </div>
    </div>

    <div class="card">
      <div style="font-size: 13px; font-weight: 800; color: #5DCAA5; margin-bottom: 6px;">
        English: Plus Jakarta Sans
      </div>
      <div style="font-size: 11px; color: #CBD5E1; line-height: 1.6; font-family: 'Plus Jakarta Sans', sans-serif;">
        <span style="font-weight: 800; font-size: 15px;">Empower Your Career in Minutes</span><br>
        <span style="font-weight: 700;">Geometric Grotesque Hierarchy (700/800)</span><br>
        <span style="font-weight: 400; color:#94A3B8;">High x-height optimized for exceptional digital readability.</span>
      </div>
    </div>
  </div>

  <!-- BESPOKE UI ICONS & CHIPS -->
  <div class="card card-hover" style="padding: 12px;">
    <div style="font-size: 13px; font-weight: 800; color: #5DCAA5; margin-bottom: 8px;">
      ✨ ${isAr ? 'عناصر الواجهة الحصرية (Bespoke Header & Interactive Components):' : 'Bespoke UI Components & Micro-interactions:'}
    </div>
    <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; font-size: 10px;">
      <div style="background: rgba(0,0,0,0.3); padding: 8px; border-radius: 8px; text-align: center;">
        <div style="font-size: 18px; margin-bottom: 4px;">✦</div>
        <b style="color:#5DCAA5;">AI Q&A Beacon</b>
        <div style="color:#94A3B8; margin-top: 2px;">Multi-tone vector SVG with live pulsing indicator.</div>
      </div>
      <div style="background: rgba(0,0,0,0.3); padding: 8px; border-radius: 8px; text-align: center;">
        <div style="font-size: 18px; margin-bottom: 4px;">🔥</div>
        <b style="color:#FBBF24;">Streak Pill</b>
        <div style="color:#94A3B8; margin-top: 2px;">Gold amber badge celebrating daily learning habits.</div>
      </div>
      <div style="background: rgba(0,0,0,0.3); padding: 8px; border-radius: 8px; text-align: center;">
        <div style="font-size: 18px; margin-bottom: 4px;">🌐</div>
        <b style="color:#FFF;">Bilingual Switcher</b>
        <div style="color:#94A3B8; margin-top: 2px;">Instant zero-flicker vector globe toggle.</div>
      </div>
    </div>
  </div>

  <div class="footer-bar">
    <span>Tawwerni Brand Guidelines · Page 4/4</span>
    <span>Design Tokens, Typography & Component Standards</span>
  </div>
</div>

</body>
</html>`;
}

module.exports = {
  getBrandIdentityHtml
};
