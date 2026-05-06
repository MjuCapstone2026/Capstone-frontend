import { useEffect } from 'react';
import { useRouter } from 'expo-router';
import { ActivityIndicator, View } from 'react-native';
import { useAuth } from '@clerk/clerk-expo';
import { useTheme } from '@/hooks/useTheme';

export default function OAuthNativeCallbackRoute() {
  const router = useRouter();
  const { colors } = useTheme();
  const { isLoaded, isSignedIn } = useAuth();

  useEffect(() => {
    if (!isLoaded) return;

    router.replace(isSignedIn ? '/home' : '/sign-in');
  }, [isLoaded, isSignedIn, router]);

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.pageBg }}>
      <ActivityIndicator size="large" color={colors.primary} />
    </View>
  );
}
