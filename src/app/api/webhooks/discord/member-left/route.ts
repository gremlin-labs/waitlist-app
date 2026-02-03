import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { discordConnections } from "@/db/schema";
import { eq } from "drizzle-orm";
import { awardPoints } from "@/lib/points";

const BOT_API_SECRET = process.env.BOT_API_SECRET;

/**
 * POST /api/webhooks/discord/member-left
 * Called by Discord bot when a user leaves the server
 */
export async function POST(request: NextRequest) {
  try {
    // Verify bot secret
    const authHeader = request.headers.get("Authorization");
    if (!BOT_API_SECRET || authHeader !== `Bearer ${BOT_API_SECRET}`) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { discordId } = await request.json();

    if (!discordId) {
      return NextResponse.json({ error: "Discord ID required" }, { status: 400 });
    }

    // Find user with this Discord ID
    const connection = await db.query.discordConnections.findFirst({
      where: eq(discordConnections.discordId, discordId),
    });

    if (!connection) {
      // User not linked to Amazing App
      return NextResponse.json({ success: true, linked: false });
    }

    // Check if they were marked as joined
    if (!connection.hasJoinedServer) {
      // Wasn't marked as joined, nothing to do
      return NextResponse.json({ success: true, wasNotJoined: true });
    }

    // Deduct points for leaving
    await awardPoints(
      connection.userId,
      "discord_leave_server",
      undefined,
      discordId,
      "Left Amazing App Discord server (bot detected)"
    );

    // Update connection
    await db
      .update(discordConnections)
      .set({
        hasJoinedServer: false,
        serverLastVerified: new Date(),
        updatedAt: new Date(),
      })
      .where(eq(discordConnections.discordId, discordId));

    console.log(`⚠️ Deducted points from user for Discord leave: ${connection.userId}`);

    return NextResponse.json({ success: true, pointsDeducted: true });
  } catch (error) {
    console.error("Discord member-left webhook error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
