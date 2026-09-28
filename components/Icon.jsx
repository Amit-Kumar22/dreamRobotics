import { icons, Cpu } from 'lucide-react';

// Renders a lucide icon from the name stored in the database (e.g. "Bot", "Printer").
export default function Icon({ name, className = 'h-5 w-5', strokeWidth = 1.75 }) {
  const Cmp = (name && icons[name]) || Cpu;
  return <Cmp className={className} strokeWidth={strokeWidth} aria-hidden="true" />;
}
