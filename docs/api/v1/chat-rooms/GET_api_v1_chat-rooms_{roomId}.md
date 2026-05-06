## **[GET] /api/v1/chat-rooms/{roomId}**

현재 로그인한 사용자가 소유한 특정 채팅방의 메타 정보와 연결된 여행 일정의 `itineraryId`를 조회합니다.

---

### **1. 기본 정보**

| 항목 | 내용 |
| --- | --- |
| Method | `GET` |
| URL | `/api/v1/chat-rooms/{roomId}` |
| Summary | 채팅방 상세 조회 |
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
| roomId | Y | UUID | 조회할 채팅방의 고유 ID |

#### **2.3 Body**

- 없음

---

### **3. 응답 (Response)**

#### **3.1 성공 (200 OK)**

- **Description**: 채팅방 상세 정보를 성공적으로 조회했습니다. 채팅방 생성 시 itinerary가 항상 함께 생성되므로 `itineraryId`는 항상 존재합니다.

```json
{
  "roomId": "9d12a7e5-2a7b-4e86-bf5c-2d1b50dcb1a4",
  "name": "3박 4일 오사카 여행",
  "clerkId": "user_2N...",
  "aiSummary": "오사카 3박 4일 여행 계획 중",
  "preferences": {
    "budget": "economy",
    "style": "food"
  },
  "itineraryId": "be4d9d2d-1d84-4b1b-bf4d-1ac6b9cc7f22",
  "createdAt": "2026-04-01T10:00:00",
  "updatedAt": "2026-04-03T22:00:00"
}
```
