import { env } from 'cloudflare:workers';
import { ensureSchema } from '../../db';
import { createStaffSession, staffSessionCookie, verifyStaffPin } from '../../staff-auth';

type StaffRow = { id: number; name: string; pin_hash: string | null };

export async function POST(request: Request) {
  const body = await request.json().catch(() => null) as Record<string, unknown> | null;
  const memberId = typeof body?.memberId === 'number' ? Math.trunc(body.memberId) : -1;
  const pin = typeof body?.pin === 'string' ? body.pin.trim() : '';
  if (memberId < 1 || !pin) return Response.json({ error: 'Укажите сотрудника и PIN.' }, { status: 400 });
  await ensureSchema();
  const member = await env.DB.prepare('SELECT id, name, pin_hash FROM team_members WHERE id = ? AND active = 1').bind(memberId).first<StaffRow>();
  if (!member || !(await verifyStaffPin(member.name, pin, member.pin_hash))) return Response.json({ error: 'Неверный PIN.' }, { status: 401 });
  const session = await createStaffSession(member.id);
  return Response.json({ authenticated: true, member: { id: member.id, name: member.name } }, { headers: { 'set-cookie': staffSessionCookie(session.token, session.maxAge) } });
}
