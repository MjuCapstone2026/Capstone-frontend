# Clerk 인증 라우팅 정리

이 문서는 현재 프로젝트의 Clerk 로그인, 세션 저장, Android OAuth callback, 로그아웃 라우팅만 정리합니다.
일반 화면 라우팅 컨벤션은 `docs/conventions.md`를 참고합니다.

## 관련 파일

```txt
app/
  _layout.tsx                 # ClerkProvider, tokenCache, 루트 Stack
  index.tsx                   # 최초 진입 후 /home으로 이동
  oauth-native-callback.tsx   # Android OAuth callback 수신 라우트
  (auth)/
    sign-in.tsx               # /sign-in 라우트. LoginScreen 렌더링, 로그인 상태면 /home 이동
  (main)/
    _layout.tsx               # 로그인 필요 영역. 로그아웃 후 /sign-in 이동 담당
screens/
  LoginScreen.tsx             # Google OAuth 시작, setActive 처리
  SettingScreen.tsx           # 임시 로그아웃 버튼
utils/
  tokenCache.ts               # Clerk 세션 토큰 저장
```

`(main)`, `(auth)`는 Expo Router의 route group입니다. 실제 URL 경로에는 들어가지 않습니다.
인증 전환 경로는 `/(main)/home`, `/(auth)/sign-in` 대신 `/home`, `/sign-in`을 우선 사용합니다.

## 세션 저장

`app/_layout.tsx`에서 ClerkProvider는 `tokenCache`를 사용합니다.

```tsx
<ClerkProvider tokenCache={tokenCache} publishableKey={publishableKey}>
```

`utils/tokenCache.ts`는 플랫폼별로 세션 토큰을 저장합니다.

- Android/iOS: `expo-secure-store`
- Web: `localStorage`

그래서 앱을 껐다 켜도 Clerk 세션이 남아 있으면 바로 로그인된 상태로 복원됩니다.
로그인 화면을 다시 보려면 `signOut()`을 호출하거나 앱 삭제/재설치, 세션 revoke 등이 필요합니다.

## 로그인 흐름

`screens/LoginScreen.tsx`는 Google OAuth를 시작합니다.

```tsx
const { startOAuthFlow } = useOAuth({ strategy: 'oauth_google' });
```

흐름:

1. 사용자가 Google 로그인 버튼을 누릅니다.
2. `startOAuthFlow()`가 Google OAuth 브라우저 세션을 엽니다.
3. Google 로그인 후 Clerk를 거쳐 앱 callback URL로 돌아옵니다.
4. Clerk가 `createdSessionId`를 반환합니다.
5. 앱이 `setActive({ session: createdSessionId })`를 호출합니다.
6. Clerk의 `isSignedIn`이 `true`가 됩니다.
7. `app/(auth)/sign-in.tsx`가 로그인 상태를 감지하고 `/home`으로 이동시킵니다.

중요한 원칙:

- `LoginScreen`은 OAuth 시작과 `setActive()`까지만 담당합니다.
- `LoginScreen`에서 직접 `router.replace('/home')`를 하지 않습니다.
- 로그인 성공 후 이동은 `/sign-in` 라우트 파일인 `app/(auth)/sign-in.tsx`가 담당합니다.

이렇게 한 이유는 Android OAuth 복귀 직후 화면 컴포넌트와 layout guard가 동시에 이동을 시도하면 React Navigation state가 꼬일 수 있었기 때문입니다.

## 로그아웃 흐름

`screens/SettingScreen.tsx`의 임시 로그아웃 버튼은 `signOut()`만 호출합니다.

```tsx
await signOut();
```

흐름:

1. 사용자가 로그아웃 버튼을 누릅니다.
2. `signOut()`으로 Clerk 세션이 제거됩니다.
3. `isSignedIn`이 `false`가 됩니다.
4. `(main)/_layout.tsx`가 `/sign-in`으로 이동시킵니다.

중요한 원칙:

- `SettingScreen`에서 직접 `router.replace('/sign-in')`를 하지 않습니다.
- 로그아웃 후 이동은 `(main)/_layout.tsx`가 담당합니다.

## `(auth)` 구조 주의점

현재 `(auth)`에는 `sign-in.tsx` 하나만 둡니다.

```txt
app/(auth)/sign-in.tsx
-> /sign-in
```

`sign-in.tsx`의 역할:

- Clerk 상태가 로딩 중이면 로딩 화면을 보여줍니다.
- 이미 로그인된 상태면 `/home`으로 이동합니다.
- 로그인되지 않은 상태면 `LoginScreen`을 렌더링합니다.

이 구조를 쓰는 이유:

