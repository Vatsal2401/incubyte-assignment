import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import type { EmployeeFilters as Filters } from '@/lib/api';
import { COUNTRIES, DEPARTMENTS } from '@/lib/constants';

interface EmployeeFiltersProps {
  filters: Filters;
  onChange: (patch: Partial<Filters>) => void;
}

// Salary filters are entered in major units (annual) and stored as minor units.
const toMinor = (major: string): number | undefined =>
  major === '' ? undefined : Math.round(Number(major) * 100);
const toMajor = (minor?: number): string => (minor === undefined ? '' : String(minor / 100));

export function EmployeeFilters({ filters, onChange }: EmployeeFiltersProps): JSX.Element {
  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
      <Input
        placeholder="Search name or email…"
        aria-label="Search"
        value={filters.search ?? ''}
        onChange={(e) => onChange({ search: e.target.value })}
      />
      <Select
        aria-label="Country"
        value={filters.country ?? ''}
        onChange={(e) => onChange({ country: e.target.value })}
      >
        <option value="">All countries</option>
        {COUNTRIES.map((c) => (
          <option key={c.code} value={c.code}>
            {c.label}
          </option>
        ))}
      </Select>
      <Select
        aria-label="Department"
        value={filters.department ?? ''}
        onChange={(e) => onChange({ department: e.target.value })}
      >
        <option value="">All departments</option>
        {DEPARTMENTS.map((d) => (
          <option key={d} value={d}>
            {d}
          </option>
        ))}
      </Select>
      <Input
        type="number"
        placeholder="Min salary"
        aria-label="Minimum salary"
        value={toMajor(filters.salaryMin)}
        onChange={(e) => onChange({ salaryMin: toMinor(e.target.value) })}
      />
      <Input
        type="number"
        placeholder="Max salary"
        aria-label="Maximum salary"
        value={toMajor(filters.salaryMax)}
        onChange={(e) => onChange({ salaryMax: toMinor(e.target.value) })}
      />
    </div>
  );
}
