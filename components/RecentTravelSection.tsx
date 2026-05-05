import React from 'react';
import { StyleSheet, View, Text, Pressable } from 'react-native';
import { useTheme } from '@/hooks/useTheme';
import { Typography, BorderRadius, Elevation } from '@/constants/theme';

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

function StatusBadge({ status }: { status: TravelStatus }) {
  const { colors } = useTheme();

  const isUpcoming = status === 'upcoming';
  const bg = isUpcoming ? colors.successBg : colors.secondarySurface;
  const textColor = isUpcoming ? colors.success : colors.textCaption;
  const label = isUpcoming ? '예정' : '완료';

  return (
    <View style={[styles.badge, { backgroundColor: bg, borderColor: colors.divider }]}>
      <Text style={[styles.badgeLabel, { color: textColor }]}>{label}</Text>
    </View>
  );
}

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
                  <StatusBadge status={travel.status} />
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
  badge: {
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    paddingHorizontal: 10,
    paddingVertical: 3,
    alignSelf: 'flex-start',
  },
  badgeLabel: {
    ...Typography['caption'],
  },
  overlay: {
    borderRadius: BorderRadius.lg,
  },
});
