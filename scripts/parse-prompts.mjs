import fs from 'fs';

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

console.log('Total extracted prompts with code blocks:', promptEntries.length);
promptEntries.forEach((p, idx) => {
  console.log(`${idx + 1}: #${p.num} [${p.file}] - ${p.title.slice(0, 30)}...`);
});
