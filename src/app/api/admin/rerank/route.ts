import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin";
import { recalculateAllRanks } from "@/lib/points";

export async function POST() {
  const admin = await requireAdmin();
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const start = Date.now();
    await recalculateAllRanks();
    const duration = Date.now() - start;

    return NextResponse.json({
      success: true,
      message: "Rankings recalculated successfully",
      duration: `${duration}ms`,
    });
  } catch (error) {
    console.error("Re-rank error:", error);
    return NextResponse.json(
      { error: "Failed to recalculate rankings" },
      { status: 500 }
    );
  }
}
