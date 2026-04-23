# BookedByBadge

## 개요

예약 항목이 AI가 예약한 건지 사용자가 직접 예약한 건지 표시하는 배지.

MyReservationList 카드 내에서 사용.

## Variants

| Variant | 설명 |
|---|---|
| AI / Light | AI 예약, 라이트 |
| AI / Dark | AI 예약, 다크 |
| User / Light | 사용자 예약, 라이트 |
| User / Dark | 사용자 예약, 다크 |

## 스타일

| 속성 | AI (Light) | AI (Dark) | User (Light) | User (Dark) |
|---|---|---|---|---|
| 텍스트 | "AI 예약" / `caption` / `Light/Progress,AI Badge` | "AI 예약" / `caption` / `Dark/Progress,AI Badge` | "직접 예약" / `caption` / `Light/Surface,Card BG` | "직접 예약" / `caption` / `Dark/Title,Body Text` |
| 배경 | `Light/Progress BG` | `Dark/Progress BG` | `Light/Primary Light` | `Dark/Primary Light` |
| Border Radius | `radius-lg` | 동일 | 동일 | 동일 |
| border | `1px solid Light/Divider,Border` | `1px solid Dark/Divider,Border` | `1px solid Light/Divider,Border` | `1px solid Dark/Divider,Border` |

## 이미지

### Booked By Badge AI Dark/Light
![Booked By Badge AI Dark](BookedByBadgeAI-Dark.svg)
![Booked By Badge AI Light](BookedByBadgeAI-Light.svg)

### Booked By Badge User Dark/Light
![Booked By Badge User Dark](BookedByBadgeUser-Dark.svg)
![Booked By Badge User Light](BookedByBadgeUser-Light.svg)
