import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { getUserPoints, getUserRank } from "@/lib/points";
import { db } from "@/db";
import { user, twitterConnections, discordConnections } from "@/db/schema";
import { eq } from "drizzle-orm";

/**
 * GET /api/points
 * Returns the current user's points breakdown, rank, and social connection status
 */
export async function GET() {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get points breakdown
    const points = await getUserPoints(session.user.id);

    // Get rank
    const rank = await getUserRank(session.user.id);

    // Get user's cached data
    const userData = await db.query.user.findFirst({
      where: eq(user.id, session.user.id),
      columns: {
        totalPoints: true,
        waitlistRank: true,
        referralCode: true,
      },
    });

    // Get social connection status
    const twitterConnection = await db.query.twitterConnections.findFirst({
      where: eq(twitterConnections.userId, session.user.id),
      columns: {
        twitterUsername: true,
        followsVibemodeai: true,
        followsGremlinlabs: true,
        followsProductgremlin: true,
      },
    });

    const discordConnection = await db.query.discordConnections.findFirst({
      where: eq(discordConnections.userId, session.user.id),
      columns: {
        discordUsername: true,
        hasJoinedServer: true,
      },
    });

    return NextResponse.json({
      points: {
        total: points.total,
        breakdown: points.breakdown,
      },
      rank: rank ?? userData?.waitlistRank ?? null,
      referralCode: userData?.referralCode,
      social: {
        twitter: twitterConnection
          ? {
              connected: true,
              username: twitterConnection.twitterUsername,
              follows: {
                vibemodeai: twitterConnection.followsVibemodeai,
                gremlinlabs: twitterConnection.followsGremlinlabs,
                productgremlin: twitterConnection.followsProductgremlin,
              },
            }
          : { connected: false },
        discord: discordConnection
          ? {
              connected: true,
              username: discordConnection.discordUsername,
              hasJoinedServer: discordConnection.hasJoinedServer,
            }
          : { connected: false },
      },
    });
  } catch (error) {
    console.error("Points fetch error:", error);
    return NextResponse.json(
      { error: "Failed to fetch points" },
      { status: 500 }
    );
  }
}
