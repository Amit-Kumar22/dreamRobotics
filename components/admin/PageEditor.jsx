'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, Pencil, ExternalLink, Image as ImageIcon } from 'lucide-react';
import DataTable from './DataTable';
import { PageHeader, Button, Modal, Field, Card, Badge, inputClass } from './ui';
import { useToast } from './Toast';
import { api, formatDateTime } from '@/lib/admin-api';

const SECTION_FIELDS = [
  ['eyebrow', 'Eyebrow (small label above the heading)'],
  ['title', 'Heading'],
  ['subtitle', 'Subtitle', 'textarea'],
  ['body', 'Body text', 'textarea'],
  ['ctaText', 'Button text'],
  ['ctaLink', 'Button link'],
  ['image', 'Background image URL'],
];

export default function PageEditor({ initial }) {
  const toast = useToast();
  const [page, setPage] = useState(initial);
  const [details, setDetails] = useState({ title: initial.title, metaDescription: initial.metaDescription || '' });
  const [editing, setEditing] = useState(null); // index of section
  const [form, setForm] = useState({});
  const [busy, setBusy] = useState(false);

  const url = page.slug === 'home' ? '/' : `/${page.slug}`;

  async function savePage(changes, message) {
    setBusy(true);
    try {
      const { data } = await api(`/api/pages/${page.slug}`, { method: 'PUT', body: changes });
      setPage(data);
      toast(message);
      return true;
    } catch (err) {
      toast(err.message, 'error');
      return false;
    } finally {
      setBusy(false);
    }
  }

  function openSection(section) {
    const index = page.sections.findIndex((s) => s.key === section.key);
    setEditing(index);
    setForm(Object.fromEntries(SECTION_FIELDS.map(([k]) => [k, section[k] || ''])));
  }

  async function saveSection(e) {
    e.preventDefault();
    const sections = page.sections.map((s, i) => (i === editing ? { ...s, ...form } : s));
    if (await savePage({ sections }, 'Section saved')) setEditing(null);
  }

  const columns = [
    { key: 'key', header: 'Section', render: (s) => <Badge tone="brand">{s.key}</Badge> },
    {
      key: 'title',
      header: 'Heading',
      render: (s) => (
        <div className="max-w-md">
          <p className="font-medium text-slate-900">{s.title || '—'}</p>
          {s.eyebrow && <p className="text-xs uppercase tracking-wider text-slate-400">{s.eyebrow}</p>}
        </div>
      ),
    },
    { key: 'subtitle', header: 'Text', className: 'max-w-sm', render: (s) => <p className="line-clamp-2 text-slate-600">{s.subtitle || s.body || '—'}</p> },
    {
      key: 'image',
      header: 'Image',
      render: (s) =>
        s.image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={s.image} alt="" className="h-9 w-14 rounded-md object-cover ring-1 ring-slate-200" />
        ) : (
          <span className="text-slate-400">—</span>
        ),
    },
    {
      key: 'actions',
      header: '',
      align: 'right',
      render: (s) => (
        <Button variant="ghost" size="icon" onClick={(e) => { e.stopPropagation(); openSection(s); }} aria-label="Edit section">
          <Pencil className="h-4 w-4" />
        </Button>
      ),
    },
  ];

  return (
    <>
      <Link href="/admin/pages" className="mb-4 inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-900">
        <ArrowLeft className="h-4 w-4" /> All pages
      </Link>
      <PageHeader title={page.title} description={`Last updated ${formatDateTime(page.updatedAt)}`}>
        <a href={url} target="_blank" rel="noreferrer">
          <Button variant="secondary"><ExternalLink className="h-4 w-4" /> View page</Button>
        </a>
      </PageHeader>

      <div className="space-y-6">
        <Card title="Page details" description="Used in the browser tab and search engine results.">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              savePage(details, 'Page details saved');
            }}
            className="grid gap-4 md:grid-cols-3"
          >
            <Field label="Page title">
              <input required value={details.title} onChange={(e) => setDetails((d) => ({ ...d, title: e.target.value }))} className={inputClass} />
            </Field>
            <Field label="SEO description" className="md:col-span-2">
              <input value={details.metaDescription} onChange={(e) => setDetails((d) => ({ ...d, metaDescription: e.target.value }))} className={inputClass} />
            </Field>
            <div className="md:col-span-3 flex justify-end">
              <Button type="submit" loading={busy && editing === null}>Save details</Button>
            </div>
          </form>
        </Card>

        <div>
          <h2 className="mb-3 text-base font-semibold text-slate-900">Sections</h2>
          <DataTable
            columns={columns}
            data={page.sections}
            rowKey="key"
            searchKeys={['key', 'title', 'eyebrow', 'subtitle', 'body']}
            searchPlaceholder="Search sections…"
            onRowClick={openSection}
          />
        </div>
      </div>

      <Modal
        open={editing !== null}
        onClose={() => setEditing(null)}
        title={`Edit section: ${page.sections[editing]?.key || ''}`}
        description={page.title}
        size="lg"
        footer={
          <>
            <Button variant="secondary" onClick={() => setEditing(null)}>Cancel</Button>
            <Button type="submit" form="section-form" loading={busy}>Save section</Button>
          </>
        }
      >
        <form id="section-form" onSubmit={saveSection} className="grid gap-4 sm:grid-cols-2">
          {SECTION_FIELDS.map(([key, label, kind]) => (
            <Field key={key} label={label} className={kind === 'textarea' || key === 'image' || key === 'title' ? 'sm:col-span-2' : ''}>
              {kind === 'textarea' ? (
                <textarea rows={3} value={form[key] || ''} onChange={(e) => setForm((f) => ({ ...f, [key]: e.target.value }))} className={inputClass} />
              ) : (
                <input value={form[key] || ''} onChange={(e) => setForm((f) => ({ ...f, [key]: e.target.value }))} className={inputClass} />
              )}
            </Field>
          ))}
          {form.image && (
            <div className="sm:col-span-2">
              <p className="mb-1.5 flex items-center gap-1.5 text-xs font-medium text-slate-500"><ImageIcon className="h-3.5 w-3.5" /> Preview</p>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={form.image} alt="" className="h-40 w-full rounded-lg object-cover ring-1 ring-slate-200" />
            </div>
          )}
        </form>
      </Modal>
    </>
  );
}
