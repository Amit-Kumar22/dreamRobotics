// Admin sidebar menu + labels for every item type. Plain data so both server and client code can import it.
// Keep the content types in sync with ITEM_TYPES in models/Item.js.

export const CONTENT_TYPES = {
  service: { label: 'Services', singular: 'Service', icon: 'Wrench', page: 'Services page' },
  product: { label: 'Products', singular: 'Product', icon: 'Package', page: 'Home page' },
  project: { label: 'Projects', singular: 'Project', icon: 'FolderKanban', page: 'Home page' },
  'what-we-do': { label: 'What We Do', singular: 'Capability', icon: 'Sparkles', page: 'Home page' },
  journey: { label: 'Idea → Solution', singular: 'Step', icon: 'Route', page: 'Home page' },
  'why-us': { label: 'Why Us', singular: 'Reason', icon: 'Award', page: 'Services page' },
  'printing-service': { label: '3D Printing Services', singular: 'Printing service', icon: 'Printer', page: 'Services page' },
  'printing-step': { label: '3D Printing Steps', singular: 'Printing step', icon: 'ListOrdered', page: 'Services page' },
  value: { label: 'Values', singular: 'Value', icon: 'Heart', page: 'About page' },
  'tech-area': { label: 'Technology Areas', singular: 'Technology area', icon: 'Cpu', page: 'About page' },
};

export const ADMIN_NAV = [
  {
    title: 'Overview',
    links: [
      { href: '/admin', label: 'Dashboard', icon: 'LayoutDashboard' },
      { href: '/admin/enquiries', label: 'Enquiries', icon: 'Inbox', badge: 'newEnquiries' },
    ],
  },
  {
    title: 'Website content',
    links: Object.entries(CONTENT_TYPES).map(([type, t]) => ({ href: `/admin/content/${type}`, label: t.label, icon: t.icon })),
  },
  {
    title: 'Site',
    links: [
      { href: '/admin/pages', label: 'Pages', icon: 'FileText' },
      { href: '/admin/settings', label: 'Company Settings', icon: 'Building2' },
    ],
  },
  {
    title: 'Account',
    links: [
      { href: '/admin/users', label: 'Admin Users', icon: 'Users' },
      { href: '/admin/profile', label: 'My Profile', icon: 'UserCog' },
    ],
  },
];

export const ENQUIRY_STATUSES = ['new', 'contacted', 'closed'];
