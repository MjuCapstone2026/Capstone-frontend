import React from 'react';
import { StyleSheet, View, Text, Pressable } from 'react-native';
import { useTheme } from '@/hooks/useTheme';
import { Typography } from '@/constants/theme';

type ReservationType = 'all' | 'flight' | 'accommodation';

type Props = {
  selected: ReservationType;
  onSelect: (type: ReservationType) => void;
};

const TABS: { key: ReservationType; label: string }[] = [
  { key: 'all', label: '전체' },
  { key: 'flight', label: '항공' },
  { key: 'accommodation', label: '숙소' },
];

export function ReservationTypeTab({ selected, onSelect }: Props) {
  const { colors } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: colors.cardBg }]}>
      {TABS.map(({ key, label }) => {
        const isActive = selected === key;
        const borderColor = isActive ? colors.primary : colors.primaryTint;
        const textColor = isActive ? colors.textTitle : colors.textDisabled;

        return (
          <Pressable
            key={key}
            onPress={() => onSelect(key)}
            style={[styles.tab, { borderBottomColor: borderColor }]}
          >
            {({ pressed }) => (
              <>
                <Text style={[isActive ? styles.tabTextActive : styles.tabText, { color: textColor }]}>
                  {label}
                </Text>
                {pressed && (
                  <View style={[StyleSheet.absoluteFill, { backgroundColor: colors.pressOverlay }]} />
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
  container: {
    flexDirection: 'row',
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderBottomWidth: 2,
    overflow: 'hidden',
  },
  tabText: {
    ...Typography['body-md'],
  },
  tabTextActive: {
    ...Typography['body-md'],
    fontFamily: 'Pretendard-Bold',
  },
});
