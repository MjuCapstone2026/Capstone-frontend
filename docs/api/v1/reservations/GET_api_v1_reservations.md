## **[GET] /api/v1/reservations**

현재 로그인한 사용자의 예약 목록을 조회합니다.

예약 유형(`type`)과 예약 상태(`status`)로 필터링할 수 있습니다.

---

### **1. 기본 정보**

| 항목 | 내용 |
| --- | --- |
| Method | `GET` |
| URL | `/api/v1/reservations` |
| Summary | 내 예약 목록 조회 |
| Authentication | Bearer JWT (Clerk 발급 토큰 필수) |

---

### **2. 요청 (Request)**

### **2.1 Headers**

| Name | Required | Example | Description |
| --- | --- | --- | --- |
| Authorization | Y | `Bearer eyJhbGci...` | Clerk에서 발급받은 유효한 JWT 토큰 |

### **2.2 Query Parameter**

| Name | Required | Type | Example | Description |
| --- | --- | --- | --- | --- |
| type | N | String | `flight` | 예약 유형 필터 |
| status | N | String | `confirmed` | 예약 상태 필터 |
- `type` 허용 값: `flight`, `accommodation`, `car_rental`
- `status` 허용 값: `confirmed`, `changed`, `cancelled`

### **2.3 Body**

- 없음

---

### **3. 응답 (Response)**

### **3.1 성공 (200 OK)**

- **Description**: 현재 로그인한 사용자의 예약 목록을 성공적으로 조회했습니다.

  ```json
  {
    "reservations": [
      {
        "reservationId": "7d1a1213-f8c8-473e-ae19-3f17cb2ae8e5",
        "itineraryId": "db2ed15e-bdcb-4b08-8f61-9db4868751e5",
        "type": "car_rental",
        "status": "confirmed",
        "bookedBy": "ai",
        "bookingUrl": null,
        "externalRefId": "HERTZ-20260501",
        "detail": {
          "pickup": {
            "datetime": "2026-05-01T13:00:00",
            "location": "NRT T1"
          },
          "company": "Hertz",
          "dropoff": {
            "datetime": "2026-05-03T11:00:00",
            "location": "NRT T1"
          },
          "car_model": "Toyota Camry"
        },
        "totalPrice": 95000,
        "currency": "KRW",
        "reservedAt": "2026-05-04T11:42:01.574526Z",
        "cancelledAt": null,
        "createdAt": "2026-05-04T11:42:01.358771Z",
        "updatedAt": "2026-05-04T11:42:01.719527Z"
      },
      {
        "reservationId": "0d765dae-4edd-4f80-b472-fc0714b31fc2",
        "itineraryId": "db2ed15e-bdcb-4b08-8f61-9db4868751e5",
        "type": "accommodation",
        "status": "confirmed",
        "bookedBy": "user",
        "bookingUrl": null,
        "externalRefId": "LOTTE-20260501",
        "detail": {
          "guests": 2,
          "check_in": "2026-05-01",
          "check_out": "2026-05-03",
          "room_type": "디럭스 더블",
          "hotel_name": "롯데호텔 도쿄"
        },
        "totalPrice": 180000,
        "currency": "KRW",
        "reservedAt": "2026-05-04T11:42:01.574526Z",
        "cancelledAt": null,
        "createdAt": "2026-05-04T11:42:01.358771Z",
        "updatedAt": "2026-05-04T11:42:01.695785Z"
      },
      {
        "reservationId": "7c87a366-c9f6-40b6-aa55-64f878f3df1a",
        "itineraryId": "db2ed15e-bdcb-4b08-8f61-9db4868751e5",
        "type": "flight",
        "status": "confirmed",
        "bookedBy": "ai",
        "bookingUrl": null,
        "externalRefId": "KE-20260501-001",
        "detail": {
          "airline": "대한항공",
          "arrival": {
            "airport": "NRT",
            "datetime": "2026-05-01T11:30:00"
          },
          "departure": {
            "airport": "ICN",
            "datetime": "2026-05-01T09:00:00"
          },
          "flight_no": "KE123",
          "passengers": [
            {
              "name": "홍길동",
              "passport": "M12345678"
            }
          ],
          "seat_class": "economy"
        },
        "totalPrice": 350000,
        "currency": "KRW",
        "reservedAt": "2026-05-04T11:42:01.574526Z",
        "cancelledAt": null,
        "createdAt": "2026-05-04T11:42:01.358771Z",
        "updatedAt": "2026-05-04T11:42:01.635789Z"
      }
    ]
  }
  ```

- **예약이 없는 경우 예시**

  ```json
  {
    "reservations": []
  }
  ```
