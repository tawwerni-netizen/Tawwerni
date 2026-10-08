import fs from "fs";
import path from "path";
import { execSync } from "child_process";

const CHROME_PATH = "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe";
const OUTPUT_DIR = path.join(process.cwd(), "public", "brand");
const ARTIFACTS_DIR = "C:\\Users\\Hifzy\\.gemini\\antigravity\\brain\\e16b9879-e7df-4ae8-9957-cdca0922c4cb";

fs.mkdirSync(OUTPUT_DIR, { recursive: true });

interface LogoConfig {
  filename: string;
  width: number;
  height: number;
  html: string;
}

const configs: LogoConfig[] = [
  // 1. English Logo - Transparent for Dark Backgrounds (White text)
  {
    filename: "tawwerni-logo-dark-transparent.png",
    width: 2000,
    height: 500,
    html: `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<style>
  @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@700;800;900&display=swap');
  * { box-sizing: border-box; }
  html, body {
    margin: 0; padding: 0; width: 2000px; height: 500px; background: transparent;
    display: flex; align-items: center; justify-content: center; overflow: hidden;
    font-family: 'Plus Jakarta Sans', system-ui, -apple-system, sans-serif;
  }
  .wrapper { display: flex; align-items: center; gap: 42px; }
  .mark {
    width: 240px; height: 240px; border-radius: 64px;
    background: linear-gradient(145deg, #14b8a6 0%, #0f766e 55%, #042f2e 100%);
    box-shadow: 0 24px 48px -12px rgba(20, 184, 166, 0.45);
    display: flex; align-items: center; justify-content: center; flex-shrink: 0;
  }
  .mark svg { width: 195px; height: 195px; }
  .brand-text { display: flex; align-items: baseline; font-size: 155px; font-weight: 900; letter-spacing: -3.5px; line-height: 1; color: #ffffff; }
  .brand-text .dotcom { color: #14b8a6; font-weight: 900; margin-left: 2px; }
</style>
</head>
<body>
  <div class="wrapper">
    <div class="mark">
      <svg viewBox="0 0 48 48" fill="none">
        <path d="M13 32.5 L20.5 25 L26 30.5 L35.5 19" stroke="#ffffff" stroke-width="4.2" stroke-linecap="round" stroke-linejoin="round" />
        <path d="M29 19 H35.5 V25.5" stroke="#ffffff" stroke-width="4.2" stroke-linecap="round" stroke-linejoin="round" />
        <circle cx="13" cy="16" r="3.2" fill="#9fe1cb" />
      </svg>
    </div>
    <div class="brand-text">
      <span>Tawwerni</span><span class="dotcom">.com</span>
    </div>
  </div>
</body>
</html>`,
  },

  // 2. English Logo - Transparent for Light/White Backgrounds (Dark Navy text)
  {
    filename: "tawwerni-logo-light-transparent.png",
    width: 2000,
    height: 500,
    html: `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<style>
  @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@700;800;900&display=swap');
  * { box-sizing: border-box; }
  html, body {
    margin: 0; padding: 0; width: 2000px; height: 500px; background: transparent;
    display: flex; align-items: center; justify-content: center; overflow: hidden;
    font-family: 'Plus Jakarta Sans', system-ui, -apple-system, sans-serif;
  }
  .wrapper { display: flex; align-items: center; gap: 42px; }
  .mark {
    width: 240px; height: 240px; border-radius: 64px;
    background: linear-gradient(145deg, #14b8a6 0%, #0f766e 55%, #042f2e 100%);
    box-shadow: 0 24px 48px -12px rgba(15, 118, 110, 0.35);
    display: flex; align-items: center; justify-content: center; flex-shrink: 0;
  }
  .mark svg { width: 195px; height: 195px; }
  .brand-text { display: flex; align-items: baseline; font-size: 155px; font-weight: 900; letter-spacing: -3.5px; line-height: 1; color: #090f1d; }
  .brand-text .dotcom { color: #0d9488; font-weight: 900; margin-left: 2px; }
</style>
</head>
<body>
  <div class="wrapper">
    <div class="mark">
      <svg viewBox="0 0 48 48" fill="none">
        <path d="M13 32.5 L20.5 25 L26 30.5 L35.5 19" stroke="#ffffff" stroke-width="4.2" stroke-linecap="round" stroke-linejoin="round" />
        <path d="M29 19 H35.5 V25.5" stroke="#ffffff" stroke-width="4.2" stroke-linecap="round" stroke-linejoin="round" />
        <circle cx="13" cy="16" r="3.2" fill="#9fe1cb" />
      </svg>
    </div>
    <div class="brand-text">
      <span>Tawwerni</span><span class="dotcom">.com</span>
    </div>
  </div>
</body>
</html>`,
  },

  // 3. English Logo - Dark Luxury Background
  {
    filename: "tawwerni-logo-dark-solid.png",
    width: 2000,
    height: 500,
    html: `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<style>
  @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@700;800;900&display=swap');
  * { box-sizing: border-box; }
  html, body {
    margin: 0; padding: 0; width: 2000px; height: 500px;
    background: radial-gradient(circle at 50% 50%, #082622 0%, #031310 100%);
    display: flex; align-items: center; justify-content: center; overflow: hidden;
    font-family: 'Plus Jakarta Sans', system-ui, -apple-system, sans-serif;
  }
  .wrapper { display: flex; align-items: center; gap: 42px; }
  .mark {
    width: 240px; height: 240px; border-radius: 64px;
    background: linear-gradient(145deg, #14b8a6 0%, #0f766e 55%, #042f2e 100%);
    box-shadow: 0 24px 50px -10px rgba(20, 184, 166, 0.45);
    display: flex; align-items: center; justify-content: center; flex-shrink: 0;
  }
  .mark svg { width: 195px; height: 195px; }
  .brand-text { display: flex; align-items: baseline; font-size: 155px; font-weight: 900; letter-spacing: -3.5px; line-height: 1; color: #ffffff; }
  .brand-text .dotcom { color: #2dd4bf; font-weight: 900; margin-left: 2px; }
</style>
</head>
<body>
  <div class="wrapper">
    <div class="mark">
      <svg viewBox="0 0 48 48" fill="none">
        <path d="M13 32.5 L20.5 25 L26 30.5 L35.5 19" stroke="#ffffff" stroke-width="4.2" stroke-linecap="round" stroke-linejoin="round" />
        <path d="M29 19 H35.5 V25.5" stroke="#ffffff" stroke-width="4.2" stroke-linecap="round" stroke-linejoin="round" />
        <circle cx="13" cy="16" r="3.2" fill="#9fe1cb" />
      </svg>
    </div>
    <div class="brand-text">
      <span>Tawwerni</span><span class="dotcom">.com</span>
    </div>
  </div>
</body>
</html>`,
  },

  // 4. English Logo - Pure White Background
  {
    filename: "tawwerni-logo-white-solid.png",
    width: 2000,
    height: 500,
    html: `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<style>
  @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@700;800;900&display=swap');
  * { box-sizing: border-box; }
  html, body {
    margin: 0; padding: 0; width: 2000px; height: 500px;
    background: #ffffff;
    display: flex; align-items: center; justify-content: center; overflow: hidden;
    font-family: 'Plus Jakarta Sans', system-ui, -apple-system, sans-serif;
  }
  .wrapper { display: flex; align-items: center; gap: 42px; }
  .mark {
    width: 240px; height: 240px; border-radius: 64px;
    background: linear-gradient(145deg, #14b8a6 0%, #0f766e 55%, #042f2e 100%);
    box-shadow: 0 24px 48px -12px rgba(15, 118, 110, 0.3);
    display: flex; align-items: center; justify-content: center; flex-shrink: 0;
  }
  .mark svg { width: 195px; height: 195px; }
  .brand-text { display: flex; align-items: baseline; font-size: 155px; font-weight: 900; letter-spacing: -3.5px; line-height: 1; color: #0a0e1a; }
  .brand-text .dotcom { color: #0d9488; font-weight: 900; margin-left: 2px; }
</style>
</head>
<body>
  <div class="wrapper">
    <div class="mark">
      <svg viewBox="0 0 48 48" fill="none">
        <path d="M13 32.5 L20.5 25 L26 30.5 L35.5 19" stroke="#ffffff" stroke-width="4.2" stroke-linecap="round" stroke-linejoin="round" />
        <path d="M29 19 H35.5 V25.5" stroke="#ffffff" stroke-width="4.2" stroke-linecap="round" stroke-linejoin="round" />
        <circle cx="13" cy="16" r="3.2" fill="#9fe1cb" />
      </svg>
    </div>
    <div class="brand-text">
      <span>Tawwerni</span><span class="dotcom">.com</span>
    </div>
  </div>
</body>
</html>`,
  },

  // 5. Arabic Logo - Transparent for Dark Backgrounds
  {
    filename: "tawwerni-logo-arabic-dark-transparent.png",
    width: 2000,
    height: 500,
    html: `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<style>
  @import url('https://fonts.googleapis.com/css2?family=Cairo:wght@800;900&family=Plus+Jakarta+Sans:wght@900&display=swap');
  * { box-sizing: border-box; }
  html, body {
    margin: 0; padding: 0; width: 2000px; height: 500px; background: transparent;
    display: flex; align-items: center; justify-content: center; overflow: hidden;
    font-family: 'Cairo', 'Plus Jakarta Sans', system-ui, sans-serif;
    direction: rtl;
  }
  .wrapper { display: flex; align-items: center; gap: 42px; }
  .mark {
    width: 240px; height: 240px; border-radius: 64px;
    background: linear-gradient(145deg, #14b8a6 0%, #0f766e 55%, #042f2e 100%);
    box-shadow: 0 24px 48px -12px rgba(20, 184, 166, 0.45);
    display: flex; align-items: center; justify-content: center; flex-shrink: 0;
  }
  .mark svg { width: 195px; height: 195px; }
  .brand-text { display: flex; align-items: baseline; font-size: 155px; font-weight: 900; line-height: 1; color: #ffffff; }
  .brand-text .dotcom { color: #14b8a6; font-weight: 900; font-family: 'Plus Jakarta Sans'; margin-right: 8px; direction: ltr; }
</style>
</head>
<body>
  <div class="wrapper">
    <div class="mark">
      <svg viewBox="0 0 48 48" fill="none">
        <path d="M13 32.5 L20.5 25 L26 30.5 L35.5 19" stroke="#ffffff" stroke-width="4.2" stroke-linecap="round" stroke-linejoin="round" />
        <path d="M29 19 H35.5 V25.5" stroke="#ffffff" stroke-width="4.2" stroke-linecap="round" stroke-linejoin="round" />
        <circle cx="13" cy="16" r="3.2" fill="#9fe1cb" />
      </svg>
    </div>
    <div class="brand-text">
      <span>طوّرني</span><span class="dotcom">.com</span>
    </div>
  </div>
</body>
</html>`,
  },

  // 6. Arabic Logo - Transparent for Light/White Backgrounds
  {
    filename: "tawwerni-logo-arabic-light-transparent.png",
    width: 2000,
    height: 500,
    html: `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<style>
  @import url('https://fonts.googleapis.com/css2?family=Cairo:wght@800;900&family=Plus+Jakarta+Sans:wght@900&display=swap');
  * { box-sizing: border-box; }
  html, body {
    margin: 0; padding: 0; width: 2000px; height: 500px; background: transparent;
    display: flex; align-items: center; justify-content: center; overflow: hidden;
    font-family: 'Cairo', 'Plus Jakarta Sans', system-ui, sans-serif;
    direction: rtl;
  }
  .wrapper { display: flex; align-items: center; gap: 42px; }
  .mark {
    width: 240px; height: 240px; border-radius: 64px;
    background: linear-gradient(145deg, #14b8a6 0%, #0f766e 55%, #042f2e 100%);
    box-shadow: 0 24px 48px -12px rgba(15, 118, 110, 0.35);
    display: flex; align-items: center; justify-content: center; flex-shrink: 0;
  }
  .mark svg { width: 195px; height: 195px; }
  .brand-text { display: flex; align-items: baseline; font-size: 155px; font-weight: 900; line-height: 1; color: #090f1d; }
  .brand-text .dotcom { color: #0d9488; font-weight: 900; font-family: 'Plus Jakarta Sans'; margin-right: 8px; direction: ltr; }
</style>
</head>
<body>
  <div class="wrapper">
    <div class="mark">
      <svg viewBox="0 0 48 48" fill="none">
        <path d="M13 32.5 L20.5 25 L26 30.5 L35.5 19" stroke="#ffffff" stroke-width="4.2" stroke-linecap="round" stroke-linejoin="round" />
        <path d="M29 19 H35.5 V25.5" stroke="#ffffff" stroke-width="4.2" stroke-linecap="round" stroke-linejoin="round" />
        <circle cx="13" cy="16" r="3.2" fill="#9fe1cb" />
      </svg>
    </div>
    <div class="brand-text">
      <span>طوّرني</span><span class="dotcom">.com</span>
    </div>
  </div>
</body>
</html>`,
  },

  // 7. High-Res App Icon Badge (1024x1024)
  {
    filename: "tawwerni-icon-1024.png",
    width: 1024,
    height: 1024,
    html: `<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<style>
  * { box-sizing: border-box; }
  html, body {
    margin: 0; padding: 0; width: 1024px; height: 1024px; background: transparent;
    display: flex; align-items: center; justify-content: center; overflow: hidden;
  }
  .mark {
    width: 860px; height: 860px; border-radius: 230px;
    background: linear-gradient(145deg, #14b8a6 0%, #0f766e 55%, #042f2e 100%);
    box-shadow: 0 40px 90px -20px rgba(20, 184, 166, 0.55);
    display: flex; align-items: center; justify-content: center;
  }
  .mark svg { width: 680px; height: 680px; }
</style>
</head>
<body>
  <div class="mark">
    <svg viewBox="0 0 48 48" fill="none">
      <path d="M13 32.5 L20.5 25 L26 30.5 L35.5 19" stroke="#ffffff" stroke-width="4.4" stroke-linecap="round" stroke-linejoin="round" />
      <path d="M29 19 H35.5 V25.5" stroke="#ffffff" stroke-width="4.4" stroke-linecap="round" stroke-linejoin="round" />
      <circle cx="13" cy="16" r="3.3" fill="#9fe1cb" />
    </svg>
  </div>
</body>
</html>`,
  },
];

