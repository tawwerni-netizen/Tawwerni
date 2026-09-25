export type BadgeDef = {
  key: string;
  title: string;
  titleEn: string;
  description: string;
  descriptionEn: string;
  icon: string;
};

export const badgeDefs: BadgeDef[] = [
  { key: "first-step", title: "أول خطوة", titleEn: "First Step", description: "أكملت أول درس ليك", descriptionEn: "Completed your first lesson", icon: "👣" },
  { key: "perfect-score", title: "نتيجة مثالية", titleEn: "Perfect Score", description: "١٠٠٪ في كويز", descriptionEn: "100% on a quiz", icon: "⭐" },
  { key: "week-warrior", title: "محارب الأسبوع", titleEn: "Week Warrior", description: "أكملت ٧ دروس في ٧ أيام", descriptionEn: "Completed 7 lessons in 7 days", icon: "🗓️" },
  { key: "on-fire", title: "مواظب", titleEn: "On Fire", description: "حافظت على ٧ أيام متتالية", descriptionEn: "Maintained a 7-day streak", icon: "🔥" },
  { key: "module-master", title: "سيد الوحدة", titleEn: "Module Master", description: "أنهيت وحدة كاملة", descriptionEn: "Completed an entire module", icon: "🧩" },
  { key: "course-graduate", title: "خريج الكورس", titleEn: "Course Graduate", description: "أنهيت أي كورس كامل", descriptionEn: "Finished a complete course", icon: "🎓" },
  { key: "unstoppable", title: "لا يُوقف", titleEn: "Unstoppable", description: "حافظت على ٣٠ يوم متتالي", descriptionEn: "Maintained a 30-day streak", icon: "🚀" },
];
