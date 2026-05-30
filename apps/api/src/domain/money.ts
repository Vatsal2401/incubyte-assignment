import { InvalidMoneyError } from './errors';

export type CurrencyCode = 'USD' | 'INR' | 'EUR' | 'GBP' | 'AUD';

/**
 * Immutable money value object. Amounts are held as integer minor units
 * (e.g. cents) paired with a currency, so there is no floating-point drift
 * and no accidental cross-currency arithmetic.
 */
export class Money {
  private constructor(
    public readonly amountMinor: number,
    public readonly currency: CurrencyCode,
  ) {}

  static fromMinor(amountMinor: number, currency: CurrencyCode): Money {
    if (amountMinor < 0) {
      throw new InvalidMoneyError('amount cannot be negative');
    }
    return new Money(amountMinor, currency);
  }

  format(): string {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: this.currency,
    }).format(this.amountMinor / 100);
  }
}
