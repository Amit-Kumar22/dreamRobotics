import { NextResponse } from 'next/server';
import { SESSION_COOKIE, verifySessionToken } from './auth';

export const ok = (data, init = {}) => NextResponse.json({ success: true, ...data }, init);
export const fail = (message, status = 400, extra = {}) =>
  NextResponse.json({ success: false, message, ...extra }, { status });

// Admin-only routes: either log in at /admin (session cookie) or send the key in the "x-admin-key" header.
export function isAdmin(request) {
  const key = request.headers.get('x-admin-key');
  if (process.env.ADMIN_KEY && key === process.env.ADMIN_KEY) return true;
  return Boolean(verifySessionToken(request.cookies.get(SESSION_COOKIE)?.value));
}

export const unauthorized = () => fail('Unauthorized', 401);

export async function readJson(request) {
  try {
    return await request.json();
  } catch {
    return null;
  }
}

// Wraps a route handler and turns Mongoose errors into clean JSON responses.
export function handle(fn) {
  return async (request, ctx) => {
    try {
      return await fn(request, ctx);
    } catch (err) {
      if (err.name === 'ValidationError') {
        const errors = Object.values(err.errors).map((e) => e.message);
        return fail('Validation failed', 400, { errors });
      }
      if (err.name === 'CastError') return fail('Invalid id', 400);
      if (err.code === 11000) return fail('Duplicate value', 409, { fields: err.keyValue });
      if (err.name === 'MongooseServerSelectionError' || err.name === 'MongoServerSelectionError') {
        return fail('Database is not reachable', 503);
      }
      console.error(err);
      return fail(err.message || 'Server error', 500);
    }
  };
}

// Simple in-memory rate limiter (per server instance) for the public contact form.
const hits = new Map();
export function rateLimited(request, { limit = 10, windowMs = 15 * 60 * 1000 } = {}) {
  const ip = (request.headers.get('x-forwarded-for') || '').split(',')[0].trim() || 'local';
  const now = Date.now();
  const entry = hits.get(ip);
  if (!entry || now > entry.reset) {
    hits.set(ip, { count: 1, reset: now + windowMs });
    return false;
  }
  entry.count += 1;
  return entry.count > limit;
}
