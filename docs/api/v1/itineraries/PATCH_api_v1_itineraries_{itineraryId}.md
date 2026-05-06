## **[PATCH] /api/v1/itineraries/{itineraryId}**

사용자가 UI에서 직접 수정한 여행 기본 정보를 반영합니다.

### **1. 기본 정보**

| 항목 | 내용 |
| --- | --- |
| Method | `PATCH` |
| URL | `/api/v1/itineraries/{itineraryId}` |
| Summary | 여행 기본 정보 수정 |
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
| itineraryId | Y | UUID | 수정할 일정의 고유 ID |

#### **2.3 Body**

모든 필드는 선택입니다. 변경이 필요한 필드만 포함합니다.

> `destination`은 수정 불가 필드입니다. 요청 body에 포함되더라도 무시합니다. 여행지를 변경하려면 새 채팅방에서 일정을 생성해야 합니다.

```json
{
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
| `startDate` | N | DATE | 변경할 여행 시작일 |
| `endDate` | N | DATE | 변경할 여행 종료일 |
| `budget` | N | Decimal | 변경할 예산 |
| `adultCount` | N | Int | 변경할 성인 수 (최솟값: 1) |
| `childCount` | N | Int | 변경할 아이 수 (최솟값: 0). `childAges`와 항상 함께 전달해야 함 |
| `childAges` | N | Int[] | 변경할 아이 나이 배열. `childCount`와 항상 함께 전달해야 함. 배열 길이는 `childCount`와 일치해야 하며, `childCount`가 0이면 빈 배열(`[]`) |

---

### **3. 응답 (Response)**

#### **3.1 성공 (200 OK)**

- **Description**: 일정 기본 정보가 성공적으로 변경되었습니다.

    ```json
    {
      "itineraryId": "aaa-111",
      "destination": "제주도",
      "startDate": "2026-05-01",
      "endDate": "2026-05-03",
      "totalDays": 3,
      "budget": 300000,
      "adultCount": 2,
      "childCount": 1,
      "childAges": [7],
      "updatedAt": "2026-04-03T22:00:00"
    }
    ```

**응답 필드 설명**

| Field | Type | Description |
| --- | --- | --- |
| `itineraryId` | UUID | 일정 고유 ID |
| `destination` | String | 목적지 (수정 불가, 기존값 그대로 반환) |
| `startDate` | String (YYYY-MM-DD) | 여행 시작일 |
| `endDate` | String (YYYY-MM-DD) | 여행 종료일 |
| `totalDays` | Integer | 총 여행 일수 (`endDate - startDate + 1`) |
| `budget` | Number \| null | 예산. 미설정 시 `null` |
| `adultCount` | Integer | 어른 수 |
| `childCount` | Integer | 아이 수 |
| `childAges` | Array | 아이 나이 목록 |
| `updatedAt` | String (ISO 8601) | 마지막 수정 일시 |

> `budget`을 요청에 포함하지 않거나 `null`로 전달한 경우 기존 값이 유지됩니다. `budget`이 설정된 적 없는 일정은 `"budget": null`로 반환됩니다. `null`은 "사용자가 예산을 지정하지 않음"을 의미하며, AI 서버는 예산 제약 없이 일정을 생성합니다.
