import { useAuth } from '@clerk/clerk-expo';
import { useCallback } from 'react';
import { AxiosResponse } from 'axios';

// 컴포넌트에서 인증 API를 호출할 때 사용하는 훅
// getToken()으로 토큰을 가져와 api/* 함수에 자동으로 주입해줌
//
// 사용 예시:
//   const { authRequest } = useApi();
//   const data = await authRequest(getMyProfile);
//   const data = await authRequest((token) => updateMyProfile(token, { nickname: '홍길동' }));

export const useApi = () => {
  const { getToken } = useAuth();

  const authRequest = useCallback(
    async <T>(fn: (token: string) => Promise<AxiosResponse<T>>): Promise<T> => {
      const token = await getToken();
      if (!token) throw new Error('인증 토큰이 없습니다. 다시 로그인해주세요.');
      const response = await fn(token);
      return response.data;
    },
    [getToken],
  );

  return { authRequest };
};
