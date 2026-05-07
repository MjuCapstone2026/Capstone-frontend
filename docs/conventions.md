# Conventions — 프론트엔드 코딩 스타일

## Route Reference

Expo Router 라우트는 `app/` 파일 구조로 등록된다. 문서나 skill에 경로를 적는 것만으로는 라우트가 생성되지 않으므로, 화면 이동 코드에서 사용하는 경로는 반드시 실제 `app/` 파일이 있어야 한다.

현재 주요 라우트:

| 파일 | 실제 경로 | 역할 |
|---|---|---|
| `app/(main)/home.tsx` | `/home` | HomeScreen |
| `app/(main)/chat/index.tsx` | `/chat` | 새 채팅 또는 기본 채팅 진입 |
| `app/(main)/chat/[chatId].tsx` | `/chat/[chatId]` | 특정 채팅방 |
| `app/(main)/plan.tsx` | `/plan` | PlanScreen |
| `app/(main)/plan-list.tsx` | `/plan-list` | 여행 일정/예약 목록 |
| `app/(main)/plan-list/[id]/index.tsx` | `/plan-list/[id]` | 여행 일정 상세 |
| `app/(main)/plan-list/[id]/edit.tsx` | `/plan-list/[id]/edit` | 여행 일정 상세 편집 |
| `app/(main)/plan-list/[id]/logs/[logId].tsx` | `/plan-list/[id]/logs/[logId]` | 변경 이력 상세 |
| `app/(main)/setting.tsx` | `/setting` | 설정 |
| `app/(auth)/sign-in.tsx` | `/sign-in` | 로그인 |

동적 라우트 이동은 문자열 조합보다 typed pathname + params를 우선 사용한다.

```tsx
router.push({ pathname: '/plan-list/[id]', params: { id } });
router.push({ pathname: '/plan-list/[id]/edit', params: { id } });
router.push({ pathname: '/plan-list/[id]/logs/[logId]', params: { id, logId } });
router.navigate({ pathname: '/chat/[chatId]', params: { chatId } });
```

`app/` 파일은 라우트 진입점만 담당하고, 실제 UI는 `screens/`에 둔다.

---

## 1. 아키텍처

### 디렉토리 구조
```
app/                         ← 라우팅만 담당 (UI 없음)
├── _layout.tsx              ← 루트 레이아웃 (ClerkProvider, QueryClientProvider, Toast 등)
├── index.tsx                ← 초기 진입 라우트
├── oauth-native-callback.tsx ← Android OAuth callback 수신 라우트
├── (auth)/
│   └── sign-in.tsx          ← LoginScreen 렌더링, 로그인 상태면 /home 이동
└── (main)/                  ← Stack + 커스텀 BottomNavigation 레이아웃
    ├── _layout.tsx          ← Stack navigator + BottomNavigation 컴포넌트
    ├── home.tsx             ← HomeScreen 진입점
    ├── plan.tsx             ← PlanScreen 진입점
    ├── plan-list.tsx        ← PlanListScreen 진입점
    ├── setting.tsx          ← SettingScreen 진입점
    ├── chat/
    │   ├── index.tsx        ← /chat
    │   └── [chatId].tsx     ← /chat/[chatId]
    └── plan-list/
        └── [id]/
            ├── index.tsx    ← /plan-list/[id]
            ├── edit.tsx     ← /plan-list/[id]/edit
            └── logs/
                └── [logId].tsx ← /plan-list/[id]/logs/[logId]
screens/                     ← 실제 화면 UI 담당
├── HomeScreen.tsx
├── NewChatScreen.tsx
├── ChatRoomScreen.tsx
├── ChangeLogDetailScreen.tsx
├── PlanScreen.tsx
├── PlanListScreen.tsx
├── PlanListDetailScreen.tsx
├── PlanListDetailEditScreen.tsx
├── SettingScreen.tsx
└── LoginScreen.tsx
api/
├── client.ts       axios 인스턴스 (baseURL, timeout, headers)
└── {domain}.ts     도메인별 API 함수
components/
├── ui/             범용 원자 컴포넌트 (BottomNavigation, Alert, PrimaryButton 등)
└── {Name}.tsx      도메인 특화 컴포넌트 (ChatBubble, TravelPlanCard 등)
hooks/              커스텀 훅
utils/              순수 유틸리티 함수
constants/          테마, 레이아웃, query key 등 상수
lib/                앱 단위 인스턴스 (queryClient 등)
```

