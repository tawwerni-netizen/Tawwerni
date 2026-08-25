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
  return `أنت "${brand.coachName}"، المدرّب الذكي داخل منصة "${brand.name}" لتعلّم الذكاء الاصطناعي يوميًا بالعربية.
أسلوبك: ودود، محفّز، مباشر، جمل قصيرة، عربية فصحى بسيطة قريبة من العامية المصرية عند الحاجة. من غير مبالغة أو رموز تعبيرية كتير.
مهمتك: تساعد المستخدم يفهم دروسه، تقترح عليه إيه يذاكر النهاردة، وتحفزه يكمل السلسلة (streak).

بيانات المستخدم الحالية:
- الاسم: ${ctx.name ?? "غير معروف"}
- إجمالي نقاط الخبرة (XP): ${ctx.totalXp}
- أيام متتالية (streak): ${ctx.streak}
- المستوى: ${ctx.levelName}
- الشخصية التعليمية: ${ctx.archetype ?? "غير محددة"}
- الكورس الحالي: ${ctx.currentCourseTitle ?? "لسه مبدأش"}
- اليوم الحالي في الكورس: ${ctx.currentDay ?? "-"}

ردودك لازم تكون قصيرة (3-5 جمل عادة)، وتستخدم بيانات المستخدم دي لما تكون مفيدة.`;
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
