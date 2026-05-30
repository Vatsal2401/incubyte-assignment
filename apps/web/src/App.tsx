import { Plus } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { AnalyticsDashboard } from '@/features/analytics/AnalyticsDashboard';
import { useAnalytics } from '@/features/analytics/useAnalytics';
import { EmployeeFilters } from '@/features/employees/EmployeeFilters';
import { EmployeeFormDialog } from '@/features/employees/EmployeeFormDialog';
import { EmployeeTable } from '@/features/employees/EmployeeTable';
import { Pagination } from '@/features/employees/Pagination';
import { useEmployeeMutations, useEmployees } from '@/features/employees/useEmployees';
import type { CreateEmployeeBody, Employee, EmployeeFilters as Filters } from '@/lib/api';
import { PAGE_SIZE } from '@/lib/constants';

export function App(): JSX.Element {
  const [filters, setFilters] = useState<Filters>({ page: 1, pageSize: PAGE_SIZE });
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<Employee | undefined>(undefined);

  const employeesQuery = useEmployees(filters);
  const analyticsQuery = useAnalytics();
  const { create, update, deactivate } = useEmployeeMutations();

  // Any filter change (except page) resets back to page 1.
  const patchFilters = (patch: Partial<Filters>): void =>
    setFilters((prev) => ({ ...prev, ...patch, page: 'page' in patch ? (patch.page ?? 1) : 1 }));

  const openCreate = (): void => {
    setEditing(undefined);
    setDialogOpen(true);
  };
  const openEdit = (employee: Employee): void => {
    setEditing(employee);
    setDialogOpen(true);
  };

  const handleSave = async (body: CreateEmployeeBody): Promise<void> => {
    if (editing) {
      await update.mutateAsync({ id: editing.id, body });
    } else {
      await create.mutateAsync(body);
    }
    setDialogOpen(false);
  };

  const page = employeesQuery.data;

  return (
    <div className="min-h-screen bg-muted/30">
      <header className="border-b bg-background">
        <div className="container flex items-center justify-between py-4">
          <div>
            <h1 className="text-xl font-semibold">ACME Salary Management</h1>
            <p className="text-sm text-muted-foreground">
              {page ? `${page.total.toLocaleString()} employees` : 'Loading…'}
            </p>
          </div>
          <Button onClick={openCreate}>
            <Plus className="h-4 w-4" /> Add employee
          </Button>
        </div>
      </header>

      <main className="container space-y-6 py-6">
        {analyticsQuery.data && <AnalyticsDashboard overview={analyticsQuery.data} />}

        <section className="space-y-4">
          <EmployeeFilters filters={filters} onChange={patchFilters} />

          {employeesQuery.isError ? (
            <div className="rounded-lg border border-destructive/40 bg-destructive/5 p-6 text-sm text-destructive">
              Failed to load employees. Is the API running?
            </div>
          ) : (
            <>
              <EmployeeTable
                employees={page?.items ?? []}
                onEdit={openEdit}
                onDeactivate={(e) => deactivate.mutate(e.id)}
              />
              {page && (
                <Pagination
                  page={page.page}
                  pageSize={page.pageSize}
                  total={page.total}
                  onPageChange={(p) => patchFilters({ page: p })}
                />
              )}
            </>
          )}
        </section>
      </main>

      <EmployeeFormDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        onSave={handleSave}
        saving={create.isPending || update.isPending}
        initial={editing}
      />
    </div>
  );
}
