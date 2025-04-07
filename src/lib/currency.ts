import { supabase } from './supabase';

export interface Currency {
  code: string;
  symbol: string;
  name: string;
  exchangeRate: number; // Rate relative to base currency (INR)
}

export const currencies: Currency[] = [
  { code: 'INR', symbol: '₹', name: 'Indian Rupee', exchangeRate: 1 },
  { code: 'USD', symbol: '$', name: 'US Dollar', exchangeRate: 0.012 },
  { code: 'EUR', symbol: '€', name: 'Euro', exchangeRate: 0.011 },
  { code: 'GBP', symbol: '£', name: 'British Pound', exchangeRate: 0.0095 }
];

export const defaultCurrency: Currency = currencies[0]; // INR

export function formatPrice(amount: number, currency: Currency = defaultCurrency): string {
  const formattedAmount = new Intl.NumberFormat('en-IN', {
    style: 'decimal',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(amount);

  return `${currency.symbol}${formattedAmount}`;
}

export function convertPrice(amount: number, fromCurrency: Currency, toCurrency: Currency): number {
  // Convert to base currency (INR) first if not already
  const inBaseCurrency = fromCurrency.code === 'INR' 
    ? amount 
    : amount / fromCurrency.exchangeRate;
  
  // Then convert to target currency
  return toCurrency.code === 'INR'
    ? inBaseCurrency
    : inBaseCurrency * toCurrency.exchangeRate;
}