import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSessionUserId } from "@/lib/auth";

export async function PATCH(request: Request) {
  const userId = await getSessionUserId();
  if (!userId) return NextResponse.json({ error: "لازم تسجل دخول" }, { status: 401 });

  const body = await request.json();
  const data: { name?: string; dailyPaceMinutes?: number; focusCategory?: string } = {};

  if (typeof body.name === "string" && body.name.trim()) data.name = body.name.trim();
  if (typeof body.dailyPaceMinutes === "number") data.dailyPaceMinutes = body.dailyPaceMinutes;
  if (typeof body.focusCategory === "string") data.focusCategory = body.focusCategory;

  const user = await prisma.user.update({ where: { id: userId }, data });
  return NextResponse.json({ ok: true, user });
}
