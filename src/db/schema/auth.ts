import {
  pgTable,
  text,
  timestamp,
  boolean,
  uuid,
  integer,
} from "drizzle-orm/pg-core";

/**
 * Better Auth required tables
 * These are the core tables needed for authentication
 */

// Sessions table - tracks active user sessions
export const sessions = pgTable("session", {
  id: text("id").primaryKey(),
  expiresAt: timestamp("expires_at").notNull(),
  token: text("token").notNull().unique(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
});

// Account table - for OAuth providers
export const accounts = pgTable("account", {
  id: text("id").primaryKey(),
  accountId: text("account_id").notNull(),
  providerId: text("provider_id").notNull(),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  accessToken: text("access_token"),
  refreshToken: text("refresh_token"),
  idToken: text("id_token"),
  accessTokenExpiresAt: timestamp("access_token_expires_at"),
  refreshTokenExpiresAt: timestamp("refresh_token_expires_at"),
  scope: text("scope"),
  password: text("password"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

// Verification table - for magic links and email verification
export const verifications = pgTable("verification", {
  id: text("id").primaryKey(),
  identifier: text("identifier").notNull(),
  value: text("value").notNull(),
  expiresAt: timestamp("expires_at").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// User table for Better Auth (replaces our custom users table)
export const user = pgTable("user", {
  id: text("id").primaryKey(),
  name: text("name"),
  email: text("email").notNull().unique(),
  emailVerified: boolean("email_verified").notNull().default(false),
  image: text("image"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
  
  // Custom fields for Vibe Mode
  username: text("username").unique(), // Auto-generated, user-editable handle (e.g., swift-wolf)
  isAdmin: boolean("is_admin").default(false),
  betaStatus: text("beta_status").default("waitlist"),
  betaInvitedAt: timestamp("beta_invited_at"),
  betaActivatedAt: timestamp("beta_activated_at"),
  surveyCompletedAt: timestamp("survey_completed_at"),
  
  // Referral tracking
  referralCode: text("referral_code").unique(),
  referredBy: text("referred_by"), // User ID of referrer
  referredByCode: text("referred_by_code"), // Original code used at signup
  
  // Gamification (denormalized for fast queries)
  totalPoints: integer("total_points").default(0),
  waitlistRank: integer("waitlist_rank"),
});

export type Session = typeof sessions.$inferSelect;
export type Account = typeof accounts.$inferSelect;
export type Verification = typeof verifications.$inferSelect;
export type User = typeof user.$inferSelect;
