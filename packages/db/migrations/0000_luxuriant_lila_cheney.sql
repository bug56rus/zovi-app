CREATE TABLE IF NOT EXISTS "events" (
	"id" uuid PRIMARY KEY NOT NULL,
	"admin_token" text NOT NULL,
	"public_token" text NOT NULL,
	"title" text NOT NULL,
	"date_time" timestamp with time zone NOT NULL,
	"location" text,
	"description" text,
	"template_id" text DEFAULT 'classic' NOT NULL,
	"show_guests" boolean DEFAULT true NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "events_admin_token_unique" UNIQUE("admin_token"),
	CONSTRAINT "events_public_token_unique" UNIQUE("public_token")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "invites" (
	"id" uuid PRIMARY KEY NOT NULL,
	"event_id" uuid NOT NULL,
	"invite_token" text NOT NULL,
	"status" text,
	"magic_token" text,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone DEFAULT now() NOT NULL,
	CONSTRAINT "invites_invite_token_unique" UNIQUE("invite_token"),
	CONSTRAINT "invites_status_check" CHECK ("invites"."status" IN ('going', 'maybe', 'not_going'))
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "invites" ADD CONSTRAINT "invites_event_id_events_id_fk" FOREIGN KEY ("event_id") REFERENCES "public"."events"("id") ON DELETE cascade ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "invites_event_created_idx" ON "invites" USING btree ("event_id","created_at");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "invites_event_magic_uniq" ON "invites" USING btree ("event_id","magic_token") WHERE magic_token IS NOT NULL;