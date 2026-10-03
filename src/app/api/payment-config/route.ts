import { NextResponse } from "next/server";
import { getPaymentConfig } from "@/lib/payment-config";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const config = await getPaymentConfig();
    return NextResponse.json(
      { ok: true, config },
      {
        headers: {
          "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
          Pragma: "no-cache",
          Expires: "0",
        },
      }
    );
  } catch (err) {
    return NextResponse.json(
      { ok: false, error: "Failed to retrieve payment configuration" },
      { status: 500 }
    );
  }
}
