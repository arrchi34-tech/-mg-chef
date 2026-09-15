import { createManagerSession, sessionCookie, verifyManagerPassword } from '../../manager-auth';

export async function POST(request: Request) {
  const body = await request.json().catch(() => null) as Record<string, unknown> | null;
  const password = typeof body?.password === 'string' ? body.password : '';
  if (!(await verifyManagerPassword(password))) return Response.json({ error: 'Неверный пароль.' }, { status: 401 });
  const session = await createManagerSession();
  return Response.json({ authenticated: true }, { headers: { 'set-cookie': sessionCookie(session.token, session.maxAge) } });
}
