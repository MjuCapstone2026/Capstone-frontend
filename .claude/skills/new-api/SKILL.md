---
name: new-api
description: 새 API 함수 추가 — api/{domain}.ts에 함수 작성 + 응답 타입 정의
argument-hint: "HTTP메서드 경로 (예: GET /api/v1/schedules/{id})"
allowed-tools: Read, Write, Edit, Glob
---

@docs/conventions.md 의 코딩 규칙을 준수한다.

## 사용법

```
/new-api GET /api/v1/schedules/{id}
/new-api POST /api/v1/schedules
/new-api DELETE /api/v1/schedules/{id}
```

## 입력
사용자가 HTTP 메서드와 경로를 제공한다. (예: `GET /api/v1/schedules/{id}`)

## 절차

### 1. 도메인 파일 확인
- `api/` 디렉토리를 Glob으로 스캔한다.
- 해당 도메인의 파일이 없으면 새로 생성한다.
- 있으면 Read로 기존 파일을 읽어 컨텍스트 파악 후 추가한다.

### 2. 응답 타입 정의
백엔드 응답 구조를 기반으로 타입을 정의한다:
```typescript
type {Name} = {
  id: number;
  // ...
};
```

### 3. API 함수 작성

인증 필요 GET:
```typescript
export const {methodName} = (token: string, id: number) =>
  apiClient.get<{ResponseType}>(`/api/v1/{domain}/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
```

공개 GET:
```typescript
export const {methodName} = () =>
  apiClient.get<{ResponseType}>('/api/v1/{domain}');
```

POST/PUT/PATCH (body 있는 경우):
```typescript
export const {methodName} = (token: string, body: {BodyType}) =>
  apiClient.post<{ResponseType}>('/api/v1/{domain}', body, {
    headers: { Authorization: `Bearer ${token}` },
  });
```

### 4. 완료 후 안내
- 추가된 함수명과 파일 경로
- 컴포넌트에서 사용할 때는 `useApi` 훅의 `authRequest`로 호출하도록 안내
