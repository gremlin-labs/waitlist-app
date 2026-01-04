import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { db } from "@/db";
import { discordConnections } from "@/db/schema";
import { eq } from "drizzle-orm";
import { encrypt, decrypt } from "@/lib/crypto";
import { awardPoints } from "@/lib/points";
import {
  checkDiscordServerMembership,
  refreshDiscordToken,
  getDiscordAvatarUrl,
  getDiscordInviteUrl,
} from "@/lib/discord";

/**
 * POST /api/social/discord/refresh
 * Re-checks Discord server membership and awards/deducts points accordingly
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

    // Decrypt access token
    let accessToken = decrypt(connection.accessToken);

    // Check if token needs refresh
    if (connection.tokenExpiresAt && connection.tokenExpiresAt < new Date()) {
      try {
        const newTokens = await refreshDiscordToken(
          decrypt(connection.refreshToken)
        );
        accessToken = newTokens.access_token;

        // Update stored tokens
        await db
          .update(discordConnections)
          .set({
            accessToken: encrypt(newTokens.access_token),
            refreshToken: encrypt(newTokens.refresh_token),
            tokenExpiresAt: newTokens.expires_in
              ? new Date(Date.now() + newTokens.expires_in * 1000)
              : null,
            updatedAt: new Date(),
          })
          .where(eq(discordConnections.userId, session.user.id));
      } catch (refreshError) {
        console.error("Token refresh failed:", refreshError);
        return NextResponse.json(
          { error: "Failed to refresh token, please reconnect" },
          { status: 401 }
        );
      }
    }

    // Check current server membership
    const hasJoinedServer = await checkDiscordServerMembership(accessToken);

    // Award or revoke points based on changes
    const changes: string[] = [];

    if (hasJoinedServer && !connection.hasJoinedServer) {
      await awardPoints(
        session.user.id,
        "discord_join_server",
        undefined,
        "vibemode",
        "Joined Vibe Mode Discord server"
      );
      changes.push("joined server");
    } else if (!hasJoinedServer && connection.hasJoinedServer) {
      await awardPoints(
        session.user.id,
        "discord_leave_server",
        undefined,
        "vibemode",
        "Left Vibe Mode Discord server"
      );
      changes.push("left server");
    }

    // Update connection with new membership status
    await db
      .update(discordConnections)
      .set({
        hasJoinedServer,
        serverJoinedAt:
          hasJoinedServer && !connection.serverJoinedAt
            ? new Date()
            : connection.serverJoinedAt,
        serverLastVerified: new Date(),
        updatedAt: new Date(),
      })
      .where(eq(discordConnections.userId, session.user.id));

    return NextResponse.json({
      hasJoinedServer,
      changes,
      lastChecked: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Discord refresh error:", error);
    return NextResponse.json(
      { error: "Failed to refresh Discord status" },
      { status: 500 }
    );
  }
}

/**
 * GET /api/social/discord/refresh
 * Returns current Discord connection status
 */
export async function GET() {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const connection = await db.query.discordConnections.findFirst({
      where: eq(discordConnections.userId, session.user.id),
      columns: {
        discordId: true,
        discordUsername: true,
        discordDiscriminator: true,
        discordAvatarHash: true,
        hasJoinedServer: true,
        serverJoinedAt: true,
        serverLastVerified: true,
        connectedAt: true,
      },
    });

    if (!connection) {
      return NextResponse.json({
        connected: false,
        inviteUrl: getDiscordInviteUrl(),
      });
    }

    return NextResponse.json({
      connected: true,
      username: connection.discordUsername,
      discriminator: connection.discordDiscriminator,
      avatarUrl: getDiscordAvatarUrl(
        connection.discordId,
        connection.discordAvatarHash
      ),
      hasJoinedServer: connection.hasJoinedServer,
      serverJoinedAt: connection.serverJoinedAt,
      lastChecked: connection.serverLastVerified,
      connectedAt: connection.connectedAt,
      inviteUrl: getDiscordInviteUrl(),
    });
  } catch (error) {
    console.error("Discord status error:", error);
    return NextResponse.json(
      { error: "Failed to get Discord status" },
      { status: 500 }
    );
  }
}
