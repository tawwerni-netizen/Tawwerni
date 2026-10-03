import Anthropic from "@anthropic-ai/sdk";
import { loadMission, MissionData } from "./mission-adapter";

export type EvaluationResponse = {
  score: number;
  passed: boolean;
  status: "passed" | "needs_revision";
  headlineAr: string;
  headlineEn: string;
  wellAr: string[];
  wellEn: string[];
  improveAr: string[];
  improveEn: string[];
  nextMoveAr: string;
  nextMoveEn: string;
  skillId: string;
  skillNameAr: string;
  skillNameEn: string;
  skillIcon: string;
  xpEarned: number;
  evaluatorMeta: {
    model: string;
    version: string;
    timestamp: string;
  };
};

/**
 * Calls Anthropic Claude for real semantic evaluation against the mission's rubric criteria.
 */
async function evaluateWithLLM(
  mission: MissionData,
  submissionText: string
): Promise<EvaluationResponse | null> {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) return null;

  try {
    const anthropic = new Anthropic({ apiKey });
    const rubricPrompt = mission.rubric
      .map((r, i) => `${i + 1}. [Weight ${r.weight}%] ${r.nameAr}: ${r.descriptionAr}`)
      .join("\n");

    const systemPrompt = `You are an expert pedagogical evaluator and professional mentor for the "Tawwerni" Learning Operating System.
Your task is to rigorously evaluate a student's hands-on deliverable against explicit rubric standards.
Threshold for passing: 75/100.
Be constructively honest. Reward depth, precision, and workplace utility. Penalize superficiality, platitudes, or missing constraints.

Respond ONLY with a valid JSON object matching this schema:
{
  "score": number (0-100),
  "passed": boolean (score >= 75),
  "headlineAr": string,
  "headlineEn": string,
  "wellAr": [string, string],
  "wellEn": [string, string],
  "improveAr": [string],
  "improveEn": [string],
  "nextMoveAr": string,
  "nextMoveEn": string
}`;

    const userPrompt = `MISSION:
Track: ${mission.titleAr} (${mission.titleEn})
Day ${mission.dayNumber} Objective: ${mission.objective.accomplishAr}
Required Artifact: ${mission.objective.produceAr}
Target Skill: ${mission.targetSkill.nameAr} (${mission.targetSkill.nameEn})

RUBRIC CRITERIA:
${rubricPrompt}

STUDENT SUBMISSION:
"""
${submissionText}
"""

Evaluate the student's submission now and output the JSON evaluation.`;

    const response = await anthropic.messages.create({
      model: "claude-3-5-haiku-20241022",
      max_tokens: 600,
      temperature: 0.2,
      system: systemPrompt,
      messages: [{ role: "user", content: userPrompt }],
    });

    const textBlock = response.content.find((b) => b.type === "text");
    if (!textBlock || textBlock.type !== "text") return null;

    const rawJson = textBlock.text.trim().replace(/^```json\s*/i, "").replace(/```$/, "").trim();
    const parsed = JSON.parse(rawJson);

    if (typeof parsed.score === "number") {
      const score = Math.min(100, Math.max(0, Math.round(parsed.score)));
      const passed = score >= 75;
      const skill = mission.targetSkill;

      return {
        score,
        passed,
        status: passed ? "passed" : "needs_revision",
        headlineAr: parsed.headlineAr || (passed ? "اكتملت المهمة بنجاح! تم إثبات المهارة ⭐" : "ليس بعد — اقتربت من معايير الإتقان! (Not yet)"),
        headlineEn: parsed.headlineEn || (passed ? "Mission Complete! Skill Demonstrated ⭐" : "Not yet — You're close to mastery standards!"),
        wellAr: Array.isArray(parsed.wellAr) && parsed.wellAr.length > 0 ? parsed.wellAr : ["تطبيق متميز ومباشر للمطلوب."],
        wellEn: Array.isArray(parsed.wellEn) && parsed.wellEn.length > 0 ? parsed.wellEn : ["Direct, practical execution of the mission."],
        improveAr: Array.isArray(parsed.improveAr) && parsed.improveAr.length > 0 ? parsed.improveAr : ["راجع النموذج المعياري لمزيد من التحديد."],
        improveEn: Array.isArray(parsed.improveEn) && parsed.improveEn.length > 0 ? parsed.improveEn : ["Review benchmark for higher precision."],
        nextMoveAr: parsed.nextMoveAr || (passed ? "تم توثيق المهارة بنجاح، انتقل للمهمة التالية." : "أعد المحاولة بعد ضبط الملاحظات أعلاه."),
        nextMoveEn: parsed.nextMoveEn || (passed ? "Skill verified! Proceed to next mission." : "Try again after applying feedback."),
        skillId: skill.id,
        skillNameAr: skill.nameAr,
        skillNameEn: skill.nameEn,
        skillIcon: skill.icon,
        xpEarned: passed ? mission.xpReward : 0,
        evaluatorMeta: {
          model: "claude-3-5-haiku-20241022",
          version: "2.0.0",
          timestamp: new Date().toISOString(),
        },
      };
    }
  } catch (err) {
    console.warn("LLM evaluation fallback to heuristic evaluator:", err);
  }

  return null;
}

