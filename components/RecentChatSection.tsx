import React from 'react';
import { StyleSheet, View, Text, Pressable } from 'react-native';
import { useTheme } from '@/hooks/useTheme';
import { Typography, BorderRadius, Elevation } from '@/constants/theme';
import IcChat from '@/assets/icons/ic_chat.svg';

type ChatItem = {
  id: string | number;
  title: string;
  aiSummary: string;
  updatedAt: string;
};

type Props = {
  chats: ChatItem[];
  onChatPress: (id: string | number) => void;
  onMorePress: () => void;
};

export function RecentChatSection({ chats, onChatPress, onMorePress }: Props) {
  const { colors, scheme } = useTheme();
  const iconColor = scheme === 'light' ? colors.primaryLight : colors.primary;

  return (
    <View style={styles.container}>
      <View style={styles.sectionHeader}>
        <Text style={[styles.sectionTitle, { color: colors.textSub }]}>최근 채팅</Text>
        <Pressable onPress={onMorePress}>
          {({ pressed }) => (
            <>
              <Text style={[styles.moreText, { color: colors.primary }]}>전체보기</Text>
              {pressed && (
                <View
                  style={[
                    StyleSheet.absoluteFill,
                    { backgroundColor: colors.pressOverlay, borderRadius: BorderRadius.sm },
                  ]}
                />
              )}
            </>
          )}
        </Pressable>
      </View>

      <View style={styles.list}>
        {chats.map((chat) => (
          <Pressable
            key={chat.id}
            style={[
              styles.card,
              { backgroundColor: colors.cardBg, borderColor: colors.divider },
              Elevation[scheme][1],
            ]}
            onPress={() => onChatPress(chat.id)}
          >
            {({ pressed }) => (
              <>
                <View style={[styles.iconContainer, { backgroundColor: colors.primaryTint }]}>
                  <IcChat width={20} height={20} color={iconColor} />
                </View>

                <View style={styles.content}>
                  <View style={styles.contentTop}>
                    <Text style={[styles.chatTitle, { color: colors.textTitle }]} numberOfLines={1}>
                      {chat.title}
                    </Text>
                    <Text style={[styles.time, { color: colors.textCaption }]}>{chat.updatedAt}</Text>
                  </View>
                  <Text style={[styles.preview, { color: colors.textCaption }]} numberOfLines={1}>
                    {chat.aiSummary}
                  </Text>
                </View>

                {pressed && (
                  <View style={[StyleSheet.absoluteFill, styles.overlay, { backgroundColor: colors.pressOverlay }]} />
                )}
              </>
            )}
          </Pressable>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 12,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  sectionTitle: {
    ...Typography['heading-md'],
  },
  moreText: {
    ...Typography['body-md'],
  },
  list: {
    gap: 8,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 16,
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    overflow: 'hidden',
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: BorderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    flex: 1,
    gap: 4,
  },
  contentTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
  },
  chatTitle: {
    ...Typography['body-lg'],
    flex: 1,
  },
  time: {
    ...Typography['caption'],
  },
  preview: {
    ...Typography['body-md'],
  },
  overlay: {
    borderRadius: BorderRadius.lg,
  },
});
