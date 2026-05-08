import { useEffect, useMemo, useRef, useState } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useQuery } from '@tanstack/react-query';
import { useRouter } from 'expo-router';
import Toast from 'react-native-toast-message';
import { useApi } from '@/hooks/useApi';
import { useTheme } from '@/hooks/useTheme';
import { getItinerary, getItineraryLogs } from '@/api/itineraries';
import { GC_TIMES, queryKeys, STALE_TIMES } from '@/constants/queryKeys';
import { BOTTOM_NAVIGATION } from '@/constants/layout';
import { getErrorMessage } from '@/utils/getErrorMessage';
import { ItineraryOverviewCard2BeforeEdit } from '@/components/ItineraryOverviewCard2BeforeEdit';
import { PlanDetailItem } from '@/components/PlanDetailItem';

type Props = { id: string };

function addDays(dateStr: string, days: number): string {
  const [year, month, day] = dateStr.split('-').map(Number);
  const d = new Date(year, month - 1, day + days);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

function formatLogDate(isoDate: string): string {
  const d = new Date(isoDate);
  return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, '0')}.${String(d.getDate()).padStart(2, '0')}`;
}

export function PlanListDetailScreen({ id }: Props) {
  const { colors } = useTheme();
  const { authRequest } = useApi();
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const [selectedDay, setSelectedDay] = useState(1);
  const [isHeaderHidden, setIsHeaderHidden] = useState(false);
  const lastScrollYRef = useRef(0);

  const {
    data: itinerary,
    isLoading: isLoadingItinerary,
    error: itineraryError,
  } = useQuery({
    queryKey: queryKeys.itineraries.detail(id),
    queryFn: () => authRequest((token) => getItinerary(token, id)),
    staleTime: STALE_TIMES.itineraries.detail,
    gcTime: GC_TIMES.itineraries.detail,
  });

  const {
    data: logsData,
    error: logsError,
  } = useQuery({
    queryKey: queryKeys.itineraries.logs(id),
    queryFn: () => authRequest((token) => getItineraryLogs(token, id)),
    staleTime: STALE_TIMES.itineraries.logs,
    gcTime: GC_TIMES.itineraries.logs,
  });

  useEffect(() => {
    if (!itineraryError) return;
    Toast.show({ type: 'error', text1: getErrorMessage(itineraryError) });
  }, [itineraryError]);

  useEffect(() => {
    if (!logsError) return;
    Toast.show({ type: 'error', text1: getErrorMessage(logsError) });
  }, [logsError]);

  const changeLogs = useMemo(
    () => (logsData?.logs ?? []).map((log) => ({ logId: log.logId, date: formatLogDate(log.createdAt) })),
    [logsData?.logs],
  );

  const activeDayPlans = useMemo(() => {
    if (!itinerary) return [];
    const dateKey = addDays(itinerary.startDate, selectedDay - 1);
    return itinerary.dayPlans[dateKey] ?? [];
  }, [itinerary, selectedDay]);

  if (isLoadingItinerary) {
    return (
      <View style={[styles.container, styles.center, { backgroundColor: colors.pageBg }]}>
        <ActivityIndicator />
      </View>
    );
  }

  if (!itinerary) return null;

  const headerDate = `${itinerary.startDate.replace(/-/g, '.')} - ${itinerary.endDate.replace(/-/g, '.')}`;

  return (
    <View style={[styles.container, { backgroundColor: colors.secondarySurface }]}>
      <ItineraryOverviewCard2BeforeEdit
        title={itinerary.name}
        date={headerDate}
        location={itinerary.destination}
        dayCount={itinerary.totalDays}
        selectedDay={selectedDay}
        onDayPress={setSelectedDay}
        onBack={() => router.back()}
        onEdit={() => router.push({ pathname: '/plan-list/[id]/edit', params: { id } })}
        changeLogs={changeLogs}
        onChangeLogPress={(logId) =>
          router.push({ pathname: '/plan-list/[id]/logs/[logId]', params: { id, logId } })
        }
        hidden={isHeaderHidden}
      />
      <ScrollView
        onScroll={({ nativeEvent }) => {
          const nextY = nativeEvent.contentOffset.y;
          const previousY = lastScrollYRef.current;
          const delta = nextY - previousY;

          if (nextY <= 0) {
            setIsHeaderHidden(false);
          } else if (delta > 8) {
            setIsHeaderHidden(true);
          } else if (delta < -8) {
            setIsHeaderHidden(false);
          }

          lastScrollYRef.current = nextY;
        }}
        scrollEventThrottle={16}
        contentContainerStyle={[
          styles.content,
          { paddingBottom: BOTTOM_NAVIGATION + insets.bottom + 24 },
        ]}
      >
        {activeDayPlans.map((item, index) => (
          <PlanDetailItem
            key={`day${selectedDay}-item${index}`}
            title={item.plan_name}
            startTime={item.time}
            endTime={index + 1 < activeDayPlans.length ? activeDayPlans[index + 1].time : ''}
            memo={item.note || undefined}
            location={item.place || undefined}
            price={item.price ?? undefined}
            showConnector={index + 1 < activeDayPlans.length}
          />
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  center: { alignItems: 'center', justifyContent: 'center' },
  content: { padding: 16 },
});
