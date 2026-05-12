import type { DayPlanCost } from '@/api/itineraries';

export type DisplayCost = {
  price?: number;
  currency?: string;
};

export function getDisplayCost(
  cost?: DayPlanCost | null,
  legacyPrice?: number | null,
): DisplayCost {
  if (cost) {
    if (cost.amount_krw != null) return { price: cost.amount_krw, currency: 'KRW' };
    return { price: cost.amount, currency: cost.currency };
  }

  return legacyPrice == null ? {} : { price: legacyPrice, currency: 'KRW' };
}
