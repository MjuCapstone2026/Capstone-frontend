import React, { useEffect, useState } from 'react';
import { Keyboard, Platform, Pressable, StyleSheet, View } from 'react-native';
import { useRouter, usePathname } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '@/hooks/useTheme';
import { Elevation, BorderRadius } from '@/constants/theme';
import { BOTTOM_NAVIGATION } from '@/constants/layout';
import IcHomeLabel from '@/assets/icons/ic_home_label.svg';
import IcChatLabel from '@/assets/icons/ic_chat_label.svg';
import IcPlanLabel from '@/assets/icons/ic_plan_label.svg';
import IcPlanListLabel from '@/assets/icons/ic_plan_list_label.svg';
import IcSettingLabel from '@/assets/icons/ic_setting_label.svg';

type Tab = {
  route: string;
  Icon: React.FC<{ width: number; height: number; color: string }>;
};

const TABS: Tab[] = [
  { route: '/(main)/home', Icon: IcHomeLabel },
  { route: '/(main)/chat', Icon: IcChatLabel },
  { route: '/(main)/plan', Icon: IcPlanLabel },
  { route: '/(main)/plan-list', Icon: IcPlanListLabel },
  { route: '/(main)/setting', Icon: IcSettingLabel },
];

export function BottomNavigation() {
  const { colors, scheme } = useTheme();
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const pathname = usePathname();
  const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);

  useEffect(() => {
    if (Platform.OS !== 'android') return;

    const showSubscription = Keyboard.addListener('keyboardDidShow', () => {
      setIsKeyboardVisible(true);
    });
    const hideSubscription = Keyboard.addListener('keyboardDidHide', () => {
      setIsKeyboardVisible(false);
    });

    return () => {
      showSubscription.remove();
      hideSubscription.remove();
    };
  }, []);

  if (Platform.OS === 'android' && isKeyboardVisible) {
    return null;
  }

  return (
    <View
      style={[
        styles.container,
        {
          height: BOTTOM_NAVIGATION + insets.bottom,
          paddingBottom: insets.bottom,
          backgroundColor: colors.cardBg,
          borderTopColor: colors.divider,
        },
        Elevation[scheme][3],
      ]}
    >
      {TABS.map(({ route, Icon }) => {
        const segment = route.replace('/(main)', '');
        const active = pathname === segment || pathname.startsWith(segment + '/');
        const color = active ? colors.primary : colors.textDisabled;

        return (
          <Pressable
            key={route}
            style={styles.tab}
            onPress={() => router.navigate(route as any)}
          >
            {({ pressed }) => (
              <View style={[styles.iconWrapper, pressed && { backgroundColor: colors.pressOverlay }]}>
                <Icon width={50} height={50} color={color} />
              </View>
            )}
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    borderTopWidth: 1,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconWrapper: {
    borderRadius: BorderRadius.full,
    padding: 8,
    overflow: 'hidden',
  },
});
