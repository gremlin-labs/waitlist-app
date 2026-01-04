import { NextRequest, NextResponse } from "next/server";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { db } from "@/db";
import { user } from "@/db/schema";
import { eq } from "drizzle-orm";
import { validateUsername, normalizeUsername, formatUsernameForDisplay } from "@/lib/username";

/**
 * GET /api/username
 * Get current user's username
 */
export async function GET() {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const userData = await db.query.user.findFirst({
    where: eq(user.id, session.user.id),
    columns: {
      username: true,
    },
  });

  return NextResponse.json({
    username: userData?.username || null,
    display: userData?.username ? formatUsernameForDisplay(userData.username) : null,
  });
}

/**
 * PATCH /api/username
 * Update current user's username
 */
export async function PATCH(req: NextRequest) {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { username } = body;

    if (!username) {
      return NextResponse.json(
        { error: "Username is required" },
        { status: 400 }
      );
    }

    const normalized = normalizeUsername(username);

    // Get current user's username
    const currentUser = await db.query.user.findFirst({
      where: eq(user.id, session.user.id),
      columns: {
        username: true,
      },
    });

    // If username is the same (case-insensitive), no change needed
    if (currentUser?.username?.toLowerCase() === normalized) {
      return NextResponse.json({
        username: currentUser.username,
        display: formatUsernameForDisplay(currentUser.username),
        message: "Username unchanged",
      });
    }

    // Validate the new username
    const validation = await validateUsername(normalized);
    if (!validation.valid) {
      return NextResponse.json(
        { error: validation.error },
        { status: 400 }
      );
    }

    // Update the username
    await db
      .update(user)
      .set({
        username: normalized,
        updatedAt: new Date(),
      })
      .where(eq(user.id, session.user.id));

    return NextResponse.json({
      username: normalized,
      display: formatUsernameForDisplay(normalized),
      message: "Username updated successfully",
    });
  } catch (error) {
    console.error("Failed to update username:", error);
    return NextResponse.json(
      { error: "Failed to update username" },
      { status: 500 }
    );
  }
}
