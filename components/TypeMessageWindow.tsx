import React, { useState } from 'react';
import { StyleSheet, View, TextInput } from 'react-native';
import { useTheme } from '@/hooks/useTheme';
import { Typography, BorderRadius } from '@/constants/theme';
import { ChatSendButton } from '@/components/ChatSendButton';

type Props = {
  onSend: (message: string) => void;
};

export function TypeMessageWindow({ onSend }: Props) {
  const { colors } = useTheme();
  const [text, setText] = useState('');

  const isActive = text.trim().length > 0;

  const handleSend = () => {
    if (!isActive) return;
    onSend(text.trim());
    setText('');
  };

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: colors.cardBg, borderTopColor: colors.divider },
      ]}
    >
      <TextInput
        style={[
          styles.input,
          {
            backgroundColor: colors.secondarySurface,
            borderColor: colors.divider,
            color: colors.textTitle,
          },
        ]}
        placeholder="메시지를 입력하세요"
        placeholderTextColor={colors.textDisabled}
        value={text}
        onChangeText={setText}
        returnKeyType="send"
        onSubmitEditing={handleSend}
        blurOnSubmit={false}
      />
      <ChatSendButton disabled={!isActive} onPress={handleSend} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 17,
    borderTopWidth: 1,
    gap: 8,
  },
  input: {
    flex: 1,
    height: 48,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    paddingHorizontal: 16,
    textAlignVertical: 'center',
    ...Typography['body-lg'],
    lineHeight: undefined,
  },
});
