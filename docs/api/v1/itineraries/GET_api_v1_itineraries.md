## **[GET] /api/v1/itineraries**

내 여행 일정 목록을 조회합니다.

---

### **1. 기본 정보**

| 항목 | 내용 |
| --- | --- |
| Method | `GET` |
| URL | `/api/v1/itineraries` |
| Summary | 내 여행 일정 목록 조회 |
| Authentication | Bearer JWT (Clerk 발급 토큰 필수) |

---

### **2. 요청 (Request)**

#### **2.1 Headers**

| Name | Required | Example | Description |
| --- | --- | --- | --- |
| Authorization | Y | `Bearer eyJhbGci...` | Clerk에서 발급받은 유효한 JWT 토큰 |

---

### **3. 응답 (Response)**

#### **3.1 성공 (200 OK)**

- **Description**: 일정 목록이 성공적으로 조회되었습니다.

```json
{
  "itineraries": [
    {
      "itineraryId": "aaa-111",
      "name": "서울 당일치기",
      "status": "draft",
      "destination": "서울",
      "totalDays": 1,
      "startDate": "2026-04-15"
    },
    {
      "itineraryId": "bbb-222",
      "name": "제주도 3박 4일",
      "status": "draft",
      "destination": "제주",
      "totalDays": 4,
      "startDate": "2026-05-10"
    },
    {
      "itineraryId": "ccc-333",
      "name": "부산 2박 3일",
      "status": "completed",
      "destination": "부산",
      "totalDays": 3,
      "startDate": "2026-03-20"
    }
  ]
}
```

**응답 필드 설명** (`itineraries` 배열 아이템 필드)

| Field | Type | Description |
| --- | --- | --- |
| `itineraryId` | UUID | 일정 고유 ID (`itineraries.id`) |
| `name` | String | 채팅방 이름 (`chat_rooms.name`) |
| `status` | String | 일정 상태 (`draft` / `completed`) |
| `destination` | String | 목적지 |
| `totalDays` | Integer | 총 여행 일수 |
| `startDate` | String (YYYY-MM-DD) | 여행 시작일 |
