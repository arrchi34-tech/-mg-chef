import { env } from 'cloudflare:workers';
import { ensureSchema } from '../../db';
import { isManagerSession } from '../../manager-auth';
import { createPin, hashStaffPin } from '../../staff-auth';

export async function POST(request: Request) {
  if (!(await isManagerSession(request))) return Response.json({ error: 'Требуется вход руководителя.' }, { status: 401 });
  const body = await request.json().catch(() => null) as Record<string, unknown> | null;
  const memberId = typeof body?.memberId === 'number' ? Math.trunc(body.memberId) : -1;
  if (memberId < 1) return Response.json({ error: 'Некорректный сотрудник.' }, { status: 400 });
  await ensureSchema();
  const member = await env.DB.prepare('SELECT id, name FROM team_members WHERE id = ? AND active = 1').bind(memberId).first<{ id: number; name: string }>();
  if (!member) return Response.json({ error: 'Сотрудник не найден.' }, { status: 404 });
  const pin = createPin(); const pinHash = await hashStaffPin(member.name, pin);
  await env.DB.prepare('UPDATE team_members SET pin_hash = ? WHERE id = ?').bind(pinHash, member.id).run();
  return Response.json({ issuedPin: { id: member.id, name: member.name, pin } });
}
