# StatusToggle

## 개요

PlanListScreen 여행 일정 항목에서 예정 ↔ 완료 전환하는 인터랙티브 토글.

TravelPlanCard 우측에 위치.

## Variants

| Variant | 설명 |
|---|---|
| Draft / Light | 예정 상태, 라이트 |
| Completed / Light | 완료 상태, 라이트 |
| Draft / Dark | 예정 상태, 다크 |
| Completed / Dark | 완료 상태, 다크 |

## 스타일

| 상태 | 배경 (Light) | 텍스트 (Light) | 배경 (Dark) | 텍스트 (Dark) |
|---|---|---|---|---|
| 예정 | `Light/Pending BG` | `Light/Pending,Warning` | `Dark/Pending BG` | `Dark/Pending,Warning` |
| 완료 | `Light/Success BG` | `Light/Success,Complete` | `Dark/Success BG` | `Dark/Success,Complete` |

- **크기:** 24px 높이 (너비 가변)
- **Border Radius:** `radius-lg`
- **Typography:** `caption`
- **FontFamily:** `Pretendard-Bold` 로 덮어씌우기
- **Border:** 
    - Light: `1px solid Light/Divider,Border`
    - Dark: `1px solid Dark/Divider,Border` 
- **토글 원형:** 18 × 18px

## 동작

- PlanListScreen - TravelPlanCard에서 사용
- 탭 → 예정 ↔ 완료 전환

## 이미지

![Status Toggle Dark Completed](StatusToggleDark-Completed.svg)
![Status Toggle Dark Draft](StatusToggleDark-Draft.svg)
![Status Toggle Light Completed](StatusToggleLight-Completed.svg)
![Status Toggle Light Draft](StatusToggleLight-Draft.svg)