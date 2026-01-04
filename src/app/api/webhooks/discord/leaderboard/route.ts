import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { user } from "@/db/schema";
import { eq, desc, asc } from "drizzle-orm";

const BOT_API_SECRET = process.env.BOT_API_SECRET;

/**
 * GET /api/webhooks/discord/leaderboard
 * Called by Discord bot to get the top 10 waitlist users
 */
export async function GET(request: NextRequest) {
  try {
    // Verify bot secret
    const authHeader = request.headers.get("Authorization");
    if (!BOT_API_SECRET || authHeader !== `Bearer ${BOT_API_SECRET}`) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get top 10 waitlist users by points
    const top10 = await db.query.user.findMany({
      where: eq(user.betaStatus, "waitlist"),
      orderBy: [desc(user.totalPoints), asc(user.createdAt)],
      limit: 10,
      columns: {
        id: true,
        name: true,
        totalPoints: true,
        waitlistRank: true,
      },
    });

    return NextResponse.json({
      top10: top10.map((u, index) => ({
        rank: index + 1,
        name: u.name || "Anonymous",
        totalPoints: u.totalPoints ?? 0,
      })),
    });
  } catch (error) {
    console.error("Discord leaderboard webhook error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
