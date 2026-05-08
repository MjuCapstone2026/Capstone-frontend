import { ItineraryDetail } from '@/api/itineraries';
import { TripInfo } from '@/components/ui/TripInfoBottomSheet';
import { parseDateOnly } from '@/utils/dateOnly';

export function toTripInfoInitialValues(detail: Pick<
  ItineraryDetail,
  'destination' | 'startDate' | 'endDate' | 'budget' | 'adultCount' | 'childCount' | 'childAges'
>): Partial<TripInfo> {
  return {
    destination: detail.destination,
    startDate: parseDateOnly(detail.startDate),
    endDate: parseDateOnly(detail.endDate),
    budget: detail.budget != null ? Math.round(detail.budget / 10000) : undefined,
    adults: detail.adultCount,
    children: detail.childCount,
    childAges: detail.childAges.map((n) => `만 ${n}세` as TripInfo['childAges'][number]),
  };
}
