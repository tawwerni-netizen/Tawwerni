import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSessionUserId } from "@/lib/auth";

/**
 * The learner's own profile.
 *
 * Two things this route is careful about:
 *
 *  1. It returns a hand-picked set of fields. It used to return the whole user
 *     row, which meant every save shipped the account's `passwordHash` down to
 *     the browser, into any cache along the way, and into the devtools of
 *     anyone looking. Nothing here should ever see that column.
 *
 *  2. Every value is validated. `dailyPaceMinutes` is drawn from a fixed set
 *     rather than "any number", and the avatar is bounded — see below.
 */

const PACE_OPTIONS = [5, 10, 15, 30] as const;

const FOCUS_OPTIONS = [
  "ai-tech",
  "success-mindset",
  "career",
  "business",
  "health",
  "project-management",
  "all",
] as const;

/**
 * Avatars are stored inline as data URIs.
 *
 * The alternative is a filesystem upload directory, which on this host is
 * shared, world-readable, and survives redeploys as orphaned files. Inline
 * costs a little database size and removes an entire class of problem: no
 * path traversal, no unserved directory, no stale files, and nothing that can
 * be fetched by URL by someone who isn't logged in.
 *
 * The client downsizes to 256px before sending; this cap is the backstop.
 */
const MAX_AVATAR_BYTES = 400_000;
const ALLOWED_IMAGE = /^data:image\/(png|jpeg|webp);base64,[A-Za-z0-9+/=]+$/;

export async function PATCH(request: Request) {
  const userId = await getSessionUserId();
  if (!userId) return NextResponse.json({ error: "لازم تسجل دخول" }, { status: 401 });

  const body = await request.json();
  const data: {
    name?: string;
    dailyPaceMinutes?: number;
    focusCategory?: string;
    avatarUrl?: string | null;
  } = {};

  if (typeof body.name === "string") {
    const name = body.name.trim().slice(0, 60);
    if (name.length < 2) {
      return NextResponse.json({ error: "الاسم قصير أوي" }, { status: 400 });
    }
    data.name = name;
  }

  if (body.dailyPaceMinutes !== undefined) {
    const pace = Number(body.dailyPaceMinutes);
    if (!PACE_OPTIONS.includes(pace as (typeof PACE_OPTIONS)[number])) {
      return NextResponse.json({ error: "قيمة غير صالحة" }, { status: 400 });
    }
    data.dailyPaceMinutes = pace;
  }

  if (body.focusCategory !== undefined) {
    if (!FOCUS_OPTIONS.includes(body.focusCategory)) {
      return NextResponse.json({ error: "تصنيف غير صالح" }, { status: 400 });
    }
    data.focusCategory = body.focusCategory;
  }

  if (body.avatarUrl !== undefined) {
    if (body.avatarUrl === null || body.avatarUrl === "") {
      data.avatarUrl = null;
    } else if (typeof body.avatarUrl !== "string" || !ALLOWED_IMAGE.test(body.avatarUrl)) {
      // Rejecting anything that isn't a base64 PNG/JPEG/WebP also rejects
      // `data:image/svg+xml`, which can carry script and would run on any page
      // that ever rendered it outside an <img>.
      return NextResponse.json({ error: "الصورة لازم تكون PNG أو JPG أو WebP" }, { status: 400 });
    } else if (body.avatarUrl.length > MAX_AVATAR_BYTES) {
      return NextResponse.json({ error: "الصورة كبيرة أوي — أقصى حجم ٣٠٠ كيلوبايت" }, { status: 413 });
    } else {
      data.avatarUrl = body.avatarUrl;
    }
  }

  if (Object.keys(data).length === 0) {
    return NextResponse.json({ error: "مفيش حاجة تتغيّر" }, { status: 400 });
  }

  const user = await prisma.user.update({
    where: { id: userId },
    data,
    select: {
      id: true,
      name: true,
      email: true,
      avatarUrl: true,
      dailyPaceMinutes: true,
      focusCategory: true,
    },
  });

  return NextResponse.json({ ok: true, user });
}
