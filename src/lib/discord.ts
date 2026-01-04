import crypto from "crypto";

/**
 * Discord OAuth 2.0 Configuration
 */
const DISCORD_API_BASE = "https://discord.com/api/v10";
const DISCORD_AUTH_BASE = "https://discord.com/api/oauth2";

// Your Discord server ID
const DISCORD_GUILD_ID = process.env.DISCORD_GUILD_ID || "";

/**
 * Generate a random state for OAuth
 */
export function generateOAuthState(): string {
  return crypto.randomBytes(32).toString("hex");
}

/**
 * Build Discord OAuth 2.0 authorization URL
 */
export function buildDiscordAuthUrl(state: string, redirectUri: string): string {
  const url = new URL(`${DISCORD_AUTH_BASE}/authorize`);
  url.searchParams.set("client_id", process.env.DISCORD_CLIENT_ID!);
  url.searchParams.set("redirect_uri", redirectUri);
  url.searchParams.set("response_type", "code");
  url.searchParams.set("scope", "identify guilds");
  url.searchParams.set("state", state);
  return url.toString();
}

interface DiscordTokenResponse {
  access_token: string;
  refresh_token: string;
  expires_in: number;
  token_type: string;
  scope: string;
}

/**
 * Exchange authorization code for tokens
 */
export async function exchangeDiscordCode(
  code: string,
  redirectUri: string
): Promise<DiscordTokenResponse> {
  const response = await fetch(`${DISCORD_AUTH_BASE}/token`, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      client_id: process.env.DISCORD_CLIENT_ID!,
      client_secret: process.env.DISCORD_CLIENT_SECRET!,
      grant_type: "authorization_code",
      code,
      redirect_uri: redirectUri,
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Discord token exchange failed: ${error}`);
  }

  return response.json();
}

/**
 * Refresh an expired access token
 */
export async function refreshDiscordToken(
  refreshToken: string
): Promise<DiscordTokenResponse> {
  const response = await fetch(`${DISCORD_AUTH_BASE}/token`, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      client_id: process.env.DISCORD_CLIENT_ID!,
      client_secret: process.env.DISCORD_CLIENT_SECRET!,
      grant_type: "refresh_token",
      refresh_token: refreshToken,
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Discord token refresh failed: ${error}`);
  }

  return response.json();
}

interface DiscordUser {
  id: string;
  username: string;
  discriminator: string;
  global_name?: string;
  avatar?: string;
}

/**
 * Get authenticated user's profile
 */
export async function getDiscordUser(accessToken: string): Promise<DiscordUser> {
  const response = await fetch(`${DISCORD_API_BASE}/users/@me`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Failed to get Discord user: ${error}`);
  }

  return response.json();
}

interface DiscordGuild {
  id: string;
  name: string;
  icon?: string;
  owner: boolean;
  permissions: string;
}

/**
 * Get user's guild (server) list
 */
export async function getDiscordGuilds(accessToken: string): Promise<DiscordGuild[]> {
  const response = await fetch(`${DISCORD_API_BASE}/users/@me/guilds`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Failed to get Discord guilds: ${error}`);
  }

  return response.json();
}

/**
 * Check if user has joined our Discord server
 */
export async function checkDiscordServerMembership(
  accessToken: string
): Promise<boolean> {
  if (!DISCORD_GUILD_ID) {
    console.warn("DISCORD_GUILD_ID not configured");
    return false;
  }

  const guilds = await getDiscordGuilds(accessToken);
  return guilds.some((guild) => guild.id === DISCORD_GUILD_ID);
}

/**
 * Get Discord avatar URL
 */
export function getDiscordAvatarUrl(
  userId: string,
  avatarHash: string | null | undefined,
  size = 128
): string {
  if (avatarHash) {
    const ext = avatarHash.startsWith("a_") ? "gif" : "png";
    return `https://cdn.discordapp.com/avatars/${userId}/${avatarHash}.${ext}?size=${size}`;
  }
  // Default avatar based on discriminator (legacy) or user ID
  const defaultIndex = Number(BigInt(userId) >> BigInt(22)) % 6;
  return `https://cdn.discordapp.com/embed/avatars/${defaultIndex}.png`;
}

/**
 * Revoke Discord access token
 */
export async function revokeDiscordToken(accessToken: string): Promise<void> {
  await fetch(`${DISCORD_AUTH_BASE}/token/revoke`, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      client_id: process.env.DISCORD_CLIENT_ID!,
      client_secret: process.env.DISCORD_CLIENT_SECRET!,
      token: accessToken,
    }),
  });
}

/**
 * Get the Discord server invite URL
 */
export function getDiscordInviteUrl(): string {
  return process.env.DISCORD_INVITE_URL || "https://discord.gg/gremlinlabs";
}
