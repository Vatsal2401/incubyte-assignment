import type { CurrencyCode } from './format';

export const CURRENCIES: readonly CurrencyCode[] = ['USD', 'INR', 'EUR', 'GBP', 'AUD'];

export const COUNTRIES: readonly { code: string; label: string }[] = [
  { code: 'US', label: 'United States' },
  { code: 'IN', label: 'India' },
  { code: 'GB', label: 'United Kingdom' },
  { code: 'DE', label: 'Germany' },
  { code: 'AU', label: 'Australia' },
];

export const DEPARTMENTS: readonly string[] = [
  'Engineering',
  'Sales',
  'Marketing',
  'Finance',
  'People',
  'Operations',
  'Product',
  'Support',
];

export const PAGE_SIZE = 12;
