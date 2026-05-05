import React from 'react';
import { StyleSheet, View, Text, Pressable } from 'react-native';
import { useTheme } from '@/hooks/useTheme';
import { Typography, BorderRadius, Elevation } from '@/constants/theme';
import IcPlan from '@/assets/icons/ic_plan.svg';
import IcPin from '@/assets/icons/ic_pin.svg';
import IcClock from '@/assets/icons/ic_clock.svg';

type Status = 'upcoming' | 'completed';

type Props = {
  title: string;
  startDate: string;
  destination: string;
  duration: string;
  status: Status;
  onPress: () => void;
  onStatusToggle: () => void;
};

export function TravelPlanCard({
  title,
  startDate,
  destination,
  duration,
  status,
  onPress,
  onStatusToggle,
}: Props) {
  const { colors, scheme } = useTheme();

  const isCompleted = status === 'completed';
  const statusBg = isCompleted ? colors.successBg : colors.warningBg;
  const statusTextColor = isCompleted ? colors.success : colors.warning;
  const statusLabel = isCompleted ? '완료' : '예정';
  const circleColor = scheme === 'light' ? colors.cardBg : colors.textTitle;

  return (
    <Pressable
      onPress={onPress}
      style={[
        styles.card,
        { backgroundColor: colors.cardBg, borderColor: colors.divider },
        Elevation[scheme][1],
      ]}
    >
      {({ pressed }) => (
        <>
          <View style={styles.headerRow}>
            <Text style={[styles.title, { color: colors.textTitle }]} numberOfLines={2}>
              {title}
            </Text>
            <Pressable
              onPress={onStatusToggle}
              style={[styles.statusPill, { backgroundColor: statusBg, borderColor: colors.divider }]}
            >
              {({ pressed: pillPressed }) => (
                <>
                  {isCompleted && (
                    <View style={[styles.statusCircle, { backgroundColor: circleColor }, Elevation[scheme][2]]} />
                  )}
                  <Text style={[styles.statusText, { color: statusTextColor }]}>{statusLabel}</Text>
                  {!isCompleted && (
                    <View style={[styles.statusCircle, { backgroundColor: circleColor }, Elevation[scheme][2]]} />
                  )}
                  {pillPressed && (
                    <View
                      style={[
                        StyleSheet.absoluteFill,
                        { backgroundColor: colors.pressOverlay, borderRadius: BorderRadius.full },
                      ]}
                    />
                  )}
                </>
              )}
            </Pressable>
          </View>
          <View style={styles.infoRows}>
            <View style={styles.infoRow}>
              <IcPlan width={14} height={14} color={colors.textCaption} />
              <Text style={[styles.infoText, { color: colors.textCaption }]}>{startDate}</Text>
            </View>
            <View style={styles.infoRow}>
              <IcPin width={14} height={14} color={colors.textCaption} />
              <Text style={[styles.infoText, { color: colors.textCaption }]}>{destination}</Text>
            </View>
            <View style={styles.infoRow}>
              <IcClock width={14} height={14} color={colors.textCaption} />
              <Text style={[styles.infoText, { color: colors.textCaption }]}>{duration}</Text>
            </View>
          </View>
          {pressed && (
            <View
              style={[
                StyleSheet.absoluteFill,
                { backgroundColor: colors.pressOverlay, borderRadius: BorderRadius.lg },
              ]}
            />
          )}
        </>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    padding: 20,
    gap: 12,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
  },
  title: {
    ...Typography['heading-md'],
    flex: 1,
  },
  statusPill: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: BorderRadius.full,
    borderWidth: 1,
    paddingVertical: 4,
    paddingHorizontal: 8,
    gap: 6,
    overflow: 'hidden',
  },
  statusText: {
    ...Typography['body-sm'],
  },
  statusCircle: {
    width: 18,
    height: 18,
    borderRadius: BorderRadius.full,
  },
  infoRows: {
    gap: 8,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  infoText: {
    ...Typography['body-md'],
  },
});
