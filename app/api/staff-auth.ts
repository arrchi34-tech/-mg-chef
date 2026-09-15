import { env } from 'cloudflare:workers';

const encoder = new TextEncoder();
const staffSessionLifetimeSeconds = 60 * 60 * 10;

function toBase64url(bytes: ArrayBuffer) {
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

async function hmac(value: string) {
  const secret = String(env['MANAGER_SESSION_SECRET'] ?? '');
  if (!secret) return null;
  const key = await crypto.subtle.importKey('raw', encoder.encode(secret), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']);
  return toBase64url(await crypto.subtle.sign('HMAC', key, encoder.encode(value)));
}

async function digest(value: string) {
  return new Uint8Array(await crypto.subtle.digest('SHA-256', encoder.encode(value)));
}

function readCookie(request: Request, name: string) {
  const found = request.headers.get('cookie')?.split(';').map((item) => item.trim()).find((item) => item.startsWith(`${name}=`));
  return found?.slice(name.length + 1) ?? null;
}

export function createPin() {
  const numbers = new Uint32Array(1);
  crypto.getRandomValues(numbers);
  return String(100000 + (numbers[0] % 900000));
}

export async function hashStaffPin(name: string, pin: string) {
  return hmac(`staff-pin:${name.trim().toLocaleLowerCase('ru-RU')}:${pin}`);
}

export async function verifyStaffPin(name: string, pin: string, expectedHash: string | null) {
  if (!expectedHash || !pin) return false;
  const actualHash = await hashStaffPin(name, pin);
  return actualHash ? sameBytes(await digest(actualHash), await digest(expectedHash)) : false;
}

export async function createStaffSession(memberId: number) {
  const expiresAt = Date.now() + staffSessionLifetimeSeconds * 1000;
  const signature = await hmac(`staff:${memberId}:${expiresAt}`);
  if (!signature) throw new Error('Staff session secret is not configured.');
  return { token: `${memberId}.${expiresAt}.${signature}`, maxAge: staffSessionLifetimeSeconds };
}

export async function getStaffSessionMemberId(request: Request) {
  const token = readCookie(request, 'staff_session');
  if (!token) return null;
  const [idText, expiresText, signature] = token.split('.');
  const id = Number(idText); const expiresAt = Number(expiresText);
  if (!Number.isInteger(id) || id < 1 || !Number.isFinite(expiresAt) || expiresAt <= Date.now() || !signature) return null;
  const expected = await hmac(`staff:${id}:${expiresAt}`);
  if (!expected || !sameBytes(await digest(signature), await digest(expected))) return null;
  return id;
}

export function staffSessionCookie(token: string, maxAge: number) {
  return `staff_session=${token}; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=${maxAge}`;
}

export const clearStaffSessionCookie = 'staff_session=; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=0';
