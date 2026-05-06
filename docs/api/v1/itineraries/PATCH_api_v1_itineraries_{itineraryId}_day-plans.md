## **[PATCH] /api/v1/itineraries/{itineraryId}/day-plans**

날짜 단위로 여행 일정 아이템을 추가·수정합니다.

---

### **1. 기본 정보**

| 항목 | 내용 |
| --- | --- |
| Method | `PATCH` |
| URL | `/api/v1/itineraries/{itineraryId}/day-plans` |
| Summary | 여행 일정 day_plans 수정 |
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

요청에 포함된 날짜 키의 아이템 배열만 덮어씌웁니다. 포함되지 않은 날짜는 기존 값을 유지합니다.

```json
{
  "dayPlans": {
    "2026-05-01": [
      {
        "plan_name": "경복궁 방문",
        "time": "09:00 ~ 12:00",
        "place": "경복궁",
        "note": "한복 대여 추천"
      },
      {
        "plan_name": "광장시장 점심",
        "time": "12:00 ~ 14:30",
        "place": "광장시장",
        "note": ""
      }
    ],
    "2026-05-02": []
  }
}
```

| Field | Required | Type | Description |
| --- | --- | --- | --- |
| `dayPlans` | Y | Object | 날짜(YYYY-MM-DD)를 키로 갖는 객체. 하나 이상의 날짜 키를 포함해야 함 |
| `dayPlans[date]` | Y | Array | 해당 날짜의 아이템 배열. 빈 배열(`[]`) 전달 시 해당 날짜의 기존 일정 전체 삭제 |

**아이템 필드**

| Field | Required | Type | Description |
| --- | --- | --- | --- |
| `plan_name` | Y | String | 일정 이름 |
| `time` | Y | String | 일정 시간 범위. `"HH:MM ~ HH:MM"` 형식 (24시간제, 예: `"09:00 ~ 12:00"`) |
| `place` | Y | String | 장소명 |
| `note` | N | String | 메모. 생략 시 빈 문자열(`""`)로 저장 |

> `status`는 요청에 포함하지 않습니다. 서버에서 자동으로 결정됩니다. 기존 `day_plans`에 동일 `time`의 아이템이 있으면 해당 `status`를 이어받고, 없는 신규 아이템은 `"todo"`로 초기화됩니다.

---

### **3. 응답 (Response)**

#### **3.1 성공 (200 OK)**

- **Description**: 요청한 날짜의 일정이 성공적으로 수정되었습니다. 전체 `dayPlans`를 반환합니다.

```json
{
  "itineraryId": "aaa-111",
  "dayPlans": {
    "2026-05-01": [
      {"plan_name": "경복궁 방문", "time": "09:00 ~ 12:00", "place": "경복궁", "note": "한복 대여 추천", "status": "done"},
      {"plan_name": "광장시장 점심", "time": "12:00 ~ 14:30", "place": "광장시장", "note": "", "status": "todo"}
    ],
    "2026-05-02": [],
    "2026-05-03": []
  },
  "updatedAt": "2026-04-03T22:00:00"
}
```

> `dayPlans`의 각 날짜 아이템 배열은 `time` 시작 시각 오름차순으로 정렬되어 반환됩니다.
>
> 응답의 `status`는 서버가 결정한 값입니다. 기존 아이템(동일 `time`)은 기존 `status`를 유지하고, 신규 아이템은 `"todo"`입니다.
>
