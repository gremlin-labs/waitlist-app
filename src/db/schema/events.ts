import {
  pgTable,
  text,
  timestamp,
  jsonb,
} from "drizzle-orm/pg-core";
import { user } from "./auth";

export const eventTypeEnum = [
  "page_view",
  "signup_started",
  "signup_completed",
  "survey_started",
  "survey_completed",
  "invite_sent",
  "app_downloaded",
  "app_activated",
] as const;
export type EventType = (typeof eventTypeEnum)[number];

export const waitlistEvents = pgTable("waitlist_events", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  userId: text("user_id").references(() => user.id),
  email: text("email"), // For pre-signup events

  eventType: text("event_type", {
    enum: eventTypeEnum,
  }).notNull(),

  eventData: jsonb("event_data"),

  // Context
  referrer: text("referrer"),
  utmSource: text("utm_source"),
  utmMedium: text("utm_medium"),
  utmCampaign: text("utm_campaign"),

  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export type WaitlistEvent = typeof waitlistEvents.$inferSelect;
export type NewWaitlistEvent = typeof waitlistEvents.$inferInsert;
