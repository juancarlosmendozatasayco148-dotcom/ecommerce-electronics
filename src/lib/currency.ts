const PEN_TO_USD_RATE = 0.27;

export type CurrencyCode = 'PEN' | 'USD';

export function convertPrice(priceInPEN: number, to: CurrencyCode): number {
  if (to === 'USD') return +(priceInPEN * PEN_TO_USD_RATE).toFixed(2);
  return priceInPEN;
}

export function formatPrice(price: number, currency: CurrencyCode = 'PEN'): string {
  return new Intl.NumberFormat(
    currency === 'PEN' ? 'es-PE' : 'en-US',
    { style: 'currency', currency, minimumFractionDigits: 2 }
  ).format(currency === 'USD' ? convertPrice(price, 'USD') : price);
}

export function getCurrencySymbol(currency: CurrencyCode): string {
  return currency === 'PEN' ? 'S/' : '$';
}
