/**
 * 인증 화면 레이아웃
 *
 * 로그인, 회원가입 등 인증 관련 화면들을 관리하는 레이아웃입니다.
 * 현재는 sign-in 화면만 있지만, 나중에 sign-up 등을 추가할 수 있습니다.
 */

import { Stack } from 'expo-router';

export default function AuthLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false, // 헤더 숨김 (커스텀 UI 사용을 위해)
      }}
    >
      {/* 로그인 화면 */}
      <Stack.Screen name="sign-in" />

      {/*
        나중에 추가할 수 있는 화면들:
        - sign-up: 회원가입 화면
        - forgot-password: 비밀번호 찾기 화면
        - verify-email: 이메일 인증 화면
      */}
    </Stack>
  );
}
