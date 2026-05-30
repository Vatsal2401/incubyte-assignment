import { Plus } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { EmployeeFilters } from '@/features/employees/EmployeeFilters';
import { EmployeeFormDialog } from '@/features/employees/EmployeeFormDialog';
import { EmployeeTable } from '@/features/employees/EmployeeTable';
import { Pagination } from '@/features/employees/Pagination';
import { useEmployeeMutations, useEmployees } from '@/features/employees/useEmployees';
import type { CreateEmployeeBody, Employee, EmployeeFilters as Filters } from '@/lib/api';
import { PAGE_SIZE } from '@/lib/constants';

export function EmployeesPage(): JSX.Element {
  const [filters, setFilters] = useState<Filters>({ page: 1, pageSize: PAGE_SIZE });
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editing, setEditing] = useState<Employee | undefined>(undefined);

  const employeesQuery = useEmployees(filters);
  const { create, update, deactivate } = useEmployeeMutations();
  const page = employeesQuery.data;

  // Any filter change (except paging) returns to page 1.
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
    if (editing) await update.mutateAsync({ id: editing.id, body });
    else await create.mutateAsync(body);
    setDialogOpen(false);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          {page ? `${page.total.toLocaleString()} employees` : 'Loading…'}
        </p>
        <Button onClick={openCreate}>
          <Plus className="h-4 w-4" /> Add employee
        </Button>
      </div>

      <Card>
        <CardContent className="space-y-4 pt-6">
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
        </CardContent>
      </Card>

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
