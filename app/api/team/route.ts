import { env } from 'cloudflare:workers';
import { ensureSchema } from '../db';
import { isManagerSession } from '../manager-auth';

type TeamRow = { id: number; name: string; created_at: string };

function toMember(row: TeamRow) {
  return { id: row.id, name: row.name, createdAt: row.created_at };
}

async function requireManager(request: Request) {
  if (await isManagerSession(request)) return true;
  return false;
}

export async function GET(request: Request) {
  if (!(await requireManager(request))) return Response.json({ error: 'Требуется вход руководителя.' }, { status: 401 });
  await ensureSchema();
  const members = await env.DB.prepare('SELECT id, name, created_at FROM team_members WHERE active = 1 ORDER BY name COLLATE NOCASE').all<TeamRow>();
  return Response.json({ members: members.results.map(toMember) });
}

export async function POST(request: Request) {
  if (!(await requireManager(request))) return Response.json({ error: 'Требуется вход руководителя.' }, { status: 401 });
  const body = await request.json().catch(() => null) as Record<string, unknown> | null;
  const rawNames = Array.isArray(body?.names) ? body.names : [];
  const names = [...new Set(rawNames.filter((name): name is string => typeof name === 'string').map((name) => name.trim().replace(/\s+/g, ' ').slice(0, 120)).filter(Boolean))].slice(0, 100);
  if (!names.length) return Response.json({ error: 'Добавьте хотя бы одно имя.' }, { status: 400 });
  await ensureSchema();
  const createdAt = new Date().toISOString();
  await env.DB.batch(names.map((name) => env.DB.prepare(`INSERT INTO team_members (name, active, created_at)
    VALUES (?, 1, ?) ON CONFLICT(name) DO UPDATE SET active = 1`).bind(name, createdAt)));
  const members = await env.DB.prepare('SELECT id, name, created_at FROM team_members WHERE active = 1 ORDER BY name COLLATE NOCASE').all<TeamRow>();
  return Response.json({ members: members.results.map(toMember) }, { status: 201 });
}

export async function DELETE(request: Request) {
  if (!(await requireManager(request))) return Response.json({ error: 'Требуется вход руководителя.' }, { status: 401 });
  const id = Number(new URL(request.url).searchParams.get('id'));
  if (!Number.isInteger(id) || id < 1) return Response.json({ error: 'Некорректный сотрудник.' }, { status: 400 });
  await ensureSchema();
  await env.DB.prepare('UPDATE team_members SET active = 0 WHERE id = ?').bind(id).run();
  return Response.json({ removed: true });
}
