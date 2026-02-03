import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { user } from "@/db/schema";
import { eq, desc, asc, like, count, sql, not } from "drizzle-orm";
import { requireAdmin } from "@/lib/admin";

// GET: List all users with pagination and filtering
export async function GET(request: NextRequest) {
  const admin = await requireAdmin();
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const page = parseInt(searchParams.get("page") || "1");
  const limit = parseInt(searchParams.get("limit") || "50");
  const search = searchParams.get("search") || "";
  const status = searchParams.get("status") || "";
  const sortBy = searchParams.get("sortBy") || "createdAt";
  const sortOrder = searchParams.get("sortOrder") || "desc";
  const hideDemoUsers = searchParams.get("hideDemoUsers") !== "false"; // Default true

  const offset = (page - 1) * limit;

  try {
    // Build where conditions
    const conditions = [];
    if (search) {
      conditions.push(like(user.email, `%${search}%`));
    }
    if (status && status !== "all") {
      conditions.push(eq(user.betaStatus, status));
    }
    if (hideDemoUsers) {
      conditions.push(not(like(user.email, "demo-%@example.com")));
    }

    // Get total count
    const [countResult] = await db
      .select({ count: count() })
      .from(user)
      .where(conditions.length > 0 ? sql`${conditions.map(c => c).join(" AND ")}` : undefined);

    // Get users
    const userList = await db.query.user.findMany({
      where: conditions.length > 0 ? conditions[0] : undefined,
      limit,
      offset,
      orderBy: sortOrder === "desc" ? desc(user[sortBy as keyof typeof user.$inferSelect] as any) : asc(user[sortBy as keyof typeof user.$inferSelect] as any),
      columns: {
        id: true,
        email: true,
        name: true,
        betaStatus: true,
        isAdmin: true,
        surveyCompletedAt: true,
        referralCode: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return NextResponse.json({
      users: userList,
      pagination: {
        page,
        limit,
        total: countResult?.count || 0,
        totalPages: Math.ceil((countResult?.count || 0) / limit),
      },
    });
  } catch (error) {
    console.error("Admin users error:", error);
    return NextResponse.json(
      { error: "Failed to fetch users" },
      { status: 500 }
    );
  }
}

// PATCH: Update user status
export async function PATCH(request: NextRequest) {
  const admin = await requireAdmin();
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { userId, betaStatus, isAdmin: makeAdmin } = body;

    if (!userId) {
      return NextResponse.json(
        { error: "User ID required" },
        { status: 400 }
      );
    }

    const updates: Record<string, unknown> = {
      updatedAt: new Date(),
    };

    if (betaStatus !== undefined) {
      updates.betaStatus = betaStatus;
      if (betaStatus === "invited") {
        updates.betaInvitedAt = new Date();
      } else if (betaStatus === "active") {
        updates.betaActivatedAt = new Date();
      }
    }

    if (makeAdmin !== undefined) {
      updates.isAdmin = makeAdmin;
    }

    const [updatedUser] = await db
      .update(user)
      .set(updates)
      .where(eq(user.id, userId))
      .returning();

    return NextResponse.json({ user: updatedUser });
  } catch (error) {
    console.error("Admin update error:", error);
    return NextResponse.json(
      { error: "Failed to update user" },
      { status: 500 }
    );
  }
}
