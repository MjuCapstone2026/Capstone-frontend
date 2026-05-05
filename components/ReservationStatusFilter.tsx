import React from 'react';
import { StyleSheet, View, Text, Pressable } from 'react-native';
import { useTheme } from '@/hooks/useTheme';
import { Typography, BorderRadius, Elevation } from '@/constants/theme';

type ReservationStatus = 'all' | 'confirmed' | 'changed' | 'cancelled';

type Props = {
  selected: ReservationStatus;
  onSelect: (status: ReservationStatus) => void;
};

const FILTERS: { key: ReservationStatus; label: string }[] = [
  { key: 'all', label: '전체' },
  { key: 'confirmed', label: '확정' },
  { key: 'changed', label: '변경' },
  { key: 'cancelled', label: '취소' },
];

export function ReservationStatusFilter({ selected, onSelect }: Props) {
  const { colors, scheme } = useTheme();

  return (
    <View
      style={[
        styles.filterBar,
        { backgroundColor: colors.cardBg, borderBottomColor: colors.divider },
      ]}
    >
      {FILTERS.map(({ key, label }) => {
        const isActive = selected === key;
        const chipBg = isActive ? colors.primary : colors.secondarySurface;
        const chipTextColor = isActive
          ? scheme === 'light'
            ? colors.cardBg
            : colors.textTitle
          : colors.textDisabled;

        return (
          <Pressable
            key={key}
            onPress={() => onSelect(key)}
            style={[
              styles.chip,
              { backgroundColor: chipBg, borderColor: colors.divider },
              isActive && Elevation[scheme][2],
            ]}
          >
            {({ pressed }) => (
              <>
                <Text
                  style={[
                    isActive ? styles.chipTextActive : styles.chipText,
                    { color: chipTextColor },
                  ]}
                >
                  {label}
                </Text>
                {pressed && (
                  <View
                    style={[
                      StyleSheet.absoluteFill,
                      {
                        backgroundColor: colors.pressOverlay,
                        borderRadius: BorderRadius.lg,
                      },
                    ]}
                  />
                )}
              </>
            )}
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  filterBar: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 10,
    borderBottomWidth: 1,
  },
  chip: {
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  chipText: {
    ...Typography['body-md'],
  },
  chipTextActive: {
    ...Typography['body-md'],
    fontFamily: 'Pretendard-Bold',
  },
});
