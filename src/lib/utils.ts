import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const formatCurrency = (amount: number, currency: string) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency === 'BDT' ? 'BDT' : 'CNY',
    currencyDisplay: 'symbol',
  }).format(amount);
};

export const CATEGORIES = [
  { id: 'food', label: 'খাবার', icon: 'Utensils' },
  { id: 'transport', label: 'যাতায়াত', icon: 'Bus' },
  { id: 'bills', label: 'বিল', icon: 'Receipt' },
  { id: 'shopping', label: 'কেনাকাটা', icon: 'ShoppingBag' },
  { id: 'others', label: 'অন্যান্য', icon: 'MoreHorizontal' },
];
