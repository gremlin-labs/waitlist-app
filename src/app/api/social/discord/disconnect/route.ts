import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { db } from "@/db";
import { discordConnections } from "@/db/schema";
import { eq } from "drizzle-orm";
import { decrypt } from "@/lib/crypto";
import { revokeDiscordToken } from "@/lib/discord";

/**
 * POST /api/social/discord/disconnect
 * Disconnects Discord account
 */
export async function POST() {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get user's Discord connection
    const connection = await db.query.discordConnections.findFirst({
      where: eq(discordConnections.userId, session.user.id),
    });

    if (!connection) {
      return NextResponse.json(
        { error: "Discord not connected" },
        { status: 400 }
      );
    }

    // Try to revoke token on Discord's end (best effort)
    try {
      await revokeDiscordToken(decrypt(connection.accessToken));
    } catch (error) {
      // Log but don't fail if revocation fails
      console.warn("Failed to revoke Discord token:", error);
    }

    // Delete the connection
    await db
      .delete(discordConnections)
      .where(eq(discordConnections.userId, session.user.id));

    // Note: We don't revoke points - they're part of the audit trail
    // The user earned them fairly at the time, and the ledger is immutable

    return NextResponse.json({
      success: true,
      message: "Discord disconnected successfully",
    });
  } catch (error) {
    console.error("Discord disconnect error:", error);
    return NextResponse.json(
      { error: "Failed to disconnect Discord" },
      { status: 500 }
    );
  }
}
