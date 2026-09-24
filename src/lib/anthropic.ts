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
};

function buildSystemPrompt(ctx: CoachContext) {
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
