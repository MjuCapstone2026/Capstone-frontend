import React from 'react';
import { StyleSheet, View, Text, Pressable } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '@/hooks/useTheme';
import { Typography, Elevation, BorderRadius } from '@/constants/theme';
import { CHAT_HEADER_HEIGHT } from '@/constants/layout';
import IcDrawer from '@/assets/icons/ic_drawer.svg';
import IcOverflow from '@/assets/icons/ic_overflow.svg';

type Variant = 'default' | 'active';

type Props = {
  variant: Variant;
  title?: string;
  onDrawerOpen: () => void;
  onOverflowOpen?: () => void;
};

export function ChatHeader({ variant, title, onDrawerOpen, onOverflowOpen }: Props) {
  const { colors, scheme } = useTheme();
  const insets = useSafeAreaInsets();

  const isActive = variant === 'active';
  const bgColor = scheme === 'dark' ? colors.primaryLight : colors.cardBg;

  return (
    <View
      style={[
        styles.container,
        {
          height: CHAT_HEADER_HEIGHT + insets.top,
          paddingTop: insets.top,
          backgroundColor: bgColor,
          borderBottomColor: colors.divider,
        },
        Elevation[scheme][1],
      ]}
    >
      <View style={styles.content}>
        <Pressable onPress={onDrawerOpen} style={styles.iconButton} hitSlop={8}>
          {({ pressed }) => (
            <>
              <IcDrawer width={20} height={20} color={colors.primary} />
              {pressed && (
                <View style={[StyleSheet.absoluteFill, styles.iconOverlay, { backgroundColor: colors.pressOverlay }]} />
              )}
            </>
          )}
        </Pressable>

        {isActive && (
          <>
            <Text style={[styles.title, { color: colors.textTitle }]} numberOfLines={1}>
              {title}
            </Text>
            <Pressable onPress={onOverflowOpen} style={styles.iconButton} hitSlop={8}>
              {({ pressed }) => (
                <>
                  <IcOverflow width={20} height={20} color={colors.primaryActive} />
                  {pressed && (
                    <View style={[StyleSheet.absoluteFill, styles.iconOverlay, { backgroundColor: colors.pressOverlay }]} />
                  )}
                </>
              )}
            </Pressable>
          </>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderBottomWidth: 1,
  },
  content: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  iconButton: {
    padding: 8,
  },
  iconOverlay: {
    borderRadius: BorderRadius.full,
  },
  title: {
    flex: 1,
    textAlign: 'left',
    marginLeft: 12,
    ...Typography['heading-lg'],
  },
});
