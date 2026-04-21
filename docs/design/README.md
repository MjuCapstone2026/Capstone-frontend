# 마실 Design Documentation

## 개요

마실 앱의 디자인 시스템 및 컴포넌트/스크린 문서.

- **디자인 툴:** Figma
- **폰트:** Pretendard (Primary), Apple SD Gothic Neo (iOS), Noto Sans KR (Android)
- **색상 토큰:** Figma Variables (`Light/*`, `Dark/*`) — 개발 모드에서 확인 가능
- **Typography 스타일:** Figma Text Styles (`heading-xl` ~ `label`) — 등록 완료
- **Border Radius 변수:** Figma Variables (`Border Radius` 컬렉션) — 등록 완료
- **Elevation:** Effect Styles (`Light/elevation-1~4`, `Dark/elevation-1~4`) — 등록 완료

---

## 폴더 구조

```
docs/design/
├── README.md
├── conventions.md
├── tokens/
│   ├── typography.md              ← 타입 토큰
│   ├── border-radius.md           ← radius 토큰
│   ├── elevation.md               ← elevation/shadow 토큰
│   └── interaction.md             ← press overlay 토큰
│
├── components/
│   ├── ui/                        ← 범용 원자 컴포넌트 (도메인 무관)
│   │   ├── Alert/                 ← ChatDeleteAlert / LogoutAlert / DeleteAccountAlert
│   │   ├── BookedByBadge/         ← AI 예약 / 사용자 예약 배지
│   │   ├── BottomNavigation/      ← 전체 화면 하단 고정 탭 바
│   │   ├── CheckButton/           ← 일정 완료 체크 버튼
│   │   ├── Header/                ← 상단 헤더
│   │   ├── NavigationDrawer/      ← 사이드 드로어
│   │   ├── OverflowMenu/          ← 더보기 드롭다운
│   │   ├── PrimaryButton/         ← ChatGenerateButton + EditInfoButton 통합 (라벨만 다름)
│   │   ├── StatusBadge/           ← ScheduleStatusBadge / ReservationStatusBadge
│   │   ├── StatusToggle/          ← 예정 ↔ 완료 전환 토글
│   │   └── TripInfoBottomSheet/   ← 여행 정보 입력/수정 바텀시트
│   │
│   ├── ChatBubble/                ← AIAgentChat / UserChat 묶음
│   ├── ChatHeader/                ← Default / Active 두 상태
│   ├── ChatSendButton/            ← 채팅 전송 버튼
│   ├── CurrentScheduleCard/       ← 현재 일정 카드 + 길 안내 시작
│   ├── DayScheduleItem/           ← 일별 일정 타임라인 목록
│   ├── HomeAIBanner/              ← 홈 AI 추천 배너
│   ├── ItineraryOverviewCard/     ← PlanScreen 상단 여행 개요 카드
│   ├── ItineraryOverviewCard2BeforeEdit/ ← PlanDetailScreen 상단 헤더
│   ├── ItineraryOverviewCard2Editing/    ← PlanDetailEditScreen 상단 Sticky 헤더
│   ├── NewTravelGenerateButton/   ← PlanScreen 빈 상태 버튼
│   ├── QuickMenu/                 ← 홈 퀵메뉴 (AI와 채팅 / 일정 보기)
│   ├── RecentChatSection/         ← 홈 최근 채팅 섹션
│   ├── RecentTravelSection/       ← 홈 최근 여행 섹션
│   ├── RenameChatModal/           ← 채팅 이름 변경 모달
│   ├── ReservationCard/           ← 예약 카드 (타입별 분리)
│   │   ├── FlightReservationCard/ ← 항공편 카드
│   │   ├── LodgingReservationCard/ ← 숙소 카드
│   │   └── CarReservationCard/    ← 렌트카 카드
│   ├── ReservationStatusFilter/   ← 예약 상태 필터 칩 그룹
│   ├── ReservationTypeTab/        ← 예약 타입 탭 (전체/항공/숙소/렌트카)
│   ├── TravelListTabBar/          ← PlanListScreen 여행목록 헤더 + 일정/예약 탭 전환
│   ├── TravelPlanCard/            ← 여행 목록 개별 카드
│   └── TypeMessageWindow/         ← 채팅 입력창 + 전송 버튼 (입력값 유무로 활성화)
│
└── screens/
    ├── HomeScreen/                 ← 홈
    ├── ChatScreen/                 ← 채팅 (EditChatNameScreen 포함)
    ├── PlanScreen/                 ← 여행 일정 (WithSchedule / Empty)
    ├── PlanListScreen/             ← 여행 목록 (MyTravelPlanList, MyReservationList 포함)
    ├── PlanDetailScreen/           ← 여행 상세 조회 (PlanDetail 포함)
    ├── PlanDetailEditScreen/       ← 여행 상세 편집 (PlanDetailEdit 포함)
    ├── SettingScreen/              ← 설정 (Settings 포함)
    └── LoginScreen/                ← 로그인 (Google Sign In)
```

---

## 별도 문서 없이 상위에 포함된 것들

| 항목 | 포함 위치 |
|---|---|
| TravelListTabBar, ReservationTypeTab, ReservationStatusFilter | PlanListScreen |
| MyTravelPlanList, MyReservationList | PlanListScreen |
| ItineraryOverviewCard2-BeforeEdit, PlanDetail | PlanDetailScreen |
| EditChatNameScreen | ChatScreen |
| EditTripInfoScreen (TripInfoBottomSheet Edit) | ChatScreen |
| ItineraryOverviewCard2-Editing | PlanDetailEditScreen |
| 인라인 편집 아코디언 항목 (닫힌 상태 / 펼쳐진 상태) | PlanDetailEditScreen |
| GoogleSignIn 버튼 | LoginScreen |
 
---

## 이미지 추가 방법

Figma에서 export한 SVG를 `.md` 파일과 같은 폴더에 넣으면 됨.
md 파일 내 `![](파일명.svg)` 으로 참조.

파일명 규칙: `{variant}-{Light|Dark}.svg`
단일 variant는 `Light.svg` / `Dark.svg` 만 사용.

예) `ChatDeleteAlert-Light.svg`, `LogoutAlert-Dark.svg`