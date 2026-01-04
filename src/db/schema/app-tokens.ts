import {
  pgTable,
  text,
  timestamp,
  boolean,
} from "drizzle-orm/pg-core";
import { user } from "./auth";

export const appTokens = pgTable("app_tokens", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  userId: text("user_id")
    .references(() => user.id)
    .notNull(),

  // Token for desktop app
  token: text("token").notNull().unique(),
  tokenHash: text("token_hash").notNull(), // For secure lookup

  // Device info
  deviceName: text("device_name"),
  deviceId: text("device_id"),

  // Status
  isActive: boolean("is_active").default(true),
  lastUsedAt: timestamp("last_used_at"),

  // Timestamps
  createdAt: timestamp("created_at").defaultNow().notNull(),
  expiresAt: timestamp("expires_at"),
});

export type AppToken = typeof appTokens.$inferSelect;
export type NewAppToken = typeof appTokens.$inferInsert;
