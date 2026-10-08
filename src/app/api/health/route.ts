import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { ensureDatabaseSchema } from "@/lib/db-schema-sync";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    await ensureDatabaseSchema(prisma);
    const userCount = await prisma.user.count();

    return NextResponse.json({
      status: "healthy",
      database: "connected",
      userCount,
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    console.error("[HealthCheck] Database error:", error);
    return NextResponse.json(
      {
        status: "unhealthy",
        error: error?.message || String(error),
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}