console.log("🚀 Generating Tawwerni.com Ultra High-Resolution Brand Logos...");

for (const cfg of configs) {
  const htmlFile = path.join(process.cwd(), `tmp_${cfg.filename}.html`);
  const outPng = path.join(OUTPUT_DIR, cfg.filename);
  fs.writeFileSync(htmlFile, cfg.html, "utf8");

  const cmd = `"${CHROME_PATH}" --headless=new --hide-scrollbars --default-background-color=00000000 --window-size=${cfg.width},${cfg.height} --screenshot="${outPng}" "file:///${htmlFile.replace(/\\/g, "/")}"`;
  try {
    execSync(cmd, { stdio: "ignore" });
    if (fs.existsSync(outPng)) {
      console.log(`✅ Generated: ${cfg.filename} (${cfg.width}x${cfg.height})`);
      // Copy to artifacts directory
      if (fs.existsSync(ARTIFACTS_DIR)) {
        fs.copyFileSync(outPng, path.join(ARTIFACTS_DIR, cfg.filename));
      }
    } else {
      console.error(`❌ Failed to create: ${cfg.filename}`);
    }
  } catch (e) {
    console.error(`Error rendering ${cfg.filename}:`, e);
  } finally {
    if (fs.existsSync(htmlFile)) fs.unlinkSync(htmlFile);
  }
}

// Also copy existing avatar to artifacts
const avatarPath = path.join(OUTPUT_DIR, "tawwerni-avatar-1280.png");
if (fs.existsSync(avatarPath) && fs.existsSync(ARTIFACTS_DIR)) {
  fs.copyFileSync(avatarPath, path.join(ARTIFACTS_DIR, "tawwerni-avatar-1280.png"));
}

console.log("🎉 All brand logos generated and deployed successfully!");
