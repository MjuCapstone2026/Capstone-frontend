import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, Modal, Pressable, TextInput } from 'react-native';
import { useTheme } from '@/hooks/useTheme';
import { Typography, BorderRadius, Elevation } from '@/constants/theme';

type Props = {
  visible: boolean;
  initialName: string;
  onSave: (name: string) => void;
  onCancel: () => void;
};

export function RenameChatModal({ visible, initialName, onSave, onCancel }: Props) {
  const { colors, scheme } = useTheme();
  const [name, setName] = useState(initialName);

  useEffect(() => {
    if (visible) setName(initialName);
  }, [visible, initialName]);

  return (
    <Modal transparent visible={visible} animationType="fade" statusBarTranslucent>
      <View style={[styles.scrim, { backgroundColor: colors.scrimModal }]}>
        <View
          style={[
            styles.dialog,
            { backgroundColor: colors.cardBg, borderColor: colors.divider },
            Elevation[scheme][4],
          ]}
        >
          <View style={styles.content}>
            <Text style={[styles.title, { color: colors.textTitle }]}>채팅 이름 변경</Text>
            <TextInput
              style={[styles.input, { backgroundColor: colors.secondarySurface, color: colors.textTitle }]}
              value={name}
              onChangeText={setName}
              placeholderTextColor={colors.textCaption}
              autoFocus
            />
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

            <Pressable
              style={[styles.button, styles.saveButton, { borderLeftColor: colors.divider }]}
              onPress={() => onSave(name.trim())}
            >
              {({ pressed }) => (
                <>
                  <Text style={[styles.buttonText, { color: colors.primary }]}>저장</Text>
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
    gap: 16,
  },
  title: {
    ...Typography['heading-sm'],
  },
  input: {
    borderRadius: BorderRadius.sm,
    paddingHorizontal: 16,
    paddingVertical: 11,
    ...Typography['body-md'],
  },
  buttonRow: {
    flexDirection: 'row',
    borderTopWidth: 1,
  },
  button: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    overflow: 'hidden',
  },
  saveButton: {
    borderLeftWidth: 1,
  },
  buttonText: {
    ...Typography['body-md'],
  },
});
