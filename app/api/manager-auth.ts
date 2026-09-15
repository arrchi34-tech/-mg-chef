import { env } from 'cloudflare:workers';

const encoder = new TextEncoder();
const sessionLifetimeSeconds = 60 * 60 * 12;

function base64url(bytes: ArrayBuffer) {
  let value = '';
  for (const byte of new Uint8Array(bytes)) value += String.fromCharCode(byte);
  return btoa(value).replaceAll('+', '-').replaceAll('/', '_').replaceAll('=', '');
}

function sameBytes(left: Uint8Array, right: Uint8Array) {
  if (left.length !== right.length) return false;
  let difference = 0;
  for (let index = 0; index < left.length; index += 1) difference |= left[index] ^ right[index];
  return difference === 0;
}

async function digest(value: string) {
  return new Uint8Array(await crypto.subtle.digest('SHA-256', encoder.encode(value)));
}

async function sign(value: string) {
  const secret = String(env['MANAGER_SESSION_SECRET'] ?? '');
  if (!secret) return null;
  const key = await crypto.subtle.importKey('raw', encoder.encode(secret), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']);
  return base64url(await crypto.subtle.sign('HMAC', key, encoder.encode(value)));
}

function getCookie(request: Request, name: string) {
  const found = request.headers.get('cookie')?.split(';').map((item) => item.trim()).find((item) => item.startsWith(`${name}=`));
  return found?.slice(name.length + 1) ?? null;
}

export async function isManagerSession(request: Request) {
  const token = getCookie(request, 'manager_session');
  if (!token) return false;
  const separator = token.indexOf('.');
  if (separator < 1) return false;
  const expiresAt = Number(token.slice(0, separator));
  const signature = token.slice(separator + 1);
  if (!Number.isFinite(expiresAt) || expiresAt <= Date.now() || !signature) return false;
  const expected = await sign(`manager:${expiresAt}`);
  if (!expected) return false;
  return sameBytes(await digest(signature), await digest(expected));
}

export async function verifyManagerPassword(candidate: string) {
  const expected = String(env['MANAGER_PASSWORD'] ?? '');
  if (!expected || !candidate) return false;
  return sameBytes(await digest(candidate), await digest(expected));
}

export async function createManagerSession() {
  const expiresAt = Date.now() + sessionLifetimeSeconds * 1000;
  const signature = await sign(`manager:${expiresAt}`);
  if (!signature) throw new Error('Manager session secret is not configured.');
  return { token: `${expiresAt}.${signature}`, maxAge: sessionLifetimeSeconds };
}

export function sessionCookie(token: string, maxAge: number) {
  return `manager_session=${token}; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=${maxAge}`;
}

export const clearSessionCookie = 'manager_session=; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=0';
