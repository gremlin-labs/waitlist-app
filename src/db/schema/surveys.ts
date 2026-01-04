import {
  pgTable,
  text,
  timestamp,
  integer,
  jsonb,
} from "drizzle-orm/pg-core";
import { user } from "./auth";

export const vibeExperienceEnum = [
  "never_heard",
  "curious",
  "tried_it",
  "daily_viber",
  "transcended",
] as const;
export type VibeExperience = (typeof vibeExperienceEnum)[number];

export const yearsExperienceEnum = [
  "0-1",
  "1-3",
  "3-5",
  "5-10",
  "10+",
  "eternal",
] as const;
export type YearsExperience = (typeof yearsExperienceEnum)[number];

export const macChipEnum = [
  // M1 series (2020-2022)
  "m1",
  "m1_pro",
  "m1_max",
  "m1_ultra",
  // M2 series (2022-2023)
  "m2",
  "m2_pro",
  "m2_max",
  "m2_ultra",
  // M3 series (2023-2024)
  "m3",
  "m3_pro",
  "m3_max",
  "m3_ultra",
  // M4 series (2024-2025)
  "m4",
  "m4_pro",
  "m4_max",
  // M5 series (2025+)
  "m5",
  "m5_pro",
  "m5_max",
  "m5_ultra",
  // Legacy/Other
  "intel",
  "other",
] as const;
export type MacChip = (typeof macChipEnum)[number];

export const betaSurveys = pgTable("beta_surveys", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  userId: text("user_id")
    .references(() => user.id)
    .notNull()
    .unique(),

  // Experience level
  vibeCodeExperience: text("vibe_code_experience", {
    enum: vibeExperienceEnum,
  }),

  // Tools used (stored as JSON array)
  toolsUsed: jsonb("tools_used").$type<string[]>(),
  otherToolText: text("other_tool_text"),
  primaryTool: text("primary_tool"),

  // Professional info
  jobRole: text("job_role"),
  otherJobRole: text("other_job_role"),
  yearsExperience: text("years_experience", {
    enum: yearsExperienceEnum,
  }),

  // Hardware
  macModel: text("mac_model"),
  macChip: text("mac_chip", {
    enum: macChipEnum,
  }),
  ramGb: integer("ram_gb"),

  // Location (IP-detected, user can modify)
  country: text("country"),
  region: text("region"),
  timezone: text("timezone"),

  // Open-ended
  excitedAbout: text("excited_about"),
  biggestPainPoint: text("biggest_pain_point"),
  howHeardAboutUs: text("how_heard_about_us"),

  // Meta
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  completedAt: timestamp("completed_at").defaultNow(),
});

export type BetaSurvey = typeof betaSurveys.$inferSelect;
export type NewBetaSurvey = typeof betaSurveys.$inferInsert;
