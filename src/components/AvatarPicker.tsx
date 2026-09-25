"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Avatar from "@/components/Avatar";
import { useI18n } from "./LanguageContext";

/** Longest edge of the stored image. Plenty for a 34px header tile at 3x. */
const MAX_EDGE = 256;
const MAX_INPUT_BYTES = 8 * 1024 * 1024;

/**
 * Downscales and re-encodes in the browser before upload.
 * Fits the whole image cleanly without cropping edges off logos or portraits.
 */
function shrink(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();

    img.onload = () => {
      URL.revokeObjectURL(url);
      const canvas = document.createElement("canvas");
      canvas.width = MAX_EDGE;
      canvas.height = MAX_EDGE;
      const ctx = canvas.getContext("2d");
      if (!ctx) return reject(new Error("canvas unavailable"));

      // Clean white background
      ctx.fillStyle = "#ffffff";
      ctx.fillRect(0, 0, MAX_EDGE, MAX_EDGE);

      // Fit the image comfortably inside the circle with a safe margin so nothing gets sliced
      const scale = Math.min((MAX_EDGE * 0.92) / img.width, (MAX_EDGE * 0.92) / img.height);
      const dw = img.width * scale;
      const dh = img.height * scale;
      const dx = (MAX_EDGE - dw) / 2;
      const dy = (MAX_EDGE - dh) / 2;

      ctx.drawImage(img, 0, 0, img.width, img.height, dx, dy, dw, dh);
      resolve(canvas.toDataURL("image/jpeg", 0.88));
    };

    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("not an image"));
    };

    img.src = url;
  });
}

export default function AvatarPicker({
  name,
  email,
  avatarUrl,
}: {
  name: string | null;
  email: string;
  avatarUrl: string | null;
}) {
  const { lang } = useI18n();
  const isEn = lang === "en";

  const router = useRouter();
  const fileRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(avatarUrl);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function save(value: string | null) {
    setBusy(true);
    setError("");
    try {
      const res = await fetch("/api/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ avatarUrl: value }),
      });
      if (!res.ok) {
        const raw = await res.text();
        let msg = isEn ? "Failed to save photo" : "مش قادر أحفظ الصورة";
        try {
          msg = JSON.parse(raw).error ?? msg;
        } catch {
          /* keep the default */
        }
        setError(msg);
        setPreview(avatarUrl);
        return;
      }
      router.refresh();
    } catch {
      setError(isEn ? "Server connection failed" : "مفيش اتصال بالسيرفر");
      setPreview(avatarUrl);
    } finally {
      setBusy(false);
    }
  }

  async function onPick(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setError(isEn ? "Please select a valid image" : "اختار صورة");
      return;
    }
    if (file.size > MAX_INPUT_BYTES) {
      setError(isEn ? "Image file is too large" : "الصورة كبيرة أوي");
      return;
    }

    setBusy(true);
    try {
      const dataUrl = await shrink(file);
      setPreview(dataUrl);
      await save(dataUrl);
    } catch {
      setError(isEn ? "Unable to read this image" : "مش قادر أقرا الصورة دي");
      setBusy(false);
    }
  }

  return (
    <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 text-center sm:text-start" dir={isEn ? "ltr" : "rtl"}>
      <div className="relative shrink-0">
        <button
          type="button"
          onClick={() => fileRef.current?.click()}
          disabled={busy}
          className="avatar-edit relative block rounded-full focus:outline-hidden ring-2 ring-black/5 dark:ring-white/10 hover:ring-brand-500/50 transition-all active:scale-95"
          aria-label={isEn ? "Change your avatar" : "غيّر صورتك"}
        >
          <Avatar name={name} email={email} avatarUrl={preview} size={72} />
          <span className="avatar-edit-badge absolute bottom-0 right-0 bg-neutral-900/80 text-white rounded-full p-1.5 text-xs shadow-md border border-white/20" aria-hidden>
            📷
          </span>
        </button>
      </div>

      <div className="min-w-0 flex-1">
        <p className="mb-1 text-sm font-bold text-neutral-900 dark:text-white">
          {isEn ? "Profile Picture" : "صورتك الشخصية"}
        </p>
        <p className="mb-3 text-xs leading-relaxed text-neutral-500 dark:text-neutral-400">
          {isEn ? "JPG or PNG. Tap to choose a new picture." : "دوس على الصورة عشان تغيّرها. JPG أو PNG."}
        </p>
        <div className="flex flex-wrap justify-center sm:justify-start gap-2">
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            disabled={busy}
            className="rounded-full border border-black/10 dark:border-white/10 bg-neutral-50 dark:bg-neutral-800 px-3.5 py-1.5 text-xs font-bold text-neutral-800 dark:text-neutral-200 disabled:opacity-50 hover:border-brand-500/40 transition-colors shadow-2xs"
          >
            {busy ? "..." : preview ? (isEn ? "Change photo" : "غيّر الصورة") : (isEn ? "Upload photo" : "ارفع صورة")}
          </button>
          {preview && (
            <button
              type="button"
              onClick={() => {
                setPreview(null);
                save(null);
              }}
              disabled={busy}
              className="rounded-full border border-black/10 dark:border-white/10 px-3.5 py-1.5 text-xs font-semibold text-neutral-500 hover:text-red-600 disabled:opacity-50 transition-colors"
            >
              {isEn ? "Remove" : "شيلها"}
            </button>
          )}
        </div>
        {error && <p className="mt-2 text-xs text-red-600">{error}</p>}
      </div>

      <input
        ref={fileRef}
        type="file"
        accept="image/png,image/jpeg,image/webp"
        onChange={onPick}
        className="hidden"
      />
    </div>
  );
}
