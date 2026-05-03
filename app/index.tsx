import { Redirect } from 'expo-router';

/**
 * TODO: 프로덕션 배포 전 /(auth)/sign-in 또는 /(main)/home 으로 변경
 *
 * iOS는 앱 최초 진입 시 index.tsx의 Redirect가 동작하고,
 * Android(Expo Go)는 이전 네비게이션 상태를 복원하여 index를 건너뛸 수 있음으로
 * _layout.tsx의 useEffect redirect와 병행 사용 중.
 */
export default function Index() {
  return <Redirect href="/dev_gallery" />;
}
