import { Money } from './money';

describe('Money', () => {
  it('formats USD minor units as a localized currency string', () => {
    const salary = Money.fromMinor(500_000, 'USD');

    expect(salary.format()).toBe('$5,000.00');
  });

  it('rejects a negative amount', () => {
    expect(() => Money.fromMinor(-1, 'USD')).toThrow('amount cannot be negative');
  });

  it('rejects a fractional (non-integer) minor amount', () => {
    expect(() => Money.fromMinor(100.5, 'USD')).toThrow('amount must be an integer');
  });

  it('adds two amounts of the same currency', () => {
    const total = Money.fromMinor(500_000, 'USD').add(Money.fromMinor(250_000, 'USD'));

    expect(total.amountMinor).toBe(750_000);
    expect(total.currency).toBe('USD');
  });
});
