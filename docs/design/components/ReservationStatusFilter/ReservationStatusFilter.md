# ReservationStatusFilter

## 개요

PlanListScreen 예약 탭에서 예약 상태로 필터링하는 칩 그룹.
전체 / 확정 / 변경 / 취소 상태 필터.

## Variants

| Variant | 설명 |
|---|---|
| Light | 라이트 모드 |
| Dark | 다크 모드 |

## 구성
 
```
┌──────────────────────────────────────────┐  ← FilterBar (컨테이너)
│  [전체]  확정   변경   취소                │  ← FilterChip × 4
└──────────────────────────────────────────┘
```

## 스타일

### FilterBar (컨테이너)
| 속성 | Light | Dark |
|---|---|---|
| 배경 | `Light/Surface,Card BG` | `Dark/Surface,Card BG` |
| 하단 border | `1px solid Light/Divider,Border` | `1px solid Dark/Divider,Border` |
| 칩 간격 | `gap: 10` | 동일 |

### FilterChip (개별 칩)

| 속성 | 활성 Light | 비활성 Light | 활성 Dark | 비활성 Dark |
|---|---|---|---|---|
| 배경 | `Light/Primary,CTA Button` | `Light/Secondary Surface` | `Dark/Primary,CTA Button` | `Dark/Secondary Surface` |
| Elevation | `Light/elevation-2` | 동일 | `Dark/elevation-2` | 동일 
| 텍스트 | `body-md` / **FontFamily:** `Pretendard-Bold` 로 덮어씌우기 / `Light/Surface,Card BG` | `body-md` / `Light/Placeholder,Disabled` | `body-md` / **FontFamily:** `Pretendard-Bold` 로 덮어씌우기 / `Dark/Title,Body Text` | `body-md` / `Dark/Placeholder,Disabled` |
| Border Radius | `radius-lg` | `radius-lg` | 동일 | 동일 |
| border | `1px solid Light/Divider,Border` | `1px solid Light/Divider,Border` | `1px solid Dark/Divider,Border` | `1px solid Dark/Divider,Border` |

## 이미지

### Reservation Status Filter Dark
![Dark](ReservationStatusFilter-Dark.svg)

### Reservation Status Filter Light
![Light](ReservationStatusFilter-Light.svg)
