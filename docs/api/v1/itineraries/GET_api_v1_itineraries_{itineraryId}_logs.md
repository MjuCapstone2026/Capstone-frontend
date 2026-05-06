## **[GET] /api/v1/itineraries/{itineraryId}/logs**

특정 여행 일정의 수정 이력(스냅샷) 목록을 시간순으로 조회합니다.

---

### **1. 기본 정보**

| 항목 | 내용 |
| --- | --- |
| Method | `GET` |
| URL | `/api/v1/itineraries/{itineraryId}/logs` |
| Summary | 여행 일정 수정 이력 조회 |
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

- **Description**: 수정 이력이 성공적으로 조회되었습니다. 이력이 없는 경우 빈 배열(`[]`)을 반환합니다.
- 각 항목은 **수정이 발생하기 직전 상태**의 스냅샷입니다.
- `createdAt`은 해당 스냅샷이 저장된 시각(= 수정이 발생한 시각)이며, **내림차순(최신 순)** 으로 정렬됩니다.

```json
{
  "itineraryId": "aaa-111",
  "logs": [
    {
      "logId": "log-001",
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
          {"plan_name": "경복궁 방문", "time": "09:00 ~ 12:00", "place": "경복궁", "note": "한복 대여 추천", "status": "done"},
          {"plan_name": "광장시장 점심", "time": "12:00 ~ 14:30", "place": "광장시장", "note": "", "status": "todo"}
        ]
      },
      "createdAt": "2026-04-03T20:00:00"
    },
    {
      "logId": "log-002",
      "destination": "서울",
      "budget": 600000.00,
      "adultCount": 2,
      "childCount": 1,
      "childAges": [5],
      "totalDays": 4,
      "startDate": "2026-05-01",
      "endDate": "2026-05-04",
      "dayPlans": {
        "2026-05-01": [
          {"plan_name": "경복궁 방문", "time": "09:00 ~ 12:00", "place": "경복궁", "note": "한복 대여 추천", "status": "done"},
          {"plan_name": "광장시장 점심", "time": "12:00 ~ 14:30", "place": "광장시장", "note": "", "status": "todo"},
          {"plan_name": "창덕궁 방문", "time": "14:30 ~ 18:00", "place": "창덕궁", "note": "후원 투어 예약 필요", "status": "todo"}
        ]
      },
      "createdAt": "2026-04-05T14:30:00"
    }
  ]
}
```
