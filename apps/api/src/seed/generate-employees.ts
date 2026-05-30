import { faker } from '@faker-js/faker';
import { CurrencyCode } from '../domain/money';

export interface GeneratedEmployee {
  name: string;
  email: string;
  jobTitle: string;
  department: string;
  country: string;
  currency: CurrencyCode;
  salaryMinor: number;
  status: string;
  hireDate: Date;
}

interface CountryProfile {
  country: string;
  currency: CurrencyCode;
  // Typical annual gross salary band in MAJOR units, scaled to the locale.
  salaryBand: [min: number, max: number];
}

const COUNTRIES: readonly CountryProfile[] = [
  { country: 'US', currency: 'USD', salaryBand: [60_000, 220_000] },
  { country: 'IN', currency: 'INR', salaryBand: [600_000, 6_000_000] },
  { country: 'GB', currency: 'GBP', salaryBand: [40_000, 160_000] },
  { country: 'DE', currency: 'EUR', salaryBand: [50_000, 170_000] },
  { country: 'AU', currency: 'AUD', salaryBand: [70_000, 200_000] },
];

const DEPARTMENTS = [
  'Engineering',
  'Sales',
  'Marketing',
  'Finance',
  'People',
  'Operations',
  'Product',
  'Support',
] as const;

const JOB_TITLES = [
  'Engineer',
  'Senior Engineer',
  'Manager',
  'Director',
  'Analyst',
  'Specialist',
  'Lead',
  'Coordinator',
] as const;

/**
 * Deterministically generate `count` employees for the given `seed`.
 * Pure: same (count, seed) always yields the same dataset, so the seed
 * script and any test that uses it are reproducible.
 */
export function generateEmployees(count: number, seed: number): GeneratedEmployee[] {
  faker.seed(seed);

  return Array.from({ length: count }, (_unused, index) => {
    const profile = faker.helpers.arrayElement(COUNTRIES);
    const firstName = faker.person.firstName();
    const lastName = faker.person.lastName();
    const salaryMajor = faker.number.int({ min: profile.salaryBand[0], max: profile.salaryBand[1] });

    return {
      name: `${firstName} ${lastName}`,
      // index guarantees uniqueness regardless of name collisions.
      email: `${firstName}.${lastName}.${index}@acme.example`.toLowerCase(),
      jobTitle: faker.helpers.arrayElement(JOB_TITLES),
      department: faker.helpers.arrayElement(DEPARTMENTS),
      country: profile.country,
      currency: profile.currency,
      salaryMinor: salaryMajor * 100,
      status: faker.datatype.boolean({ probability: 0.95 }) ? 'active' : 'inactive',
      hireDate: faker.date.between({ from: '2015-01-01', to: '2025-01-01' }),
    };
  });
}
