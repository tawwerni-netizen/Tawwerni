"use client";

import { useI18n } from "./LanguageContext";
import ReferralPanel from "@/components/ReferralPanel";

type Props = {
  code: string;
  shareUrl: string;
  totalReferred: number;
  availableEgp: number;
  lockedEgp: number;
  paidEgp: number;
  canWithdraw: boolean;
  commissionEgp: number;
  minPayoutEgp: number;
  openRequestEgp: number | null;
};

export default function ReferralsClient(props: Props) {
  const { lang } = useI18n();
  const isEn = lang === "en";

  return (
    <div className="px-4 pt-5 pb-8">
      <h1 className="mb-1 text-2xl font-bold text-neutral-900 dark:text-neutral-100">
        {isEn ? "Earn by Inviting Friends" : "اكسب من دعوة أصحابك"}
      </h1>
      <p className="mb-5 text-sm text-neutral-500 dark:text-neutral-400">
        {isEn
          ? `${props.commissionEgp} EGP for every friend who joins through your link.`
          : `${props.commissionEgp} ج.م عن كل صاحب يشترك من لينكك.`}
      </p>

      <ReferralPanel {...props} />
    </div>
  );
}
