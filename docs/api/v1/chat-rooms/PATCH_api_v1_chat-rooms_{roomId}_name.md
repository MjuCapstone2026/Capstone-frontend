## **[PATCH] /api/v1/chat-rooms/{roomId}/name**

현재 로그인한 사용자가 소유한 특정 채팅방의 이름을 수정합니다.

---

### **1. 기본 정보**

| 항목 | 내용 |
| --- | --- |
| Method | `PATCH` |
| URL | `/api/v1/chat-rooms/{roomId}/name` |
| Summary | 채팅방 이름 수정 |
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
| roomId | Y | UUID | 이름을 수정할 채팅방의 고유 ID |

#### **2.3 Body**

```json
{
  "name": "오사카 3박 4일 여행"
}
```

| Field | Required | Type | Description |
| --- | --- | --- | --- |
| `name` | Y | String | 변경할 채팅방 이름 |

---

### **3. 응답 (Response)**

#### **3.1 성공 (200 OK)**

- **Description**: 채팅방 이름이 성공적으로 수정되었습니다.

```json
{
  "roomId": "9d12a7e5-2a7b-4e86-bf5c-2d1b50dcb1a4",
  "name": "오사카 3박 4일 여행",
  "updatedAt": "2026-04-03T22:00:00"
}
```
