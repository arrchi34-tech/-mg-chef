import { env } from 'cloudflare:workers';
import { ensureSchema } from '../db';
import { isManagerSession } from '../manager-auth';
import { createPin, hashStaffPin } from '../staff-auth';

type TeamRow = { id: number; name: string; pin_hash: string | null; created_at: string };

function toMember(row: TeamRow) {
  return { id: row.id, name: row.name, pinConfigured: Boolean(row.pin_hash), createdAt: row.created_at };
}

async function requireManager(request: Request) {
  if (await isManagerSession(request)) return true;
  return false;
}

export async function GET(request: Request) {
  if (!(await requireManager(request))) return Response.json({ error: 'Требуется вход руководителя.' }, { status: 401 });
  await ensureSchema();
  const members = await env.DB.prepare('SELECT id, name, pin_hash, created_at FROM team_members WHERE active = 1 ORDER BY name COLLATE NOCASE').all<TeamRow>();
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
  const existing = await env.DB.prepare('SELECT id, name, pin_hash, created_at FROM team_members').all<TeamRow>();
  const byName = new Map(existing.results.map((member) => [member.name, member]));
  const issuedByName = new Map<string, string>();
  const statements = await Promise.all(names.map(async (name) => {
    const current = byName.get(name);
    if (current?.pin_hash) return env.DB.prepare('UPDATE team_members SET active = 1 WHERE id = ?').bind(current.id);
    const pin = createPin(); const pinHash = await hashStaffPin(name, pin);
    issuedByName.set(name, pin);
    return current ? env.DB.prepare('UPDATE team_members SET active = 1, pin_hash = ? WHERE id = ?').bind(pinHash, current.id) : env.DB.prepare('INSERT INTO team_members (name, active, pin_hash, created_at) VALUES (?, 1, ?, ?)').bind(name, pinHash, createdAt);
  }));
  await env.DB.batch(statements);
  const members = await env.DB.prepare('SELECT id, name, pin_hash, created_at FROM team_members WHERE active = 1 ORDER BY name COLLATE NOCASE').all<TeamRow>();
  const mapped = members.results.map(toMember);
  return Response.json({ members: mapped, issuedPins: mapped.flatMap((member) => { const pin = issuedByName.get(member.name); return pin ? [{ id: member.id, name: member.name, pin }] : []; }) }, { status: 201 });
}

export async function DELETE(request: Request) {
  if (!(await requireManager(request))) return Response.json({ error: 'Требуется вход руководителя.' }, { status: 401 });
  const id = Number(new URL(request.url).searchParams.get('id'));
  if (!Number.isInteger(id) || id < 1) return Response.json({ error: 'Некорректный сотрудник.' }, { status: 400 });
  await ensureSchema();
  await env.DB.prepare('UPDATE team_members SET active = 0 WHERE id = ?').bind(id).run();
  return Response.json({ removed: true });
}
