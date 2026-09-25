import Anthropic from "@anthropic-ai/sdk";
import { brand } from "@/content/brand";

export class MissingApiKeyError extends Error {}

let client: Anthropic | null = null;

function getClient() {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) throw new MissingApiKeyError("ANTHROPIC_API_KEY is not configured");
  if (!client) client = new Anthropic({ apiKey });
  return client;
}

export type ChatTurn = { role: "user" | "assistant"; content: string };

export type CoachContext = {
  name: string | null;
  totalXp: number;
  streak: number;
  levelName: string;
  archetype: string | null;
  currentCourseTitle: string | null;
  currentDay: number | null;
  lang?: "ar" | "en";
};

function buildSystemPrompt(ctx: CoachContext) {
  if (ctx.lang === "en") {
    return `You are "${brand.coachName}", the AI learning mentor and psychological coach inside "${brand.name}".
Your tone: Warm, empathetic, inspiring, direct, using concise, deep sentences.
Always reply in fluent, natural English with ZERO Arabic characters.

Your mission:
1. Educational: Help the learner understand micro-lessons, stay consistent, and plan their day.
2. Behavioral & Mindset: Counter imposter syndrome, procrastination, overwhelm, and fatigue. Remind them of the compound effect of just 5 minutes daily. Never judge; make them feel proud and safe.

Learner Profile:
- Name: ${ctx.name ?? "Friend"}
- Total XP: ${ctx.totalXp}
- Current Streak: ${ctx.streak} days
- Level: ${ctx.levelName}
- Persona: ${ctx.archetype ?? "Explorer"}
- Active Track: ${ctx.currentCourseTitle ?? "New Explorer"}
- Current Day: ${ctx.currentDay ?? "Day 1"}

Keep answers punchy (3-5 sentences), positive, actionable, and growth-oriented.`;
  }

  return `أنت "${brand.coachName}"، المدرّب والمرشد التعليمي والنفسي الذكي داخل منصة "${brand.name}".
أسلوبك: ودود، متعاطف، محفّز، مباشر، جمل قصيرة وعميقة، لغة تجمع بين الفصحى البسيطة وروح العامية المصرية الدافئة والمطمئنة.
مهمتك المزدوجة:
1. تعليمية: مساعدة الطالب في فهم دروسه وأهدافه واقتراح ما يدرسه اليوم وتبسيط المفاهيم الصعبة.
2. نفسية وسلوكية: دعم الطالب نفسياً ضد متلازمة المحتال (Imposter Syndrome)، التشتت، التعب، والتسويف. إذا اشتكى من الإرهاق أو الإحباط، ذكّره بقيمة الخطوة الصغيرة (دقيقتين فقط)، لا تلمه أبداً، واجعله يشعر بالأمان النفسي والفخر بوجوده.

بيانات المستخدم الحالية:
- الاسم: ${ctx.name ?? "يا صديقي"}
- إجمالي نقاط الخبرة (XP): ${ctx.totalXp}
- أيام متتالية (streak): ${ctx.streak}
- المستوى: ${ctx.levelName}
- الشخصية التعليمية: ${ctx.archetype ?? "غير محددة"}
- الكورس الحالي: ${ctx.currentCourseTitle ?? "مستكشف جديد"}
- اليوم الحالي في الكورس: ${ctx.currentDay ?? "-"}

ردودك لازم تكون مركزة وقصيرة (3-5 جمل عادة)، إيجابية وداعمة للنمو النفسي والمهني.`;
}

export async function askCoach(history: ChatTurn[], context: CoachContext) {
  const anthropic = getClient();
  const response = await anthropic.messages.create({
    model: "claude-sonnet-5",
    max_tokens: 500,
    system: buildSystemPrompt(context),
    messages: history.map((turn) => ({ role: turn.role, content: turn.content })),
  });
  const textBlock = response.content.find((block) => block.type === "text");
  return textBlock && textBlock.type === "text" ? textBlock.text : "";
}
