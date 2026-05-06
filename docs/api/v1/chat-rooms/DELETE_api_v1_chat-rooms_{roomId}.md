## **[DELETE] /api/v1/chat-rooms/{roomId}**

현재 로그인한 사용자가 소유한 특정 채팅방을 삭제합니다.

채팅방 삭제 시 연결된 메시지와 현재 일정도 함께 삭제됩니다.

---

### **1. 기본 정보**

| 항목 | 내용                          |
| --- |-----------------------------|
| Method | `DELETE`                    |
| URL | `/api/v1/chat-rooms/{roomId}` |
| Summary | 채팅방 삭제                      |
| Authentication | Bearer JWT (Clerk 발급 토큰 필수) |

---

### **2. 요청 (Request)**

### **2.1 Headers**

| Name | Required | Example | Description |
| --- | --- | --- | --- |
| Authorization | Y | `Bearer eyJhbGci...` | Clerk에서 발급받은 유효한 JWT 토큰 |

### **2.2 Path Parameter**

| Name | Required | Type | Description |
| --- | --- | --- | --- |
| roomId | Y | UUID | 삭제할 채팅방의 고유 ID |

### **2.3 Body**

- 없음

---

### **3. 응답 (Response)**

### **3.1 성공 (200 OK)**

- **Description**: 채팅방이 성공적으로 삭제되었습니다.

```json
{
  "roomId": "9d12a7e5-2a7b-4e86-bf5c-2d1b50dcb1a4",
  "deleted": true
}
```
