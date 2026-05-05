import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { useTheme } from '@/hooks/useTheme';
import { Typography, BorderRadius } from '@/constants/theme';

type ReservationStatus = 'confirmed' | 'changed' | 'cancelled';

type Props = {
  status: ReservationStatus;
};

export function ReservationStatusBadge({ status }: Props) {
  const { colors, scheme } = useTheme();

  const dotColor =
    status === 'confirmed' ? colors.success :
    status === 'changed' ? colors.warning :
    colors.danger;

  const textColor = scheme === 'light' ? colors.cardBg : colors.textTitle;

  const label =
    status === 'confirmed' ? '확정' :
    status === 'changed' ? '변경' : '취소';

  return (
    <View style={styles.container}>
      <View style={[styles.dot, { backgroundColor: dotColor }]} />
      <Text style={[styles.label, { color: textColor }]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    alignSelf: 'flex-start',
  },
  dot: {
    width: 5,
    height: 5,
    borderRadius: BorderRadius.full,
  },
  label: {
    ...Typography['caption'],
    fontFamily: 'Pretendard-Bold',
  },
});
