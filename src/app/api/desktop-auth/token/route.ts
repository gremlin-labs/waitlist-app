import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { appTokens, user as userTable } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { hashToken, generateSecureToken } from "@/lib/crypto";

// POST: Generate a new app token for desktop auth
export async function POST(request: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Check if user is an active beta user
    const foundUser = await db.query.user.findFirst({
      where: eq(userTable.id, session.user.id),
    });

    if (!foundUser || foundUser.betaStatus !== "active") {
      return NextResponse.json(
        { error: "Beta access required" },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { deviceName, deviceId } = body;

    // Generate secure token
    const token = generateSecureToken();
    const tokenHash = await hashToken(token);

    // Set expiration to 30 days
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 30);

    // Create token record
    const [newToken] = await db
      .insert(appTokens)
      .values({
        userId: session.user.id,
        token: token, // Store plain token (will be shown once)
        tokenHash: tokenHash,
        deviceName: deviceName || "Unknown Device",
        deviceId: deviceId || null,
        expiresAt: expiresAt,
      })
      .returning();

    return NextResponse.json({
      token: token, // Only returned once on creation
      tokenId: newToken.id,
      expiresAt: expiresAt.toISOString(),
    });
  } catch (error) {
    console.error("Token generation error:", error);
    return NextResponse.json(
      { error: "Failed to generate token" },
      { status: 500 }
    );
  }
}

// GET: List all tokens for the current user
export async function GET() {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const tokens = await db.query.appTokens.findMany({
      where: and(
        eq(appTokens.userId, session.user.id),
        eq(appTokens.isActive, true)
      ),
      columns: {
        id: true,
        deviceName: true,
        deviceId: true,
        lastUsedAt: true,
        createdAt: true,
        expiresAt: true,
      },
      orderBy: (appTokens, { desc }) => [desc(appTokens.lastUsedAt)],
    });

    return NextResponse.json({ tokens });
  } catch (error) {
    console.error("Token list error:", error);
    return NextResponse.json(
      { error: "Failed to list tokens" },
      { status: 500 }
    );
  }
}

// DELETE: Revoke a specific token
export async function DELETE(request: NextRequest) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const tokenId = searchParams.get("tokenId");

    if (!tokenId) {
      return NextResponse.json(
        { error: "Token ID required" },
        { status: 400 }
      );
    }

    // Verify ownership and revoke
    const result = await db
      .update(appTokens)
      .set({ isActive: false })
      .where(
        and(
          eq(appTokens.id, tokenId),
          eq(appTokens.userId, session.user.id)
        )
      )
      .returning();

    if (result.length === 0) {
      return NextResponse.json(
        { error: "Token not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Token revoke error:", error);
    return NextResponse.json(
      { error: "Failed to revoke token" },
      { status: 500 }
    );
  }
}
