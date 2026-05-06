## **[GET] /api/v1/chat-messages/{roomId}**

채팅방의 메시지 히스토리를 조회합니다.

---

### **1. 기본 정보**

| 항목 | 내용 |
| --- | --- |
| Method | `GET` |
| URL | `/api/v1/chat-messages/{roomId}` |
| Summary | 메시지 히스토리 조회 |
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

#### **2.3 Query Parameter**

| Name | Required | Type | Default | Description |
| --- | --- | --- | --- | --- |
| cursor | N | `OffsetDateTime` (ISO-8601) | - | 페이지네이션 기준 메시지의 created_at (이 시각 이전 메시지 조회) |
| limit | N | INT | 30 | 한 번에 조회할 메시지 수 |

---

### **3. 응답 (Response)**

#### **3.1 성공 (200 OK)**

- **Description**: 메시지 히스토리가 성공적으로 조회되었습니다.

    ```json
    {
      "roomId": "bbb-222",
      "messages": [
        {
          "messageId": "msg-040",
          "role": "user",
          "content": "북촌한옥마을 대신 인사동으로 바꿔줘",
          "createdAt": "2026-04-03T21:50:00"
        },
        {
          "messageId": "msg-039",
          "role": "assistant",
          "content": "북촌한옥마을을 인사동으로 변경했습니다!",
          "createdAt": "2026-04-03T21:49:30"
        },
        {
          "messageId": "msg-038",
          "role": "user",
          "content": "창덕궁 후원 예약은 어떻게 해?",
          "createdAt": "2026-04-03T21:40:00"
        },
        {
          "messageId": "msg-037",
          "role": "assistant",
          "content": "창덕궁 후원은 문화재청 홈페이지에서 사전 예약 가능합니다.",
          "createdAt": "2026-04-03T21:39:30"
        },
        {
          "messageId": "msg-036",
          "role": "user",
          "content": "2일차 남산타워 몇 시가 좋을까?",
          "createdAt": "2026-04-03T21:30:00"
        },
        {
          "messageId": "msg-035",
          "role": "assistant",
          "content": "일몰 시간대인 오후 6시 전후가 야경도 볼 수 있어서 추천드립니다.",
          "createdAt": "2026-04-03T21:29:30"
        },
        {
          "messageId": "msg-034",
          "role": "user",
          "content": "광장시장 근처 주차 가능해?",
          "createdAt": "2026-04-03T21:20:00"
        },
        {
          "messageId": "msg-033",
          "role": "assistant",
          "content": "광장시장 인근에 을지로 공영주차장 이용 가능합니다.",
          "createdAt": "2026-04-03T21:19:30"
        },
        {
          "messageId": "msg-032",
          "role": "user",
          "content": "경복궁 입장료 얼마야?",
          "createdAt": "2026-04-03T21:10:00"
        },
        {
          "messageId": "msg-031",
          "role": "assistant",
          "content": "경복궁 입장료는 성인 기준 3,000원입니다.",
          "createdAt": "2026-04-03T21:09:30"
        }
      ],
      "nextCursor": "2026-04-03T21:09:30", 
      "hasMore": true
    }
    ```
