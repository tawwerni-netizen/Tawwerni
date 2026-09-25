import fs from 'fs';
import path from 'path';

const content = fs.readFileSync('C:/Users/Hifzy/.gemini/antigravity/brain/f6a7fbb7-7bc6-4a14-a4b9-1e70e5f4abce/tawwerni_90_prompts_master_book.md', 'utf8');
const lines = content.replace(/\r/g, '').split('\n');

const promptEntries = [];
let current = null;

for (let i = 0; i < lines.length; i++) {
  const line = lines[i].trim();
  const m = line.match(/^###\s+#?0*(\d+)\.\s+(.*)/);
  if (m) {
    if (current && current.prompt) {
      promptEntries.push(current);
    }
    current = {
      num: parseInt(m[1]),
      title: m[2].trim(),
      file: '',
      prompt: '',
      inPrompt: false
    };
  } else if (current) {
    if (line.includes('**اسم الملف الدقيق:**')) {
      const fm = line.match(/`([^`]+)`/);
      if (fm) current.file = fm[1];
    } else if (line.startsWith('```text')) {
      current.inPrompt = true;
    } else if (current.inPrompt) {
      if (line.startsWith('```')) {
        current.inPrompt = false;
      } else {
        current.prompt += (current.prompt ? ' ' : '') + line;
      }
    }
  }
}
if (current && current.prompt) promptEntries.push(current);

const tracksDir = 'H:/tawwerni/public/images/tracks';
const files = fs.readdirSync(tracksDir)
  .filter(f => f.startsWith('Gemini_Generated_Image_') && f.endsWith('.jpg'))
  .map(f => {
    const stat = fs.statSync(path.join(tracksDir, f));
    return { name: f, time: stat.mtimeMs, date: stat.mtime };
  })
  .sort((a, b) => a.time - b.time);

console.log(`Prompt entries: ${promptEntries.length}, Gemini files: ${files.length}`);

// Group files by batches (gap > 30s)
const batches = [];
let currentBatch = [];

files.forEach((f, idx) => {
  if (idx === 0) {
    currentBatch.push(f);
  } else {
    const gap = (f.time - files[idx - 1].time) / 1000;
    if (gap > 30) {
      batches.push(currentBatch);
      currentBatch = [f];
    } else {
      currentBatch.push(f);
    }
  }
});
if (currentBatch.length) batches.push(currentBatch);

console.log(`Total batches: ${batches.length}`);
batches.forEach((b, i) => {
  console.log(`Batch ${i + 1}: ${b.length} files (${b[0].date.toLocaleTimeString()} to ${b[b.length - 1].date.toLocaleTimeString()})`);
});
