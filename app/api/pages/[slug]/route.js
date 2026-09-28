import connectDB from '@/lib/db';
import Page from '@/models/Page';
import { findPage } from '@/lib/queries';
import { ok, handle, isAdmin, unauthorized, readJson, fail } from '@/lib/http';

export const dynamic = 'force-dynamic';

// GET /api/pages/:slug -> page with sections (+ sectionMap keyed by section key)
export const GET = handle(async (request, { params }) => {
  const { slug } = await params;
  const data = await findPage(slug);
  if (!data) return fail('Page not found', 404);
  return ok({ data });
});

// PUT /api/pages/:slug -> update page (admin)
export const PUT = handle(async (request, { params }) => {
  if (!isAdmin(request)) return unauthorized();
  const { slug } = await params;
  const body = await readJson(request);
  if (!body) return fail('Invalid JSON body');
  await connectDB();
  const data = await Page.findOneAndUpdate({ slug: slug.toLowerCase() }, body, { new: true, runValidators: true });
  if (!data) return fail('Page not found', 404);
  return ok({ data });
});

// DELETE /api/pages/:slug (admin)
export const DELETE = handle(async (request, { params }) => {
  if (!isAdmin(request)) return unauthorized();
  const { slug } = await params;
  await connectDB();
  const data = await Page.findOneAndDelete({ slug: slug.toLowerCase() });
  if (!data) return fail('Page not found', 404);
  return ok({ message: 'Page deleted' });
});
