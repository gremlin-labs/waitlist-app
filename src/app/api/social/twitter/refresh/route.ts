import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { db } from "@/db";
import { twitterConnections } from "@/db/schema";
import { eq } from "drizzle-orm";
import { encrypt, decrypt } from "@/lib/crypto";
import { awardPoints } from "@/lib/points";
import { checkTwitterFollows, refreshTwitterToken } from "@/lib/twitter";

/**
 * POST /api/social/twitter/refresh
 * Re-checks Twitter follow status and awards/deducts points accordingly
 */
export async function POST() {
  try {
    // Verify user is authenticated
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

    // Decrypt access token
    let accessToken = decrypt(connection.accessToken);

    // Check if token needs refresh
    if (connection.tokenExpiresAt && connection.tokenExpiresAt < new Date()) {
      if (!connection.refreshToken) {
        return NextResponse.json(
          { error: "Twitter token expired, please reconnect" },
          { status: 401 }
        );
      }

      try {
        const newTokens = await refreshTwitterToken(
          decrypt(connection.refreshToken)
        );
        accessToken = newTokens.access_token;

        // Update stored tokens
        await db
          .update(twitterConnections)
          .set({
            accessToken: encrypt(newTokens.access_token),
            refreshToken: newTokens.refresh_token
              ? encrypt(newTokens.refresh_token)
              : connection.refreshToken,
            tokenExpiresAt: newTokens.expires_in
              ? new Date(Date.now() + newTokens.expires_in * 1000)
              : null,
            updatedAt: new Date(),
          })
          .where(eq(twitterConnections.userId, session.user.id));
      } catch (refreshError) {
        console.error("Token refresh failed:", refreshError);
        return NextResponse.json(
          { error: "Failed to refresh token, please reconnect" },
          { status: 401 }
        );
      }
    }

    // Check current follow status
    const follows = await checkTwitterFollows(accessToken, connection.twitterId);

    // Award or revoke points based on changes
    const changes: string[] = [];

    // @vibemodeai
    if (follows.followsAccount1 && !connection.followsAccount1) {
      await awardPoints(session.user.id, "twitter_follow_account1");
      changes.push("followed @vibemodeai");
    } else if (!follows.followsAccount1 && connection.followsAccount1) {
      await awardPoints(session.user.id, "twitter_unfollow_account1");
      changes.push("unfollowed @vibemodeai");
    }

    // @thiscompany
    if (follows.followsAccount2 && !connection.followsAccount2) {
      await awardPoints(session.user.id, "twitter_follow_account2");
      changes.push("followed @thiscompany");
    } else if (!follows.followsAccount2 && connection.followsAccount2) {
      await awardPoints(session.user.id, "twitter_unfollow_account2");
      changes.push("unfollowed @thiscompany");
    }

    // @productgremlin
    if (follows.followsProductgremlin && !connection.followsProductgremlin) {
      await awardPoints(session.user.id, "twitter_follow_account3");
      changes.push("followed @productgremlin");
    } else if (!follows.followsProductgremlin && connection.followsProductgremlin) {
      await awardPoints(session.user.id, "twitter_unfollow_productgremlin");
      changes.push("unfollowed @productgremlin");
    }

    // Update connection with new follow status
    await db
      .update(twitterConnections)
      .set({
        followsAccount1: follows.followsAccount1,
        followsAccount2: follows.followsAccount2,
        followsProductgremlin: follows.followsProductgremlin,
        followsLastChecked: new Date(),
        updatedAt: new Date(),
      })
      .where(eq(twitterConnections.userId, session.user.id));

    return NextResponse.json({
      follows,
      changes,
      lastChecked: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Twitter refresh error:", error);
    return NextResponse.json(
      { error: "Failed to refresh Twitter status" },
      { status: 500 }
    );
  }
}

/**
 * GET /api/social/twitter/refresh
 * Returns current Twitter connection status
 */
export async function GET() {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const connection = await db.query.twitterConnections.findFirst({
      where: eq(twitterConnections.userId, session.user.id),
      columns: {
        twitterUsername: true,
        twitterDisplayName: true,
        twitterAvatarUrl: true,
        followsAccount1: true,
        followsAccount2: true,
        followsProductgremlin: true,
        followsLastChecked: true,
        connectedAt: true,
      },
    });

    if (!connection) {
      return NextResponse.json({ connected: false });
    }

    return NextResponse.json({
      connected: true,
      username: connection.twitterUsername,
      displayName: connection.twitterDisplayName,
      avatarUrl: connection.twitterAvatarUrl,
      follows: {
        account1: connection.followsAccount1,
        account2: connection.followsAccount2,
        productgremlin: connection.followsProductgremlin,
      },
      lastChecked: connection.followsLastChecked,
      connectedAt: connection.connectedAt,
    });
  } catch (error) {
    console.error("Twitter status error:", error);
    return NextResponse.json(
      { error: "Failed to get Twitter status" },
      { status: 500 }
    );
  }
}
