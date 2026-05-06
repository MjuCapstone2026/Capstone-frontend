## **[POST] /api/v1/chat-rooms**

사용자의 새로운 여행 계획용 채팅방을 생성합니다.

---

### **1. 기본 정보**

| 항목 | 내용 |
| --- | --- |
| Method | `POST` |
| URL | `/api/v1/chat-rooms` |
| Summary | 채팅방 생성 |
| Authentication | Bearer JWT (Clerk 발급 토큰 필수) |

---

### **2. 요청 (Request)**

#### **2.1 Headers**

| Name | Required | Example | Description |
| --- | --- | --- | --- |
| Authorization | Y | `Bearer eyJhbGci...` | Clerk에서 발급받은 유효한 JWT 토큰 |

#### **2.2 Body**

```json
{
  "destination": "제주도",
  "startDate": "2026-05-01",
  "endDate": "2026-05-03",
  "budget": 300000,
  "adultCount": 2,
  "childCount": 1,
  "childAges": [7]
}
```

| Field | Required | Type | Description |
| --- | --- | --- | --- |
| `destination` | Y | String | 여행지 |
| `startDate` | Y | DATE | 여행 시작일 |
| `endDate` | Y | DATE | 여행 종료일 |
| `budget` | N | Decimal | 예산 |
| `adultCount` | Y | Int | 성인 수 (최솟값: 1) |
| `childCount` | Y | Int | 아이 수 (최솟값: 0). `childAges`와 항상 함께 전달해야 함 |
| `childAges` | Y | Int[] | 아이 나이 배열. `childCount`와 항상 함께 전달해야 함. 배열 길이는 `childCount`와 일치해야 하며, `childCount`가 0이면 빈 배열(`[]`) |

---

### **3. 응답 (Response)**

#### **3.1 성공 (201 Created)**

- **Description**: 채팅방이 성공적으로 생성되었습니다.

```json
{
  "roomId": "9d12a7e5-2a7b-4e86-bf5c-2d1b50dcb1a4",
  "name": "2박 3일 제주도 여행",
  "itineraryId": "aaa-111",
  "clerkId": "user_2N...",
  "createdAt": "2026-04-03T22:00:00",
  "updatedAt": "2026-04-03T22:00:00"
}
```
