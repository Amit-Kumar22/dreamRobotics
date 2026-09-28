'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { PageHeader, Button, Field, Card, inputClass } from './ui';
import { useToast } from './Toast';
import { api, formatDate, formatDateTime } from '@/lib/admin-api';

export default function ProfileForm({ admin }) {
  const router = useRouter();
  const toast = useToast();
  const [name, setName] = useState(admin.name);
  const [pw, setPw] = useState({ currentPassword: '', newPassword: '', confirm: '' });
  const [busy, setBusy] = useState('');

  async function saveName(e) {
    e.preventDefault();
    setBusy('name');
    try {
      await api('/api/auth/me', { method: 'PUT', body: { name } });
      toast('Profile updated');
      router.refresh();
    } catch (err) {
      toast(err.message, 'error');
    } finally {
      setBusy('');
    }
  }

  async function savePassword(e) {
    e.preventDefault();
    if (pw.newPassword !== pw.confirm) return toast('New passwords do not match', 'error');
    setBusy('pw');
    try {
      await api('/api/auth/me', { method: 'PUT', body: { currentPassword: pw.currentPassword, newPassword: pw.newPassword } });
      toast('Password changed');
      setPw({ currentPassword: '', newPassword: '', confirm: '' });
    } catch (err) {
      toast(err.message, 'error');
    } finally {
      setBusy('');
    }
  }

  const initials = (name || admin.email).split(/\s+/).map((w) => w[0]).slice(0, 2).join('').toUpperCase();

  return (
    <>
      <PageHeader title="My Profile" description="Your account details and password." />

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 text-center shadow-sm">
          <span className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-brand-400 to-brand-600 font-display text-2xl font-bold text-white">
            {initials}
          </span>
          <p className="mt-4 text-lg font-semibold text-slate-900">{name}</p>
          <p className="text-sm text-slate-500">{admin.email}</p>
          <dl className="mt-6 space-y-2 border-t border-slate-100 pt-4 text-left text-sm">
            <div className="flex justify-between"><dt className="text-slate-500">Role</dt><dd className="font-medium text-slate-900">Administrator</dd></div>
            <div className="flex justify-between"><dt className="text-slate-500">Member since</dt><dd className="font-medium text-slate-900">{formatDate(admin.createdAt)}</dd></div>
            <div className="flex justify-between gap-4"><dt className="text-slate-500">Last login</dt><dd className="text-right font-medium text-slate-900">{formatDateTime(admin.lastLoginAt)}</dd></div>
          </dl>
        </div>

        <div className="space-y-6 lg:col-span-2">
          <Card title="Personal information">
            <form onSubmit={saveName} className="grid gap-4 sm:grid-cols-2">
              <Field label="Full name">
                <input required value={name} onChange={(e) => setName(e.target.value)} className={inputClass} />
              </Field>
              <Field label="Email" hint="Email cannot be changed here.">
                <input value={admin.email} disabled className={`${inputClass} bg-slate-50 text-slate-500`} />
              </Field>
              <div className="flex justify-end sm:col-span-2">
                <Button type="submit" loading={busy === 'name'}>Save</Button>
              </div>
            </form>
          </Card>

          <Card title="Change password" description="Use at least 8 characters.">
            <form onSubmit={savePassword} className="grid gap-4 sm:grid-cols-2">
              <Field label="Current password" className="sm:col-span-2">
                <input required type="password" autoComplete="current-password" value={pw.currentPassword} onChange={(e) => setPw((p) => ({ ...p, currentPassword: e.target.value }))} className={inputClass} />
              </Field>
              <Field label="New password">
                <input required minLength={8} type="password" autoComplete="new-password" value={pw.newPassword} onChange={(e) => setPw((p) => ({ ...p, newPassword: e.target.value }))} className={inputClass} />
              </Field>
              <Field label="Confirm new password">
                <input required minLength={8} type="password" autoComplete="new-password" value={pw.confirm} onChange={(e) => setPw((p) => ({ ...p, confirm: e.target.value }))} className={inputClass} />
              </Field>
              <div className="flex justify-end sm:col-span-2">
                <Button type="submit" loading={busy === 'pw'}>Update password</Button>
              </div>
            </form>
          </Card>
        </div>
      </div>
    </>
  );
}
