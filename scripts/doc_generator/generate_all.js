const fs = require('fs');
const path = require('path');
const { renderPdf } = require('./shared');
const { getPitchDeckHtml } = require('./pitch_deck');
const { getArchitectureHtml } = require('./architecture');
const { getBrandIdentityHtml } = require('./brand_identity');
const { getProjectContextHtml } = require('./project_context');

const OUT_DIR = path.resolve(__dirname, '../../docs_export');
if (!fs.existsSync(OUT_DIR)) {
  fs.mkdirSync(OUT_DIR, { recursive: true });
}

console.log('====================================================');
console.log('🚀 Generating 8 High-Resolution Acquisition PDFs...');
console.log(`📁 Destination Directory: ${OUT_DIR}`);
console.log('====================================================\n');

const tasks = [
  {
    name: '1. Acquisition Pitch Deck (Arabic)',
    file: 'Acquisition_Pitch_Deck_AR.pdf',
    html: getPitchDeckHtml('ar'),
    landscape: true
  },
  {
    name: '1. Acquisition Pitch Deck (English)',
    file: 'Acquisition_Pitch_Deck_EN.pdf',
    html: getPitchDeckHtml('en'),
    landscape: true
  },
  {
    name: '2. Platform Architecture (Arabic)',
    file: 'Platform_Architecture_AR.pdf',
    html: getArchitectureHtml('ar'),
    landscape: false
  },
  {
    name: '2. Platform Architecture (English)',
    file: 'Platform_Architecture_EN.pdf',
    html: getArchitectureHtml('en'),
    landscape: false
  },
  {
    name: '3. Brand Identity (Arabic)',
    file: 'Brand_Identity_AR.pdf',
    html: getBrandIdentityHtml('ar'),
    landscape: false
  },
  {
    name: '3. Brand Identity (English)',
    file: 'Brand_Identity_EN.pdf',
    html: getBrandIdentityHtml('en'),
    landscape: false
  },
  {
    name: '4. Project Context (Arabic)',
    file: 'Project_Context_AR.pdf',
    html: getProjectContextHtml('ar'),
    landscape: false
  },
  {
    name: '4. Project Context (English)',
    file: 'Project_Context_EN.pdf',
    html: getProjectContextHtml('en'),
    landscape: false
  }
];

let generatedCount = 0;

for (const task of tasks) {
  const targetPath = path.join(OUT_DIR, task.file);
  console.log(`Rendering [${task.name}] -> ${task.file}...`);
  try {
    renderPdf(task.html, targetPath, task.landscape);
    generatedCount++;
  } catch (err) {
    console.error(`❌ Error generating ${task.file}:`, err);
  }
}

console.log('\n====================================================');
console.log(`🎉 Completed! Successfully generated ${generatedCount}/${tasks.length} PDF documents.`);
console.log('====================================================');