### 네비게이션 패턴

탭 전환은 `router.navigate()`, 스택 푸시는 `router.push()` 사용.

라우트 그룹 `(main)`, `(auth)`는 파일 구조 조직과 레이아웃 적용 목적이며 실제 URL 경로에 포함되지 않는다.
이동할 때는 그룹명을 제외한 짧은 경로를 사용한다.
인증, 로그인/로그아웃, Android OAuth callback 흐름은 `docs/auth-routing.md`를 참고한다.

```
파일 위치                         실제 경로
app/(main)/home.tsx          →    /home
app/(main)/chat/index.tsx    →    /chat
app/(main)/chat/[chatId].tsx →    /chat/[chatId]
app/(auth)/sign-in.tsx       →    /sign-in
```

```tsx
// BottomNavigation 탭 전환 — 스택 유지하면서 화면 전환 (뒤로가기 시 앱 종료 방지)
router.navigate('/plan-list');

// 디테일 화면 진입 — 스택 쌓음 (뒤로가기 가능)
router.push({ pathname: '/plan-list/[id]', params: { id } });

// 뒤로가기
router.back();
```

`BottomNavigation` 컴포넌트는 `components/ui/BottomNavigation.tsx`에서 만들고, `app/(main)/_layout.tsx`에서 전역 렌더링.

```tsx
// app/(main)/_layout.tsx
import { BottomNavigation } from '@/components/ui/BottomNavigation';

export default function MainLayout() {
  return (
    <>
      <Stack screenOptions={{ headerShown: false }} />
      <BottomNavigation />
    </>
  );
}
```

### 화면별 네비게이션 흐름

**HomeScreen**
| 액션 | 목적지 | 방식 |
|---|---|---|
| QuickMenu "AI와 채팅" | `/chat` | navigate |
| QuickMenu "일정 보기" | `/plan` | navigate |
| RecentTravelSection 카드 탭 | `/plan-list/[id]` | push |
| RecentTravelSection "전체보기" | `/plan-list` | navigate |
| RecentChatSection 카드 탭 | `/chat` `{ chatId }` | navigate |
| RecentChatSection "전체보기" | NavigationDrawer 오픈 | 컴포넌트 상태 |

**ChatScreen 진입 분기**

`/chat`는 진입 방식에 따라 query param으로 분기한다.

```tsx
// BottomNavigation 탭 — 최근 채팅 표시, 없으면 새 채팅 생성 화면
router.navigate('/chat');

// RecentChatSection 카드 탭 — 특정 채팅 진입
router.navigate({
  pathname: '/chat',
  params: { chatId: chat.id }, // UUID string
});

// NewTravelGenerateButton — 무조건 새 채팅 생성 화면
router.navigate({
  pathname: '/chat',
  params: { mode: 'new' },
});
```

`chat/index.tsx` 내부에서 params로 분기:
```tsx
const { chatId, mode } = useLocalSearchParams<{
  chatId?: string;
  mode?: 'new';
}>();

const isNew = mode === 'new';
// chatId 있으면 → 해당 채팅
// isNew면 → 새 채팅 생성 화면
// 둘 다 없으면 → 최근 채팅 or 새 채팅 생성 화면
```

**PlanScreen**
| 액션 | 목적지 | 방식 |
|---|---|---|
| NewTravelGenerateButton (Empty 상태) | `/chat` `{ mode: 'new' }` | navigate |