/**
 * Intelligent dual-layer evaluator: Real Claude Structured LLM when key is present,
 * with resilient deterministic rubric scoring fallback.
 */
export async function evaluateMissionSubmission(
  mission: MissionData,
  submissionText: string,
  userEmail?: string
): Promise<EvaluationResponse> {
  // 1. Try real LLM evaluation first
  const llmResult = await evaluateWithLLM(mission, submissionText);
  if (llmResult) {
    return llmResult;
  }

  // 2. Deterministic & semantic rubric fallback
  const text = (submissionText || "").trim();
  const wordCount = text.split(/\s+/).filter(Boolean).length;

  // Analysis dimensions
  const hasStructure = text.includes("\n") || text.includes(":") || text.includes("-") || text.includes("[");
  const hasSpecifics = text.length > 50 && !/^(test|تجربة|abc|123|ok|تمام)$/i.test(text);
  const mentionsConstraints = /(ممنوع|لا تذكر|بدون|تجنب|شروط|قيد|avoid|do not|never|format|table|json|markdown)/i.test(text);
  const mentionsRoleOrTask = /(أنت|دورك|خبير|مهمتك|قم ب|اكتب|حلل|act as|role|expert|you are|task)/i.test(text);

  let rawScore = 30;

  if (wordCount >= 10) rawScore += 20;
  if (wordCount >= 25) rawScore += 15;
  if (hasStructure) rawScore += 15;
  if (mentionsRoleOrTask) rawScore += 12;
  if (mentionsConstraints) rawScore += 13;

  const score = Math.min(96, Math.max(25, rawScore));
  const passed = score >= 75;

  const skill = mission.targetSkill;

  if (passed) {
    return {
      score,
      passed: true,
      status: "passed",
      headlineAr: "اكتملت المهمة بنجاح! تم إثبات المهارة ⭐",
      headlineEn: "Mission Complete! Skill Demonstrated ⭐",
      wellAr: [
        `تطبيق متميز لمهارة ${skill.nameAr} بصياغة عملية واضحة.`,
        "هيكل منظم يحدد السياق ويوجه النموذج بدقة دون حشو زائد.",
      ],
      wellEn: [
        `Excellent execution of ${skill.nameEn} with clear production directives.`,
        "Structured framing with specific context and zero unnecessary fluff.",
      ],
      improveAr: [
        "يمكنك في المراحل القادمة إضافة أمثلة Few-Shot أكثر تفصيلاً للحالات النادرة.",
      ],
      improveEn: [
        "For even higher fidelity, you can incorporate edge-case few-shot examples.",
      ],
      nextMoveAr: "أحسنت! تم توثيق المهارة في جواز مهاراتك ويمكنك الانتقال للمهمة التالية فوراً.",
      nextMoveEn: "Great work! Skill verified in your Skill Passport. Proceed to your next mission.",
      skillId: skill.id,
      skillNameAr: skill.nameAr,
      skillNameEn: skill.nameEn,
      skillIcon: skill.icon,
      xpEarned: mission.xpReward,
      evaluatorMeta: {
        model: "heuristic-rubric/v2",
        version: "2.0.0",
        timestamp: new Date().toISOString(),
      },
    };
  } else {
    return {
      score,
      passed: false,
      status: "needs_revision",
      headlineAr: "ليس بعد — اقتربت من معايير الإتقان! (Not yet)",
      headlineEn: "Not yet — You're close to mastery standards!",
      wellAr: [
        "بدأت بالخطوة الصحيحة وأخذت المبادرة للتطبيق العملي بيدك.",
        "الفكرة الأساسية واضحة ومناسبة لمجال عملك.",
      ],
      wellEn: [
        "You took real action and applied the concept hands-on.",
        "The core intent is clear and relevant to your workflow.",
      ],
      improveAr: [
        "المخرج يحتاج إلى مزيد من التفصيل والتحديد (تجنب الإيجاز المخل).",
        "أضف قيوداً واضحة (Negative Constraints) تمنع الإجابات العامة وتحدد شكل الإخراج بدقة.",
      ],
      improveEn: [
        "Your deliverable needs more specificity and depth (avoid brief generic lines).",
        "Add explicit negative constraints and define the expected output format.",
      ],
      nextMoveAr: "راجع النموذج الذهبي المعياري أعلاه، أضف القيود وشكل المخرج المطلوب، واضغط «أعد المحاولة».",
      nextMoveEn: "Review the golden benchmark above, specify negative constraints, and tap 'Try Again'.",
      skillId: skill.id,
      skillNameAr: skill.nameAr,
      skillNameEn: skill.nameEn,
      skillIcon: skill.icon,
      xpEarned: 0,
      evaluatorMeta: {
        model: "heuristic-rubric/v2",
        version: "2.0.0",
        timestamp: new Date().toISOString(),
      },
    };
  }
}
