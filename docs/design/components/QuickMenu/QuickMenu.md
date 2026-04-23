# QuickMenu

## 개요

HomeScreen 전용 퀵메뉴. "AI와 채팅" / "일정 보기" 두 버튼으로 구성.

HomeScreen에서만 사용되지만 역할이 명확하고 독립적인 UI 덩어리라 컴포넌트로 분리.

## Variants

| Variant | 설명 |
|---|---|
| Light | 라이트 모드 |
| Dark | 다크 모드 |

## 구성

```
┌──────────────┐  ┌──────────────┐
│ [채팅 아이콘]  │ │ [일정 아이콘]  │
│   AI와 채팅   │  │   일정 보기   │
└──────────────┘  └──────────────┘
```

## 스타일

| 속성 | Light | Dark |
|---|---|---|
| 카드 배경 | `Light/Surface,Card BG` | `Dark/Surface,Card BG` |
| 카드 border | `1px solid Light/Divider,Border` | `1px solid Dark/Divider,Border` |
| 카드 Border Radius | `radius-lg` | `radius-lg` |
| Elevation | `Light/elevation-2` | `Dark/elevation-2` |
| 아이콘 색상 | `Light/Surface,Card BG` | `Dark/Title,Body Text` |
| 아이콘 컨테이너 배경 | `Light/Primary,CTA Button` | `Dark/Primary,CTA Button` |
| 아이콘 컨테이너 Border Radius | `radius-full` | `radius-full` |
| 라벨 | `caption` / `Light/Title,Body Text` | `caption` / `Dark/Title,Body Text` |

## 동작

| 버튼 | 동작 |
|---|---|
| AI와 채팅 | ChatScreen 진입 (새 채팅) |
| 일정 보기 | PlanScreen 진입 |

## 관련 아이콘 추가후, 경로 추가
`assets/icons/ic_chat.svg`

`assets/icons/ic_plan.svg`

## 이미지

### Quick Menu Light
![Quick Menu Light](QuickMenu-Light.svg)

### Quick Menu Dark
![Quick Menu Dark](QuickMenu-Dark.svg)