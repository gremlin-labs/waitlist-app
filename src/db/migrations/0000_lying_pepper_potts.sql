CREATE TYPE "public"."point_action" AS ENUM('twitter_connect', 'twitter_follow_vibemodeai', 'twitter_follow_gremlinlabs', 'twitter_follow_productgremlin', 'twitter_unfollow_vibemodeai', 'twitter_unfollow_gremlinlabs', 'twitter_unfollow_productgremlin', 'discord_connect', 'discord_join_server', 'discord_leave_server', 'referral_click', 'referral_signup', 'referral_activated', 'survey_completed', 'admin_adjustment');--> statement-breakpoint
CREATE TABLE "account" (
	"id" text PRIMARY KEY NOT NULL,
	"account_id" text NOT NULL,
	"provider_id" text NOT NULL,
	"user_id" text NOT NULL,
	"access_token" text,
	"refresh_token" text,
	"id_token" text,
	"access_token_expires_at" timestamp,
	"refresh_token_expires_at" timestamp,
	"scope" text,
	"password" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "session" (
	"id" text PRIMARY KEY NOT NULL,
	"expires_at" timestamp NOT NULL,
	"token" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"ip_address" text,
	"user_agent" text,
	"user_id" text NOT NULL,
	CONSTRAINT "session_token_unique" UNIQUE("token")
);
--> statement-breakpoint
CREATE TABLE "user" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text,
	"email" text NOT NULL,
	"email_verified" boolean DEFAULT false NOT NULL,
	"image" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	"username" text,
	"is_admin" boolean DEFAULT false,
	"beta_status" text DEFAULT 'waitlist',
	"beta_invited_at" timestamp,
	"beta_activated_at" timestamp,
	"survey_completed_at" timestamp,
	"referral_code" text,
	"referred_by" text,
	"referred_by_code" text,
	"total_points" integer DEFAULT 0,
	"waitlist_rank" integer,
	CONSTRAINT "user_email_unique" UNIQUE("email"),
	CONSTRAINT "user_username_unique" UNIQUE("username"),
	CONSTRAINT "user_referral_code_unique" UNIQUE("referral_code")
);
--> statement-breakpoint
CREATE TABLE "verification" (
	"id" text PRIMARY KEY NOT NULL,
	"identifier" text NOT NULL,
	"value" text NOT NULL,
	"expires_at" timestamp NOT NULL,
	"created_at" timestamp DEFAULT now(),
	"updated_at" timestamp DEFAULT now()
);
--> statement-breakpoint
CREATE TABLE "beta_surveys" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"vibe_code_experience" text,
	"tools_used" jsonb,
	"other_tool_text" text,
	"primary_tool" text,
	"job_role" text,
	"other_job_role" text,
	"years_experience" text,
	"mac_model" text,
	"mac_chip" text,
	"ram_gb" integer,
	"country" text,
	"region" text,
	"timezone" text,
	"excited_about" text,
	"biggest_pain_point" text,
	"how_heard_about_us" text,
	"ip_address" text,
	"user_agent" text,
	"completed_at" timestamp DEFAULT now(),
	CONSTRAINT "beta_surveys_user_id_unique" UNIQUE("user_id")
);
--> statement-breakpoint
CREATE TABLE "app_tokens" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"token" text NOT NULL,
	"token_hash" text NOT NULL,
	"device_name" text,
	"device_id" text,
	"is_active" boolean DEFAULT true,
	"last_used_at" timestamp,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"expires_at" timestamp,
	CONSTRAINT "app_tokens_token_unique" UNIQUE("token")
);
--> statement-breakpoint
CREATE TABLE "waitlist_events" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text,
	"email" text,
	"event_type" text NOT NULL,
	"event_data" jsonb,
	"referrer" text,
	"utm_source" text,
	"utm_medium" text,
	"utm_campaign" text,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "discord_connections" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" text NOT NULL,
	"discord_id" text NOT NULL,
	"discord_username" text NOT NULL,
	"discord_discriminator" text,
	"discord_avatar_hash" text,
	"access_token" text NOT NULL,
	"refresh_token" text NOT NULL,
	"token_expires_at" timestamp,
	"has_joined_server" boolean DEFAULT false,
	"server_joined_at" timestamp,
	"server_last_verified" timestamp,
	"connected_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "discord_connections_user_id_unique" UNIQUE("user_id"),
	CONSTRAINT "discord_connections_discord_id_unique" UNIQUE("discord_id")
);
--> statement-breakpoint
CREATE TABLE "twitter_connections" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" text NOT NULL,
	"twitter_id" text NOT NULL,
	"twitter_username" text NOT NULL,
	"twitter_display_name" text,
	"twitter_avatar_url" text,
	"access_token" text NOT NULL,
	"refresh_token" text,
	"token_expires_at" timestamp,
	"follows_vibemodeai" boolean DEFAULT false,
	"follows_gremlinlabs" boolean DEFAULT false,
	"follows_productgremlin" boolean DEFAULT false,
	"follows_last_checked" timestamp,
	"connected_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "twitter_connections_user_id_unique" UNIQUE("user_id"),
	CONSTRAINT "twitter_connections_twitter_id_unique" UNIQUE("twitter_id")
);
--> statement-breakpoint
CREATE TABLE "points_ledger" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" text NOT NULL,
	"points" integer NOT NULL,
	"action" "point_action" NOT NULL,
	"reference_id" text,
	"note" text,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "waitlist_rankings" (
	"user_id" text PRIMARY KEY NOT NULL,
	"rank" integer NOT NULL,
	"total_points" integer DEFAULT 0 NOT NULL,
	"twitter_points" integer DEFAULT 0,
	"discord_points" integer DEFAULT 0,
	"referral_points" integer DEFAULT 0,
	"survey_points" integer DEFAULT 0,
	"bonus_points" integer DEFAULT 0,
	"referral_count" integer DEFAULT 0,
	"referral_signups" integer DEFAULT 0,
	"calculated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "referrals" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"referrer_id" text NOT NULL,
	"referral_code" text NOT NULL,
	"referee_id" text,
	"referee_email" text,
	"clicked_at" timestamp DEFAULT now() NOT NULL,
	"signed_up_at" timestamp,
	"activated_at" timestamp,
	"utm_source" text,
	"utm_medium" text,
	"utm_campaign" text,
	"landing_page" text,
	"ip_address" text,
	"user_agent" text,
	"click_points_awarded" boolean DEFAULT false,
	"signup_points_awarded" boolean DEFAULT false,
	"activation_points_awarded" boolean DEFAULT false
);
--> statement-breakpoint
ALTER TABLE "account" ADD CONSTRAINT "account_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "session" ADD CONSTRAINT "session_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "beta_surveys" ADD CONSTRAINT "beta_surveys_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "app_tokens" ADD CONSTRAINT "app_tokens_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "waitlist_events" ADD CONSTRAINT "waitlist_events_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "discord_connections" ADD CONSTRAINT "discord_connections_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "twitter_connections" ADD CONSTRAINT "twitter_connections_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "points_ledger" ADD CONSTRAINT "points_ledger_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "waitlist_rankings" ADD CONSTRAINT "waitlist_rankings_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "referrals" ADD CONSTRAINT "referrals_referrer_id_user_id_fk" FOREIGN KEY ("referrer_id") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "referrals" ADD CONSTRAINT "referrals_referee_id_user_id_fk" FOREIGN KEY ("referee_id") REFERENCES "public"."user"("id") ON DELETE set null ON UPDATE no action;