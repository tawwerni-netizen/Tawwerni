import fs from 'fs';
import { ALL_100_TRACKS } from '../src/content/tracks100.ts';

console.log('Total tracks loaded:', ALL_100_TRACKS.length);
ALL_100_TRACKS.slice(0, 10).forEach(t => {
  console.log(`#${t.order} (id: ${t.id}): ${t.slug} -> ${t.titleAr}`);
});
