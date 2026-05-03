/**
 * 보호된 탭 레이아웃
 *
 * 이 레이아웃은 인증된 사용자만 접근할 수 있습니다.
 * 인증되지 않은 사용자는 자동으로 로그인 화면으로 리다이렉트됩니다.
 */

import { Tabs, Redirect } from 'expo-router';
import React from 'react';
import { ActivityIndicator, View } from 'react-native';

// Clerk 인증 훅
import { useAuth } from '@clerk/clerk-expo';
import { useTheme } from '@/hooks/useTheme';
import IcHomeLabel from '@/assets/icons/ic_home_label.svg';

export default function TabLayout() {
  const { colors, scheme } = useTheme();

  /**
   * 인증 상태 확인
   * - isLoaded: Clerk가 초기화되었는지 여부
   * - isSignedIn: 사용자가 로그인했는지 여부
   */
  const { isLoaded, isSignedIn } = useAuth();

  /**
   * Clerk 초기화 중에는 로딩 화면 표시
   * 이를 통해 인증 상태가 확정되기 전의 깜빡임을 방지합니다.
   */
  if (!isLoaded) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  /**
   * 로그인하지 않은 사용자는 로그인 화면으로 리다이렉트
   *
   * 참고: 로그인 후 자동으로 이 화면으로 돌아오게 하려면
   * sign-in.tsx에서 router.replace('/(tabs)')를 사용합니다.
   */
  if (!isSignedIn) {
    return <Redirect href="/(auth)/sign-in" />;
  }

  /**
   * 인증된 사용자만 탭 화면에 접근 가능
   */
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: colors.primaryLight,
        headerShown: false,
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color }) => <IcHomeLabel width={28} height={28} color={color} />,
        }}
      />
    </Tabs>
  );
}

/**
 * 추가 보안 팁:
 *
 * 1. 특정 탭만 보호하고 싶다면:
 *    각 Screen의 컴포넌트에서 useAuth()를 사용하여 개별적으로 체크
 *
 * 2. 권한 기반 접근 제어가 필요하다면:
 *    useUser() 훅으로 사용자 정보를 가져와서 role/permission 체크
 *
 * 3. 로그아웃 버튼을 추가하려면:
 *    index.tsx나 explore.tsx에서 useClerk().signOut() 사용
 */
