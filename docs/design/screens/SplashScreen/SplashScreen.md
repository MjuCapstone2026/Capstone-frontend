# SplashScreen

## 개요

앱 실행 시 가장 먼저 표시되는 화면.

## 구성

```
┌─────────────────────┐
│                     │
│                     │
│      [앱 아이콘]     │ ← 중앙 정렬
│                     │
│                     │
└─────────────────────┘
```

## 스타일

| 속성 | Light | Dark |
|---|---|---|
| 배경 | `Light/Primary,CTA Button` | `Dark/Primary,CTA Button` |
| 아이콘 크기 | 120 × 128px |
| 아이콘 | `assets/images/img_logo_main.png` |
| 정렬 | 화면 중앙 |

## 구현

React Native에서 SplashScreen은 코드로 구현하지 않고 **네이티브 레벨에서 처리**.

`expo-splash-screen` 라이브러리 + `app.json` 설정으로 처리.

SplashScreen에서 폰트 로딩 완료 후, LoginScreen으로 넘어감. 현 단계에서는 LoginScreen이 없으므로 임의로 빈 화면 LoginScreen 만듦.

앱 로딩 완료 후 SplashScreen을 숨기는 처리는 `app/_layout.tsx`에서

> **[임시]** Windows 환경 제약으로 Native 빌드 테스트 불가 → 현재는 `screens/SplashScreen.tsx` + `app/splash.tsx`로 외형 확인용 Screen을 임시 운영 중.
> Mac 환경 또는 Android Studio 세팅 후 Native Splash(`app.json` + `expo-splash-screen`)로 교체 예정. 교체 시 `app/splash.tsx`와 `screens/SplashScreen.tsx` 제거.

## 이미지

![Dark](SplashScreen-Dark.svg)
![Light](SplashScreen-Light.svg)