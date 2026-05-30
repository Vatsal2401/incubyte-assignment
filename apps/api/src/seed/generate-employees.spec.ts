import { SUPPORTED_CURRENCIES } from '../domain/money';
import { generateEmployees } from './generate-employees';

describe('generateEmployees', () => {
  it('generates the requested number of employees', () => {
    expect(generateEmployees(10, 42)).toHaveLength(10);
  });

  it('is deterministic for a given seed', () => {
    expect(generateEmployees(25, 42)).toEqual(generateEmployees(25, 42));
  });

  it('produces a different dataset for a different seed', () => {
    expect(generateEmployees(25, 1)).not.toEqual(generateEmployees(25, 2));
  });

  it('produces unique emails', () => {
    const emails = generateEmployees(500, 42).map((e) => e.email);
    expect(new Set(emails).size).toBe(500);
  });

  it('produces valid currencies and non-negative integer salaries', () => {
    for (const employee of generateEmployees(100, 42)) {
      expect(SUPPORTED_CURRENCIES).toContain(employee.currency);
      expect(Number.isInteger(employee.salaryMinor)).toBe(true);
      expect(employee.salaryMinor).toBeGreaterThanOrEqual(0);
      expect(employee.country).toHaveLength(2);
    }
  });
});
