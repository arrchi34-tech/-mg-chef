import { clearSessionCookie } from '../../manager-auth';

export async function POST() {
  return Response.json({ authenticated: false }, { headers: { 'set-cookie': clearSessionCookie } });
}
