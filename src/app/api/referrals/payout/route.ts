import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { requestPayout } from "@/lib/referrals";

const VALID_METHODS = ["vodafone_cash", "instapay"];

export async function POST(request: Request) {
  const user = await getCurrentUser();
  if (!user) return NextResponse.json({ error: "لازم تسجّل دخول" }, { status: 401 });

  const { method, destination } = await request.json();

  if (typeof method !== "string" || !VALID_METHODS.includes(method)) {
    return NextResponse.json({ error: "اختار طريقة استلام صحيحة" }, { status: 400 });
  }

  const dest = typeof destination === "string" ? destination.trim() : "";
  if (method === "vodafone_cash" && !/^01\d{9}$/.test(dest.replace(/\D/g, ""))) {
    return NextResponse.json({ error: "رقم المحفظة لازم يكون ١١ رقم ويبدأ بـ 01" }, { status: 400 });
  }
  if (method === "instapay" && dest.length < 3) {
    return NextResponse.json({ error: "اكتب معرّف إنستاباي بتاعك" }, { status: 400 });
  }

  // One open request at a time keeps the ledger simple to reason about.
  const open = await prisma.payout.findFirst({
    where: { userId: user.id, status: "requested" },
    select: { id: true },
  });
  if (open) {
    return NextResponse.json(
      { error: "عندك طلب سحب تحت المراجعة بالفعل" },
      { status: 409 }
    );
  }

  const result = await requestPayout({ userId: user.id, method, destination: dest });
  if (!result.ok) return NextResponse.json({ error: result.error }, { status: 400 });

  return NextResponse.json({ ok: true, amountEgp: result.payout.amountEgp });
}
