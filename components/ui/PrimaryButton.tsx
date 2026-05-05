import React from 'react';
import { StyleSheet, View, Text, Pressable } from 'react-native';
import { useTheme } from '@/hooks/useTheme';
import { Typography, BorderRadius, Elevation } from '@/constants/theme';

type Props = {
  label: string;
  onPress: () => void;
  disabled?: boolean;
};

export function PrimaryButton({ label, onPress, disabled = false }: Props) {
  const { colors, scheme } = useTheme();

  const backgroundColor = disabled ? colors.secondarySurface : colors.primary;
  const borderColor = disabled ? colors.divider : colors.primaryActive;
  const textColor = disabled ? colors.textDisabled : (scheme === 'dark' ? colors.textTitle : colors.cardBg);
  const elevation = disabled ? {} : Elevation[scheme][2];

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      style={[styles.button, { backgroundColor, borderColor }, elevation]}
    >
      {({ pressed }) => (
        <>
          <Text style={[styles.label, { color: textColor }]}>{label}</Text>
          {pressed && !disabled && (
            <View
              style={[
                StyleSheet.absoluteFill,
                { backgroundColor: colors.pressOverlay, borderRadius: BorderRadius.md },
              ]}
            />
          )}
        </>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    height: 52,
    borderRadius: BorderRadius.md,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    ...Typography['heading-sm'],
  },
});