**PlanListScreen**
| 액션 | 목적지 | 방식 |
|---|---|---|
| TravelPlanCard 탭 | `/plan-list/[id]` | push |

**PlanListDetailScreen**
| 액션 | 목적지 | 방식 |
|---|---|---|
| "편집" 버튼 | `/plan-list/[id]/edit` | push |

**PlanListDetailEditScreen**
| 액션 | 목적지 | 방식 |
|---|---|---|
| "완료" (서버 PATCH 후) | PlanListDetailScreen | back |
| "취소" | PlanListDetailScreen | back |

---

## 2. 코딩 규칙

### API 함수 패턴
모든 API 함수는 `api/{domain}.ts`에 작성한다.

파일 상단에 도메인 BASE 경로를 상수로 선언한다. API 버전이 바뀌면 이 한 줄만 수정하면 된다.

```typescript
const BASE = '/api/v1/chat-rooms';

export const getChatRooms = (token: string) =>
  apiClient.get(BASE, { ... });

export const createChatRoom = (token: string) =>
  apiClient.post(BASE, { ... });
```

### 인증 API 호출 — useApi 훅 사용
컴포넌트에서 인증 API를 호출할 때는 반드시 `useApi` 훅을 사용한다.

```typescript
// 올바른 방식
const { authRequest } = useApi();
const data = await authRequest(getSomething);
const data = await authRequest((token) => getSomething(token, id));

// 금지 — getToken() 직접 호출
const token = await getToken();
const res = await apiClient.get('/api/...', { headers: { Authorization: `Bearer ${token}` } });
```

### 라우트 파일 패턴

`app/` 파일은 라우팅 진입점만 담당. UI는 `screens/`에서 import. 단, params나 API 결과에 따른 분기 로직은 예외적으로 라우트 파일에 작성 허용.

```tsx
// app/(main)/chat/index.tsx
import { NewChatScreen } from '@/screens/NewChatScreen';
import { ChatRoomScreen } from '@/screens/ChatRoomScreen';
import { PlanListScreen } from '@/screens/PlanListScreen';

export default function ChatRoute() {
  const { chatId, mode } = useLocalSearchParams<{
    chatId?: string;
    mode?: 'new';
  }>();
  const isNew = mode === 'new';

  if (isNew) return <NewChatScreen />;
  if (chatId) return <ChatRoomScreen chatId={String(chatId)} />;
  return <PlanListScreen />;
}
```

### 화면(Screen) 컴포넌트 패턴
```typescript
export function {Name}Screen() {
  // 훅
  const { colors } = useTheme();
  const { authRequest } = useApi();
  const router = useRouter();

  // API 데이터 조회 — useEffect + setState 직접 fetch 금지, React Query 사용
  const { data, isLoading, error } = useQuery({
    queryKey: queryKeys.{domain}.all,
    queryFn: () => authRequest(get{Name}s),
    staleTime: STALE_TIMES.{domain}.all,
    // detail(id), logs(id), messages(roomId)처럼 id별 캐시가 쌓이는 쿼리는 gcTime: GC_TIMES.{domain}.{key} 도 추가
  });

  useEffect(() => {
    if (!error) return;
    Toast.show({ type: 'error', text1: getErrorMessage(error) });
  }, [error]);

  // 핸들러 함수
  // 단순 버튼 클릭(onPress) — useCallback 불필요
  const handleAction = async () => {
    try {
      // 서버 데이터 변경은 useMutation으로 처리
    } catch (e) {
      console.error(e);
    }
  };

  // 외부 훅 함수(startOAuthFlow 등) 사용하거나 useEffect deps에 들어갈 때 — useCallback 사용
  const handleOAuthAction = React.useCallback(async () => {
    try {
      // externalHookFn 등 외부 훅에서 온 함수 사용
    } catch (e) {
      console.error(e);
    }
  }, [externalHookFn, router]);

  // 로딩/에러 분기
  if (isLoading) return <ActivityIndicator />;

  // JSX
  return (
    <View style={[styles.container, { backgroundColor: colors.pageBg }]}>
      {/* ... */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
});
```

