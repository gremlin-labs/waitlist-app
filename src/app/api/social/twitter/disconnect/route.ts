import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { db } from "@/db";
import { twitterConnections, pointsLedger } from "@/db/schema";
import { eq, and, like } from "drizzle-orm";
import { decrypt } from "@/lib/crypto";
import { revokeTwitterToken } from "@/lib/twitter";

/**
 * POST /api/social/twitter/disconnect
 * Disconnects Twitter account and revokes all Twitter-related points
 */
export async function POST() {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get user's Twitter connection
    const connection = await db.query.twitterConnections.findFirst({
      where: eq(twitterConnections.userId, session.user.id),
    });

    if (!connection) {
      return NextResponse.json(
        { error: "Twitter not connected" },
        { status: 400 }
      );
    }

    // Try to revoke token on Twitter's end (best effort)
    try {
      await revokeTwitterToken(decrypt(connection.accessToken));
    } catch (error) {
      // Log but don't fail if revocation fails
      console.warn("Failed to revoke Twitter token:", error);
    }

    // Delete the connection
    await db
      .delete(twitterConnections)
      .where(eq(twitterConnections.userId, session.user.id));

    // Note: We don't revoke points - they're part of the audit trail
    // The user earned them fairly at the time, and the ledger is immutable
    // If you want to revoke points on disconnect, uncomment below:
    
    // // Calculate total Twitter points to revoke
    // const twitterPoints = await db
    //   .select({ total: sql<number>`COALESCE(SUM(${pointsLedger.points}), 0)` })
    //   .from(pointsLedger)
    //   .where(and(
    //     eq(pointsLedger.userId, session.user.id),
    //     like(pointsLedger.action, "twitter_%")
    //   ));
    //
    // if (twitterPoints[0]?.total) {
    //   await awardPoints(
    //     session.user.id,
    //     "admin_adjustment",
    //     -twitterPoints[0].total,
    //     "twitter_disconnect",
    //     "Points revoked on Twitter disconnect"
    //   );
    // }

    return NextResponse.json({
      success: true,
      message: "Twitter disconnected successfully",
    });
  } catch (error) {
    console.error("Twitter disconnect error:", error);
    return NextResponse.json(
      { error: "Failed to disconnect Twitter" },
      { status: 500 }
    );
  }
}
