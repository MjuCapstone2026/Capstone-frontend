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
import { OverflowMenuContent } from '@/components/ui/OverflowMenu';

type ChatItem = {
  id: string | number;
  title: string;
};

type ContextMenu = {
  chatId: string | number;
  y: number;
};

type Props = {
  visible: boolean;
  chats: ChatItem[];
  activeChatId?: string | number;
  onClose: () => void;
  onAfterClose?: () => void;
  onNewChat: () => void;
  onChatPress: (id: string | number) => void;
  onChatRename: (id: string | number) => void;
  onChatEditInfo: (id: string | number) => void;
  onChatViewPlan: (id: string | number) => void;
  onChatDelete: (id: string | number) => void;
};

export function NavigationDrawer({
  visible,
  chats,
  activeChatId,
  onClose,
  onAfterClose,
  onNewChat,
  onChatPress,
  onChatRename,
  onChatEditInfo,
  onChatViewPlan,
  onChatDelete,
}: Props) {
  const { colors, scheme } = useTheme();
  const { width: screenWidth } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const drawerWidth = Math.min(screenWidth * 0.85, 340);

  const slideAnim = useRef(new Animated.Value(-drawerWidth)).current;
  const onAfterCloseRef = useRef(onAfterClose);
  const hasPresentedRef = useRef(false);
  const [mounted, setMounted] = useState(false);
  const [contextMenu, setContextMenu] = useState<ContextMenu | null>(null);

  const itemRefs = useRef(new Map<string | number, View | null>());
  const scaleAnims = useRef(new Map<string | number, Animated.Value>());

  onAfterCloseRef.current = onAfterClose;

  const getScaleAnim = (id: string | number): Animated.Value => {
    if (!scaleAnims.current.has(id)) {
      scaleAnims.current.set(id, new Animated.Value(1));
    }
    return scaleAnims.current.get(id)!;
  };

  useEffect(() => {
    if (visible) {
      hasPresentedRef.current = true;
      setMounted(true);
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 250,
        useNativeDriver: true,
      }).start();
    } else if (hasPresentedRef.current) {
      setContextMenu(null);
      Animated.timing(slideAnim, {
        toValue: -drawerWidth,
        duration: 200,
        useNativeDriver: true,
      }).start(({ finished }) => {
        if (!finished) return;
        hasPresentedRef.current = false;
        setMounted(false);
        onAfterCloseRef.current?.();
      });
    }
  }, [visible, drawerWidth, slideAnim]);

  // 컨텍스트 메뉴 열릴 때 해당 항목만 확대, 나머지·닫힐 때 원복
  useEffect(() => {
    scaleAnims.current.forEach((anim, id) => {
      Animated.spring(anim, {
        toValue: contextMenu?.chatId === id ? 1.04 : 1,
        useNativeDriver: true,
        damping: 15,
        stiffness: 200,
      }).start();
    });
  }, [contextMenu]);

  const activeChatBg = scheme === 'light' ? colors.primaryTint : colors.primaryActive;

  return (
    <Modal transparent visible={mounted} animationType="none" statusBarTranslucent>
      <View style={StyleSheet.absoluteFill}>
        {/* contextMenu가 열려있으면 backdrop이 드로어 닫기 대신 메뉴만 닫음 */}
        <Pressable
          style={[StyleSheet.absoluteFill, { backgroundColor: colors.scrimDrawer }]}
          onPress={contextMenu ? () => setContextMenu(null) : onClose}
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
          <Pressable
            style={styles.newChatButton}
            onPress={() => {
              setContextMenu(null);
              onNewChat();
            }}
          >
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
              const isSelected = contextMenu?.chatId === chat.id;
              const scaleAnim = getScaleAnim(chat.id);
              return (
                <View
                  key={chat.id}
                  ref={(el) => {
                    if (el) {
                      itemRefs.current.set(chat.id, el);
                    } else {
                      itemRefs.current.delete(chat.id);
                    }
                  }}
                >
                  {/* 선택 상태: Pressable의 overflow:hidden이 그림자를 클리핑하므로
                      배경색·elevation·scale을 Animated.View에서 처리 */}
                  <Animated.View
                    style={[
                      isSelected && [
                        styles.selectedCard,
                        { backgroundColor: colors.cardBg },
                        Elevation[scheme][4],
                      ],
                      // transform은 항상 유지 — 조건부로 제거하면 iOS native driver가
                      // 마지막 값을 그대로 보존해 scale이 복원되지 않음
                      { transform: [{ scale: scaleAnim }] },
                    ]}
                  >
                    <Pressable
                      style={[
                        styles.chatItem,
                        isActive && [{ backgroundColor: activeChatBg }, Elevation[scheme][4]],
                      ]}
                      onPress={() => {
                        setContextMenu(null);
                        onChatPress(chat.id);
                      }}
                      onLongPress={() => {
                        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
                        const ref = itemRefs.current.get(chat.id);
                        if (ref) {
                          ref.measure((_x, _y, _w, h, _px, py) => {
                            setContextMenu({ chatId: chat.id, y: py + h });
                          });
                        }
                      }}
                    >
                      {({ pressed }) => (
                        <>
                          <Text
                            style={[
                              styles.chatTitle,
                              { color: isActive || isSelected ? colors.textTitle : colors.textSub },
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
                  </Animated.View>
                </View>
              );
            })}
          </ScrollView>

          {/* context menu가 열린 동안 드로어 내부 빈 영역 터치도 메뉴 닫기로 처리 */}
          {contextMenu && (
            <Pressable style={StyleSheet.absoluteFill} onPress={() => setContextMenu(null)} />
          )}
        </Animated.View>

        {contextMenu && (
          <OverflowMenuContent
            position={{ top: contextMenu.y, right: screenWidth - drawerWidth + 8 }}
            onClose={() => setContextMenu(null)}
            onRename={() => onChatRename(contextMenu.chatId)}
            onEditInfo={() => onChatEditInfo(contextMenu.chatId)}
            onViewPlan={() => onChatViewPlan(contextMenu.chatId)}
            onDelete={() => onChatDelete(contextMenu.chatId)}
          />
        )}
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
  selectedCard: {
    borderRadius: BorderRadius.lg,
  },
  chatTitle: {
    ...Typography['body-md'],
  },
  chatItemOverlay: {
    borderRadius: BorderRadius.lg,
  },
});