### 컴포넌트 역할 분리
컴포넌트는 입력값 수집 및 UI 렌더링만 담당한다. API 호출 금지 — 수집한 값은 `onSubmit` prop으로 올려보내고, API 호출은 Screen에서 처리한다.

```tsx
// ✅ 컴포넌트 — onSubmit으로 올려보내기만
export function SearchForm({ onSubmit }: { onSubmit: (query: string) => void }) {
  const [query, setQuery] = useState('');
  return <TextInput value={query} onChangeText={setQuery} onSubmitEditing={() => onSubmit(query)} />;
}

// ✅ Screen — API 호출 담당
export function SearchScreen() {
  const handleSubmit = async (query: string) => {
    const result = await authRequest((token) => searchPlaces(token, query));
  };
  return <SearchForm onSubmit={handleSubmit} />;
}

// ❌ 금지 — 컴포넌트 안에서 API 호출
export function SearchForm() {
  const handleSubmit = async () => {
    await apiClient.get('/api/search'); // 금지
  };
}
```

단, 애니메이션/시각적 상태 변화는 컴포넌트 내부에서 처리한다. API 호출만 Screen으로 올려보낸다.

```tsx
// ✅ 토글 애니메이션은 컴포넌트 내부, API는 Screen으로
export function StatusToggle({ active, onToggle }: { active: boolean; onToggle: () => void }) {
  const anim = useSharedValue(active ? 1 : 0);

  const handlePress = () => {
    anim.value = withTiming(active ? 0 : 1); // 애니메이션 — 컴포넌트 내부
    onToggle();                               // API 호출 — Screen으로 위임
  };

  return <Pressable onPress={handlePress}>...</Pressable>;
}
```

### 컴포넌트 파일 구조
```typescript
// components/{Name}.tsx
import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { useTheme } from '@/hooks/useTheme';
import { Typography } from '@/constants/theme';

type Props = {
  // props 타입 정의
};

export function {Name}({ ... }: Props) {
  const { colors } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: colors.cardBg }]}>
      <Text style={[styles.title, { color: colors.textTitle }]}>제목</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: { ...Typography['heading-md'] },
});
```

### 스타일 규칙
- 레이아웃/Typography는 `StyleSheet.create()` 사용 — 스타일은 컴포넌트 파일 하단에 선언
- `Typography` 토큰은 `StyleSheet.create()` 안에 spread — 인라인에 직접 넣기 금지
- 색상은 런타임 동적 값이므로 인라인으로만 분리 — 인라인에는 color 값만 허용
- 색상 하드코딩 금지 — 반드시 `useTheme()` 훅 사용

### Typography

토큰 정의는 `docs/design/tokens/typography.md`, RN 값은 `constants/theme.ts`의 `Typography` 참조.

```tsx
import { Typography } from '@/constants/theme';

// ✅ StyleSheet 안에 spread
const styles = StyleSheet.create({
  title: { ...Typography['heading-md'] },
});

// ✅ spread 후 일부 속성 덮어쓰기 허용 — Pretendard는 fontFamily로 굵기 변경
const styles = StyleSheet.create({
  title: { ...Typography['heading-md'], fontFamily: 'Pretendard-Bold' },
});

// ❌ 금지 — 인라인에 직접 사용
<Text style={[Typography['heading-md'], { color: colors.textTitle }]} />
```

### Border Radius

토큰 정의 및 Figma 토큰명 대응은 `docs/design/tokens/border-radius.md` 참조.

```tsx
import { BorderRadius } from '@/constants/theme';

// ✅ 고정 상수이므로 StyleSheet 안에 선언
const styles = StyleSheet.create({
  card: { borderRadius: BorderRadius.lg },
});
```

