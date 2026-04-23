# Interaction Tokens

## Press Overlay (눌림 효과)

버튼/카드/리스트 항목 탭 시 눌린 느낌을 주는 오버레이 색상.

> RN 구현 값은 `constants/theme.ts`의 `Colors.pressOverlay` 참조.
컴포넌트 배경색과 무관하게 **단일 오버레이를 위에 덧씌우는 방식**으로 통일.

| Token | 값 |
|---|---|
| `pressOverlay-light` | `rgba(30,40,34,0.08)` |
| `pressOverlay-dark` | `rgba(255,255,255,0.08)` |

> **결정 근거:** 배경색별로 pressed 색상을 다르게 가져가면 관리 포인트가 늘어남.
> 단일 오버레이 방식으로 통일.

---

## 적용 대상

| 컴포넌트 | borderRadius |
|---|---|
| 카드 (HomeAIBanner, RecentTravel 등) | 16 (radius-lg) |
| 리스트 아이템 (RecentChat, DayScheduleItem 등) | 16 (radius-lg) |
| CTA 버튼 (ChatGenerateButton 등) | 12 (radius-md) |
| ChatSendButton | 16 (radius-lg) |
| BottomNavigation 탭 아이템 | 12 (radius-md) |
| Alert 버튼 (취소/확인) | 0 |
| StatusToggle | 9999 (radius-full) |
| Day 탭 버튼 | 12 (radius-md) |

---

## 적용하지 않는 것

- **TextInput** — 포커스 시 border 색상 변경으로 처리
- **StatusBadge** — 인터랙션 없음 (읽기 전용)
