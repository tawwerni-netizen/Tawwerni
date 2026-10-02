import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { getCurrentUser } from "@/lib/auth";
import { hasVipAccess } from "@/lib/access";
import { prisma } from "@/lib/prisma";

const VAULT_DIR = path.join(process.cwd(), "src", "content", "vip-vault");
const TRACKS_DIR = path.join(VAULT_DIR, "tracks");

const TRACK_KEYS = [
  "strategy",
  "sales",
  "marketing",
  "freelance",
  "engineering",
  "product",
  "operations",
  "finance",
  "hr",
  "retention",
];

export async function GET(request: Request) {
  const user = await getCurrentUser();
  if (!user) {
    return NextResponse.json({ error: "يجب تسجيل الدخول أولاً" }, { status: 401 });
  }

  const isVip = await hasVipAccess(user.id);
  if (!isVip) {
    return NextResponse.json({ error: "هذه الميزة متاحة حصرياً لأعضاء ترقية VIP" }, { status: 403 });
  }

  const { searchParams } = new URL(request.url);
  const track = searchParams.get("track") || "all";
  const domain = searchParams.get("domain") || "all";

  // Record download in database so admin panel tracks that this user downloaded the assets
  try {
    await prisma.leadMagnetRequest.create({
      data: {
        email: user.email.toLowerCase().trim(),
        name: user.name || user.email,
        magnetKey: "vault_10000_prompts_download",
      },
    });

    await prisma.adminAuditLog.create({
      data: {
        adminId: user.id,
        adminEmail: user.email,
        action: "user.vault_download",
        targetType: "vip_vault",
        targetId: user.id,
        detail: `User ${user.email} downloaded prompts (track: ${track}, domain: ${domain})`,
      },
    });
  } catch (err) {
    console.error("Failed to record vault download audit:", err);
  }

  let targetPrompts: any[] = [];
  let fileName = `Tawwerni-10000-Prompts-Vault-${(user.name || "VIP").replace(/\s+/g, "_")}.txt`;

  if (track !== "all" && TRACK_KEYS.includes(track)) {
    const filePath = path.join(TRACKS_DIR, `track-${track}.json`);
    if (fs.existsSync(filePath)) {
      targetPrompts = JSON.parse(fs.readFileSync(filePath, "utf-8"));
      fileName = `Tawwerni-Track-${track}-1000-Prompts.txt`;
    }
  } else {
    for (const k of TRACK_KEYS) {
      const filePath = path.join(TRACKS_DIR, `track-${k}.json`);
      if (fs.existsSync(filePath)) {
        targetPrompts = targetPrompts.concat(JSON.parse(fs.readFileSync(filePath, "utf-8")));
      }
    }
  }

  if (domain !== "all") {
    targetPrompts = targetPrompts.filter((p) => p.domainId === domain || p.domainSlug === domain);
    fileName = `Tawwerni-Domain-${domain}-100-Prompts.txt`;
  }

  const lines: string[] = [];
  lines.push("================================================================================");
  lines.push("👑 بنك الـ 10,000 برومبت التنفيذي للشركات والمستقلين المحترفين (100 مجال × 100 برومبت)");
  lines.push("👑 Tawwerni 10,000 Enterprise Prompts Database · https://tawwerni.com");
  lines.push(`المشترك المرخص له: ${user.name || user.email} (${user.email})`);
  lines.push(`تاريخ التصدير: ${new Date().toLocaleDateString("ar-EG")} - ${new Date().toISOString()}`);
  lines.push(`عدد البرومبتات في هذا الملف: ${targetPrompts.length.toLocaleString("ar-EG")} برومبت`);
  lines.push("================================================================================\n");

  targetPrompts.forEach((p, idx) => {
    lines.push("--------------------------------------------------------------------------------");
    lines.push(`[#${idx + 1}] ${p.titleAr} | كود: ${p.id} | الترتيب العام: #${p.globalIndex}`);
    lines.push(`المسار: ${p.trackTitleAr} | المجال: ${p.domainTitleAr}`);
    lines.push(`النموذج المقترح: ${p.recommendedModel} | المستوى: ${p.difficulty}`);
    lines.push(`المستهدف: ${p.targetRoleAr}`);
    lines.push(`نصيحة الاستخدام: ${p.usageTipAr}`);
    lines.push(`\nنص البرومبت التنفيذي القابل للنسخ:\n`);
    lines.push(p.promptTextAr);
    lines.push("\n\nEnglish Prompt Architecture:\n");
    lines.push(p.promptTextEn);
    lines.push("\n");
  });

  const content = lines.join("\n");

  return new Response(content, {
    status: 200,
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Content-Disposition": `attachment; filename="${fileName}"`,
    },
  });
}
