import { isManagerSession } from '../../manager-auth';

export async function GET(request: Request) {
  return Response.json({ authenticated: await isManagerSession(request) });
}
