import fs from 'fs';
import path from 'path';

// Read all Gemini generated images
const tracksDir = 'H:/tawwerni/public/images/tracks';
const files = fs.readdirSync(tracksDir)
  .filter(f => f.startsWith('Gemini_Generated_Image_') && f.endsWith('.jpg'))
  .map(f => {
    const stat = fs.statSync(path.join(tracksDir, f));
    return { name: f, time: stat.mtimeMs, size: stat.size, date: stat.mtime.toISOString() };
  })
  .sort((a, b) => a.time - b.time);

console.log(`Found ${files.length} Gemini generated images in ${tracksDir}`);

const baseTime = files[0].time;
files.forEach((f, idx) => {
  const offsetSec = Math.round((f.time - baseTime) / 1000);
  const gap = idx > 0 ? Math.round((f.time - files[idx - 1].time) / 1000) : 0;
  console.log(`${String(idx + 1).padStart(2, '0')}: ${f.name} (+${offsetSec}s, gap: ${gap}s)`);
});

