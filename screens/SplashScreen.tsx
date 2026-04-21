import { Image, StyleSheet, View } from 'react-native';
import { useTheme } from '@/hooks/useTheme';

export function SplashScreen() {
  const { colors } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: colors.primary }]}>
      <Image
        source={require('@/assets/images/img_logo_main.png')}
        style={styles.logo}
        resizeMode="contain"
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    width: 120,
    height: 128,
  },
});
