import { useEffect, useMemo, useRef, useState } from 'react';
import { ActivityIndicator, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useRouter } from 'expo-router';
import Toast from 'react-native-toast-message';
import { useApi } from '@/hooks/useApi';
import { useTheme } from '@/hooks/useTheme';
import { getItinerary, updateDayPlans } from '@/api/itineraries';
import { GC_TIMES, queryKeys, STALE_TIMES } from '@/constants/queryKeys';
import { BOTTOM_NAVIGATION } from '@/constants/layout';
import { getErrorMessage } from '@/utils/getErrorMessage';
import { ItineraryOverviewCard2Editing } from '@/components/ItineraryOverviewCard2Editing';
import { PlanDetailEditItem, ScheduleItem } from '@/components/PlanDetailEditItem';

type Props = { id: string };

type DayPlanInput = {
  plan_name: string;
  time: string;
  place: string;
  note?: string;
  price?: number | null;
};

function addDays(dateStr: string, days: number): string {
  const [year, month, day] = dateStr.split('-').map(Number);
  const d = new Date(year, month - 1, day + days);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

function splitTimeRange(time: string): { startTime: string; endTime: string } {
  const [startTime, endTime = ''] = time.split('~').map((part) => part.trim());
  return { startTime, endTime };
}

function joinTimeRange(startTime: string, endTime: string): string {
  return endTime.trim() ? `${startTime.trim()} ~ ${endTime.trim()}` : startTime.trim();
}

function isValidTime(value: string): boolean {
  return /^([01]\d|2[0-3]):[0-5]\d$/.test(value.trim());
}

function getInvalidTimeItem(itemsByDate: Record<string, ScheduleItem[]>): ScheduleItem | undefined {
  for (const items of Object.values(itemsByDate)) {
    const invalidItem = items.find((item) => (
      item.type === 'editable' &&
      (!isValidTime(item.startTime) || !isValidTime(item.endTime))
    ));
    if (invalidItem) return invalidItem;
  }
  return undefined;
}

function toScheduleItem(
  dateKey: string,
  item: { index: number; plan_name: string; time: string; place: string; note: string; price?: number | null },
): ScheduleItem {
  const { startTime, endTime } = splitTimeRange(item.time);

  return {
    id: `${dateKey}-${item.index}`,
    type: 'editable',
    startTime,
    endTime,
    title: item.plan_name,
    memo: item.note || undefined,
    location: item.place || undefined,
    price: item.price ?? undefined,
  };
}

function toDayPlanInput(item: ScheduleItem): DayPlanInput {
  return {
    plan_name: item.title,
    time: joinTimeRange(item.startTime, item.endTime),
    place: item.type === 'editable' ? (item.location ?? '') : '',
    note: item.type === 'editable' ? (item.memo ?? undefined) : undefined,
    price: item.type === 'editable' ? (item.price ?? null) : null,
  };
}

export function PlanListDetailEditScreen({ id }: Props) {
  const { colors } = useTheme();
  const { authRequest } = useApi();
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const queryClient = useQueryClient();

  const [selectedDay, setSelectedDay] = useState(1);
  const [localItems, setLocalItems] = useState<Record<string, ScheduleItem[]>>({});
  const initialized = useRef(false);

  const {
    data: itinerary,
    isLoading,
    error,
  } = useQuery({
    queryKey: queryKeys.itineraries.detail(id),
    queryFn: () => authRequest((token) => getItinerary(token, id)),
    staleTime: STALE_TIMES.itineraries.detail,
    gcTime: GC_TIMES.itineraries.detail,
  });

  useEffect(() => {
    if (!error) return;
    Toast.show({ type: 'error', text1: getErrorMessage(error) });
  }, [error]);

  useEffect(() => {
    if (!itinerary || initialized.current) return;
    initialized.current = true;

    const initial: Record<string, ScheduleItem[]> = {};
    Object.entries(itinerary.dayPlans).forEach(([dateKey, items]) => {
      initial[dateKey] = items.map((item) => toScheduleItem(dateKey, item));
    });
    setLocalItems(initial);
  }, [itinerary]);

  const saveMutation = useMutation({
    mutationFn: (dayPlans: Record<string, DayPlanInput[]>) =>
      authRequest((token) => updateDayPlans(token, id, { dayPlans })),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.itineraries.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.itineraries.detail(id) });
      queryClient.invalidateQueries({ queryKey: queryKeys.itineraries.logs(id) });
      router.back();
    },
    onError: (e) => {
      Toast.show({ type: 'error', text1: getErrorMessage(e) });
    },
  });

  const currentDateKey = useMemo(
    () => (itinerary ? addDays(itinerary.startDate, selectedDay - 1) : ''),
    [itinerary, selectedDay],
  );

  const currentItems = localItems[currentDateKey] ?? [];

  const handleSave = (updated: ScheduleItem) => {
    setLocalItems((prev) => ({
      ...prev,
      [currentDateKey]: (prev[currentDateKey] ?? []).map((item) =>
        item.id === updated.id ? updated : item,
      ),
    }));
  };

  const handleDelete = (itemId: string) => {
    setLocalItems((prev) => ({
      ...prev,
      [currentDateKey]: (prev[currentDateKey] ?? []).filter((item) => item.id !== itemId),
    }));
  };

  const handleComplete = () => {
    const invalidTimeItem = getInvalidTimeItem(localItems);
    if (invalidTimeItem) {
      Toast.show({
        type: 'error',
        text1: '시간을 HH:MM 형식으로 입력해주세요.',
        text2: invalidTimeItem.title,
      });
      return;
    }

    const dayPlans: Record<string, DayPlanInput[]> = {};
    Object.entries(localItems).forEach(([dateKey, items]) => {
      dayPlans[dateKey] = items.map(toDayPlanInput);
    });
    saveMutation.mutate(dayPlans);
  };

  if (isLoading) {
    return (
      <View style={[styles.container, styles.center, { backgroundColor: colors.pageBg }]}>
        <ActivityIndicator />
      </View>
    );
  }

  if (!itinerary) return null;

  const headerDate = `${itinerary.startDate.replace(/-/g, '.')} - ${itinerary.endDate.replace(/-/g, '.')}`;

  return (
    <KeyboardAvoidingView
      style={[styles.container, { backgroundColor: colors.pageBg }]}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ItineraryOverviewCard2Editing
        title={itinerary.name}
        date={headerDate}
        location={itinerary.destination}
        dayCount={itinerary.totalDays}
        selectedDay={selectedDay}
        onDayPress={setSelectedDay}
        onBack={() => router.back()}
        onCancel={() => router.back()}
        onComplete={handleComplete}
      />
      <ScrollView
        contentContainerStyle={[
          styles.content,
          { paddingBottom: BOTTOM_NAVIGATION + insets.bottom + 24 },
        ]}
        keyboardShouldPersistTaps="handled"
      >
        {currentItems.map((item) => (
          <PlanDetailEditItem
            key={item.id}
            item={item}
            onSave={handleSave}
            onDelete={() => handleDelete(item.id)}
          />
        ))}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  center: { alignItems: 'center', justifyContent: 'center' },
  content: { padding: 16, gap: 12 },
});
