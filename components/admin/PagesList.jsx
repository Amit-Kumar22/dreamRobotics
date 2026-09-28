'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Pencil, ExternalLink, ImageOff } from 'lucide-react';
import DataTable from './DataTable';
import { PageHeader, Badge } from './ui';
import { formatDate } from '@/lib/admin-api';

const pageUrl = (slug) => (slug === 'home' ? '/' : `/${slug}`);

const columns = [
  {
    key: 'title',
    header: 'Page',
    sortable: true,
    render: (p) => (
      <div className="flex items-center gap-3">
        {p.heroImage ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={p.heroImage} alt="" className="h-10 w-16 shrink-0 rounded-md object-cover ring-1 ring-slate-200" />
        ) : (
          <span className="flex h-10 w-16 shrink-0 items-center justify-center rounded-md bg-slate-100 text-slate-400"><ImageOff className="h-4 w-4" /></span>
        )}
        <div>
          <p className="font-medium text-slate-900">{p.title}</p>
          <p className="font-mono text-xs text-slate-400">{pageUrl(p.slug)}</p>
        </div>
      </div>
    ),
  },
  { key: 'metaDescription', header: 'SEO description', className: 'max-w-md', render: (p) => <p className="line-clamp-2 text-slate-600">{p.metaDescription || '—'}</p> },
  { key: 'sections', header: 'Sections', sortable: true, render: (p) => <Badge tone="brand">{p.sections} sections</Badge> },
  { key: 'updatedAt', header: 'Updated', sortable: true, render: (p) => <span className="whitespace-nowrap text-slate-500">{formatDate(p.updatedAt)}</span> },
  {
    key: 'actions',
    header: '',
    align: 'right',
    render: (p) => (
      <div className="flex justify-end gap-1" onClick={(e) => e.stopPropagation()}>
        <a href={pageUrl(p.slug)} target="_blank" rel="noreferrer" className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-600 hover:bg-slate-100" aria-label="View page">
          <ExternalLink className="h-4 w-4" />
        </a>
        <Link href={`/admin/pages/${p.slug}`} className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-600 hover:bg-slate-100" aria-label="Edit page">
          <Pencil className="h-4 w-4" />
        </Link>
      </div>
    ),
  },
];

export default function PagesList({ data }) {
  const router = useRouter();
  return (
    <>
      <PageHeader title="Pages" description="Headings, text, buttons and hero images for each page of the website." />
      <DataTable
        columns={columns}
        data={data}
        searchKeys={['title', 'slug', 'metaDescription']}
        searchPlaceholder="Search pages…"
        onRowClick={(p) => router.push(`/admin/pages/${p.slug}`)}
      />
    </>
  );
}
