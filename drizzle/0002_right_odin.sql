CREATE TABLE `category_deadlines` (
	`category_id` text PRIMARY KEY NOT NULL,
	`due_date` text NOT NULL
);
--> statement-breakpoint
ALTER TABLE `team_members` ADD `pin_hash` text;