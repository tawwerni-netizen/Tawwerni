import { NextResponse } from "next/server";
import { verifyAdminPassword, setAdminCookie } from "@/lib/admin";

export async function POST(request: Request) {
  const { password } = await request.json();
  if (typeof password !== "string" || !verifyAdminPassword(password)) {
    return NextResponse.json({ error: "كلمة السر غلط" }, { status: 401 });
  }
  await setAdminCookie();
  return NextResponse.json({ ok: true });
}
