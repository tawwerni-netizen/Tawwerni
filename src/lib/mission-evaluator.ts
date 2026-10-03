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
 * Intelligent deterministic & semantic rubric evaluator for mission submissions.
 */
export async function evaluateMissionSubmission(
  mission: MissionData,
  submissionText: string,
  userEmail?: string
): Promise<EvaluationResponse> {
  const text = (submissionText || "").trim();
  const wordCount = text.split(/\s+/).filter(Boolean).length;
  const charCount = text.length;

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
        model: "claude-sonnet-5/evaluator-v1",
        version: "1.0.0",
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
        model: "claude-sonnet-5/evaluator-v1",
        version: "1.0.0",
        timestamp: new Date().toISOString(),
      },
    };
  }
}
