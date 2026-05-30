import * as React from 'react';
import { Button } from '@/components/ui/button';
import { Dialog } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select } from '@/components/ui/select';
import type { CreateEmployeeBody, Employee } from '@/lib/api';
import { COUNTRIES, CURRENCIES, DEPARTMENTS } from '@/lib/constants';
import type { CurrencyCode } from '@/lib/format';

interface EmployeeFormDialogProps {
  open: boolean;
  onClose: () => void;
  onSave: (body: CreateEmployeeBody) => Promise<void> | void;
  saving: boolean;
  initial?: Employee;
}

interface FormState {
  name: string;
  email: string;
  jobTitle: string;
  department: string;
  country: string;
  currency: CurrencyCode;
  salaryMajor: string;
  hireDate: string;
}

function initialState(employee?: Employee): FormState {
  return {
    name: employee?.name ?? '',
    email: employee?.email ?? '',
    jobTitle: employee?.jobTitle ?? '',
    department: employee?.department ?? DEPARTMENTS[0],
    country: employee?.country ?? COUNTRIES[0].code,
    currency: employee?.currency ?? 'USD',
    salaryMajor: employee ? String(employee.salaryMinor / 100) : '',
    hireDate: employee ? employee.hireDate.slice(0, 10) : '',
  };
}

export function EmployeeFormDialog({
  open,
  onClose,
  onSave,
  saving,
  initial,
}: EmployeeFormDialogProps): JSX.Element {
  const [form, setForm] = React.useState<FormState>(() => initialState(initial));

  React.useEffect(() => {
    if (open) setForm(initialState(initial));
  }, [open, initial]);

  const set = <K extends keyof FormState>(key: K, value: FormState[K]): void =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const handleSubmit = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();
    await onSave({
      name: form.name,
      email: form.email,
      jobTitle: form.jobTitle,
      department: form.department,
      country: form.country,
      currency: form.currency,
      salaryMinor: Math.round(Number(form.salaryMajor) * 100),
      hireDate: new Date(form.hireDate).toISOString(),
    });
  };

  return (
    <Dialog open={open} onClose={onClose} title={initial ? 'Edit employee' : 'Add employee'}>
      <form onSubmit={handleSubmit} className="space-y-3">
        <Field label="Name" id="name">
          <Input id="name" required value={form.name} onChange={(e) => set('name', e.target.value)} />
        </Field>
        <Field label="Email" id="email">
          <Input
            id="email"
            type="email"
            required
            value={form.email}
            onChange={(e) => set('email', e.target.value)}
          />
        </Field>
        <Field label="Job title" id="jobTitle">
          <Input
            id="jobTitle"
            required
            value={form.jobTitle}
            onChange={(e) => set('jobTitle', e.target.value)}
          />
        </Field>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Department" id="department">
            <Select
              id="department"
              value={form.department}
              onChange={(e) => set('department', e.target.value)}
            >
              {DEPARTMENTS.map((d) => (
                <option key={d}>{d}</option>
              ))}
            </Select>
          </Field>
          <Field label="Country" id="country">
            <Select id="country" value={form.country} onChange={(e) => set('country', e.target.value)}>
              {COUNTRIES.map((c) => (
                <option key={c.code} value={c.code}>
                  {c.label}
                </option>
              ))}
            </Select>
          </Field>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Currency" id="currency">
            <Select
              id="currency"
              value={form.currency}
              onChange={(e) => set('currency', e.target.value as CurrencyCode)}
            >
              {CURRENCIES.map((c) => (
                <option key={c}>{c}</option>
              ))}
            </Select>
          </Field>
          <Field label="Annual salary" id="salary">
            <Input
              id="salary"
              type="number"
              min="0"
              required
              value={form.salaryMajor}
              onChange={(e) => set('salaryMajor', e.target.value)}
            />
          </Field>
        </div>
        <Field label="Hire date" id="hireDate">
          <Input
            id="hireDate"
            type="date"
            required
            value={form.hireDate}
            onChange={(e) => set('hireDate', e.target.value)}
          />
        </Field>
        <div className="flex justify-end gap-2 pt-2">
          <Button type="button" variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" disabled={saving}>
            {saving ? 'Saving…' : 'Save'}
          </Button>
        </div>
      </form>
    </Dialog>
  );
}

function Field({
  label,
  id,
  children,
}: {
  label: string;
  id: string;
  children: React.ReactNode;
}): JSX.Element {
  return (
    <div className="space-y-1.5">
      <Label htmlFor={id}>{label}</Label>
      {children}
    </div>
  );
}
