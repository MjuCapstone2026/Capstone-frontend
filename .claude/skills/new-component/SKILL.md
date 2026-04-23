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

### 1. 기존 컴포넌트 확인
- `components/` 디렉토리를 Glob으로 스캔한다.
- 유사한 컴포넌트가 있으면 Read로 읽어 스타일 패턴을 파악한다.

### 2. 컴포넌트 파일 생성
`components/ui/{Name}.tsx` 에 아래 패턴으로 생성:

```typescript
import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { useTheme } from '@/hooks/useTheme';
import { Typography } from '@/constants/theme';

type Props = {
  // props 타입 명시
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

### 3. 피그마/디자인 가이드 적용 (선택)
- 사용자가 디자인 이미지를 제공한 경우 해당 디자인에 맞게 JSX와 StyleSheet 작성
- 색상 하드코딩 금지 — 반드시 `useTheme()` 훅 사용 (`colors.xxx` 형태로 인라인)
- Typography는 `StyleSheet.create()` 안에 spread — 인라인에 직접 넣기 금지
- `StyleSheet.create()` 항상 사용, 인라인 스타일 객체 금지 (color 제외)

### 4. 완료 후 안내
- 생성된 파일 경로
- 사용 예시 코드 제공
