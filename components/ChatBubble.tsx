import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { useTheme } from '@/hooks/useTheme';
import { Typography, BorderRadius, Elevation } from '@/constants/theme';
import IcAi from '@/assets/icons/ic_ai.svg';
import IcUser from '@/assets/icons/ic_user.svg';

type Variant = 'ai' | 'user';

type Props = {
  variant: Variant;
  message: string;
  timestamp: string;
  hideTimestamp?: boolean;
};

export function ChatBubble({ variant, message, timestamp, hideTimestamp = false }: Props) {
  const { colors, scheme } = useTheme();

  const isUser = variant === 'user';
  const iconColor = scheme === 'dark' ? colors.textTitle : colors.cardBg;

  return (
    <View style={[styles.wrapper, isUser && styles.wrapperUser]}>
      <View style={styles.header}>
        {isUser ? (
          <>
            <Text style={[styles.senderLabel, { color: colors.textTitle }]}>사용자</Text>
            <View style={[styles.iconContainer, styles.iconContainerUser, { backgroundColor: colors.primary }]}>
              <IcUser width={15} height={18} color={iconColor} />
            </View>
          </>
        ) : (
          <>
            <View style={[styles.iconContainer, { backgroundColor: colors.primary }]}>
              <IcAi width={12} height={12} color={iconColor} />
            </View>
            <Text style={[styles.senderLabel, { color: colors.textTitle }]}>AI 에이전트</Text>
          </>
        )}
      </View>

      <View
        style={[
          styles.bubble,
          { backgroundColor: isUser ? colors.secondarySurface : colors.cardBg },
          { borderColor: colors.divider },
          Elevation[scheme][1],
        ]}
      >
        <Text style={[styles.message, { color: colors.textTitle }]}>{message}</Text>
      </View>

      {!hideTimestamp && (
        <Text style={[styles.timestamp, { color: colors.textCaption }]}>{timestamp}</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    alignItems: 'flex-start',
    marginBottom: 16,
    paddingHorizontal: 16,
  },
  wrapperUser: {
    alignItems: 'flex-end',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 6,
  },
  iconContainer: {
    width: 24,
    height: 24,
    borderRadius: BorderRadius.full,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconContainerUser: {
    justifyContent: 'flex-end',
    paddingLeft: 1,
  },
  senderLabel: {
    ...Typography['caption'],
  },
  bubble: {
    maxWidth: '80%',
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    ...Typography['body-md'],
  },
  message: {
    ...Typography['body-md'],
  },
  timestamp: {
    marginTop: 4,
    ...Typography['caption'],
  },
});
