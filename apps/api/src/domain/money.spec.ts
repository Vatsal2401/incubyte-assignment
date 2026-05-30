import { Money } from './money';

describe('Money', () => {
  it('formats USD minor units as a localized currency string', () => {
    const salary = Money.fromMinor(500_000, 'USD');

    expect(salary.format()).toBe('$5,000.00');
  });

  it('rejects a negative amount', () => {
    expect(() => Money.fromMinor(-1, 'USD')).toThrow('amount cannot be negative');
  });
});
