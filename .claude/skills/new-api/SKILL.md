---
name: new-api
description: 새 API 함수 추가 — docs/api 명세 확인 후 api/{domain}.ts에 함수 작성 + 요청/응답 타입 정의
argument-hint: "HTTP메서드 경로 (예: GET /api/v1/schedules/{id})"
allowed-tools: Read, Write, Edit, Glob, Grep
---

@docs/conventions.md 의 코딩 규칙을 준수한다.
@docs/api/v1 의 API 명세를 우선 확인한다.

## 사용법

```
/new-api GET /api/v1/schedules/{id}
/new-api POST /api/v1/schedules
/new-api DELETE /api/v1/schedules/{id}
```

## 입력
사용자가 HTTP 메서드와 경로를 제공한다. (예: `GET /api/v1/schedules/{id}`)

## 절차

### 1. 컨벤션 확인
- 작업 전에 `docs/conventions.md`를 읽고 API 함수 패턴, 인증 API 호출 규칙, 타입 규칙, 에러 처리 규칙을 확인한다.
- 모든 API 함수는 `api/{domain}.ts`에 작성한다.
- 파일 상단에 도메인 `BASE` 경로를 상수로 선언한다.
- 응답 타입은 `api/{domain}.ts` 파일에 함께 정의한다.
- 인증 API는 컴포넌트에서 직접 호출하지 않고 Screen에서 `useApi().authRequest`로 호출할 수 있는 형태를 유지한다.

### 2. API 문서 확인
- `docs/api/v1/{domain}/`에서 해당 엔드포인트 문서를 찾는다.
- 문서 파일명은 `{METHOD}_api_v1_{path}.md` 패턴을 따른다. 예: `GET_api_v1_chat-rooms_{roomId}.md`
- API 문서는 프론트 연동에 필요한 내용만 사용한다:
  - 엔드포인트: HTTP Method, URL, 인증 필요 여부
  - Request: Headers, Path Parameter, Query Parameter, Body
  - Response: 성공 응답 구조

### 3. 도메인 파일 확인
- `api/` 디렉토리를 Glob으로 스캔한다.
- 도메인은 `/api/v1/{domain}`의 첫 번째 리소스 세그먼트를 기준으로 정한다.
  - `/api/v1/chat-rooms` -> `api/chatRooms.ts`
  - `/api/v1/chat-rooms/{roomId}/messages` -> `api/chatRooms.ts`
  - `/api/v1/chat-messages/{roomId}` -> `api/chatMessages.ts`
  - `/api/v1/reservations/{reservationId}` -> `api/reservations.ts`
- 첫 번째 리소스만으로 책임이 애매하면 기존 `api/` 파일과 `docs/api/v1/{domain}/` 구조를 우선 따른다.
- 해당 도메인의 파일이 없으면 새로 생성한다.
- 있으면 Read로 기존 파일을 읽어 컨텍스트 파악 후 추가한다.
- 새 파일을 만들 때는 `apiClient`를 import한다:
```typescript
import { apiClient } from './client';
```

### 4. 요청/응답 타입 정의
API 문서의 Request/성공 Response 구조를 기반으로 타입을 정의한다:
```typescript
type {Name}Request = {
  // ...
};

type {Name} = {
  id: number;
  // ...
};
```

타입 작성 규칙:
- 응답 타입은 `api/{domain}.ts` 파일에 함께 정의한다.
- Request body가 있으면 `{Name}Request` 또는 기존 도메인 네이밍에 맞는 타입을 만든다.
- Path Parameter와 Query Parameter는 함수 인자로 받는다.
- Path Parameter는 API 문서의 이름을 그대로 함수 인자로 받고, UUID는 `string`으로 타입 지정한다.
- `any`를 사용하지 않는다.

### 5. API 함수 작성

파일 상단에 도메인 `BASE` 경로를 선언한다:
```typescript
const BASE = '/api/v1/{domain}';
```

인증 필요 GET:
```typescript
export const {methodName} = (token: string, id: string) =>
  apiClient.get<{ResponseType}>(`${BASE}/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
```

공개 GET:
```typescript
export const {methodName} = () =>
  apiClient.get<{ResponseType}>(BASE);
```

Query Parameter가 있는 GET:
```typescript
type {Name}Params = {
  status?: string;
  page?: number;
};

export const {methodName} = (token: string, params?: {Name}Params) =>
  apiClient.get<{ResponseType}>(BASE, {
    headers: { Authorization: `Bearer ${token}` },
    params,
  });
```

POST (body 있는 경우):
```typescript
export const {methodName} = (token: string, body: {BodyType}) =>
  apiClient.post<{ResponseType}>(BASE, body, {
    headers: { Authorization: `Bearer ${token}` },
  });
```

PATCH/PUT (body 있는 경우):
```typescript
export const {methodName} = (token: string, id: string, body: {BodyType}) =>
  apiClient.patch<{ResponseType}>(`${BASE}/${id}`, body, {
    headers: { Authorization: `Bearer ${token}` },
  });
```
PUT 엔드포인트라면 `apiClient.patch` 대신 `apiClient.put`을 사용한다.

DELETE:
```typescript
export const {methodName} = (token: string, id: string) =>
  apiClient.delete<{ResponseType}>(`${BASE}/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
```

작성 규칙:
- 파일 상단에 `const BASE = '/api/v1/{domain}'`를 둔다.
- 인증 API는 `token: string`을 첫 번째 인자로 받는다.
- 컴포넌트에서 직접 호출하지 않고 Screen에서 `useApi().authRequest`로 호출할 수 있는 형태를 유지한다.

### 6. 완료 후 안내
- 추가된 함수명과 파일 경로
- 참고한 API 문서 경로
