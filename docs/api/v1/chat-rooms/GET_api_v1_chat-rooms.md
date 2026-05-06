## **[GET] /api/v1/chat-rooms**

현재 로그인한 사용자의 채팅방 목록을 조회합니다.

---

### **1. 기본 정보**

| 항목 | 내용                          |
| --- |-----------------------------|
| Method | `GET`                       |
| URL | `/api/v1/chat-rooms` |
| Summary | 내 채팅방 목록 조회                 |
| Authentication | Bearer JWT (Clerk 발급 토큰 필수) |

---

### **2. 요청 (Request)**

### **2.1 Headers**

| Name | Required | Example | Description |
| --- | --- | --- | --- |
| Authorization | Y | `Bearer eyJhbGci...` | Clerk에서 발급받은 유효한 JWT 토큰 |

### **2.2 Query Parameter**

- 없음

### **2.3 Body**

- 없음

---

### **3. 응답 (Response)**

### **3.1 성공 (200 OK)**

- **Description**: 현재 로그인한 사용자의 채팅방 목록을 성공적으로 조회했습니다.
- **Body**:

```json
{
  "rooms": [
    {
      "roomId": "9d12a7e5-2a7b-4e86-bf5c-2d1b50dcb1a4",
      "name": "3박 4일 오사카 여행",
      "clerkId": "user_2N...",
      "aiSummary": "오사카 3박 4일 여행 계획 중",
      "preferences": {
        "budget": "economy",
        "style": "food"
      },
      "createdAt": "2026-04-01T10:00:00",
      "updatedAt": "2026-04-03T22:00:00"
    },
    {
      "roomId": "15fdb4a4-7d9a-4b7c-9bcb-8d9a4f45be21",
      "name": "1박 2일 부산 여행",
      "clerkId": "user_2N...",
      "aiSummary": null,
      "preferences": null,
      "createdAt": "2026-04-02T14:30:00",
      "updatedAt": "2026-04-02T14:30:00"
    }
  ]
}
```

> 사용자의 채팅방이 하나도 없는 경우, `rooms`는 빈 배열 `[]` 로 반환합니다.
> 

예시:

```json
{
  "rooms": []
}
```
