"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useI18n } from "./LanguageContext";

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

const LIVE_PAYOUT_TICKER = [
  { name: "عمر خ.", amount: 300, method: "InstaPay", time: "منذ 9 دقائق" },
  { name: "سارة م.", amount: 150, method: "Vodafone Cash", time: "منذ 24 دقيقة" },
  { name: "أحمد ح.", amount: 450, method: "InstaPay", time: "منذ ساعة" },
  { name: "محمود ع.", amount: 750, method: "Vodafone Cash", time: "منذ ساعتين" },
];

export default function ReferralPanel(props: Props) {
  const { lang } = useI18n();
  const isEn = lang === "en";

  const router = useRouter();
  const [copiedLink, setCopiedLink] = useState(false);
  const [copiedPitch, setCopiedPitch] = useState(false);
  const [calcFriends, setCalcFriends] = useState(5);
  const [showForm, setShowForm] = useState(false);
  const [method, setMethod] = useState<"vodafone_cash" | "instapay">("instapay");
  const [destination, setDestination] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);

  const progress = Math.min(100, Math.round((props.availableEgp / props.minPayoutEgp) * 100));
  const remaining = Math.max(0, props.minPayoutEgp - props.availableEgp);
  const friendsNeeded = Math.ceil(remaining / props.commissionEgp);

  // Gamification Tier
  const tier =
    props.paidEgp + props.availableEgp >= 1500
      ? { name: isEn ? "💎 Diamond Partner" : "💎 شريك ماسي النخبة", bonus: "أولوية سحب فورية VIP" }
      : props.paidEgp + props.availableEgp >= 750
      ? { name: isEn ? "🥇 Gold Ambassador" : "🥇 سفير ذهبي", bonus: "شريك موثوق" }
      : props.paidEgp + props.availableEgp >= 150
      ? { name: isEn ? "🥈 Silver Member" : "🥈 شريك فضي", bonus: "حققت أول سحب" }
      : { name: isEn ? "🥉 Bronze Starter" : "🥉 سفير برونزي", bonus: "في الطريق لأول سحب" };

  const readyPitch = isEn
    ? `I'm learning hands-on AI & high-income skills in 5 minutes a day with Tawwerni. Day 1 of all 100 tracks is 100% free — try it out: ${props.shareUrl}`
    : `أنا بدأت أتعلم مهارات الذكاء الاصطناعي والتكنولوجيا العملية مع منصة "طوّرني".. دروس ٥ دقايق في اليوم عملية جداً ومعاها شهادات معتمدة. اليوم الأول مجاني بالكامل لكل المسارات، جرب بنفسك من اللينك ده: ${props.shareUrl}`;

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(props.shareUrl);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    } catch {
      /* blocked */
    }
  }

  async function copyPitch() {
    try {
      await navigator.clipboard.writeText(readyPitch);
      setCopiedPitch(true);
      setTimeout(() => setCopiedPitch(false), 2000);
    } catch {
      /* blocked */
    }
  }

  function shareWhatsApp() {
    window.open(`https://wa.me/?text=${encodeURIComponent(readyPitch)}`, "_blank");
  }

  function shareTelegram() {
    window.open(`https://t.me/share/url?url=${encodeURIComponent(props.shareUrl)}&text=${encodeURIComponent(readyPitch)}`, "_blank");
  }

  async function submitPayout(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setBusy(true);
    try {
      const res = await fetch("/api/referrals/payout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ method, destination }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(data.error ?? (isEn ? "An error occurred, please try again" : "حصل خطأ، حاول مرة أخرى"));
        return;
      }
      setDone(true);
      setShowForm(false);
      router.refresh();
    } catch {
      setError(isEn ? "Connection error. Please try again." : "خطأ في الاتصال بالسيرفر. حاول مرة أخرى.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="space-y-6" dir={isEn ? "ltr" : "rtl"}>
      {/* Live Social Proof Ticker */}
      <div className="overflow-hidden rounded-2xl bg-teal-500/10 dark:bg-teal-500/5 border border-teal-500/20 px-3 py-2">
        <div className="flex items-center gap-2 text-xs">
          <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-ping" />
          <span className="font-bold text-teal-700 dark:text-teal-300 shrink-0">
            {isEn ? "Live Activity:" : "نشاط مباشر:"}
          </span>
          <div className="truncate text-neutral-600 dark:text-neutral-300">
            <span>🔥 {LIVE_PAYOUT_TICKER[0].name} سحب {LIVE_PAYOUT_TICKER[0].amount} ج.م عبر {LIVE_PAYOUT_TICKER[0].method} {LIVE_PAYOUT_TICKER[0].time}</span>
          </div>
        </div>
      </div>

      {/* Hero Dopamine Cash Card */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#0c4a3e] via-[#08332b] to-[#041c18] p-6 text-white shadow-2xl border border-teal-500/30">
        <div className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-teal-400/20 blur-3xl" />
        <div className="pointer-events-none absolute -left-16 -bottom-16 h-48 w-48 rounded-full bg-emerald-400/20 blur-3xl" />

        <div className="flex items-center justify-between mb-3">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1 text-xs font-bold backdrop-blur-md border border-white/15">
            <span>{tier.name}</span>
          </div>
          <span className="text-xs text-white/80 font-mono font-bold bg-emerald-500/20 px-2.5 py-0.5 rounded-full border border-emerald-400/30">
            +{props.commissionEgp} ج.م / اشتراك
          </span>
        </div>

        <div className="my-2">
          <p className="text-xs text-teal-200 font-medium tracking-wide mb-1">
            {isEn ? "Withdrawable Cash Balance" : "رصيدك النقدي القابل للسحب فوراً"}
          </p>
          <div className="flex items-baseline gap-2">
            <span className="text-5xl font-black font-mono tracking-tight text-white drop-shadow-md">
              {props.availableEgp}
            </span>
            <span className="text-xl font-bold text-teal-300">{isEn ? "EGP" : "ج.م"}</span>
          </div>
        </div>

        {/* Dynamic Progress Bar */}
        <div className="mt-4 mb-2">
          <div className="flex items-center justify-between text-xs mb-1.5 font-bold">
            <span className="text-teal-200">
              {props.canWithdraw
                ? isEn ? "🎉 Minimum reached — ready to withdraw!" : "🎉 وصلت للحد الأدنى — جاهز للسحب الآن!"
                : isEn ? `${remaining} EGP left for next payout` : `باقي ${remaining} ج.م للوصول لحد السحب (${props.minPayoutEgp} ج.م)`}
            </span>
            <span className="font-mono text-white/90">{progress}%</span>
          </div>
          <div className="h-3 w-full rounded-full bg-black/40 overflow-hidden p-0.5 border border-white/10">
            <div
              className="h-full rounded-full bg-gradient-to-r from-teal-400 to-emerald-300 transition-all duration-700 shadow-sm"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {!props.canWithdraw && (
          <p className="text-[11px] text-teal-200/80 mt-1">
            💡 {isEn ? `Just ${friendsNeeded} friend(s) subscribing unlocks your instant withdrawal!` : `صاحبين اتنين بس يشتركوا وتفتح السحب الفوري فوراً!` }
          </p>
        )}
      </div>

      {/* 3 Metric Cards */}
      <div className="grid grid-cols-3 gap-2.5">
        <div className="rounded-2xl border border-black/5 dark:border-white/10 bg-white dark:bg-neutral-900 p-3.5 text-center shadow-xs">
          <div className="text-2xl font-black text-teal-600 dark:text-teal-400 font-mono">{props.totalReferred}</div>
          <div className="text-[11px] font-bold text-neutral-500 dark:text-neutral-400 mt-0.5">
            {isEn ? "Subscribers" : "أصحاب اشتركوا"}
          </div>
        </div>
        <div className="rounded-2xl border border-black/5 dark:border-white/10 bg-white dark:bg-neutral-900 p-3.5 text-center shadow-xs">
          <div className="text-2xl font-black text-amber-500 font-mono">{props.lockedEgp} <span className="text-xs">ج</span></div>
          <div className="text-[11px] font-bold text-neutral-500 dark:text-neutral-400 mt-0.5">
            {isEn ? "Pending Review" : "قيد المعالجة"}
          </div>
        </div>
        <div className="rounded-2xl border border-black/5 dark:border-white/10 bg-white dark:bg-neutral-900 p-3.5 text-center shadow-xs">
          <div className="text-2xl font-black text-emerald-600 dark:text-emerald-400 font-mono">{props.paidEgp} <span className="text-xs">ج</span></div>
          <div className="text-[11px] font-bold text-neutral-500 dark:text-neutral-400 mt-0.5">
            {isEn ? "Paid Out" : "تم تحويله لك"}
          </div>
        </div>
      </div>

      {/* Interactive Dopamine Earnings Calculator */}
      <div className="rounded-3xl border border-teal-500/20 bg-gradient-to-b from-teal-500/5 via-white to-white dark:from-teal-950/20 dark:via-neutral-900 dark:to-neutral-900 p-5 shadow-xs">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-black text-neutral-900 dark:text-white flex items-center gap-1.5">
            <span>💰</span>
            <span>{isEn ? "Earnings Calculator" : "احسب أرباحك المتوقعة"}</span>
          </h3>
          <span className="text-[11px] text-teal-600 dark:text-teal-400 font-bold bg-teal-500/10 px-2 py-0.5 rounded-full">
            بدون حد أقصى للأرباح
          </span>
        </div>

        <div className="mb-4">
          <div className="flex justify-between items-center mb-2">
            <span className="text-xs text-neutral-600 dark:text-neutral-400 font-medium">
              {isEn ? "Number of friends you invite:" : "عدد الأصحاب اللي هتدعوهم:"}
            </span>
            <span className="text-lg font-black text-teal-600 dark:text-teal-400 font-mono">
              {calcFriends} {isEn ? "friends" : "أصحاب"}
            </span>
          </div>

          <div className="grid grid-cols-4 gap-2">
            {[3, 5, 10, 20].map((num) => (
              <button
                key={num}
                type="button"
                onClick={() => setCalcFriends(num)}
                className={`py-2 rounded-xl text-xs font-bold transition-all ${
                  calcFriends === num
                    ? "bg-teal-600 text-white shadow-md scale-102"
                    : "bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-200 dark:hover:bg-neutral-700"
                }`}
              >
                {num} أصحاب
              </button>
            ))}
          </div>
        </div>

        <div className="rounded-2xl bg-neutral-900 text-white p-4 flex items-center justify-between">
          <div>
            <p className="text-[11px] text-neutral-400">{isEn ? "Your Net Cash Profit" : "أرباحك النقدية في جيبك"}</p>
            <p className="text-2xl font-black font-mono text-emerald-400">
              {calcFriends * props.commissionEgp} <span className="text-sm font-bold text-white">ج.م كاش</span>
            </p>
          </div>
          <div className="text-end">
            <span className="inline-block bg-emerald-500/20 text-emerald-300 text-[11px] font-bold px-2.5 py-1 rounded-full border border-emerald-500/30">
              {calcFriends >= 5 ? "تغطية اشتراكك + ربح إضافي!" : "سحب فوري متاح"}
            </span>
          </div>
        </div>
      </div>

      {/* Viral Sharing Tool & Link */}
      <div className="rounded-3xl border border-black/10 dark:border-white/10 bg-white dark:bg-neutral-900 p-5 shadow-xs">
        <div className="flex items-center justify-between mb-3">
          <p className="text-sm font-black text-neutral-900 dark:text-white flex items-center gap-1.5">
            <span>🔗</span>
            <span>{isEn ? "Your Unique Referral Link" : "لينك الدعوة الخاص بك"}</span>
          </p>
          <span className="text-xs font-mono font-bold text-teal-600 dark:text-teal-400 bg-teal-50 dark:bg-teal-950/60 px-2 py-0.5 rounded-lg border border-teal-500/20">
            {props.code}
          </span>
        </div>

        {/* Link Copy Box */}
        <div className="flex items-center gap-2 rounded-2xl border border-black/10 dark:border-white/10 bg-neutral-50 dark:bg-neutral-800/80 p-2 mb-3">
          <span className="min-w-0 flex-1 truncate text-xs font-mono px-2 text-neutral-700 dark:text-neutral-300" dir="ltr">
            {props.shareUrl}
          </span>
          <button
            type="button"
            onClick={copyLink}
            className={`shrink-0 rounded-xl px-4 py-2 text-xs font-bold transition-all ${
              copiedLink
                ? "bg-emerald-600 text-white shadow-xs"
                : "bg-teal-600 hover:bg-teal-500 text-white shadow-xs active:scale-95"
            }`}
          >
            {copiedLink ? (isEn ? "✓ Copied" : "✓ تم النسخ!") : (isEn ? "Copy" : "نسخ اللينك")}
          </button>
        </div>

        {/* 1-Click Viral Share Action Buttons */}
        <div className="grid grid-cols-2 gap-2 mb-3">
          <button
            type="button"
            onClick={shareWhatsApp}
            className="flex items-center justify-center gap-2 rounded-2xl bg-[#25D366] hover:bg-[#20ba5a] text-white py-3 px-4 font-bold text-xs shadow-sm active:scale-98 transition-all cursor-pointer"
          >
            <span className="text-base">💬</span>
            <span>{isEn ? "Share on WhatsApp" : "مشاركة عبر واتساب"}</span>
          </button>

          <button
            type="button"
            onClick={shareTelegram}
            className="flex items-center justify-center gap-2 rounded-2xl bg-[#0088cc] hover:bg-[#0077b5] text-white py-3 px-4 font-bold text-xs shadow-sm active:scale-98 transition-all cursor-pointer"
          >
            <span className="text-base">✈️</span>
            <span>{isEn ? "Share on Telegram" : "مشاركة عبر تيليجرام"}</span>
          </button>
        </div>

        {/* Pre-written High Converting Pitch */}
        <div className="rounded-2xl bg-neutral-50 dark:bg-neutral-800/50 border border-black/5 dark:border-white/5 p-3.5">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-xs font-bold text-neutral-700 dark:text-neutral-300">
              💡 {isEn ? "Ready-made message for your friends:" : "رسالة جاهزة ومجربة لإرسالها لأصحابك:"}
            </span>
            <button
              type="button"
              onClick={copyPitch}
              className="text-[11px] font-bold text-teal-600 dark:text-teal-400 hover:underline cursor-pointer"
            >
              {copiedPitch ? "✓ تم نسخ الرسالة" : "نسخ الرسالة"}
            </button>
          </div>
          <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed italic bg-white dark:bg-neutral-900 p-2.5 rounded-xl border border-black/5 dark:border-white/5">
            &ldquo;{readyPitch}&rdquo;
          </p>
        </div>
      </div>

      {/* Payout Section */}
      {props.openRequestEgp !== null ? (
        <div className="rounded-3xl border border-amber-300 dark:border-amber-800/60 bg-amber-50 dark:bg-amber-950/40 p-5 shadow-xs">
          <div className="flex items-center gap-2.5">
            <span className="text-2xl animate-spin">⏳</span>
            <div>
              <p className="text-sm font-black text-amber-900 dark:text-amber-200">
                {isEn ? "Payout Request In Progress" : "طلب السحب قيد التنفيذ الآن"}
              </p>
              <p className="text-xs text-amber-800 dark:text-amber-300 mt-0.5">
                {isEn
                  ? `Your withdrawal of ${props.openRequestEgp} EGP is being reviewed and transferred shortly.`
                  : `طلبك بقيمة ${props.openRequestEgp} ج.م قيد المراجعة وهيتم التحويل لمحفظتك قريباً جداً.`}
              </p>
            </div>
          </div>
        </div>
      ) : done ? (
        <div className="rounded-3xl border border-emerald-300 dark:border-emerald-800/60 bg-emerald-50 dark:bg-emerald-950/40 p-5 shadow-xs">
          <div className="flex items-center gap-2.5">
            <span className="text-2xl">🎉</span>
            <div>
              <p className="text-sm font-black text-emerald-900 dark:text-emerald-200">
                {isEn ? "Payout Request Submitted Successfully!" : "تم تقديم طلب السحب بنجاح!"}
              </p>
              <p className="text-xs text-emerald-800 dark:text-emerald-300 mt-0.5">
                {isEn
                  ? "We will process your transfer directly to your wallet/InstaPay."
                  : "جاري مراجعة الطلب وتحويل المبلغ لمحفظتك فوراً."}
              </p>
            </div>
          </div>
        </div>
      ) : showForm ? (
        <form onSubmit={submitPayout} className="rounded-3xl border border-teal-500/30 bg-white dark:bg-neutral-900 p-5 shadow-lg">
          <h3 className="mb-2 text-base font-black text-neutral-900 dark:text-white">
            {isEn ? `Withdraw ${props.availableEgp} EGP` : `سحب أرباحك: ${props.availableEgp} ج.م`}
          </h3>
          <p className="text-xs text-neutral-500 dark:text-neutral-400 mb-4">
            {isEn ? "Choose your preferred instant cash method:" : "اختر وسيلة استلام الكاش المناسبة لك:"}
          </p>

          <div className="mb-4 grid grid-cols-2 gap-3">
            {[
              { id: "instapay", label: isEn ? "InstaPay" : "إنستاباي (فوري)", icon: "⚡", desc: "لحسابك البنكي أو عنوان IPN" },
              { id: "vodafone_cash", label: isEn ? "Vodafone Cash" : "فودافون كاش", icon: "📱", desc: "تحويل مباشر للمحفظة" },
            ].map((m) => (
              <button
                key={m.id}
                type="button"
                onClick={() => setMethod(m.id as any)}
                className={`rounded-2xl border-2 p-3 text-start transition-all cursor-pointer ${
                  method === m.id
                    ? "border-teal-600 bg-teal-50 dark:bg-teal-950/40 text-teal-950 dark:text-teal-200 shadow-xs"
                    : "border-black/10 dark:border-white/10 hover:border-teal-500/40"
                }`}
              >
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xl">{m.icon}</span>
                  <span className="text-xs font-bold">{m.label}</span>
                </div>
                <p className="text-[10px] text-neutral-500 dark:text-neutral-400">{m.desc}</p>
              </button>
            ))}
          </div>

          <div className="mb-4">
            <label className="block text-xs font-bold text-neutral-700 dark:text-neutral-300 mb-1.5">
              {method === "vodafone_cash"
                ? isEn ? "Mobile Wallet Number" : "رقم محفظة فودافون كاش"
                : isEn ? "InstaPay Address (IPA/IBAN)" : "عنوان إنستاباي (IPA أو رقم الهاتف المسجل)"}
            </label>
            <input
              required
              dir="ltr"
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              placeholder={method === "vodafone_cash" ? "010xxxxxxxx" : "username@instapay"}
              className="w-full rounded-2xl border border-black/10 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-950 px-4 py-2.5 text-sm font-mono transition focus:border-teal-500 focus:outline-hidden"
            />
          </div>

          {error && <p className="mb-3 text-xs text-red-600 dark:text-red-400">{error}</p>}

          <div className="flex gap-2">
            <button
              type="submit"
              disabled={busy}
              className="flex-1 rounded-full bg-gradient-to-r from-teal-600 to-emerald-500 py-3 text-sm font-bold text-white shadow-md hover:brightness-110 active:scale-98 transition disabled:opacity-50 cursor-pointer"
            >
              {busy ? (isEn ? "Processing..." : "جارٍ إرسال الطلب…") : (isEn ? "Confirm Payout" : "تأكيد طلب السحب")}
            </button>
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="rounded-full border border-black/10 dark:border-white/10 px-5 py-3 text-xs font-bold text-neutral-500 hover:text-neutral-900 dark:hover:text-white transition cursor-pointer"
            >
              {isEn ? "Cancel" : "إلغاء"}
            </button>
          </div>
        </form>
      ) : (
        <button
          type="button"
          disabled={!props.canWithdraw}
          onClick={() => setShowForm(true)}
          className={`w-full rounded-full py-4 text-sm font-bold transition-all shadow-md ${
            props.canWithdraw
              ? "bg-gradient-to-r from-teal-600 via-emerald-600 to-teal-500 text-white hover:brightness-110 active:scale-98 cursor-pointer shadow-teal-500/20"
              : "cursor-not-allowed bg-neutral-200 dark:bg-neutral-800 text-neutral-400"
          }`}
        >
          {props.canWithdraw
            ? isEn ? `⚡ Withdraw ${props.availableEgp} EGP Now` : `⚡ اسحب أرباحك الآن (${props.availableEgp} ج.م)`
            : isEn ? `Withdrawal unlocks at ${props.minPayoutEgp} EGP` : `السحب بيفتح أول ما توصل ${props.minPayoutEgp} ج.م`}
        </button>
      )}

      {/* Gamified Tiers Roadmap */}
      <div className="rounded-3xl border border-black/10 dark:border-white/10 bg-white dark:bg-neutral-900 p-5 shadow-xs">
        <h4 className="text-xs font-black text-neutral-900 dark:text-white uppercase tracking-wider mb-3">
          {isEn ? "Ambassador Levels & Tiers" : "مستويات ورتب برنامج الشركاء"}
        </h4>
        <div className="space-y-2.5">
          {[
            { badge: "🥉", title: "سفير برونزي", desc: "من 1 لـ 2 أصحاب · فتح السحب عند 150 ج.م", active: props.paidEgp + props.availableEgp < 150 },
            { badge: "🥈", title: "شريك فضي", desc: "من 3 لـ 9 أصحاب · أرباح تصل لـ 675 ج.م", active: props.paidEgp + props.availableEgp >= 150 && props.paidEgp + props.availableEgp < 750 },
            { badge: "🥇", title: "قائد ذهبي", desc: "من 10 لـ 24 صاحب · أرباح تتخطى 1,800 ج.م", active: props.paidEgp + props.availableEgp >= 750 && props.paidEgp + props.availableEgp < 1500 },
            { badge: "💎", title: "شريك ماسي VIP", desc: "25+ صاحب · أرباح غير محدودة وسحب VIP", active: props.paidEgp + props.availableEgp >= 1500 },
          ].map((lvl, idx) => (
            <div
              key={idx}
              className={`flex items-center justify-between p-2.5 rounded-2xl border text-xs transition ${
                lvl.active
                  ? "border-teal-500/50 bg-teal-50/50 dark:bg-teal-950/40 text-teal-900 dark:text-teal-200 font-bold"
                  : "border-black/5 dark:border-white/5 text-neutral-500 dark:text-neutral-400"
              }`}
            >
              <div className="flex items-center gap-2">
                <span className="text-base">{lvl.badge}</span>
                <div>
                  <p className="font-bold">{lvl.title}</p>
                  <p className="text-[10px] opacity-75">{lvl.desc}</p>
                </div>
              </div>
              {lvl.active && (
                <span className="text-[10px] bg-teal-600 text-white px-2 py-0.5 rounded-full font-bold">
                  مستواك الحالي
                </span>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
