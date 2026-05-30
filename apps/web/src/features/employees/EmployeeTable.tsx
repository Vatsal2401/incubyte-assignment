import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import type { Employee } from '@/lib/api';
import { formatMoney } from '@/lib/format';

interface EmployeeTableProps {
  employees: Employee[];
  onEdit: (employee: Employee) => void;
  onDeactivate: (employee: Employee) => void;
}

export function EmployeeTable({ employees, onEdit, onDeactivate }: EmployeeTableProps): JSX.Element {
  if (employees.length === 0) {
    return (
      <div className="rounded-lg border p-12 text-center text-sm text-muted-foreground">
        No employees match your filters.
      </div>
    );
  }

  return (
    <Table containerClassName="h-full">
      <TableHeader className="sticky top-0 z-10 bg-card">
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Title</TableHead>
          <TableHead>Department</TableHead>
          <TableHead>Country</TableHead>
          <TableHead className="text-right">Salary</TableHead>
          <TableHead>Status</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {employees.map((employee) => (
          <TableRow key={employee.id}>
            <TableCell>
              <div className="font-medium">{employee.name}</div>
              <div className="text-xs text-muted-foreground">{employee.email}</div>
            </TableCell>
            <TableCell>{employee.jobTitle}</TableCell>
            <TableCell>{employee.department}</TableCell>
            <TableCell>{employee.country}</TableCell>
            <TableCell className="text-right tabular-nums">
              {formatMoney(employee.salaryMinor, employee.currency)}
            </TableCell>
            <TableCell>
              <Badge variant={employee.status === 'active' ? 'success' : 'muted'}>
                {employee.status}
              </Badge>
            </TableCell>
            <TableCell className="text-right">
              <div className="flex justify-end gap-2">
                <Button size="sm" variant="outline" onClick={() => onEdit(employee)}>
                  Edit
                </Button>
                {employee.status === 'active' && (
                  <Button size="sm" variant="ghost" onClick={() => onDeactivate(employee)}>
                    Deactivate
                  </Button>
                )}
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
