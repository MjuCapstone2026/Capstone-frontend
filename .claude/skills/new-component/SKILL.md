---
name: new-component
description: 새 재사용 컴포넌트 생성 — components/ 아래에 Props 타입 + StyleSheet 포함한 컴포넌트 작성
argument-hint: "컴포넌트 이름 (예: ScheduleCard, PlaceList)"
allowed-tools: Read, Write, Edit, Glob
---

@docs/conventions.md 의 코딩 규칙을 준수한다.

## 사용법

```
/new-component ScheduleCard
/new-component PlaceList
/new-component TripInfoBottomSheet
```

## 입력
사용자가 컴포넌트 이름을 제공한다. (예: `ScheduleCard`, `PlaceList`)

## 절차

### 1. 디자인 문서 및 이미지 확인 (필수)
아래 두 경로를 순서대로 Glob으로 탐색하여 해당 컴포넌트의 디자인 문서를 찾는다.

```
docs/design/components/{Name}/{Name}.md       ← 도메인 특화 컴포넌트
docs/design/components/ui/{Name}/{Name}.md    ← 범용 UI 컴포넌트
```

- 문서가 **있으면** Read로 읽어 스타일, Props, Variant, SafeArea 등 스펙을 파악한다.
- 문서가 **없으면** 컴포넌트 이름과 역할로 Props를 추론한다.

문서를 찾은 디렉토리에서 SVG 파일도 Glob으로 탐색한다.

```
docs/design/components/{Name}/*.svg
docs/design/components/ui/{Name}/*.svg
```

- SVG가 **있으면** Read로 모두 읽어 시각적 디자인을 파악한다 (레이아웃, 간격, 색상 배치 등).

### 2. 기존 컴포넌트 확인
- `components/` 디렉토리를 Glob으로 스캔한다.
- 유사한 컴포넌트가 있으면 Read로 읽어 스타일 패턴을 파악한다.

### 3. 컴포넌트 파일 위치 결정
컨벤션에 따라 아래 기준으로 저장 위치를 결정한다:

- **`components/ui/{Name}.tsx`** — 범용 원자 컴포넌트: 도메인 무관, 여러 화면에서 재사용 가능한 기본 단위 (BottomNavigation, Alert, PrimaryButton, Modal 등)
- **`components/{Name}.tsx`** — 도메인 특화 컴포넌트: 특정 도메인(채팅, 여행, 플랜 등)에 묶인 컴포넌트 (ChatBubble, ChatHeader, TravelPlanCard, ScheduleCard 등)

디자인 문서가 `docs/design/components/ui/` 하위에 있으면 `components/ui/`에 생성.
그 외는 `components/`에 생성. 이름으로 판단이 모호하면 도메인 특화(`components/`)로 분류.

### 4. 컴포넌트 파일 생성
디자인 문서 스펙을 반영하여 아래 패턴으로 생성:

```typescript
import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { useTheme } from '@/hooks/useTheme';
import { Typography } from '@/constants/theme';

type Props = {
  // 디자인 문서 스펙 기반 props 타입 명시
};

export function {Name}({ ... }: Props) {
  const { colors } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: colors.cardBg }]}>
      <Text style={[styles.title, { color: colors.textTitle }]}>{Name}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {},
  title: { ...Typography['body-md'] },
});
```

스타일 규칙:
- 색상 하드코딩 금지 — 반드시 `useTheme()` 훅 사용 (`colors.xxx` 형태로 인라인)
- Typography는 `StyleSheet.create()` 안에 spread — 인라인에 직접 넣기 금지
- `StyleSheet.create()` 항상 사용, 인라인 스타일 객체 금지 (color 제외)
- 눌림 효과는 `Pressable` + 절대 위치 오버레이 방식 — `TouchableOpacity` 금지
- SafeArea가 필요한 경우 `useSafeAreaInsets()` 사용, 하드코딩 금지

### 5. 완료 후 안내
- 생성된 파일 경로
- 사용 예시 코드 제공
