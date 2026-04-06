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

---

## 🐳 Docker 빌드 및 배포

> 실제 배포는 `capstone-deploy` 레포에서 전체 서비스를 한번에 실행합니다.
> 아래는 이 서비스만 단독으로 빌드/실행할 때 사용합니다.

### 이미지 빌드

```bash
docker build -t capstone-frontend .
```

> **참고:** Expo는 환경변수를 빌드 타임에 JS 번들에 포함시키기 때문에 `--build-arg`가 필요합니다.
> `capstone-deploy`에서 빌드 시 `frontend.env`의 값이 자동으로 주입됩니다.

### 단독 실행

```bash
docker run -p 80:80 capstone-frontend
```

### 빌드 결과

- `npx expo export --platform web` 으로 정적 파일 생성 (`dist/`)
- nginx가 포트 80에서 정적 파일 서빙
- SPA 라우팅 지원 (모든 경로 → `index.html` fallback)
