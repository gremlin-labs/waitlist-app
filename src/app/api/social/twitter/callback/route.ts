import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { db } from "@/db";
import { twitterConnections } from "@/db/schema";
import { eq } from "drizzle-orm";
import { encrypt } from "@/lib/crypto";
import { awardPoints } from "@/lib/points";
import {
  exchangeTwitterCode,
  getTwitterUser,
  checkTwitterFollows,
} from "@/lib/twitter";

const REDIRECT_URI = `${process.env.NEXT_PUBLIC_APP_URL}/api/social/twitter/callback`;

/**
 * GET /api/social/twitter/callback
 * Handles Twitter OAuth 2.0 callback
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
      console.error("Twitter OAuth error:", error);
      return NextResponse.redirect(
        `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?error=twitter_denied`
      );
    }

    if (!code || !state) {
      return NextResponse.redirect(
        `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?error=twitter_invalid_response`
      );
    }

    // Verify state matches
    const storedState = cookieStore.get("twitter_oauth_state")?.value;
    if (state !== storedState) {
      return NextResponse.redirect(
        `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?error=twitter_invalid_state`
      );
    }

    // Get code verifier
    const codeVerifier = cookieStore.get("twitter_code_verifier")?.value;
    if (!codeVerifier) {
      return NextResponse.redirect(
        `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?error=twitter_missing_verifier`
      );
    }

    // Exchange code for tokens
    const tokens = await exchangeTwitterCode(code, codeVerifier, REDIRECT_URI);

    // Get Twitter user info
    const twitterUser = await getTwitterUser(tokens.access_token);

    // Check follow status
    const follows = await checkTwitterFollows(tokens.access_token, twitterUser.id);

    // Check if this Twitter account is already connected to another user
    const existingConnection = await db.query.twitterConnections.findFirst({
      where: eq(twitterConnections.twitterId, twitterUser.id),
    });

    if (existingConnection && existingConnection.userId !== session.user.id) {
      return NextResponse.redirect(
        `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?error=twitter_already_linked`
      );
    }

    // Check if user already has a Twitter connection
    const userConnection = await db.query.twitterConnections.findFirst({
      where: eq(twitterConnections.userId, session.user.id),
    });

    const tokenExpiry = tokens.expires_in
      ? new Date(Date.now() + tokens.expires_in * 1000)
      : null;

    if (userConnection) {
      // Update existing connection
      await db
        .update(twitterConnections)
        .set({
          twitterId: twitterUser.id,
          twitterUsername: twitterUser.username,
          twitterDisplayName: twitterUser.name,
          twitterAvatarUrl: twitterUser.profile_image_url || null,
          accessToken: encrypt(tokens.access_token),
          refreshToken: tokens.refresh_token ? encrypt(tokens.refresh_token) : null,
          tokenExpiresAt: tokenExpiry,
          followsAccount1: follows.followsAccount1,
          followsAccount2: follows.followsAccount2,
          followsProductgremlin: follows.followsProductgremlin,
          followsLastChecked: new Date(),
          updatedAt: new Date(),
        })
        .where(eq(twitterConnections.userId, session.user.id));
    } else {
      // Create new connection
      await db.insert(twitterConnections).values({
        userId: session.user.id,
        twitterId: twitterUser.id,
        twitterUsername: twitterUser.username,
        twitterDisplayName: twitterUser.name,
        twitterAvatarUrl: twitterUser.profile_image_url || null,
        accessToken: encrypt(tokens.access_token),
        refreshToken: tokens.refresh_token ? encrypt(tokens.refresh_token) : null,
        tokenExpiresAt: tokenExpiry,
        followsAccount1: follows.followsAccount1,
        followsAccount2: follows.followsAccount2,
        followsProductgremlin: follows.followsProductgremlin,
        followsLastChecked: new Date(),
      });

      // Award points for connecting Twitter (only first time)
      await awardPoints(
        session.user.id,
        "twitter_connect",
        undefined,
        twitterUser.username,
        "Connected Twitter account"
      );
    }

    // Award points for follows (check if not already awarded)
    if (follows.followsAccount1) {
      await awardPoints(
        session.user.id,
        "twitter_follow_account1",
        undefined,
        "@vibemodeai"
      );
    }
    if (follows.followsAccount2) {
      await awardPoints(
        session.user.id,
        "twitter_follow_account2",
        undefined,
        "@thiscompany"
      );
    }
    if (follows.followsProductgremlin) {
      await awardPoints(
        session.user.id,
        "twitter_follow_account3",
        undefined,
        "@productgremlin"
      );
    }

    // Clear OAuth cookies
    cookieStore.delete("twitter_oauth_state");
    cookieStore.delete("twitter_code_verifier");

    return NextResponse.redirect(
      `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?success=twitter_connected`
    );
  } catch (error) {
    console.error("Twitter callback error:", error);

    // Clear OAuth cookies on error
    cookieStore.delete("twitter_oauth_state");
    cookieStore.delete("twitter_code_verifier");

    return NextResponse.redirect(
      `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?error=twitter_callback_failed`
    );
  }
}
