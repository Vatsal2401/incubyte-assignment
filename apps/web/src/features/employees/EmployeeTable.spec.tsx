import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import type { Employee } from '@/lib/api';
import { EmployeeTable } from './EmployeeTable';

const employee: Employee = {
  id: 'emp_1',
  name: 'Ada Lovelace',
  email: 'ada@acme.io',
  jobTitle: 'Staff Engineer',
  department: 'Engineering',
  country: 'GB',
  currency: 'GBP',
  salaryMinor: 9_000_000,
  status: 'active',
  hireDate: '2020-01-01T00:00:00.000Z',
  createdAt: '2020-01-01T00:00:00.000Z',
  updatedAt: '2020-01-01T00:00:00.000Z',
};

describe('EmployeeTable', () => {
  it('renders an employee row with the salary formatted from minor units', () => {
    render(<EmployeeTable employees={[employee]} onEdit={() => {}} onDeactivate={() => {}} />);

    expect(screen.getByText('Ada Lovelace')).toBeInTheDocument();
    expect(screen.getByText('£90,000.00')).toBeInTheDocument();
    expect(screen.getByText('Engineering')).toBeInTheDocument();
  });

  it('shows an empty state when there are no employees', () => {
    render(<EmployeeTable employees={[]} onEdit={() => {}} onDeactivate={() => {}} />);

    expect(screen.getByText(/no employees/i)).toBeInTheDocument();
  });

  it('calls onEdit when the edit action is clicked', async () => {
    const onEdit = vi.fn();
    render(<EmployeeTable employees={[employee]} onEdit={onEdit} onDeactivate={() => {}} />);

    await userEvent.click(screen.getByRole('button', { name: /edit/i }));

    expect(onEdit).toHaveBeenCalledWith(employee);
  });
});
