# 🚀 MJU Travel AI Agent - Frontend

명지대학교 자연캠퍼스 가이드 및 여행 일정을 생성해주는 AI 에이전트 서비스의 프론트엔드 레포지토리입니다.  
**React Native (Expo)**를 기반으로 구축되었습니다.

---

## 🛠️ 개발 환경 및 스택

- **Framework**: Expo (SDK 54)
- **Language**: TypeScript
- **State/UI**: React Native Reanimated, Safe Area Context
- **Navigation**: Expo Router (File-based Routing)
- **HTTP Client**: Axios
- **Map**: React Native Maps

---

## ⚙️ 초기 설정 (Getting Started)

팀원들은 프로젝트를 `git clone` 한 후 아래 순서에 따라 환경을 구축하세요.

### 1. 의존성 설치

프로젝트 루트 폴더에서 아래 명령어를 실행합니다. (package-lock.json에 명시된 버전을 그대로 설치합니다.)

```bash
npm install
```

### 2. 환경 변수 설정 (.env)

루트 폴더에 .env 파일을 생성하고 본인의 PC IP 주소를 입력합니다. (네트워크 환경이 바뀌면 수정 필요)

```bash
# 본인 PC의 IPv4 주소 (ipconfig로 확인)
EXPO_PUBLIC_SERVER_IP=192.168.0.xx
```

### 3. 모바일 기기 연결

- 1.스마트폰에 Expo Go 앱을 설치합니다. (iOS/Android)

- 2.PC와 스마트폰이 동일한 Wi-Fi에 연결되어 있어야 합니다.

## 🏃 실행 방법 (Scripts)

### 서버 가동

```bash
npx expo start
```

터미널에 QR 코드가 나타나면, 폰의 카메라나 Expo Go 앱을 통해 스캔하여 앱을 실행합니다.

### 주요 명령어

- npm run android: 안드로이드 에뮬레이터에서 실행
- npm run ios: iOS 시뮬레이터에서 실행
- npm run web: 웹 브라우저에서 실행
