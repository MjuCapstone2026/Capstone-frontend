## **[POST] /api/v1/chat-messages/{roomId}**

사용자 메시지를 전송하고 AI Agent의 응답을 스트리밍으로 반환합니다.

---

### **1. 기본 정보**

| 항목 | 내용 |
| --- | --- |
| Method | `POST` |
| URL | `/api/v1/chat-messages/{roomId}` |
| Summary | 메시지 전송 및 AI Agent 응답 스트리밍 |
| Authentication | Bearer JWT (Clerk 발급 토큰 필수) |
| Response Type | `text/event-stream` (SSE) |

---

### **2. 요청 (Request)**

#### **2.1 Headers**

| Name | Required | Example | Description |
| --- | --- | --- | --- |
| Authorization | Y | `Bearer eyJhbGci...` | Clerk에서 발급받은 유효한 JWT 토큰 |

#### **2.2 Path Parameter**

| Name | Required | Type | Description |
| --- | --- | --- | --- |
| roomId | Y | UUID | 메시지를 전송할 채팅방의 고유 ID |

#### **2.3 Body**

```json
{
  "content": "경복궁 대신 창덕궁으로 바꿔줘"
}
```

| Field | Required | Type | Description |
| --- | --- | --- | --- |
| content | Y | String | 사용자가 전송한 메시지 본문 |

---

### **3. 응답 (Response)**

#### **3.1 성공 - 스트리밍 청크 (200 OK, SSE)**

- **Description**: AI Agent가 토큰 단위로 응답을 스트리밍합니다. 스트리밍 중에는 아래 형태의 이벤트가 반복 전송됩니다.

    ```
    event: chunk
    data: {"content": "창"}
    
    event: chunk
    data: {"content": "덕"}
    
    event: chunk
    data: {"content": "궁으로 변경했습니다!"}
    ```


#### **3.2 성공 - 스트리밍 완료**

- **Description**: 스트리밍이 완료되면 최종 메타데이터를 포함한 done 이벤트가 전송됩니다.
    - 일반 메시지일 때:

        ```
        event: done
        data: {
          "userMessage": {
            "messageId": "msg-041",
            "role": "user",
            "content": "경복궁 대신 창덕궁으로 바꿔줘",
            "createdAt": "2026-04-03T22:00:00"
          },
          "assistantMessage": {
            "messageId": "msg-042",
            "role": "assistant",
            "content": "네, 어떤 도움이 필요하신가요?",
            "createdAt": "2026-04-03T22:00:05"
          }
        }
        ```

    - itinerary 변경일 때:

        > AI 서버는 수정된 날짜만 전송하지만, 백엔드에서 기존 일정에 병합한 뒤 **전체 날짜**를 반환합니다.

        ```
        event: done
        data: {
          "userMessage": {
            "messageId": "msg-041",
            "role": "user",
            "content": "경복궁 대신 창덕궁으로 바꿔줘",
            "createdAt": "2026-04-03T22:00:00"
          },
          "assistantMessage": {
            "messageId": "msg-042",
            "role": "assistant",
            "content": "창덕궁으로 변경했습니다!",
            "createdAt": "2026-04-03T22:00:05"
          },
          "itinerary": {
            "itineraryId": "aaa-111",
            "startDate": "2026-05-01",
            "endDate": "2026-05-04",
            "dayPlans": {
              "2026-05-01": [
                {"index": 0, "plan_name": "창덕궁 방문", "time": "09:00 ~ 12:00", "place": "창덕궁", "note": "후원 투어 예약 필요", "cost": {"amount": 3000, "currency": "KRW", "amount_krw": null}, "status": "todo"},
                {"index": 1, "plan_name": "광장시장 점심", "time": "12:00 ~ 14:30", "place": "광장시장", "note": "", "cost": null, "status": "todo"}
              ],
              "2026-05-02": [
                {"index": 0, "plan_name": "N서울타워 방문", "time": "10:00 ~ 12:00", "place": "남산타워", "note": "", "cost": null, "status": "todo"}
              ],
              "2026-05-03": [],
              "2026-05-04": []
            },
            "updatedAt": "2026-04-03T22:00:05"
          }
        }
        ```

    - change (일정 기본 정보 수정) 일 때:

        ```
        event: done
        data: {
          "userMessage": {
            "messageId": "msg-041",
            "role": "user",
            "content": "여행 날짜 5월 3일부터 7일로 바꿔줘",
            "createdAt": "2026-04-03T22:00:00"
          },
          "assistantMessage": {
            "messageId": "msg-042",
            "role": "assistant",
            "content": "여행 기간을 5월 3일~7일로 변경했습니다.",
            "createdAt": "2026-04-03T22:00:05"
          },
          "change": {
            "itineraryId": "aaa-111",
            "startDate": "2026-05-03",
            "endDate": "2026-05-07",
            "totalDays": 5,
            "budget": 500000.00,
            "adultCount": 2,
            "childCount": 1,
            "childAges": [5],
            "updatedAt": "2026-04-03T22:00:05"
          }
        }
        ```

    - reservation (예약) 일 때:

        ```
        event: done
        data: {
          "userMessage": {
            "messageId": "msg-041",
            "role": "user",
            "content": "항공권 예약해줘",
            "createdAt": "2026-04-03T22:00:00"
          },
          "assistantMessage": {
            "messageId": "msg-042",
            "role": "assistant",
            "content": "대한항공 KE123편을 예약했습니다.",
            "createdAt": "2026-04-03T22:00:05"
          },
          "reservation": {
            "reservationId": "c3a7db7a-3b93-4b50-a667-4ac922e2ff11",
            "type": "flight",
            "status": "confirmed",
            "bookingUrl": "https://booking.example.com/flight/123",
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
            "reservedAt": "2026-05-01T09:00:00+09:00"
          }
        }
        ```

    - cancel (예약 취소) 일 때:

        ```
        event: done
        data: {
          "userMessage": {
            "messageId": "msg-041",
            "role": "user",
            "content": "항공권 예약 취소해줘",
            "createdAt": "2026-04-03T22:00:00"
          },
          "assistantMessage": {
            "messageId": "msg-042",
            "role": "assistant",
            "content": "KE123편 예약을 취소했습니다.",
            "createdAt": "2026-04-03T22:00:05"
          },
          "cancel": {
            "reservationId": "c3a7db7a-3b93-4b50-a667-4ac922e2ff11",
            "status": "cancelled",
            "cancelledAt": "2026-04-10T10:00:00+09:00"
          }
        }
        ```
