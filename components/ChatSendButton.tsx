import React from 'react';
import { StyleSheet, View, Pressable } from 'react-native';
import { useTheme } from '@/hooks/useTheme';
import { BorderRadius, Elevation } from '@/constants/theme';
import IcChatSend from '@/assets/icons/ic_chat_send.svg';

type Props = {
  disabled?: boolean;
  onPress: () => void;
};

export function ChatSendButton({ disabled = false, onPress }: Props) {
  const { colors, scheme } = useTheme();

  const bgColor = disabled ? colors.secondarySurface : colors.primary;
  const iconColor = disabled
    ? colors.textCaption
    : scheme === 'dark'
      ? colors.textTitle
      : colors.primaryTint;

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      style={[
        styles.button,
        { backgroundColor: bgColor, borderColor: colors.divider },
        !disabled && Elevation[scheme][2],
      ]}
    >
      {({ pressed }) => (
        <>
          <IcChatSend width={20} height={20} color={iconColor} />
          {pressed && !disabled && (
            <View style={[StyleSheet.absoluteFill, styles.overlay, { backgroundColor: colors.pressOverlay }]} />
          )}
        </>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    width: 44,
    height: 44,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  overlay: {
    borderRadius: BorderRadius.lg,
  },
});
