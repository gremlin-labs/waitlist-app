import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { db } from "@/db";
import { user } from "@/db/schema";
import { eq } from "drizzle-orm";
import { awardPoints, getUserPoints } from "@/lib/points";

/**
 * POST /api/admin/waitlist/[id]/adjust-points - Manual point adjustment
 */
export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Verify admin
  const [adminUser] = await db
    .select({ isAdmin: user.isAdmin, email: user.email })
    .from(user)
    .where(eq(user.id, session.user.id));

  if (!adminUser?.isAdmin) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  // Check target user exists
  const targetUser = await db.query.user.findFirst({
    where: eq(user.id, id),
    columns: { id: true, email: true },
  });

  if (!targetUser) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  try {
    const body = await req.json();
    const { points, note } = body;

    if (typeof points !== "number" || points === 0) {
      return NextResponse.json(
        { error: "Points must be a non-zero number" },
        { status: 400 }
      );
    }

    // Award points with admin action type
    await awardPoints(
      id,
      "admin_adjustment",
      points,
      session.user.id, // Reference to the admin who made the adjustment
      note || `Manual adjustment by ${adminUser.email}`
    );

    // Get updated points
    const updatedPoints = await getUserPoints(id);

    return NextResponse.json({
      success: true,
      message: `${points > 0 ? "Added" : "Deducted"} ${Math.abs(points)} points`,
      newTotal: updatedPoints.total,
    });
  } catch (error) {
    console.error("Failed to adjust points:", error);
    return NextResponse.json(
      { error: "Failed to adjust points" },
      { status: 500 }
    );
  }
}
