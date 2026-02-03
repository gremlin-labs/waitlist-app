import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { discordConnections, user, referrals } from "@/db/schema";
import { eq, count } from "drizzle-orm";
import { getUserRank } from "@/lib/points";

const BOT_API_SECRET = process.env.BOT_API_SECRET;

/**
 * POST /api/webhooks/discord/check-link
 * Called by Discord bot to check if a Discord user is linked to Amazing App
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
      return NextResponse.json({ linked: false });
    }

    // Get user data
    const userData = await db.query.user.findFirst({
      where: eq(user.id, connection.userId),
      columns: {
        id: true,
        name: true,
        email: true,
        totalPoints: true,
        waitlistRank: true,
        referralCode: true,
      },
    });

    if (!userData) {
      return NextResponse.json({ linked: false });
    }

    // Get referral count
    const [referralResult] = await db
      .select({ count: count() })
      .from(referrals)
      .where(eq(referrals.referrerId, userData.id));

    // Get accurate rank
    const rank = await getUserRank(userData.id);

    return NextResponse.json({
      linked: true,
      userId: userData.id,
      name: userData.name,
      totalPoints: userData.totalPoints ?? 0,
      rank: rank ?? userData.waitlistRank ?? 0,
      referralCode: userData.referralCode,
      referralCount: referralResult?.count ?? 0,
    });
  } catch (error) {
    console.error("Discord check-link webhook error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
