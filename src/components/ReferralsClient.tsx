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
    <div className="px-4 pt-7 sm:pt-10 pb-16 max-w-2xl mx-auto" dir={isEn ? "ltr" : "rtl"}>
      {/* Top Banner Tag */}
      <div className="flex items-center gap-2 mb-3">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 dark:bg-emerald-500/20 px-3 py-1 text-xs font-black text-emerald-600 dark:text-emerald-400 border border-emerald-500/30">
          <span>💸</span>
          <span>{isEn ? "Earn Instant Cash Rewards" : "برنامج مكافآت الكاش الفوري"}</span>
        </span>
        <span className="text-xs text-neutral-400">
          {isEn ? "No limits on referrals" : "أرباحك حقيقية ومضمونة"}
        </span>
      </div>

      <h1 className="text-2xl sm:text-3xl font-black text-neutral-900 dark:text-white tracking-tight mb-1.5">
        {isEn ? "Turn Your Network Into Daily Cash" : "حوّل أصحابك لأرباح كاش يومية 🚀"}
      </h1>
      <p className="mb-6 text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed">
        {isEn
          ? `Earn ${props.commissionEgp} EGP instantly in your pocket for every friend who activates their 100-track pass through your link. Fast cash withdrawals directly to Vodafone Cash & InstaPay!`
          : `اكسب ${props.commissionEgp} ج.م كاش في جيبك عن كل صاحب يشترك في الـ 100 مسار من خلال لينكك. سحب فوري مباشر على فودافون كاش وإنستاباي بدون أي تعقيدات!`}
      </p>

      <ReferralPanel {...props} />
    </div>
  );
}
