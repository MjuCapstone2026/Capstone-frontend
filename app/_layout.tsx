/**
 * Root Layout
 *
 * 앱의 최상위 레이아웃 파일입니다.
 * ClerkProvider로 전체 앱을 감싸서 모든 화면에서 인증 기능을 사용할 수 있게 합니다.
 */

import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';

// Clerk 인증 관련 import
import { ClerkProvider, ClerkLoaded } from '@clerk/clerk-expo';
import { tokenCache } from '@/utils/tokenCache';

import { useColorScheme } from '@/hooks/use-color-scheme';

export const unstable_settings = {
  anchor: '(tabs)',
};

export default function RootLayout() {
  const colorScheme = useColorScheme();

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
      {/**
       * ClerkLoaded: Clerk가 완전히 로드된 후에만 자식 컴포넌트를 렌더링
       * 이를 통해 인증 상태가 준비되기 전의 깜빡임을 방지합니다.
       */}
      <ClerkLoaded>
        <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
          <Stack>
            {/* 인증 화면 (로그인, 회원가입 등) */}
            <Stack.Screen name="(auth)" options={{ headerShown: false }} />
            {/* 메인 탭 화면 (인증 필요) */}
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            {/* 모달 화면 */}
            <Stack.Screen name="modal" options={{ presentation: 'modal', title: 'Modal' }} />
          </Stack>
          <StatusBar style="auto" />
        </ThemeProvider>
      </ClerkLoaded>
    </ClerkProvider>
  );
}
