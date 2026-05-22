import { apiClient } from './client';

const BASE = '/api/v1/users';

// Clerk 로그인 후 백엔드 DB에 유저 등록
// 백엔드에서 JWT의 sub 클레임으로 clerk_id 추출 → users 테이블에 INSERT
// 이미 존재하는 유저면 무시 (idempotent)
export const registerUser = (token: string) =>
  apiClient.post(
    `${BASE}/signup`,
    {},
    { headers: { Authorization: `Bearer ${token}` } },
  );

export const deleteUser = (token: string) =>
  apiClient.delete(`${BASE}/signout`, {
    headers: { Authorization: `Bearer ${token}` },
  });

// JWT 인증 테스트: Spring → FastAPI 토큰 전달 확인
export const authConnect = (token: string) =>
  apiClient.get('/api/test/auth-connect', {
    headers: { Authorization: `Bearer ${token}` },
  });
