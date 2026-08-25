import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { referralSummary } from "@/lib/referrals";
import { brand, referral } from "@/content/brand";
import { REFERRAL_PARAM } from "@/lib/referral-constants";
import ReferralPanel from "@/components/ReferralPanel";

export const dynamic = "force-dynamic";

export default async function ReferralsPage() {
  const user = await getCurrentUser();
  if (!user) return null;

  const [summary, openRequest] = await Promise.all([
    referralSummary(user.id),
    prisma.payout.findFirst({
      where: { userId: user.id, status: "requested" },
      select: { amountEgp: true },
    }),
  ]);

  const shareUrl = `https://${brand.domain}/?${REFERRAL_PARAM}=${summary.code}`;

  return (
    <div className="px-4 pt-5 pb-8">
      <h1 className="mb-1 text-2xl font-bold">اكسب من دعوة أصحابك</h1>
      <p className="mb-5 text-sm text-neutral-500">
        {referral.commissionEgp} ج.م عن كل صاحب يشترك من لينكك.
      </p>

      <ReferralPanel
        code={summary.code}
        shareUrl={shareUrl}
        totalReferred={summary.totalReferred}
        availableEgp={summary.availableEgp}
        lockedEgp={summary.lockedEgp}
        paidEgp={summary.paidEgp}
        canWithdraw={summary.canWithdraw}
        commissionEgp={referral.commissionEgp}
        minPayoutEgp={referral.minPayoutEgp}
        openRequestEgp={openRequest?.amountEgp ?? null}
      />
    </div>
  );
}
