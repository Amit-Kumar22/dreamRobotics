'use client';

import { useState } from 'react';
import { Plus, Pencil, Trash2, Star } from 'lucide-react';
import Icon from '@/components/Icon';
import DataTable from './DataTable';
import { PageHeader, Badge, Button, Modal, ConfirmDialog, Field, Toggle, inputClass } from './ui';
import { useToast } from './Toast';
import { api, formatDate } from '@/lib/admin-api';

const empty = { title: '', description: '', icon: 'Cpu', tags: '', order: '', image: '', featured: false, active: true };

export default function ItemsManager({ type, meta, initial }) {
  const toast = useToast();
  const [rows, setRows] = useState(initial);
  const [editing, setEditing] = useState(null); // null = closed, {} = new, item = edit
  const [form, setForm] = useState(empty);
  const [deleting, setDeleting] = useState(null);
  const [busy, setBusy] = useState(false);
  const [statusFilter, setStatusFilter] = useState('all');

  const sortRows = (list) => [...list].sort((a, b) => a.order - b.order);
  const replaceRow = (item) => setRows((r) => sortRows(r.map((x) => (x._id === item._id ? item : x))));

  function openForm(item) {
    setEditing(item || {});
    setForm(
      item
        ? { ...empty, ...item, tags: (item.tags || []).join(', '), image: item.image || '' }
        : { ...empty, order: rows.length ? Math.max(...rows.map((r) => r.order || 0)) + 1 : 1 }
    );
  }

  async function save(e) {
    e.preventDefault();
    setBusy(true);
    const body = {
      type,
      title: form.title,
      description: form.description,
      icon: form.icon || 'Cpu',
      image: form.image.trim(),
      tags: form.tags.split(',').map((t) => t.trim()).filter(Boolean),
      order: Number(form.order) || 0,
      featured: form.featured,
      active: form.active,
    };
    try {
      if (editing._id) {
        const { data } = await api(`/api/items/${editing._id}`, { method: 'PUT', body });
        replaceRow(data);
        toast(`${meta.singular} updated`);
      } else {
        const { data } = await api('/api/items', { method: 'POST', body });
        setRows((r) => sortRows([...r, data]));
        toast(`${meta.singular} added`);
      }
      setEditing(null);
    } catch (err) {
      toast(err.message, 'error');
    } finally {
      setBusy(false);
    }
  }

  async function patch(item, changes) {
    try {
      const { data } = await api(`/api/items/${item._id}`, { method: 'PUT', body: changes });
      replaceRow(data);
      toast('Saved');
    } catch (err) {
      toast(err.message, 'error');
    }
  }

  async function remove() {
    setBusy(true);
    try {
      await api(`/api/items/${deleting._id}`, { method: 'DELETE' });
      setRows((r) => r.filter((x) => x._id !== deleting._id));
      toast(`${meta.singular} deleted`);
      setDeleting(null);
    } catch (err) {
      toast(err.message, 'error');
    } finally {
      setBusy(false);
    }
  }

  const data = statusFilter === 'all' ? rows : rows.filter((r) => (statusFilter === 'active' ? r.active : !r.active));

  const columns = [
    { key: 'order', header: '#', sortable: true, className: 'w-14', render: (it) => <span className="font-mono text-xs text-slate-400">{String(it.order).padStart(2, '0')}</span> },
    {
      key: 'title',
      header: 'Title',
      sortable: true,
      render: (it) => (
        <div className="flex items-center gap-3">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-brand-50 text-brand-600 ring-1 ring-brand-100">
            <Icon name={it.icon} className="h-4 w-4" />
          </span>
          <div className="min-w-0">
            <p className="flex items-center gap-1.5 font-medium text-slate-900">
              {it.title}
              {it.featured && <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" aria-label="Featured" />}
            </p>
            <p className="text-xs text-slate-400">{it.icon}</p>
          </div>
        </div>
      ),
    },
    {
      key: 'description',
      header: 'Description',
      className: 'max-w-md',
      render: (it) => (it.description ? <p className="line-clamp-2 text-slate-600">{it.description}</p> : <span className="text-slate-400">—</span>),
    },
    {
      key: 'tags',
      header: 'Tags',
      render: (it) =>
        it.tags?.length ? (
          <div className="flex flex-wrap gap-1">{it.tags.map((t) => <Badge key={t}>{t}</Badge>)}</div>
        ) : (
          <span className="text-slate-400">—</span>
        ),
    },
    {
      key: 'active',
      header: 'Visible',
      sortable: true,
      sortValue: (it) => (it.active ? 1 : 0),
      render: (it) => <Toggle checked={it.active} onChange={(v) => patch(it, { active: v })} label="Visible on website" />,
    },
    { key: 'updatedAt', header: 'Updated', sortable: true, render: (it) => <span className="whitespace-nowrap text-slate-500">{formatDate(it.updatedAt)}</span> },
    {
      key: 'actions',
      header: '',
      align: 'right',
      render: (it) => (
        <div className="flex justify-end gap-1" onClick={(e) => e.stopPropagation()}>
          <Button variant="ghost" size="icon" onClick={() => openForm(it)} aria-label="Edit"><Pencil className="h-4 w-4" /></Button>
          <Button variant="ghost" size="icon" onClick={() => setDeleting(it)} aria-label="Delete" className="hover:bg-red-50 hover:text-red-600"><Trash2 className="h-4 w-4" /></Button>
        </div>
      ),
    },
  ];

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  return (
    <>
      <PageHeader title={meta.label} description={`Shown on the ${meta.page.toLowerCase()}. Hidden items stay saved but are not displayed.`}>
        <Button variant="brand" onClick={() => openForm(null)}>
          <Plus className="h-4 w-4" /> Add {meta.singular.toLowerCase()}
        </Button>
      </PageHeader>

      <DataTable
        columns={columns}
        data={data}
        searchKeys={['title', 'description', 'tags', 'icon']}
        searchPlaceholder={`Search ${meta.label.toLowerCase()}…`}
        onRowClick={openForm}
        emptyTitle={`No ${meta.label.toLowerCase()} yet`}
        emptyText={`Click "Add ${meta.singular.toLowerCase()}" to create one.`}
        toolbar={
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className={`${inputClass} sm:w-40`} aria-label="Filter by visibility">
            <option value="all">All items</option>
            <option value="active">Visible</option>
            <option value="hidden">Hidden</option>
          </select>
        }
      />

      <Modal
        open={Boolean(editing)}
        onClose={() => setEditing(null)}
        title={editing?._id ? `Edit ${meta.singular.toLowerCase()}` : `Add ${meta.singular.toLowerCase()}`}
        description={meta.label}
        footer={
          <>
            <Button variant="secondary" onClick={() => setEditing(null)}>Cancel</Button>
            <Button type="submit" form="item-form" loading={busy}>{editing?._id ? 'Save changes' : 'Create'}</Button>
          </>
        }
      >
        <form id="item-form" onSubmit={save} className="grid gap-4 sm:grid-cols-6">
          <Field label="Title" className="sm:col-span-6">
            <input required value={form.title} onChange={set('title')} className={inputClass} placeholder="e.g. Robotics Kits" />
          </Field>
          <Field label="Description" className="sm:col-span-6">
            <textarea rows={3} value={form.description} onChange={set('description')} className={inputClass} />
          </Field>
          <Field label="Icon" hint={<>Any <a href="https://lucide.dev/icons" target="_blank" rel="noreferrer" className="text-brand-600 underline">lucide</a> icon name</>} className="sm:col-span-3">
            <div className="flex gap-2">
              <span className="flex h-[38px] w-10 shrink-0 items-center justify-center rounded-lg border border-slate-200 bg-slate-50 text-brand-600">
                <Icon name={form.icon} className="h-4 w-4" />
              </span>
              <input value={form.icon} onChange={set('icon')} className={inputClass} placeholder="Bot" />
            </div>
          </Field>
          <Field label="Display order" className="sm:col-span-3">
            <input type="number" value={form.order} onChange={set('order')} className={inputClass} />
          </Field>
          <Field label="Tags" hint="Comma separated" className="sm:col-span-6">
            <input value={form.tags} onChange={set('tags')} className={inputClass} placeholder="IoT, Sensors" />
          </Field>
          <Field label="Image URL (optional)" className="sm:col-span-6">
            <input value={form.image} onChange={set('image')} className={inputClass} placeholder="/images/example.jpg" />
          </Field>
          <div className="flex items-center justify-between rounded-lg border border-slate-200 px-4 py-3 sm:col-span-3">
            <span className="text-sm font-medium text-slate-700">Visible on website</span>
            <Toggle checked={form.active} onChange={(v) => setForm((f) => ({ ...f, active: v }))} label="Visible" />
          </div>
          <div className="flex items-center justify-between rounded-lg border border-slate-200 px-4 py-3 sm:col-span-3">
            <span className="text-sm font-medium text-slate-700">Featured</span>
            <Toggle checked={form.featured} onChange={(v) => setForm((f) => ({ ...f, featured: v }))} label="Featured" />
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        open={Boolean(deleting)}
        title={`Delete ${meta.singular.toLowerCase()}?`}
        message={deleting && `"${deleting.title}" will be removed from the website permanently. To hide it temporarily, turn off "Visible" instead.`}
        loading={busy}
        onConfirm={remove}
        onClose={() => setDeleting(null)}
      />
    </>
  );
}
