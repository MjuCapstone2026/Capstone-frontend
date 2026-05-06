## **[GET] /api/v1/itineraries/{itineraryId}**

여행 일정 상세 정보를 조회합니다.

---

### **1. 기본 정보**

| 항목 | 내용 |
| --- | --- |
| Method | `GET` |
| URL | `/api/v1/itineraries/{itineraryId}` |
| Summary | 여행 일정 조회 |
| Authentication | Bearer JWT (Clerk 발급 토큰 필수) |

---

### **2. 요청 (Request)**

#### **2.1 Headers**

| Name | Required | Example | Description |
| --- | --- | --- | --- |
| Authorization | Y | `Bearer eyJhbGci...` | Clerk에서 발급받은 유효한 JWT 토큰 |

#### **2.2 Path Parameter**

| Name | Required | Type | Description |
| --- | --- | --- | --- |
| itineraryId | Y | UUID | 조회할 일정의 고유 ID |

---

### **3. 응답 (Response)**

#### **3.1 성공 (200 OK)**

- **Description**: 일정이 성공적으로 조회되었습니다.

    ```json
    {
      "itineraryId": "aaa-111",
      "name": "서울 3박 4일 여행",
      "status": "draft",
      "destination": "서울",
      "budget": 500000.00,
      "adultCount": 2,
      "childCount": 1,
      "childAges": [5],
      "totalDays": 4,
      "startDate": "2026-05-01",
      "endDate": "2026-05-04",
      "dayPlans": {
        "2026-05-01": [
          {"index": 0, "plan_name" : "경복궁 방문" ,"time": "09:00 ~ 12:00", "place": "경복궁", "note": "한복 대여 추천", "status": "done"},
          ...
        ]
      },
      "createdAt": "2026-04-03T20:00:00",
      "updatedAt": "2026-04-03T22:00:00"
    }
    ```


**응답 필드 설명**

| Field | Type | Description |
| --- | --- | --- |
| `itineraryId` | UUID | 일정 고유 ID (`itineraries.id`) |
| `name` | String | 채팅방 이름 (`chat_rooms.name`) |
| `status` | String | 일정 상태 (`draft` / `completed`) |
| `destination` | String | 목적지 |
| `budget` | Number \| null | 예산. 미설정 시 `null` |
| `adultCount` | Integer | 어른 수 |
| `childCount` | Integer | 아이 수 |
| `childAges` | Array | 아이 나이 목록 |
| `totalDays` | Integer | 총 여행 일수 |
| `startDate` | String (YYYY-MM-DD) | 여행 시작일 |
| `endDate` | String (YYYY-MM-DD) | 여행 종료일 |
| `dayPlans` | Object | 날짜별 일정 상세. 아이템은 `time` 오름차순 정렬, `index` 포함 |
| `createdAt` | String (ISO 8601) | 일정 생성 일시 |
| `updatedAt` | String (ISO 8601) | 마지막 수정 일시 |
