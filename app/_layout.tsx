/**
 * Root Layout
 *
 * 앱의 최상위 레이아웃 파일입니다.
 * ClerkProvider로 전체 앱을 감싸서 모든 화면에서 인증 기능을 사용할 수 있게 합니다.
 */

import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import 'react-native-reanimated';
import { KeyboardProvider } from 'react-native-keyboard-controller';

// Clerk 인증 관련 import
import { ClerkProvider, ClerkLoaded } from '@clerk/clerk-expo';
import { tokenCache } from '@/utils/tokenCache';

import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from '@/lib/queryClient';

import { useColorScheme } from '@/hooks/use-color-scheme';
import Toast from 'react-native-toast-message';
import { SplashScreen } from '@/screens/SplashScreen';

export const unstable_settings = {
  anchor: '(main)', // 뒤로가기 시 기본 진입 그룹을 (main)으로 고정
};

let hasShownStartupSplash = false;

export default function RootLayout() {
  const colorScheme = useColorScheme();

  const [fontsLoaded] = useFonts({
    'Pretendard-Regular': require('@/assets/fonts/Pretendard-Regular.otf'),
    'Pretendard-Medium': require('@/assets/fonts/Pretendard-Medium.otf'),
    'Pretendard-SemiBold': require('@/assets/fonts/Pretendard-SemiBold.otf'),
    'Pretendard-Bold': require('@/assets/fonts/Pretendard-Bold.otf'),
  });

  // Load가 빨라서 디자인 확인이 불가하여 임의로 초 설정해 두었습니다.
  // 향후, Native Splash 혼용.
  const [splashVisible, setSplashVisible] = useState(!hasShownStartupSplash);
  useEffect(() => {
    if (!splashVisible) return;

    const timer = setTimeout(() => setSplashVisible(false), 2000);
    return () => {
      hasShownStartupSplash = true;
      clearTimeout(timer);
    };
  }, [splashVisible]);

  // .env 파일에서 Clerk Publishable Key 가져오기
  const publishableKey = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY!;

  // Publishable Key가 없으면 에러 발생
  if (!publishableKey) {
    throw new Error(
      'EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY가 .env 파일에 설정되지 않았습니다.'
    );
  }

  return (
    /**
     * ClerkProvider: Clerk 인증 기능을 제공하는 최상위 Provider
     * - tokenCache: 토큰을 안전하게 저장하고 관리하는 캐시
     * - publishableKey: Clerk 대시보드에서 발급받은 공개 키
     */
    <ClerkProvider tokenCache={tokenCache} publishableKey={publishableKey}>
      <QueryClientProvider client={queryClient}>
        <KeyboardProvider>
          <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
            {(!fontsLoaded || splashVisible) ? (
              <SplashScreen />
            ) : (
              /* ClerkLoaded: Clerk가 완전히 로드된 후에만 자식 컴포넌트를 렌더링
               * 이를 통해 인증 상태가 준비되기 전의 깜빡임을 방지합니다. */
              <ClerkLoaded>
                <Stack>
                  {/* 인증 화면 (로그인, 회원가입 등) */}
                  <Stack.Screen name="(auth)/sign-in" options={{ headerShown: false }} />
                  {/* 메인 앱 화면 — BottomNavigation 포함 */}
                  <Stack.Screen name="(main)" options={{ headerShown: false }} />
                  {/* 초기 진입 라우팅 */}
                  <Stack.Screen name="index" options={{ headerShown: false }} />
                  <Stack.Screen name="oauth-native-callback" options={{ headerShown: false }} />
                  {/* 개발용 갤러리 허브 */}
                  <Stack.Screen name="dev_gallery" options={{ title: 'Dev Gallery' }} />
                  <Stack.Screen name="red_dev1" options={{ title: 'Red — Components 1' }} />
                  <Stack.Screen name="red_dev2" options={{ title: 'Red — Components 2' }} />
                  <Stack.Screen name="blue_dev1" options={{ title: 'Blue — Components 1' }} />
                </Stack>
                <StatusBar style="auto" />
                <Toast />
              </ClerkLoaded>
            )}
          </ThemeProvider>
        </KeyboardProvider>
      </QueryClientProvider>
    </ClerkProvider>
  );
}
