import { Wallet } from 'lucide-react';
import { NavLink } from 'react-router-dom';
import { NAV_ITEMS } from '@/config/nav';
import { cn } from '@/lib/utils';

interface SidebarProps {
  mobileOpen: boolean;
  onClose: () => void;
}

export function Sidebar({ mobileOpen, onClose }: SidebarProps): JSX.Element {
  return (
    <>
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          aria-hidden
          onClick={onClose}
        />
      )}

      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-50 flex w-64 flex-col bg-sidebar text-sidebar-foreground transition-transform duration-200 lg:translate-x-0',
          mobileOpen ? 'translate-x-0' : '-translate-x-full',
        )}
      >
        <div className="flex h-16 items-center gap-2.5 border-b border-sidebar-border px-5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-sidebar-accent">
            <Wallet className="h-4 w-4 text-white" />
          </div>
          <div className="leading-tight">
            <div className="text-sm font-semibold">ACME</div>
            <div className="text-[11px] text-sidebar-muted">Salary Management</div>
          </div>
        </div>

        <nav className="flex-1 space-y-1 overflow-y-auto p-3">
          <p className="px-3 pb-1 pt-2 text-[11px] font-medium uppercase tracking-wider text-sidebar-muted">
            Workspace
          </p>
          {NAV_ITEMS.map((item) => (
            <NavLink
              key={item.href}
              to={item.href}
              end={item.href === '/'}
              onClick={onClose}
              className={({ isActive }) =>
                cn(
                  'flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors',
                  isActive
                    ? 'bg-sidebar-accent text-white shadow-sm'
                    : 'text-sidebar-foreground/75 hover:bg-white/5 hover:text-sidebar-foreground',
                )
              }
            >
              <item.icon className="h-4 w-4 shrink-0" />
              {item.title}
            </NavLink>
          ))}
        </nav>

        <div className="border-t border-sidebar-border p-4">
          <div className="rounded-lg bg-white/5 p-3 text-xs text-sidebar-muted">
            <div className="font-medium text-sidebar-foreground">10,000 employees</div>
            Across 5 countries · seeded deterministically
          </div>
        </div>
      </aside>
    </>
  );
}
