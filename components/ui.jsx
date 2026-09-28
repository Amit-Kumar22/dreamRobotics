import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import Icon from './Icon';

export function SectionHeader({ section, align = 'center', dark = false, children }) {
  if (!section) return null;
  const center = align === 'center';
  return (
    <div className={`${center ? 'mx-auto max-w-2xl text-center' : 'max-w-2xl'} mb-8 sm:mb-10`}>
      {section.eyebrow && <p className={`eyebrow ${dark ? 'text-brand-400' : ''}`}>{section.eyebrow}</p>}
      {section.title && (
        <h2 className={`mt-2 text-2xl font-bold tracking-tight sm:text-3xl ${dark ? 'text-white' : ''}`}>{section.title}</h2>
      )}
      {section.subtitle && <p className={`mt-3 text-base leading-relaxed ${dark ? 'text-slate-400' : 'text-slate-600'}`}>{section.subtitle}</p>}
      {children}
    </div>
  );
}

// Full-bleed background photo with a dark gradient on top so white text stays readable
export function HeroImage({ src }) {
  if (!src) return null;
  return (
    <>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={src} alt="" aria-hidden="true" fetchPriority="high" className="absolute inset-0 h-full w-full object-cover" />
      <div className="absolute inset-0 bg-gradient-to-r from-ink-950/95 from-10% via-ink-950/80 via-45% to-ink-950/40" />
      <div className="absolute inset-0 bg-gradient-to-t from-ink-950/70 via-transparent to-ink-950/50" />
    </>
  );
}

// Dark page header used by inner pages
export function PageHero({ section }) {
  return (
    <section className="relative overflow-hidden bg-ink-950 pb-14 pt-28 sm:pb-16 sm:pt-32">
      <HeroImage src={section?.image} />
      <div className="absolute inset-0 bg-grid bg-grid [mask-image:radial-gradient(ellipse_at_top,black_30%,transparent_75%)]" />
      <div className="absolute -top-32 left-1/2 h-72 w-[40rem] -translate-x-1/2 rounded-full bg-brand-500/20 blur-3xl" />
      <div className="container-x relative">
        <div className="max-w-3xl">
          {section?.eyebrow && <p className="eyebrow text-brand-400">{section.eyebrow}</p>}
          <h1 className="mt-3 text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-5xl">{section?.title}</h1>
          {section?.subtitle && <p className="mt-4 text-base leading-relaxed text-slate-400 sm:text-lg">{section.subtitle}</p>}
        </div>
      </div>
    </section>
  );
}

export function FeatureCard({ item, index }) {
  return (
    <div className="card group h-full">
      <div className="flex items-start justify-between">
        <div className="icon-tile transition group-hover:bg-brand-500 group-hover:text-ink-950">
          <Icon name={item.icon} />
        </div>
        {typeof index === 'number' && (
          <span className="font-display text-sm font-semibold text-slate-300">{String(index + 1).padStart(2, '0')}</span>
        )}
      </div>
      <h3 className="mt-4 text-base font-semibold sm:text-lg">{item.title}</h3>
      {item.description && <p className="mt-2 text-sm leading-relaxed text-slate-600">{item.description}</p>}
      {item.tags?.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-2">
          {item.tags.map((t) => (
            <span key={t} className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600">
              {t}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

export function CtaBanner({ section, settings }) {
  if (!section) return null;
  return (
    <section className="section bg-white">
      <div className="container-x">
        <div className="relative overflow-hidden rounded-2xl bg-ink-900 px-6 py-10 sm:px-10 sm:py-12">
          <div className="absolute inset-0 bg-grid bg-grid opacity-60" />
          <div className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-brand-500/25 blur-3xl" />
          <div className="relative flex flex-col items-start justify-between gap-6 lg:flex-row lg:items-center">
            <div className="max-w-2xl">
              <h2 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">{section.title}</h2>
              {section.subtitle && <p className="mt-3 text-base text-slate-400">{section.subtitle}</p>}
            </div>
            <div className="flex flex-wrap gap-3">
              <Link href={section.ctaLink || '/contact'} className="btn-primary">
                {section.ctaText || 'Contact Us'} <ArrowRight className="h-4 w-4" />
              </Link>
              {settings?.phone && (
                <a href={`tel:${settings.phone.replace(/\s/g, '')}`} className="btn-ghost">
                  Call {settings.phone}
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export function ApiNotice() {
  return (
    <div className="container-x py-10">
      <div className="rounded-xl border border-amber-200 bg-amber-50 p-5 text-sm text-amber-800">
        Content could not be loaded. Make sure MongoDB is running (MONGODB_URI in .env.local) and the database is seeded
        (<code className="font-mono">npm run seed</code>).
      </div>
    </div>
  );
}
