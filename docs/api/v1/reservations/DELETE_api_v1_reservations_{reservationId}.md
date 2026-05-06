## **[DELETE] /api/v1/reservations/{reservationId}**

예약 레코드를 완전히 삭제합니다. (데이터 Hard Delete)

---

### **1. 기본 정보**

| 항목 | 내용 |
| --- | --- |
| Method | `DELETE` |
| URL | `/api/v1/reservations/{reservationId}` |
| Summary | 예약 삭제 |
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
| reservationId | Y | UUID | 삭제할 예약의 고유 ID |

---

## **3. 응답 (Response)**

### **3.1 성공 (200 OK)**

- **Description**: 예약이 성공적으로 삭제되었습니다.
    
    ```json
    {
      "reservationId": "c3a7db7a-3b93-4b50-a667-4ac922e2ff11",
      "deleted": true
    }
    ```
