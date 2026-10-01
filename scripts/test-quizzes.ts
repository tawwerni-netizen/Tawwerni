import { loadUniversalCourse } from "../src/lib/course-loader";
import { ALL_100_TRACKS } from "../src/content/tracks100";

console.log(`Auditing all ${ALL_100_TRACKS.length} tracks in Tawwerni catalogue...`);

let totalLessonsAudited = 0;
let tracksWithDuplicates = 0;

for (const track of ALL_100_TRACKS) {
  const course = loadUniversalCourse(track.slug);
  if (!course) {
    console.error(`ERROR: Could not load course for slug: ${track.slug}`);
    process.exit(1);
  }

  const lessons = course.modules.flatMap((m) => m.lessons);
  totalLessonsAudited += lessons.length;

  const seenQ1 = new Set<string>();
  const seenQ2 = new Set<string>();
  let hasDup = false;

  lessons.forEach((l) => {
    const q1 = l.quiz[0]?.question;
    const q2 = l.quiz[1]?.question;

    if (seenQ1.has(q1)) {
      console.error(`Track [${track.slug}] Day ${l.dayNumber} has duplicate Q1: ${q1}`);
      hasDup = true;
    }
    seenQ1.add(q1);

    if (q2 && seenQ2.has(q2)) {
      console.error(`Track [${track.slug}] Day ${l.dayNumber} has duplicate Q2: ${q2}`);
      hasDup = true;
    }
    if (q2) seenQ2.add(q2);
  });

  if (hasDup) {
    tracksWithDuplicates++;
  }
}

console.log(`\n========================================`);
console.log(`TOTAL TRACKS AUDITED: ${ALL_100_TRACKS.length}`);
console.log(`TOTAL LESSONS AUDITED: ${totalLessonsAudited}`);
console.log(`TRACKS WITH DUPLICATES: ${tracksWithDuplicates}`);
console.log(`========================================`);

if (tracksWithDuplicates === 0) {
  console.log("SUCCESS! ZERO DUPLICATES ACROSS ALL 100 TRACKS!");
} else {
  console.error("FAIL: Some tracks have duplicates.");
  process.exit(1);
}
