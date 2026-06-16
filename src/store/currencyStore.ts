import { create } from 'zustand';

export type CurrencyCode = 'PEN' | 'USD';

function detectCurrency(): CurrencyCode {
  if (typeof window === 'undefined') return 'PEN';
  try {
    const lang = navigator.language || '';
    if (lang.startsWith('en') && !['en-PE', 'es'].some(l => lang.startsWith(l))) {
      return 'USD';
    }
    return 'PEN';
  } catch {
    return 'PEN';
  }
}

interface CurrencyStore {
  currency: CurrencyCode;
  setCurrency: (c: CurrencyCode) => void;
}

export const useCurrencyStore = create<CurrencyStore>()((set) => ({
  currency: detectCurrency(),
  setCurrency: (currency) => set({ currency }),
}));
