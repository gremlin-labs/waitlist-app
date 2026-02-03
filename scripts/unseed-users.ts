#!/usr/bin/env bun
/**
 * CLI script to remove seeded demo users from the database
 * Removes users with emails matching demo-*@example.com
 *
 * Usage:
 *   bun run unseed:users           # Remove all demo users (with confirmation)
 *   bun run unseed:users --force   # Remove all demo users (no confirmation)
 *   bun run unseed:users --dry-run # Show what would be deleted without deleting
 */

import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
import * as readline from "readline";

// Resolve path relative to this script file
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const envPath = path.resolve(__dirname, "../.env.local");

dotenv.config({ path: envPath });

// Verify env loaded
if (!process.env.DATABASE_URL) {
  console.error(
    "❌ DATABASE_URL not found. Make sure .env.local exists with DATABASE_URL set."
  );
  process.exit(1);
}

import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { like, count } from "drizzle-orm";
import * as schema from "../src/db/schema";

const client = postgres(process.env.DATABASE_URL!);
const db = drizzle(client, { schema });

// Parse command line arguments
const args = process.argv.slice(2);
const forceFlag = args.includes("--force") || args.includes("-f");
const dryRunFlag = args.includes("--dry-run") || args.includes("-n");

const DEMO_EMAIL_PATTERN = "demo-%@example.com";

async function promptConfirmation(message: string): Promise<boolean> {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  return new Promise((resolve) => {
    rl.question(message, (answer) => {
      rl.close();
      resolve(answer.toLowerCase() === "y" || answer.toLowerCase() === "yes");
    });
  });
}

async function countDemoUsers(): Promise<number> {
  const [result] = await db
    .select({ count: count() })
    .from(schema.user)
    .where(like(schema.user.email, DEMO_EMAIL_PATTERN));

  return result?.count || 0;
}

async function getDemoUserSample(limit = 5) {
  return db.query.user.findMany({
    where: like(schema.user.email, DEMO_EMAIL_PATTERN),
    columns: {
      id: true,
      email: true,
      name: true,
      totalPoints: true,
      createdAt: true,
    },
    limit,
    orderBy: (user, { desc }) => [desc(user.createdAt)],
  });
}

async function removeDemoUsers(): Promise<number> {
  const result = await db
    .delete(schema.user)
    .where(like(schema.user.email, DEMO_EMAIL_PATTERN))
    .returning({ id: schema.user.id });

  return result.length;
}

async function main() {
  console.log("\n😈 Amazing App Demo User Remover\n");

  // Count demo users
  const demoUserCount = await countDemoUsers();

  if (demoUserCount === 0) {
    console.log("ℹ️  No demo users found in the database.\n");
    await client.end();
    process.exit(0);
  }

  console.log(`Found ${demoUserCount} demo users (emails matching ${DEMO_EMAIL_PATTERN})\n`);

  // Show sample
  const sample = await getDemoUserSample();
  console.log("Sample users to be removed:");
  for (const user of sample) {
    console.log(`   • ${user.name || "No name"} <${user.email}> (${user.totalPoints ?? 0} pts)`);
  }
  if (demoUserCount > 5) {
    console.log(`   ... and ${demoUserCount - 5} more\n`);
  } else {
    console.log("");
  }

  // Dry run mode
  if (dryRunFlag) {
    console.log("🔍 Dry run mode - no changes made.\n");
    await client.end();
    process.exit(0);
  }

  // Confirm unless --force
  if (!forceFlag) {
    const confirmed = await promptConfirmation(
      `⚠️  Are you sure you want to delete ${demoUserCount} demo users? (y/N): `
    );

    if (!confirmed) {
      console.log("\n❌ Cancelled.\n");
      await client.end();
      process.exit(0);
    }
  }

  // Delete
  console.log("\nDeleting demo users...");
  const deletedCount = await removeDemoUsers();

  console.log(`\n✅ Successfully removed ${deletedCount} demo users!\n`);

  await client.end();
}

// Show help if requested
if (args.includes("--help") || args.includes("-h")) {
  console.log(`
😈 Amazing App Demo User Remover

Removes seeded demo users (emails matching demo-*@example.com)

Usage:
  bun run unseed:users              Remove all demo users (with confirmation)
  bun run unseed:users --force      Remove without confirmation
  bun run unseed:users --dry-run    Show what would be deleted (no changes)
  bun run unseed:users --help       Show this help message

Options:
  -f, --force      Skip confirmation prompt
  -n, --dry-run    Preview only, don't delete anything
  -h, --help       Show help
  `);
  process.exit(0);
}

main().catch((error) => {
  console.error("\n❌ Error:", error);
  process.exit(1);
});
