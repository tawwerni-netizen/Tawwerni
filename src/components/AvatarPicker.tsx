"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Avatar from "@/components/Avatar";

/** Longest edge of the stored image. Plenty for a 34px header tile at 3x. */
const MAX_EDGE = 256;
const MAX_INPUT_BYTES = 8 * 1024 * 1024;

/**
 * Downscales and re-encodes in the browser before upload.
 *
 * A phone camera photo is 4MB of JPEG that would be stored and re-sent on every
 * page load. Drawing it to a square canvas at 256px turns it into ~20KB and, as
 * a side effect, strips EXIF — so nobody uploads a selfie carrying the GPS
 * coordinates of their house into a database the owner can read.
 */
function shrink(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file);
    const img = new Image();

    img.onload = () => {
      URL.revokeObjectURL(url);
      // Centre-crop to a square, since the avatar is always round.
      const edge = Math.min(img.width, img.height);
      const sx = (img.width - edge) / 2;
      const sy = (img.height - edge) / 2;

      const canvas = document.createElement("canvas");
      canvas.width = canvas.height = Math.min(edge, MAX_EDGE);
      const ctx = canvas.getContext("2d");
      if (!ctx) return reject(new Error("canvas unavailable"));

      ctx.drawImage(img, sx, sy, edge, edge, 0, 0, canvas.width, canvas.height);
      resolve(canvas.toDataURL("image/jpeg", 0.82));
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
        let msg = "مش قادر أحفظ الصورة";
        try {
          msg = JSON.parse(raw).error ?? msg;
        } catch {
          /* keep the default */
        }
        setError(msg);
        setPreview(avatarUrl); // put the old one back
        return;
      }
      router.refresh();
    } catch {
      setError("مفيش اتصال بالسيرفر");
      setPreview(avatarUrl);
    } finally {
      setBusy(false);
    }
  }

  async function onPick(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = ""; // so picking the same file twice still fires
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setError("اختار صورة");
      return;
    }
    if (file.size > MAX_INPUT_BYTES) {
      setError("الصورة كبيرة أوي");
      return;
    }

    setBusy(true);
    try {
      const dataUrl = await shrink(file);
      setPreview(dataUrl);
      await save(dataUrl);
    } catch {
      setError("مش قادر أقرا الصورة دي");
      setBusy(false);
    }
  }

  return (
    <div className="flex items-center gap-4">
      <button
        type="button"
        onClick={() => fileRef.current?.click()}
        disabled={busy}
        className="avatar-edit relative shrink-0 rounded-full"
        aria-label="غيّر صورتك"
      >
        <Avatar name={name} email={email} avatarUrl={preview} size={64} />
        <span className="avatar-edit-badge" aria-hidden>
          📷
        </span>
      </button>

      <div className="min-w-0 flex-1">
        <p className="mb-1 text-xs font-bold">صورتك الشخصية</p>
        <p className="mb-2 text-[11px] leading-relaxed text-neutral-400">
          دوس على الصورة عشان تغيّرها. JPG أو PNG.
        </p>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => fileRef.current?.click()}
            disabled={busy}
            className="rounded-full border border-black/10 px-3 py-1.5 text-[11px] font-bold disabled:opacity-50"
          >
            {busy ? "..." : preview ? "غيّر الصورة" : "ارفع صورة"}
          </button>
          {preview && (
            <button
              type="button"
              onClick={() => {
                setPreview(null);
                save(null);
              }}
              disabled={busy}
              className="rounded-full border border-black/10 px-3 py-1.5 text-[11px] text-neutral-500 disabled:opacity-50"
            >
              شيلها
            </button>
          )}
        </div>
        {error && <p className="mt-2 text-[11px] text-red-600">{error}</p>}
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
