# Border Radius Tokens

Figma Variables에 `Border Radius` 컬렉션으로 등록되어 있음.

RN 구현 값은 `constants/theme.ts`의 `BorderRadius` 참조. Figma 토큰명과 코드 키 대응은 아래 표 참조.

## 토큰

| Figma 토큰 | 코드 (`BorderRadius.`) | 값 | 사용처 |
|---|---|---|---|
| `radius-xs` | `xs` | 4px | 상태 배지 (완료·예정·진행중) |
| `radius-sm` | `sm` | 8px | CTA 버튼, 메시지 입력창, 추천 질문 칩 |
| `radius-md` | `md` | 12px | DayScheduleItem, '여행 계획 시작하기' 버튼, '길 안내 시작' 버튼, ItineraryOverviewCard 일차 선택 버튼 |
| `radius-lg` | `lg` | 16px | HomeAIBanner 카드, RecentTravelSection 카드, CurrentScheduleCard |
| `radius-lg-modal` | `lgModal` | 32px | 여행 정보 입력 모달 (TripInfoBottomSheet) |
| `radius-full` | `full` | 9999px | 프로필 아바타, 바텀 탭 인디케이터, 태그 칩, StatusToggle |