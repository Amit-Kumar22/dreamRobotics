import 'server-only';
import { cookies } from 'next/headers';
import { SESSION_COOKIE, verifySessionToken } from './auth';

// Logged-in admin for server components, or null.
export async function getAdminSession() {
  const store = await cookies();
  return verifySessionToken(store.get(SESSION_COOKIE)?.value);
}
