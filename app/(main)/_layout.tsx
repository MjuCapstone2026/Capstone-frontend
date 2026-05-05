import { useEffect, useRef } from 'react';
import { Stack, useRouter } from 'expo-router';
import { useAuth } from '@clerk/clerk-expo';
import { ActivityIndicator, View } from 'react-native';
import { BottomNavigation } from '@/components/ui/BottomNavigation';
import { useApi } from '@/hooks/useApi';
import { registerUser } from '@/api/auth';

export default function MainLayout() {
  const router = useRouter();
  const { isLoaded, isSignedIn } = useAuth();
  const { authRequest } = useApi();
  const hasRequestedUserRegistration = useRef(false); // state 대신 ref — 값 변경 시 리렌더 없이 effect 중복 호출만 막기 위함

  useEffect(() => {
    if (isLoaded && !isSignedIn) {
      hasRequestedUserRegistration.current = false; // 로그아웃 후 재로그인 시 재등록 허용
      router.replace('/sign-in');
    }
  }, [isLoaded, isSignedIn, router]);

  useEffect(() => {
    if (!isLoaded || !isSignedIn || hasRequestedUserRegistration.current) return;

    hasRequestedUserRegistration.current = true;
    authRequest(registerUser).catch((e) => {
      console.error('유저 등록 실패:', e); // 이미 존재하는 유저면 백엔드에서 무시 (idempotent)
    });
  }, [authRequest, isLoaded, isSignedIn]);

  if (!isLoaded || !isSignedIn) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <>
      <Stack screenOptions={{ headerShown: false }} />
      <BottomNavigation />
    </>
  );
}
