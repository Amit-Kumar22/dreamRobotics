'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { PageHeader, Button, Field, Card, inputClass } from './ui';
import { useToast } from './Toast';
import { api } from '@/lib/admin-api';

const GROUPS = [
  {
    title: 'Company',
    description: 'Shown in the header, footer and page titles.',
    fields: [
      ['companyName', 'Company name'],
      ['tagline', 'Tagline'],
      ['shortTagline', 'Short tagline', 'full'],
      ['description', 'Description', 'textarea'],
    ],
  },
  {
    title: 'Contact details',
    description: 'Shown on the contact page and in the footer.',
    fields: [
      ['contactPerson', 'Contact person'],
      ['phone', 'Phone'],
      ['whatsapp', 'WhatsApp number', null, 'Country code + number, digits only (e.g. 917542981219)'],
      ['email', 'Email'],
      ['address', 'Address'],
      ['city', 'City'],
      ['state', 'State / country'],
      ['workingHours', 'Working hours'],
      ['mapEmbedUrl', 'Google Maps embed URL', 'full'],
    ],
  },
  {
    title: 'Social media',
    description: 'Leave empty to hide an icon.',
    fields: [
      ['socials.facebook', 'Facebook'],
      ['socials.instagram', 'Instagram'],
      ['socials.youtube', 'YouTube'],
      ['socials.linkedin', 'LinkedIn'],
    ],
  },
];

const get = (obj, path) => path.split('.').reduce((o, k) => o?.[k], obj) ?? '';

export default function SettingsForm({ initial }) {
  const router = useRouter();
  const toast = useToast();
  const [form, setForm] = useState(initial);
  const [busy, setBusy] = useState(false);

  const set = (path) => (e) => {
    const value = e.target.value;
    setForm((f) => {
      const [a, b] = path.split('.');
      return b ? { ...f, [a]: { ...(f[a] || {}), [b]: value } } : { ...f, [a]: value };
    });
  };

  async function save(e) {
    e.preventDefault();
    setBusy(true);
    try {
      const { _id, createdAt, updatedAt, __v, ...body } = form;
      const { data } = await api('/api/settings', { method: 'PUT', body });
      setForm(data);
      toast('Settings saved');
      router.refresh();
    } catch (err) {
      toast(err.message, 'error');
    } finally {
      setBusy(false);
    }
  }

  return (
    <form onSubmit={save}>
      <PageHeader title="Company Settings" description="Company information used across the whole website.">
        <Button type="submit" loading={busy}>Save changes</Button>
      </PageHeader>

      <div className="space-y-6">
        {GROUPS.map((g) => (
          <Card key={g.title} title={g.title} description={g.description}>
            <div className="grid gap-4 md:grid-cols-2">
              {g.fields.map(([path, label, kind, hint]) => (
                <Field key={path} label={label} hint={hint} className={kind ? 'md:col-span-2' : ''}>
                  {kind === 'textarea' ? (
                    <textarea rows={3} value={get(form, path)} onChange={set(path)} className={inputClass} />
                  ) : (
                    <input value={get(form, path)} onChange={set(path)} className={inputClass} />
                  )}
                </Field>
              ))}
            </div>
          </Card>
        ))}
        <div className="flex justify-end">
          <Button type="submit" loading={busy}>Save changes</Button>
        </div>
      </div>
    </form>
  );
}
