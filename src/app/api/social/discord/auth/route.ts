import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { generateOAuthState, buildDiscordAuthUrl } from "@/lib/discord";

const REDIRECT_URI = `${process.env.NEXT_PUBLIC_APP_URL}/api/social/discord/callback`;

/**
 * GET /api/social/discord/auth
 * Initiates Discord OAuth 2.0 flow
 */
export async function GET() {
  try {
    // Verify user is authenticated
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user) {
      return NextResponse.redirect(
        `${process.env.NEXT_PUBLIC_APP_URL}/auth/signin?callbackUrl=/dashboard`
      );
    }

    // Generate OAuth state
    const state = generateOAuthState();

    // Store in secure cookie (will be verified in callback)
    const cookieStore = await cookies();

    cookieStore.set("discord_oauth_state", state, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 10, // 10 minutes
      path: "/",
    });

    // Build and redirect to Discord auth URL
    const authUrl = buildDiscordAuthUrl(state, REDIRECT_URI);

    return NextResponse.redirect(authUrl);
  } catch (error) {
    console.error("Discord auth initiation error:", error);
    return NextResponse.redirect(
      `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?error=discord_auth_failed`
    );
  }
}
