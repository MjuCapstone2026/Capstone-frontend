# ItineraryOverviewCard2BeforeEdit

## 개요

PlanDetailScreen 상단 고정 헤더.

← 뒤로가기 / 편집 버튼 + 여행명 + 날짜 + Day 탭으로 구성.

## Variants

| Variant | 설명 |
|---|---|
| Light | 라이트 모드 |
| Dark | 다크 모드 |

## 구성

```
┌─────────────────────────────────────┐
│ ← 뒤로가기                    편집  │
│ 제주도 3박 4일                       │ ← heading-xl
│ 2026-05-10 • 제주도                  │ ← body-lg / Caption,Hint
├─────────────────────────────────────┤
│ [Day 1]  Day 2   Day 3   Day 4      │ ← Day 탭 (가로 스크롤)
└─────────────────────────────────────┘
```

## 스타일

| 속성 | Light | Dark |
|---|---|---|
| 배경 | `Light/Surface,Card BG` | `Dark/Surface,Card BG` |
| 하단 border | `1px solid Light/Divider,Border` | `1px solid Dark/Divider,Border` |
| Elevation | `Light/elevation-2` | `Dark/elevation-2` |
| 여행명 | `heading-xl` / `Light/Title,Body Text` | `heading-xl` / `Dark/Title,Body Text` |
| 날짜/목적지 | `body-lg` / `Light/Caption,Hint` | `body-lg` / `Dark/Caption,Hint` |
| 뒤로가기 | `body-lg` / `Light/Primary,CTA Button` | `body-lg` / `Dark/Primary,CTA Button` |
| 편집 | `body-lg` / `Light/Primary,CTA Button` | `body-lg` / `Dark/Primary,CTA Button` |
| 활성 Day 탭 배경 | `Light/Primary,CTA Button` | `Dark/Primary,CTA Button` |
| 비활성 Day 탭 배경 | `Light/Secondary Surface` | `Dark/Secondary Surface` |
| 활성 Day 탭 텍스트 | `body-lg` / `Light/Surface,Card BG` | `body-lg` / `Dark/Title,Body Text` |
| 비활성 Day 탭 텍스트 | `body-lg` / `Light/Placeholder,Disabled` | `body-lg` / `Dark/Placeholder,Disabled` |
| Day 탭 Border Radius | `radius-md` | `radius-md` |

## 스크롤 동작 (Hide on scroll up / Show on scroll down)
 
읽기 전용 화면이라 콘텐츠 영역을 넓게 쓸 수 있도록 스크롤 방향에 따라 헤더 표시/숨김.

## 동작

| 버튼 | 동작 |
|---|---|
| ← 뒤로가기 | PlanListScreen으로 복귀 |
| 편집 | PlanDetailEditScreen 진입 |
| Day N 탭 | 해당 일차 일정으로 스크롤 이동 |

## 데이터 구조

Day 탭은 API 응답의 날짜만큼 자동 생성. 하드코딩 금지.

## 관련 아이콘 추가후, 경로 추가
`assets/icons/ic_back.svg`

## 이미지

### Itinerary Overview Card2 Before Edit Dark
![Itinerary Overview Card2 Before Edit Dark](ItineraryOverviewCard2BeforeEdit-Dark.svg)

### Itinerary Overview Card2 Before Edit Light
![Itinerary Overview Card2 Before Edit Light](ItineraryOverviewCard2BeforeEdit-Light.svg)