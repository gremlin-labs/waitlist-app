#!/usr/bin/env bun
/**
 * CLI script to promote a user to admin status
 * 
 * Usage:
 *   bun run admin:promote <email>
 *   bun run admin:demote <email>
 *   bun run admin:list
 */

import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";

// Resolve path relative to this script file
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const envPath = path.resolve(__dirname, "../.env.local");

dotenv.config({ path: envPath });

// Verify env loaded
if (!process.env.DATABASE_URL) {
  console.error("❌ DATABASE_URL not found. Make sure .env.local exists with DATABASE_URL set.");
  process.exit(1);
}

import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { eq } from "drizzle-orm";
import * as schema from "../src/db/schema";

const client = postgres(process.env.DATABASE_URL!);
const db = drizzle(client, { schema });

const [, , command, email] = process.argv;

async function promoteToAdmin(email: string) {
  const foundUser = await db.query.user.findFirst({
    where: eq(schema.user.email, email),
  });

  if (!foundUser) {
    console.error(`❌ User not found: ${email}`);
    process.exit(1);
  }

  if (foundUser.isAdmin) {
    console.log(`ℹ️  User is already an admin: ${email}`);
    process.exit(0);
  }

  await db
    .update(schema.user)
    .set({ isAdmin: true, updatedAt: new Date() })
    .where(eq(schema.user.email, email));

  console.log(`✅ User promoted to admin: ${email}`);
}

async function demoteFromAdmin(email: string) {
  const foundUser = await db.query.user.findFirst({
    where: eq(schema.user.email, email),
  });

  if (!foundUser) {
    console.error(`❌ User not found: ${email}`);
    process.exit(1);
  }

  if (!foundUser.isAdmin) {
    console.log(`ℹ️  User is not an admin: ${email}`);
    process.exit(0);
  }

  await db
    .update(schema.user)
    .set({ isAdmin: false, updatedAt: new Date() })
    .where(eq(schema.user.email, email));

  console.log(`✅ User demoted from admin: ${email}`);
}

async function listAdmins() {
  const admins = await db.query.user.findMany({
    where: eq(schema.user.isAdmin, true),
    columns: {
      id: true,
      email: true,
      name: true,
      createdAt: true,
    },
  });

  if (admins.length === 0) {
    console.log("ℹ️  No admin users found.");
    return;
  }

  console.log(`\n😈 Admin Users (${admins.length}):\n`);
  console.log("─".repeat(60));
  
  for (const admin of admins) {
    console.log(`  ${admin.email}`);
    console.log(`    Name: ${admin.name || "N/A"}`);
    console.log(`    ID: ${admin.id}`);
    console.log(`    Created: ${admin.createdAt.toISOString()}`);
    console.log("");
  }
}

async function setUserBetaStatus(email: string, status: "waitlist" | "invited" | "active" | "churned") {
  const foundUser = await db.query.user.findFirst({
    where: eq(schema.user.email, email),
  });

  if (!foundUser) {
    console.error(`❌ User not found: ${email}`);
    process.exit(1);
  }

  const updates: Record<string, unknown> = {
    betaStatus: status,
    updatedAt: new Date(),
  };

  if (status === "invited") {
    updates.betaInvitedAt = new Date();
  } else if (status === "active") {
    updates.betaActivatedAt = new Date();
  }

  await db
    .update(schema.user)
    .set(updates)
    .where(eq(schema.user.email, email));

  console.log(`✅ User beta status updated to "${status}": ${email}`);
}

async function main() {
  try {
    switch (command) {
      case "promote":
        if (!email) {
          console.error("Usage: bun run admin:promote <email>");
          process.exit(1);
        }
        await promoteToAdmin(email);
        break;

      case "demote":
        if (!email) {
          console.error("Usage: bun run admin:demote <email>");
          process.exit(1);
        }
        await demoteFromAdmin(email);
        break;

      case "list":
        await listAdmins();
        break;

      case "activate":
        if (!email) {
          console.error("Usage: bun run admin:activate <email>");
          process.exit(1);
        }
        await setUserBetaStatus(email, "active");
        break;

      case "invite":
        if (!email) {
          console.error("Usage: bun run admin:invite <email>");
          process.exit(1);
        }
        await setUserBetaStatus(email, "invited");
        break;

      default:
        console.log(`
😈 Vibe Mode Admin CLI

Commands:
  bun run admin:promote <email>   - Promote user to admin
  bun run admin:demote <email>    - Remove admin privileges
  bun run admin:list              - List all admin users
  bun run admin:activate <email>  - Set user to active beta status
  bun run admin:invite <email>    - Set user to invited status
        `);
        process.exit(0);
    }
  } catch (error) {
    console.error("Error:", error);
    process.exit(1);
  } finally {
    await client.end();
  }
}

main();
