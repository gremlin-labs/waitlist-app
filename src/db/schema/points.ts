import {
  pgTable,
  text,
  timestamp,
  integer,
  uuid,
  pgEnum,
} from "drizzle-orm/pg-core";
import { user } from "./auth";

/**
 * Point action types
 * All possible actions that can award or deduct points
 */
export const pointActionEnum = pgEnum("point_action", [
  // Twitter actions
  "twitter_connect",
  "twitter_follow_account1",
  "twitter_follow_account2",
  "twitter_follow_account3",
  "twitter_unfollow_account1",
  "twitter_unfollow_account2",
  "twitter_unfollow_productgremlin",
  // Discord actions
  "discord_connect",
  "discord_join_server",
  "discord_leave_server",
  // Referral actions
  "referral_click",
  "referral_signup",
  "referral_activated",
  // Engagement actions
  "survey_completed",
  // Admin actions
  "admin_adjustment",
]);

export type PointAction = (typeof pointActionEnum.enumValues)[number];

/**
 * Points Ledger
 * Audit trail for all point changes - immutable log of every point transaction
 */
export const pointsLedger = pgTable("points_ledger", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: text("user_id")
    .references(() => user.id, { onDelete: "cascade" })
    .notNull(),

  // Point details
  points: integer("points").notNull(), // Can be negative for deductions
  action: pointActionEnum("action").notNull(),

  // Context
  referenceId: text("reference_id"), // e.g., referred user ID, twitter handle
  note: text("note"), // Admin notes or system messages

  // Timestamp
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

/**
 * Waitlist Rankings
 * Cached rankings table for fast leaderboard queries
 * Recalculated periodically via cron job
 */
export const waitlistRankings = pgTable("waitlist_rankings", {
  userId: text("user_id")
    .references(() => user.id, { onDelete: "cascade" })
    .primaryKey(),

  // Ranking
  rank: integer("rank").notNull(),
  totalPoints: integer("total_points").notNull().default(0),

  // Point breakdown (for display)
  twitterPoints: integer("twitter_points").default(0),
  discordPoints: integer("discord_points").default(0),
  referralPoints: integer("referral_points").default(0),
  surveyPoints: integer("survey_points").default(0),
  bonusPoints: integer("bonus_points").default(0),

  // Stats
  referralCount: integer("referral_count").default(0),
  referralSignups: integer("referral_signups").default(0),

  // Cache metadata
  calculatedAt: timestamp("calculated_at").defaultNow().notNull(),
});

export type PointsLedgerEntry = typeof pointsLedger.$inferSelect;
export type NewPointsLedgerEntry = typeof pointsLedger.$inferInsert;
export type WaitlistRanking = typeof waitlistRankings.$inferSelect;
export type NewWaitlistRanking = typeof waitlistRankings.$inferInsert;
