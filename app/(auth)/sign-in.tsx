/**
 * 로그인 화면
 *
 * 현재는 Clerk의 기본 UI와 Google OAuth를 사용합니다.
 * 나중에 커스텀 UI로 변경할 경우:
 * 1. useOAuth 훅의 로직은 그대로 유지
 * 2. 버튼 UI만 커스텀 디자인으로 교체
 * 3. 또는 useSignIn 훅을 사용하여 이메일/비밀번호 로그인 추가 가능
 */

import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { useOAuth } from '@clerk/clerk-expo';
import { useRouter } from 'expo-router';
import * as WebBrowser from 'expo-web-browser';

// OAuth 플로우를 위해 브라우저를 warm up (성능 최적화)
WebBrowser.maybeCompleteAuthSession();

export default function SignInScreen() {
  const router = useRouter();

  /**
   * Google OAuth 훅
   * - startOAuthFlow: Google 로그인 플로우를 시작하는 함수
   */
  const { startOAuthFlow } = useOAuth({ strategy: 'oauth_google' });

  // 로딩 상태 관리
  const [isLoading, setIsLoading] = React.useState(false);

  /**
   * Google 로그인 처리 함수
   *
   * 흐름:
   * 1. Google OAuth 플로우 시작 (Google 로그인 페이지로 이동)
   * 2. 사용자가 Google 계정으로 로그인
   * 3. Clerk가 세션 생성
   * 4. 메인 화면으로 이동
   */
  const handleGoogleSignIn = React.useCallback(async () => {
    try {
      setIsLoading(true);

      // Google OAuth 플로우 시작
      const { createdSessionId, setActive } = await startOAuthFlow();

      // 로그인 성공 시 세션 활성화
      if (createdSessionId) {
        await setActive!({ session: createdSessionId });

        // 메인 화면으로 이동
        router.replace('/(tabs)');
      }
    } catch (error) {
      console.error('Google 로그인 오류:', error);
      Alert.alert(
        '로그인 실패',
        '로그인 중 오류가 발생했습니다. 다시 시도해주세요.'
      );
    } finally {
      setIsLoading(false);
    }
  }, [startOAuthFlow, router]);

  return (
    <View style={styles.container}>
      {/* 헤더 영역 */}
      <View style={styles.header}>
        <Text style={styles.title}>로그인</Text>
        <Text style={styles.subtitle}>
          Google 계정으로 간편하게 로그인하세요
        </Text>
      </View>

      {/* 로그인 버튼 영역 */}
      <View style={styles.buttonContainer}>
        {/*
          Google 로그인 버튼

          커스텀 UI로 변경할 때는 이 버튼의 디자인만 수정하면 됩니다.
          handleGoogleSignIn 함수는 그대로 사용 가능합니다.
        */}
        <TouchableOpacity
          style={[styles.googleButton, isLoading && styles.buttonDisabled]}
          onPress={handleGoogleSignIn}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <>
              {/* 여기에 Google 아이콘을 추가할 수 있습니다 */}
              <Text style={styles.buttonText}>Google로 로그인</Text>
            </>
          )}
        </TouchableOpacity>

        {/*
          나중에 커스텀 UI를 추가할 영역

          예시:
          - 이메일/비밀번호 로그인 폼 (useSignIn 훅 사용)
          - 다른 소셜 로그인 버튼 (useOAuth 훅 사용)
          - 회원가입 버튼 (sign-up 화면으로 이동)
        */}
      </View>

      {/*
        개발 중 참고사항:
        - 커스텀 이메일/비밀번호 로그인을 추가하려면 useSignIn 훅 사용
        - 다른 OAuth 제공자를 추가하려면 useOAuth({ strategy: 'oauth_provider' }) 사용
        - 회원가입 화면으로 이동하려면 router.push('/(auth)/sign-up')
      */}
    </View>
  );
}

/**
 * 스타일 정의
 *
 * 커스텀 UI로 변경할 때는 이 스타일을 수정하거나
 * 디자인 시스템에 맞게 재작성하면 됩니다.
 */
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
    justifyContent: 'center',
  },
  header: {
    marginBottom: 40,
    alignItems: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#000',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
  buttonContainer: {
    gap: 15,
  },
  googleButton: {
    backgroundColor: '#4285F4', // Google 브랜드 색상
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 10,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
