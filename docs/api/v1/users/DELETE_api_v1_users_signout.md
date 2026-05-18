## **[DELETE] /api/v1/users/signout**

현재 로그인한 사용자의 계정을 탈퇴 처리합니다.

DB에서 사용자 및 모든 연관 데이터를 삭제한 뒤, Clerk에서도 계정을 삭제합니다.

---

### **1. 기본 정보**

| 항목 | 내용 |
| --- | --- |
| **Method** | `DELETE` |
| **URL** | `/api/v1/users/signout` |
| **Summary** | 회원탈퇴 |
| **Authentication** | **Bearer JWT** (Clerk 발급 토큰 필수) |
| **Domain** | USERS |

---

### **2. 요청 (Request)**

#### **2.1 Headers**

| Name | Required | Example | Description |
| --- | --- | --- | --- |
| **Authorization** | Y | `Bearer eyJhbGci...` | Clerk에서 발급받은 유효한 JWT 토큰 |

#### **2.2 Path Parameter**

- 없음

#### **2.3 Body**

- 없음

---

### **3. 응답 (Response)**

#### **3.1 성공 (204 No Content)**

- **Description**: 회원탈퇴가 성공적으로 처리되었습니다. DB 및 Clerk 계정이 모두 삭제됩니다.
- **Body**: (No Body)