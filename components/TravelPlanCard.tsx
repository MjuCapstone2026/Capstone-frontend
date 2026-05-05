import React from 'react';
import { StyleSheet, View, Text, Pressable } from 'react-native';
import { useTheme } from '@/hooks/useTheme';
import { Typography, BorderRadius, Elevation } from '@/constants/theme';
import { StatusToggle } from '@/components/ui/StatusToggle';
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
            <StatusToggle
              status={status === 'completed' ? 'completed' : 'draft'}
              onToggle={onStatusToggle}
            />
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
