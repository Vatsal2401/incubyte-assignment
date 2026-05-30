import 'reflect-metadata';
import { plainToInstance } from 'class-transformer';
import { validateSync } from 'class-validator';
import { CreateEmployeeDto } from './create-employee.dto';

const valid = {
  name: 'Ada Lovelace',
  email: 'ada@acme.io',
  jobTitle: 'Staff Engineer',
  department: 'Engineering',
  country: 'GB',
  currency: 'GBP',
  salaryMinor: 9_000_000,
  hireDate: '2020-01-01T00:00:00.000Z',
};

function invalidProps(payload: Record<string, unknown>): string[] {
  const dto = plainToInstance(CreateEmployeeDto, payload);
  return validateSync(dto, { whitelist: true, forbidNonWhitelisted: true }).map((e) => e.property);
}

describe('CreateEmployeeDto', () => {
  it('accepts a valid payload', () => {
    expect(invalidProps(valid)).toHaveLength(0);
  });

  it('rejects an invalid email', () => {
    expect(invalidProps({ ...valid, email: 'not-an-email' })).toContain('email');
  });

  it('rejects a negative salary', () => {
    expect(invalidProps({ ...valid, salaryMinor: -1 })).toContain('salaryMinor');
  });

  it('rejects a non-integer salary', () => {
    expect(invalidProps({ ...valid, salaryMinor: 100.5 })).toContain('salaryMinor');
  });

  it('rejects an unsupported currency', () => {
    expect(invalidProps({ ...valid, currency: 'JPY' })).toContain('currency');
  });

  it('rejects a missing required field', () => {
    const { name: _omitted, ...withoutName } = valid;
    expect(invalidProps(withoutName)).toContain('name');
  });
});
