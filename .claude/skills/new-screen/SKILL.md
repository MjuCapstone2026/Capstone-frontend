---
name: new-screen
description: 새 화면(Screen) 생성 — app/ 라우트 진입점 + screens/ 실제 UI 파일 작성
argument-hint: "라우트 경로 (예: (main)/schedule, (auth)/sign-up)"
allowed-tools: Read, Write, Edit, Glob
---

@docs/conventions.md 의 코딩 규칙을 준수한다.

## 사용법

```
/new-screen (tabs)/schedule
/new-screen (auth)/sign-up
/new-screen modal/place-detail
```

## 입력
사용자가 라우트 경로를 제공한다. (예: `(tabs)/schedule`, `modal/place-detail`)

## 절차

### 1. 라우트 그룹 확인
- 요청한 경로의 라우트 그룹 `_layout.tsx`를 Read로 읽는다.
- `(main)`에 추가하는 경우 BottomNavigation 업데이트가 필요하면 사용자에게 안내한다.

### 2. 라우트 진입점 파일 생성
`app/{경로}.tsx` — 라우팅만 담당, UI 없음:

```typescript
import { {Name}Screen } from '@/screens/{Name}Screen';

export default function {Name}Route() {
  return <{Name}Screen />;
}
```

params가 필요한 경우:
```typescript
import { useLocalSearchParams } from 'expo-router';
import { {Name}Screen } from '@/screens/{Name}Screen';

export default function {Name}Route() {
  const { id } = useLocalSearchParams<{ id: string }>();
  return <{Name}Screen id={id} />;
}
```

### 3. 화면 UI 파일 생성
`screens/{Name}Screen.tsx` — 실제 화면 UI 담당:

```typescript
import { useState, useEffect } from 'react';
import { StyleSheet, View, Text, ActivityIndicator } from 'react-native';
import { useTheme } from '@/hooks/useTheme';
import { Typography } from '@/constants/theme';
import { useApi } from '@/hooks/useApi';

type Props = {
  // props 타입 정의
};

export function {Name}Screen({ ... }: Props) {
  const [isLoading, setIsLoading] = useState(false);
  const { colors } = useTheme();
  const { authRequest } = useApi();

  // TODO: 초기 데이터 로드

  if (isLoading) return <ActivityIndicator />;

  return (
    <View style={[styles.container, { backgroundColor: colors.pageBg }]}>
      <Text style={[styles.title, { color: colors.textTitle }]}>{Name} 화면</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: { ...Typography['heading-md'] },
});
```

### 4. 피그마/디자인 가이드 적용 (선택)
- 사용자가 디자인 이미지를 제공한 경우 해당 디자인에 맞게 JSX와 StyleSheet 작성
- 색상 하드코딩 금지 — 반드시 `useTheme()` 훅 사용 (`colors.xxx` 형태로 인라인)
- Typography는 `StyleSheet.create()` 안에 spread — 인라인에 직접 넣기 금지

### 5. 완료 후 안내
- 생성된 파일 경로 (라우트 + 스크린 2개)
- 해당 화면에서 API 호출이 필요하면 `/new-api` 실행을 안내
