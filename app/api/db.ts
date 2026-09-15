import { env } from 'cloudflare:workers';

export async function ensureSchema() {
  await env.DB.batch([
    env.DB.prepare(`CREATE TABLE IF NOT EXISTS attempts (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      employee_name TEXT NOT NULL,
      category_id TEXT NOT NULL,
      category_title TEXT NOT NULL,
      score INTEGER NOT NULL,
      total INTEGER NOT NULL,
      passed INTEGER NOT NULL,
      completed_at TEXT NOT NULL
    )`),
    env.DB.prepare('CREATE INDEX IF NOT EXISTS idx_attempts_completed_at ON attempts (completed_at DESC)'),
    env.DB.prepare('CREATE INDEX IF NOT EXISTS idx_attempts_employee_name ON attempts (employee_name, completed_at DESC)'),
    env.DB.prepare(`CREATE TABLE IF NOT EXISTS team_members (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL UNIQUE,
      active INTEGER NOT NULL DEFAULT 1,
      created_at TEXT NOT NULL
    )`),
    env.DB.prepare('CREATE INDEX IF NOT EXISTS idx_team_members_active_name ON team_members (active, name)'),
  ]);
}