- 현재 `(auth)`에는 로그인 화면 하나만 있습니다.
- `LoginScreen`을 별도 screen 컴포넌트로 분리한 뒤 `(auth)/_layout.tsx`에서 직접 불러오면, `sign-in.tsx`는 실제 화면 책임 없이 `/sign-in` 경로만 만들기 위한 파일처럼 남게 됩니다.
- 그래서 `/sign-in` 라우트 파일이 `LoginScreen` 렌더링과 로그인 상태 redirect를 직접 담당하도록 정리했습니다.

```txt
TypeError: Cannot read property 'stale' of undefined
```

처음에는 `(auth)`의 `Stack`이 콜스택에 나왔고, `Stack`을 `Slot`으로 바꾼 뒤에는 `SlotNavigator`에서 같은 에러가 났습니다.
즉 문제는 layout 파일 자체가 아니라 `(auth)` 내부에 둔 nested navigator 구조였습니다.

정리하면, `sign-in.tsx`로 합친 주된 이유는 `/sign-in` 라우트 파일이 placeholder처럼 남지 않게 하고, 로그인 라우트의 책임을 한 파일에서 명확히 처리하기 위해서입니다.
Android 에러와 관련된 주의점은 `(auth)` layout 자체가 아니라 그 안의 `Stack`/`Slot` 사용입니다.

## Android OAuth callback

Clerk `useOAuth()`의 기본 callback URL은 아래 형태입니다.

```txt
capstonefrontend://oauth-native-callback?...
```

`capstonefrontend`는 `app.json`의 `expo.scheme` 값입니다.

```json
{
  "expo": {
    "scheme": "capstonefrontend"
  }
}
```

Android에서는 OAuth 후 앱으로 돌아올 때 Expo Router가 `/oauth-native-callback`을 실제 라우트로 해석합니다.
따라서 `app/oauth-native-callback.tsx`가 없으면 아래 문제가 날 수 있습니다.

```txt
Unmatched Route
```

`app/oauth-native-callback.tsx`는 사용자가 직접 보는 화면이 아니라 Android OAuth callback URL을 받아주는 안전장치입니다.

현재 동작:

- Clerk 상태 로딩 중이면 로딩 화면
- 로그인 완료 상태면 `/home`
- 로그인 실패/미완료 상태면 `/sign-in`

## callback 파일명을 바꾸는 경우

Expo Router에서는 `app/` 아래 파일명이 곧 라우트 경로입니다.

```txt
app/oauth-native-callback.tsx
-> /oauth-native-callback
```

Clerk 기본 callback path도 `oauth-native-callback`이라 현재는 별도 설정 없이 맞습니다.

만약 파일명을 바꾸면 callback URL도 같이 바꿔야 합니다.

```txt
app/auth-callback.tsx
-> /auth-callback
```

예시:

```tsx
import * as AuthSession from 'expo-auth-session';

const redirectUrl = AuthSession.makeRedirectUri({
  path: 'auth-callback',
});

const { createdSessionId, setActive } = await startOAuthFlow({
  redirectUrl,
});
```

정리:

- `app/oauth-native-callback.tsx`를 유지하면 추가 설정이 필요 없습니다.
- 파일명을 바꾸면 `startOAuthFlow({ redirectUrl })`의 path도 같은 이름으로 바꿔야 합니다.
- 어떤 이름이든 Android OAuth callback을 받을 라우트 파일 자체는 필요합니다.

## 인증 라우팅 원칙

- 로그인 성공 후 이동은 `app/(auth)/sign-in.tsx`가 담당합니다.
- 로그아웃 후 이동은 `(main)/_layout.tsx`가 담당합니다.
- `LoginScreen`은 OAuth 시작과 `setActive()`까지만 담당합니다.
- `SettingScreen`은 `signOut()`까지만 담당합니다.
- Android OAuth callback을 받을 `app/oauth-native-callback.tsx`는 유지합니다.
- 인증 상태 변화로 이동할 때 screen에서 직접 replace하지 않습니다.
- 인증 전환 경로는 `/home`, `/sign-in`처럼 route group 없는 경로를 우선 사용합니다.
- Android 안정성을 위해 `(auth)` 영역 안에 `Stack`/`Slot` 같은 nested navigator를 만들지 않습니다.

## 빠른 확인

- `Unmatched Route`: `app/oauth-native-callback.tsx`와 root Stack 등록을 확인합니다.
- `stale of undefined`: auth 영역에 `Stack` 또는 `Slot` 같은 nested navigator가 생기지 않았는지 확인합니다.
- 로그인 후 다시 로그인 화면으로 감: `createdSessionId`, `setActive()`, Clerk key, Google OAuth 설정을 확인합니다.
- Android에서 라우팅이 이상하면 `npx expo start -c`로 캐시를 비우고 다시 실행합니다.
