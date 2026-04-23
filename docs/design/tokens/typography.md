# Typography Tokens

Figma Text Styles로 등록 완료. 개발 모드에서 토큰 이름으로 확인 가능.

## Font Family

| 용도 | 폰트 |
|---|---|
| Primary | Pretendard |
| iOS Fallback | Apple SD Gothic Neo |
| Android Fallback | Noto Sans KR |

## Scale

| Token | Size | Weight | Line Height | Letter Spacing | 사용처 |
|---|---|---|---|---|---|
| `heading-xl` | 22px | 700 (Bold) | 130% | -0.3px | 여행 이름 대제목 |
| `heading-lg` | 20px | 700 (Bold) | 130% | -0.3px | 섹션 타이틀, ChatHeader 여행명 |
| `heading-md` | 18px | 600 (SemiBold) | 130% | -0.3px | 카드 제목, 현재 일정명 |
| `heading-sm` | 16px | 600 (SemiBold) | 130% | -0.3px | 홈 섹션 헤더, CTA 버튼 |
| `body-lg` | 16px | 400 (Regular) | 160% | 0 | AI 채팅 메시지 본문 |
| `body-md` | 14px | 400 (Regular) | 160% | 0 | 일정 장소명·설명, 여행 카드 부제 |
| `body-sm` | 13px | 400 (Regular) | 160% | 0 | 설정 메뉴 항목, 추천 질문 칩 |
| `caption` | 12px | 400 (Regular) | 140% | +0.2px | 날짜·시간, 타임스탬프 |
| `label` | 11px | 500 (Medium) | 140% | +0.2px | 상태 배지, 탭 라벨 |

## 비고

- `heading-sm`과 `body-lg`는 동일 16px이지만 weight로 구분 (SemiBold vs Regular)
- `body` lineHeight 160%는 의도적 — 채팅 중심 앱이라 메시지 가독성을 위해 여유있게 설정. 모바일 일반 기준(140~150%)보다 높지만 Figma 실측값과 일치