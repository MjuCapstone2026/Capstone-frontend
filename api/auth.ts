import { apiClient } from './client';

// Clerk 로그인 후 백엔드 DB에 유저 등록
// 백엔드에서 JWT의 sub 클레임으로 clerk_id 추출 → users 테이블에 INSERT
// 이미 존재하는 유저면 무시 (idempotent)
export const registerUser = (token: string) =>
  apiClient.post(
    '/api/auth/register',
    {},
    { headers: { Authorization: `Bearer ${token}` } }
  );
