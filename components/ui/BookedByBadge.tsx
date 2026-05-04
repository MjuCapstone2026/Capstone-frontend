import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { useTheme } from '@/hooks/useTheme';
import { Typography, BorderRadius } from '@/constants/theme';

type Props = {
  bookedBy: 'ai' | 'user';
};

export function BookedByBadge({ bookedBy }: Props) {
  const { colors, scheme } = useTheme();

  const isAi = bookedBy === 'ai';

  const bg = isAi ? colors.progressBg : colors.primaryLight;
  const textColor = isAi
    ? colors.progress
    : scheme === 'dark' ? colors.textTitle : colors.cardBg;
  const label = isAi ? 'AI 예약' : '직접 예약';

  return (
    <View style={[styles.badge, { backgroundColor: bg, borderColor: colors.divider }]}>
      <Text style={[styles.label, { color: textColor }]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 4,
    alignSelf: 'flex-start',
  },
  label: {
    ...Typography['caption'],
  },
});
