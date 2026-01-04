import {
  pgTable,
  text,
  timestamp,
  boolean,
  uuid,
} from "drizzle-orm/pg-core";
import { user } from "./auth";

/**
 * Referrals
 * Enhanced referral tracking with full funnel attribution
 * Tracks clicks → signups → activations (survey completed)
 */
export const referrals = pgTable("referrals", {
  id: uuid("id").primaryKey().defaultRandom(),

  // Referrer (the user who shared the link)
  referrerId: text("referrer_id")
    .references(() => user.id, { onDelete: "cascade" })
    .notNull(),
  referralCode: text("referral_code").notNull(),

  // Referee (the person who clicked/signed up - may be null if just a click)
  refereeId: text("referee_id").references(() => user.id, { onDelete: "set null" }),
  refereeEmail: text("referee_email"), // Captured before signup for tracking

  // Funnel tracking
  clickedAt: timestamp("clicked_at").defaultNow().notNull(),
  signedUpAt: timestamp("signed_up_at"),
  activatedAt: timestamp("activated_at"), // Survey completed = activated

  // Attribution data
  utmSource: text("utm_source"),
  utmMedium: text("utm_medium"),
  utmCampaign: text("utm_campaign"),
  landingPage: text("landing_page"),
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),

  // Points tracking (to prevent double-awarding)
  clickPointsAwarded: boolean("click_points_awarded").default(false),
  signupPointsAwarded: boolean("signup_points_awarded").default(false),
  activationPointsAwarded: boolean("activation_points_awarded").default(false),
});

export type Referral = typeof referrals.$inferSelect;
export type NewReferral = typeof referrals.$inferInsert;
