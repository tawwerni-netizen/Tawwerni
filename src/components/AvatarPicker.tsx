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
    <div className="flex flex-col items-center gap-2">
      <div className="relative group">
        <button
          type="button"
          onClick={() => fileRef.current?.click()}
          disabled={busy}
          className="relative block rounded-full focus:outline-hidden ring-4 ring-teal-500/20 hover:ring-teal-500/50 dark:ring-teal-400/20 dark:hover:ring-teal-400/60 transition-all active:scale-95 shadow-xl hover:shadow-teal-500/20"
          aria-label={isEn ? "Change your avatar" : "غيّر صورتك الشخصية"}
          title={isEn ? "Click to change photo" : "اضغط لتغيير الصورة"}
        >
          <Avatar name={name} email={email} avatarUrl={preview} size={84} glow />
          
          {/* Subtle camera hover overlay */}
          <span className="absolute inset-0 rounded-full bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-xl backdrop-blur-[2px]">
            📷
          </span>

          <span
            className="absolute bottom-0 end-0 bg-teal-600 hover:bg-teal-500 text-white rounded-full p-1.5 text-xs shadow-lg border-2 border-white dark:border-neutral-900 transition-transform group-hover:scale-110"
            aria-hidden
          >
            📷
          </span>
        </button>

        {busy && (
          <div className="absolute inset-0 rounded-full bg-neutral-950/70 backdrop-blur-xs flex items-center justify-center text-white text-xs font-black animate-pulse">
            ...
          </div>
        )}
      </div>

      {/* Compact micro-actions under avatar */}
      <div className="flex items-center gap-1.5 text-[11px]">
        <button
          type="button"
          onClick={() => fileRef.current?.click()}
          disabled={busy}
          className="px-2.5 py-1 rounded-full bg-teal-500/10 hover:bg-teal-500/20 dark:bg-teal-400/10 dark:hover:bg-teal-400/20 text-teal-700 dark:text-teal-300 font-bold border border-teal-500/20 transition-all active:scale-95"
        >
          {preview ? (isEn ? "Change" : "تغيير") : (isEn ? "Upload" : "رفع صورة")}
        </button>
        {preview && (
          <button
            type="button"
            onClick={() => {
              setPreview(null);
              save(null);
            }}
            disabled={busy}
            className="px-2 py-1 rounded-full text-neutral-400 hover:text-red-500 hover:bg-red-500/10 dark:hover:bg-red-500/20 transition-all"
            title={isEn ? "Remove photo" : "حذف الصورة"}
          >
            {isEn ? "Remove" : "حذف"}
          </button>
        )}
      </div>

      {error && <p className="text-[11px] text-red-500 font-bold max-w-[130px] text-center">{error}</p>}

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
