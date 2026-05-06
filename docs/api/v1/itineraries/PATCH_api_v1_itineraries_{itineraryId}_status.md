## **[PATCH] /api/v1/itineraries/{itineraryId}/status**

여행 일정의 상태를 변경합니다.

---

### **1. 기본 정보**

| 항목 | 내용 |
| --- | --- |
| Method | `PATCH` |
| URL | `/api/v1/itineraries/{itineraryId}/status` |
| Summary | 여행 일정 상태 변경 |
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
| itineraryId | Y | UUID | 상태를 변경할 일정의 고유 ID |

#### **2.3 Body**

```json
{
  "status": "completed"
}
```

| Field | Required | Type | Constraints | Description |
| --- | --- | --- | --- | --- |
| status | Y | String | `draft` / `completed` | 변경할 일정 상태 (`draft`: 예정, `completed`: 완료) |

---

### **3. 응답 (Response)**

#### **3.1 성공 (200 OK)**

- **Description**: 일정 상태가 성공적으로 변경되었습니다.

    ```json
    {
      "itineraryId": "aaa-111",
      "status": "completed",
      "updatedAt": "2026-04-03T22:00:00"
    }
    ```
