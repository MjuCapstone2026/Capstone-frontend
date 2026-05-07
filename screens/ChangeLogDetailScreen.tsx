import { useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { useQuery } from '@tanstack/react-query';
import Toast from 'react-native-toast-message';
import { useTheme } from '@/hooks/useTheme';
import { useApi } from '@/hooks/useApi';
import { getItineraryLogs } from '@/api/itineraries';
import { queryKeys, STALE_TIMES, GC_TIMES } from '@/constants/queryKeys';
import { BOTTOM_NAVIGATION } from '@/constants/layout';
import { Typography } from '@/constants/theme';
import { getErrorMessage } from '@/utils/getErrorMessage';
import { ItineraryOverviewCard2BeforeEdit } from '@/components/ItineraryOverviewCard2BeforeEdit';
import { PlanDetailItem } from '@/components/PlanDetailItem';

type Props = {
  itineraryId: string;
  logId: string;
};

type DayPlanItem = {
  plan_name: string;
  time: string;
  place: string;
  note: string;
  status: string;
  price?: number | null;
};

const formatDateRange = (startDate: string, endDate: string): string =>
  `${startDate.replaceAll('-', '.')} ~ ${endDate.replaceAll('-', '.')}`;

const splitTimeRange = (time: string) => {
  const [startTime, endTime] = time.split('~').map((value) => value.trim());
  return {
    startTime: startTime || time,
    endTime: endTime || '',
  };
};

export function ChangeLogDetailScreen({ itineraryId, logId }: Props) {
  const [selectedDay, setSelectedDay] = useState(1);

  const { colors } = useTheme();
  const { authRequest } = useApi();
  const router = useRouter();

  const { data, isLoading, error } = useQuery({
    queryKey: queryKeys.itineraries.logs(itineraryId),
    queryFn: () => authRequest((token) => getItineraryLogs(token, itineraryId)),
    staleTime: STALE_TIMES.itineraries.logs,
    gcTime: GC_TIMES.itineraries.logs,
  });

  useEffect(() => {
    if (!error) return;
    Toast.show({ type: 'error', text1: getErrorMessage(error) });
  }, [error]);

  const selectedLog = useMemo(
    () => data?.logs.find((log) => log.logId === logId),
    [data?.logs, logId],
  );

  const dayDates = useMemo(
    () => Object.keys(selectedLog?.dayPlans ?? {}).sort(),
    [selectedLog?.dayPlans],
  );

  const selectedDate = dayDates[selectedDay - 1];
  const items: DayPlanItem[] = selectedDate ? selectedLog?.dayPlans[selectedDate] ?? [] : [];
  const changeLogDates = (data?.logs ?? []).map((log) => log.createdAt.slice(0, 10));

  useEffect(() => {
    if (dayDates.length > 0 && selectedDay > dayDates.length) {
      setSelectedDay(1);
    }
  }, [dayDates.length, selectedDay]);

  if (isLoading) {
    return (
      <View style={[styles.center, { backgroundColor: colors.pageBg }]}>
        <ActivityIndicator />
      </View>
    );
  }

  if (!selectedLog) {
    return (
      <View style={[styles.center, { backgroundColor: colors.pageBg }]}>
        <Text style={[styles.message, { color: colors.textSub }]}>변경 이력을 찾을 수 없습니다.</Text>
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.pageBg }]}>
      <ItineraryOverviewCard2BeforeEdit
        title={`${selectedLog.destination} 여행`}
        date={formatDateRange(selectedLog.startDate, selectedLog.endDate)}
        location={selectedLog.destination}
        dayCount={Math.max(dayDates.length, selectedLog.totalDays)}
        selectedDay={selectedDay}
        onDayPress={setSelectedDay}
        onBack={() => router.back()}
        changeLogs={changeLogDates}
        changeLogDate={selectedLog.createdAt.slice(0, 10)}
      />

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {items.length === 0 ? (
          <Text style={[styles.message, { color: colors.textSub }]}>해당 날짜의 일정이 없습니다.</Text>
        ) : (
          items.map((item, index) => {
            const { startTime, endTime } = splitTimeRange(item.time);
            return (
              <PlanDetailItem
                key={`${selectedDate}-${index}`}
                title={item.plan_name}
                startTime={startTime}
                endTime={endTime}
                memo={item.note}
                location={item.place}
                price={item.price ?? undefined}
                showConnector={index < items.length - 1}
                defaultOpen={index === 0}
              />
            );
          })
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    gap: 12,
    padding: 20,
    paddingBottom: BOTTOM_NAVIGATION + 24,
  },
  message: {
    ...Typography['body-md'],
    textAlign: 'center',
  },
});
