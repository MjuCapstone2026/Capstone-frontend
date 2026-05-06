## [POST] /api/v1/users/signup

Clerk 인증 정보를 기반으로 서비스 데이터베이스에 사용자를 등록합니다. 멱등성(Idempotent)이 보장되어 여러 번 호출해도 안전합니다.

### 1. 기본 정보

| **항목** | **내용**                          |
| --- |---------------------------------|
| **Method** | `POST`                          |
| **URL** | `/api/v1/users/signup`          |
| **Summary** | 회원가입 및 사용자 동기화                  |
| **Authentication** | **Bearer JWT** (Clerk 발급 토큰 필수) |

---

### 2. 요청 (Request)

#### 2.1 Headers

| **Name** | **Required** | **Example** | **Description** |
| --- | --- | --- | --- |
| **Authorization** | Y | `Bearer eyJhbGci...` | Clerk에서 발급받은 유효한 JWT 토큰 |

#### 2.2 Body

- **None** (본문 데이터 없음)

---

### 3. 응답 (Response)

#### 3.1 성공 (200 OK)

- **Description**: 회원가입이 성공적으로 완료되었거나, 이미 가입된 사용자입니다.
- **Body**: (No Body)
