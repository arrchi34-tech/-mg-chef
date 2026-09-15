import { clearStaffSessionCookie } from '../../staff-auth';

export async function POST() {
  return Response.json({ authenticated: false }, { headers: { 'set-cookie': clearStaffSessionCookie } });
}
