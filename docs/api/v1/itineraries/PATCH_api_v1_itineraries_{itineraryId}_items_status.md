## **[PATCH] /api/v1/itineraries/{itineraryId}/items/status**

사용자가 일정 아이템의 완료 여부를 체크/해제할 때 호출합니다.

---

### **1. 기본 정보**

| 항목 | 내용 |
| --- | --- |
| Method | `PATCH` |
| URL | `/api/v1/itineraries/{itineraryId}/items/status` |
| Summary | 일정 아이템 상태 변경 |
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
| itineraryId | Y | UUID | 대상 일정의 고유 ID |

#### **2.3 Body**

```json
{
  "date": "2026-05-01",
  "index": 0,
  "status": "done"
}
```

| Field | Required | Type | Description |
| --- | --- | --- | --- |
| `date` | Y | string | 아이템이 속한 날짜 (YYYY-MM-DD) |
| `index` | Y | integer | 해당 날짜 아이템을 `time`의 시작 시각 오름차순으로 정렬했을 때의 순서 (0부터 시작). GET 응답의 `day_plans[date][index]`와 대응됨 |
| `status` | Y | string | 변경할 `day_plans` 아이템의 완료 여부. `todo`(예정) / `done`(완료) |

---

### **3. 응답 (Response)**

#### **3.1 성공 (200 OK)**

- **Description**: 일정 아이템 상태가 성공적으로 변경되었습니다.

```json
{
  "itineraryId": "aaa-111",
  "date": "2026-05-01",
  "index": 0,
  "status": "done",
  "updatedAt": "2026-04-03T22:00:00"
}
```
