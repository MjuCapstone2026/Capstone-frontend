## **[POST] /api/v1/reservations**

예약 링크 제공 시 예약 레코드를 생성합니다.

---

### **1. 기본 정보**

| 항목 | 내용 |
| --- | --- |
| Method | `POST` |
| URL | `/api/v1/reservations` |
| Summary | 예약 생성 |
| Authentication | Bearer JWT (Clerk 발급 토큰 필수) |

---

### **2. 요청 (Request)**

### **2.1 Headers**

| Name | Required | Example | Description |
| --- | --- | --- | --- |
| Authorization | Y | `Bearer eyJhbGci...` | Clerk에서 발급받은 유효한 JWT 토큰 |

### **2.2 Body**

```json
{
  "itineraryId": "be4d9d2d-1d84-4b1b-bf4d-1ac6b9cc7f22",
  "type": "flight",
  "bookedBy": "ai",
  "bookingUrl": "https://booking.example.com/flight/123",
  "externalRefId": "KE12345678",
  "detail": {
    "airline": "대한항공",
    "flight_no": "KE123",
    "departure": {"airport": "ICN", "datetime": "2026-05-01T09:00:00"},
    "arrival": {"airport": "NRT", "datetime": "2026-05-01T11:30:00"},
    "seat_class": "economy",
    "passengers": [{"name": "홍길동", "passport": "M12345678"}]
  },
  "totalPrice": 320000.00,
  "currency": "KRW",
  "reservedAt": "2026-04-03T21:20:00+09:00"
}
```

| Field | Required | Type | Description |
| --- | --- | --- | --- |
| `itineraryId` | Y | UUID | 연결된 일정 ID |
| `type` | Y | String | `flight` | `accommodation` | `car_rental` |
| `bookedBy` | Y | String | `user` | `ai` |
| `bookingUrl` | N | String | 예약 링크 |
| `externalRefId` | N | String | 외부 예약 번호 |
| `detail` | Y | JSONB | 유형별 상세 정보 |
| `totalPrice` | N | Decimal | 총 결제 금액 |
| `currency` | N | String | 통화 코드 (기본값 `KRW`) |
| `reservedAt` | N | ISO-8601 with offset | 예약 완료 일시. **타임존 오프셋 필수** (예: `2026-04-03T21:20:00+09:00`) |

---

### **3. 응답 (Response)**

### **3.1 성공 (201 Created)**

- **Description**: 예약이 성공적으로 생성되었습니다.
    
    ```json
    {
      "reservationId": "c3a7db7a-3b93-4b50-a667-4ac922e2ff11",
      "itineraryId": "be4d9d2d-1d84-4b1b-bf4d-1ac6b9cc7f22",
      "type": "flight",
      "status": "confirmed",
      "reservedAt": "2026-04-03T21:20:00Z",
      "createdAt": "2026-04-03T12:20:10+09:00",
      "updatedAt": "2026-04-03T12:20:10+09:00"
    }
    ```
