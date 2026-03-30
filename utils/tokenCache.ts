/**
 * Token Cache 설정
 *
 * Clerk의 인증 토큰을 안전하게 저장하고 관리하는 캐시입니다.
 * expo-secure-store를 사용하여 디바이스에 암호화된 형태로 토큰을 저장합니다.
 *
 * 주요 기능:
 * - getToken: 저장된 토큰을 불러옵니다
 * - saveToken: 새로운 토큰을 저장합니다
 *
 * 참고: 자동 로그인을 원하지 않는 경우에도 이 캐시는 필요합니다.
 * Clerk가 세션을 유지하고 토큰을 갱신하는데 사용됩니다.
 */

import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

/**
 * 토큰 캐시 구현
 * Clerk의 TokenCache 인터페이스를 따릅니다.
 */
export const tokenCache = {
  /**
   * 저장된 토큰을 가져옵니다
   * @param key - 토큰 키 (Clerk가 자동으로 관리)
   * @returns Promise<string | null> - 저장된 토큰 또는 null
   */
  async getToken(key: string): Promise<string | null> {
    try {
      // 웹 환경에서는 SecureStore를 사용할 수 없으므로 localStorage 사용
      if (Platform.OS === 'web') {
        return localStorage.getItem(key);
      }

      // 모바일(iOS/Android)에서는 SecureStore 사용 (암호화된 저장소)
      const token = await SecureStore.getItemAsync(key);
      return token;
    } catch (error) {
      console.error('토큰 불러오기 실패:', error);
      return null;
    }
  },

  /**
   * 토큰을 저장합니다
   * @param key - 토큰 키 (Clerk가 자동으로 관리)
   * @param token - 저장할 토큰 값
   */
  async saveToken(key: string, token: string): Promise<void> {
    try {
      // 웹 환경에서는 localStorage 사용
      if (Platform.OS === 'web') {
        localStorage.setItem(key, token);
        return;
      }

      // 모바일에서는 SecureStore 사용
      await SecureStore.setItemAsync(key, token);
    } catch (error) {
      console.error('토큰 저장 실패:', error);
    }
  },
};
