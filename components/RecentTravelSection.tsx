import React from 'react';
import { StyleSheet, View, Text, Pressable } from 'react-native';
import { useTheme } from '@/hooks/useTheme';
import { Typography, BorderRadius, Elevation } from '@/constants/theme';
import { ScheduleStatusBadge } from '@/components/ui/ScheduleStatusBadge';

type TravelStatus = 'upcoming' | 'completed';

type TravelItem = {
  id: string | number;
  title: string;
  dateRange: string;
  status: TravelStatus;
};

type Props = {
  travels: TravelItem[];
  onTravelPress: (id: string | number) => void;
  onMorePress: () => void;
};

export function RecentTravelSection({ travels, onTravelPress, onMorePress }: Props) {
  const { colors, scheme } = useTheme();

  return (
    <View style={styles.container}>
      <View style={styles.sectionHeader}>
        <Text style={[styles.sectionTitle, { color: colors.textSub }]}>최근 여행</Text>
        <Pressable onPress={onMorePress}>
          {({ pressed }) => (
            <>
              <Text style={[styles.moreText, { color: colors.primary }]}>전체보기</Text>
              {pressed && (
                <View
                  style={[
                    StyleSheet.absoluteFill,
                    { backgroundColor: colors.pressOverlay, borderRadius: BorderRadius.sm },
                  ]}
                />
              )}
            </>
          )}
        </Pressable>
      </View>

      <View style={styles.list}>
        {travels.map((travel) => (
          <Pressable
            key={travel.id}
            style={[
              styles.card,
              { backgroundColor: colors.cardBg, borderColor: colors.divider },
              Elevation[scheme][1],
            ]}
            onPress={() => onTravelPress(travel.id)}
          >
            {({ pressed }) => (
              <>
                <View style={styles.cardTop}>
                  <Text style={[styles.travelTitle, { color: colors.textTitle }]} numberOfLines={1}>
                    {travel.title}
                  </Text>
                  <ScheduleStatusBadge status={travel.status === 'upcoming' ? 'draft' : 'completed'} />
                </View>
                <Text style={[styles.dateRange, { color: colors.textSub }]}>{travel.dateRange}</Text>

                {pressed && (
                  <View style={[StyleSheet.absoluteFill, styles.overlay, { backgroundColor: colors.pressOverlay }]} />
                )}
              </>
            )}
          </Pressable>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 12,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  sectionTitle: {
    ...Typography['heading-md'],
  },
  moreText: {
    ...Typography['body-md'],
  },
  list: {
    gap: 8,
  },
  card: {
    gap: 4,
    padding: 16,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    overflow: 'hidden',
  },
  cardTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
  },
  travelTitle: {
    ...Typography['body-lg'],
    flex: 1,
  },
  dateRange: {
    ...Typography['body-md'],
  },
  overlay: {
    borderRadius: BorderRadius.lg,
  },
});
