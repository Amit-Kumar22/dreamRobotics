import { notFound } from 'next/navigation';
import { findItems } from '@/lib/queries';
import { CONTENT_TYPES } from '@/lib/admin-nav';
import ItemsManager from '@/components/admin/ItemsManager';

export async function generateMetadata({ params }) {
  const { type } = await params;
  return { title: CONTENT_TYPES[type]?.label || 'Content' };
}

export default async function ContentPage({ params }) {
  const { type } = await params;
  if (!CONTENT_TYPES[type]) notFound();
  const data = await findItems({ types: [type], includeInactive: true });
  return <ItemsManager key={type} type={type} meta={CONTENT_TYPES[type]} initial={data} />;
}
