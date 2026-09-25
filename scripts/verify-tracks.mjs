import fs from 'fs';

const t1 = fs.readFileSync('src/content/tracks-data-1-50.ts', 'utf8');
const t2 = fs.readFileSync('src/content/tracks-data-51-100.ts', 'utf8');

const regex = /id:\s*(\d+),\s*slug:\s*['"]([^'"]+)['"]/g;

const tracks = [];
let match;
while ((match = regex.exec(t1)) !== null) {
  tracks.push({ id: parseInt(match[1]), slug: match[2] });
}
while ((match = regex.exec(t2)) !== null) {
  tracks.push({ id: parseInt(match[1]), slug: match[2] });
}

console.log(`Extracted ${tracks.length} tracks.`);
fs.writeFileSync('scripts/extracted-tracks.json', JSON.stringify(tracks, null, 2));
console.log('Saved to scripts/extracted-tracks.json');
