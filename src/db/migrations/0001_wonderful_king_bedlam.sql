CREATE TABLE "job_applications" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL,
	"job_role" text NOT NULL,
	"passion_response" text NOT NULL,
	"work_style_response" text NOT NULL,
	"experience_response" text NOT NULL,
	"linkedin_url" text NOT NULL,
	"github_url" text,
	"portfolio_url" text,
	"status" text DEFAULT 'submitted' NOT NULL,
	"submitted_at" timestamp DEFAULT now() NOT NULL,
	"reviewed_at" timestamp,
	"notes" text
);
--> statement-breakpoint
ALTER TABLE "job_applications" ADD CONSTRAINT "job_applications_user_id_user_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."user"("id") ON DELETE no action ON UPDATE no action;