### Shadow (Elevation)

iOS 전용. 라이트/다크 모드에 따라 shadow 방식이 달라진다.

- Light: iOS shadow props 사용
- Dark: border로 대체 (`elevation-4`만 shadow 보조 추가)

토큰 정의는 `docs/design/tokens/elevation.md`, RN 값은 `constants/theme.ts`의 `Elevation` 참조.

```tsx
import { Elevation } from '@/constants/theme';

const { scheme } = useTheme();

<View style={[styles.card, Elevation[scheme][2]]} />
```

### Press Overlay (눌림 효과)

`Pressable` + 절대 위치 오버레이 방식으로 통일. `TouchableOpacity` 사용 금지.

토큰 정의 및 적용 대상은 `docs/design/tokens/interaction.md` 참조.

```tsx
const { colors } = useTheme();

<Pressable onPress={onPress}>
  {({ pressed }) => (
    <>
      {children}
      {pressed && (
        <View style={[StyleSheet.absoluteFill, { backgroundColor: colors.pressOverlay, borderRadius }]} />
      )}
    </>
  )}
</Pressable>
```

### Toast
 
인앱 피드백 메시지는 `react-native-toast-message` 라이브러리를 사용한다. 기본 UI 그대로 사용 (커스텀 없음).
 
```tsx
import Toast from 'react-native-toast-message';
 
// 성공
Toast.show({ type: 'success', text1: '저장 완료' });
 
// 에러
Toast.show({ type: 'error', text1: 'API 실패', text2: '다시 시도해주세요.' });
 
// 정보
Toast.show({ type: 'info', text1: '네트워크 오류', text2: '인터넷 연결을 확인해주세요.' });
```

`app/_layout.tsx` 최상단에 `<Toast />` 한 번만 등록.
 
```tsx
// app/_layout.tsx
import Toast from 'react-native-toast-message';
 
export default function RootLayout() {
  return (
    <ClerkProvider ...>
      <ThemeProvider ...>
        <Stack />
        <Toast />
      </ThemeProvider>
    </ClerkProvider>
  );
}
```

### SVG 아이콘 사용

모든 SVG 아이콘은 하드코딩 색상 없이 `currentColor`로 처리한다. stroke/fill 구분 없이 `color` prop 하나로 제어한다.

```tsx
<HomeIcon width={24} height={24} color={active ? colors.primary : colors.textDisabled} />
```

### 반응형 레이아웃
컨테이너 크기는 비율 기반, 패딩/마진 등 여백은 고정값 사용. 고정값은 Figma 개발 모드에서 직접 확인하되, 실제 개발 시 시각적으로 자연스럽도록 유연하게 수치 조절 가능.

```tsx
// 컨테이너 — flex와 비율로
<View style={styles.container} />
<View style={styles.card} />

const styles = StyleSheet.create({
  container: { flex: 1, paddingHorizontal: 20 }, // 패딩은 고정값 OK
  card: { width: '90%', marginBottom: 12 },       // 마진도 고정값 OK
});

// 금지 — 특정 기기 기준 고정 크기
const styles = StyleSheet.create({
  container: { width: 320, height: 600 }, // ❌
});

// 비율 계산이 필요할 때 — useWindowDimensions
const { width } = useWindowDimensions();
const cardWidth = width * 0.85;
```

### 라이트/다크 모드
시스템 설정을 따른다. 색상은 반드시 `useTheme()` 훅으로만 사용한다. `use-theme-color`, `useColorScheme` 직접 사용 금지.

```tsx
// 색상은 colors.xxx 로 해결 — scheme 불필요
const { colors } = useTheme();

<View style={[styles.container, { backgroundColor: colors.pageBg }]}>
  <Text style={[styles.title, { color: colors.textTitle }]}>제목</Text>
</View>

// scheme 이 필요한 경우 — Elevation처럼 colors 밖에 있는 모드별 값 셋을 선택할 때
const { colors, scheme } = useTheme();
Elevation[scheme][2]
```

