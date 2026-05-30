import { BarChart3, LayoutDashboard, type LucideIcon, Users } from 'lucide-react';

export interface NavItem {
  title: string;
  href: string;
  icon: LucideIcon;
  description: string;
}

// Config-first navigation: the sidebar renders from this list.
export const NAV_ITEMS: readonly NavItem[] = [
  {
    title: 'Dashboard',
    href: '/',
    icon: LayoutDashboard,
    description: 'Overview of how the org pays people',
  },
  {
    title: 'Employees',
    href: '/employees',
    icon: Users,
    description: 'Browse, search and manage salary records',
  },
  {
    title: 'Analytics',
    href: '/analytics',
    icon: BarChart3,
    description: 'Salary breakdowns by country and department',
  },
];

/** True when `href` is the active nav target for the current `pathname`. */
export function isActivePath(pathname: string, href: string): boolean {
  if (href === '/') return pathname === '/';
  return pathname === href || pathname.startsWith(`${href}/`);
}
