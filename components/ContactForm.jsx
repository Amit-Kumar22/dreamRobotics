'use client';

import { useState } from 'react';
import { Send, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';

const initial = { name: '', phone: '', email: '', service: '', message: '' };

export default function ContactForm({ services = [] }) {
  const [form, setForm] = useState(initial);
  const [status, setStatus] = useState({ state: 'idle', message: '' });

  const onChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  async function onSubmit(e) {
    e.preventDefault();
    setStatus({ state: 'loading', message: '' });
    try {
      const res = await fetch('/api/enquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, subject: form.service || 'General enquiry' }),
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(json.message || 'Something went wrong. Please try again.');
      setStatus({ state: 'success', message: json.message });
      setForm(initial);
    } catch (err) {
      setStatus({ state: 'error', message: err.message || 'Unable to reach the server.' });
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-5" noValidate={false}>
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="name" className="mb-1.5 block text-sm font-medium text-slate-700">
            Full name <span className="text-red-500">*</span>
          </label>
          <input id="name" name="name" required maxLength={100} value={form.name} onChange={onChange} className="field" placeholder="Your name" />
        </div>
        <div>
          <label htmlFor="phone" className="mb-1.5 block text-sm font-medium text-slate-700">
            Phone <span className="text-red-500">*</span>
          </label>
          <input
            id="phone"
            name="phone"
            type="tel"
            required
            pattern="[+]?[0-9\s\-]{7,15}"
            value={form.phone}
            onChange={onChange}
            className="field"
            placeholder="10-digit mobile number"
          />
        </div>
      </div>
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label htmlFor="email" className="mb-1.5 block text-sm font-medium text-slate-700">
            Email
          </label>
          <input id="email" name="email" type="email" value={form.email} onChange={onChange} className="field" placeholder="you@example.com" />
        </div>
        <div>
          <label htmlFor="service" className="mb-1.5 block text-sm font-medium text-slate-700">
            Interested in
          </label>
          <select id="service" name="service" value={form.service} onChange={onChange} className="field">
            <option value="">Select a service</option>
            {services.map((s) => (
              <option key={s._id} value={s.title}>
                {s.title}
              </option>
            ))}
            <option value="Products">Products / Components</option>
            <option value="Other">Other</option>
          </select>
        </div>
      </div>
      <div>
        <label htmlFor="message" className="mb-1.5 block text-sm font-medium text-slate-700">
          Your requirement <span className="text-red-500">*</span>
        </label>
        <textarea
          id="message"
          name="message"
          required
          minLength={10}
          maxLength={3000}
          rows={5}
          value={form.message}
          onChange={onChange}
          className="field resize-y"
          placeholder="Tell us about your idea, project, dimensions or requirement..."
        />
      </div>

      {status.state === 'success' && (
        <p className="flex items-start gap-2 rounded-lg bg-emerald-50 p-4 text-sm text-emerald-800" role="status">
          <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" /> {status.message}
        </p>
      )}
      {status.state === 'error' && (
        <p className="flex items-start gap-2 rounded-lg bg-red-50 p-4 text-sm text-red-700" role="alert">
          <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" /> {status.message}
        </p>
      )}

      <button type="submit" disabled={status.state === 'loading'} className="btn-primary w-full disabled:opacity-60 sm:w-auto">
        {status.state === 'loading' ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
        {status.state === 'loading' ? 'Sending...' : 'Send Enquiry'}
      </button>
    </form>
  );
}
