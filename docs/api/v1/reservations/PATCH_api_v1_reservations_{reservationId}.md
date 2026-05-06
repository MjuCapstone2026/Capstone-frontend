## **[PATCH] /api/v1/reservations/{reservationId}**

예약 상태 변경(취소/변경), detail 수정, 가격 등을 업데이트합니다.

---

### **1. 기본 정보**

| 항목 | 내용 |
| --- | --- |
| Method | `PATCH` |
| URL | `/api/v1/reservations/{reservationId}` |
| Summary | 예약 수정(취소 또는 변경) |
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
| reservationId | Y | UUID | 수정할 예약의 고유 ID |

### **2.3 Body**

`status` 값에 따라 필요한 필드가 달라집니다.

**Case 1. `status: "cancelled"` — 예약 취소**

```json
{
  "status": "cancelled",
  "cancelledAt": "2026-04-10T10:00:00+09:00"
}
```

| Field | Required | Type | Description |
| --- | --- | --- | --- |
| `status` | Y | String | `cancelled` 고정 |
| `cancelledAt` | Y | ISO-8601 with offset | 취소 일시. **타임존 오프셋 필수** (예: `2026-04-10T10:00:00+09:00`) |

**Case 2. `status: "changed"` — 예약 변경 → Swagger Request Example로 사용합니다.**

```json
{
  "status": "changed",
  "detail": {
    "airline": "아시아나",
    "flight_no": "OZ108",
    "departure": {"airport": "ICN", "datetime": "2026-05-02T09:00:00"},
    "arrival": {"airport": "NRT", "datetime": "2026-05-02T11:30:00"},
    "seat_class": "economy",
    "passengers": [{"name": "홍길동", "passport": "M12345678"}]
  },
  "totalPrice": 290000.00,
  "currency": "KRW",
  "reservedAt": "2026-04-10T10:00:00+09:00"
}
```

| Field | Required | Type | Description |
| --- | --- | --- | --- |
| `status` | Y | String | `changed` 고정 |
| `detail` | Y | JSONB | 변경된 예약 상세 정보 |
| `totalPrice` | N | Decimal | 변경된 총 결제 금액 |
| `currency` | N | String | 통화 코드 (기본값 `KRW`) |
| `reservedAt` | Y | ISO-8601 with offset | 변경된 예약 완료 일시. **타임존 오프셋 필수** (예: `2026-04-10T10:00:00+09:00`) |

---

### **3. 응답 (Response)**

### **3.1 성공 (200 OK)**

- **Description**: 예약이 성공적으로 수정되었습니다.
    - **Case 1. `status: "cancelled"`**
        
        ```json
        {
          "reservationId": "c3a7db7a-3b93-4b50-a667-4ac922e2ff11",
          "status": "cancelled",
          "cancelledAt": "2026-04-10T10:00:00Z",
          "updatedAt": "2026-04-10T10:00:00+09:00"
        }
        ```
        
    - **Case 2. `status: "changed"`**
        
        ```json
        {
          "reservationId": "c3a7db7a-3b93-4b50-a667-4ac922e2ff11",
          "status": "changed",
          "reservedAt": "2026-04-10T10:00:00Z",
          "updatedAt": "2026-04-10T10:00:00+09:00"
        }
        ```
