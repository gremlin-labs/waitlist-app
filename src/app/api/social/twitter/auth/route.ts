import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import {
  generateOAuthState,
  generateCodeVerifier,
  generateCodeChallenge,
  buildTwitterAuthUrl,
} from "@/lib/twitter";

const REDIRECT_URI = `${process.env.NEXT_PUBLIC_APP_URL}/api/social/twitter/callback`;

/**
 * GET /api/social/twitter/auth
 * Initiates Twitter OAuth 2.0 flow with PKCE
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

    // Generate OAuth state and PKCE values
    const state = generateOAuthState();
    const codeVerifier = generateCodeVerifier();
    const codeChallenge = await generateCodeChallenge(codeVerifier);

    // Store in secure cookies (will be verified in callback)
    const cookieStore = await cookies();
    
    cookieStore.set("twitter_oauth_state", state, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 10, // 10 minutes
      path: "/",
    });

    cookieStore.set("twitter_code_verifier", codeVerifier, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 10, // 10 minutes
      path: "/",
    });

    // Build and redirect to Twitter auth URL
    const authUrl = buildTwitterAuthUrl(state, codeChallenge, REDIRECT_URI);
    
    return NextResponse.redirect(authUrl);
  } catch (error) {
    console.error("Twitter auth initiation error:", error);
    return NextResponse.redirect(
      `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?error=twitter_auth_failed`
    );
  }
}
