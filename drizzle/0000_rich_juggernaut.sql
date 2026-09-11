CREATE TABLE `attempts` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`employee_name` text NOT NULL,
	`category_id` text NOT NULL,
	`category_title` text NOT NULL,
	`score` integer NOT NULL,
	`total` integer NOT NULL,
	`passed` integer NOT NULL,
	`completed_at` text NOT NULL
);
--> statement-breakpoint
CREATE INDEX `idx_attempts_completed_at` ON `attempts` (`completed_at`);--> statement-breakpoint
CREATE INDEX `idx_attempts_employee_name` ON `attempts` (`employee_name`,`completed_at`);