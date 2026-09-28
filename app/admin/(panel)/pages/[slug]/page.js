import { notFound } from 'next/navigation';
import connectDB from '@/lib/db';
import Page from '@/models/Page';
import PageEditor from '@/components/admin/PageEditor';

export async function generateMetadata({ params }) {
  const { slug } = await params;
  return { title: `Edit ${slug}` };
}

export default async function EditPage({ params }) {
  const { slug } = await params;
  await connectDB();
  const page = await Page.findOne({ slug: slug.toLowerCase() }).lean();
  if (!page) notFound();
  return <PageEditor initial={JSON.parse(JSON.stringify(page))} />;
}
