import {
  pgTable,
  text,
  timestamp,
} from "drizzle-orm/pg-core";
import { user } from "./auth";

export const jobRoleEnum = [
  "zig-ml",
  "zig-perf",
  "swiftui",
  "fullstack",
  "marketing",
] as const;
export type JobRole = (typeof jobRoleEnum)[number];

export const applicationStatusEnum = [
  "new",           // Just submitted, unread
  "reviewing",     // Being reviewed
  "outreach",      // Initial outreach sent
  "phone_screen",  // Phone screen scheduled/completed
  "interview",     // Interview scheduled/completed
  "final_round",   // Final round
  "offer",         // Offer extended
  "hired",         // Accepted, hired!
  "rejected",      // Rejected at any stage
  "withdrawn",     // Candidate withdrew
] as const;
export type ApplicationStatus = (typeof applicationStatusEnum)[number];

export const jobApplications = pgTable("job_applications", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  userId: text("user_id")
    .references(() => user.id)
    .notNull(),

  // Job info
  jobRole: text("job_role", {
    enum: jobRoleEnum,
  }).notNull(),

  // Form responses
  passionResponse: text("passion_response").notNull(), // "Tell us about what you love about..."
  workStyleResponse: text("work_style_response").notNull(), // "Describe how you like to work"
  experienceResponse: text("experience_response").notNull(), // "Share any relevant experience"

  // Links
  linkedinUrl: text("linkedin_url").notNull(),
  githubUrl: text("github_url"), // Required for dev roles only
  portfolioUrl: text("portfolio_url"),

  // Status
  status: text("status", {
    enum: applicationStatusEnum,
  }).notNull().default("new"),

  // Meta
  submittedAt: timestamp("submitted_at").defaultNow().notNull(),
  reviewedAt: timestamp("reviewed_at"),
  notes: text("notes"), // Internal notes for admin
});

export type JobApplication = typeof jobApplications.$inferSelect;
export type NewJobApplication = typeof jobApplications.$inferInsert;
