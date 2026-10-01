import { writeFileSync, copyFileSync } from "fs";
import { execSync } from "child_process";
import { resolve } from "path";

const htmlContent = `<!DOCTYPE html>
<html lang="ar" dir="rtl">
<head>
  <meta charset="UTF-8">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Cairo:wght@600;700;800;900&display=swap" rel="stylesheet">
  <style>
    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }
    body {
      width: 1200px;
      height: 630px;
      overflow: hidden;
      font-family: 'Cairo', system-ui, -apple-system, sans-serif;
      background: #040e0b;
      color: #ffffff;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      padding: 40px 60px 36px 60px;
      position: relative;
    }
    /* Ambient Lighting Halos */
    .halo-top {
      position: absolute;
      top: -150px;
      left: 50%;
      transform: translateX(-50%);
      width: 900px;
      height: 480px;
      background: radial-gradient(circle, rgba(16, 185, 129, 0.32) 0%, rgba(20, 184, 166, 0.16) 50%, transparent 75%);
      filter: blur(60px);
      pointer-events: none;
    }
    .halo-left {
      position: absolute;
      bottom: -120px;
      left: -80px;
      width: 550px;
      height: 550px;
      background: radial-gradient(circle, rgba(16, 185, 129, 0.22) 0%, transparent 65%);
      filter: blur(70px);
      pointer-events: none;
    }
    .halo-right {
      position: absolute;
      bottom: -120px;
      right: -80px;
      width: 550px;
      height: 550px;
      background: radial-gradient(circle, rgba(245, 158, 11, 0.16) 0%, transparent 65%);
      filter: blur(70px);
      pointer-events: none;
    }
    /* Subtle dot grid */
    .grid-pattern {
      position: absolute;
      inset: 0;
      background-image: radial-gradient(circle at 1px 1px, rgba(52, 211, 153, 0.08) 1.5px, transparent 0);
      background-size: 32px 32px;
      pointer-events: none;
    }
    /* Sleek card border frame */
    .frame-border {
      position: absolute;
      inset: 16px;
      border: 1.5px solid rgba(16, 185, 129, 0.28);
      border-radius: 36px;
      pointer-events: none;
      box-shadow: inset 0 0 80px rgba(16, 185, 129, 0.06), 0 0 40px rgba(0, 0, 0, 0.8);
    }
    /* Top Bar */
    .top-bar {
      position: relative;
      z-index: 10;
      display: flex;
      align-items: center;
      justify-content: space-between;
      width: 100%;
      padding: 0 4px;
    }
    .brand-wrap {
      display: flex;
      align-items: center;
      gap: 14px;
    }
    .brand-icon {
      width: 50px;
      height: 50px;
      border-radius: 16px;
      background: linear-gradient(135deg, #10b981 0%, #059669 100%);
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 10px 24px -4px rgba(16, 185, 129, 0.55);
      border: 1px solid rgba(255, 255, 255, 0.2);
    }
    .brand-icon svg {
      width: 28px;
      height: 28px;
      fill: none;
      stroke: #ffffff;
      stroke-width: 2.8;
      stroke-linecap: round;
      stroke-linejoin: round;
    }
    .brand-name {
      font-size: 38px;
      font-weight: 900;
      letter-spacing: -0.5px;
      color: #ffffff;
      line-height: 1;
      display: flex;
      align-items: baseline;
    }
    .brand-dot {
      color: #34d399;
      font-size: 26px;
      font-weight: 800;
      margin-inline-start: 4px;
      font-family: system-ui, sans-serif;
    }
    .top-pill {
      display: inline-flex;
      align-items: center;
      gap: 10px;
      padding: 9px 20px;
      border-radius: 9999px;
      background: rgba(16, 185, 129, 0.14);
      border: 1.5px solid rgba(52, 211, 153, 0.45);
      color: #6ee7b7;
      font-size: 16px;
      font-weight: 800;
      box-shadow: 0 4px 20px rgba(16, 185, 129, 0.2);
    }
    .top-pill svg {
      width: 17px;
      height: 17px;
      fill: #fbbf24;
    }
    /* Center Hero */
    .hero-content {
      position: relative;
      z-index: 10;
      text-align: center;
      display: flex;
      flex-direction: column;
      align-items: center;
      margin-top: -4px;
    }
    .headline {
      font-size: 54px;
      font-weight: 900;
      line-height: 1.25;
      letter-spacing: -1px;
      margin-bottom: 12px;
      color: #ffffff;
      text-shadow: 0 6px 30px rgba(0, 0, 0, 0.8);
    }
    .gradient-text {
      background: linear-gradient(90deg, #34d399 0%, #14b8a6 50%, #fcd34d 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      display: inline-block;
    }
    .subtitle {
      font-size: 23px;
      font-weight: 700;
      color: #cbd5e1;
      max-width: 950px;
      line-height: 1.45;
      text-shadow: 0 2px 10px rgba(0, 0, 0, 0.5);
    }
    /* Bottom Stats Grid */
    .pills-grid {
      position: relative;
      z-index: 10;
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 16px;
      width: 100%;
    }
    .stat-card {
      background: rgba(10, 22, 18, 0.88);
      border: 1.5px solid rgba(16, 185, 129, 0.28);
      border-radius: 22px;
      padding: 16px 14px;
      text-align: center;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      box-shadow: 0 12px 28px -6px rgba(0, 0, 0, 0.55);
      backdrop-filter: blur(12px);
    }
    .stat-card.highlight {
      background: linear-gradient(135deg, rgba(16, 185, 129, 0.25) 0%, rgba(6, 26, 20, 0.95) 100%);
      border-color: rgba(52, 211, 153, 0.6);
      box-shadow: 0 14px 32px -4px rgba(16, 185, 129, 0.3);
    }
    .stat-title {
      font-size: 22px;
      font-weight: 900;
      color: #ffffff;
      line-height: 1.2;
      display: flex;
      align-items: center;
      gap: 8px;
    }
    .stat-card.highlight .stat-title {
      color: #6ee7b7;
    }
    .stat-icon {
      width: 22px;
      height: 22px;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      shrink: 0;
    }
    .stat-desc {
      font-size: 13.5px;
      font-weight: 700;
      color: #94a3b8;
      margin-top: 4px;
    }
    .stat-card.highlight .stat-desc {
      color: #a7f3d0;
    }
  </style>
</head>
<body>
  <div class="halo-top"></div>
  <div class="halo-left"></div>
  <div class="halo-right"></div>
  <div class="grid-pattern"></div>
  <div class="frame-border"></div>

  <!-- Top Bar -->
  <div class="top-bar">
    <div class="brand-wrap">
      <div class="brand-icon">
        <svg viewBox="0 0 24 24">
          <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline>
          <polyline points="17 6 23 6 23 12"></polyline>
        </svg>
      </div>
      <div class="brand-name">
        طوّرني<span class="brand-dot">.com</span>
      </div>
    </div>

    <div class="top-pill">
      <svg viewBox="0 0 24 24">
        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"></path>
      </svg>
      <span>عرض فوج التأسيس الأول · متاح الآن</span>
    </div>
  </div>

  <!-- Hero Content -->
  <div class="hero-content">
    <h1 class="headline">
      تعلّم بذكاء · طبّق في دقائق<br>
      <span class="gradient-text">واصنع دخلك بالذكاء الاصطناعي</span>
    </h1>
    <p class="subtitle">
      منظومة الـ ١٠٠ مسار احترافي في الذكاء الاصطناعي ومهارات المستقبل — ثنائية اللغة (عربي / إنجليزي)
    </p>
  </div>

  <!-- Bottom Badges Grid -->
  <div class="pills-grid">
    <div class="stat-card highlight">
      <div class="stat-title">
        <span class="stat-icon" style="color: #34d399;">
          <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <path d="M6 3h12l4 6-10 13L2 9z"></path>
          </svg>
        </span>
        <span>٣٤٩ ج.م فقط</span>
      </div>
      <div class="stat-desc">سنة كاملة · خصم 71%</div>
    </div>

    <div class="stat-card">
      <div class="stat-title">
        <span class="stat-icon" style="color: #38bdf8;">
          <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
            <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>
          </svg>
        </span>
        <span>+٢,١٨٢ درس</span>
      </div>
      <div class="stat-desc">تطبيقي في ١٠ مجالات</div>
    </div>

    <div class="stat-card">
      <div class="stat-title">
        <span class="stat-icon" style="color: #f43f5e;">
          <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="20 12 20 22 4 22 4 12"></polyline>
            <rect x="2" y="7" width="20" height="5"></rect>
            <line x1="12" y1="22" x2="12" y2="7"></line>
            <path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z"></path>
            <path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z"></path>
          </svg>
        </span>
        <span>اليوم الأول مجانًا</span>
      </div>
      <div class="stat-desc">في كل الـ ١٠٠ مسار</div>
    </div>

    <div class="stat-card">
      <div class="stat-title">
        <span class="stat-icon" style="color: #10b981;">
          <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
            <path d="m9 12 2 2 4-4"></path>
          </svg>
        </span>
        <span>ضمان ٤٨ ساعة</span>
      </div>
      <div class="stat-desc">استرجاع كامل بدون أسئلة</div>
    </div>
  </div>
</body>
</html>
`;

const tempHtmlPath = resolve("scripts/og-card-temp.html");
const outputJpgPath = resolve("src/app/opengraph-image.jpg");
const publicJpgPath = resolve("public/opengraph-image.jpg");
const chromePath = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";

writeFileSync(tempHtmlPath, htmlContent, "utf8");
console.log("Template written to:", tempHtmlPath);

const cmd = `"${chromePath}" --headless --screenshot="${outputJpgPath}" --window-size=1200,630 --hide-scrollbars --default-background-color=040e0b "file:///${tempHtmlPath.replace(/\\\\/g, "/")}"`;

console.log("Running Chrome screenshot command...");
execSync(cmd, { stdio: "inherit" });

copyFileSync(outputJpgPath, publicJpgPath);
console.log("Successfully generated and copied to:", outputJpgPath, "and", publicJpgPath);
