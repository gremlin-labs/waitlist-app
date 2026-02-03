#!/usr/bin/env bun
/**
 * CLI script to seed the database with placeholder/demo users
 * Creates realistic-looking users to populate the waitlist
 *
 * Usage:
 *   bun run seed:users 50       # Create 50 demo users
 *   bun run seed:users 100      # Create 100 demo users
 */

import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";
import fs from "fs";

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
import { nanoid } from "nanoid";
import * as schema from "../src/db/schema";

const client = postgres(process.env.DATABASE_URL!);
const db = drizzle(client, { schema });

// Parse command line arguments
const [, , countArg] = process.argv;

// Load name files
const firstNamesPath = path.resolve(__dirname, "../src/names/first-names.csv");
const lastNamesPath = path.resolve(__dirname, "../src/names/last-names.csv");

function loadNames(filePath: string): string[] {
  try {
    const content = fs.readFileSync(filePath, "utf-8");
    return content
      .split("\n")
      .map((name) => name.trim())
      .filter((name) => name.length > 0);
  } catch (error) {
    console.error(`❌ Failed to load names from ${filePath}:`, error);
    process.exit(1);
  }
}

const FIRST_NAMES = loadNames(firstNamesPath);
const LAST_NAMES = loadNames(lastNamesPath);

// Word lists for username generation (same as real users)
const ADJECTIVES = [
  "swift",
  "bright",
  "calm",
  "bold",
  "warm",
  "cool",
  "fresh",
  "wild",
  "quick",
  "smart",
  "happy",
  "lucky",
  "clever",
  "brave",
  "gentle",
  "keen",
  "noble",
  "proud",
  "silent",
  "golden",
  "silver",
  "cosmic",
  "stellar",
  "lunar",
  "neon",
  "cyber",
  "quantum",
  "atomic",
  "mystic",
  "radiant",
];

const NOUNS = [
  "wolf",
  "fox",
  "bear",
  "eagle",
  "hawk",
  "falcon",
  "otter",
  "lynx",
  "river",
  "forest",
  "mountain",
  "ocean",
  "storm",
  "thunder",
  "star",
  "comet",
  "crystal",
  "diamond",
  "phoenix",
  "dragon",
  "tiger",
  "panther",
  "dolphin",
  "raven",
  "viper",
  "nexus",
  "vertex",
  "pulse",
];

const ACTIONS = [
  "running",
  "flying",
  "dancing",
  "coding",
  "building",
  "creating",
  "exploring",
  "racing",
  "climbing",
  "swimming",
  "dreaming",
  "soaring",
  "gliding",
  "blazing",
];

/**
 * Generate a referral code (same format as real users)
 */
