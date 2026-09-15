import { env } from 'cloudflare:workers';
import { getStaffSessionMemberId } from '../../staff-auth';

export async function GET(request: Request) {
  const memberId = await getStaffSessionMemberId(request);
  if (!memberId) return Response.json({ authenticated: false });
  const member = await env.DB.prepare('SELECT id, name FROM team_members WHERE id = ? AND active = 1').bind(memberId).first<{ id: number; name: string }>();
  return Response.json({ authenticated: Boolean(member), member: member ?? null });
}
