CREATE TABLE "board_lists" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"project_id" uuid NOT NULL,
	"name" varchar(255) NOT NULL,
	"position" integer NOT NULL,
	"created_by" uuid NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "board_lists" ADD CONSTRAINT "board_lists_project_id_projects_id_fk" FOREIGN KEY ("project_id") REFERENCES "public"."projects"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "board_lists" ADD CONSTRAINT "board_lists_created_by_users_id_fk" FOREIGN KEY ("created_by") REFERENCES "public"."users"("id") ON DELETE restrict ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "lists_project_idx" ON "board_lists" USING btree ("project_id");--> statement-breakpoint
CREATE INDEX "lists_created_by_idx" ON "board_lists" USING btree ("created_by");--> statement-breakpoint
CREATE INDEX "lists_project_position_idx" ON "board_lists" USING btree ("project_id","position");--> statement-breakpoint
CREATE UNIQUE INDEX "lists_project_name_idx" ON "board_lists" USING btree ("project_id","name");