function generateReferralCode(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let code = "";
  for (let i = 0; i < 8; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

/**
 * Random element from array
 */
function randomElement<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

/**
 * Generate a random number in range
 */
function randomInRange(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * Generate a unique username
 */
function generateUsername(existingUsernames: Set<string>): string {
  let attempts = 0;
  const maxAttempts = 100;

  while (attempts < maxAttempts) {
    let username: string;
    const pattern = Math.random();

    if (pattern < 0.5) {
      // 50% chance: adjective-noun
      username = `${randomElement(ADJECTIVES)}-${randomElement(NOUNS)}`;
    } else if (pattern < 0.8) {
      // 30% chance: action-adjective-noun
      username = `${randomElement(ACTIONS)}-${randomElement(ADJECTIVES)}-${randomElement(NOUNS)}`;
    } else {
      // 20% chance: adjective-noun-number
      const num = randomInRange(10, 999);
      username = `${randomElement(ADJECTIVES)}-${randomElement(NOUNS)}-${num}`;
    }

    if (!existingUsernames.has(username)) {
      existingUsernames.add(username);
      return username;
    }
    attempts++;
  }

  // Fallback with timestamp
  const timestamp = Date.now().toString(36);
  const fallback = `${randomElement(ADJECTIVES)}-${randomElement(NOUNS)}-${timestamp}`;
  existingUsernames.add(fallback);
  return fallback;
}

/**
 * Generate achievable random points
 * Based on realistic combinations of actions users can take:
 * - twitter_connect: 5
 * - twitter_follow (3 accounts): 30
 * - discord_connect: 5
 * - discord_join_server: 20
 * - survey_completed: 15
 * - referral_clicks: 1-100
 * - referral_signups: 5 each
 *
 * Realistic range: 0-150 points, weighted toward lower values
 */
function generateRandomPoints(): number {
  const roll = Math.random();

  if (roll < 0.15) {
    // 15% chance: brand new users with no engagement
    return 0;
  } else if (roll < 0.4) {
    // 25% chance: minimal engagement (0-25 pts)
    return randomInRange(0, 25);
  } else if (roll < 0.7) {
    // 30% chance: moderate engagement (25-60 pts)
    return randomInRange(25, 60);
  } else if (roll < 0.9) {
    // 20% chance: good engagement (60-100 pts)
    return randomInRange(60, 100);
  } else {
    // 10% chance: power users (100-150 pts)
    return randomInRange(100, 150);
  }
}

/**
 * Generate a random date in the past 1-30 days
 */
function generateRandomCreatedAt(): Date {
  const now = Date.now();
  const daysAgo = randomInRange(1, 30);
  const hoursAgo = randomInRange(0, 23);
  const minutesAgo = randomInRange(0, 59);

  return new Date(
    now -
      daysAgo * 24 * 60 * 60 * 1000 -
      hoursAgo * 60 * 60 * 1000 -
      minutesAgo * 60 * 1000
  );
}

/**
 * Generate a demo user
 */
function generateDemoUser(existingUsernames: Set<string>) {
  const firstName = randomElement(FIRST_NAMES);
  const lastName = randomElement(LAST_NAMES);
  const createdAt = generateRandomCreatedAt();
  const randomSuffix = nanoid(8);

  return {
    id: crypto.randomUUID(),
    name: `${firstName} ${lastName}`,
    email: `demo-${randomSuffix}@example.com`,
    emailVerified: true,
    username: generateUsername(existingUsernames),
    referralCode: generateReferralCode(),
    totalPoints: generateRandomPoints(),
    betaStatus: "waitlist",
    createdAt,
    updatedAt: createdAt,
  };
}

async function seedUsers(count: number) {
  console.log(`\n😈 Seeding ${count} demo users...\n`);

  // Get existing usernames to avoid conflicts
  const existingUsers = await db.query.user.findMany({
    columns: { username: true },
  });
  const existingUsernames = new Set(
    existingUsers.map((u) => u.username).filter(Boolean) as string[]
  );

  console.log(`Found ${existingUsernames.size} existing usernames\n`);

  const users = [];
  const batchSize = 50;

  // Generate all users first
  for (let i = 0; i < count; i++) {
    users.push(generateDemoUser(existingUsernames));
  }

  // Insert in batches
  let inserted = 0;
  for (let i = 0; i < users.length; i += batchSize) {
    const batch = users.slice(i, i + batchSize);
    await db.insert(schema.user).values(batch);
    inserted += batch.length;
    process.stdout.write(`\r  Inserted ${inserted}/${count} users...`);
  }

  console.log(`\n\n✅ Successfully seeded ${count} demo users!\n`);

  // Show some stats
  const pointsDistribution = users.reduce(
    (acc, user) => {
      if (user.totalPoints === 0) acc.zero++;
      else if (user.totalPoints <= 25) acc.low++;
      else if (user.totalPoints <= 60) acc.medium++;
      else if (user.totalPoints <= 100) acc.high++;
      else acc.power++;
      return acc;
    },
    { zero: 0, low: 0, medium: 0, high: 0, power: 0 }
  );

  console.log("📊 Points distribution:");
  console.log(`   0 pts:      ${pointsDistribution.zero} users`);
  console.log(`   1-25 pts:   ${pointsDistribution.low} users`);
  console.log(`   26-60 pts:  ${pointsDistribution.medium} users`);
  console.log(`   61-100 pts: ${pointsDistribution.high} users`);
  console.log(`   100+ pts:   ${pointsDistribution.power} users`);

  // Show a few sample users
  console.log("\n👤 Sample users created:");
  for (const user of users.slice(0, 5)) {
    console.log(
      `   @${user.username} - ${user.name} (${user.totalPoints} pts)`
    );
  }
}

async function main() {
  if (!countArg || isNaN(parseInt(countArg))) {
    console.log(`
😈 Amazing App User Seeder

Usage:
  bun run seed:users <count>

Examples:
  bun run seed:users 50     # Create 50 demo users
  bun run seed:users 100    # Create 100 demo users
  bun run seed:users 500    # Create 500 demo users (for load testing)

Note: Demo users have emails like demo-xxxxx@example.com
      and are distinguishable from real users.
    `);
    process.exit(0);
  }

  const count = parseInt(countArg);

  if (count <= 0) {
    console.error("❌ Count must be a positive number");
    process.exit(1);
  }

  if (count > 10000) {
    console.error("❌ Maximum 10,000 users per run for safety");
    process.exit(1);
  }

  try {
    await seedUsers(count);
  } catch (error) {
    console.error("\n❌ Error seeding users:", error);
    process.exit(1);
  } finally {
    await client.end();
  }
}

main();
