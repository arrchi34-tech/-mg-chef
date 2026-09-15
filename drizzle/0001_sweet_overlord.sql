CREATE TABLE `team_members` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`active` integer DEFAULT 1 NOT NULL,
	`created_at` text NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `team_members_name_unique` ON `team_members` (`name`);--> statement-breakpoint
CREATE INDEX `idx_team_members_active_name` ON `team_members` (`active`,`name`);