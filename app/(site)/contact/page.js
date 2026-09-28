import { Phone, MapPin, User, Clock, MessageCircle, Mail } from 'lucide-react';
import ContactForm from '@/components/ContactForm';
import { PageHero, ApiNotice } from '@/components/ui';
import { getPage, getItems, getSettings } from '@/lib/queries';

export const dynamic = 'force-dynamic';

export async function generateMetadata() {
  const { page } = await getPage('contact');
  return { title: page?.title || 'Contact', description: page?.metaDescription };
}

export default async function ContactPage() {
  const [{ page, s }, items, settings] = await Promise.all([getPage('contact'), getItems('service'), getSettings()]);

  const tel = settings?.phone?.replace(/\s/g, '');
  const details = [
    settings?.contactPerson && { icon: User, label: 'Contact Person', value: settings.contactPerson },
    settings?.phone && { icon: Phone, label: 'Phone', value: settings.phone, href: `tel:${tel}` },
    settings?.whatsapp && { icon: MessageCircle, label: 'WhatsApp', value: 'Chat with us', href: `https://wa.me/${settings.whatsapp}` },
    settings?.email && { icon: Mail, label: 'Email', value: settings.email, href: `mailto:${settings.email}` },
    (settings?.address || settings?.city) && {
      icon: MapPin,
      label: 'Address',
      value: [settings.address, settings.state].filter(Boolean).join(', '),
    },
    settings?.workingHours && { icon: Clock, label: 'Working Hours', value: settings.workingHours },
  ].filter(Boolean);

  return (
    <>
      <PageHero section={s.hero} />
      {!page && <ApiNotice />}

      <section className="section bg-slate-50">
        <div className="container-x grid gap-8 lg:grid-cols-5">
          {/* Details */}
          <aside className="lg:col-span-2">
            <div className="h-full rounded-2xl bg-ink-900 p-8 text-slate-300">
              <h2 className="text-2xl font-bold text-white">{settings?.companyName || 'DreamRobotics'}</h2>
              <p className="mt-2 text-sm text-slate-400">{settings?.shortTagline}</p>
              <ul className="mt-8 space-y-5">
                {details.map(({ icon: IconCmp, label, value, href }) => (
                  <li key={label} className="flex gap-4">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-brand-500/15 text-brand-300">
                      <IconCmp className="h-5 w-5" />
                    </span>
                    <div>
                      <p className="text-xs uppercase tracking-wider text-slate-500">{label}</p>
                      {href ? (
                        <a href={href} target={href.startsWith('http') ? '_blank' : undefined} rel="noreferrer" className="font-medium text-white hover:text-brand-300">
                          {value}
                        </a>
                      ) : (
                        <p className="font-medium text-white">{value}</p>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
              {tel && (
                <a href={`tel:${tel}`} className="btn-primary mt-10 w-full">
                  <Phone className="h-4 w-4" /> Call Now
                </a>
              )}
            </div>
          </aside>

          {/* Form */}
          <div className="rounded-2xl bg-white p-8 shadow-sm ring-1 ring-slate-200 lg:col-span-3">
            <h2 className="text-2xl font-bold">{s.form?.title || 'Send us your requirement'}</h2>
            {s.form?.subtitle && <p className="mt-2 text-sm text-slate-600">{s.form.subtitle}</p>}
            <div className="mt-8">
              <ContactForm services={items.service} />
            </div>
          </div>
        </div>

        {settings?.mapEmbedUrl && (
          <div className="container-x mt-8">
            <div className="overflow-hidden rounded-2xl ring-1 ring-slate-200">
              <iframe
                title="Location map"
                src={settings.mapEmbedUrl}
                className="h-80 w-full border-0"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>
        )}
      </section>
    </>
  );
}
