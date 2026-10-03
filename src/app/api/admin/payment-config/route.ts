import { NextResponse } from "next/server";
import { adminUser } from "@/lib/admin";
import { getPaymentConfig, updatePaymentConfig, resetPaymentConfig, PaymentConfig } from "@/lib/payment-config";
import { logAdminAction } from "@/lib/audit-log";
import { readJson } from "@/lib/read-json";

export const dynamic = "force-dynamic";

export async function GET() {
  const admin = await adminUser();
  if (!admin) {
    return NextResponse.json({ error: "غير مصرح لك بالوصول" }, { status: 401 });
  }

  try {
    const config = await getPaymentConfig();
    return NextResponse.json({ ok: true, config });
  } catch (err) {
    return NextResponse.json(
      { error: "حدث خطأ أثناء جلب إعدادات الدفع" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  const admin = await adminUser();
  if (!admin) {
    return NextResponse.json({ error: "غير مصرح لك بالوصول" }, { status: 401 });
  }

  try {
    const body = await readJson(request);

    if (body.action === "reset") {
      const reset = await resetPaymentConfig();
      await logAdminAction({
        admin,
        action: "reset_payment_config",
        targetType: "system_setting",
        detail: "Reset payment numbers to default brand configuration",
      });
      return NextResponse.json({ ok: true, config: reset });
    }

    const vodafoneCash = Array.isArray(body.vodafoneCash)
      ? body.vodafoneCash.map((v: unknown) => String(v).trim()).filter(Boolean)
      : [];

    const instapay = Array.isArray(body.instapay)
      ? body.instapay.map((v: unknown) => String(v).trim()).filter(Boolean)
      : [];

    if (vodafoneCash.length === 0) {
      return NextResponse.json(
        { error: "يجب تحديد رقم فودافون كاش واحد على الأقل لاستقبال التحويلات." },
        { status: 400 }
      );
    }

    if (instapay.length === 0) {
      return NextResponse.json(
        { error: "يجب تحديد حساب إنستاباي واحد على الأقل لاستقبال التحويلات." },
        { status: 400 }
      );
    }

    const payload: Partial<PaymentConfig> = {
      vodafoneCash,
      instapay,
    };

    if (typeof body.supportWhatsapp === "string" && body.supportWhatsapp.trim()) {
      payload.supportWhatsapp = body.supportWhatsapp.trim();
    }

    if (typeof body.supportEmail === "string" && body.supportEmail.trim()) {
      payload.supportEmail = body.supportEmail.trim();
    }

    if (typeof body.activationHours === "number" && body.activationHours > 0) {
      payload.activationHours = body.activationHours;
    }

    const updated = await updatePaymentConfig(payload);

    await logAdminAction({
      admin,
      action: "update_payment_config",
      targetType: "system_setting",
      detail: `Updated payment config: ${updated.vodafoneCash.join(", ")} | InstaPay: ${updated.instapay.join(", ")}`,
    });

    return NextResponse.json({ ok: true, config: updated });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "حدث خطأ غير متوقع أثناء حفظ الإعدادات" },
      { status: 500 }
    );
  }
}
