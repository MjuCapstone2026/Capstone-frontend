# Elevation Tokens

Figma Effect Styles (`Light/elevation-1~4`, `Dark/elevation-1~4`)로 등록 완료.

> RN 구현 값은 `constants/theme.ts`의 `Elevation` 참조.

---

## Light Mode

그림자 색상: `shadowColor: '#1E2822'` (앱 톤에 맞춘 다크그린 기반)
 
| Token | shadowOffset | shadowOpacity | shadowRadius | 사용처 |
|---|---|---|---|---|
| `elevation-1` | {0, 1} | 0.06 | 4 | 지도 위 일정 카드, 섹션 카드 |
| `elevation-2` | {0, 2} | 0.09 | 8 | HomeAIBanner, CurrentScheduleCard, ChatSendButton, ChatGenerateButton, EditInfoButton, NewTravelGenerateButton |
| `elevation-3` | {0, 4} | 0.12 | 16 | BottomNavigation |
| `elevation-4` | {0, 8} | 0.16 | 32 | 모달, 바텀시트, Alert, NavigationDrawer, OverflowMenu |

---

## Dark Mode

어두운 배경 가시성을 위해 `shadowColor: '#000'`에 opacity 높게 설정.
 
| Token | shadowOffset | shadowOpacity | shadowRadius | 사용처 |
|---|---|---|---|---|
| `elevation-1` | {0, 1} | 0.20 | 4 | 지도 위 카드, 섹션 카드 |
| `elevation-2` | {0, 2} | 0.30 | 8 | HomeAIBanner, CurrentScheduleCard, ChatSendButton, ChatGenerateButton, EditInfoButton, NewTravelGenerateButton |
| `elevation-3` | {0, 4} | 0.40 | 16 | BottomNavigation |
| `elevation-4` | {0, 8} | 0.50 | 32 | 모달, 바텀시트, Alert, NavigationDrawer, OverflowMenu |

---

## Scrim

| Token | 값 | 사용처 |
|---|---|---|
| `scrim-drawer` | `rgba(30,40,34,0.24)` | NavigationDrawer 배경 딤 |
| `scrim-modal` | `rgba(30,40,34,0.48)` | 바텀시트, Alert, 전체화면 모달 배경 딤 (OverflowMenu 제외) |