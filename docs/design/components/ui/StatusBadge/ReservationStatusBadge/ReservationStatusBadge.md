# ReservationStatusBadge

## 개요

예약 상태 표시 배지.

읽기 전용, 인터랙션 없음.

도트(●) + 텍스트 구조. 배경 없음.

MyReservationList 등 예약 관련 화면에서 사용.

## Variants

| Variant | 텍스트 | 설명 |
|---|---|---|
| `confirmed` / Light | 확정 | 라이트 |
| `confirmed` / Dark | 확정 | 다크 |
| `changed` / Light | 변경 | 라이트 |
| `changed` / Dark | 변경 | 다크 |
| `cancelled` / Light | 취소 | 라이트 |
| `cancelled` / Dark | 취소 | 다크 |

## 스타일

| 상태 | 도트 (Light) | 텍스트 색 (Light) | 도트 (Dark) | 텍스트 색 (Dark) | 텍스트 |
|---|---|---|---|---|---|
| `confirmed` (확정) | `Light/Success,Complete` | `Light/Surface,Card BG` | `Dark/Success,Complete` | `Dark/Title,Body Text` | 확정 |
| `changed` (변경) | `Light/Pending,Warning` | `Light/Surface,Card BG` | `Dark/Pending,Warning` | `Dark/Title,Body Text` | 변경 |
| `cancelled` (취소) | `Light/Danger,Logout` | `Light/Surface,Card BG` | `Dark/Danger,Logout` | `Dark/Title,Body Text` | 취소 |

- **크기:** 고정 없음 — 콘텐츠에 맞게 자동
- **도트 크기:** 5 × 5px 원형 (**Border Radius:** `radius-full`)
- **도트-텍스트 간격:** 5px
- **Typography:** `caption`
- **FontFamily:** `Pretendard-Bold` 로 덮어씌우기

## 이미지

### Reservation Status Badge Confirmed Dark/Light
![Reservation Status Badge Confirmed Dark](ReservationStatusBadgeConfirmed-Dark.svg)
![Reservation Status Badge Confirmed Light](ReservationStatusBadgeConfirmed-Light.svg)

### Reservation Status Badge Changed Dark/Light
![Reservation Status Badge Changed Dark](ReservationStatusBadgeChanged-Dark.svg)
![Reservation Status Badge Changed Light](ReservationStatusBadgeChanged-Light.svg)

### Reservation Status Badge Cancelled Dark/Light
![Reservation Status Badge Cancelled Dark](ReservationStatusBadgeCancelled-Dark.svg)
![Reservation Status Badge Cancelled Light](ReservationStatusBadgeCancelled-Light.svg)