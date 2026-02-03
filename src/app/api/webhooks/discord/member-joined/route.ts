import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { discordConnections } from "@/db/schema";
import { eq } from "drizzle-orm";
import { awardPoints } from "@/lib/points";

const BOT_API_SECRET = process.env.BOT_API_SECRET;

/**
 * POST /api/webhooks/discord/member-joined
 * Called by Discord bot when a user joins the server
 */
export async function POST(request: NextRequest) {
  try {
    // Verify bot secret
    const authHeader = request.headers.get("Authorization");
    if (!BOT_API_SECRET || authHeader !== `Bearer ${BOT_API_SECRET}`) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { discordId, discordUsername, joinedAt } = await request.json();

    if (!discordId) {
      return NextResponse.json({ error: "Discord ID required" }, { status: 400 });
    }

    // Find user with this Discord ID
    const connection = await db.query.discordConnections.findFirst({
      where: eq(discordConnections.discordId, discordId),
    });

    if (!connection) {
      // User not linked to Amazing App yet
      console.log(`Discord user ${discordUsername} (${discordId}) joined but not linked`);
      return NextResponse.json({ success: true, linked: false });
    }

    // Check if they were already marked as joined
    if (connection.hasJoinedServer) {
      // Already joined, no points to award
      return NextResponse.json({ success: true, alreadyJoined: true });
    }

    // Award points for joining
    await awardPoints(
      connection.userId,
      "discord_join_server",
      undefined,
      discordId,
      "Joined Amazing App Discord server (bot detected)"
    );

    // Update connection
    await db
      .update(discordConnections)
      .set({
        hasJoinedServer: true,
        serverJoinedAt: new Date(joinedAt),
        serverLastVerified: new Date(),
        updatedAt: new Date(),
      })
      .where(eq(discordConnections.discordId, discordId));

    console.log(`✅ Awarded points to user for Discord join: ${connection.userId}`);

    return NextResponse.json({ success: true, pointsAwarded: true });
  } catch (error) {
    console.error("Discord member-joined webhook error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