### SafeArea

기기마다 홈바/제스처바 높이가 다르므로 `useSafeAreaInsets()`로 처리한다. 하드코딩 금지.

| 기기 | `insets.bottom` |
|---|---|
| iPhone (홈바 있는 모델) | ~34px |
| iPhone SE (홈버튼 모델) | 0 |
| Android 제스처 네비게이션 | ~24~48px (기기마다 다름) |
| Android 버튼 네비게이션 | 0 |

**BottomNavigation 컴포넌트** — 자기 자신의 높이와 안전영역 처리
```tsx
// components/ui/BottomNavigation.tsx
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { BOTTOM_NAVIGATION } from '@/constants/layout';

export function BottomNavigation() {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.container, { height: BOTTOM_NAVIGATION + insets.bottom, paddingBottom: insets.bottom }]}>
      {/* 탭 아이템들 */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {},
});
```

**Screen** — 콘텐츠가 바텀바에 가려지지 않도록 하단 여백 확보
```tsx
// screens/SomeScreen.tsx
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { BOTTOM_NAVIGATION } from '@/constants/layout';

export function SomeScreen() {
  const insets = useSafeAreaInsets();

  return (
    <ScrollView contentContainerStyle={[styles.content, { paddingBottom: BOTTOM_NAVIGATION + insets.bottom }]}>
      {/* 콘텐츠 */}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  content: {},
});
```

> `BOTTOM_NAVIGATION`를 상수 파일로 분리해두면 BottomNavigation과 각 Screen에서 동일한 값을 참조할 수 있음.

### 네비게이션
- 화면 이동은 `useRouter()` 훅 사용
- 라우트 경로는 `expo-router` 파일 기반 라우팅 따름

```typescript
const router = useRouter();

// push — 스택에 쌓음. back() 하면 이전 화면으로 돌아올 수 있음
router.push({ pathname: '/plan-list/[id]', params: { id } });

// replace — 현재 화면을 대체. back() 해도 이 화면으로 돌아올 수 없음
// 로그인 완료 후 메인으로, 로그아웃/회원탈퇴 후 로그인으로 이동할 때 사용
router.replace('/home');
router.replace('/sign-in');

// back — 이전 화면으로 이동
router.back();
```

---

## 3. 타입 규칙

- `any` 사용 금지 — 명확한 타입 정의
- API 응답 타입은 `api/{domain}.ts` 파일에 함께 정의
```typescript
type Schedule = {
  id: number;
  title: string;
  date: string;
};

export const getSchedule = (token: string, id: number) =>
  apiClient.get<Schedule>(`/api/schedules/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
```

---

## 4. 에러 처리

- API 호출은 항상 `try/catch` 로 감싸기
- `console.error()`는 개발 디버깅용으로만 — 프로덕션 에러는 UI로 안내
- HTTP status 분기는 `utils/getErrorMessage.ts` 공통 유틸에서 처리하고, `status == null`이면 네트워크 오류로 본다.
- `400/401/403/404`와 `5xx`는 상태코드별 메시지로 분기하고, 나머지는 `UNKNOWN` 또는 공통 오류 메시지로 처리한다.
- 사용자에게 보여줄 에러는 `getErrorMessage(error)`로 메시지를 만든 뒤 Toast로 안내한다.

```tsx
import Toast from 'react-native-toast-message';
import { getErrorMessage } from '@/utils/getErrorMessage';

const handleLoad = async () => {
  try {
    const result = await getPublicData();
  } catch (e) {
    console.error(e);
    Toast.show({ type: 'error', text1: getErrorMessage(e) });
  }
};
```

### Alert
확인/취소가 필요한 다이얼로그는 `components/ui/Alert` 사용. `Alert.alert()` 사용 금지.
