import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { referralSummary } from "@/lib/referrals";
import { brand, referral } from "@/content/brand";
import { REFERRAL_PARAM } from "@/lib/referral-constants";
import ReferralsClient from "@/components/ReferralsClient";

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
    <ReferralsClient
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
  );
}
