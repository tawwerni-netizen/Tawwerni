import { NextResponse } from "next/server";
import { getSessionUserId } from "@/lib/auth";
import { ensureReferralCode } from "@/lib/referrals";

/**
 * The signed-in user's referral code, minted on first request.
 *
 * Separate from the referrals page so any share button anywhere in the app can
 * build a link that credits the sharer, without that page having to be loaded.
 */
export async function GET() {
  const userId = await getSessionUserId();
  if (!userId) return NextResponse.json({ error: "لازم تسجل دخول" }, { status: 401 });

  try {
    return NextResponse.json({ code: await ensureReferralCode(userId) });
  } catch {
    // A share that falls back to the plain domain is far better than a 500.
    return NextResponse.json({ code: null });
  }
}
