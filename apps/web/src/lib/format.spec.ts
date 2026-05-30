import { formatMoney } from './format';

describe('formatMoney', () => {
  it('formats USD minor units with grouping and symbol', () => {
    expect(formatMoney(500_000, 'USD')).toBe('$5,000.00');
  });

  it('formats INR minor units', () => {
    expect(formatMoney(600_000_00, 'INR')).toBe('₹600,000.00');
  });

  it('formats zero', () => {
    expect(formatMoney(0, 'EUR')).toBe('€0.00');
  });
});
