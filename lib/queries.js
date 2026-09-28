import 'server-only';
import connectDB from './db';
import Setting from '@/models/Setting';
import Page from '@/models/Page';
import Item from '@/models/Item';

// Data helpers shared by the pages (server components) and the API routes.
// Pages call these directly — no HTTP round trip needed inside one Next.js app.

const plain = (doc) => (doc ? JSON.parse(JSON.stringify(doc)) : doc);

export async function findSettings() {
  await connectDB();
  return plain(await Setting.findOne().lean());
}

export async function findPage(slug) {
  await connectDB();
  const page = await Page.findOne({ slug: String(slug).toLowerCase() }).lean();
  if (!page) return null;
  const sectionMap = Object.fromEntries((page.sections || []).map((s) => [s.key, s]));
  return plain({ ...page, sectionMap });
}

export async function findItems({ types, featured, includeInactive } = {}) {
  await connectDB();
  const filter = {};
  if (types?.length) filter.type = { $in: [].concat(types) };
  if (featured) filter.featured = true;
  if (!includeInactive) filter.active = true;
  return plain(await Item.find(filter).sort({ type: 1, order: 1, createdAt: 1 }).lean());
}

/* ---- Safe wrappers for pages: never crash the page if the DB is down ---- */

async function safe(fn, fallback) {
  try {
    return await fn();
  } catch (err) {
    console.error('Database error:', err.message);
    return fallback;
  }
}

export const getSettings = () => safe(findSettings, null);

export async function getPage(slug) {
  const page = await safe(() => findPage(slug), null);
  return { page, s: page?.sectionMap || {} };
}

// Returns items grouped by type: { service: [...], product: [...] }
export async function getItems(types) {
  const list = await safe(() => findItems({ types: [].concat(types) }), []);
  const grouped = {};
  [].concat(types).forEach((t) => (grouped[t] = []));
  list.forEach((item) => (grouped[item.type] ||= []).push(item));
  return grouped;
}
