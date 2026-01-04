/**
 * Database Clean Script
 * Wipes all data from the database while preserving schema
 * Usage: bun db:clean
 */

import "dotenv/config";
import postgres from "postgres";

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  console.error("❌ DATABASE_URL environment variable is required");
  process.exit(1);
}

const sql = postgres(connectionString);

async function cleanDatabase() {
  console.log("🧹 Cleaning database...\n");

  // Tables in order that respects foreign key constraints
  // (delete from dependent tables first)
  const tables = [
    "session",
    "account", 
    "verification",
    "app_token",
    "survey_response",
    "point_transaction",
    "twitter_connections",
    "discord_connections",
    "discord_guild_memberships",
    "discord_guild_stats",
    "referral",
    "event",
    "job_application",
    "user",
  ];

  for (const table of tables) {
    try {
      const result = await sql`TRUNCATE TABLE ${sql(table)} CASCADE`;
      console.log(`  ✓ Truncated ${table}`);
    } catch (error: unknown) {
      const err = error as { code?: string; message?: string };
      // Table might not exist, that's okay
      if (err.code === "42P01") {
        console.log(`  ⏭ Skipped ${table} (table doesn't exist)`);
      } else {
        console.error(`  ✗ Error truncating ${table}:`, err.message);
      }
    }
  }

  console.log("\n✅ Database cleaned successfully!");
  
  await sql.end();
  process.exit(0);
}

// Confirmation prompt for safety
const args = process.argv.slice(2);
const force = args.includes("--force") || args.includes("-f");

if (!force) {
  console.log("⚠️  WARNING: This will delete ALL data from the database!");
  console.log("   Run with --force or -f to confirm.\n");
  console.log("   Example: bun db:clean --force\n");
  process.exit(1);
}

cleanDatabase().catch((err) => {
  console.error("❌ Failed to clean database:", err);
  process.exit(1);
});
