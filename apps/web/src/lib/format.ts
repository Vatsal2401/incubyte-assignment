export type CurrencyCode = 'USD' | 'INR' | 'EUR' | 'GBP' | 'AUD';

/**
 * Format an integer minor-unit amount (e.g. cents) as a localized currency
 * string. All money formatting in the UI goes through here — no ad-hoc
 * division or string building in components.
 */
export function formatMoney(amountMinor: number, currency: CurrencyCode): string {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency }).format(amountMinor / 100);
}
