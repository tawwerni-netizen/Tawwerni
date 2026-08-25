export type BadgeDef = {
  key: string;
  title: string;
  description: string;
  icon: string;
};

export const badgeDefs: BadgeDef[] = [
  { key: "first-step", title: "أول خطوة", description: "أكملت أول درس ليك", icon: "👣" },
  { key: "perfect-score", title: "نتيجة مثالية", description: "١٠٠٪ في كويز", icon: "⭐" },
  { key: "week-warrior", title: "محارب الأسبوع", description: "أكملت ٧ دروس في ٧ أيام", icon: "🗓️" },
  { key: "on-fire", title: "مواظب", description: "حافظت على ٧ أيام متتالية", icon: "🔥" },
  { key: "module-master", title: "سيد الوحدة", description: "أنهيت وحدة كاملة", icon: "🧩" },
  { key: "course-graduate", title: "خريج الكورس", description: "أنهيت أي كورس كامل", icon: "🎓" },
  { key: "unstoppable", title: "لا يُوقف", description: "حافظت على ٣٠ يوم متتالي", icon: "🚀" },
];
