import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '@/hooks/useTheme';

export function HomeScreen() {
  const { colors } = useTheme();
  return (
    <View style={[styles.container, { backgroundColor: colors.pageBg }]}>
      <Text>HomeScreen</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
});
