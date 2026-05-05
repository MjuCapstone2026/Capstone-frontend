import { useState } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native';
import { useAuth } from '@clerk/clerk-expo';
import { useTheme } from '@/hooks/useTheme';
import { BorderRadius, Typography } from '@/constants/theme';

// 임시 로그아웃을 위한 간단한 버튼과 로직입니다.
// 설정 화면 담당자는 정식 화면 작업 시 이 영역을 다시 구성해야 합니다.
export function SettingScreen() {
  const { colors } = useTheme();
  const { signOut } = useAuth();
  const [isSigningOut, setIsSigningOut] = useState(false);

  const handleSignOut = async () => {
    if (isSigningOut) return;

    try {
      setIsSigningOut(true);
      await signOut();
    } finally {
      setIsSigningOut(false);
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.pageBg }]}>
      <Text style={[styles.title, { color: colors.textTitle }]}>SettingScreen</Text>

      <Pressable
        onPress={handleSignOut}
        disabled={isSigningOut}
        style={({ pressed }) => [
          styles.logoutButton,
          {
            backgroundColor: colors.danger,
            opacity: pressed || isSigningOut ? 0.72 : 1,
          },
        ]}
      >
        {isSigningOut ? (
          <ActivityIndicator color={colors.cardBg} />
        ) : (
          <Text style={[styles.logoutText, { color: colors.cardBg }]}>로그아웃</Text>
        )}
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 72,
    gap: 24,
  },
  title: {
    ...Typography['heading-lg'],
  },
  logoutButton: {
    height: 52,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: BorderRadius.sm,
  },
  logoutText: {
    ...Typography['heading-sm'],
  },
});
