import axios from "axios";
import React, { useState } from "react";
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function HomeScreen() {
  const [result, setResult] =
    useState<string>("버튼을 눌러 통신을 확인하세요.");
  const [loading, setLoading] = useState<boolean>(false);

  // .env 파일에 작성한 IP 주소를 가져옵니다.
  const serverIp = process.env.EXPO_PUBLIC_SERVER_IP;
  const API_URL = `http://${serverIp}:8080/api/test/connect`;

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
        "❌ 서버 연결 실패!\n1. 서버 가동 여부\n2. 같은 와이파이인지 확인\n3. CORS 설정을 확인하세요.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>✅ React Native 서버 정상 연결됨</Text>
      <Text style={styles.ipText}>접속 서버: {serverIp}</Text>

      <View style={styles.resultBox}>
        {loading ? (
          <ActivityIndicator size="large" color="#4A90E2" />
        ) : (
          <Text style={styles.message}>{result}</Text>
        )}
      </View>

      <TouchableOpacity style={styles.button} onPress={handleTestCall}>
        <Text style={styles.buttonText}>
          서버(springboot - fastapi) 요청 보내기
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  header: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#2ecc71",
    marginBottom: 5,
  },
  ipText: { fontSize: 12, color: "#999", marginBottom: 30 },
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
  message: { fontSize: 16, textAlign: "center", color: "#333", lineHeight: 24 },
  button: {
    backgroundColor: "#4A90E2",
    padding: 18,
    borderRadius: 12,
    width: "100%",
    alignItems: "center",
    elevation: 2,
  },
  buttonText: { color: "white", fontWeight: "bold", fontSize: 16 },
});
