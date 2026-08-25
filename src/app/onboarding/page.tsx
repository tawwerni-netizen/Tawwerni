import { getCurrentUser } from "@/lib/auth";
import OnboardingForm from "@/components/OnboardingForm";

export default async function OnboardingPage() {
  const user = await getCurrentUser();
  if (!user) return null;

  let suggestedPace = 15;
  if (user.quizAnswers) {
    try {
      const answers = JSON.parse(user.quizAnswers);
      const t = Number(answers.dailyTime);
      if (t === 10) suggestedPace = 5;
      else if (t === 20 || t === 30) suggestedPace = 15;
    } catch {}
  }

  return <OnboardingForm suggestedPace={suggestedPace} />;
}
