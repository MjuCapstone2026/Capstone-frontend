import React from 'react';
import { StyleSheet, View, Text, Modal, Pressable } from 'react-native';
import { useTheme } from '@/hooks/useTheme';
import { Typography, BorderRadius, Elevation } from '@/constants/theme';

type Props = {
  visible: boolean;
  title: string;
  message: string;
  confirmLabel: string;
  onConfirm: () => void;
  onCancel: () => void;
};

export function Alert({ visible, title, message, confirmLabel, onConfirm, onCancel }: Props) {
  const { colors, scheme } = useTheme();

  return (
    <Modal transparent visible={visible} animationType="fade" statusBarTranslucent>
      <View style={[styles.scrim, { backgroundColor: colors.scrimModal }]}>
        <View style={[styles.dialog, { backgroundColor: colors.cardBg, borderColor: colors.divider }, Elevation[scheme][4]]}>
          <View style={styles.content}>
            <Text style={[styles.title, { color: colors.textTitle }]}>{title}</Text>
            <Text style={[styles.message, { color: colors.textCaption }]}>{message}</Text>
          </View>

          <View style={[styles.buttonRow, { borderTopColor: colors.divider }]}>
            <Pressable style={styles.button} onPress={onCancel}>
              {({ pressed }) => (
                <>
                  <Text style={[styles.buttonText, { color: colors.textCaption }]}>취소</Text>
                  {pressed && (
                    <View style={[StyleSheet.absoluteFill, { backgroundColor: colors.pressOverlay }]} />
                  )}
                </>
              )}
            </Pressable>

            <Pressable style={[styles.button, styles.confirmButton, { borderLeftColor: colors.divider }]} onPress={onConfirm}>
              {({ pressed }) => (
                <>
                  <Text style={[styles.buttonText, { color: colors.danger }]}>{confirmLabel}</Text>
                  {pressed && (
                    <View style={[StyleSheet.absoluteFill, { backgroundColor: colors.pressOverlay }]} />
                  )}
                </>
              )}
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  scrim: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  dialog: {
    width: 280,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    overflow: 'hidden',
  },
  content: {
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 20,
    gap: 8,
  },
  title: {
    ...Typography['body-lg'],
    textAlign: 'center',
  },
  message: {
    ...Typography['body-sm'],
    textAlign: 'center',
  },
  buttonRow: {
    flexDirection: 'row',
    borderTopWidth: 1,
  },
  button: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
  },
  confirmButton: {
    borderLeftWidth: 1,
  },
  buttonText: {
    ...Typography['body-md'],
  },
});
