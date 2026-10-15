import crypto from 'crypto';
import { cookies } from 'next/headers';
import { prisma } from './prisma';

const COOKIE = 'utshop_session';
const SECRET = process.env.AUTH_SECRET || 'change-me';

type Session = { id: number; username: string; role: 'ADMIN' | 'STAFF'; exp: number };

function sign(payload: string) {
  return crypto.createHmac('sha256', SECRET).update(payload).digest('hex');
}

export function makeSession(user: { id: number; username: string; role: 'ADMIN' | 'STAFF' }) {
  const payload = Buffer.from(JSON.stringify({ ...user, exp: Date.now() + 1000 * 60 * 60 * 12 })).toString('base64url');
  return `${payload}.${sign(payload)}`;
}

export function readSession(): Session | null {
  const token = cookies().get(COOKIE)?.value;
  if (!token) return null;
  const [payload, signature] = token.split('.');
  if (!payload || !signature) return null;
  const expected = sign(payload);
  if (signature.length !== expected.length || !crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expected))) return null;
  try {
    const data = JSON.parse(Buffer.from(payload, 'base64url').toString()) as Session;
    if (data.exp < Date.now()) return null;
    return data;
  } catch { return null; }
}

export function setSession(token: string) {
  cookies().set(COOKIE, token, { httpOnly: true, sameSite: 'lax', secure: process.env.NODE_ENV === 'production', maxAge: 60 * 60 * 12, path: '/' });
}
export function clearSession() { cookies().delete(COOKIE); }

export async function requireUser() {
  const session = readSession();
  if (!session) throw new Error('UNAUTHORIZED');
  const user = await prisma.user.findUnique({ where: { id: session.id } });
  if (!user || !user.active) throw new Error('UNAUTHORIZED');
  return user;
}

export async function requireAdmin() {
  const user = await requireUser();
  if (user.role !== 'ADMIN') throw new Error('FORBIDDEN');
  return user;
}
