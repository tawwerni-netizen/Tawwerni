"use client";

import { useState } from "react";
import { useI18n } from "@/components/LanguageContext";
import { PaymentConfig } from "@/lib/payment-config";

interface AdminPaymentSettingsProps {
  initialConfig: PaymentConfig;
}

export default function AdminPaymentSettings({ initialConfig }: AdminPaymentSettingsProps) {
  const { lang } = useI18n();
  const isEn = lang === "en";

  const [vodafoneCash, setVodafoneCash] = useState<string[]>(initialConfig.vodafoneCash);
  const [instapay, setInstapay] = useState<string[]>(initialConfig.instapay);
  const [supportWhatsapp, setSupportWhatsapp] = useState<string>(initialConfig.supportWhatsapp);
  const [supportEmail, setSupportEmail] = useState<string>(initialConfig.supportEmail);
  const [activationHours, setActivationHours] = useState<number>(initialConfig.activationHours || 24);

  // New item draft inputs
  const [newVfNumber, setNewVfNumber] = useState("");
  const [vfInputError, setVfInputError] = useState("");

  const [newInstapayAccount, setNewInstapayAccount] = useState("");
  const [instapayInputError, setInstapayInputError] = useState("");

  // Saving states
  const [saving, setSaving] = useState(false);
  const [statusMsg, setStatusMsg] = useState<{ text: string; type: "good" | "bad" } | null>(null);

  // Helper: Format phone for human readability
  function formatPhone(num: string) {
    if (/^01\d{9}$/.test(num)) {
      return `${num.slice(0, 4)} ${num.slice(4, 7)} ${num.slice(7)}`;
    }
    return num;
  }

  // Add Vodafone Cash number
  function handleAddVfNumber() {
    setVfInputError("");
    const cleaned = newVfNumber.replace(/[\s-]/g, "").trim();

    if (!cleaned) {
      setVfInputError(isEn ? "Please enter a phone number" : "برجاء كتابة رقم الهاتف");
      return;
    }
    if (!/^01[0125]\d{8}$/.test(cleaned)) {
      setVfInputError(
        isEn
          ? "Must be a valid 11-digit Egyptian mobile number starting with 010, 011, 012, or 015"
          : "يجب أن يكون رقم موبايل مصري مكون من 11 رقمًا يبدأ بـ 010 أو 011 أو 012 أو 015"
      );
      return;
    }
    if (vodafoneCash.includes(cleaned)) {
      setVfInputError(isEn ? "This number is already in the list" : "هذا الرقم مضاف بالفعل في القائمة");
      return;
    }

    setVodafoneCash([...vodafoneCash, cleaned]);
    setNewVfNumber("");
  }

  // Remove Vodafone Cash number
  function handleRemoveVfNumber(num: string) {
    if (vodafoneCash.length <= 1) {
      alert(
        isEn
          ? "At least one Vodafone Cash number must remain active for receiving payments."
          : "يجب الإبقاء على رقم فودافون كاش واحد على الأقل لاستقبال التحويلات."
      );
      return;
    }
    setVodafoneCash(vodafoneCash.filter((v) => v !== num));
  }

  // Add InstaPay account
  function handleAddInstapay() {
    setInstapayInputError("");
    const cleaned = newInstapayAccount.trim();

    if (!cleaned) {
      setInstapayInputError(isEn ? "Please enter an InstaPay handle or phone" : "برجاء كتابة حساب أو رقم إنستاباي");
      return;
    }
    if (cleaned.length < 5) {
      setInstapayInputError(isEn ? "Account name is too short" : "اسم الحساب قصير للغاية");
      return;
    }
    if (instapay.includes(cleaned)) {
      setInstapayInputError(isEn ? "This account is already in the list" : "هذا الحساب مضاف بالفعل في القائمة");
      return;
    }

    setInstapay([...instapay, cleaned]);
    setNewInstapayAccount("");
  }

  // Remove InstaPay account
  function handleRemoveInstapay(account: string) {
    if (instapay.length <= 1) {
      alert(
        isEn
          ? "At least one InstaPay account must remain active for receiving payments."
          : "يجب الإبقاء على حساب إنستاباي واحد على الأقل لاستقبال التحويلات."
      );
      return;
    }
    setInstapay(instapay.filter((a) => a !== account));
  }

  // Save changes to backend
  async function handleSave() {
    setSaving(true);
    setStatusMsg(null);

    try {
      const res = await fetch("/api/admin/payment-config", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          vodafoneCash,
          instapay,
          supportWhatsapp,
          supportEmail,
          activationHours,
        }),
      });

      const data = await res.json();
      if (!res.ok || data.error) {
        setStatusMsg({
          text: data.error || (isEn ? "Failed to save payment settings." : "فشل حفظ إعدادات الدفع."),
          type: "bad",
        });
        return;
      }

      setStatusMsg({
        text: isEn
          ? "✓ Payment numbers updated successfully! New numbers are now live on the checkout gateway."
          : "✓ تم حفظ وتحديث أرقام استقبال الدفع بنجاح! التغييرات فعالة الآن عند بوابة الدفع مباشرة.",
        type: "good",
      });
    } catch {
      setStatusMsg({
        text: isEn ? "Connection error. Please try again." : "حدث خطأ في الاتصال. برجاء المحاولة مرة أخرى.",
        type: "bad",
      });
    } finally {
      setSaving(false);
    }
  }

  // Reset to brand defaults
  async function handleReset() {
    const confirmMsg = isEn
      ? "Are you sure you want to reset all payment numbers to default brand numbers?"
      : "هل أنت متأكد من استعادة الأرقام الافتراضية لمنصة طوّرني؟";
    if (!window.confirm(confirmMsg)) return;

    setSaving(true);
    setStatusMsg(null);

    try {
      const res = await fetch("/api/admin/payment-config", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "reset" }),
      });

      const data = await res.json();
      if (res.ok && data.config) {
        setVodafoneCash(data.config.vodafoneCash);
        setInstapay(data.config.instapay);
        setSupportWhatsapp(data.config.supportWhatsapp);
        setSupportEmail(data.config.supportEmail);
        setActivationHours(data.config.activationHours || 24);
        setStatusMsg({
          text: isEn
            ? "✓ Reset to default numbers successfully."
            : "✓ تم استعادة الأرقام الافتراضية بنجاح.",
          type: "good",
        });
      }
    } catch {
      setStatusMsg({
        text: isEn ? "Failed to reset settings." : "فشل استعادة الإعدادات الافتراضية.",
        type: "bad",
      });
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-6">
      {/* Status banner */}
      {statusMsg && (
        <div
          className={`flex items-center justify-between gap-3 rounded-2xl p-4 text-xs sm:text-sm font-bold shadow-md transition-all ${
            statusMsg.type === "good"
              ? "bg-emerald-500/15 border border-emerald-500/30 text-emerald-800 dark:text-emerald-300"
              : "bg-red-500/15 border border-red-500/30 text-red-800 dark:text-red-300"
          }`}
        >
          <div className="flex items-center gap-2">
            <span>{statusMsg.type === "good" ? "🎉" : "⚠️"}</span>
            <span>{statusMsg.text}</span>
          </div>
          <button
            onClick={() => setStatusMsg(null)}
            className="text-xs opacity-70 hover:opacity-100 px-2 py-1 cursor-pointer"
          >
            ✕
          </button>
        </div>
      )}

      {/* Main Grid: Vodafone Cash & InstaPay */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* ================= Vodafone Cash Card ================= */}
        <div className="rounded-3xl border border-black/5 dark:border-white/10 bg-white dark:bg-neutral-900 p-5 sm:p-6 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2.5">
                <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-red-500/10 text-xl border border-red-500/20 text-red-500">
                  📱
                </span>
                <div>
                  <h3 className="text-base font-black text-neutral-900 dark:text-white">
                    {isEn ? "Vodafone Cash Numbers" : "أرقام محفظة فودافون كاش"}
                  </h3>
                  <p className="text-[11px] text-neutral-500 dark:text-neutral-400">
                    {isEn ? "Receiving numbers shown at checkout" : "أرقام الاستقبال المعروضة عند بوابة الدفع"}
                  </p>
                </div>
              </div>
              <span className="rounded-full bg-red-500/10 px-2.5 py-1 text-[11px] font-bold text-red-600 dark:text-red-400 border border-red-500/20 font-mono">
                {vodafoneCash.length} {isEn ? "active" : "نشط"}
              </span>
            </div>

            <p className="text-xs leading-relaxed text-neutral-600 dark:text-neutral-300 mb-4 bg-neutral-50 dark:bg-neutral-950 p-3 rounded-2xl border border-black/5 dark:border-white/5">
              {isEn
                ? "Customers can transfer from any Egyptian mobile wallet (Vodafone Cash, Orange Money, Etisalat Cash, WE Pay, etc.) to any of these active numbers."
                : "يمكن للعميل التحويل من أي محفظة إلكترونية مصرية (فودافون كاش، أورنج كاش، اتصالات كاش، وي باي، إلخ) لأي رقم نشط من هذه الأرقام."}
            </p>

            {/* List of active numbers */}
            <div className="space-y-2.5 mb-5">
              {vodafoneCash.map((num, idx) => (
                <div
                  key={num}
                  className="flex items-center justify-between gap-3 rounded-2xl border border-black/10 dark:border-white/10 bg-neutral-50 dark:bg-neutral-950/70 p-3 px-4 transition-all hover:border-red-500/40"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="text-xs font-mono font-bold text-neutral-400">
                      #{idx + 1}
                    </span>
                    <span
                      dir="ltr"
                      className="font-mono text-sm sm:text-base font-black text-neutral-900 dark:text-white tracking-wider"
                    >
                      {formatPhone(num)}
                    </span>
                    <span className="hidden sm:inline text-[10px] bg-red-500/10 text-red-600 dark:text-red-400 px-2 py-0.5 rounded-md font-sans">
                      {isEn ? "Active Wallet" : "محفظة نشطة"}
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0">
                    <button
                      type="button"
                      title={isEn ? "Delete Number" : "حذف الرقم"}
                      onClick={() => handleRemoveVfNumber(num)}
                      className="rounded-xl p-2 text-xs text-neutral-400 hover:bg-red-500/10 hover:text-red-500 transition-colors cursor-pointer"
                    >
                      🗑️
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Add new Vodafone Cash number form */}
          <div className="border-t border-black/5 dark:border-white/10 pt-4">
            <label className="block text-xs font-bold text-neutral-700 dark:text-neutral-300 mb-1.5">
              {isEn ? "+ Add New Vodafone Cash Number" : "+ إضافة رقم فودافون كاش جديد"}
            </label>
            <div className="flex gap-2">
              <input
                type="tel"
                dir="ltr"
                value={newVfNumber}
                onChange={(e) => {
                  setNewVfNumber(e.target.value);
                  setVfInputError("");
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleAddVfNumber();
                  }
                }}
                placeholder="01012345678"
                className="w-full rounded-2xl border border-black/15 dark:border-white/15 bg-white dark:bg-neutral-950 px-3.5 py-2.5 text-xs sm:text-sm font-mono text-neutral-900 dark:text-white placeholder:text-neutral-400 focus:border-red-500 focus:outline-hidden"
              />
              <button
                type="button"
                onClick={handleAddVfNumber}
                className="shrink-0 rounded-2xl bg-red-500 hover:bg-red-600 px-4 py-2.5 text-xs font-bold text-white transition-colors cursor-pointer"
              >
                {isEn ? "Add" : "إضافة"}
              </button>
            </div>
            {vfInputError && (
              <p className="mt-1.5 text-[11px] font-bold text-red-500">{vfInputError}</p>
            )}
          </div>
        </div>

        {/* ================= InstaPay Card ================= */}
        <div className="rounded-3xl border border-black/5 dark:border-white/10 bg-white dark:bg-neutral-900 p-5 sm:p-6 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2.5">
                <span className="flex h-10 w-10 items-center justify-center rounded-2xl bg-amber-500/10 text-xl border border-amber-500/20 text-amber-500">
                  ⚡
                </span>
                <div>
                  <h3 className="text-base font-black text-neutral-900 dark:text-white">
                    {isEn ? "InstaPay Accounts" : "حسابات إنستاباي"}
                  </h3>
                  <p className="text-[11px] text-neutral-500 dark:text-neutral-400">
                    {isEn ? "IPA handles & mobile accounts" : "عناوين IPA اللحظية وأرقام الهواتف"}
                  </p>
                </div>
              </div>
              <span className="rounded-full bg-amber-500/10 px-2.5 py-1 text-[11px] font-bold text-amber-600 dark:text-amber-400 border border-amber-500/20 font-mono">
                {instapay.length} {isEn ? "active" : "نشط"}
              </span>
            </div>

            <p className="text-xs leading-relaxed text-neutral-600 dark:text-neutral-300 mb-4 bg-neutral-50 dark:bg-neutral-950 p-3 rounded-2xl border border-black/5 dark:border-white/5">
              {isEn
                ? "Can be an InstaPay Payment Address (IPA) like username@instapay or a mobile number linked to InstaPay. Displays with instant 1-tap copy button for learners."
                : "يمكن كتابة عنوان إنستاباي IPA مثل username@instapay أو رقم هاتف مسجل في إنستاباي. يظهر للعملاء بزر نسخ سريع بلمسة واحدة."}
            </p>

            {/* List of active InstaPay accounts */}
            <div className="space-y-2.5 mb-5">
              {instapay.map((acc, idx) => (
                <div
                  key={acc}
                  className="flex items-center justify-between gap-3 rounded-2xl border border-black/10 dark:border-white/10 bg-neutral-50 dark:bg-neutral-950/70 p-3 px-4 transition-all hover:border-amber-500/40"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="text-xs font-mono font-bold text-neutral-400">
                      #{idx + 1}
                    </span>
                    <span
                      dir="ltr"
                      className="font-mono text-sm sm:text-base font-black text-neutral-900 dark:text-white tracking-wider truncate"
                    >
                      {acc}
                    </span>
                    <span className="hidden sm:inline text-[10px] bg-amber-500/10 text-amber-600 dark:text-amber-400 px-2 py-0.5 rounded-md font-sans shrink-0">
                      {acc.includes("@")
                        ? isEn ? "IPA Handle" : "عنوان إنستاباي"
                        : isEn ? "Mobile Account" : "حساب موبايل"}
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0">
                    <button
                      type="button"
                      title={isEn ? "Delete Account" : "حذف الحساب"}
                      onClick={() => handleRemoveInstapay(acc)}
                      className="rounded-xl p-2 text-xs text-neutral-400 hover:bg-amber-500/10 hover:text-amber-500 transition-colors cursor-pointer"
                    >
                      🗑️
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Add new InstaPay account form */}
          <div className="border-t border-black/5 dark:border-white/10 pt-4">
            <label className="block text-xs font-bold text-neutral-700 dark:text-neutral-300 mb-1.5">
              {isEn ? "+ Add New InstaPay Account / Handle" : "+ إضافة حساب أو عنوان إنستاباي جديد"}
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                dir="ltr"
                value={newInstapayAccount}
                onChange={(e) => {
                  setNewInstapayAccount(e.target.value);
                  setInstapayInputError("");
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleAddInstapay();
                  }
                }}
                placeholder="hhifzy@instapay أو 01012345678"
                className="w-full rounded-2xl border border-black/15 dark:border-white/15 bg-white dark:bg-neutral-950 px-3.5 py-2.5 text-xs sm:text-sm font-mono text-neutral-900 dark:text-white placeholder:text-neutral-400 focus:border-amber-500 focus:outline-hidden"
              />
              <button
                type="button"
                onClick={handleAddInstapay}
                className="shrink-0 rounded-2xl bg-teal-600 hover:bg-teal-500 px-4 py-2.5 text-xs font-bold text-white transition-colors cursor-pointer"
              >
                {isEn ? "Add" : "إضافة"}
              </button>
            </div>
            {instapayInputError && (
              <p className="mt-1.5 text-[11px] font-bold text-amber-500">{instapayInputError}</p>
            )}
          </div>
        </div>
      </div>

      {/* ================= Support Channels & SLA ================= */}
      <div className="rounded-3xl border border-black/5 dark:border-white/10 bg-white dark:bg-neutral-900 p-5 sm:p-6 shadow-xs">
        <h3 className="text-base font-black text-neutral-900 dark:text-white mb-1 flex items-center gap-2">
          <span>💬</span>
          <span>{isEn ? "Support Contacts & Activation SLA" : "قنوات الدعم الفني واستلام الإثباتات"}</span>
        </h3>
        <p className="text-xs text-neutral-500 dark:text-neutral-400 mb-5">
          {isEn
            ? "These channels receive payment receipt screenshots from learners after checkout."
            : "هذه القنوات هي التي يستقبل عليها فريق العمل إثباتات الدفع لتفعيل الاشتراكات."}
        </p>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div>
            <label className="block text-xs font-bold text-neutral-700 dark:text-neutral-300 mb-1.5">
              {isEn ? "WhatsApp Support Number" : "رقم واتساب الدعم الفني"}
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 start-0 flex items-center ps-3 text-sm text-neutral-400 pointer-events-none">
                💬
              </span>
              <input
                type="tel"
                dir="ltr"
                value={supportWhatsapp}
                onChange={(e) => setSupportWhatsapp(e.target.value)}
                placeholder="01069999557"
                className="w-full rounded-2xl border border-black/15 dark:border-white/15 bg-white dark:bg-neutral-950 ps-9 pe-3 py-2.5 text-xs sm:text-sm font-mono text-neutral-900 dark:text-white focus:border-teal-500 focus:outline-hidden"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-neutral-700 dark:text-neutral-300 mb-1.5">
              {isEn ? "Support Email" : "بريد الدعم الإلكتروني"}
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 start-0 flex items-center ps-3 text-sm text-neutral-400 pointer-events-none">
                ✉️
              </span>
              <input
                type="email"
                dir="ltr"
                value={supportEmail}
                onChange={(e) => setSupportEmail(e.target.value)}
                placeholder="Tawwerni@gmail.com"
                className="w-full rounded-2xl border border-black/15 dark:border-white/15 bg-white dark:bg-neutral-950 ps-9 pe-3 py-2.5 text-xs sm:text-sm font-mono text-neutral-900 dark:text-white focus:border-teal-500 focus:outline-hidden"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-neutral-700 dark:text-neutral-300 mb-1.5">
              {isEn ? "Activation Window (Hours)" : "مهلة التفعيل الموعودة (بالساعات)"}
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 start-0 flex items-center ps-3 text-sm text-neutral-400 pointer-events-none">
                ⏱️
              </span>
              <input
                type="number"
                min="1"
                max="72"
                value={activationHours}
                onChange={(e) => setActivationHours(Number(e.target.value) || 24)}
                placeholder="24"
                className="w-full rounded-2xl border border-black/15 dark:border-white/15 bg-white dark:bg-neutral-950 ps-9 pe-3 py-2.5 text-xs sm:text-sm font-mono text-neutral-900 dark:text-white focus:border-teal-500 focus:outline-hidden"
              />
            </div>
          </div>
        </div>
      </div>

      {/* ================= Live Preview Box ================= */}
      <div className="rounded-3xl border border-emerald-500/30 bg-emerald-950/20 p-5 sm:p-6 shadow-xs">
        <div className="flex items-center justify-between mb-3">
          <h4 className="text-xs sm:text-sm font-black text-emerald-400 flex items-center gap-2">
            <span>👁️</span>
            <span>{isEn ? "Live Gateway Preview (What the student sees):" : "معاينة حية فورية (ما يراه المشترك عند الدفع):"}</span>
          </h4>
          <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-full font-bold">
            /quiz/checkout
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Vodafone Preview */}
          <div className="rounded-2xl border border-white/10 bg-neutral-950/90 p-4">
            <div className="text-xs font-bold text-neutral-300 mb-2 flex items-center gap-1.5">
              <span>📱</span>
              <span>{isEn ? "Vodafone Cash Section" : "قسم فودافون كاش"}</span>
            </div>
            <div className="space-y-1.5">
              {vodafoneCash.map((num) => (
                <div
                  key={num}
                  className="flex items-center justify-between rounded-xl bg-white/5 border border-white/5 p-2 px-3 text-xs"
                >
                  <span className="font-mono font-bold text-white" dir="ltr">{formatPhone(num)}</span>
                  <span className="text-[10px] text-emerald-400 bg-emerald-500/10 px-1.5 py-0.5 rounded">
                    {isEn ? "Copy" : "نسخ"} 📋
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* InstaPay Preview */}
          <div className="rounded-2xl border border-white/10 bg-neutral-950/90 p-4">
            <div className="text-xs font-bold text-neutral-300 mb-2 flex items-center gap-1.5">
              <span>⚡</span>
              <span>{isEn ? "InstaPay Section" : "قسم إنستاباي"}</span>
            </div>
            <div className="space-y-1.5">
              {instapay.map((acc) => (
                <div
                  key={acc}
                  className="flex items-center justify-between rounded-xl bg-white/5 border border-white/5 p-2 px-3 text-xs"
                >
                  <span className="font-mono font-bold text-white truncate" dir="ltr">{acc}</span>
                  <span className="text-[10px] text-amber-400 bg-amber-500/10 px-1.5 py-0.5 rounded shrink-0">
                    {isEn ? "Copy" : "نسخ"} 📋
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ================= Action Controls ================= */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
        <button
          type="button"
          onClick={handleReset}
          disabled={saving}
          className="w-full sm:w-auto rounded-full border border-black/10 dark:border-white/10 px-5 py-3 text-xs font-bold text-neutral-500 hover:text-neutral-900 dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/5 transition-colors cursor-pointer disabled:opacity-50"
        >
          {isEn ? "↺ Restore Brand Defaults" : "↺ استعادة الأرقام الافتراضية"}
        </button>

        <button
          type="button"
          onClick={handleSave}
          disabled={saving}
          className="w-full sm:w-auto rounded-full bg-gradient-to-r from-emerald-500 via-teal-500 to-emerald-500 px-8 py-3.5 text-xs sm:text-sm font-black text-neutral-950 shadow-lg shadow-emerald-500/25 hover:brightness-110 active:scale-98 transition-all cursor-pointer disabled:opacity-60 flex items-center justify-center gap-2"
        >
          {saving ? (
            <>
              <span className="animate-spin">⏳</span>
              <span>{isEn ? "Saving Changes..." : "جاري حفظ التغييرات..."}</span>
            </>
          ) : (
            <>
              <span>💾</span>
              <span>{isEn ? "Save & Apply Changes Immediately" : "حفظ التغييرات وتطبيقها فوراً"}</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}
