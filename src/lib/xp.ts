export const LEVELS = [
  { name: "مبتدئ", nameEn: "Beginner", minXp: 0 },
  { name: "مستكشف", nameEn: "Explorer", minXp: 500 },
  { name: "ممارس", nameEn: "Practitioner", minXp: 1500 },
  { name: "خبير", nameEn: "Expert", minXp: 3000 },
  { name: "محترف", nameEn: "Master", minXp: 5000 },
] as const;

export function computeLevel(totalXp: number) {
  let levelIndex = 0;
  for (let i = 0; i < LEVELS.length; i++) {
    if (totalXp >= LEVELS[i].minXp) levelIndex = i;
  }
  const current = LEVELS[levelIndex];
  const next = LEVELS[levelIndex + 1];
  return {
    levelNumber: levelIndex + 1,
    name: current.name,
    nameEn: current.nameEn,
    nextName: next?.name ?? null,
    nextNameEn: next?.nameEn ?? null,
    xpIntoLevel: totalXp - current.minXp,
    xpForNextLevel: next ? next.minXp - current.minXp : null,
    xpToNext: next ? next.minXp - totalXp : 0,
  };
}

function toDayKey(date: Date) {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

export function computeStreak(completionDates: Date[]): number {
  if (completionDates.length === 0) return 0;
  const days = new Set(completionDates.map(toDayKey));
  let streak = 0;
  const cursor = new Date();
  cursor.setHours(0, 0, 0, 0);

  if (!days.has(toDayKey(cursor))) {
    cursor.setDate(cursor.getDate() - 1);
    if (!days.has(toDayKey(cursor))) return 0;
  }

  while (days.has(toDayKey(cursor))) {
    streak += 1;
    cursor.setDate(cursor.getDate() - 1);
  }
  return streak;
}

export function getWeekDays(completionDates: Date[], lang: "ar" | "en" = "ar") {
  const days = new Set(completionDates.map(toDayKey));
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const dayOfWeek = (today.getDay() + 6) % 7; // 0 = Monday
  const monday = new Date(today);
  monday.setDate(today.getDate() - dayOfWeek);

  const labelsAr = ["اثنين", "ثلاثاء", "أربعاء", "خميس", "جمعة", "سبت", "أحد"];
  const labelsEn = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

  return labelsAr.map((labelAr, i) => {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    return {
      label: lang === "en" ? labelsEn[i] : labelAr,
      labelAr,
      labelEn: labelsEn[i],
      done: days.has(toDayKey(d)),
      isToday: toDayKey(d) === toDayKey(today),
      isFuture: d > today,
    };
  });
}
