import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { useTheme } from '@/hooks/useTheme';
import { Typography, BorderRadius } from '@/constants/theme';

type ScheduleStatus = 'draft' | 'completed';

type Props = {
  status: ScheduleStatus;
};

export function ScheduleStatusBadge({ status }: Props) {
  const { colors } = useTheme();

  const bgColor = status === 'draft' ? colors.warningBg : colors.successBg;
  const textColor = status === 'draft' ? colors.warning : colors.success;
  const label = status === 'draft' ? '예정' : '완료';

  return (
    <View style={[styles.badge, { backgroundColor: bgColor, borderColor: colors.divider }]}>
      <Text style={[styles.label, { color: textColor }]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 3,
    alignSelf: 'flex-start',
  },
  label: {
    ...Typography['caption'],
    fontFamily: 'Pretendard-Bold',
  },
});
