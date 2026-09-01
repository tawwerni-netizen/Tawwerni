/**
 * Topic clusters for the content engine.
 *
 * A new hub (Freelancing, Marketing, ...) opens by adding a row here — the
 * `Article.pillar` column is a free-form string, not a foreign key, so this
 * config is the only place a new cluster has to be declared. The initial ten
 * are the AI Hub structure: 10 pillars, each meant to hold its own supporting
 * articles rather than one flat blog.
 */
export type Pillar = {
  key: string;
  title: string;
  description: string;
  icon: string;
  /** Slug of the course this pillar's articles should push toward. */
  relatedCourseSlug: string | null;
};

export const pillars: Pillar[] = [
  { key: "chatgpt", title: "ChatGPT", description: "استخدام ChatGPT عمليًا في شغلك ومشروعك.", icon: "💬", relatedCourseSlug: "tahaddi-28-yawm" },
  { key: "claude", title: "Claude", description: "كلود: من المحادثة العادية لإدارة مشاريع كاملة.", icon: "🤖", relatedCourseSlug: "claude-lel-mashroaat" },
  { key: "ai-video", title: "فيديو بالذكاء الاصطناعي", description: "توليد وتعديل فيديو باستخدام أدوات AI.", icon: "🎬", relatedCourseSlug: "enta-fi-ay-makan" },
  { key: "ai-images", title: "صور بالذكاء الاصطناعي", description: "برومبتات وأدوات توليد الصور.", icon: "🖼️", relatedCourseSlug: "kalod-modeer-ebdaay" },
  { key: "ai-content", title: "محتوى بالذكاء الاصطناعي", description: "كتابة ومحتوى سوشيال ميديا بمساعدة AI.", icon: "✍️", relatedCourseSlug: "kalod-modeer-ebdaay" },
  { key: "ai-business", title: "الذكاء الاصطناعي للأعمال", description: "استخدام AI في تشغيل وتنمية مشروعك.", icon: "📈", relatedCourseSlug: "bina-el-amal" },
  { key: "ai-students", title: "الذكاء الاصطناعي للطلبة", description: "أدوات AI للمذاكرة والبحث والمشاريع الدراسية.", icon: "🎓", relatedCourseSlug: "tahaddi-28-yawm" },
  { key: "ai-jobs", title: "الذكاء الاصطناعي والوظائف", description: "إزاي الـAI بيغيّر سوق الشغل، وإزاي تستعد.", icon: "💼", relatedCourseSlug: "nomo-mehany" },
  { key: "ai-automation", title: "أتمتة بالذكاء الاصطناعي", description: "أتمتة مهام متكررة بأدوات AI.", icon: "⚙️", relatedCourseSlug: "ebni-mansetak" },
  { key: "ai-tools", title: "أدوات الذكاء الاصطناعي", description: "مراجعات ومقارنات لأدوات AI عملية.", icon: "🧰", relatedCourseSlug: "tahaddi-28-yawm" },
];

export function getPillar(key: string) {
  return pillars.find((p) => p.key === key) ?? null;
}
