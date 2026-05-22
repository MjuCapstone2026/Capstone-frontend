import React from 'react';
import { StyleSheet, View, Pressable } from 'react-native';
import { useTheme } from '@/hooks/useTheme';
import { BorderRadius } from '@/constants/theme';
import IcCheck from '@/assets/icons/ic_check.svg';
import IcUncheck from '@/assets/icons/ic_uncheck.svg';

type Props = {
  checked: boolean;
  onToggle: () => void;
  disabled?: boolean;
};

export function CheckButton({ checked, onToggle, disabled = false }: Props) {
  const { colors } = useTheme();

  const color = checked ? colors.primary : colors.textCaption;

  return (
    <Pressable onPress={onToggle} hitSlop={12} disabled={disabled}>
      {({ pressed }) => (
        <View style={[styles.wrapper, disabled && styles.disabled, pressed && { backgroundColor: colors.pressOverlay }]}>
          {checked
            ? <IcCheck width={24} height={24} color={color} />
            : <IcUncheck width={24} height={24} color={color} />
          }
        </View>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    borderRadius: BorderRadius.full,
    padding: 2,
    overflow: 'hidden',
    alignSelf: 'flex-start',
  },
  disabled: {
    opacity: 0.45,
  },
});
