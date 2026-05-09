import { useEffect, useMemo, useState } from 'react';
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

type Props = {
  itineraryId: string;
  logId: string;
};

function addDays(dateStr: string, days: number): string {
  const [year, month, day] = dateStr.split('-').map(Number);
  const d = new Date(year, month - 1, day + days);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

function formatLogDate(isoDate: string): string {
  const d = new Date(isoDate);
  return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, '0')}.${String(d.getDate()).padStart(2, '0')}`;
}

function splitTimeRange(time: string): { startTime: string; endTime: string } {
  const [startTime, endTime = ''] = time.split('~').map((part) => part.trim());
  return { startTime, endTime };
}

export function ChangeLogDetailScreen({ itineraryId, logId }: Props) {
  const { colors } = useTheme();
  const { authRequest } = useApi();
  const router = useRouter();
  const insets = useSafeAreaInsets();

  const [selectedDay, setSelectedDay] = useState(1);

  const {
    data: itinerary,
    isLoading: isLoadingItinerary,
    error: itineraryError,
  } = useQuery({
    queryKey: queryKeys.itineraries.detail(itineraryId),
    queryFn: () => authRequest((token) => getItinerary(token, itineraryId)),
    staleTime: STALE_TIMES.itineraries.detail,
    gcTime: GC_TIMES.itineraries.detail,
  });

  const {
    data: logsData,
    isLoading: isLoadingLogs,
    error: logsError,
  } = useQuery({
    queryKey: queryKeys.itineraries.logs(itineraryId),
    queryFn: () => authRequest((token) => getItineraryLogs(token, itineraryId)),
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

  const log = useMemo(
    () => logsData?.logs.find((l) => l.logId === logId),
    [logsData, logId],
  );

  const activeDayPlans = useMemo(() => {
    if (!log) return [];
    const dateKey = addDays(log.startDate, selectedDay - 1);
    return log.dayPlans[dateKey] ?? [];
  }, [log, selectedDay]);

  if (isLoadingItinerary || isLoadingLogs) {
    return (
      <View style={[styles.container, styles.center, { backgroundColor: colors.secondarySurface }]}>
        <ActivityIndicator />
      </View>
    );
  }

  if (!itinerary || !log) return null;

  const headerDate = `${log.startDate.replace(/-/g, '.')} - ${log.endDate.replace(/-/g, '.')}`;

  return (
    <View style={[styles.container, { backgroundColor: colors.secondarySurface }]}>
      <ItineraryOverviewCard2BeforeEdit
        title={itinerary.name}
        date={headerDate}
        location={log.destination}
        dayCount={log.totalDays}
        selectedDay={selectedDay}
        onDayPress={setSelectedDay}
        onBack={() => router.back()}
        changeLogDate={formatLogDate(log.createdAt)}
        changeLogs={[]}
      />
      <ScrollView
        contentContainerStyle={[
          styles.content,
          { paddingBottom: BOTTOM_NAVIGATION + insets.bottom + 24 },
        ]}
      >
        {activeDayPlans.map((item, index) => {
          const { startTime, endTime } = splitTimeRange(item.time);
          return (
            <PlanDetailItem
              key={`day${selectedDay}-item${index}`}
              title={item.plan_name}
              startTime={startTime}
              endTime={endTime}
              memo={item.note || undefined}
              location={item.place || undefined}
              price={item.price ?? undefined}
              showConnector={index + 1 < activeDayPlans.length}
            />
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  center: { alignItems: 'center', justifyContent: 'center' },
  content: { padding: 16, gap: 12 },
});
