'use client';

import { useState } from 'react';
import { UserPlus, Trash2, Eye, EyeOff } from 'lucide-react';
import DataTable from './DataTable';
import { PageHeader, Badge, Button, Modal, ConfirmDialog, Field, inputClass } from './ui';
import { useToast } from './Toast';
import { api, formatDate, formatDateTime } from '@/lib/admin-api';

const empty = { name: '', email: '', password: '' };

export default function AdminUsers({ initial, currentId }) {
  const toast = useToast();
  const [rows, setRows] = useState(initial);
  const [adding, setAdding] = useState(false);
  const [form, setForm] = useState(empty);
  const [showPw, setShowPw] = useState(false);
  const [deleting, setDeleting] = useState(null);
  const [busy, setBusy] = useState(false);

  async function create(e) {
    e.preventDefault();
    setBusy(true);
    try {
      const { data } = await api('/api/admins', { method: 'POST', body: form });
      setRows((r) => [...r, data]);
      toast(`${data.email} can now log in`);
      setAdding(false);
      setForm(empty);
    } catch (err) {
      toast(err.message === 'Duplicate value' ? 'An admin with this email already exists' : err.message, 'error');
    } finally {
      setBusy(false);
    }
  }

  async function remove() {
    setBusy(true);
    try {
      await api(`/api/admins/${deleting._id}`, { method: 'DELETE' });
      setRows((r) => r.filter((a) => a._id !== deleting._id));
      toast('Admin removed');
      setDeleting(null);
    } catch (err) {
      toast(err.message, 'error');
    } finally {
      setBusy(false);
    }
  }

  const columns = [
    {
      key: 'name',
      header: 'Name',
      sortable: true,
      render: (a) => (
        <div className="flex items-center gap-3">
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-brand-400 to-brand-600 text-xs font-bold text-white">
            {(a.name || a.email).split(/\s+/).map((w) => w[0]).slice(0, 2).join('').toUpperCase()}
          </span>
          <div>
            <p className="flex items-center gap-2 font-medium text-slate-900">
              {a.name} {a._id === currentId && <Badge tone="brand">You</Badge>}
            </p>
            <p className="text-xs text-slate-500">{a.email}</p>
          </div>
        </div>
      ),
    },
    { key: 'role', header: 'Role', render: () => <Badge tone="slate">Administrator</Badge> },
    { key: 'lastLoginAt', header: 'Last login', sortable: true, render: (a) => <span className="whitespace-nowrap text-slate-500">{a.lastLoginAt ? formatDateTime(a.lastLoginAt) : 'Never'}</span> },
    { key: 'createdAt', header: 'Added', sortable: true, render: (a) => <span className="whitespace-nowrap text-slate-500">{formatDate(a.createdAt)}</span> },
    {
      key: 'actions',
      header: '',
      align: 'right',
      render: (a) =>
        a._id !== currentId && (
          <Button variant="ghost" size="icon" onClick={() => setDeleting(a)} aria-label="Remove admin" className="hover:bg-red-50 hover:text-red-600">
            <Trash2 className="h-4 w-4" />
          </Button>
        ),
    },
  ];

  return (
    <>
      <PageHeader title="Admin Users" description="People who can log in to this admin panel.">
        <Button variant="brand" onClick={() => setAdding(true)}>
          <UserPlus className="h-4 w-4" /> Add admin
        </Button>
      </PageHeader>

      <DataTable columns={columns} data={rows} searchKeys={['name', 'email']} searchPlaceholder="Search admins…" />

      <Modal
        open={adding}
        onClose={() => setAdding(false)}
        title="Add admin"
        description="They can log in at /admin with this email and password."
        size="sm"
        footer={
          <>
            <Button variant="secondary" onClick={() => setAdding(false)}>Cancel</Button>
            <Button type="submit" form="admin-form" loading={busy}>Create admin</Button>
          </>
        }
      >
        <form id="admin-form" onSubmit={create} className="space-y-4">
          <Field label="Full name">
            <input required value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} className={inputClass} />
          </Field>
          <Field label="Email">
            <input required type="email" value={form.email} onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))} className={inputClass} />
          </Field>
          <Field label="Password" hint="At least 8 characters">
            <div className="relative">
              <input
                required
                minLength={8}
                type={showPw ? 'text' : 'password'}
                autoComplete="new-password"
                value={form.password}
                onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
                className={`${inputClass} pr-10`}
              />
              <button type="button" onClick={() => setShowPw((s) => !s)} className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-700" aria-label={showPw ? 'Hide password' : 'Show password'}>
                {showPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </Field>
        </form>
      </Modal>

      <ConfirmDialog
        open={Boolean(deleting)}
        title="Remove admin?"
        message={deleting && `${deleting.name} (${deleting.email}) will no longer be able to log in.`}
        confirmText="Remove"
        loading={busy}
        onConfirm={remove}
        onClose={() => setDeleting(null)}
      />
    </>
  );
}
