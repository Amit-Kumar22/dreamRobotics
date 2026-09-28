import Link from 'next/link';
import { MapPin, Phone, Mail, Clock, User } from 'lucide-react';

export default function Footer({ settings, services = [] }) {
  const name = settings?.companyName || 'DreamRobotics';
  const year = new Date().getFullYear();

  return (
    <footer className="bg-ink-950 text-slate-400">
      <div className="container-x grid gap-12 py-16 md:grid-cols-2 lg:grid-cols-4">
        <div className="lg:col-span-1">
          <Link href="/" className="flex items-center gap-2.5">
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-brand-500 font-display text-lg font-bold text-ink-950">
              {name.charAt(0)}
            </span>
            <span className="font-display text-lg font-bold text-white">{name}</span>
          </Link>
          <p className="mt-4 text-sm leading-relaxed">{settings?.description}</p>
          {settings?.shortTagline && <p className="mt-4 text-xs uppercase tracking-widest text-slate-500">{settings.shortTagline}</p>}
        </div>

        <div>
          <h3 className="text-sm font-semibold uppercase tracking-wider text-white">Explore</h3>
          <ul className="mt-4 space-y-2.5 text-sm">
            {[
              ['/', 'Home'],
              ['/about', 'About Us'],
              ['/services', 'Services'],
              ['/#products', 'Products'],
              ['/#projects', 'Projects'],
              ['/contact', 'Contact'],
            ].map(([href, label]) => (
              <li key={href}>
                <Link href={href} className="hover:text-brand-400">
                  {label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="text-sm font-semibold uppercase tracking-wider text-white">Services</h3>
          <ul className="mt-4 space-y-2.5 text-sm">
            {services.slice(0, 6).map((s) => (
              <li key={s._id}>
                <Link href="/services" className="hover:text-brand-400">
                  {s.title}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="text-sm font-semibold uppercase tracking-wider text-white">Get in Touch</h3>
          <ul className="mt-4 space-y-3 text-sm">
            {settings?.contactPerson && (
              <li className="flex gap-3">
                <User className="mt-0.5 h-4 w-4 shrink-0 text-brand-400" /> {settings.contactPerson}
              </li>
            )}
            {settings?.phone && (
              <li className="flex gap-3">
                <Phone className="mt-0.5 h-4 w-4 shrink-0 text-brand-400" />
                <a href={`tel:${settings.phone.replace(/\s/g, '')}`} className="hover:text-white">
                  {settings.phone}
                </a>
              </li>
            )}
            {settings?.email && (
              <li className="flex gap-3">
                <Mail className="mt-0.5 h-4 w-4 shrink-0 text-brand-400" />
                <a href={`mailto:${settings.email}`} className="hover:text-white">
                  {settings.email}
                </a>
              </li>
            )}
            {(settings?.address || settings?.city) && (
              <li className="flex gap-3">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-brand-400" />
                <span>{[settings.address, settings.state].filter(Boolean).join(', ')}</span>
              </li>
            )}
            {settings?.workingHours && (
              <li className="flex gap-3">
                <Clock className="mt-0.5 h-4 w-4 shrink-0 text-brand-400" /> {settings.workingHours}
              </li>
            )}
          </ul>
        </div>
      </div>
      <div className="border-t border-white/5">
        <div className="container-x flex flex-col items-center justify-between gap-2 py-6 text-xs sm:flex-row">
          <p>© {year} {name}. All rights reserved.</p>
          <p>Learn. Build. Innovate.</p>
        </div>
      </div>
    </footer>
  );
}
