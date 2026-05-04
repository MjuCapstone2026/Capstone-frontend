import React from 'react';
import { StyleSheet, View, Text, Pressable } from 'react-native';
import { useTheme } from '@/hooks/useTheme';
import { Typography, BorderRadius, Elevation } from '@/constants/theme';

type Props = {
  onPress: () => void;
};

export function NewTravelGenerateButton({ onPress }: Props) {
  const { colors, scheme } = useTheme();
  const textColor = scheme === 'dark' ? colors.textTitle : colors.cardBg;

  return (
    <Pressable
      onPress={onPress}
      style={[
        styles.button,
        {
          backgroundColor: colors.primary,
          borderColor: colors.primaryActive,
        },
        Elevation[scheme][2],
      ]}
    >
      {({ pressed }) => (
        <>
          <Text style={[styles.label, { color: textColor }]}>+  새 여행 만들기</Text>
          {pressed && (
            <View style={[StyleSheet.absoluteFill, styles.overlay, { backgroundColor: colors.pressOverlay }]} />
          )}
        </>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    borderWidth: 1,
    borderRadius: BorderRadius.full,
    paddingVertical: 8,
    paddingHorizontal: 16,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
    alignSelf: 'center',
  },
  label: {
    ...Typography['heading-sm'],
  },
  overlay: {
    borderRadius: BorderRadius.full,
  },
});
