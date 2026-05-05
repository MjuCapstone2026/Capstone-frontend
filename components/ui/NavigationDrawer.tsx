import React, { useEffect, useRef, useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  Modal,
  Pressable,
  Animated,
  useWindowDimensions,
  ScrollView,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';
import { useTheme } from '@/hooks/useTheme';
import { Typography, BorderRadius, Elevation } from '@/constants/theme';
import IcPlusChat from '@/assets/icons/ic_plus_chat.svg';

type ChatItem = {
  id: string | number;
  title: string;
};

type Props = {
  visible: boolean;
  chats: ChatItem[];
  activeChatId?: string | number;
  onClose: () => void;
  onNewChat: () => void;
  onChatPress: (id: string | number) => void;
  onChatLongPress: (id: string | number) => void;
};

export function NavigationDrawer({
  visible,
  chats,
  activeChatId,
  onClose,
  onNewChat,
  onChatPress,
  onChatLongPress,
}: Props) {
  const { colors, scheme } = useTheme();
  const { width: screenWidth } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const drawerWidth = Math.min(screenWidth * 0.85, 340);

  const slideAnim = useRef(new Animated.Value(-drawerWidth)).current;
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    if (visible) {
      setMounted(true);
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 250,
        useNativeDriver: true,
      }).start();
    } else {
      Animated.timing(slideAnim, {
        toValue: -drawerWidth,
        duration: 200,
        useNativeDriver: true,
      }).start(() => setMounted(false));
    }
  }, [visible, drawerWidth]);

  const activeChatBg = scheme === 'light' ? colors.primaryTint : colors.primaryActive;

  return (
    <Modal transparent visible={mounted} animationType="none" statusBarTranslucent>
      <View style={StyleSheet.absoluteFill}>
        <Pressable
          style={[StyleSheet.absoluteFill, { backgroundColor: colors.scrimDrawer }]}
          onPress={onClose}
        />

        <Animated.View
          style={[
            styles.drawer,
            {
              width: drawerWidth,
              backgroundColor: colors.cardBg,
              borderRightColor: colors.divider,
              paddingTop: insets.top,
              paddingBottom: insets.bottom,
              transform: [{ translateX: slideAnim }],
            },
            Elevation[scheme][4],
          ]}
        >
          <Pressable style={styles.newChatButton} onPress={onNewChat}>
            {({ pressed }) => (
              <>
                <IcPlusChat width={20} height={20} color={colors.primary} />
                <Text style={[styles.newChatText, { color: colors.primary }]}>새 채팅</Text>
                {pressed && (
                  <View style={[StyleSheet.absoluteFill, { backgroundColor: colors.pressOverlay }]} />
                )}
              </>
            )}
          </Pressable>

          <Text style={[styles.sectionLabel, { color: colors.textSub }]}>채팅</Text>

          <ScrollView
            style={styles.chatList}
            contentContainerStyle={styles.chatListContent}
            showsVerticalScrollIndicator={false}
          >
            {chats.map((chat) => {
              const isActive = chat.id === activeChatId;
              return (
                <Pressable
                  key={chat.id}
                  style={[
                    styles.chatItem,
                    isActive && [{ backgroundColor: activeChatBg }, Elevation[scheme][4]],
                  ]}
                  onPress={() => onChatPress(chat.id)}
                  onLongPress={() => {
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                    onChatLongPress(chat.id);
                  }}
                >
                  {({ pressed }) => (
                    <>
                      <Text
                        style={[
                          styles.chatTitle,
                          { color: isActive ? colors.textTitle : colors.textSub },
                        ]}
                        numberOfLines={1}
                      >
                        {chat.title}
                      </Text>
                      {pressed && (
                        <View
                          style={[
                            StyleSheet.absoluteFill,
                            styles.chatItemOverlay,
                            { backgroundColor: colors.pressOverlay },
                          ]}
                        />
                      )}
                    </>
                  )}
                </Pressable>
              );
            })}
          </ScrollView>
        </Animated.View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  drawer: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    borderRightWidth: 1,
  },
  newChatButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 20,
    paddingVertical: 16,
    overflow: 'hidden',
  },
  newChatText: {
    ...Typography['body-md'],
  },
  sectionLabel: {
    ...Typography['body-md'],
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 8,
  },
  chatList: {
    flex: 1,
    paddingHorizontal: 8,
  },
  chatListContent: {
    paddingBottom: 8,
  },
  chatItem: {
    paddingHorizontal: 12,
    paddingVertical: 12,
    borderRadius: BorderRadius.lg,
    overflow: 'hidden',
  },
  chatTitle: {
    ...Typography['body-md'],
  },
  chatItemOverlay: {
    borderRadius: BorderRadius.lg,
  },
});
