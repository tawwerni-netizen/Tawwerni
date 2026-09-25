const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

function renderPdf(htmlContent, outputPath, landscape = false) {
  const tempHtmlPath = outputPath.replace(/\.pdf$/i, '.temp.html');
  fs.writeFileSync(tempHtmlPath, htmlContent, 'utf8');

  const args = [
    '--headless=new',
    '--disable-gpu',
    '--no-pdf-header-footer',
    '--run-all-compositor-stages-before-draw',
    '--virtual-time-budget=5000',
    `--print-to-pdf=${outputPath}`,
    tempHtmlPath
  ];

  const res = spawnSync(CHROME_PATH, args);
  if (fs.existsSync(tempHtmlPath)) {
    fs.unlinkSync(tempHtmlPath);
  }

  if (res.status !== 0) {
    throw new Error(`Chrome failed with code ${res.status}: ${res.stderr?.toString()}`);
  }

  if (!fs.existsSync(outputPath)) {
    throw new Error(`PDF was not created at ${outputPath}`);
  }

  console.log(`Generated: ${path.basename(outputPath)} (${(fs.statSync(outputPath).size / 1024).toFixed(1)} KB)`);
}

const BRAND = {
  nameAr: "طوّرني",
  nameEn: "Tawwerni",
  domain: "tawwerni.com",
  taglineAr: "حوّل تعلّمك اليومي لتقدّم حقيقي",
  taglineEn: "Turn daily learning into tangible momentum",
  tealDark: "#04342C",
  tealDeep: "#085041",
  tealPrimary: "#0F6E56",
  tealBright: "#1D9E75",
  tealLight: "#5DCAA5",
  tealPale: "#E1F5EE",
  gold: "#F59E0B",
  goldLight: "#FBBF24",
  bgDark: "#070E18",
  bgCard: "#0E1A2B",
  bgCardBorder: "rgba(93, 202, 165, 0.2)",
  textMain: "#F8FAFC",
  textMuted: "#94A3B8"
};

const COMMON_CSS = `
  @import url('https://fonts.googleapis.com/css2?family=Cairo:wght@400;500;600;700;800;900&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;600&display=swap');

  * {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
    -webkit-print-color-adjust: exact !important;
    print-color-adjust: exact !important;
  }

  body {
    background-color: ${BRAND.bgDark};
    color: ${BRAND.textMain};
    line-height: 1.5;
    -webkit-font-smoothing: antialiased;
  }

  .font-ar {
    font-family: 'Cairo', system-ui, sans-serif;
  }

  .font-en {
    font-family: 'Plus Jakarta Sans', system-ui, sans-serif;
  }

  .page {
    width: 210mm;
    height: 297mm;
    page-break-after: always;
    position: relative;
    overflow: hidden;
    background: radial-gradient(circle at 10% 20%, #06231d 0%, #070e18 60%, #03080e 100%);
    padding: 24mm 22mm;
    display: flex;
    flex-direction: column;
  }

  .page-landscape {
    width: 297mm;
    height: 210mm;
    page-break-after: always;
    position: relative;
    overflow: hidden;
    background: radial-gradient(circle at 15% 20%, #052a23 0%, #08111e 60%, #03080e 100%);
    padding: 18mm 22mm;
    display: flex;
    flex-direction: column;
  }

  /* Watermark and glow accents */
  .bg-glow-1 {
    position: absolute;
    top: -100px;
    right: -100px;
    width: 400px;
    height: 400px;
    background: radial-gradient(circle, rgba(29, 158, 117, 0.15) 0%, transparent 70%);
    border-radius: 50%;
    pointer-events: none;
  }

  .bg-glow-2 {
    position: absolute;
    bottom: -120px;
    left: -120px;
    width: 500px;
    height: 500px;
    background: radial-gradient(circle, rgba(245, 158, 11, 0.08) 0%, transparent 70%);
    border-radius: 50%;
    pointer-events: none;
  }

  .grid-pattern {
    position: absolute;
    inset: 0;
    background-image: 
      linear-gradient(to right, rgba(255,255,255,0.02) 1px, transparent 1px),
      linear-gradient(to bottom, rgba(255,255,255,0.02) 1px, transparent 1px);
    background-size: 20mm 20mm;
    pointer-events: none;
  }

  .badge {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 4px 12px;
    border-radius: 9999px;
    font-size: 11px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    background: rgba(29, 158, 117, 0.15);
    border: 1px solid rgba(93, 202, 165, 0.4);
    color: #5DCAA5;
  }

  .badge-gold {
    background: rgba(245, 158, 11, 0.15);
    border: 1px solid rgba(251, 191, 36, 0.4);
    color: #FBBF24;
  }

  .card {
    background: rgba(14, 26, 43, 0.7);
    border: 1px solid rgba(93, 202, 165, 0.2);
    border-radius: 12px;
    padding: 16px;
    backdrop-filter: blur(10px);
  }

  .card-hover {
    background: linear-gradient(145deg, rgba(14, 26, 43, 0.8) 0%, rgba(8, 80, 65, 0.25) 100%);
    border: 1px solid rgba(93, 202, 165, 0.3);
  }

  .card-gold {
    background: linear-gradient(145deg, rgba(24, 22, 15, 0.8) 0%, rgba(45, 34, 12, 0.3) 100%);
    border: 1px solid rgba(245, 158, 11, 0.3);
  }

  .footer-bar {
    margin-top: auto;
    padding-top: 12px;
    border-top: 1px solid rgba(255, 255, 255, 0.08);
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 10px;
    color: #64748B;
  }

  table.styled-table {
    width: 100%;
    border-collapse: collapse;
    margin: 12px 0;
    font-size: 12px;
  }

  table.styled-table th {
    background: rgba(15, 110, 86, 0.3);
    color: #5DCAA5;
    padding: 8px 12px;
    font-weight: 700;
    border-bottom: 2px solid rgba(93, 202, 165, 0.4);
  }

  table.styled-table td {
    padding: 8px 12px;
    border-bottom: 1px solid rgba(255, 255, 255, 0.05);
    color: #E2E8F0;
  }

  table.styled-table tr:nth-child(even) td {
    background: rgba(255, 255, 255, 0.02);
  }
`;

module.exports = {
  BRAND,
  COMMON_CSS,
  renderPdf
};
