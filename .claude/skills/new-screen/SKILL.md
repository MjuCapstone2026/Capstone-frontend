---
name: new-screen
description: 새 화면(Screen) 생성. app/ 라우트 진입점과 screens/ 실제 UI 파일을 프로젝트 규칙에 맞게 작성한다.
argument-hint: "라우트 경로 예: (main)/schedule, (auth)/sign-up, modal/place-detail"
allowed-tools: Read, Write, Edit, Glob, Grep
---

@docs/conventions.md 의 코딩 규칙을 우선 따른다.

## 사용법

```
/new-screen (main)/home
/new-screen (auth)/sign-up
```

## 입력

사용자가 Expo Router 기준 라우트 경로를 제공한다.

예:
- `(main)/home` -> `app/(main)/home.tsx`
- `(auth)/sign-up` -> `app/(auth)/sign-up.tsx`

## 절차

### 1. 디자인 문서 확인

먼저 화면 이름을 기준으로 디자인 문서를 찾는다.

```
docs/design/screens/{Name}/{Name}.md
docs/design/screens/{Name}/*.svg
```

- 문서가 있으면 Read로 읽고 레이아웃, 컴포넌트 구성, 상태(Loading/Empty/Filled), SafeArea 요구사항을 반영한다.
- SVG가 있으면 시각적 구조, 간격, 상태별 화면 구성을 확인한다.
- 문서가 없으면 화면 이름과 역할에서 필요한 구조를 추론하되, 기존 화면 패턴을 우선 따른다.

### 2. 기존 구조 확인

작업 전 아래를 확인한다.

- `app/` 라우트 구조
- `screens/`의 기존 Screen 패턴
- 필요한 경우 `components/`, `components/ui/`
- 필요한 경우 `api/`, `constants/queryKeys.ts`
- 라우트 그룹의 `_layout.tsx`

`app/` 파일은 라우트 진입점만 담당하고, 실제 UI는 `screens/`에 둔다.

라우트는 skill 문서에 이름만 적는다고 등록되지 않는다. Expo Router는 실제 `app/` 파일 구조를 기준으로 라우트를 만든다. 화면 이동 코드에서 `pathname: '/plan-list/[id]'` 같은 경로를 쓰려면 반드시 대응하는 실제 파일을 먼저 만든다.

예:

```txt
app/(main)/plan-list.tsx                  -> /plan-list
app/(main)/plan-list/[id]/index.tsx       -> /plan-list/[id]
app/(main)/plan-list/[id]/edit.tsx        -> /plan-list/[id]/edit
app/(main)/plan-list/[id]/logs/[logId].tsx -> /plan-list/[id]/logs/[logId]
app/(main)/chat/index.tsx                 -> /chat
app/(main)/chat/[chatId].tsx              -> /chat/[chatId]
```

### 3. 라우트 진입점 생성

`app/{route}.tsx`는 UI를 직접 작성하지 않고 Screen만 렌더링한다.

```typescript
import { {Name}Screen } from '@/screens/{Name}Screen';

export default function {Name}Route() {
  return <{Name}Screen />;
}
```

params가 필요한 화면은 `useLocalSearchParams`로 받고 Screen에 props로 넘긴다.

```typescript
import { useLocalSearchParams } from 'expo-router';
import { {Name}Screen } from '@/screens/{Name}Screen';

export default function {Name}Route() {
  const { id } = useLocalSearchParams<{ id: string }>();
  return <{Name}Screen id={String(id)} />;
}
```

### 4. Screen UI 파일 생성

`screens/{Name}Screen.tsx`에 실제 화면 UI를 작성한다.

API 데이터가 필요한 화면은 `useEffect + setState`로 직접 fetch하지 말고 React Query를 사용한다.

