import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';

/** Scrollable page body for content that can exceed the viewport (dashboard, analytics). */
export function PageBody({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}): JSX.Element {
  return (
    <div className="h-full overflow-y-auto">
      <div className={cn('mx-auto max-w-7xl px-4 py-6 lg:px-8', className)}>{children}</div>
    </div>
  );
}
