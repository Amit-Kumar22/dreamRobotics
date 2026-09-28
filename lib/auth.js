import crypto from 'crypto';

// Admin session = signed token in an httpOnly cookie: base64url(payload).signature
export const SESSION_COOKIE = 'dr_admin';
const MAX_AGE = 7 * 24 * 60 * 60; // seconds

const secret = () => process.env.AUTH_SECRET || process.env.ADMIN_KEY || '';
const sign = (data) => crypto.createHmac('sha256', secret()).update(data).digest('base64url');

export function createSessionToken(admin) {
  if (!secret()) throw new Error('AUTH_SECRET is not set');
  const payload = Buffer.from(
    JSON.stringify({ id: String(admin._id), email: admin.email, name: admin.name, exp: Date.now() + MAX_AGE * 1000 })
  ).toString('base64url');
  return `${payload}.${sign(payload)}`;
}

// Returns the session payload, or null if the token is missing, tampered with or expired.
export function verifySessionToken(token) {
  if (!token || !secret()) return null;
  const [payload, signature] = String(token).split('.');
  if (!payload || !signature) return null;
  const expected = Buffer.from(sign(payload));
  const actual = Buffer.from(signature);
  if (expected.length !== actual.length || !crypto.timingSafeEqual(expected, actual)) return null;
  try {
    const data = JSON.parse(Buffer.from(payload, 'base64url').toString());
    return data.exp > Date.now() ? data : null;
  } catch {
    return null;
  }
}

export const sessionCookie = (token) => ({
  name: SESSION_COOKIE,
  value: token,
  httpOnly: true,
  sameSite: 'lax',
  secure: process.env.NODE_ENV === 'production',
  path: '/',
  maxAge: token ? MAX_AGE : 0,
});
