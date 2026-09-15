import { env } from 'cloudflare:workers';
import { ensureSchema } from '../db';

type StaffRow = { id: number; name: string };

export async function GET() {
  await ensureSchema();
  const members = await env.DB.prepare('SELECT id, name FROM team_members WHERE active = 1 ORDER BY name COLLATE NOCASE').all<StaffRow>();
  return Response.json({ members: members.results });
}
