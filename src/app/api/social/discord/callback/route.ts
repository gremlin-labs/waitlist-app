import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { db } from "@/db";
import { discordConnections } from "@/db/schema";
import { eq } from "drizzle-orm";
import { encrypt } from "@/lib/crypto";
import { awardPoints } from "@/lib/points";
import {
  exchangeDiscordCode,
  getDiscordUser,
  checkDiscordServerMembership,
} from "@/lib/discord";

const REDIRECT_URI = `${process.env.NEXT_PUBLIC_APP_URL}/api/social/discord/callback`;

/**
 * GET /api/social/discord/callback
 * Handles Discord OAuth 2.0 callback
 */
export async function GET(request: NextRequest) {
  const cookieStore = await cookies();

  try {
    // Verify user is authenticated
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user) {
      return NextResponse.redirect(
        `${process.env.NEXT_PUBLIC_APP_URL}/auth/signin`
      );
    }

    const url = new URL(request.url);
    const code = url.searchParams.get("code");
    const state = url.searchParams.get("state");
    const error = url.searchParams.get("error");

    // Handle OAuth errors
    if (error) {
      console.error("Discord OAuth error:", error);
      return NextResponse.redirect(
        `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?error=discord_denied`
      );
    }

    if (!code || !state) {
      return NextResponse.redirect(
        `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?error=discord_invalid_response`
      );
    }

    // Verify state matches
    const storedState = cookieStore.get("discord_oauth_state")?.value;
    if (state !== storedState) {
      return NextResponse.redirect(
        `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?error=discord_invalid_state`
      );
    }

    // Exchange code for tokens
    const tokens = await exchangeDiscordCode(code, REDIRECT_URI);

    // Get Discord user info
    const discordUser = await getDiscordUser(tokens.access_token);

    // Check server membership
    const hasJoinedServer = await checkDiscordServerMembership(tokens.access_token);

    // Check if this Discord account is already connected to another user
    const existingConnection = await db.query.discordConnections.findFirst({
      where: eq(discordConnections.discordId, discordUser.id),
    });

    if (existingConnection && existingConnection.userId !== session.user.id) {
      return NextResponse.redirect(
        `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?error=discord_already_linked`
      );
    }

    // Check if user already has a Discord connection
    const userConnection = await db.query.discordConnections.findFirst({
      where: eq(discordConnections.userId, session.user.id),
    });

    const tokenExpiry = tokens.expires_in
      ? new Date(Date.now() + tokens.expires_in * 1000)
      : null;

    if (userConnection) {
      // Update existing connection
      await db
        .update(discordConnections)
        .set({
          discordId: discordUser.id,
          discordUsername: discordUser.username,
          discordDiscriminator: discordUser.discriminator,
          discordAvatarHash: discordUser.avatar || null,
          accessToken: encrypt(tokens.access_token),
          refreshToken: encrypt(tokens.refresh_token),
          tokenExpiresAt: tokenExpiry,
          hasJoinedServer,
          serverJoinedAt: hasJoinedServer && !userConnection.serverJoinedAt ? new Date() : userConnection.serverJoinedAt,
          serverLastVerified: new Date(),
          updatedAt: new Date(),
        })
        .where(eq(discordConnections.userId, session.user.id));
    } else {
      // Create new connection
      await db.insert(discordConnections).values({
        userId: session.user.id,
        discordId: discordUser.id,
        discordUsername: discordUser.username,
        discordDiscriminator: discordUser.discriminator,
        discordAvatarHash: discordUser.avatar || null,
        accessToken: encrypt(tokens.access_token),
        refreshToken: encrypt(tokens.refresh_token),
        tokenExpiresAt: tokenExpiry,
        hasJoinedServer,
        serverJoinedAt: hasJoinedServer ? new Date() : null,
        serverLastVerified: new Date(),
      });

      // Award points for connecting Discord (only first time)
      await awardPoints(
        session.user.id,
        "discord_connect",
        undefined,
        discordUser.username,
        "Connected Discord account"
      );
    }

    // Award points for joining server (if not already awarded)
    if (hasJoinedServer && !userConnection?.hasJoinedServer) {
      await awardPoints(
        session.user.id,
        "discord_join_server",
        undefined,
        "vibemode",
        "Joined Vibe Mode Discord server"
      );
    }

    // Clear OAuth cookie
    cookieStore.delete("discord_oauth_state");

    return NextResponse.redirect(
      `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?success=discord_connected`
    );
  } catch (error) {
    console.error("Discord callback error:", error);

    // Clear OAuth cookie on error
    cookieStore.delete("discord_oauth_state");

    return NextResponse.redirect(
      `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?error=discord_callback_failed`
    );
  }
}
