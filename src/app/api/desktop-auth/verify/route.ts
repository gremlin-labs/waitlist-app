import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { appTokens, user as userTable } from "@/db/schema";
import { eq, and, gt } from "drizzle-orm";
import { hashToken } from "@/lib/crypto";

// GET: Verify a token (used by desktop app)
export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get("authorization");
    
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json(
        { error: "Missing authorization header" },
        { status: 401 }
      );
    }

    const token = authHeader.substring(7);
    const tokenHash = await hashToken(token);

    // Find token by hash
    const tokenRecord = await db.query.appTokens.findFirst({
      where: and(
        eq(appTokens.tokenHash, tokenHash),
        eq(appTokens.isActive, true),
        gt(appTokens.expiresAt, new Date())
      ),
      with: {
        // We need to join with user - but for now let's query separately
      },
    });

    if (!tokenRecord) {
      return NextResponse.json(
        { error: "Invalid or expired token" },
        { status: 401 }
      );
    }

    // Get user data
    const foundUser = await db.query.user.findFirst({
      where: eq(userTable.id, tokenRecord.userId),
      columns: {
        id: true,
        email: true,
        name: true,
        betaStatus: true,
      },
    });

    if (!foundUser || foundUser.betaStatus !== "active") {
      return NextResponse.json(
        { error: "User not authorized" },
        { status: 403 }
      );
    }

    // Update last used timestamp
    await db
      .update(appTokens)
      .set({ lastUsedAt: new Date() })
      .where(eq(appTokens.id, tokenRecord.id));

    return NextResponse.json({
      valid: true,
      user: {
        id: foundUser.id,
        email: foundUser.email,
        name: foundUser.name,
      },
      device: {
        id: tokenRecord.deviceId,
        name: tokenRecord.deviceName,
      },
    });
  } catch (error) {
    console.error("Token verification error:", error);
    return NextResponse.json(
      { error: "Verification failed" },
      { status: 500 }
    );
  }
}
