/**
 * 홈 화면
 *
 * 로그인된 사용자 정보를 표시하고 서버와의 통신을 테스트합니다.
 * JWT 토큰을 사용한 인증 API 호출 예시도 포함되어 있습니다.
 */

import axios from "axios";
import React, { useState, useEffect } from "react";
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ScrollView,
  Alert,
} from "react-native";

import { useUser, useAuth } from "@clerk/clerk-expo";
import { useRouter } from "expo-router";
import { useApi } from "@/hooks/useApi";
import { registerUser, authConnect } from "@/api/auth";

export default function HomeScreen() {
  const [result, setResult] = useState<string>("버튼을 눌러 통신을 확인하세요.");
  const [loading, setLoading] = useState<boolean>(false);

  const { user, isLoaded } = useUser();
  const { signOut } = useAuth();
  const router = useRouter();
  const { authRequest } = useApi();

  // 탭 진입 시 백엔드 DB에 유저 등록
  // Clerk 세션이 완전히 초기화된 후 호출되므로 getToken()이 정상 동작
  // 이미 존재하는 유저면 백엔드에서 무시 (idempotent)
  useEffect(() => {
    authRequest(registerUser).catch((e) =>
      console.error("유저 등록 실패:", e)
    );
  }, []);

  const serverIp = process.env.EXPO_PUBLIC_SERVER_IP;
  const API_URL = `http://${serverIp}:8080/api/test/connect`;

  /**
   * 로그아웃 처리
   */
  const handleSignOut = async () => {
    try {
      await signOut();
      // 로그아웃 후 로그인 화면으로 이동
      router.replace("/(auth)/sign-in");
    } catch (error) {
      console.error("로그아웃 오류:", error);
      Alert.alert("오류", "로그아웃 중 오류가 발생했습니다.");
    }
  };

  /**
   * 기존 서버 통신 테스트 (JWT 없음)
   */
  const handleTestCall = async () => {
    setLoading(true);
    try {
      // 자바 서버로 요청 전송
      const response = await axios.get(API_URL);
      // 자바에서 합쳐서 보내준 (Java + Python) 메시지 출력
      setResult(response.data);
    } catch (error) {
      console.error(error);
      setResult(
        "❌ 서버 연결 실패!\n1. 서버 가동 여부\n2. 같은 와이파이인지 확인\n3. CORS 설정을 확인하세요."
      );
    } finally {
      setLoading(false);
    }
  };

  // JWT 인증 테스트: Spring → FastAPI 토큰 전달 확인
  const handleAuthConnect = async () => {
    setLoading(true);
    try {
      const data = await authRequest(authConnect);
      setResult(String(data));
    } catch (error: any) {
      console.error("auth-connect 오류:", error);
      setResult(`❌ 실패!\n${error.message}`);
    } finally {
      setLoading(false);
    }
  };


  // 사용자 정보 로딩 중
  if (!isLoaded) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#4A90E2" />
      </View>
    );
  }

  return (
    <ScrollView style={styles.scrollContainer}>
      <View style={styles.container}>
        {/* 사용자 정보 카드 */}
        <View style={styles.userCard}>
          <Text style={styles.userCardTitle}>👤 로그인 정보</Text>
          <Text style={styles.userInfo}>
            이름: {user?.firstName || user?.fullName || "사용자"}
          </Text>
          <Text style={styles.userInfo}>
            이메일: {user?.primaryEmailAddress?.emailAddress || "없음"}
          </Text>
          <Text style={styles.userInfoSmall}>ID: {user?.id}</Text>
        </View>

        {/* 서버 정보 */}
        <Text style={styles.header}>✅ React Native 서버 정상 연결됨</Text>
        <Text style={styles.ipText}>접속 서버: {serverIp}</Text>

        {/* 결과 표시 영역 */}
        <View style={styles.resultBox}>
          {loading ? (
            <ActivityIndicator size="large" color="#4A90E2" />
          ) : (
            <Text style={styles.message}>{result}</Text>
          )}
        </View>

        {/* 테스트 버튼들 */}
        <TouchableOpacity style={styles.button} onPress={handleTestCall}>
          <Text style={styles.buttonText}>
            [공개] 서버 통신 테스트 (JWT 없음)
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, styles.authButton]}
          onPress={handleAuthConnect}
        >
          <Text style={styles.buttonText}>
            [인증] Spring → FastAPI 연결 테스트
          </Text>
        </TouchableOpacity>

        {/* 로그아웃 버튼 */}
        <TouchableOpacity
          style={[styles.button, styles.logoutButton]}
          onPress={handleSignOut}
        >
          <Text style={styles.buttonText}>로그아웃</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

/**
 * 스타일 정의
 */
const styles = StyleSheet.create({
  scrollContainer: {
    flex: 1,
    backgroundColor: "#fff",
  },
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  // 사용자 정보 카드
  userCard: {
    width: "100%",
    backgroundColor: "#f0f8ff",
    padding: 20,
    borderRadius: 12,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#d0e8ff",
  },
  userCardTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 10,
  },
  userInfo: {
    fontSize: 14,
    color: "#555",
    marginBottom: 5,
  },
  userInfoSmall: {
    fontSize: 11,
    color: "#999",
    marginTop: 5,
  },
  // 헤더
  header: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#2ecc71",
    marginBottom: 5,
  },
  ipText: {
    fontSize: 12,
    color: "#999",
    marginBottom: 30,
  },
  // 결과 박스
  resultBox: {
    width: "100%",
    minHeight: 180,
    padding: 20,
    backgroundColor: "#f8f9fa",
    borderRadius: 15,
    justifyContent: "center",
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#eee",
  },
  message: {
    fontSize: 16,
    textAlign: "center",
    color: "#333",
    lineHeight: 24,
  },
  // 버튼들
  button: {
    backgroundColor: "#4A90E2",
    padding: 18,
    borderRadius: 12,
    width: "100%",
    alignItems: "center",
    elevation: 2,
    marginBottom: 12,
  },
  authButton: {
    backgroundColor: "#9b59b6", // 보라색 (인증 API)
  },
  logoutButton: {
    backgroundColor: "#e74c3c", // 빨간색 (로그아웃)
    marginTop: 10,
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
});
