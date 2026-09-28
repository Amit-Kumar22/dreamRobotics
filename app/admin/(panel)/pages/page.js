import connectDB from '@/lib/db';
import Page from '@/models/Page';
import PagesList from '@/components/admin/PagesList';

export const metadata = { title: 'Pages' };

export default async function PagesPage() {
  await connectDB();
  const pages = await Page.find().sort({ createdAt: 1 }).lean();
  const data = pages.map((p) => ({
    _id: String(p._id),
    slug: p.slug,
    title: p.title,
    metaDescription: p.metaDescription || '',
    sections: p.sections?.length || 0,
    heroImage: p.sections?.find((s) => s.key === 'hero')?.image || '',
    updatedAt: p.updatedAt?.toISOString(),
  }));
  return <PagesList data={data} />;
}