```typescript
import { useEffect } from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import { useQuery } from '@tanstack/react-query';
import Toast from 'react-native-toast-message';
import { useTheme } from '@/hooks/useTheme';
import { useApi } from '@/hooks/useApi';
import { Typography } from '@/constants/theme';
import { getErrorMessage } from '@/utils/getErrorMessage';
import { queryKeys, STALE_TIMES } from '@/constants/queryKeys';
import { getChatRooms } from '@/api/chatRooms';

export function ExampleScreen() {
  const { colors } = useTheme();
  const { authRequest } = useApi();

  const { data, isLoading, error } = useQuery({
    queryKey: queryKeys.chatRooms.all,
    queryFn: () => authRequest(getChatRooms),
    staleTime: STALE_TIMES.chatRooms.all,
  });

  useEffect(() => {
    if (!error) return;
    Toast.show({ type: 'error', text1: getErrorMessage(error) });
  }, [error]);

  if (isLoading) {
    return (
      <View style={[styles.container, styles.center, { backgroundColor: colors.pageBg }]}>
        <ActivityIndicator />
      </View>
    );
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.pageBg }]}>
      <Text style={[styles.title, { color: colors.textTitle }]}>Example</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  center: { alignItems: 'center', justifyContent: 'center' },
  title: { ...Typography['heading-md'] },
});
```

중요:
- 위 예시의 `queryKeys.chatRooms.all`, `STALE_TIMES.chatRooms.all`, `getChatRooms`는 예시다.
- 실제 도메인에 맞게 `queryKeys.{domain}.all`, `STALE_TIMES.{domain}.all`, 실제 API 함수명으로 치환한다.
- API 함수명은 추측하지 말고 반드시 `api/{domain}.ts`의 export를 확인한다.
- `queryKeys`에 없는 도메인이면 `constants/queryKeys.ts`에 먼저 추가한다.
- `staleTime`은 React Query 필수 옵션은 아니지만, 서버 요청 빈도를 의도적으로 관리하기 위해 프로젝트에서는 조회 쿼리에 명시하는 것을 기본으로 한다.
- 상세/메시지처럼 id별 캐시가 생기는 쿼리에는 `GC_TIMES`도 `@/constants/queryKeys`에서 import해서 `gcTime`을 명시한다.
- API 에러는 화면에 고정 문구를 박기보다 `Toast.show({ type: 'error', text1: getErrorMessage(error) })`로 안내한다.

### 5. queryKeys / STALE_TIMES 규칙

목록 조회:

```typescript
queryKey: queryKeys.{domain}.all
staleTime: STALE_TIMES.{domain}.all
```

상세 조회:

```typescript
queryKey: queryKeys.{domain}.detail(id)
staleTime: STALE_TIMES.{domain}.detail
```

id 기반 상세 조회 또는 메시지 조회처럼 query key가 계속 늘어날 수 있는 데이터는 `GC_TIMES`도 함께 사용한다.

```typescript
import { queryKeys, STALE_TIMES, GC_TIMES } from '@/constants/queryKeys';

useQuery({
  queryKey: queryKeys.chatRooms.messages(roomId),
  queryFn: () => authRequest((token) => getChatMessages(token, roomId)),
  staleTime: STALE_TIMES.chatRooms.messages,
  gcTime: GC_TIMES.chatRooms.messages,
});
```

현재 주요 도메인:

```typescript
queryKeys.itineraries.all
queryKeys.itineraries.detail(itineraryId)
queryKeys.itineraries.logs(itineraryId)

queryKeys.chatRooms.all
queryKeys.chatRooms.detail(roomId)
queryKeys.chatRooms.messages(roomId)

queryKeys.reservations.all
```

`queryKeys`는 캐시 이름표이고, `STALE_TIMES`는 해당 캐시를 fresh로 볼 시간이다. 둘은 같은 역할이 아니며, 같은 데이터 단위에 맞춰 함께 사용한다.

`GC_TIMES`는 inactive query를 메모리에 얼마나 보관할지 정하는 시간이다. 목록 쿼리는 캐시가 보통 1개라 필수로 두지 않고, `detail(id)`, `logs(id)`, `messages(roomId)`처럼 id별로 캐시가 쌓일 수 있는 쿼리에 우선 적용한다.

### 6. 데이터 생성/수정/삭제 후 캐시 갱신 필수

서버 데이터를 생성, 수정, 삭제하는 mutation을 추가할 때는 성공 후 반드시 관련 React Query 캐시를 갱신한다.

