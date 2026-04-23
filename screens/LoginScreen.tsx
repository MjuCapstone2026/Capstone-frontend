import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '@/hooks/useTheme';

export function LoginScreen() {
  const { colors } = useTheme();
  return (
    <View style={[styles.container, { backgroundColor: colors.pageBg }]}>
      <Text>LoginScreen</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
});
