import { NextResponse } from "next/server";
import { db } from "@/db";
import { sql } from "drizzle-orm";
import { requireAdmin } from "@/lib/admin";

// Environment variable configuration
const ENV_CONFIG = {
  core: [
    { key: "DATABASE_URL", label: "Database URL", required: true },
    { key: "BETTER_AUTH_SECRET", label: "Auth Secret", required: true },
    { key: "BETTER_AUTH_URL", label: "Auth URL", required: true },
    { key: "NEXT_PUBLIC_APP_URL", label: "Public App URL", required: true },
  ],
  oauth: [
    { key: "GOOGLE_CLIENT_ID", label: "Google Client ID", required: true },
    { key: "GOOGLE_CLIENT_SECRET", label: "Google Client Secret", required: true },
    { key: "GITHUB_CLIENT_ID", label: "GitHub Client ID", required: true },
    { key: "GITHUB_CLIENT_SECRET", label: "GitHub Client Secret", required: true },
  ],
  email: [
    { key: "RESEND_API_KEY", label: "Resend API Key", required: true },
    { key: "FROM_EMAIL", label: "From Email", required: false },
  ],
  twitter: [
    { key: "TWITTER_CLIENT_ID", label: "Twitter Client ID", required: false },
    { key: "TWITTER_CLIENT_SECRET", label: "Twitter Client Secret", required: false },
    { key: "TWITTER_ID_VIBEMODEAI", label: "Twitter ID @vibemodeai", required: false },
    { key: "TWITTER_ID_THISCOMPANY", label: "Twitter ID @thiscompany", required: false },
    { key: "TWITTER_ID_PRODUCTGREMLIN", label: "Twitter ID @productgremlin", required: false },
  ],
  discord: [
    { key: "DISCORD_CLIENT_ID", label: "Discord Client ID", required: false },
    { key: "DISCORD_CLIENT_SECRET", label: "Discord Client Secret", required: false },
    { key: "DISCORD_GUILD_ID", label: "Discord Guild ID", required: false },
    { key: "DISCORD_BOT_TOKEN", label: "Discord Bot Token", required: false },
    { key: "BOT_API_SECRET", label: "Bot API Secret", required: false },
    { key: "DISCORD_INVITE_URL", label: "Discord Invite URL", required: false },
  ],
  infrastructure: [
    { key: "REDIS_URL", label: "Redis URL", required: false },
    { key: "ENCRYPTION_KEY", label: "Encryption Key", required: false },
    { key: "VIBEMODE_API_URL", label: "Amazing App API URL", required: false },
  ],
};

async function checkDatabaseHealth(): Promise<{ status: "healthy" | "unhealthy"; latency?: number; error?: string }> {
  try {
    const start = Date.now();
    await db.execute(sql`SELECT 1`);
    const latency = Date.now() - start;
    return { status: "healthy", latency };
  } catch (error) {
    return { status: "unhealthy", error: error instanceof Error ? error.message : "Unknown error" };
  }
}

async function checkRedisHealth(): Promise<{ status: "healthy" | "unhealthy" | "not_configured"; latency?: number; error?: string }> {
  const redisUrl = process.env.REDIS_URL;
  if (!redisUrl) {
    return { status: "not_configured" };
  }

  try {
    // Dynamic import to avoid issues if redis is not configured
    const { default: Redis } = await import("ioredis");
    const redis = new Redis(redisUrl, {
      maxRetriesPerRequest: 1,
      connectTimeout: 5000,
      lazyConnect: true,
    });

    const start = Date.now();
    await redis.ping();
    const latency = Date.now() - start;
    await redis.quit();

    return { status: "healthy", latency };
  } catch (error) {
    return { status: "unhealthy", error: error instanceof Error ? error.message : "Unknown error" };
  }
}

function checkEnvironmentVariables() {
  const results: Record<string, Array<{ key: string; label: string; required: boolean; set: boolean }>> = {};

  for (const [category, vars] of Object.entries(ENV_CONFIG)) {
    results[category] = vars.map((v) => ({
      ...v,
      set: !!process.env[v.key] && process.env[v.key]!.length > 0,
    }));
  }

  return results;
}

export async function GET() {
  const admin = await requireAdmin();
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const [dbHealth, redisHealth] = await Promise.all([
      checkDatabaseHealth(),
      checkRedisHealth(),
    ]);

    const envVars = checkEnvironmentVariables();

    // Calculate summary
    const allVars = Object.values(envVars).flat();
    const requiredVars = allVars.filter((v) => v.required);
    const requiredSet = requiredVars.filter((v) => v.set).length;
    const optionalVars = allVars.filter((v) => !v.required);
    const optionalSet = optionalVars.filter((v) => v.set).length;

    return NextResponse.json({
      database: dbHealth,
      redis: redisHealth,
      environment: envVars,
      summary: {
        requiredSet,
        requiredTotal: requiredVars.length,
        optionalSet,
        optionalTotal: optionalVars.length,
        allRequiredSet: requiredSet === requiredVars.length,
      },
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Health check error:", error);
    return NextResponse.json(
      { error: "Failed to check system health" },
      { status: 500 }
    );
  }
}
