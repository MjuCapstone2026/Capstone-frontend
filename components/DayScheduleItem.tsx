import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { useTheme } from '@/hooks/useTheme';
import { Typography, BorderRadius, Elevation } from '@/constants/theme';
import IcPin from '@/assets/icons/ic_pin.svg';
import { CheckButton } from '@/components/ui/CheckButton';
import { ScheduleStatusBadge } from '@/components/ui/ScheduleStatusBadge';

const ICON_TEXT_LINE_HEIGHT = 18;
const ICON_TOP_OFFSET = -2;

type Status = 'upcoming' | 'completed';

type Props = {
  title: string;
  startTime: string;
  endTime: string;
  location: string;
  memo?: string;
  status: Status;
  onToggle: () => void;
};

export function DayScheduleItem({ title, startTime, endTime, location, memo, status, onToggle }: Props) {
  const { colors, scheme } = useTheme();

  const isCompleted = status === 'completed';
  const badgeStatus = isCompleted ? 'completed' : 'draft';

  return (
    <View
      style={[
        styles.card,
        { backgroundColor: colors.cardBg, borderColor: colors.divider },
        Elevation[scheme][1],
        isCompleted && styles.completed,
      ]}
    >
      <View style={styles.row1}>
        <Text style={[styles.time, { color: colors.textCaption }]}>
          {startTime} ~ {endTime}
        </Text>
        <View style={styles.statusBadgeWrapper}>
          <ScheduleStatusBadge status={badgeStatus} />
        </View>
        <View style={styles.spacer} />
        <CheckButton checked={isCompleted} onToggle={onToggle} />
      </View>

      <Text style={[styles.title, { color: colors.textTitle }]}>
        {title}
      </Text>

      <View style={styles.locationRow}>
        <View style={styles.locationIconFrame}>
          <IcPin width={14} height={14} color={colors.textCaption} />
        </View>
        <Text style={[styles.locationText, { color: colors.textCaption }]}>
          {location}
        </Text>
      </View>

      {memo ? (
        <Text style={[styles.memo, { color: colors.textCaption }]}>{memo}</Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    gap: 4,
  },
  completed: {
    opacity: 0.6,
  },
  row1: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  time: {
    ...Typography['body-md'],
  },
  spacer: {
    flex: 1,
  },
  statusBadgeWrapper: {
    alignSelf: 'center',
  },
  title: {
    ...Typography['heading-md'],
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 4,
  },
  locationIconFrame: {
    alignItems: 'center',
    height: ICON_TEXT_LINE_HEIGHT,
    justifyContent: 'center',
    marginTop: ICON_TOP_OFFSET,
  },
  locationText: {
    ...Typography['body-md'],
    flex: 1,
    includeFontPadding: false,
    lineHeight: ICON_TEXT_LINE_HEIGHT,
  },
  memo: {
    ...Typography['body-md'],
  },
});