기본 원칙:
- 목록에 영향을 주면 `{domain}.all` invalidate
- 상세에 영향을 주면 `{domain}.detail(id)` invalidate
- 채팅 메시지 전송처럼 여러 도메인에 영향을 줄 수 있으면 관련 도메인을 함께 invalidate

```typescript
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '@/constants/queryKeys';

const queryClient = useQueryClient();

const mutation = useMutation({
  mutationFn: () => authRequest((token) => updateSomething(token, id, body)),
  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: queryKeys.itineraries.all });
    queryClient.invalidateQueries({ queryKey: queryKeys.itineraries.detail(id) });
  },
});
```

SSE 채팅 메시지 전송은 `done` 이벤트를 받은 뒤 응답 필드에 따라 갱신한다.

```typescript
onDone: (done) => {
  queryClient.invalidateQueries({ queryKey: queryKeys.chatRooms.messages(roomId) });
  queryClient.invalidateQueries({ queryKey: queryKeys.chatRooms.all });

  if (done.itinerary) {
    queryClient.invalidateQueries({ queryKey: queryKeys.itineraries.all });
    queryClient.invalidateQueries({
      queryKey: queryKeys.itineraries.detail(done.itinerary.itineraryId),
    });
  }

  if (done.change) {
    queryClient.invalidateQueries({ queryKey: queryKeys.itineraries.all });
    queryClient.invalidateQueries({
      queryKey: queryKeys.itineraries.detail(done.change.itineraryId),
    });
  }

  if (done.reservation || done.cancel) {
    queryClient.invalidateQueries({ queryKey: queryKeys.reservations.all });
  }
};
```

캐시 갱신을 빼먹으면 화면이 staleTime 동안 오래된 데이터를 계속 보여줄 수 있다.

### 7. API 데이터가 없는 화면

정적 UI 또는 로컬 상태만 필요한 화면은 React Query를 쓰지 않는다.

```typescript
import { StyleSheet, Text, View } from 'react-native';
import { useTheme } from '@/hooks/useTheme';
import { Typography } from '@/constants/theme';

export function {Name}Screen() {
  const { colors } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: colors.pageBg }]}>
      <Text style={[styles.title, { color: colors.textTitle }]}>{Name}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: { ...Typography['heading-md'] },
});
```

### 8. SafeArea / BottomNavigation

`(main)` 그룹 화면에서 `BottomNavigation` 뒤로 콘텐츠가 가려질 수 있으면 `useSafeAreaInsets`와 `BOTTOM_NAVIGATION`을 사용한다.

```typescript
import { ScrollView, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { BOTTOM_NAVIGATION } from '@/constants/layout';

const insets = useSafeAreaInsets();

<ScrollView
  contentContainerStyle={[
    styles.content,
    { paddingBottom: BOTTOM_NAVIGATION + insets.bottom + 16 },
  ]}
/>
```

### 9. 상대 시간 표시

`몇 분 전`, `몇 시간 전` 같은 상대 시간 문자열은 서버 refetch 주기와 분리한다.

- React Query `staleTime`은 서버 데이터를 언제 다시 가져올지 결정한다.
- 상대 시간 표시는 로컬 timer로 1분마다 다시 계산한다.
- 상대 시간 갱신 때문에 API를 더 자주 호출하지 않는다.

### 10. 스타일 규칙

- 색상은 `useTheme()`의 `colors.xxx`를 사용한다.
- 하드코딩 색상은 피한다.
- Typography는 `StyleSheet.create()` 안에서 spread한다.
- inline style 객체는 동적 색상 등 필요한 경우에만 사용한다.
- `TouchableOpacity`보다 `Pressable` + overlay 패턴을 우선 사용한다.
- SafeArea 값은 하드코딩하지 않는다.

### 11. 완료 보고

완료 시 아래를 알려준다.

- 생성/수정한 라우트 파일 경로
- 생성/수정한 Screen 파일 경로
- 추가한 query key 또는 stale time이 있으면 해당 내용
- mutation/SSE로 인한 cache invalidate를 추가했다면 갱신 대상
