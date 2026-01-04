import {
  pgTable,
  text,
  timestamp,
  boolean,
  uuid,
} from "drizzle-orm/pg-core";
import { user } from "./auth";

/**
 * Twitter OAuth Connection
 * Stores Twitter account linkage and follow status for gamification
 */
export const twitterConnections = pgTable("twitter_connections", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: text("user_id")
    .references(() => user.id, { onDelete: "cascade" })
    .notNull()
    .unique(),

  // Twitter account data
  twitterId: text("twitter_id").notNull().unique(),
  twitterUsername: text("twitter_username").notNull(),
  twitterDisplayName: text("twitter_display_name"),
  twitterAvatarUrl: text("twitter_avatar_url"),

  // OAuth tokens (encrypted at rest)
  accessToken: text("access_token").notNull(),
  refreshToken: text("refresh_token"),
  tokenExpiresAt: timestamp("token_expires_at"),

  // Follow status (cached, refreshed periodically)
  followsVibemodeai: boolean("follows_vibemodeai").default(false),
  followsGremlinlabs: boolean("follows_gremlinlabs").default(false),
  followsProductgremlin: boolean("follows_productgremlin").default(false),
  followsLastChecked: timestamp("follows_last_checked"),

  // Timestamps
  connectedAt: timestamp("connected_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

/**
 * Discord OAuth Connection
 * Stores Discord account linkage and server membership for gamification
 */
export const discordConnections = pgTable("discord_connections", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: text("user_id")
    .references(() => user.id, { onDelete: "cascade" })
    .notNull()
    .unique(),

  // Discord account data
  discordId: text("discord_id").notNull().unique(),
  discordUsername: text("discord_username").notNull(),
  discordDiscriminator: text("discord_discriminator"), // Legacy, may be null
  discordAvatarHash: text("discord_avatar_hash"),

  // OAuth tokens (encrypted at rest)
  accessToken: text("access_token").notNull(),
  refreshToken: text("refresh_token").notNull(),
  tokenExpiresAt: timestamp("token_expires_at"),

  // Server membership (verified by bot or API)
  hasJoinedServer: boolean("has_joined_server").default(false),
  serverJoinedAt: timestamp("server_joined_at"),
  serverLastVerified: timestamp("server_last_verified"),

  // Timestamps
  connectedAt: timestamp("connected_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

/**
 * Discord Guild Memberships
 * Tracks which Discord servers our users are in for outreach/marketing insights
 */
export const discordGuildMemberships = pgTable("discord_guild_memberships", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: text("user_id")
    .references(() => user.id, { onDelete: "cascade" })
    .notNull(),

  // Guild (server) data
  guildId: text("guild_id").notNull(),
  guildName: text("guild_name").notNull(),
  guildIcon: text("guild_icon"),

  // User's role in this guild
  isOwner: boolean("is_owner").default(false),

  // Timestamps
  firstSeenAt: timestamp("first_seen_at").defaultNow().notNull(),
  lastSeenAt: timestamp("last_seen_at").defaultNow().notNull(),
});

/**
 * Discord Guild Stats (aggregated)
 * Denormalized stats for quick queries on popular servers
 */
export const discordGuildStats = pgTable("discord_guild_stats", {
  guildId: text("guild_id").primaryKey(),
  guildName: text("guild_name").notNull(),
  guildIcon: text("guild_icon"),

  // How many of our users are in this server
  userCount: text("user_count").notNull().default("0"),

  // Timestamps
  firstSeenAt: timestamp("first_seen_at").defaultNow().notNull(),
  lastUpdatedAt: timestamp("last_updated_at").defaultNow().notNull(),
});

export type TwitterConnection = typeof twitterConnections.$inferSelect;
export type NewTwitterConnection = typeof twitterConnections.$inferInsert;
export type DiscordConnection = typeof discordConnections.$inferSelect;
export type NewDiscordConnection = typeof discordConnections.$inferInsert;
export type DiscordGuildMembership = typeof discordGuildMemberships.$inferSelect;
export type DiscordGuildStats = typeof discordGuildStats.$inferSelect;
