import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { EmployeeFormDialog } from './EmployeeFormDialog';

describe('EmployeeFormDialog', () => {
  it('submits a new employee with the salary converted to minor units', async () => {
    const onSave = vi.fn().mockResolvedValue(undefined);
    render(<EmployeeFormDialog open onClose={() => {}} onSave={onSave} saving={false} />);

    await userEvent.type(screen.getByLabelText('Name'), 'Grace Hopper');
    await userEvent.type(screen.getByLabelText('Email'), 'grace@acme.io');
    await userEvent.type(screen.getByLabelText('Job title'), 'Rear Admiral');
    await userEvent.type(screen.getByLabelText('Annual salary'), '120000');
    await userEvent.type(screen.getByLabelText('Hire date'), '2021-05-01');
    await userEvent.click(screen.getByRole('button', { name: /save/i }));

    expect(onSave).toHaveBeenCalledWith(
      expect.objectContaining({
        name: 'Grace Hopper',
        email: 'grace@acme.io',
        jobTitle: 'Rear Admiral',
        salaryMinor: 12_000_000,
        hireDate: expect.stringContaining('2021-05-01'),
      }),
    );
  });

  it('pre-fills the form when editing an existing employee', () => {
    render(
      <EmployeeFormDialog
        open
        onClose={() => {}}
        onSave={vi.fn()}
        saving={false}
        initial={{
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
        }}
      />,
    );

    expect(screen.getByLabelText('Name')).toHaveValue('Ada Lovelace');
    expect(screen.getByLabelText('Annual salary')).toHaveValue(90_000);
  });
});
