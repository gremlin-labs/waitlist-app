import crypto from "crypto";

/**
 * Twitter OAuth 2.0 Configuration
 */
const TWITTER_ACCOUNTS = {
  vibemodeai: process.env.TWITTER_ID_VIBEMODEAI || "",
  gremlinlabs: process.env.TWITTER_ID_GREMLINLABS || "",
  productgremlin: process.env.TWITTER_ID_PRODUCTGREMLIN || "",
} as const;

const TWITTER_API_BASE = "https://api.twitter.com/2";
const TWITTER_AUTH_BASE = "https://twitter.com/i/oauth2";

/**
 * Generate a random state for OAuth
 */
export function generateOAuthState(): string {
  return crypto.randomBytes(32).toString("hex");
}

/**
 * Generate PKCE code verifier (43-128 chars, URL-safe)
 */
export function generateCodeVerifier(): string {
  return crypto.randomBytes(32).toString("base64url");
}

/**
 * Generate PKCE code challenge from verifier
 */
export async function generateCodeChallenge(verifier: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(verifier);
  const digest = await crypto.subtle.digest("SHA-256", data);
  return Buffer.from(digest).toString("base64url");
}

/**
 * Build Twitter OAuth 2.0 authorization URL
 */
export function buildTwitterAuthUrl(
  state: string,
  codeChallenge: string,
  redirectUri: string
): string {
  const url = new URL(`${TWITTER_AUTH_BASE}/authorize`);
  url.searchParams.set("response_type", "code");
  url.searchParams.set("client_id", process.env.TWITTER_CLIENT_ID!);
  url.searchParams.set("redirect_uri", redirectUri);
  url.searchParams.set("scope", "tweet.read users.read follows.read offline.access");
  url.searchParams.set("state", state);
  url.searchParams.set("code_challenge", codeChallenge);
  url.searchParams.set("code_challenge_method", "S256");
  return url.toString();
}

interface TwitterTokenResponse {
  access_token: string;
  refresh_token?: string;
  expires_in: number;
  token_type: string;
  scope: string;
}

/**
 * Exchange authorization code for tokens
 */
export async function exchangeTwitterCode(
  code: string,
  codeVerifier: string,
  redirectUri: string
): Promise<TwitterTokenResponse> {
  const credentials = Buffer.from(
    `${process.env.TWITTER_CLIENT_ID}:${process.env.TWITTER_CLIENT_SECRET}`
  ).toString("base64");

  const response = await fetch(`${TWITTER_AUTH_BASE}/token`, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization: `Basic ${credentials}`,
    },
    body: new URLSearchParams({
      grant_type: "authorization_code",
      code,
      redirect_uri: redirectUri,
      code_verifier: codeVerifier,
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Twitter token exchange failed: ${error}`);
  }

  return response.json();
}

/**
 * Refresh an expired access token
 */
export async function refreshTwitterToken(
  refreshToken: string
): Promise<TwitterTokenResponse> {
  const credentials = Buffer.from(
    `${process.env.TWITTER_CLIENT_ID}:${process.env.TWITTER_CLIENT_SECRET}`
  ).toString("base64");

  const response = await fetch(`${TWITTER_AUTH_BASE}/token`, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization: `Basic ${credentials}`,
    },
    body: new URLSearchParams({
      grant_type: "refresh_token",
      refresh_token: refreshToken,
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Twitter token refresh failed: ${error}`);
  }

  return response.json();
}

interface TwitterUser {
  id: string;
  name: string;
  username: string;
  profile_image_url?: string;
}

/**
 * Get authenticated user's profile
 */
export async function getTwitterUser(accessToken: string): Promise<TwitterUser> {
  const response = await fetch(`${TWITTER_API_BASE}/users/me?user.fields=profile_image_url`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Failed to get Twitter user: ${error}`);
  }

  const data = await response.json();
  return data.data;
}

interface FollowStatus {
  vibemodeai: boolean;
  gremlinlabs: boolean;
  productgremlin: boolean;
}

/**
 * Check if user follows our Twitter accounts
 * Uses the /users/:id/following endpoint with pagination
 */
export async function checkTwitterFollows(
  accessToken: string,
  userId: string
): Promise<FollowStatus> {
  const results: FollowStatus = {
    vibemodeai: false,
    gremlinlabs: false,
    productgremlin: false,
  };

  // Collect all following IDs (may need pagination for users following many accounts)
  const followingIds: string[] = [];
  let paginationToken: string | undefined;

  do {
    const url = new URL(`${TWITTER_API_BASE}/users/${userId}/following`);
    url.searchParams.set("max_results", "1000");
    url.searchParams.set("user.fields", "id");
    if (paginationToken) {
      url.searchParams.set("pagination_token", paginationToken);
    }

    const response = await fetch(url.toString(), {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!response.ok) {
      // If we get a 401, token may be expired
      if (response.status === 401) {
        throw new Error("Twitter token expired");
      }
      const error = await response.text();
      throw new Error(`Failed to check Twitter follows: ${error}`);
    }

    const data = await response.json();
    
    if (data.data) {
      for (const user of data.data) {
        followingIds.push(user.id);
      }
    }

    paginationToken = data.meta?.next_token;
  } while (paginationToken);

  // Check if our accounts are in the following list
  for (const [account, targetId] of Object.entries(TWITTER_ACCOUNTS)) {
    if (targetId && followingIds.includes(targetId)) {
      results[account as keyof FollowStatus] = true;
    }
  }

  return results;
}

/**
 * Revoke Twitter access token
 */
export async function revokeTwitterToken(accessToken: string): Promise<void> {
  const credentials = Buffer.from(
    `${process.env.TWITTER_CLIENT_ID}:${process.env.TWITTER_CLIENT_SECRET}`
  ).toString("base64");

  await fetch(`${TWITTER_AUTH_BASE}/revoke`, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization: `Basic ${credentials}`,
    },
    body: new URLSearchParams({
      token: accessToken,
    }),
  });
}
